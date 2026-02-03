"use client"

import { useState, useEffect } from "react"
import { ArrowDownUp } from "lucide-react"
import { UnitCategory, unitCategories, units, convert } from "@/lib/units"
import { cn } from "@/lib/utils"

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length')
  const [amount, setAmount] = useState<string>("1")
  const [fromUnit, setFromUnit] = useState<string>(units.length[0].id)
  const [toUnit, setToUnit] = useState<string>(units.length[1].id)
  const [result, setResult] = useState<number>(0)

  // Update defaults when category changes
  useEffect(() => {
    setFromUnit(units[category][0].id)
    setToUnit(units[category][1]?.id || units[category][0].id)
  }, [category])

  useEffect(() => {
    const val = parseFloat(amount)
    if (!isNaN(val)) {
      setResult(convert(val, fromUnit, toUnit, category))
    }
  }, [amount, fromUnit, toUnit, category])

  return (
    <div className="max-w-md mx-auto space-y-8">
      
      {/* Category Selection */}
      <div className="grid grid-cols-4 gap-2 bg-muted p-1 rounded-lg">
        {Object.entries(unitCategories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setCategory(key as UnitCategory)}
            className={cn(
              "py-2 px-1 text-xs sm:text-sm font-medium rounded-md transition-all",
              category === key 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-background/50"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
        
        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-3xl font-bold bg-transparent border-0 border-b-2 border-border focus:border-primary focus:ring-0 px-0 py-2 transition-colors placeholder:text-muted/30"
            placeholder="0"
          />
        </div>

        <div className="grid gap-4 items-center">
          {/* From Unit */}
          <div className="grid gap-1.5">
            <label className="text-xs font-semibold uppercase text-muted-foreground">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-2.5 bg-muted/50 border rounded-lg hover:bg-muted transition-colors"
            >
              {units[category].map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center -my-2 z-10">
            <button 
              onClick={() => {
                const temp = fromUnit
                setFromUnit(toUnit)
                setToUnit(temp)
              }}
              className="bg-card border p-2 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* To Unit */}
          <div className="grid gap-1.5">
            <label className="text-xs font-semibold uppercase text-muted-foreground">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-2.5 bg-muted/50 border rounded-lg hover:bg-muted transition-colors"
            >
              {units[category].map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result */}
        <div className="mt-8 pt-6 border-t">
          <label className="text-sm font-medium text-muted-foreground">Result</label>
          <div className="text-4xl font-bold text-primary break-words mt-1">
             {parseFloat(result.toFixed(6))}
             <span className="text-lg ml-2 text-muted-foreground font-normal">
               {units[category].find(u => u.id === toUnit)?.id}
             </span>
          </div>
        </div>

      </div>
    </div>
  )
}
