import _react, { Children, Component, createElement } from 'react'

var commonjsGlobal =
  typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
      ? global
      : typeof self !== 'undefined'
        ? self
        : {}

function unwrapExports(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default')
    ? x['default']
    : x
}

function createCommonjsModule(fn, module) {
  return (module = { exports: {} }), fn(module, module.exports), module.exports
}

var runtime = createCommonjsModule(function(module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  !(function(global) {
    var Op = Object.prototype
    var hasOwn = Op.hasOwnProperty
    var undefined // More compressible than void 0.
    var $Symbol = typeof Symbol === 'function' ? Symbol : {}
    var iteratorSymbol = $Symbol.iterator || '@@iterator'
    var asyncIteratorSymbol = $Symbol.asyncIterator || '@@asyncIterator'
    var toStringTagSymbol = $Symbol.toStringTag || '@@toStringTag'
    var runtime = global.regeneratorRuntime
    if (runtime) {
      {
        // If regeneratorRuntime is defined globally and we're in a module,
        // make the exports object identical to regeneratorRuntime.
        module.exports = runtime
      }
      // Don't bother evaluating the rest of this file if the runtime was
      // already defined globally.
      return
    }

    // Define the runtime globally (as expected by generated code) as either
    // module.exports (if we're in a module) or a new, empty object.
    runtime = global.regeneratorRuntime = module.exports

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator =
        outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator
      var generator = Object.create(protoGenerator.prototype)
      var context = new Context(tryLocsList || [])

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context)

      return generator
    }
    runtime.wrap = wrap

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: 'normal', arg: fn.call(obj, arg) }
      } catch (err) {
        return { type: 'throw', arg: err }
      }
    }

    var GenStateSuspendedStart = 'suspendedStart'
    var GenStateSuspendedYield = 'suspendedYield'
    var GenStateExecuting = 'executing'
    var GenStateCompleted = 'completed'

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {}

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {}
    IteratorPrototype[iteratorSymbol] = function() {
      return this
    }

    var getProto = Object.getPrototypeOf
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])))
    if (
      NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)
    ) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype
    }

    var Gp = (GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(
      IteratorPrototype
    ))
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype
    GeneratorFunctionPrototype.constructor = GeneratorFunction
    GeneratorFunctionPrototype[
      toStringTagSymbol
    ] = GeneratorFunction.displayName = 'GeneratorFunction'

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ;['next', 'throw', 'return'].forEach(function(method) {
        prototype[method] = function(arg) {
          return this._invoke(method, arg)
        }
      })
    }

    runtime.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === 'function' && genFun.constructor
      return ctor
        ? ctor === GeneratorFunction ||
            // For the native GeneratorFunction constructor, the best we can
            // do is to check its .name property.
            (ctor.displayName || ctor.name) === 'GeneratorFunction'
        : false
    }

    runtime.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype)
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype
        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = 'GeneratorFunction'
        }
      }
      genFun.prototype = Object.create(Gp)
      return genFun
    }

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    runtime.awrap = function(arg) {
      return { __await: arg }
    }

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg)
        if (record.type === 'throw') {
          reject(record.arg)
        } else {
          var result = record.arg
          var value = result.value
          if (
            value &&
            typeof value === 'object' &&
            hasOwn.call(value, '__await')
          ) {
            return Promise.resolve(value.__await).then(
              function(value) {
                invoke('next', value, resolve, reject)
              },
              function(err) {
                invoke('throw', err, resolve, reject)
              }
            )
          }

          return Promise.resolve(value).then(
            function(unwrapped) {
              // When a yielded Promise is resolved, its final value becomes
              // the .value of the Promise<{value,done}> result for the
              // current iteration.
              result.value = unwrapped
              resolve(result)
            },
            function(error) {
              // If a rejected Promise was yielded, throw the rejection back
              // into the async generator function so it can be handled there.
              return invoke('throw', error, resolve, reject)
            }
          )
        }
      }

      var previousPromise

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function(resolve, reject) {
            invoke(method, arg, resolve, reject)
          })
        }

        return (previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise
            ? previousPromise.then(
                callInvokeWithMethodAndArg,
                // Avoid propagating failures to Promises returned by later
                // invocations of the iterator.
                callInvokeWithMethodAndArg
              )
            : callInvokeWithMethodAndArg())
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue
    }

    defineIteratorMethods(AsyncIterator.prototype)
    AsyncIterator.prototype[asyncIteratorSymbol] = function() {
      return this
    }
    runtime.AsyncIterator = AsyncIterator

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    runtime.async = function(innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList))

      return runtime.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next()
          })
    }

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error('Generator is already running')
        }

        if (state === GenStateCompleted) {
          if (method === 'throw') {
            throw arg
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult()
        }

        context.method = method
        context.arg = arg

        while (true) {
          var delegate = context.delegate
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context)
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue
              return delegateResult
            }
          }

          if (context.method === 'next') {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg
          } else if (context.method === 'throw') {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted
              throw context.arg
            }

            context.dispatchException(context.arg)
          } else if (context.method === 'return') {
            context.abrupt('return', context.arg)
          }

          state = GenStateExecuting

          var record = tryCatch(innerFn, self, context)
          if (record.type === 'normal') {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done ? GenStateCompleted : GenStateSuspendedYield

            if (record.arg === ContinueSentinel) {
              continue
            }

            return {
              value: record.arg,
              done: context.done,
            }
          } else if (record.type === 'throw') {
            state = GenStateCompleted
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = 'throw'
            context.arg = record.arg
          }
        }
      }
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method]
      if (method === undefined) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null

        if (context.method === 'throw') {
          if (delegate.iterator.return) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = 'return'
            context.arg = undefined
            maybeInvokeDelegate(delegate, context)

            if (context.method === 'throw') {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel
            }
          }

          context.method = 'throw'
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method"
          )
        }

        return ContinueSentinel
      }

      var record = tryCatch(method, delegate.iterator, context.arg)

      if (record.type === 'throw') {
        context.method = 'throw'
        context.arg = record.arg
        context.delegate = null
        return ContinueSentinel
      }

      var info = record.arg

      if (!info) {
        context.method = 'throw'
        context.arg = new TypeError('iterator result is not an object')
        context.delegate = null
        return ContinueSentinel
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== 'return') {
          context.method = 'next'
          context.arg = undefined
        }
      } else {
        // Re-yield the result returned by the delegate method.
        return info
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null
      return ContinueSentinel
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp)

    Gp[toStringTagSymbol] = 'Generator'

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this
    }

    Gp.toString = function() {
      return '[object Generator]'
    }

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] }

      if (1 in locs) {
        entry.catchLoc = locs[1]
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2]
        entry.afterLoc = locs[3]
      }

      this.tryEntries.push(entry)
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {}
      record.type = 'normal'
      delete record.arg
      entry.completion = record
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: 'root' }]
      tryLocsList.forEach(pushTryEntry, this)
      this.reset(true)
    }

    runtime.keys = function(object) {
      var keys = []
      for (var key in object) {
        keys.push(key)
      }
      keys.reverse()

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop()
          if (key in object) {
            next.value = key
            next.done = false
            return next
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true
        return next
      }
    }

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol]
        if (iteratorMethod) {
          return iteratorMethod.call(iterable)
        }

        if (typeof iterable.next === 'function') {
          return iterable
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
            next = function next() {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next.value = iterable[i]
                  next.done = false
                  return next
                }
              }

              next.value = undefined
              next.done = true

              return next
            }

          return (next.next = next)
        }
      }

      // Return an iterator with no values.
      return { next: doneResult }
    }
    runtime.values = values

    function doneResult() {
      return { value: undefined, done: true }
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0
        this.next = 0
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined
        this.done = false
        this.delegate = null

        this.method = 'next'
        this.arg = undefined

        this.tryEntries.forEach(resetTryEntry)

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (
              name.charAt(0) === 't' &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))
            ) {
              this[name] = undefined
            }
          }
        }
      },

      stop: function() {
        this.done = true

        var rootEntry = this.tryEntries[0]
        var rootRecord = rootEntry.completion
        if (rootRecord.type === 'throw') {
          throw rootRecord.arg
        }

        return this.rval
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception
        }

        var context = this
        function handle(loc, caught) {
          record.type = 'throw'
          record.arg = exception
          context.next = loc

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = 'next'
            context.arg = undefined
          }

          return !!caught
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i]
          var record = entry.completion

          if (entry.tryLoc === 'root') {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle('end')
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, 'catchLoc')
            var hasFinally = hasOwn.call(entry, 'finallyLoc')

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true)
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc)
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true)
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc)
              }
            } else {
              throw new Error('try statement without catch or finally')
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i]
          if (
            entry.tryLoc <= this.prev &&
            hasOwn.call(entry, 'finallyLoc') &&
            this.prev < entry.finallyLoc
          ) {
            var finallyEntry = entry
            break
          }
        }

        if (
          finallyEntry &&
          (type === 'break' || type === 'continue') &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc
        ) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null
        }

        var record = finallyEntry ? finallyEntry.completion : {}
        record.type = type
        record.arg = arg

        if (finallyEntry) {
          this.method = 'next'
          this.next = finallyEntry.finallyLoc
          return ContinueSentinel
        }

        return this.complete(record)
      },

      complete: function(record, afterLoc) {
        if (record.type === 'throw') {
          throw record.arg
        }

        if (record.type === 'break' || record.type === 'continue') {
          this.next = record.arg
        } else if (record.type === 'return') {
          this.rval = this.arg = record.arg
          this.method = 'return'
          this.next = 'end'
        } else if (record.type === 'normal' && afterLoc) {
          this.next = afterLoc
        }

        return ContinueSentinel
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i]
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc)
            resetTryEntry(entry)
            return ContinueSentinel
          }
        }
      },

      catch: function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i]
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion
            if (record.type === 'throw') {
              var thrown = record.arg
              resetTryEntry(entry)
            }
            return thrown
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error('illegal catch attempt')
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc,
        }

        if (this.method === 'next') {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined
        }

        return ContinueSentinel
      },
    }
  })(
    // In sloppy mode, unbound `this` refers to the global object, fallback to
    // Function constructor if we're in global strict mode. That is sadly a form
    // of indirect eval which violates Content Security Policy.
    (function() {
      return this || (typeof self === 'object' && self)
    })() || Function('return this')()
  )
})

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  (function() {
    return this || (typeof self === 'object' && self)
  })() || Function('return this')()

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime =
  g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf('regeneratorRuntime') >= 0

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined

