"use client"

import { useState } from "react"
import { Plus, Minus, X, Divide, Trash2, ArrowDown, RotateCcw } from "lucide-react"

type Operator = 'add' | 'subtract' | 'multiply' | 'divide';

interface Step {
  id: number;
  operator: Operator;
  value: number;
  label?: string;
  runningTotal: number;
}

export default function ChainCalculator() {
  const [initialValue, setInitialValue] = useState<string>("0")
  const [initialLabel, setInitialLabel] = useState<string>("Start Value")
  
  const [steps, setSteps] = useState<Omit<Step, 'runningTotal'>[]>([])

  // Recalculate totals
  const calculatedSteps: Step[] = []
  let currentTotal = parseFloat(initialValue) || 0
  
  steps.forEach(step => {
    let newVal = currentTotal
    switch (step.operator) {
      case 'add': newVal += step.value; break;
      case 'subtract': newVal -= step.value; break;
      case 'multiply': newVal *= step.value; break;
      case 'divide': newVal /= step.value === 0 ? 1 : step.value; break; // Avoid div by zero crash
    }
    calculatedSteps.push({ ...step, runningTotal: newVal })
    currentTotal = newVal
  })

  const addStep = (op: Operator) => {
    setSteps([...steps, { id: Date.now(), operator: op, value: 0, label: '' }])
  }

  const updateStep = (id: number, field: keyof Step, val: any) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: val } : s))
  }

  const removeStep = (id: number) => {
    setSteps(steps.filter(s => s.id !== id))
  }

  const reset = () => {
    if (confirm("Clear all steps?")) {
      setSteps([])
      setInitialValue("0")
    }
  }

  return (
    <div className="max-w-md mx-auto relative pb-24">
      
      {/* Starting Block */}
      <div className="bg-card border rounded-xl p-4 shadow-sm z-10 relative">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Starting Point</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-muted/50 border-0 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
            placeholder="Label (e.g. Salary)"
            value={initialLabel}
            onChange={(e) => setInitialLabel(e.target.value)}
          />
          <input
            type="number"
            className="w-1/3 bg-background border rounded-md px-3 py-2 text-right font-mono font-bold"
            value={initialValue}
            onChange={(e) => setInitialValue(e.target.value)}
          />
        </div>
      </div>

      {/* Chain */}
      <div className="pl-6 border-l-2 border-dashed border-muted ml-6 space-y-4 py-6">
        {calculatedSteps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Connector Dot */}
            <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-muted-foreground flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            </div>

            <div className="bg-card border rounded-lg p-3 shadow-sm group">
              <div className="flex gap-2 items-center mb-2">
                <div className={`p-1.5 rounded text-white shadow-sm shrink-0
                  ${step.operator === 'add' ? 'bg-green-500' : ''}
                  ${step.operator === 'subtract' ? 'bg-red-500' : ''}
                  ${step.operator === 'multiply' ? 'bg-blue-500' : ''}
                  ${step.operator === 'divide' ? 'bg-orange-500' : ''}
                `}>
                  {step.operator === 'add' && <Plus className="h-4 w-4" />}
                  {step.operator === 'subtract' && <Minus className="h-4 w-4" />}
                  {step.operator === 'multiply' && <X className="h-4 w-4" />}
                  {step.operator === 'divide' && <Divide className="h-4 w-4" />}
                </div>
                
                <input
                   type="text"
                   placeholder="Description"
                   className="flex-1 min-w-0 bg-transparent text-sm focus:outline-none border-b border-transparent focus:border-border"
                   value={step.label}
                   onChange={(e) => updateStep(step.id, 'label', e.target.value)}
                />

                <button onClick={() => removeStep(step.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex justify-between items-center bg-muted/30 p-2 rounded">
                 <input
                    type="number"
                    className="bg-transparent font-mono text-lg font-bold w-1/2 focus:outline-none"
                    value={step.value === 0 ? '' : step.value}
                    onChange={(e) => updateStep(step.id, 'value', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                 />
                 <div className="text-right">
                    <span className="text-xs text-muted-foreground block">Running Total</span>
                    <span className="font-mono font-medium text-primary">{parseFloat(step.runningTotal.toFixed(4))}</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        <button onClick={() => addStep('add')} className="flex flex-col items-center gap-1 p-3 bg-card border rounded-xl hover:bg-green-50 hover:border-green-200 transition-colors">
          <Plus className="h-5 w-5 text-green-600" /> <span className="text-[10px] font-medium">Add</span>
        </button>
        <button onClick={() => addStep('subtract')} className="flex flex-col items-center gap-1 p-3 bg-card border rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors">
          <Minus className="h-5 w-5 text-red-600" /> <span className="text-[10px] font-medium">Sub</span>
        </button>
        <button onClick={() => addStep('multiply')} className="flex flex-col items-center gap-1 p-3 bg-card border rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors">
          <X className="h-5 w-5 text-blue-600" /> <span className="text-[10px] font-medium">Mult</span>
        </button>
        <button onClick={() => addStep('divide')} className="flex flex-col items-center gap-1 p-3 bg-card border rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-colors">
          <Divide className="h-5 w-5 text-orange-600" /> <span className="text-[10px] font-medium">Div</span>
        </button>
      </div>

      {/* Final Result Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-md mx-auto flex justify-between items-center">
            <button onClick={reset} className="p-2 text-muted-foreground hover:bg-muted rounded-full">
               <RotateCcw className="h-5 w-5" />
            </button>
            <div className="text-right">
              <span className="text-sm font-medium text-muted-foreground mr-2">Final Total</span>
              <span className="text-3xl font-bold font-mono tracking-tight text-primary">
                {parseFloat(currentTotal.toFixed(4))}
              </span>
            </div>
        </div>
      </div>

    </div>
  )
}
