class Vue {
  constructor(options) {
    this.$options = options
    this.$el =
      typeof options.el == 'string'
        ? document.querySelector(options.el)
        : options.el
    this.$data = options.data
    new Observer(this.$data)
    this._proxyData(this.$data)
    new Compiler(this)
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
