const hasProto = '__proto__' in {}

class Observer {
  constructor(value) {
    this.value = value
    def(value, '__ob__', this)
    Object.keys(value).forEach(key => {
      if (Array.isArray(value[key])) {
        value[key].__proto__ = arrayMethods
        this.observeArray(value[key])
      } else {
        this.walk(value, key)
      }
    })
  }
  walk(data, key) {
    this.defineReactive(data, key, data[key])
  }
  observeArray(items) {
    for (let i = 0; i < items.length; i++) {
      this.defineReactive(items, i, items[i])
    }
  }
  defineReactive(data, key, value) {
    let self = this
    let dep = new Dep()
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        console.log(`【获取】属性：${key},值为：${value}`)
        Dep.target && dep.addSubs(Dep.target)
        return value
      },
      set: function (newValue) {
        console.log(`【设置】属性：${key},值为：${newValue}`)
        if (value == newValue) return
        value = newValue
        self.walk(newValue)
        dep.notify()
      }
    })
  }
}
