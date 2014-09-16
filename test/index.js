var queue = require('../queue')()
var test = require('tape')

test(function(t) {
  var arg1 = {}
  var arg2 = {}
  var step = 0

  t.plan(7)

  queue(step1, arg1, arg2, step2)
  queue(step3, step4)

  function step1(argA, argB, done) {
    t.equal(argA, arg1)
    t.equal(argB, arg2)

    setTimeout(function() {
      t.equal(++step, 1)
      done(arg2)
    }, 10)
  }

  function step2(arg) {
    t.equal(arg, arg2)
    t.equal(++step, 2)
  }

  function step3(done) {
    t.equal(++step, 3)
    done()
  }

  function step4() {
    t.equal(++step, 4)
    t.end()
  }
})
