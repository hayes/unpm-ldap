module.exports = function() {
  var queue = []

  return add

  function add(action) {
    var args = [].slice.call(arguments, 1)
    var callback = args.pop()

    args.push(done)
    queue.push(run)

    if(queue.length === 1) {
      run()
    }

    function run() {
      action.apply(null, args)
    }

    function done() {
      callback.apply(this, arguments)
      queue.shift()

      if(queue.length) {
        queue[0]()
      }
    }
  }
}
