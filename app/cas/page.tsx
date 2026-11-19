'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Sigma, BarChart2, Calculator, Loader2 } from 'lucide-react'
import ScientificCalculator, { type GiacEngine } from './calculator'

// Lazy-load Plotly to keep initial bundle small
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => (
  <div className="flex items-center justify-center h-64 text-slate-500 text-sm gap-2">
    <Loader2 className="h-4 w-4 animate-spin" /> Loading graph engine…
  </div>
) })

declare global { interface Window { GiacWASM?: () => Promise<GiacEngine> } }

export default function CASPage() {
  const [mode, setMode] = useState<'calc' | 'graph'>('calc')
  const [openedGraph, setOpenedGraph] = useState(false)
  const [engine, setEngine] = useState<GiacEngine | null>(null)
  const [engineStatus, setEngineStatus] = useState<'loading' | 'ready' | 'error'>('loading')

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

  useEffect(() => {
    let active = true
    const script = document.createElement('script')
    script.src = '/wasm/giac.js'
    script.async = true
    const fail = () => { if (active) setEngineStatus('error') }
    script.onload = async () => {
      try {
        const module = await window.GiacWASM?.()
        if (!active) return
        if (!module) return fail()
        setEngine(module)
        setEngineStatus('ready')
      } catch { fail() }
    }
    script.onerror = fail
    document.body.append(script)
    return () => {
      active = false
      script.remove()
    }
  }, [])

  // Plot function
  const plotGraph = useCallback(async () => {
    if (!engine) return
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
            const r = engine.evaluate(`evalf(${graphExpr} where x=${x})`)
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
              const r = engine.evaluate(`evalf(${graphExpr} where x=${x},y=${y})`)
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
  }, [engine, graphExpr, graphMode, xMin, xMax, yMin, yMax])

  return (
    <div className="page-container space-y-4 py-5 md:py-7">
      <header className={`flex flex-wrap items-center justify-between gap-3 ${mode === 'calc' ? 'mx-auto max-w-[47rem]' : ''}`}>
        <h1 className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">
          <Sigma className="h-6 w-6 text-violet-300" aria-hidden="true" /> เครื่องคิดเลข CAS
        </h1>
        <div className="flex gap-1 rounded-xl border border-slate-700/70 bg-slate-900/80 p-1" role="group" aria-label="โหมด CAS">
          {([['calc', Calculator, 'คำนวณ'], ['graph', BarChart2, 'กราฟ']] as const).map(([value, Icon, label]) => (
            <button key={value} type="button" aria-pressed={mode === value} onClick={() => {
              if (value === 'graph') setOpenedGraph(true)
              setMode(value)
            }}
              className={`flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium ${
                mode === value ? 'bg-violet-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}>
              <Icon className="h-4 w-4" aria-hidden="true" />{label}
            </button>
          ))}
        </div>
      </header>

      <div hidden={mode !== 'calc'}>
        <ScientificCalculator engine={engine} engineStatus={engineStatus} />
      </div>

      {/* ── GRAPH MODE ── */}
      {openedGraph && (
        <div className="space-y-4" hidden={mode !== 'graph'}>
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
              disabled={isPlotting || !engine || !graphExpr.trim()}
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
