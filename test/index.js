var ldapServer = require('./ldap-server.js')()
var ldapAuth = require('../index.js')
var test = require('tape')

ldapServer.listen(8321)

var client = ldapAuth({
  url: 'ldap://localhost:8321',
  // bindDn: 'cn=root',
  // bindCredentials: 'secret',
  searchBase: 'ou=example-org',
  searchFilter: '(uid={{username}})'
})()

test('auth with valid credentials succeeds', function (t) {
  t.plan(2)
  client.auth('user1', 'hunter2', function (err, user) {
    t.notOk(err, 'should not error')
    t.equal(user.email, 'user1@example.org')
    t.end()
  })
})

test('auth with invalid credentials fails', function (t) {
  t.plan(2)
  client.auth('user1', 'hunter2!', function (err, user) {
    t.notOk(err, 'should not error')
    t.notOk(user, 'user should not be found')
    t.end()
  })
})

test('cleanup', function (t) {
  ldapServer.close()
  client.close()
  t.end()
})
