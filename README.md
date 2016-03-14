an ldap backed user model for unpm

## Usage

```javascript
var UNPM = require('unpm')
var ldapAuth = require('unpm-ldap')
var unpm = new UNPM({
  User: ldapAuth({
    url: 'ldap://localhost:8321',
    searchBase: 'ou=example-org',
    searchFilter: '(uid={{username}})'
  })
})
```

## Options
options are passed to [ldapauth-fork](https://github.com/vesse/node-ldapauth-fork).

* #### url (required)
  eg. 'ldaps://ldap.example.com:663'

* #### bindDn (optional)
  eg. 'uid=myapp,ou=users,o=example.com'.

* #### bindCredentials (required when bindDn is set)
  Password for bindDn

* #### bindProperty (optional)
  defaults to  'dn'. Property of user to bind against client eg. 'name', 'email'

* #### searchBase (required)
  The base DN from which to search for users by username. eg. 'ou=users,o=example.com'

* #### searchScope (optional)
  Optional, default 'sub'. Scope of the search, one of 'base', 'one', or 'sub'.

* #### searchFilter (required)
  LDAP search filter with which to find a user by username, e.g. '(uid={{username}})'. Use the literal '{{username}}' to have the given username be interpolated in for the LDAP search.

* #### searchAttributes (optional)
  default all. Array of attributes to fetch from LDAP server.

* #### groupDnProperty (optional)
  default 'dn'. The property of user object to use in '{{dn}}' interpolation of groupSearchFilter.

* #### groupSearchBase (optional)
  The base DN from which to search for groups. If defined, also groupSearchFilter must be defined for the search to work.

* #### groupSearchScope (optional)
  default 'sub'.

* #### groupSearchFilter (optional)
  LDAP search filter for groups. The following literals are interpolated from the found user object: '{{dn}}' the property configured with groupDnProperty.

* #### groupSearchAttributes (optional)
  default all. Array of attributes to fetch from LDAP server.

* #### log4js (optional)
  The require'd log4js module to use for logging. If given this will result in TRACE-level logging for ldapauth.

* #### verbose (optional)
  default false. If `log4js` is also given, this will add TRACE-level logging for ldapjs (quite verbose).

* #### cache (optional)
  default false. If true, then up to 100 credentials at a time will be cached for 5 minutes.

* #### timeout (optional)
  default Infinity. How long the client should let operations live for before timing out.

* #### connectTimeout (optional)
  Optional, default is up to the OS. How long the client should wait before timing out on TCP connections.

* #### tlsOptions (optional)
  Additional options passed to the TLS connection layer when connecting via ldaps://. See http://nodejs.org/api/tls.html#tls_tls_connect_options_calback for available options

* #### maxConnections (optional)
  Whether or not to enable connection pooling, and if so, how many to maintain.

* #### checkInterval (optional)
  How often to schedule health checks for the connection pool.

* #### maxIdleTime (optional)
  How long a client can be idle before health-checking the connection (subject to the checkInterval frequency)

* #### includeRaw (optional)
  default false. Set to true to add property '_raw' containing the original buffers to the returned user object. Useful when you need to handle binary attributes

* #### reconnect (optional)
  node-ldap reconnect option.