var runtimeModule = runtime

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime
  } catch (e) {
    g.regeneratorRuntime = undefined
  }
}

var regenerator = runtimeModule

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg)
    var value = info.value
  } catch (error) {
    reject(error)
    return
  }

  if (info.done) {
    resolve(value)
  } else {
    Promise.resolve(value).then(_next, _throw)
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args)

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value)
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err)
      }

      _next(undefined)
    })
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    })
  } else {
    obj[key] = value
  }

  return obj
}

function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }

      return target
    }

  return _extends.apply(this, arguments)
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype)
  subClass.prototype.constructor = subClass
  subClass.__proto__ = superClass
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  }

  return self
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function componentWillMount() {
  // Call this.constructor.gDSFP to support sub-classes.
  var state = this.constructor.getDerivedStateFromProps(this.props, this.state)
  if (state !== null && state !== undefined) {
    this.setState(state)
  }
}

function componentWillReceiveProps(nextProps) {
  // Call this.constructor.gDSFP to support sub-classes.
  // Use the setState() updater to ensure state isn't stale in certain edge cases.
  function updater(prevState) {
    var state = this.constructor.getDerivedStateFromProps(nextProps, prevState)
    return state !== null && state !== undefined ? state : null
  }
  // Binding "this" is important for shallow renderer support.
  this.setState(updater.bind(this))
}

function componentWillUpdate(nextProps, nextState) {
  try {
    var prevProps = this.props
    var prevState = this.state
    this.props = nextProps
    this.state = nextState
    this.__reactInternalSnapshotFlag = true
    this.__reactInternalSnapshot = this.getSnapshotBeforeUpdate(
      prevProps,
      prevState
    )
  } finally {
    this.props = prevProps
    this.state = prevState
  }
}

// React may warn about cWM/cWRP/cWU methods being deprecated.
// Add a flag to suppress these warnings for this special case.
componentWillMount.__suppressDeprecationWarning = true
componentWillReceiveProps.__suppressDeprecationWarning = true
componentWillUpdate.__suppressDeprecationWarning = true

