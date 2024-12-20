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
    // 如果有el属性，进行模版渲染
    if (options.el) {
      this.$mount(options.el)
    }
  }
  $mount(el) {
    const vm = this
    const options = this.$options
    if (!options.render) {
      let template = options.template

      if (!template && el) {
        template = el.outerHTML
      }
      if (template) {
        const render = compileToFunctions(template)
        options.render = render
      }
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
