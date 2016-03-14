var LdapAuth = require('ldapauth-fork')
var util = require('util')
var fs = require('fs')

module.exports = setup

function setup (options) {
  return function (unpm) {
    options = util._extend({}, options)

    if (options.cacertfile) {
      options.tlsOptions = util._extend({}, options.tlsOptions)
      options.tlsOptions.ca = [fs.readFileSync(options.cacertfile)]
      delete options.cacertfile
    }

    var ldap = new LdapAuth(options)

    return {
      find: find,
      create: create,
      update: update,
      auth: auth,
      close: ldap.close.bind(ldap)
    }

    function find (username, done) {
      done(null, {name: username})
    }

    function create (username, data, done) {
      throw new Error('should never be called')
    }

    function update (old, data, done) {
      find(old.name, done)
    }

    function auth (username, password, done) {
      ldap.authenticate(username, password, function (err, user) {
        if (!err) return done(err, user)
        // Invalid credentials / user not found are not errors but login failures
        // These condition are taken from https://github.com/vesse/passport-ldapauth/blob/master/lib/passport-ldapauth/strategy.js#L160
        if (
          err.name === 'InvalidCredentialsError' ||
          err.name === 'NoSuchObjectError' ||
          (typeof err === 'string' && err.match(/no such user/i)) ||
          (err.name === 'ConstraintViolationError')
        ) {
          return done(null, null)
        }

        return done(err)
      })
    }
  }
}