function polyfill(Component$$1) {
  var prototype = Component$$1.prototype

  if (!prototype || !prototype.isReactComponent) {
    throw new Error('Can only polyfill class components')
  }

  if (
    typeof Component$$1.getDerivedStateFromProps !== 'function' &&
    typeof prototype.getSnapshotBeforeUpdate !== 'function'
  ) {
    return Component$$1
  }

  // If new component APIs are defined, "unsafe" lifecycles won't be called.
  // Error if any of these lifecycles are present,
  // Because they would work differently between older and newer (16.3+) versions of React.
  var foundWillMountName = null
  var foundWillReceivePropsName = null
  var foundWillUpdateName = null
  if (typeof prototype.componentWillMount === 'function') {
    foundWillMountName = 'componentWillMount'
  } else if (typeof prototype.UNSAFE_componentWillMount === 'function') {
    foundWillMountName = 'UNSAFE_componentWillMount'
  }
  if (typeof prototype.componentWillReceiveProps === 'function') {
    foundWillReceivePropsName = 'componentWillReceiveProps'
  } else if (typeof prototype.UNSAFE_componentWillReceiveProps === 'function') {
    foundWillReceivePropsName = 'UNSAFE_componentWillReceiveProps'
  }
  if (typeof prototype.componentWillUpdate === 'function') {
    foundWillUpdateName = 'componentWillUpdate'
  } else if (typeof prototype.UNSAFE_componentWillUpdate === 'function') {
    foundWillUpdateName = 'UNSAFE_componentWillUpdate'
  }
  if (
    foundWillMountName !== null ||
    foundWillReceivePropsName !== null ||
    foundWillUpdateName !== null
  ) {
    var componentName = Component$$1.displayName || Component$$1.name
    var newApiName =
      typeof Component$$1.getDerivedStateFromProps === 'function'
        ? 'getDerivedStateFromProps()'
        : 'getSnapshotBeforeUpdate()'

    throw Error(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
        componentName +
        ' uses ' +
        newApiName +
        ' but also contains the following legacy lifecycles:' +
        (foundWillMountName !== null ? '\n  ' + foundWillMountName : '') +
        (foundWillReceivePropsName !== null
          ? '\n  ' + foundWillReceivePropsName
          : '') +
        (foundWillUpdateName !== null ? '\n  ' + foundWillUpdateName : '') +
        '\n\nThe above lifecycles should be removed. Learn more about this warning here:\n' +
        'https://fb.me/react-async-component-lifecycle-hooks'
    )
  }

  // React <= 16.2 does not support static getDerivedStateFromProps.
  // As a workaround, use cWM and cWRP to invoke the new static lifecycle.
  // Newer versions of React will ignore these lifecycles if gDSFP exists.
  if (typeof Component$$1.getDerivedStateFromProps === 'function') {
    prototype.componentWillMount = componentWillMount
    prototype.componentWillReceiveProps = componentWillReceiveProps
  }

  // React <= 16.2 does not support getSnapshotBeforeUpdate.
  // As a workaround, use cWU to invoke the new lifecycle.
  // Newer versions of React will ignore that lifecycle if gSBU exists.
  if (typeof prototype.getSnapshotBeforeUpdate === 'function') {
    if (typeof prototype.componentDidUpdate !== 'function') {
      throw new Error(
        'Cannot polyfill getSnapshotBeforeUpdate() for components that do not define componentDidUpdate() on the prototype'
      )
    }

    prototype.componentWillUpdate = componentWillUpdate

    var componentDidUpdate = prototype.componentDidUpdate

    prototype.componentDidUpdate = function componentDidUpdatePolyfill(
      prevProps,
      prevState,
      maybeSnapshot
    ) {
      // 16.3+ will not execute our will-update method;
      // It will pass a snapshot value to did-update though.
      // Older versions will require our polyfilled will-update value.
      // We need to handle both cases, but can't just check for the presence of "maybeSnapshot",
      // Because for <= 15.x versions this might be a "prevContext" object.
      // We also can't just check "__reactInternalSnapshot",
      // Because get-snapshot might return a falsy value.
      // So check for the explicit __reactInternalSnapshotFlag flag to determine behavior.
      var snapshot = this.__reactInternalSnapshotFlag
        ? this.__reactInternalSnapshot
        : maybeSnapshot

      componentDidUpdate.call(this, prevProps, prevState, snapshot)
    }
  }

  return Component$$1
}

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols
var hasOwnProperty = Object.prototype.hasOwnProperty
var propIsEnumerable = Object.prototype.propertyIsEnumerable

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined')
  }

  return Object(val)
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false
    }

    // Detect buggy property enumeration order in older V8 versions.

    // https://bugs.chromium.org/p/v8/issues/detail?id=4118
    var test1 = new String('abc') // eslint-disable-line no-new-wrappers
    test1[5] = 'de'
    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false
    }

    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
    var test2 = {}
    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i
    }
    var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
      return test2[n]
    })
    if (order2.join('') !== '0123456789') {
      return false
    }

    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
    var test3 = {}
    'abcdefghijklmnopqrst'.split('').forEach(function(letter) {
      test3[letter] = letter
    })
    if (
      Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst'
    ) {
      return false
    }

    return true
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false
  }
}

var objectAssign = shouldUseNative()
  ? Object.assign
  : function(target, source) {
      var from
      var to = toObject(target)
      var symbols

      for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s])

        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key]
          }
        }

        if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from)
          for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
              to[symbols[i]] = from[symbols[i]]
            }
          }
        }
      }

      return to
    }

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'

var ReactPropTypesSecret_1 = ReactPropTypesSecret

var printWarning = function() {}

if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1
  var loggedTypeFailures = {}

  printWarning = function(text) {
    var message = 'Warning: ' + text
    if (typeof console !== 'undefined') {
      console.error(message)
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message)
    } catch (x) {}
  }
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') +
                ': ' +
                location +
                ' type `' +
                typeSpecName +
                '` is invalid; ' +
                'it must be a function, usually from the `prop-types` package, but received `' +
                typeof typeSpecs[typeSpecName] +
                '`.'
            )
            err.name = 'Invariant Violation'
            throw err
          }
          error = typeSpecs[typeSpecName](
            values,
            typeSpecName,
            componentName,
            location,
            null,
            ReactPropTypesSecret$1
          )
        } catch (ex) {
          error = ex
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') +
              ': type specification of ' +
              location +
              ' `' +
              typeSpecName +
              '` is invalid; the type checker ' +
              'function must return `null` or an `Error` but returned a ' +
              typeof error +
              '. ' +
              'You may have forgotten to pass an argument to the type checker ' +
              'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
              'shape all require an argument).'
          )
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true

          var stack = getStack ? getStack() : ''

          printWarning(
            'Failed ' +
              location +
              ' type: ' +
              error.message +
              (stack != null ? stack : '')
          )
        }
      }
    }
  }
}

var checkPropTypes_1 = checkPropTypes

var printWarning$1 = function() {}

if (process.env.NODE_ENV !== 'production') {
  printWarning$1 = function(text) {
    var message = 'Warning: ' + text
    if (typeof console !== 'undefined') {
      console.error(message)
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message)
    } catch (x) {}
  }
}

function emptyFunctionThatReturnsNull() {
  return null
}

