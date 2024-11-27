import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'
import { CompilerOptions, CompiledResult } from 'types/compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile(
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 1. 生成ast
  const ast = parse(template.trim(), options)

  // 2. 优化静态节点
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  // 3.ast转render函数
  const code = generate(ast, options)
  console.log(code)

  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns //所有静态节点的渲染函数
  }
})
