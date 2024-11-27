function renderMixin(Vue) {
  Vue.prototype._render = function () {
    const vm = this
    const { render } = vm.$options
    // 生成vnode ---虚拟dom
    const vnode = render.call(vm)
    return vnode
  }

  Vue.prototype._c = function (...args) {
    return createElement(...args)
  }

  Vue.prototype._v = function (text) {
    return createTextNode(text)
  }

  Vue.prototype._s = function (val) {
    return val === null
      ? ''
      : typeof val === 'object'
      ? JSON.stringify(val)
      : val
  }
}