var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator
  var FAUX_ITERATOR_SYMBOL = '@@iterator' // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn =
      maybeIterable &&
      ((ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL]) ||
        maybeIterable[FAUX_ITERATOR_SYMBOL])
    if (typeof iteratorFn === 'function') {
      return iteratorFn
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>'

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  }

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message
    this.stack = ''
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {}
      var manualPropTypeWarningCount = 0
    }
    function checkType(
      isRequired,
      props,
      propName,
      componentName,
      location,
      propFullName,
      secret
    ) {
      componentName = componentName || ANONYMOUS
      propFullName = propFullName || propName

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
              'Use `PropTypes.checkPropTypes()` to call them. ' +
              'Read more at http://fb.me/use-check-prop-types'
          )
          err.name = 'Invariant Violation'
          throw err
        } else if (
          process.env.NODE_ENV !== 'production' &&
          typeof console !== 'undefined'
        ) {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning$1(
              'You are manually calling a React.PropTypes validation ' +
                'function for the `' +
                propFullName +
                '` prop on `' +
                componentName +
                '`. This is deprecated ' +
                'and will throw in the standalone `prop-types` package. ' +
                'You may be seeing this warning due to a third-party PropTypes ' +
                'library. See https://fb.me/react-warning-dont-call-proptypes ' +
                'for details.'
            )
            manualPropTypeCallCache[cacheKey] = true
            manualPropTypeWarningCount++
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError(
              'The ' +
                location +
                ' `' +
                propFullName +
                '` is marked as required ' +
                ('in `' + componentName + '`, but its value is `null`.')
            )
          }
          return new PropTypeError(
            'The ' +
              location +
              ' `' +
              propFullName +
              '` is marked as required in ' +
              ('`' + componentName + '`, but its value is `undefined`.')
          )
        }
        return null
      } else {
        return validate(props, propName, componentName, location, propFullName)
      }
    }

    var chainedCheckType = checkType.bind(null, false)
    chainedCheckType.isRequired = checkType.bind(null, true)

    return chainedCheckType
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(
      props,
      propName,
      componentName,
      location,
      propFullName,
      secret
    ) {
      var propValue = props[propName]
      var propType = getPropType(propValue)
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue)

        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' +
              preciseType +
              '` supplied to `' +
              componentName +
              '`, expected ') +
            ('`' + expectedType + '`.')
        )
      }
      return null
    }
    return createChainableTypeChecker(validate)
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull)
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError(
          'Property `' +
            propFullName +
            '` of component `' +
            componentName +
            '` has invalid PropType notation inside arrayOf.'
        )
      }
      var propValue = props[propName]
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue)
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' +
              propType +
              '` supplied to `' +
              componentName +
              '`, expected an array.')
        )
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(
          propValue,
          i,
          componentName,
          location,
          propFullName + '[' + i + ']',
          ReactPropTypesSecret_1
        )
        if (error instanceof Error) {
          return error
        }
      }
      return null
    }
    return createChainableTypeChecker(validate)
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName]
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue)
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' +
              propType +
              '` supplied to `' +
              componentName +
              '`, expected a single ReactElement.')
        )
      }
      return null
    }
    return createChainableTypeChecker(validate)
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS
        var actualClassName = getClassName(props[propName])
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' +
              actualClassName +
              '` supplied to `' +
              componentName +
              '`, expected ') +
            ('instance of `' + expectedClassName + '`.')
        )
      }
      return null
    }
    return createChainableTypeChecker(validate)
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production'
        ? printWarning$1(
            'Invalid argument supplied to oneOf, expected an instance of array.'
          )
        : void 0
      return emptyFunctionThatReturnsNull
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName]
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null
        }
      }

      var valuesString = JSON.stringify(expectedValues)
      return new PropTypeError(
        'Invalid ' +
          location +
          ' `' +
          propFullName +
          '` of value `' +
          propValue +
          '` ' +
          ('supplied to `' +
            componentName +
            '`, expected one of ' +
            valuesString +
            '.')
      )
    }
    return createChainableTypeChecker(validate)
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError(
          'Property `' +
            propFullName +
            '` of component `' +
            componentName +
            '` has invalid PropType notation inside objectOf.'
        )
      }
      var propValue = props[propName]
      var propType = getPropType(propValue)
      if (propType !== 'object') {
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' +
              propType +
              '` supplied to `' +
              componentName +
              '`, expected an object.')
        )
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(
            propValue,
            key,
            componentName,
            location,
            propFullName + '.' + key,
            ReactPropTypesSecret_1
          )
          if (error instanceof Error) {
            return error
          }
        }
      }
      return null
    }
    return createChainableTypeChecker(validate)
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production'
        ? printWarning$1(
            'Invalid argument supplied to oneOfType, expected an instance of array.'
          )
        : void 0
      return emptyFunctionThatReturnsNull
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i]
      if (typeof checker !== 'function') {
        printWarning$1(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
            'received ' +
            getPostfixForTypeWarning(checker) +
            ' at index ' +
            i +
            '.'
        )
        return emptyFunctionThatReturnsNull
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i]
        if (
          checker(
            props,
            propName,
            componentName,
            location,
            propFullName,
            ReactPropTypesSecret_1
          ) == null
        ) {
          return null
        }
      }

      return new PropTypeError(
        'Invalid ' +
          location +
          ' `' +
          propFullName +
          '` supplied to ' +
          ('`' + componentName + '`.')
      )
    }
    return createChainableTypeChecker(validate)
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` supplied to ' +
            ('`' + componentName + '`, expected a ReactNode.')
        )
      }
      return null
    }
    return createChainableTypeChecker(validate)
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName]
      var propType = getPropType(propValue)
      if (propType !== 'object') {
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type `' +
            propType +
            '` ' +
            ('supplied to `' + componentName + '`, expected `object`.')
        )
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key]
        if (!checker) {
          continue
        }
        var error = checker(
          propValue,
          key,
          componentName,
          location,
          propFullName + '.' + key,
          ReactPropTypesSecret_1
        )
        if (error) {
          return error
        }
      }
      return null
    }
    return createChainableTypeChecker(validate)
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName]
      var propType = getPropType(propValue)
      if (propType !== 'object') {
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type `' +
            propType +
            '` ' +
            ('supplied to `' + componentName + '`, expected `object`.')
        )
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = objectAssign({}, props[propName], shapeTypes)
      for (var key in allKeys) {
        var checker = shapeTypes[key]
        if (!checker) {
          return new PropTypeError(
            'Invalid ' +
              location +
              ' `' +
              propFullName +
              '` key `' +
              key +
              '` supplied to `' +
              componentName +
              '`.' +
              '\nBad object: ' +
              JSON.stringify(props[propName], null, '  ') +
              '\nValid keys: ' +
              JSON.stringify(Object.keys(shapeTypes), null, '  ')
          )
        }
        var error = checker(
          propValue,
          key,
          componentName,
          location,
          propFullName + '.' + key,
          ReactPropTypesSecret_1
        )
        if (error) {
          return error
        }
      }
      return null
    }

    return createChainableTypeChecker(validate)
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true
      case 'boolean':
        return !propValue
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode)
        }
        if (propValue === null || isValidElement(propValue)) {
          return true
        }

        var iteratorFn = getIteratorFn(propValue)
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue)
          var step
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value
              if (entry) {
                if (!isNode(entry[1])) {
                  return false
                }
              }
            }
          }
        } else {
          return false
        }

        return true
      default:
        return false
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true
    }

    return false
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue
    if (Array.isArray(propValue)) {
      return 'array'
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object'
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol'
    }
    return propType
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue
    }
    var propType = getPropType(propValue)
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date'
      } else if (propValue instanceof RegExp) {
        return 'regexp'
      }
    }
    return propType
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value)
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type
      default:
        return type
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS
    }
    return propValue.constructor.name
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1
  ReactPropTypes.PropTypes = ReactPropTypes

  return ReactPropTypes
}

function emptyFunction() {}

var factoryWithThrowingShims = function() {
  function shim(
    props,
    propName,
    componentName,
    location,
    propFullName,
    secret
  ) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
        'Use PropTypes.checkPropTypes() to call them. ' +
        'Read more at http://fb.me/use-check-prop-types'
    )
    err.name = 'Invariant Violation'
    throw err
  }
  shim.isRequired = shim
  function getShim() {
    return shim
  } // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,
  }

  ReactPropTypes.checkPropTypes = emptyFunction
  ReactPropTypes.PropTypes = ReactPropTypes

  return ReactPropTypes
}

var propTypes = createCommonjsModule(function(module) {
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  if (process.env.NODE_ENV !== 'production') {
    var REACT_ELEMENT_TYPE =
      (typeof Symbol === 'function' &&
        Symbol.for &&
        Symbol.for('react.element')) ||
      0xeac7

    var isValidElement = function(object) {
      return (
        typeof object === 'object' &&
        object !== null &&
        object.$$typeof === REACT_ELEMENT_TYPE
      )
    }

    // By explicitly using `prop-types` you are opting into new development behavior.
    // http://fb.me/prop-types-in-prod
    var throwOnDirectAccess = true
    module.exports = factoryWithTypeCheckers(
      isValidElement,
      throwOnDirectAccess
    )
  } else {
    // By explicitly using `prop-types` you are opting into new production behavior.
    // http://fb.me/prop-types-in-prod
    module.exports = factoryWithThrowingShims()
  }
})

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var NODE_ENV = process.env.NODE_ENV

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument')
    }
  }

  if (!condition) {
    var error
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
          'for the full error message and additional helpful warnings.'
      )
    } else {
      var args = [a, b, c, d, e, f]
      var argIndex = 0
      error = new Error(
        format.replace(/%s/g, function() {
          return args[argIndex++]
        })
      )
      error.name = 'Invariant Violation'
    }

    error.framesToPop = 1 // we don't care about invariant's own frame
    throw error
  }
}

