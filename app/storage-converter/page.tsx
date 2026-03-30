'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, HardDrive, Database } from 'lucide-react'

type Unit = {
  name: string
  symbol: string
  bits: number
  type: 'bit' | 'byte'
  standard: 'binary' | 'decimal'
}

const UNITS: Unit[] = [
  // Bits (Decimal)
  { name: 'Bit', symbol: 'bit', bits: 1, type: 'bit', standard: 'decimal' },
  { name: 'Kilobit', symbol: 'Kb', bits: 1000, type: 'bit', standard: 'decimal' },
  { name: 'Megabit', symbol: 'Mb', bits: 1000 ** 2, type: 'bit', standard: 'decimal' },
  { name: 'Gigabit', symbol: 'Gb', bits: 1000 ** 3, type: 'bit', standard: 'decimal' },
  { name: 'Terabit', symbol: 'Tb', bits: 1000 ** 4, type: 'bit', standard: 'decimal' },
  { name: 'Petabit', symbol: 'Pb', bits: 1000 ** 5, type: 'bit', standard: 'decimal' },
  
  // Bits (Binary)
  { name: 'Kibibit', symbol: 'Kibit', bits: 1024, type: 'bit', standard: 'binary' },
  { name: 'Mebibit', symbol: 'Mibit', bits: 1024 ** 2, type: 'bit', standard: 'binary' },
  { name: 'Gibibit', symbol: 'Gibit', bits: 1024 ** 3, type: 'bit', standard: 'binary' },
  { name: 'Tebibit', symbol: 'Tibit', bits: 1024 ** 4, type: 'bit', standard: 'binary' },
  { name: 'Pebibit', symbol: 'Pibit', bits: 1024 ** 5, type: 'bit', standard: 'binary' },
  
  // Bytes (Decimal)
  { name: 'Byte', symbol: 'B', bits: 8, type: 'byte', standard: 'decimal' },
  { name: 'Kilobyte', symbol: 'KB', bits: 8 * 1000, type: 'byte', standard: 'decimal' },
  { name: 'Megabyte', symbol: 'MB', bits: 8 * (1000 ** 2), type: 'byte', standard: 'decimal' },
  { name: 'Gigabyte', symbol: 'GB', bits: 8 * (1000 ** 3), type: 'byte', standard: 'decimal' },
  { name: 'Terabyte', symbol: 'TB', bits: 8 * (1000 ** 4), type: 'byte', standard: 'decimal' },
  { name: 'Petabyte', symbol: 'PB', bits: 8 * (1000 ** 5), type: 'byte', standard: 'decimal' },
  
  // Bytes (Binary)
  { name: 'Kibibyte', symbol: 'KiB', bits: 8 * 1024, type: 'byte', standard: 'binary' },
  { name: 'Mebibyte', symbol: 'MiB', bits: 8 * (1024 ** 2), type: 'byte', standard: 'binary' },
  { name: 'Gibibyte', symbol: 'GiB', bits: 8 * (1024 ** 3), type: 'byte', standard: 'binary' },
  { name: 'Tebibyte', symbol: 'TiB', bits: 8 * (1024 ** 4), type: 'byte', standard: 'binary' },
  { name: 'Pebibyte', symbol: 'PiB', bits: 8 * (1024 ** 5), type: 'byte', standard: 'binary' },
]

