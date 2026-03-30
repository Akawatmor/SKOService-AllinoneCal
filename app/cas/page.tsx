'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Trash2, BookOpen, Info } from 'lucide-react'

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
    // Load Giac WASM library
    const script = document.createElement('script')
    script.src = '/wasm/giac.js'
    script.async = true
    script.onload = async () => {
      try {
        if (window.GiacWASM) {
          // Initialize the WASM module
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
      // Using Giac WASM evaluate function
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">CAS Calculator</h1>
          <p className="text-muted-foreground mt-1">Computer Algebra System powered by Giac</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">About CAS</p>
            <p>This calculator uses Giac WASM, a powerful Computer Algebra System for symbolic mathematics. Works completely offline!</p>
            {!giacLoaded && <p className="mt-1 text-blue-700 font-medium">⏳ Loading Giac engine...</p>}
            {giacLoaded && <p className="mt-1 text-green-700 font-medium">✓ Giac engine ready</p>}
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <BookOpen className="h-4 w-4" />
          Quick Examples
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {examples.map((ex) => (
            <button
              key={ex.label}
              onClick={() => insertExample(ex.expr)}
              className="px-3 py-2 text-sm bg-card border rounded-lg hover:bg-accent hover:border-primary/50 transition-colors text-left"
            >
              <div className="font-medium text-xs text-muted-foreground mb-1">{ex.label}</div>
              <div className="text-xs font-mono truncate">{ex.expr}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-card border rounded-xl p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Expression</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                evaluateExpression()
              }
            }}
            placeholder="Enter mathematical expression... (e.g., factor(x^2-4), solve(x^2=9,x), diff(x^3,x))"
            className="w-full px-4 py-3 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows={3}
          />
          <p className="text-xs text-muted-foreground">Press Ctrl+Enter to evaluate</p>
        </div>

        <button
          onClick={evaluateExpression}
          disabled={isLoading || !input.trim() || !giacLoaded}
          className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Play className="h-4 w-4" />
          {isLoading ? 'Evaluating...' : giacLoaded ? 'Evaluate' : 'Loading Giac...'}
        </button>

        {/* Output */}
        {output && (
          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium">Result</label>
            <div className="bg-accent/50 border rounded-lg p-4">
              <pre className="font-mono text-sm whitespace-pre-wrap break-words">{output}</pre>
            </div>
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">History</h2>
            <button
              onClick={clearHistory}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border rounded-lg hover:bg-accent transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          </div>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div key={item.timestamp} className="bg-card border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                  <button
                    onClick={() => setInput(item.input)}
                    className="text-xs text-primary hover:underline"
                  >
                    Reuse
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Input:</div>
                  <div className="font-mono text-sm bg-accent/30 rounded px-3 py-2">{item.input}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Output:</div>
                  <div className="font-mono text-sm bg-accent/50 rounded px-3 py-2 border">{item.output}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-card border rounded-xl p-6 space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Common Functions
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="font-medium text-muted-foreground">Algebra</p>
            <ul className="space-y-1 text-muted-foreground">
              <li><code className="bg-accent px-1.5 py-0.5 rounded">factor(expr)</code> - Factor expression</li>
              <li><code className="bg-accent px-1.5 py-0.5 rounded">expand(expr)</code> - Expand expression</li>
              <li><code className="bg-accent px-1.5 py-0.5 rounded">simplify(expr)</code> - Simplify expression</li>
              <li><code className="bg-accent px-1.5 py-0.5 rounded">solve(eq, var)</code> - Solve equation</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-muted-foreground">Calculus</p>
            <ul className="space-y-1 text-muted-foreground">
              <li><code className="bg-accent px-1.5 py-0.5 rounded">diff(expr, var)</code> - Derivative</li>
              <li><code className="bg-accent px-1.5 py-0.5 rounded">integrate(expr, var)</code> - Integral</li>
              <li><code className="bg-accent px-1.5 py-0.5 rounded">limit(expr, var=val)</code> - Limit</li>
              <li><code className="bg-accent px-1.5 py-0.5 rounded">taylor(expr, var=val)</code> - Taylor series</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