var invariant_1 = invariant

/* eslint no-return-assign: 0 */
var requestToApi = function requestToApi(args) {
  var body = args.body,
    cancel = args.cancel,
    headers = args.headers,
    method = args.method,
    _args$onProgress = args.onProgress,
    onProgress =
      _args$onProgress === void 0
        ? function() {
            return null
          }
        : _args$onProgress,
    onTimeout = args.onTimeout,
    params = args.params,
    onIntercept = args.onIntercept,
    url = args.url,
    _args$timeout = args.timeout,
    timeout = _args$timeout === void 0 ? 0 : _args$timeout,
    disableDefaultHeaders = args.disableDefaultHeaders
  var defaultHeaders = {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type':
      method === 'FORM_DATA' ? 'multipart/form-data' : 'application/json',
  }
  var formData = new FormData()
  var route = url
  var interceptedResult = null

  var handleError =
    /*#__PURE__*/
    (function() {
      var _ref = _asyncToGenerator(
        /*#__PURE__*/
        regenerator.mark(function _callee(error, request, reject) {
          return regenerator.wrap(
            function _callee$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    reject({
                      response: request.response,
                      request: request,
                    })

                  case 1:
                  case 'end':
                    return _context.stop()
                }
              }
            },
            _callee,
            this
          )
        })
      )

      return function handleError(_x, _x2, _x3) {
        return _ref.apply(this, arguments)
      }
    })()

  var handleTimeout = function handleTimeout(request, reject) {
    request.abort()
    if (onTimeout) onTimeout()
    reject('Your request took more than ' + timeout + 'ms to resolve.')
  }

  var returnData =
    /*#__PURE__*/
    (function() {
      var _ref2 = _asyncToGenerator(
        /*#__PURE__*/
        regenerator.mark(function _callee2(request, resolve, reject, isCancel) {
          var response, isOK, _response

          return regenerator.wrap(
            function _callee2$(_context2) {
              while (1) {
                switch ((_context2.prev = _context2.next)) {
                  case 0:
                    if (isCancel) {
                      response = {
                        data: {
                          cancelled: true,
                        },
                        isOK: true,
                        request: request,
                        status: request.status,
                      }
                      resolve(response)
                    }

                    if (!(request.readyState === 4)) {
                      _context2.next = 20
                      break
                    }

                    isOK = request.status >= 200 && request.status <= 299

                    if (!isOK) {
                      _context2.next = 19
                      break
                    }

                    if (!request.responseText) {
                      _context2.next = 10
                      break
                    }

                    _context2.next = 7
                    return JSON.parse(request.responseText)

                  case 7:
                    _context2.t0 = _context2.sent
                    _context2.next = 11
                    break

                  case 10:
                    _context2.t0 = undefined

                  case 11:
                    _context2.t1 = _context2.t0
                    _context2.t2 = isOK
                    _context2.t3 = request
                    _context2.t4 = request.status
                    _response = {
                      data: _context2.t1,
                      isOK: _context2.t2,
                      request: _context2.t3,
                      status: _context2.t4,
                    }
                    resolve(_response)
                    _context2.next = 20
                    break

                  case 19:
                    if (onIntercept) {
                      interceptedResult = onIntercept({
                        currentParams: args,
                        request: request,
                        status: request.status,
                      })

                      if (interceptedResult) {
                        resolve(
                          requestToApi(
                            _extends({}, interceptedResult, {
                              onIntercept: undefined,
                            })
                          )
                        )
                      } else handleError(request, request, reject)
                    } else handleError(request, request, reject)

                  case 20:
                  case 'end':
                    return _context2.stop()
                }
              }
            },
            _callee2,
            this
          )
        })
      )

      return function returnData(_x4, _x5, _x6, _x7) {
        return _ref2.apply(this, arguments)
      }
    })()

  var setHeaders = function setHeaders(request) {
    if (!disableDefaultHeaders) {
      Object.entries(defaultHeaders).map(function(defaultHeader) {
        return request.setRequestHeader(
          defaultHeader[0],
          String(defaultHeader[1])
        )
      })
    }

    if (headers && Object.keys(headers).length > 0) {
      Object.entries(headers).map(function(header) {
        return request.setRequestHeader(header[0], String(header[1]))
      })
    }
  }

  if (method === 'FORM_DATA' && Object.entries(body).length > 0) {
    Object.entries(body).map(
      // $FlowFixMe
      function(entry) {
        return formData.append(entry[0], entry[1])
      }
    )
  }

  if (params && Object.keys(params).length > 0) {
    Object.entries(params).map(function(param, index) {
      return index === 0
        ? (route = route + '?' + param[0] + '=' + JSON.stringify(param[1]))
        : (route = route + '&' + param[0] + '=' + JSON.stringify(param[1]))
    })
  }

  var sendRequest = function sendRequest() {
    return new Promise(function(resolve, reject) {
      try {
        var request = new XMLHttpRequest()

        if (request.upload) {
          request.upload.onerror = function(error) {
            return handleError(error, request, resolve)
          }

          request.upload.onload = function() {
            return returnData(request, resolve, reject)
          }

          request.upload.onprogress = onProgress

          request.upload.ontimeout = function() {
            return handleTimeout(request, reject)
          }
        }

        request.onerror = function(error) {
          return handleError(error, request, resolve)
        }

        request.onprogress = onProgress

        request.onreadystatechange = function() {
          return returnData(request, resolve, reject)
        }

        request.ontimeout = function() {
          return handleTimeout(request, reject)
        }

        request.open(method === 'FORM_DATA' ? 'POST' : method, route)
        request.timeout = timeout
        setHeaders(request)
        if (cancel) returnData(request, resolve, reject, true)
        request.send(
          method === 'FORM_DATA'
            ? formData
            : method === 'DELETE' ||
              method === 'GET' ||
              method === 'HEAD' ||
              method === 'PUT'
              ? null
              : JSON.stringify(_extends({}, body))
        )
        if (cancel) request.abort()
      } catch (request) {
        handleError(request, request, reject)
      }
    })
  }

  return sendRequest()
}

var key = '__global_unique_id__'

