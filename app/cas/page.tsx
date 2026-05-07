'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import katex from 'katex'
import { Play, Trash2, BookOpen, Sigma, BarChart2, Calculator, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'

// Lazy-load Plotly to keep initial bundle small
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => (
  <div className="flex items-center justify-center h-64 text-slate-500 text-sm gap-2">
    <Loader2 className="h-4 w-4 animate-spin" /> Loading graph engine…
  </div>
) })

interface HistoryItem { input: string; output: string; latex: string; timestamp: number }

declare global { interface Window { GiacWASM?: any } }

// ─── KaTeX helper ──────────────────────────────────────────────────────────
function LatexBlock({ tex, className }: { tex: string; className?: string }) {
  const html = useMemo(() => {
    if (!tex) return ''
    try {
      return katex.renderToString(tex, { displayMode: true, throwOnError: false, output: 'html' })
    } catch {
      return `<span class="text-slate-300 font-mono text-sm">${tex}</span>`
    }
  }, [tex])
  if (!tex) return null
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

// ─── Button definitions ────────────────────────────────────────────────────
type BtnDef = { label: string; insert: string; latex?: string; title?: string }

const TRIG: BtnDef[] = [
  { label: 'sin', insert: 'sin(', title: 'Sine' },
  { label: 'cos', insert: 'cos(', title: 'Cosine' },
  { label: 'tan', insert: 'tan(', title: 'Tangent' },
  { label: 'sin⁻¹', insert: 'asin(', title: 'Arc-sine' },
  { label: 'cos⁻¹', insert: 'acos(', title: 'Arc-cosine' },
  { label: 'tan⁻¹', insert: 'atan(', title: 'Arc-tangent' },
  { label: 'sinh', insert: 'sinh(' },
  { label: 'cosh', insert: 'cosh(' },
  { label: 'tanh', insert: 'tanh(' },
  { label: 'cot', insert: 'cot(' },
  { label: 'sec', insert: 'sec(' },
  { label: 'csc', insert: 'csc(' },
]

const ALGEBRA: BtnDef[] = [
  { label: 'factor', insert: 'factor(' },
  { label: 'expand', insert: 'expand(' },
  { label: 'simplify', insert: 'simplify(' },
  { label: 'solve', insert: 'solve(,x)', title: 'solve(eq,var)' },
  { label: 'roots', insert: 'roots(' },
  { label: 'gcd', insert: 'gcd(,' },
  { label: 'lcm', insert: 'lcm(,' },
  { label: 'partfrac', insert: 'partfrac(' },
  { label: 'subst', insert: 'subst(,x=', title: 'Substitute' },
  { label: 'latex', insert: 'latex(' },
]

const CALCULUS: BtnDef[] = [
  { label: "f'", insert: 'diff(,x)', title: 'Derivative diff(expr,var)' },
  { label: '∫dx', insert: 'integrate(,x)', title: 'Integral integrate(expr,var)' },
  { label: '∫ₐᵇ', insert: 'integrate(,x,', title: 'Definite integral integrate(expr,var,a,b)' },
  { label: 'lim', insert: 'limit(,x,', title: 'Limit limit(expr,var,val)' },
  { label: 'taylor', insert: 'taylor(,x=0,', title: 'Taylor series' },
  { label: 'sum', insert: 'sum(,k,0,', title: 'Sum sum(expr,var,from,to)' },
  { label: 'prod', insert: 'product(,k,1,', title: 'Product' },
  { label: "f''", insert: 'diff(,x,2)', title: 'Second derivative' },
  { label: '∂/∂x', insert: 'diff(,x)', title: 'Partial w.r.t. x' },
  { label: '∂/∂y', insert: 'diff(,y)', title: 'Partial w.r.t. y' },
]

const MATH: BtnDef[] = [
  { label: '√', insert: 'sqrt(' },
  { label: '∛', insert: 'cbrt(' },
  { label: 'x²', insert: '^2' },
  { label: 'xⁿ', insert: '^' },
  { label: '|x|', insert: 'abs(' },
  { label: 'log', insert: 'log(' },
  { label: 'ln', insert: 'ln(' },
  { label: 'eˣ', insert: 'exp(' },
  { label: 'π', insert: 'pi' },
  { label: 'e', insert: 'e' },
  { label: '∞', insert: 'inf' },
  { label: 'i', insert: 'i' },
  { label: 'floor', insert: 'floor(' },
  { label: 'ceil', insert: 'ceil(' },
  { label: 'round', insert: 'round(' },
  { label: 'evalf', insert: 'evalf(' },
]

const MATRIX: BtnDef[] = [
  { label: 'det', insert: 'det(' },
  { label: 'inv', insert: 'inv(' },
  { label: 'tran', insert: 'transpose(' },
  { label: 'eig', insert: 'eigenvalues(' },
  { label: 'rank', insert: 'rank(' },
  { label: 'norm', insert: 'norm(' },
  { label: '[[…]]', insert: '[[1,0],[0,1]]', title: 'Matrix literal' },
]

const CATEGORIES = [
  { id: 'trig',    label: 'Trig',    btns: TRIG },
  { id: 'algebra', label: 'Algebra', btns: ALGEBRA },
  { id: 'calc',    label: 'Calc',    btns: CALCULUS },
  { id: 'math',    label: 'Math',    btns: MATH },
  { id: 'matrix',  label: 'Matrix',  btns: MATRIX },
] as const

type CatId = typeof CATEGORIES[number]['id']

// ─── Main component ────────────────────────────────────────────────────────
export default function CASPage() {
  const [mode, setMode] = useState<'calc' | 'graph'>('calc')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [outputLatex, setOutputLatex] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [giacLoaded, setGiacLoaded] = useState(false)
  const [activeCat, setActiveCat] = useState<CatId>('algebra')
  const [showBtns, setShowBtns] = useState(true)

  // Graph state
  const [graphExpr, setGraphExpr] = useState('sin(x)/x')
  const [graphMode, setGraphMode] = useState<'2d' | '3d'>('2d')
  const [xMin, setXMin] = useState('-10')
  const [xMax, setXMax] = useState('10')
  const [yMin, setYMin] = useState('-10')
  const [yMax, setYMax] = useState('10')
  const [plotData, setPlotData] = useState<any[]>([])
  const [isPlotting, setIsPlotting] = useState(false)
  const [plotError, setPlotError] = useState('')

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const giacModuleRef = useRef<any>(null)

  // Load Giac WASM
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '/wasm/giac.js'
    script.async = true
    script.onload = async () => {
      try {
        if (window.GiacWASM) {
          const module = await window.GiacWASM()
          giacModuleRef.current = module
          setGiacLoaded(true)
        }
      } catch (e) { console.error('Giac load error:', e) }
    }
    document.body.appendChild(script)
    return () => { if (document.body.contains(script)) document.body.removeChild(script) }
  }, [])

  // Insert text at cursor
  const insertAtCursor = useCallback((text: string) => {
    if (!inputRef.current) return
    const el = inputRef.current
    const start = el.selectionStart ?? input.length
    const end = el.selectionEnd ?? input.length
    const newVal = input.slice(0, start) + text + input.slice(end)
    setInput(newVal)
    setTimeout(() => {
      el.focus()
      const pos = start + text.length
      el.setSelectionRange(pos, pos)
    }, 0)
  }, [input])

  // Evaluate expression
  const evaluate = useCallback(() => {
    if (!input.trim() || !giacModuleRef.current) return
    setIsLoading(true)
    try {
      const raw = giacModuleRef.current.evaluate(input) as string
      let latexStr = ''
      try {
        latexStr = giacModuleRef.current.evaluate(`latex(${raw})`) as string
        // Giac wraps latex in quotes — strip them
        latexStr = latexStr.replace(/^"(.*)"$/, '$1')
      } catch { latexStr = '' }
      setOutput(raw || 'No result')
      setOutputLatex(latexStr)
      setHistory(prev => [{ input, output: raw || 'No result', latex: latexStr, timestamp: Date.now() }, ...prev])
    } catch (err) {
      const msg = `Error: ${err instanceof Error ? err.message : 'Unable to evaluate'}`
      setOutput(msg)
      setOutputLatex('')
      setHistory(prev => [{ input, output: msg, latex: '', timestamp: Date.now() }, ...prev])
    }
    setIsLoading(false)
  }, [input])

  // Plot function
  const plotGraph = useCallback(async () => {
    if (!giacModuleRef.current) return
    setIsPlotting(true)
    setPlotError('')
    try {
      const x0 = parseFloat(xMin), x1 = parseFloat(xMax)
      const y0 = parseFloat(yMin), y1 = parseFloat(yMax)

      if (graphMode === '2d') {
        const N = 300
        const xs: number[] = [], ys: number[] = []
        for (let i = 0; i <= N; i++) {
          const x = x0 + (x1 - x0) * i / N
          try {
            const r = giacModuleRef.current.evaluate(`evalf(${graphExpr} where x=${x})`)
            const y = parseFloat(r)
            if (isFinite(y)) { xs.push(x); ys.push(y) }
            else { xs.push(x); ys.push(NaN) }
          } catch { xs.push(x); ys.push(NaN) }
        }
        setPlotData([{ x: xs, y: ys, type: 'scatter', mode: 'lines',
          line: { color: '#8b5cf6', width: 2 }, name: graphExpr }])
      } else {
        const N = 40
        const xVals: number[] = [], yVals: number[] = []
        const zGrid: number[][] = []
        for (let i = 0; i <= N; i++) xVals.push(x0 + (x1 - x0) * i / N)
        for (let j = 0; j <= N; j++) yVals.push(y0 + (y1 - y0) * j / N)
        for (let i = 0; i <= N; i++) {
          const row: number[] = []
          for (let j = 0; j <= N; j++) {
            const x = xVals[i], y = yVals[j]
            try {
              const r = giacModuleRef.current.evaluate(`evalf(${graphExpr} where x=${x},y=${y})`)
              const z = parseFloat(r)
              row.push(isFinite(z) ? z : NaN)
            } catch { row.push(NaN) }
          }
          zGrid.push(row)
        }
        setPlotData([{ x: xVals, y: yVals, z: zGrid, type: 'surface',
          colorscale: 'Viridis', name: graphExpr }])
      }
    } catch (e) {
      setPlotError('Failed to evaluate expression. Check the syntax.')
    }
    setIsPlotting(false)
  }, [graphExpr, graphMode, xMin, xMax, yMin, yMax])

  const currentBtns = CATEGORIES.find(c => c.id === activeCat)?.btns ?? []

  return (
    <div className="page-container space-y-5">
      <PageHeader
        title="CAS Calculator"
        description="Computer Algebra System — symbolic math, graphing, and more"
        icon={Sigma}
        color="pink"
        badge={giacLoaded ? 'Ready' : 'Loading…'}
      />

      {/* Mode switcher */}
      <div className="flex gap-2 p-1 bg-slate-900/60 rounded-2xl border border-slate-800/60 w-fit">
        {([['calc', Calculator, 'Calculate'], ['graph', BarChart2, 'Graph']] as const).map(([m, Icon, label]) => (
          <button key={m} onClick={() => setMode(m as 'calc' | 'graph')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === m ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}>
            <Icon className="h-4 w-4" />{label}
          </button>
        ))}
      </div>

      {/* ── CALCULATE MODE ── */}
      {mode === 'calc' && (
        <div className="space-y-4">
          {/* Input */}
          <div className="section-card space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Expression</label>
              {!giacLoaded && <span className="text-xs text-amber-400 animate-pulse">⏳ Loading engine…</span>}
              {giacLoaded && <span className="text-xs text-emerald-400">✓ Ready</span>}
            </div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) { e.preventDefault(); evaluate() } }}
              placeholder="e.g.  solve(x^2-5*x+6=0,x)  or  diff(sin(x)*x^2,x)"
              className="input-modern font-mono text-sm resize-none"
              rows={3}
            />
            <button onClick={evaluate}
              disabled={isLoading || !input.trim() || !giacLoaded}
              className="btn-gradient disabled:opacity-40 disabled:cursor-not-allowed w-full">
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Evaluating…</> : <><Play className="h-4 w-4" /> Evaluate (Ctrl+Enter)</>}
            </button>

            {/* Result */}
            {output && (
              <div className="space-y-2 pt-1">
                <div className="text-sm font-medium text-slate-400">Result</div>
                {outputLatex ? (
                  <div className="bg-slate-950/50 border border-slate-700/60 rounded-xl px-4 py-5 overflow-x-auto text-center">
                    <LatexBlock tex={outputLatex} className="text-emerald-300" />
                    <div className="mt-2 text-xs text-slate-600 font-mono">{output}</div>
                  </div>
                ) : (
                  <div className="bg-slate-950/50 border border-slate-700/60 rounded-xl p-4">
                    <pre className="font-mono text-sm whitespace-pre-wrap break-words text-emerald-400">{output}</pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Button panel */}
          <div className="section-card space-y-3">
            <button onClick={() => setShowBtns(b => !b)}
              className="w-full flex items-center justify-between text-sm font-medium text-slate-300 hover:text-white transition-colors">
              <span className="flex items-center gap-1.5"><Calculator className="h-4 w-4 text-violet-400" /> Function Buttons</span>
              {showBtns ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showBtns && (
              <div className="space-y-3">
                {/* Category tabs */}
                <div className="flex flex-wrap gap-1">
                  {CATEGORIES.map(c => (
                    <button key={c.id} onClick={() => setActiveCat(c.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeCat === c.id ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}>
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Function buttons */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                  {currentBtns.map((btn) => (
                    <button key={btn.label} onClick={() => insertAtCursor(btn.insert)}
                      title={btn.title ?? btn.insert}
                      className="px-2 py-2 bg-slate-800/80 hover:bg-violet-600/30 border border-slate-700/60 hover:border-violet-500/50 rounded-xl text-xs font-mono text-slate-200 transition-all active:scale-95">
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Common symbols & number helpers */}
                <div className="border-t border-slate-700/40 pt-3 grid grid-cols-6 sm:grid-cols-10 gap-1">
                  {['(', ')', ',', '=', '+', '-', '*', '/', '^', '!'].map(s => (
                    <button key={s} onClick={() => insertAtCursor(s)}
                      className="py-2 bg-slate-900/60 hover:bg-slate-700/60 border border-slate-700/40 rounded-lg text-sm font-mono text-slate-300 transition-all active:scale-95">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">History</h2>
                <button onClick={() => { setHistory([]); setOutput(''); setOutputLatex('') }}
                  className="btn-ghost text-sm py-1.5 px-3"><Trash2 className="h-4 w-4" /> Clear</button>
              </div>
              <div className="space-y-2">
                {history.map((item) => (
                  <div key={item.timestamp} className="section-card space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                      <button onClick={() => setInput(item.input)} className="text-violet-400 hover:text-violet-300">Reuse</button>
                    </div>
                    <div className="font-mono text-sm bg-slate-950/50 rounded px-3 py-2 text-slate-300">{item.input}</div>
                    {item.latex ? (
                      <div className="bg-slate-950/70 rounded px-3 py-3 border border-slate-700/40 overflow-x-auto text-center">
                        <LatexBlock tex={item.latex} className="text-emerald-400 text-sm" />
                      </div>
                    ) : (
                      <div className="font-mono text-sm bg-slate-950/70 rounded px-3 py-2 border border-slate-700/40 text-emerald-400">{item.output}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick reference */}
          <details className="section-card group">
            <summary className="cursor-pointer flex items-center gap-2 font-semibold text-slate-300 text-sm select-none">
              <BookOpen className="h-4 w-4 text-violet-400" /> Quick Reference
              <ChevronDown className="h-4 w-4 ml-auto group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-3 grid sm:grid-cols-2 gap-4 text-sm">
              {[
                ['Algebra', 'violet', [
                  ['factor(x^2-4)', 'Factor'],['expand((x+1)^3)', 'Expand'],
                  ['simplify((x^2-1)/(x-1))', 'Simplify'],['solve(x^2-5*x+6=0,x)', 'Solve'],
                ]],
                ['Calculus', 'cyan', [
                  ['diff(x^3+2*x,x)', 'Derivative'],['integrate(x^2,x)', 'Integral'],
                  ['limit(sin(x)/x,x,0)', 'Limit'],['taylor(sin(x),x=0,5)', 'Taylor'],
                ]],
              ].map(([title, color, items]) => (
                <div key={title as string} className="space-y-1.5">
                  <p className={`font-medium text-${color}-400 text-xs uppercase tracking-wider`}>{title as string}</p>
                  {(items as [string, string][]).map(([expr, desc]) => (
                    <button key={expr} onClick={() => setInput(expr)}
                      className="w-full text-left flex items-center gap-2 hover:bg-slate-800/50 rounded px-2 py-1 transition-colors group">
                      <code className={`bg-slate-800/50 text-${color}-300 px-1.5 py-0.5 rounded text-xs flex-1`}>{expr}</code>
                      <span className="text-slate-600 text-xs group-hover:text-slate-400">{desc}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* ── GRAPH MODE ── */}
      {mode === 'graph' && (
        <div className="space-y-4">
          <div className="section-card space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Expression {graphMode === '2d' ? '(in x)' : '(in x, y)'}
              </label>
              <input
                type="text"
                value={graphExpr}
                onChange={(e) => setGraphExpr(e.target.value)}
                className="input-modern font-mono"
                placeholder={graphMode === '2d' ? 'e.g. sin(x)/x  or  x^2-4' : 'e.g. sin(x)*cos(y)  or  x^2+y^2'}
              />
            </div>

            {/* 2D/3D toggle */}
            <div className="flex gap-2">
              {(['2d', '3d'] as const).map(m => (
                <button key={m} onClick={() => { setGraphMode(m); setPlotData([]) }}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    graphMode === m ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}>
                  {m.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Range inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">x min</label>
                <input type="number" value={xMin} onChange={e => setXMin(e.target.value)} className="input-modern text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">x max</label>
                <input type="number" value={xMax} onChange={e => setXMax(e.target.value)} className="input-modern text-sm" />
              </div>
              {graphMode === '3d' && <>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500">y min</label>
                  <input type="number" value={yMin} onChange={e => setYMin(e.target.value)} className="input-modern text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500">y max</label>
                  <input type="number" value={yMax} onChange={e => setYMax(e.target.value)} className="input-modern text-sm" />
                </div>
              </>}
            </div>

            <button onClick={plotGraph}
              disabled={isPlotting || !giacLoaded || !graphExpr.trim()}
              className="btn-gradient disabled:opacity-40 disabled:cursor-not-allowed w-full">
              {isPlotting ? <><Loader2 className="h-4 w-4 animate-spin" /> Plotting…</> : <><BarChart2 className="h-4 w-4" /> Plot Graph</>}
            </button>

            {plotError && <p className="text-sm text-red-400">{plotError}</p>}
          </div>

          {/* Plot display */}
          {plotData.length > 0 && (
            <div className="section-card p-2 overflow-hidden">
              <Plot
                data={plotData}
                layout={{
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(15,23,42,0.8)',
                  font: { color: '#94a3b8', family: 'var(--font-sans)' },
                  margin: { t: 30, b: 40, l: 50, r: 20 },
                  xaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', title: { text: 'x' } },
                  yaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', title: { text: graphMode === '2d' ? 'y' : 'z' } },
                  scene: graphMode === '3d' ? {
                    xaxis: { gridcolor: '#1e293b', backgroundcolor: 'rgba(0,0,0,0)', title: { text: 'x' } },
                    yaxis: { gridcolor: '#1e293b', backgroundcolor: 'rgba(0,0,0,0)', title: { text: 'y' } },
                    zaxis: { gridcolor: '#1e293b', backgroundcolor: 'rgba(0,0,0,0)', title: { text: 'z' } },
                    bgcolor: 'rgba(0,0,0,0)',
                  } : undefined,
                  autosize: true,
                }}
                config={{ responsive: true, displayModeBar: true, displaylogo: false }}
                style={{ width: '100%', minHeight: '380px' }}
                useResizeHandler
              />
            </div>
          )}

          {/* Graph examples */}
          <div className="section-card space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Quick examples</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { expr: 'sin(x)/x', mode: '2d' as const, label: 'sinc(x)' },
                { expr: 'x^3-3*x', mode: '2d' as const, label: 'Cubic' },
                { expr: 'abs(x)', mode: '2d' as const, label: '|x|' },
                { expr: 'sin(x)*cos(y)', mode: '3d' as const, label: 'sin·cos 3D' },
                { expr: 'sin(sqrt(x^2+y^2))', mode: '3d' as const, label: 'Ripple 3D' },
                { expr: 'x^2+y^2', mode: '3d' as const, label: 'Paraboloid 3D' },
              ].map(ex => (
                <button key={ex.label}
                  onClick={() => { setGraphExpr(ex.expr); setGraphMode(ex.mode); setPlotData([]) }}
                  className="px-3 py-2 text-xs bg-slate-900/50 border border-slate-700/60 rounded-xl hover:bg-slate-800/50 hover:border-violet-500/30 transition-colors text-left">
                  <div className="text-slate-400 font-medium mb-0.5">{ex.label}</div>
                  <div className="font-mono text-slate-500 truncate">{ex.expr}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
