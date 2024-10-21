/**
 * 入口文件
 * 当我们import Vue from 'vue'的时候，就是从这个文件入口执行代码初始化Vue.
 */
import Vue from './runtime-with-compiler'
import * as vca from 'v3'
import { extend } from 'shared/util'

extend(Vue, vca)

import { effect } from 'v3/reactivity/effect'
Vue.effect = effect

export default Vue