var gud = function() {
  return (commonjsGlobal[key] = (commonjsGlobal[key] || 0) + 1)
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

function makeEmptyFunction(arg) {
  return function() {
    return arg
  }
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction$1 = function emptyFunction() {}

emptyFunction$1.thatReturns = makeEmptyFunction
emptyFunction$1.thatReturnsFalse = makeEmptyFunction(false)
emptyFunction$1.thatReturnsTrue = makeEmptyFunction(true)
emptyFunction$1.thatReturnsNull = makeEmptyFunction(null)
emptyFunction$1.thatReturnsThis = function() {
  return this
}
emptyFunction$1.thatReturnsArgument = function(arg) {
  return arg
}

var emptyFunction_1 = emptyFunction$1

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction_1

if (process.env.NODE_ENV !== 'production') {
  var printWarning$2 = function printWarning(format) {
    for (
      var _len = arguments.length,
        args = Array(_len > 1 ? _len - 1 : 0),
        _key = 1;
      _key < _len;
      _key++
    ) {
      args[_key - 1] = arguments[_key]
    }

    var argIndex = 0
    var message =
      'Warning: ' +
      format.replace(/%s/g, function() {
        return args[argIndex++]
      })
    if (typeof console !== 'undefined') {
      console.error(message)
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message)
    } catch (x) {}
  }

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
          'message argument'
      )
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (
        var _len2 = arguments.length,
          args = Array(_len2 > 2 ? _len2 - 2 : 0),
          _key2 = 2;
        _key2 < _len2;
        _key2++
      ) {
        args[_key2 - 2] = arguments[_key2]
      }

      printWarning$2.apply(undefined, [format].concat(args))
    }
  }
}

var warning_1 = warning

var implementation = createCommonjsModule(function(module, exports) {
  exports.__esModule = true

  var _react2 = _interopRequireDefault(_react)

  var _propTypes2 = _interopRequireDefault(propTypes)

  var _gud2 = _interopRequireDefault(gud)

  var _warning2 = _interopRequireDefault(warning_1)

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function')
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      )
    }
    return call && (typeof call === 'object' || typeof call === 'function')
      ? call
      : self
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError(
        'Super expression must either be null or a function, not ' +
          typeof superClass
      )
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true,
      },
    })
    if (superClass)
      Object.setPrototypeOf
        ? Object.setPrototypeOf(subClass, superClass)
        : (subClass.__proto__ = superClass)
  }

  var MAX_SIGNED_31_BIT_INT = 1073741823

  // Inlined Object.is polyfill.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
  function objectIs(x, y) {
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y
    } else {
      return x !== x && y !== y
    }
  }

  function createEventEmitter(value) {
    var handlers = []
    return {
      on: function on(handler) {
        handlers.push(handler)
      },
      off: function off(handler) {
        handlers = handlers.filter(function(h) {
          return h !== handler
        })
      },
      get: function get() {
        return value
      },
      set: function set(newValue, changedBits) {
        value = newValue
        handlers.forEach(function(handler) {
          return handler(value, changedBits)
        })
      },
    }
  }

  function onlyChild(children) {
    return Array.isArray(children) ? children[0] : children
  }

  function createReactContext(defaultValue, calculateChangedBits) {
    var _Provider$childContex, _Consumer$contextType

    var contextProp = '__create-react-context-' + (0, _gud2.default)() + '__'

    var Provider = (function(_Component) {
      _inherits(Provider, _Component)

      function Provider() {
        var _temp, _this, _ret

        _classCallCheck(this, Provider)

        for (
          var _len = arguments.length, args = Array(_len), _key = 0;
          _key < _len;
          _key++
        ) {
          args[_key] = arguments[_key]
        }

        return (
          (_ret = ((_temp = ((_this = _possibleConstructorReturn(
            this,
            _Component.call.apply(_Component, [this].concat(args))
          )),
          _this)),
          (_this.emitter = createEventEmitter(_this.props.value)),
          _temp)),
          _possibleConstructorReturn(_this, _ret)
        )
      }

      Provider.prototype.getChildContext = function getChildContext() {
        var _ref

        return (_ref = {}), (_ref[contextProp] = this.emitter), _ref
      }

      Provider.prototype.componentWillReceiveProps = function componentWillReceiveProps(
        nextProps
      ) {
        if (this.props.value !== nextProps.value) {
          var oldValue = this.props.value
          var newValue = nextProps.value
          var changedBits = void 0

          if (objectIs(oldValue, newValue)) {
            changedBits = 0 // No change
          } else {
            changedBits =
              typeof calculateChangedBits === 'function'
                ? calculateChangedBits(oldValue, newValue)
                : MAX_SIGNED_31_BIT_INT
            if (process.env.NODE_ENV !== 'production') {
              ;(0, _warning2.default)(
                (changedBits & MAX_SIGNED_31_BIT_INT) === changedBits,
                'calculateChangedBits: Expected the return value to be a ' +
                  '31-bit integer. Instead received: %s',
                changedBits
              )
            }

            changedBits |= 0

            if (changedBits !== 0) {
              this.emitter.set(nextProps.value, changedBits)
            }
          }
        }
      }

      Provider.prototype.render = function render() {
        return this.props.children
      }

      return Provider
    })(_react.Component)

    Provider.childContextTypes = ((_Provider$childContex = {}),
    (_Provider$childContex[contextProp] =
      _propTypes2.default.object.isRequired),
    _Provider$childContex)

    var Consumer = (function(_Component2) {
      _inherits(Consumer, _Component2)

      function Consumer() {
        var _temp2, _this2, _ret2

        _classCallCheck(this, Consumer)

        for (
          var _len2 = arguments.length, args = Array(_len2), _key2 = 0;
          _key2 < _len2;
          _key2++
        ) {
          args[_key2] = arguments[_key2]
        }

        return (
          (_ret2 = ((_temp2 = ((_this2 = _possibleConstructorReturn(
            this,
            _Component2.call.apply(_Component2, [this].concat(args))
          )),
          _this2)),
          (_this2.state = {
            value: _this2.getValue(),
          }),
          (_this2.onUpdate = function(newValue, changedBits) {
            var observedBits = _this2.observedBits | 0
            if ((observedBits & changedBits) !== 0) {
              _this2.setState({ value: _this2.getValue() })
            }
          }),
          _temp2)),
          _possibleConstructorReturn(_this2, _ret2)
        )
      }

      Consumer.prototype.componentWillReceiveProps = function componentWillReceiveProps(
        nextProps
      ) {
        var observedBits = nextProps.observedBits

        this.observedBits =
          observedBits === undefined || observedBits === null
            ? MAX_SIGNED_31_BIT_INT // Subscribe to all changes by default
            : observedBits
      }

      Consumer.prototype.componentDidMount = function componentDidMount() {
        if (this.context[contextProp]) {
          this.context[contextProp].on(this.onUpdate)
        }
        var observedBits = this.props.observedBits

        this.observedBits =
          observedBits === undefined || observedBits === null
            ? MAX_SIGNED_31_BIT_INT // Subscribe to all changes by default
            : observedBits
      }

      Consumer.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this.context[contextProp]) {
          this.context[contextProp].off(this.onUpdate)
        }
      }

      Consumer.prototype.getValue = function getValue() {
        if (this.context[contextProp]) {
          return this.context[contextProp].get()
        } else {
          return defaultValue
        }
      }

      Consumer.prototype.render = function render() {
        return onlyChild(this.props.children)(this.state.value)
      }

      return Consumer
    })(_react.Component)

    Consumer.contextTypes = ((_Consumer$contextType = {}),
    (_Consumer$contextType[contextProp] = _propTypes2.default.object),
    _Consumer$contextType)

    return {
      Provider: Provider,
      Consumer: Consumer,
    }
  }

  exports.default = createReactContext
  module.exports = exports['default']
})

unwrapExports(implementation)

var lib = createCommonjsModule(function(module, exports) {
  exports.__esModule = true

  var _react2 = _interopRequireDefault(_react)

  var _implementation2 = _interopRequireDefault(implementation)

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj }
  }

  exports.default = _react2.default.createContext || _implementation2.default
  module.exports = exports['default']
})

