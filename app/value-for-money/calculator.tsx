"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Trash2, Award, Minus, Equal } from "lucide-react"

interface Item {
  id: number;
  price: string;
  quantity: string;
  unitsPerPack: string;
  name: string;
}

function Stepper({
  value,
  onChange,
  min = 0.01,
  step = 1,
  placeholder = "1",
}: {
  value: string;
  onChange: (v: string) => void;
  min?: number;
  step?: number;
  placeholder?: string;
}) {
  const dec = () => {
    const n = parseFloat(value) - step
    if (!isNaN(n) && n >= min) onChange(String(n))
  }
  const inc = () => {
    const n = (parseFloat(value) || 0) + step
    onChange(String(n))
  }
  return (
    <div className="flex items-center rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900/80">
      <button
        type="button"
        onClick={dec}
        className="px-4 py-3 text-slate-300 hover:bg-slate-700/50 active:bg-slate-700 transition-colors"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent text-center text-slate-100 font-semibold focus:outline-none py-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        min={min}
        step={step}
      />
      <button
        type="button"
        onClick={inc}
        className="px-4 py-3 text-slate-300 hover:bg-slate-700/50 active:bg-slate-700 transition-colors"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function ValueCalculator() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, price: '', quantity: '1', unitsPerPack: '1', name: 'Option A' },
    { id: 2, price: '', quantity: '1', unitsPerPack: '1', name: 'Option B' }
  ])
  const resultsRef = useRef<HTMLDivElement>(null)
  const prevValidCount = useRef(0)

  const addItem = () => {
    setItems([...items, { id: Date.now(), price: '', quantity: '1', unitsPerPack: '1', name: `Option ${String.fromCharCode(65 + items.length)}` }])
  }

  const removeItem = (id: number) => {
    if (items.length > 2) setItems(items.filter(i => i.id !== id))
  }

  const updateItem = (id: number, field: keyof Item, value: string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const calculateUnit = (item: Item) => {
    const p = parseFloat(item.price)
    const q = parseFloat(item.quantity)
    const u = parseFloat(item.unitsPerPack) || 1
    if (!p || !q || !u) return 0
    return p / (q * u)
  }

  const getTotalUnits = (item: Item) => {
    const q = parseFloat(item.quantity)
    const u = parseFloat(item.unitsPerPack) || 1
    return (q && u) ? q * u : 0
  }

  const results = items.map(item => ({
    ...item,
    unitPrice: calculateUnit(item),
    totalUnits: getTotalUnits(item)
  }))

  const validItems = results.filter(i => i.unitPrice > 0)
  const minPrice = validItems.length > 0 ? Math.min(...validItems.map(i => i.unitPrice)) : Infinity
  const winners = validItems.filter(i => Math.abs(i.unitPrice - minPrice) < 1e-10)
  const isTie = winners.length > 1 && winners.length === validItems.length
  const hasResult = validItems.length >= 2

  // Auto-scroll to results when they first appear
  useEffect(() => {
    if (hasResult && validItems.length > prevValidCount.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    }
    prevValidCount.current = validItems.length
  }, [hasResult, validItems.length])

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* Input Section */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const isWinner = winners.some(w => w.id === item.id) && hasResult
          const unitPrice = calculateUnit(item)

          return (
            <div
              key={item.id}
              className={`section-card transition-all duration-300 ${
                isWinner && !isTie
                  ? 'ring-2 ring-emerald-500/60 border-emerald-500/30'
                  : isWinner && isTie
                    ? 'ring-2 ring-amber-500/60 border-amber-500/30'
                    : ''
              }`}
            >
              {/* Header row */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  isWinner && !isTie ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  {isWinner && !isTie ? <Award className="h-4 w-4" /> : String.fromCharCode(65 + idx)}
                </div>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  className="flex-1 bg-transparent border-b border-slate-700/60 focus:border-violet-500/50 text-slate-100 font-semibold text-base py-1 focus:outline-none"
                  placeholder="Product name..."
                />
                {isWinner && !isTie && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">BEST</span>
                )}
                {isWinner && isTie && (
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">TIE</span>
                )}
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={items.length <= 2}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Price field */}
              <div className="mb-4">
                <label className="text-xs font-medium text-slate-500 block mb-1.5">Total Price (฿)</label>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                  className="input-modern text-lg font-semibold"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              {/* Quantity + Units with steppers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">Quantity (Packs)</label>
                  <Stepper
                    value={item.quantity}
                    onChange={(v) => updateItem(item.id, 'quantity', v)}
                    min={0.01}
                    step={1}
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">Units / Pack</label>
                  <Stepper
                    value={item.unitsPerPack}
                    onChange={(v) => updateItem(item.id, 'unitsPerPack', v)}
                    min={1}
                    step={1}
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Inline summary when filled */}
              {unitPrice > 0 && (
                <div className="mt-3 flex gap-3 pt-3 border-t border-slate-700/40">
                  <div className="flex-1 text-center">
                    <div className="text-xs text-slate-500 mb-0.5">Total units</div>
                    <div className="font-semibold text-slate-200">{getTotalUnits(item).toLocaleString()}</div>
                  </div>
                  <div className="w-px bg-slate-700/40" />
                  <div className="flex-1 text-center">
                    <div className="text-xs text-slate-500 mb-0.5">Price / unit</div>
                    <div className={`font-mono font-bold ${isWinner && !isTie ? 'text-emerald-400' : 'text-slate-200'}`}>
                      ฿{unitPrice.toFixed(4)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add option button */}
      <button
        onClick={addItem}
        className="w-full py-3.5 border-2 border-dashed border-slate-700/50 rounded-2xl text-slate-500 font-medium hover:border-violet-500/50 hover:text-violet-400 hover:bg-violet-500/5 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" /> Add Another Option
      </button>

      {/* Results section — auto-scroll target, shown BELOW inputs */}
      <div ref={resultsRef}>
        {hasResult && (
          <div className="space-y-4 pt-2">
            {/* Winner / Tie banner */}
            {isTie ? (
              <div className="section-card border-amber-500/30 bg-amber-500/5">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500 p-2.5 rounded-full">
                    <Equal className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-amber-300 text-lg">It&apos;s a Tie!</div>
                    <div className="text-sm text-slate-400">All options have the same price per unit — choose by preference.</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="section-card border-emerald-500/30 bg-emerald-500/5">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-500 p-2.5 rounded-full shrink-0">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-emerald-300 text-lg mb-3">
                      🏆 Best Value: {winners[0].name}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-black/20 rounded-xl p-3 text-center">
                        <div className="text-xs text-emerald-500 mb-1">Price / Unit</div>
                        <div className="font-mono font-bold text-emerald-300 text-xl">฿{winners[0].unitPrice.toFixed(4)}</div>
                      </div>
                      <div className="bg-black/20 rounded-xl p-3 text-center">
                        <div className="text-xs text-slate-500 mb-1">Total Units</div>
                        <div className="font-bold text-slate-200 text-xl">{winners[0].totalUnits.toLocaleString()}</div>
                      </div>
                      <div className="bg-black/20 rounded-xl p-3 text-center">
                        <div className="text-xs text-slate-500 mb-1">Total Price</div>
                        <div className="font-mono font-bold text-slate-200 text-xl">฿{parseFloat(winners[0].price).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comparison table */}
            <div className="section-card overflow-hidden p-0">
              <div className="px-4 py-3 border-b border-slate-700/60">
                <h3 className="font-semibold text-slate-200 text-sm">Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/40">
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Option</th>
                      <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500">฿/Unit</th>
                      <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500">Units</th>
                      <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500">vs Best</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...validItems]
                      .sort((a, b) => a.unitPrice - b.unitPrice)
                      .map((item) => {
                        const isW = winners.some(w => w.id === item.id)
                        const pct = isTie ? 0 : ((item.unitPrice - minPrice) / minPrice) * 100
                        return (
                          <tr key={item.id} className={`border-b border-slate-700/30 last:border-0 ${isW && !isTie ? 'bg-emerald-500/5' : ''}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                {isW && !isTie && <Award className="h-3.5 w-3.5 text-emerald-400" />}
                                {isW && isTie && <Equal className="h-3.5 w-3.5 text-amber-400" />}
                                <span className={isW ? 'font-semibold text-slate-200' : 'text-slate-400'}>{item.name}</span>
                              </div>
                            </td>
                            <td className={`text-right px-4 py-3 font-mono font-semibold ${isW && !isTie ? 'text-emerald-400' : 'text-slate-300'}`}>
                              ฿{item.unitPrice.toFixed(4)}
                            </td>
                            <td className="text-right px-4 py-3 text-slate-400">{item.totalUnits.toLocaleString()}</td>
                            <td className="text-right px-4 py-3">
                              {isW && !isTie ? (
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">BEST</span>
                              ) : isTie ? (
                                <span className="text-xs font-bold text-amber-400">EQUAL</span>
                              ) : (
                                <span className="text-xs text-red-400 font-medium">+{pct.toFixed(1)}%</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
