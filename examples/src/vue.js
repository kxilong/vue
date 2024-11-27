class Vue {
  constructor(options) {
    this.$options = options
    this.$el =
      typeof options.el == 'string'
        ? document.querySelector(options.el)
        : options.el
    this.$data = options.data
    this._proxyData(this.$data)
    if (options.el) {
      this.$mount(options.el)
    }
  }

  _proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get: function () {
          return data[key]
        },
        set: function (newValue) {
          data[key] = newValue
        }
      })
    })
  }
}

renderMixin(Vue)
lifecycleMixin(Vue)
