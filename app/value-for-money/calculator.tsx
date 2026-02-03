"use client"

import { useState } from "react"
import { Plus, Trash2, TrendingDown, AlertCircle } from "lucide-react"

interface Item {
  id: number;
  price: string;
  quantity: string;
  name: string;
}

export default function ValueCalculator() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, price: '', quantity: '', name: 'Option A' },
    { id: 2, price: '', quantity: '', name: 'Option B' }
  ])

  const addItem = () => {
    setItems([...items, { id: Date.now(), price: '', quantity: '', name: `Option ${String.fromCharCode(65 + items.length)}` }])
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
    if (!p || !q) return 0
    return p / q
  }

  const results = items.map(item => ({
    ...item,
    unitPrice: calculateUnit(item)
  }))

  const validItems = results.filter(i => i.unitPrice > 0)
  const bestValue = validItems.length > 0 
    ? validItems.reduce((prev, curr) => prev.unitPrice < curr.unitPrice ? prev : curr)
    : null

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      <div className="space-y-4">
        {items.map((item, index) => {
          const isBest = bestValue && bestValue.id === item.id && validItems.length > 1
          
          return (
            <div 
              key={item.id} 
              className={`relative bg-card border rounded-xl p-4 transition-all ${isBest ? 'ring-2 ring-green-500 border-green-500 bg-green-50/10' : 'hover:border-primary/30'}`}
            >
              {isBest && (
                <div className="absolute -top-3 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" /> BEST VALUE
                </div>
              )}

              <div className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-12 sm:col-span-4">
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    className="w-full bg-background border px-3 py-2 rounded-md text-sm"
                    placeholder="Product Name"
                  />
                </div>
                <div className="col-span-5 sm:col-span-3">
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Total Price</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                    className="w-full bg-background border px-3 py-2 rounded-md text-sm font-semibold"
                    placeholder="0.00"
                  />
                </div>
                <div className="col-span-5 sm:col-span-3">
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Quantity/Vol</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                    className="w-full bg-background border px-3 py-2 rounded-md text-sm"
                    placeholder="1"
                  />
                </div>
                <div className="col-span-2 sm:col-span-2 flex justify-end">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-30"
                    disabled={items.length <= 2}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Result Row */}
              <div className="mt-3 pt-3 border-t flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Price per unit:</span>
                <span className={`font-mono font-medium ${isBest ? 'text-green-600 font-bold' : ''}`}>
                  {calculateUnit(item) > 0 ? calculateUnit(item).toFixed(4) : '-'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={addItem}
        className="w-full py-3 border-2 border-dashed border-muted-foreground/25 rounded-xl text-muted-foreground font-medium hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" /> Add Another Option
      </button>

      {/* Summary Box if result exists */}
      {bestValue && validItems.length > 1 && (
        <div className="bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex gap-3 text-green-800 dark:text-green-300">
           <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
           <div className="text-sm">
             <p className="font-bold">Recommendation</p>
             <p>
               <span className="font-semibold underline">{bestValue.name}</span> is the most cost-effective option.
               It costs <span className="font-mono">{bestValue.unitPrice.toFixed(4)}</span> per unit.
             </p>
           </div>
        </div>
      )}

    </div>
  )
}