var createReactContext = unwrapExports(lib)

var _createReactContext = createReactContext({
    api: undefined,
    headers: {},
    loader: undefined,
    onIntercept: undefined,
    store: undefined,
    timeout: undefined,
  }),
  Provider = _createReactContext.Provider,
  Consumer = _createReactContext.Consumer

/* eslint-disable no-use-before-define */

// PROPTYPES
var contextShape = propTypes.shape({
  api: propTypes.string,
  headers: propTypes.object,
  onIntercept: propTypes.func,
  loader: propTypes.element,
  store: propTypes.object,
  timeout: propTypes.number,
})
var methodShape = propTypes.oneOf([
  'DELETE',
  'FORM_DATA',
  'GET',
  'HEAD',
  'PATCH',
  'POST',
  'PUT',
  'TRACE',
])

var isEmptyChildren = function isEmptyChildren(children) {
  return Children.count(children) === 0
}

var Fetch =
  /*#__PURE__*/
  (function(_Component) {
    _inheritsLoose(Fetch, _Component)

    function Fetch() {
      var _this

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key]
      }

      _this = _Component.call.apply(_Component, [this].concat(args)) || this

      _defineProperty(
        _assertThisInitialized(_assertThisInitialized(_this)),
        '_data',
        undefined
      )

      _defineProperty(
        _assertThisInitialized(_assertThisInitialized(_this)),
        '_didCallOnLoad',
        false
      )

      _defineProperty(
        _assertThisInitialized(_assertThisInitialized(_this)),
        '_isLoaded',
        false
      )

      _defineProperty(
        _assertThisInitialized(_assertThisInitialized(_this)),
        '_isUnmounted',
        false
      )

      _defineProperty(
        _assertThisInitialized(_assertThisInitialized(_this)),
        '_fetchData',
        /*#__PURE__*/
        (function() {
          var _ref = _asyncToGenerator(
            /*#__PURE__*/
            regenerator.mark(function _callee(props) {
              var body,
                cancel,
                context,
                headers,
                method,
                onIntercept,
                onProgress,
                onTimeout,
                params,
                path,
                url,
                timeout,
                route,
                timeoutValue,
                apiResponse
              return regenerator.wrap(
                function _callee$(_context) {
                  while (1) {
                    switch ((_context.prev = _context.next)) {
                      case 0:
                        ;(body = props.body),
                          (cancel = props.cancel),
                          (context = props.context),
                          (headers = props.headers),
                          (method = props.method),
                          (onIntercept = props.onIntercept),
                          (onProgress = props.onProgress),
                          (onTimeout = props.onTimeout),
                          (params = props.params),
                          (path = props.path),
                          (url = props.url),
                          (timeout = props.timeout)
                        timeoutValue = 0
                        if (path) route = '' + (context.api || '') + path
                        else route = url
                        if (context.timeout && timeout === -1)
                          timeoutValue = context.timeout
                        else if (!context.timeout && timeout)
                          timeoutValue = Math.max(0, timeout)
                        else if (context.timeout && timeout)
                          timeoutValue =
                            timeout === -1 ? context.timeout : timeout
                        _context.prev = 4
                        _context.next = 7
                        return requestToApi({
                          url: route || '',
                          body: _extends({}, body),
                          cancel: cancel,
                          headers: _extends({}, context.headers, headers),
                          method: method,
                          onTimeout: onTimeout,
                          onProgress: onProgress,
                          onIntercept: onIntercept || context.onIntercept,
                          params: _extends({}, params),
                          timeout: timeoutValue,
                        })

                      case 7:
                        apiResponse = _context.sent

                        if (!_this._isUnmounted) {
                          _this._handleData(
                            _extends({}, apiResponse, {
                              store: context.store,
                            })
                          )
                        }

                        _context.next = 14
                        break

                      case 11:
                        _context.prev = 11
                        _context.t0 = _context['catch'](4)

                        if (!_this._isUnmounted) {
                          _this._handleData({
                            error: {
                              content: _context.t0,
                              message:
                                'Something went wrong during the request',
                              url: route,
                            },
                            isOK: false,
                            store: context.store,
                          })

                          if (process.env.NODE_ENV !== 'production') {
                            !!_context.t0
                              ? process.env.NODE_ENV !== 'production'
                                ? invariant_1(
                                    false,
                                    '<Fetch /> tried to call the route "' +
                                      String(route) +
                                      '" ' +
                                      ('with "' +
                                        String(method).toUpperCase() +
                                        '" method ') +
                                      'but resolved with the following error: %s\n',
                                    _this._printError(_context.t0)
                                  )
                                : invariant_1(false)
                              : void 0
                          }
                        }

                      case 14:
                      case 'end':
                        return _context.stop()
                    }
                  }
                },
                _callee,
                this,
                [[4, 11]]
              )
            })
          )

          return function(_x) {
            return _ref.apply(this, arguments)
          }
        })()
      )

      _defineProperty(
        _assertThisInitialized(_assertThisInitialized(_this)),
        '_handleData',
        function(result) {
          if (!_this._isUnmounted) {
            _this._isLoaded = true
            _this.props.resultOnly
              ? (_this._data = result.error || result.data)
              : (_this._data = result)

            _this._returnData(result)
          }
        }
      )

      _defineProperty(
        _assertThisInitialized(_assertThisInitialized(_this)),
        '_printError',
        function(error) {
          return error.response && JSON.stringify(error.response).length
            ? typeof error.response === 'string'
              ? error.response
              : typeof error.response === 'object'
                ? JSON.stringify(error.response, null, 2)
                : error.response +
                  ". 'Check error.content to see what happened."
            : 'Check error.content to see what happened.'
        }
      )

      _defineProperty(
        _assertThisInitialized(_assertThisInitialized(_this)),
        '_renderLoader',
        function() {
          var _this$props = _this.props,
            context = _this$props.context,
            loader = _this$props.loader

          if (context.loader && !loader) {
            return typeof context.loader === 'function'
              ? context.loader()
              : context.loader
          }

          if (!context.loader && loader)
            return typeof loader === 'function' ? loader() : loader
          if (context.loader && loader)
            return typeof loader === 'function' ? loader() : loader
          return null
        }
      )

      _defineProperty(
        _assertThisInitialized(_assertThisInitialized(_this)),
        '_returnData',
        function(result) {
          var _this$props2 = _this.props,
            onError = _this$props2.onError,
            onFetch = _this$props2.onFetch
          if (onFetch) onFetch(_this._data)
          if (result.error && onError) onError(_this._data)
          if (!_this._isUnmounted) _this.forceUpdate()
        }
      )

      _defineProperty(
        _assertThisInitialized(_assertThisInitialized(_this)),
        '_validateProps',
        function(props) {
          var children = props.children,
            component = props.component,
            context = props.context,
            onTimeout = props.onTimeout,
            onFetch = props.onFetch,
            path = props.path,
            render = props.render,
            timeout = props.timeout,
            url = props.url
          !(path || url)
            ? process.env.NODE_ENV !== 'production'
              ? invariant_1(
                  false,
                  'You must provide a `url` or a `path` to <Fetch />'
                )
              : invariant_1(false)
            : void 0

          if (path) {
            !(path && context.api)
              ? process.env.NODE_ENV !== 'production'
                ? invariant_1(
                    false,
                    'You must implement <FetchProvider> at the root of your ' +
                      'app and provide a URL to `value.api` prop in order to use `path`'
                  )
                : invariant_1(false)
              : void 0
          }

          if (path === 'store') {
            !(path && context.store)
              ? process.env.NODE_ENV !== 'production'
                ? invariant_1(
                    false,
                    'You must implement <FetchProvider> at the root of your ' +
                      'app and provide an object to `value.store` prop ' +
                      'in order to use `store`'
                  )
                : invariant_1(false)
              : void 0
          }

          if (onTimeout) {
            !(
              (typeof timeout === 'number' && timeout >= 0) ||
              (typeof context.timeout === 'number' && context.timeout >= 0)
            )
              ? process.env.NODE_ENV !== 'production'
                ? invariant_1(
                    false,
                    'You must provide a `timeout` number in ms to <Fetch /> or ' +
                      '<FetchProvider> in order to use `onTimeout`'
                  )
                : invariant_1(false)
              : void 0
          }

          !(children || component || render || onFetch)
            ? process.env.NODE_ENV !== 'production'
              ? invariant_1(
                  false,
                  'You must provide at least one of the following ' +
                    'to <Fetch />: children, `component`, `onFetch`, `render`'
                )
              : invariant_1(false)
            : void 0
        }
      )

      return _this
    }

    var _proto = Fetch.prototype

    _proto.UNSAFE_componentWillMount = function UNSAFE_componentWillMount() {
      this._validateProps(this.props)

      if (this.props.onLoad && !this._didCallOnLoad) {
        this._didCallOnLoad = true
        this.props.onLoad()
      }
    }

    _proto.componentDidMount = function componentDidMount() {
      if (this.props.path === 'store') {
        this._handleData({
          data: this.props.context.store,
          isOK: true,
        })
      } else this._fetchData(this.props)
    }

    _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
      this._validateProps(this.props)

      if (this.props.onLoad && !this._didCallOnLoad) {
        this._didCallOnLoad = true
        this.props.onLoad()
      }

      if (this.props.refetchKey !== prevProps.refetchKey) {
        if (this.props.path === 'store') {
          this._isLoaded = true

          this._handleData({
            data: this.props.context.store,
            isOK: true,
          })
        } else {
          this._isLoaded = false

          this._fetchData(this.props)
        }
      }
    }

    _proto.componentWillUnmount = function componentWillUnmount() {
      this._isUnmounted = true
    }

    _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
      if (this.props.cancel !== nextProps.cancel) return true
      if (this.props.children !== nextProps.children) return true
      if (this.props.loader !== nextProps.loader) return true
      if (this.props.onError !== nextProps.onError) return true
      if (this.props.onFetch !== nextProps.onFetch) return true
      if (this.props.onLoad !== nextProps.onLoad) return true
      if (this.props.path !== nextProps.path) return true
      if (this.props.params !== nextProps.params) return true
      if (this.props.refetchKey !== nextProps.refetchKey) return true
      if (this.props.render !== nextProps.render) return true
      if (this._isLoaded) return true
      if (this._data) return true
      return false
    }

    _proto.render = function render() {
      var _this$props3 = this.props,
        children = _this$props3.children,
        component = _this$props3.component,
        render = _this$props3.render
      if (!this._isLoaded && !this._isUnmounted) return this._renderLoader()

      if (this._isLoaded && !this._isUnmounted) {
        if (component) return createElement(component, this._data)
        if (typeof render === 'function') return render(this._data)
        if (typeof children === 'function') return children(this._data)
        if (children && !isEmptyChildren(children))
          return Children.only(children)
      }

      return null
    }

    return Fetch
  })(Component)

