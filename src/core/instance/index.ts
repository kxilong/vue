import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
import type { GlobalAPI } from 'types/global-api'

/**
 * 这里是Vue的庐山真面目
 *
 * 为什么Vue不使用ES6的class呢？
 * 答：写成方法，他实际就是一个用Function实现的类，我们只能通过new Vue去实例化。
 *    往下看有很多xxxMixin的函数调用，并且Vue当参数传入，他们的功能都是给Vue的prototype上拓展一些方法，用Class是难以实现的。
 */
function Vue(options) {
  if (__DEV__ && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

//@ts-expect-error Vue has function type
initMixin(Vue)
//@ts-expect-error Vue has function type
stateMixin(Vue)
//@ts-expect-error Vue has function type
eventsMixin(Vue)
//@ts-expect-error Vue has function type
lifecycleMixin(Vue)
//@ts-expect-error Vue has function type
renderMixin(Vue)

export default Vue as unknown as GlobalAPI
