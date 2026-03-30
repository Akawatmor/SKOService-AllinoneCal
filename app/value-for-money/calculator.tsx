"use client"

import { useState } from "react"
import { Plus, Trash2, TrendingDown, AlertCircle, Award } from "lucide-react"

interface Item {
  id: number;
  price: string;
  quantity: string;
  unitsPerPack: string;
  name: string;
}

export default function ValueCalculator() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, price: '', quantity: '', unitsPerPack: '1', name: 'Option A' },
    { id: 2, price: '', quantity: '', unitsPerPack: '1', name: 'Option B' }
  ])

  const addItem = () => {
    setItems([...items, { id: Date.now(), price: '', quantity: '', unitsPerPack: '1', name: `Option ${String.fromCharCode(65 + items.length)}` }])
  }

  const removeItem = (id: number) => {
    if (items.length > 2) {
      setItems(items.filter(i => i.id !== id))
    }
  }

  const updateItem = (id: number, field: keyof Item, value: string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const calculateUnit = (item: Item) => {
    const p = parseFloat(item.price)
    const q = parseFloat(item.quantity)
    const u = parseFloat(item.unitsPerPack) || 1
    if (!p || !q || !u) return 0
    const totalUnits = q * u
    return p / totalUnits
  }

  const getTotalUnits = (item: Item) => {
    const q = parseFloat(item.quantity)
    const u = parseFloat(item.unitsPerPack) || 1
    if (!q || !u) return 0
    return q * u
  }

  const results = items.map(item => ({
    ...item,
    unitPrice: calculateUnit(item),
    totalUnits: getTotalUnits(item)
  }))

  const validItems = results.filter(i => i.unitPrice > 0)
  const bestValue = validItems.length > 0 
    ? validItems.reduce((prev, curr) => prev.unitPrice < curr.unitPrice ? prev : curr)
    : null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Best Value Summary - แสดงผลชัดเจนก่อน */}
      {bestValue && validItems.length > 1 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-400 dark:border-green-700 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-green-500 text-white p-3 rounded-full">
              <Award className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                🏆 Best Value: {bestValue.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3">
                  <div className="text-xs text-green-700 dark:text-green-400 font-medium mb-1">Price per Unit</div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100 font-mono">
                    ฿{bestValue.unitPrice.toFixed(2)}
                  </div>
                </div>
                <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3">
                  <div className="text-xs text-green-700 dark:text-green-400 font-medium mb-1">Total Units</div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {bestValue.totalUnits.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3">
                  <div className="text-xs text-green-700 dark:text-green-400 font-medium mb-1">Total Price</div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    ฿{parseFloat(bestValue.price).toFixed(2)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                This option gives you the lowest cost per unit compared to other options.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {validItems.length > 1 && (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 border-b">
            <h3 className="font-semibold text-sm">Quick Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 border-b">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Option</th>
                  <th className="text-right px-4 py-2 font-medium">Price/Unit</th>
                  <th className="text-right px-4 py-2 font-medium">Total Units</th>
                  <th className="text-right px-4 py-2 font-medium">Total Price</th>
                  <th className="text-right px-4 py-2 font-medium">vs Best</th>
                </tr>
              </thead>
              <tbody>
                {validItems
                  .sort((a, b) => a.unitPrice - b.unitPrice)
                  .map((item) => {
                    const isBest = item.id === bestValue?.id
                    const priceDiff = bestValue ? ((item.unitPrice - bestValue.unitPrice) / bestValue.unitPrice) * 100 : 0
                    return (
                      <tr key={item.id} className={`border-b last:border-0 ${isBest ? 'bg-green-50/50 dark:bg-green-950/20' : ''}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {isBest && <Award className="h-4 w-4 text-green-600" />}
                            <span className={isBest ? 'font-semibold' : ''}>{item.name}</span>
                          </div>
                        </td>
                        <td className={`text-right px-4 py-3 font-mono ${isBest ? 'font-bold text-green-600' : ''}`}>
                          ฿{item.unitPrice.toFixed(4)}
                        </td>
                        <td className="text-right px-4 py-3">
                          {item.totalUnits.toLocaleString()}
                        </td>
                        <td className="text-right px-4 py-3 font-mono">
                          ฿{parseFloat(item.price).toFixed(2)}
                        </td>
                        <td className="text-right px-4 py-3">
                          {isBest ? (
                            <span className="text-green-600 font-semibold">BEST</span>
                          ) : (
                            <span className="text-red-600">+{priceDiff.toFixed(1)}%</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Input Section - รายละเอียด */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground">Enter Options</h3>
        
        <div className="space-y-3">
          {items.map((item) => {
            const isBest = bestValue && bestValue.id === item.id && validItems.length > 1
            
            return (
              <div 
                key={item.id} 
                className={`relative bg-card border rounded-xl p-4 transition-all ${isBest ? 'border-green-500/50' : 'hover:border-primary/30'}`}
              >
                {isBest && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" /> BEST
                  </div>
                )}

                <div className="space-y-3">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Product Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      className="w-full bg-background border px-3 py-2 rounded-md text-sm font-medium"
                      placeholder="e.g., Water Pack 12x"
                    />
                  </div>

                  {/* Price, Quantity, Units per Pack */}
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-4">
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Total Price (฿)</label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                        className="w-full bg-background border px-3 py-2 rounded-md text-sm font-semibold"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Quantity (Packs)</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                        className="w-full bg-background border px-3 py-2 rounded-md text-sm"
                        placeholder="1"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Units/Pack</label>
                      <input
                        type="number"
                        value={item.unitsPerPack}
                        onChange={(e) => updateItem(item.id, 'unitsPerPack', e.target.value)}
                        className="w-full bg-background border px-3 py-2 rounded-md text-sm"
                        placeholder="1"
                        step="1"
                      />
                    </div>
                  </div>

                  {/* Calculation Summary */}
                  {item.price && item.quantity && (
                    <div className="bg-muted/30 rounded-lg p-3 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Units:</span>
                        <span className="font-medium">{getTotalUnits(item).toLocaleString()} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price per Unit:</span>
                        <span className={`font-mono font-semibold ${isBest ? 'text-green-600' : ''}`}>
                          {calculateUnit(item) > 0 ? `฿${calculateUnit(item).toFixed(4)}` : '-'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delete Button */}
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-30"
                  disabled={items.length <= 2}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <button
        onClick={addItem}
        className="w-full py-3 border-2 border-dashed border-muted-foreground/25 rounded-xl text-muted-foreground font-medium hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" /> Add Another Option
      </button>

    </div>
  )
}