_defineProperty(Fetch, 'propTypes', {
  body: propTypes.object,
  cancel: propTypes.bool,
  children: propTypes.oneOfType([propTypes.element, propTypes.func]),
  component: propTypes.oneOfType([propTypes.element, propTypes.func]),
  context: contextShape,
  method: methodShape,
  loader: propTypes.oneOfType([propTypes.element, propTypes.func]),
  onError: propTypes.func,
  onFetch: propTypes.func,
  onLoad: propTypes.func,
  onProgress: propTypes.func,
  onTimeout: propTypes.func,
  params: propTypes.object,
  path: propTypes.string,
  refetchKey: propTypes.any,
  render: propTypes.func,
  resultOnly: propTypes.bool,
  url: propTypes.string,
  timeout: propTypes.number,
})

_defineProperty(Fetch, 'defaultProps', {
  body: {},
  cancel: false,
  children: undefined,
  component: undefined,
  context: {},
  loader: undefined,
  method: 'GET',
  onError: undefined,
  onFetch: undefined,
  onLoad: undefined,
  onProgress: undefined,
  onTimeout: undefined,
  params: {},
  path: undefined,
  refetchKey: undefined,
  render: undefined,
  resultOnly: false,
  url: undefined,
  timeout: -1, // @TODO: Move this to cdM to be StrictMode compliant
})

var withContext = function withContext(FetchComponent) {
  return function(props) {
    return _react.createElement(Consumer, null, function(data) {
      return _react.createElement(
        FetchComponent,
        _extends({}, props, {
          context: data,
        })
      )
    })
  }
}

var Fetch$1 = withContext(polyfill(Fetch))

/* eslint react/no-this-in-sfc: 0 */
var FetchManager = function FetchManager() {
  var _this = this

  _defineProperty(this, 'refCounter', 0)

  _defineProperty(this, 'subscriptions', [])

  _defineProperty(this, 'subscribe', function(subscriptionProps) {
    var subscription = _extends(
      {
        ref: _this.refCounter,
      },
      subscriptionProps
    )

    _this.refCounter += 1
    _this.subscriptions = _this.subscriptions.concat([subscription])
    return subscription.ref
  })

  _defineProperty(this, 'update', function(ref, newSubscriptionProps) {
    var index = _this.subscriptions.findIndex(function(subscription) {
      return (
        (subscription === null || subscription === void 0
          ? void 0
          : subscription.ref) === ref
      )
    })

    if (index > -1) {
      _this.subscriptions = _this.subscriptions.slice(0, index).concat(
        [
          _extends(
            {
              ref: ref,
            },
            newSubscriptionProps
          ),
        ],
        _this.subscriptions.slice(index + 1)
      )
      return true
    }

    return false
  })

  _defineProperty(this, 'unsubscribe', function(ref) {
    var index = _this.subscriptions.findIndex(function(subscription) {
      return (
        (subscription === null || subscription === void 0
          ? void 0
          : subscription.ref) === ref
      )
    })

    if (index > -1) {
      _this.subscriptions = _this.subscriptions
        .slice(0, index)
        .concat(_this.subscriptions.slice(index + 1))
      return true
    }

    return false
  })

  _defineProperty(this, 'get', function(ref) {
    var index = _this.subscriptions.findIndex(function(subscription) {
      return (
        (subscription === null || subscription === void 0
          ? void 0
          : subscription.ref) === ref
      )
    })

    if (index > -1) return _this.subscriptions[index]
    return null
  })

  _defineProperty(this, 'getAll', function() {
    return _this.subscriptions
  })
}

var FetchManager$1 = new FetchManager()

export {
  Fetch$1 as Fetch,
  Provider as FetchProvider,
  FetchManager$1 as FetchManager,
  requestToApi,
}
