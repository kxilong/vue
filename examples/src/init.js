Vue.prototype.$mount = function (el) {
  const vm = this
  const options = vm.$options
  el = document.querySelector(el)

  // 如果不存在render函数
  if (!vm.render) {
    // 如果存在temple属性
    let template = options.template
    if (!template && el) {
      template = getOuterHTML(el)
    }

    // 最终需要把template模版转换render函数
    if (template) {
      const render = compileToFunctions(template)
      options.render = render
    }
  }

  // 将当前组件实例挂载到真实的el节点上面
  return mountComponent(vm, el)
}

function getOuterHTML(el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}
