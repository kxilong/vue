function compileToFunctions(template) {
  // 目的：将html字符串 变成render函数
  // 1. 将html字符串转ast语法树
  let ast = parse(template)
  // 2. 优化静态内容

  // 3.通过ast 重新生成代码
  // 我们最后生成的代码需要和render函数一样
  // 类似_c('div',{id:"app"},_c('div',undefined,_v("hello"+_s(name)),_c('span',undefined,_v("world"))))
  // _c代表创建元素 _v代表创建文本 _s代表文Json.stringify--把对象解析成文本
  let code = generate(ast)
  // 使用with语法改变作用域为this 之后调用render函数可以使用call改变this 方便code里面的变量取值
  let renderFn = new Function(`with(this){return ${code}}`)
  return renderFn
}

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` //匹配标签名 形如 abc-123
const qnameCapture = `((?:${ncname}\\:)?${ncname})` //匹配特殊标签 形如 abc:234 前面的abc:可有可无
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配标签开始 形如 <abc-123 捕获里面的标签名
const startTagClose = /^\s*(\/?)>/ // 匹配标签结束  >
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结尾 如 </abc-123> 捕获里面的标签名
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性  形如 id="app"

let root, currentParent //代表根节点 和当前父节点
// 栈结构 来表示开始和结束标签
let stack = []
// 标识元素和文本type
const ELEMENT_TYPE = 1
const TEXT_TYPE = 3

// 生成ast
function createASTElement(tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    children: [],
    attrs,
    parent: null
  }
}

// 对开始标签进行处理
function handleStartTag({ tagName, attrs }) {
  let element = createASTElement(tagName, attrs)
  if (!root) {
    root = element
  }
  currentParent = element
  stack.push(element)
}

// 对结束标签进行处理
function handleEndTag() {
  let element = stack.pop()
  currentParent = stack[stack.length - 1]
  // 建立parent和children的关系
  if (currentParent) {
    element.parent = currentParent
    currentParent.children.push(element)
  }
}

function handleChars(text) {
  text = text.replace(/\s/g, '')
  if (text) {
    currentParent.children.push({
      type: TEXT_TYPE,
      text
    })
  }
}

function parse(html) {
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        handleStartTag(startTagMatch)
        continue
      }

      // 匹配结束标签
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        handleEndTag(endTagMatch[1])
        continue
      }
    }
    let text
    if (textEnd >= 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      handleChars(text)
    }
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      let end, attr

      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length)
        attr = {
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        }
        match.attrs.push(attr)
      }
      if (end) {
        advance(1)
        return match
      }
    }
  }

  function advance(n) {
    html = html.substring(n)
  }

  return root
}

/*************************** */
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g //匹配花括号 {{ }} 捕获花括号里面的内容
const regex = /\{\{((?:.|\r?\n)+?)\}\}/g

function gen(node) {
  // 如果是元素节点
  if (node.type == 1) {
    return generate(node)
  } else {
    // 如果是文本节点
    let text = node.text
    // 不存在花括号变量表达式
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    }

    let lastIndex = (regex.lastIndex = 0)
    let tokens = []
    let match, index
    while ((match = regex.exec(text)) !== null) {
      index = match.index
      if (index > lastIndex) {
        tokens.push(`${JSON.stringify(text.slice(lastIndex, index))}`)
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }

    if (lastIndex < text.length) {
      tokens.push(`${JSON.stringify(text.slice(lastIndex))}`)
    }
    return `_v(${tokens.join('+')})`
  }
}

function genProps(props) {
  let staticProps = ``
  for (let i = 0; i < props.length; i++) {
    const prop = props[i]
    const name = prop.name.indexOf(':') == -1 ? prop.name : prop.name.slice(1)
    const value =
      prop.name.indexOf(':') == -1 ? JSON.stringify(prop.value) : prop.value
    staticProps += `"${name}":${value},`
  }
  staticProps = `{attrs:{${staticProps.slice(0, -1)}}}`

  return staticProps
}

function transformSpecialNewlines(text) {
  return text.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}

function getChildren(el) {
  const children = el.children
  if (children) {
    return `${children.map(c => gen(c)).join(',')}`
  }
}

function generate(el) {
  let children = getChildren(el)
  let code = `_c('${el.tag}',${
    el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'
  }${children ? `,${children}` : ''})`
  return code
}
