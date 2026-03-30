'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Trash2, BookOpen, Info, Sigma } from 'lucide-react'
import PageHeader from '../components/PageHeader'

interface HistoryItem {
  input: string
  output: string
  timestamp: number
}

declare global {
  interface Window {
    GiacWASM?: any
  }
}

export default function CASPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [giacLoaded, setGiacLoaded] = useState(false)
  const giacModuleRef = useRef<any>(null)

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
          console.log('Giac WASM loaded successfully')
        }
      } catch (error) {
        console.error('Failed to load Giac WASM:', error)
      }
    }
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const evaluateExpression = () => {
    if (!input.trim() || !giacModuleRef.current) return

    setIsLoading(true)
    try {
      const result = giacModuleRef.current.evaluate(input)
      
      setOutput(result || 'No result')
      setHistory([
        {
          input: input,
          output: result || 'No result',
          timestamp: Date.now()
        },
        ...history
      ])
    } catch (error) {
      const errorMsg = `Error: ${error instanceof Error ? error.message : 'Unable to evaluate expression'}`
      console.error('Giac evaluation error:', error)
      setOutput(errorMsg)
      setHistory([
        {
          input: input,
          output: errorMsg,
          timestamp: Date.now()
        },
        ...history
      ])
    }
    setIsLoading(false)
  }

  const clearHistory = () => {
    setHistory([])
    setOutput('')
  }

  const insertExample = (example: string) => {
    setInput(example)
  }

  const examples = [
    { label: 'Factor', expr: 'factor(x^2 - 4)' },
    { label: 'Solve', expr: 'solve(x^2 - 5*x + 6 = 0, x)' },
    { label: 'Derivative', expr: 'diff(x^3 + 2*x^2, x)' },
    { label: 'Integral', expr: 'integrate(x^2, x)' },
    { label: 'Expand', expr: 'expand((x+1)^3)' },
    { label: 'Simplify', expr: 'simplify((x^2-1)/(x-1))' },
  ]

  return (
    <div className="page-container space-y-6">
      <PageHeader
        title="CAS Calculator"
        description="Computer Algebra System powered by Giac"
        icon={Sigma}
        color="pink"
        badge={giacLoaded ? "Ready" : "Loading..."}
      />

      {/* Info Banner */}
      <div className="section-card border-cyan-500/30 bg-cyan-500/5">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-cyan-300 mb-1">About CAS</p>
            <p className="text-slate-400">This calculator uses Giac WASM, a powerful Computer Algebra System for symbolic mathematics. Works completely offline!</p>
            {!giacLoaded && <p className="mt-1 text-amber-400 font-medium">⏳ Loading Giac engine...</p>}
            {giacLoaded && <p className="mt-1 text-emerald-400 font-medium">✓ Giac engine ready</p>}
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <BookOpen className="h-4 w-4" />
          Quick Examples
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {examples.map((ex) => (
            <button
              key={ex.label}
              onClick={() => insertExample(ex.expr)}
              className="px-3 py-2 text-sm bg-slate-900/50 border border-slate-700/60 rounded-xl hover:bg-slate-800/50 hover:border-violet-500/30 transition-colors text-left"
            >
              <div className="font-medium text-xs text-slate-500 mb-1">{ex.label}</div>
              <div className="text-xs font-mono text-slate-300 truncate">{ex.expr}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="section-card space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Expression</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                evaluateExpression()
              }
            }}
            placeholder="Enter mathematical expression... (e.g., factor(x^2-4), solve(x^2=9,x), diff(x^3,x))"
            className="input-modern font-mono text-sm resize-none"
            rows={3}
          />
          <p className="text-xs text-slate-500">Press Ctrl+Enter to evaluate</p>
        </div>

        <button
          onClick={evaluateExpression}
          disabled={isLoading || !input.trim() || !giacLoaded}
          className="btn-gradient disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="h-4 w-4" />
          {isLoading ? 'Evaluating...' : giacLoaded ? 'Evaluate' : 'Loading Giac...'}
        </button>

        {output && (
          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium text-slate-300">Result</label>
            <div className="bg-slate-950/50 border border-slate-700/60 rounded-xl p-4">
              <pre className="font-mono text-sm whitespace-pre-wrap break-words text-emerald-400">{output}</pre>
            </div>
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">History</h2>
            <button onClick={clearHistory} className="btn-ghost text-sm py-1.5 px-3">
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          </div>
          <div className="space-y-2">
            {history.map((item) => (
              <div key={item.timestamp} className="section-card space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs text-slate-500">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                  <button
                    onClick={() => setInput(item.input)}
                    className="text-xs text-violet-400 hover:text-violet-300"
                  >
                    Reuse
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-500">Input:</div>
                  <div className="font-mono text-sm bg-slate-950/50 rounded px-3 py-2 text-slate-300">{item.input}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-500">Output:</div>
                  <div className="font-mono text-sm bg-slate-950/80 rounded px-3 py-2 border border-slate-700/60 text-emerald-400">{item.output}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="section-card space-y-3">
        <h3 className="font-semibold flex items-center gap-2 text-white">
          <BookOpen className="h-5 w-5 text-violet-400" />
          Common Functions
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="font-medium text-slate-400">Algebra</p>
            <ul className="space-y-1 text-slate-500">
              <li><code className="bg-slate-800/50 text-violet-300 px-1.5 py-0.5 rounded">factor(expr)</code> - Factor expression</li>
              <li><code className="bg-slate-800/50 text-violet-300 px-1.5 py-0.5 rounded">expand(expr)</code> - Expand expression</li>
              <li><code className="bg-slate-800/50 text-violet-300 px-1.5 py-0.5 rounded">simplify(expr)</code> - Simplify expression</li>
              <li><code className="bg-slate-800/50 text-violet-300 px-1.5 py-0.5 rounded">solve(eq, var)</code> - Solve equation</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-slate-400">Calculus</p>
            <ul className="space-y-1 text-slate-500">
              <li><code className="bg-slate-800/50 text-cyan-300 px-1.5 py-0.5 rounded">diff(expr, var)</code> - Derivative</li>
              <li><code className="bg-slate-800/50 text-cyan-300 px-1.5 py-0.5 rounded">integrate(expr, var)</code> - Integral</li>
              <li><code className="bg-slate-800/50 text-cyan-300 px-1.5 py-0.5 rounded">limit(expr, var=val)</code> - Limit</li>
              <li><code className="bg-slate-800/50 text-cyan-300 px-1.5 py-0.5 rounded">taylor(expr, var=val)</code> - Taylor series</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
