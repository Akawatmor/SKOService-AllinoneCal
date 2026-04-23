'use client'

import { useState } from 'react'
import { HardDrive, Info } from 'lucide-react'
import PageHeader from '../components/PageHeader'

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
    
    const totalBits = value * inputUnit.bits
    const result = totalBits / targetUnit.bits
    
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
    <div className="page-container space-y-6">
      <PageHeader
        title="Storage Converter"
        description="Convert between bits, bytes, and storage units"
        icon={HardDrive}
        color="indigo"
      />

      {/* Input Section */}
      <div className="section-card space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Value</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="input-modern text-lg font-mono"
              step="any"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">From Unit</label>
            <select
              value={inputUnit.symbol}
              onChange={(e) => setInputUnit(UNITS.find(u => u.symbol === e.target.value)!)}
              className="select-modern text-lg"
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
          <h3 className="font-semibold text-white">Common Units</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {commonUnits.map(unit => {
              const value = convertToUnit(unit)
              return (
                <div key={unit.symbol} className="section-card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm text-slate-300">{unit.name}</div>
                    <div className="badge">
                      {unit.symbol}
                    </div>
                  </div>
                  <div className="font-mono text-lg font-bold break-all text-indigo-400">
                    {value || '0'}
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(value)}
                    className="mt-2 text-xs text-violet-400 hover:text-violet-300"
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
          <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/60">
            {(['all', 'bit', 'byte'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === f 
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white' 
                    : 'text-slate-400 hover:bg-slate-700/50'
                }`}
              >
                {f === 'all' ? 'All' : f === 'bit' ? 'Bits' : 'Bytes'}
              </button>
            ))}
          </div>
          
          <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/60">
            {(['all', 'decimal', 'binary'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStandardFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  standardFilter === f 
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white' 
                    : 'text-slate-400 hover:bg-slate-700/50'
                }`}
              >
                {f === 'all' ? 'All Standards' : f === 'decimal' ? 'Decimal (1000)' : 'Binary (1024)'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All Conversions */}
      {inputValue && (
        <div className="section-card overflow-hidden p-0">
          <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700/60">
            <h3 className="font-semibold text-sm text-white">All Conversions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/30 border-b border-slate-700/60">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-slate-400">Unit</th>
                  <th className="text-left px-4 py-2 font-medium text-slate-400">Symbol</th>
                  <th className="text-left px-4 py-2 font-medium text-slate-400">Type</th>
                  <th className="text-left px-4 py-2 font-medium text-slate-400">Standard</th>
                  <th className="text-right px-4 py-2 font-medium text-slate-400">Value</th>
                  <th className="text-right px-4 py-2 font-medium text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map(unit => {
                  const value = convertToUnit(unit)
                  const isInput = unit.symbol === inputUnit.symbol
                  return (
                    <tr key={unit.symbol} className={`border-b border-slate-800/50 last:border-0 ${isInput ? 'bg-indigo-500/10' : ''}`}>
                      <td className="px-4 py-3 font-medium text-slate-300">
                        {unit.name}
                        {isInput && <span className="ml-2 text-xs text-indigo-400">(input)</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-slate-800/50 rounded text-xs font-mono text-slate-300">
                          {unit.symbol}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          unit.type === 'bit' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {unit.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          unit.standard === 'binary' ? 'bg-violet-500/20 text-violet-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {unit.standard}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-300">
                        {value || '0'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => navigator.clipboard.writeText(value)}
                          className="text-xs text-violet-400 hover:text-violet-300"
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
      <div className="section-card border-slate-700/60">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold mb-2 text-white">Quick Reference</h4>
            <div className="grid sm:grid-cols-2 gap-3 text-slate-400">
              <div>
                <p className="font-medium text-amber-400 mb-1">Decimal (SI)</p>
                <ul className="space-y-0.5">
                  <li>1 KB = 1,000 bytes</li>
                  <li>1 MB = 1,000 KB = 1,000,000 bytes</li>
                  <li>1 GB = 1,000 MB = 1,000,000,000 bytes</li>
                  <li>1 TB = 1,000 GB</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-violet-400 mb-1">Binary (IEC)</p>
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
      </div>
    </div>
  )
}
