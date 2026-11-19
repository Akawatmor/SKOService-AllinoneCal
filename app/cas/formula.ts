import { LatexSyntax, type MathJsonExpression } from '@cortex-js/compute-engine/latex-syntax'
import { incompleteFormula } from './keys'

const syntax = new LatexSyntax()
const functions = new Map<string, [command: string, minArgs: number, maxArgs?: number]>([
  ['Solve', ['solve', 2]], ['Factor', ['factor', 1]],
  ['Expand', ['expand', 1]], ['Simplify', ['simplify', 1]],
  ['Approx', ['evalf', 1]], ['GCD', ['gcd', 2]], ['LCM', ['lcm', 2]],
  ['Diff', ['diff', 2, 3]], ['D', ['diff', 2, 3]], ['Limit', ['limit', 3]],
  ['Sum', ['sum', 4]], ['Product', ['product', 4]],
  ['Det', ['det', 1]], ['Inv', ['inv', 1]], ['Transpose', ['transpose', 1]],
  ['Rank', ['rank', 1]], ['Eig', ['eigenvalues', 1]], ['Norm', ['norm', 1]],
  ['Sqrt', ['sqrt', 1]], ['Root', ['surd', 2]], ['Abs', ['abs', 1]],
  ['Log', ['log10', 1]], ['Ln', ['ln', 1]], ['Exp', ['exp', 1]],
  ['Sin', ['sin', 1]], ['Cos', ['cos', 1]], ['Tan', ['tan', 1]],
  ['Arcsin', ['asin', 1]], ['Arccos', ['acos', 1]], ['Arctan', ['atan', 1]],
  ['Sinh', ['sinh', 1]], ['Cosh', ['cosh', 1]], ['Tanh', ['tanh', 1]],
  ['Cot', ['cot', 1]], ['Sec', ['sec', 1]], ['Csc', ['csc', 1]],
])
const symbols = new Map([
  ['Pi', 'pi'], ['ExponentialE', 'e'], ['ImaginaryUnit', 'i'], ['PositiveInfinity', 'inf'],
])
const infix = new Map([
  ['Add', '+'], ['Subtract', '-'], ['Multiply', '*'], ['InvisibleOperator', '*'],
  ['Divide', '/'], ['Rational', '/'], ['Power', '^'], ['Equal', '='],
])
const unsupported = 'ใช้รูปแบบคำสั่ง Giac สำหรับสูตรนี้'
const invalid = 'ตรวจสอบสูตรและวงเล็บก่อนคำนวณ'

function isCall(expr: MathJsonExpression, head: string): expr is [string, ...MathJsonExpression[]] {
  return Array.isArray(expr) && expr[0] === head
}

function toGiac(expr: MathJsonExpression, answer: string): string {
  if (typeof expr === 'string') {
    if (expr === 'Ans') {
      if (!answer) throw new Error('กด EXE เพื่อหาคำตอบแรกก่อนใช้ Ans')
      return `(${answer})`
    }
    if (expr === 'Nothing') throw new Error(incompleteFormula)
    const symbol = symbols.get(expr)
    if (symbol) return symbol
    if (/^[a-zA-Z]$/.test(expr)) return expr
    throw new Error(unsupported)
  }
  if (typeof expr === 'number') return String(expr)
  if (!Array.isArray(expr)) {
    if ('num' in expr && /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(expr.num)) return expr.num
    if ('sym' in expr) return toGiac(expr.sym, answer)
    if ('fn' in expr) return toGiac(expr.fn, answer)
    throw new Error(unsupported)
  }

  const [head, ...args] = expr
  const convert = (arg: MathJsonExpression) => toGiac(arg, answer)
  if (head === 'Error' || head === 'Sequence') throw new Error(invalid)
  if (head === 'Delimiter' && args.length === 1) return `(${convert(args[0])})`
  if (head === 'Negate' && args.length === 1) return `(-(${convert(args[0])}))`
  if (head === 'Factorial' && args.length === 1) return `(${convert(args[0])})!`

  const operator = infix.get(head)
  if (operator && args.length >= 2 && (['Add', 'Multiply', 'InvisibleOperator'].includes(head) || args.length === 2)) {
    return `(${args.map(arg => `(${convert(arg)})`).join(operator)})`
  }
  if (head === 'Integrate' && args.length === 2) {
    const [body, limits] = args
    if (isCall(limits, 'Tuple')) {
      if (limits.length !== 4) throw new Error(incompleteFormula)
      return `integrate(${[body, ...limits.slice(1)].map(convert).join(',')})`
    }
    return `integrate(${convert(body)},${convert(limits)})`
  }
  if (head === 'List' && args.length > 0) return `[${args.map(convert).join(',')}]`
  if (head === 'Matrix' && args.length === 2 && isCall(args[0], 'List')) return convert(args[0])

  const fn = functions.get(head)
  if (fn) {
    const [command, minArgs, maxArgs = minArgs] = fn
    if (args.length < minArgs || args.length > maxArgs) throw new Error(invalid)
    return `${command}(${args.map(convert).join(',')})`
  }
  throw new Error(unsupported)
}

export function formulaToGiac(latex: string, answer: string) {
  if (/\\placeholder\b/.test(latex)) throw new Error(incompleteFormula)
  const parsed = syntax.parse(latex, {
    resolveSymbol: symbol => functions.has(symbol) ? { type: 'function' } : undefined,
  })
  if (parsed === null) throw new Error(invalid)
  return toGiac(parsed, answer)
}
