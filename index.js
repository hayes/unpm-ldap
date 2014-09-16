var format = require('util').format
  , ldap = require('ldapjs')
  , fs = require('fs')

module.exports = setup

function setup(unpm) {
  if(unpm.config.ldap.cacertfile) {
    unpm.config.ldap.client.tlsOptions = {
        ca: [fs.readFileSync(unpm.config.ldap.cacertfile)]
    }
  }

  var options = Object.create(unpm.config.ldap.client)

  options.maxConnections = unpm.config.ldap.maxConnections

  var client = ldap.createClient(options)

  return {
      find: find
    , create: create
    , update: update
    , auth: auth
  }

  function find(username, done) {
    done(null, {name: username})
  }

  function create(username, data, done) {
    throw new Error('should never be called')
  }

  function update(old, data, done) {
    find(old.name, done)
  }

  function auth(username, password, done) {
    queue(search, username, function(err, data) {
      if(err || !data) {
        return done(err)
      }

      queue(try_auth, data, done)
    })

    function try_auth(data, done) {
      var user_client = ldap.createClient(base_options)

      client.bind(data.dn, password, got_user)

      function got_user(err) {
        user_client.unbind(function() {
          if(err) {
            return done(err)
          }

          done(null, {user: username})
        })
      }
    }
  }

  function search(username, done) {
    var options = {
        scope: 'sub'
      , filter: format(unpm.config.ldap.filter, username)
    }

    var results = []

    client.search(unpm.config.ldap.base, options, collect_results)

    function collect_results(err, res) {
      if(err) {
        return done(err)
      }

      res.on('searchEntry', results.push.bind(results))
      res.on('error', done)
      res.on('end', end)
    }

    function end() {
      if(results.length > 1) {
        return done(new Error('too many results'))
      }

      if(!results.length) {
        return done(null)
      }

      done(null, results[0])
    }
  }
}

var ldap_queue = []

function queue(action) {
  var args = [].slice.call(arguments, 1)
  var callback = args.pop()

  args.push(done)
  ldap_queue.push(run)

  if(ldap_queue.length === 1) {
    run()
  }

  function run() {
    action.apply(null, args)
  }

  function done() {
    callback.apply(this, arguments)
    ldap_queue.shift()

    if(ldap_queue.length) {
      ldap_queue[0]()
    }
  }
}
