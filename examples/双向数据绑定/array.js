const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
methods.forEach(method => {
  const original = arrayProto[method]
  Object.defineProperty(arrayMethods, method, {
    configurable: true,
    enumerable: true,
    value: function (...args) {
      const result = original.apply(this, args)
      let inserted
      switch (method) {
        case 'push':
          inserted = args
          break
        case 'unshift':
          inserted = args
        case 'splice':
          inserted = args.slice(2)
      }
      return result
    }
  })
})
