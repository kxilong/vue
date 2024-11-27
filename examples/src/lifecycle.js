function mountComponent(vm, el) {
  // 模版编译解析生成了render函数
  // vm._render() 调用生成的render函数 生成虚拟dom
  // 最后使用vm._upadte() 把虚拟dom渲染到页面
  vm.$el = el
  vm._update(vm._render())
}

function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    // 渲染vnoe为真实dom核心
    patch(vm.$el, vnode)
  }
}
