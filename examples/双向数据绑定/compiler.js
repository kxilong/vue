class Compiler {
  constructor(vm) {
    this.$el = vm.el
    this.vm = vm
    this.compile(vm.$el)
  }
  compile(el) {
    const childNodes = [...el.childNodes]
    childNodes.forEach(node => {
      // 文本节点
      if (this.isTextNode(node)) {
        // 编译文本节点
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        //元素节点
        this.compileElement(node)
      }
      // 判断是否还存在子节点考虑递归
      if (node.childNodes && node.childNodes.length) {
        // 继续递归编译模板
        this.compile(node)
      }
    })
  }
  compileText(node) {
    // 核心思想利用把正则表达式把{{}}去掉找到里面的变量
    // 再去Vue找这个变量赋值给node.textContent
    let reg = /\{\{(.+?)\}\}/
    // 获取节点的文本内容
    let val = node.textContent
    if (reg.test(val)) {
      let key = RegExp.$1.trim()
      node.textContent = val.replace(reg, this.vm[key])
      new Watcher(this.vm, key, function (newValue) {
        node.textContent = newValue
      })
    }
  }
  compileElement(node) {
    ![...node.attributes].forEach(attr => {
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node, key, attrName)
      }
    })
  }
  update(node, key, attrName) {
    let updateFn = this[attrName + 'Updater']
    // 如果存在这个内置方法 就可以调用了
    updateFn && updateFn.call(this, node, key, this.vm[key])
  }
  textUpdater(node, key, value) {
    node.textContent = value
    new Watcher(this.vm, key, function (newValue) {
      node.textContent = newValue
    })
  }
  modelUpdater(node, key, value) {
    node.value = value
    new Watcher(this.vm, key, function (newValue) {
      node.value = newValue
    })
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }
  // 判断元素的属性是否是 vue 指令
  isDirective(attr) {
    return attr.startsWith('v-')
  }
  // 判断是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
  // 判断是否是 文本 节点
  isTextNode(node) {
    return node.nodeType === 3
  }
}
