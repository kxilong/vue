class VNode {
  constructor(tag, data, key, children, text) {
    this.tag = tag
    this.data = data
    this.key = key
    this.children = children
    this.text = text
  }
}

function createElement(tag, data = {}, ...children) {
  let key = data.key
  return new VNode(tag, data, key, children)
}

// 创建文本节点
function createTextNode(text) {
  return new VNode(undefined, undefined, undefined, undefined, text)
}