export default function StorageConverterPage() {
  const [inputValue, setInputValue] = useState('')
  const [inputUnit, setInputUnit] = useState<Unit>(UNITS.find(u => u.symbol === 'GB')!)
  const [filter, setFilter] = useState<'all' | 'bit' | 'byte'>('all')
  const [standardFilter, setStandardFilter] = useState<'all' | 'binary' | 'decimal'>('all')

  const convertToUnit = (targetUnit: Unit): string => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) return ''
    
    // Convert input to bits first
    const totalBits = value * inputUnit.bits
    
    // Convert to target unit
    const result = totalBits / targetUnit.bits
    
    // Format with appropriate precision
    if (result === 0) return '0'
    if (result < 0.000001) return result.toExponential(4)
    if (result < 1) return result.toFixed(10).replace(/\.?0+$/, '')
    if (result > 1000000000000) return result.toExponential(4)
    
    return result.toLocaleString('en-US', { 
      maximumFractionDigits: result < 1000 ? 10 : 4,
      minimumFractionDigits: 0
    })
  }

  const filteredUnits = UNITS.filter(unit => {
    if (filter !== 'all' && unit.type !== filter) return false
    if (standardFilter !== 'all' && unit.standard !== standardFilter) return false
    return true
  })

  const commonUnits = [
    UNITS.find(u => u.symbol === 'B')!,
    UNITS.find(u => u.symbol === 'KB')!,
    UNITS.find(u => u.symbol === 'MB')!,
    UNITS.find(u => u.symbol === 'GB')!,
    UNITS.find(u => u.symbol === 'TB')!,
    UNITS.find(u => u.symbol === 'KiB')!,
    UNITS.find(u => u.symbol === 'MiB')!,
    UNITS.find(u => u.symbol === 'GiB')!,
    UNITS.find(u => u.symbol === 'TiB')!,
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
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
          <h1 className="text-3xl font-bold">Storage Converter</h1>
          <p className="text-muted-foreground mt-1">Convert between bits, bytes, and storage units</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex gap-3">
          <Database className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-semibold mb-1">Binary vs Decimal</p>
            <p><strong>Decimal (KB, MB, GB):</strong> Base 1000 - Used by storage manufacturers</p>
            <p><strong>Binary (KiB, MiB, GiB):</strong> Base 1024 - Used by operating systems</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-card border rounded-xl p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Value</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="w-full px-4 py-3 border rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
              step="any"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">From Unit</label>
            <select
              value={inputUnit.symbol}
              onChange={(e) => setInputUnit(UNITS.find(u => u.symbol === e.target.value)!)}
              className="w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {UNITS.map(unit => (
                <option key={unit.symbol} value={unit.symbol}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Common Conversions */}
      {inputValue && (
        <div className="space-y-3">
          <h3 className="font-semibold">Common Units</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {commonUnits.map(unit => {
              const value = convertToUnit(unit)
              return (
                <div key={unit.symbol} className="bg-card border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">{unit.name}</div>
                    <div className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                      {unit.symbol}
                    </div>
                  </div>
                  <div className="font-mono text-lg font-bold break-all">
                    {value || '0'}
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(value)}
                    className="mt-2 text-xs text-primary hover:underline"
                  >
                    Copy
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      {inputValue && (
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-background'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('bit')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                filter === 'bit' ? 'bg-primary text-primary-foreground' : 'hover:bg-background'
              }`}
            >
              Bits
            </button>
            <button
              onClick={() => setFilter('byte')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                filter === 'byte' ? 'bg-primary text-primary-foreground' : 'hover:bg-background'
              }`}
            >
              Bytes
            </button>
          </div>
          
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setStandardFilter('all')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                standardFilter === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-background'
              }`}
            >
              All Standards
            </button>
            <button
              onClick={() => setStandardFilter('decimal')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                standardFilter === 'decimal' ? 'bg-primary text-primary-foreground' : 'hover:bg-background'
              }`}
            >
              Decimal (1000)
            </button>
            <button
              onClick={() => setStandardFilter('binary')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                standardFilter === 'binary' ? 'bg-primary text-primary-foreground' : 'hover:bg-background'
              }`}
            >
              Binary (1024)
            </button>
          </div>
        </div>
      )}

      {/* All Conversions */}
      {inputValue && (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 border-b">
            <h3 className="font-semibold text-sm">All Conversions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 border-b">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Unit</th>
                  <th className="text-left px-4 py-2 font-medium">Symbol</th>
                  <th className="text-left px-4 py-2 font-medium">Type</th>
                  <th className="text-left px-4 py-2 font-medium">Standard</th>
                  <th className="text-right px-4 py-2 font-medium">Value</th>
                  <th className="text-right px-4 py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map(unit => {
                  const value = convertToUnit(unit)
                  const isInput = unit.symbol === inputUnit.symbol
                  return (
                    <tr key={unit.symbol} className={`border-b last:border-0 ${isInput ? 'bg-primary/5' : ''}`}>
                      <td className="px-4 py-3 font-medium">
                        {unit.name}
                        {isInput && <span className="ml-2 text-xs text-primary">(input)</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-muted rounded text-xs font-mono">
                          {unit.symbol}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          unit.type === 'bit' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {unit.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          unit.standard === 'binary' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                        }`}>
                          {unit.standard}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        {value || '0'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => navigator.clipboard.writeText(value)}
                          className="text-xs text-primary hover:underline"
                        >
                          Copy
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reference */}
      <div className="bg-muted/30 border rounded-xl p-4 text-sm">
        <h4 className="font-semibold mb-2">💡 Quick Reference</h4>
        <div className="grid sm:grid-cols-2 gap-3 text-muted-foreground">
          <div>
            <p className="font-medium text-foreground mb-1">Decimal (SI)</p>
            <ul className="space-y-0.5">
              <li>1 KB = 1,000 bytes</li>
              <li>1 MB = 1,000 KB = 1,000,000 bytes</li>
              <li>1 GB = 1,000 MB = 1,000,000,000 bytes</li>
              <li>1 TB = 1,000 GB</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Binary (IEC)</p>
            <ul className="space-y-0.5">
              <li>1 KiB = 1,024 bytes</li>
              <li>1 MiB = 1,024 KiB = 1,048,576 bytes</li>
              <li>1 GiB = 1,024 MiB = 1,073,741,824 bytes</li>
              <li>1 TiB = 1,024 GiB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
