// 用来渲染和更新视图
function patch(oldVnode, vnode) {
  //判断传入的oldVnode是不是一个真实元素
  // 初次渲染 传入的oldVnode其实是vm.$el,就是咱们传入的el选项 所以是真实dom
  // 如果不是初次渲染而是视图更新  vm.$el就被替换成更新之前的老的虚拟dom
  const RealElement = oldVnode.nodeType
  if (RealElement) {
    // 这里是初次渲染逻辑
    const oldElm = oldVnode
    const parentElm = oldElm.parentNode

    // 将虚拟dom转换成真实dom
    let el = createElm(vnode)
    // 插入到老的el节点下一个节点前面 就相当于插入到老的el节点外面
    // 这里不直接使用复元素appendChild 是为了不破坏替换的位置
    parentElm.insertBefore(el, oldElm.nextSibling)
    // 删除老的el节点
    parentElm.removeChild(oldVnode)
    return el
  }
}

function createElm(vnode) {
  let { tag, data, children, text, key } = vnode
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    // 解析虚拟dom属性
    updateProperties(vnode)
    children.forEach(c => {
      return vnode.el.appendChild(createElm(c))
    })
  } else {
    // 文本节点
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProperties(vnode) {
  let props = vnode.data.attrs || {}
  let el = vnode.el //真实节点
  for (let key in props) {
    if (key == 'style') {
      for (let styleName in props.style) {
        el.style[styleName] = props.style[styleName]
      }
    } else if (key == 'class') {
      el.className = props.class
    } else {
      el.setAttribute(key, props[key])
    }
  }
}
