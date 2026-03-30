'use client'

import { useState } from 'react'
import { Binary, Info } from 'lucide-react'
import PageHeader from '../components/PageHeader'

const COMMON_BASES = [
  { base: 2, name: 'Binary', color: 'cyan' },
  { base: 8, name: 'Octal', color: 'violet' },
  { base: 10, name: 'Decimal', color: 'emerald' },
  { base: 16, name: 'Hexadecimal', color: 'amber' },
]

export default function BaseConverterPage() {
  const [inputValue, setInputValue] = useState('')
  const [inputBase, setInputBase] = useState(10)
  const [customBase, setCustomBase] = useState('')

  const getValidChars = (base: number) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, base)
    return chars
  }

  const isValidNumber = (value: string, base: number) => {
    if (!value) return true
    const validChars = getValidChars(base)
    return value.toUpperCase().split('').every(char => validChars.includes(char))
  }

  const convertToDecimal = (value: string, base: number): number | null => {
    if (!value || !isValidNumber(value, base)) return null
    return parseInt(value.toUpperCase(), base)
  }

  const convertFromDecimal = (decimal: number, base: number): string => {
    if (isNaN(decimal)) return ''
    return decimal.toString(base).toUpperCase()
  }

  const decimal = convertToDecimal(inputValue, inputBase)

  const handleInputChange = (value: string) => {
    const upperValue = value.toUpperCase()
    if (isValidNumber(upperValue, inputBase)) {
      setInputValue(upperValue)
    }
  }

  const convertToBase = (targetBase: number): string => {
    if (decimal === null) return ''
    return convertFromDecimal(decimal, targetBase)
  }

  return (
    <div className="page-container space-y-6">
      <PageHeader
        title="Base Converter"
        description="Convert numbers between different bases (2-36)"
        icon={Binary}
        color="cyan"
      />

      {/* Input Section */}
      <div className="section-card space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Input Number</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={`Enter number in base ${inputBase}`}
            className="input-modern font-mono text-lg uppercase"
          />
          <p className="text-xs text-slate-500">
            Valid characters for base {inputBase}: <span className="text-cyan-400 font-mono">{getValidChars(inputBase)}</span>
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Input Base</label>
          <div className="flex flex-wrap gap-2">
            {COMMON_BASES.map(({ base, name }) => (
              <button
                key={base}
                onClick={() => {
                  setInputBase(base)
                  setInputValue('')
                }}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  inputBase === base
                    ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-300 border border-slate-700/60 hover:bg-slate-700/50'
                }`}
              >
                {name} ({base})
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 items-center mt-3">
            <input
              type="number"
              min="2"
              max="36"
              value={customBase}
              onChange={(e) => setCustomBase(e.target.value)}
              placeholder="Custom (2-36)"
              className="input-modern flex-1 text-sm"
            />
            <button
              onClick={() => {
                const base = parseInt(customBase)
                if (base >= 2 && base <= 36) {
                  setInputBase(base)
                  setInputValue('')
                  setCustomBase('')
                }
              }}
              disabled={!customBase || parseInt(customBase) < 2 || parseInt(customBase) > 36}
              className="btn-gradient disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Use
            </button>
          </div>
        </div>

        {decimal !== null && inputValue && (
          <div className="pt-4 border-t border-slate-700/60">
            <div className="text-sm text-slate-500 mb-1">Decimal Value</div>
            <div className="text-3xl font-bold font-mono text-emerald-400">
              {decimal.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Common Bases Output */}
      {decimal !== null && inputValue && (
        <div className="space-y-3">
          <h3 className="font-semibold text-white">Common Bases</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {COMMON_BASES.map(({ base, name, color }) => (
              <div key={base} className="section-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm text-slate-300">{name}</div>
                  <div className="badge">Base {base}</div>
                </div>
                <div className={`font-mono text-xl font-bold break-all ${
                  color === 'cyan' ? 'text-cyan-400' :
                  color === 'violet' ? 'text-violet-400' :
                  color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {convertToBase(base) || '0'}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(convertToBase(base))}
                  className="mt-2 text-xs text-violet-400 hover:text-violet-300"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Bases Output */}
      {decimal !== null && inputValue && (
        <div className="space-y-3">
          <h3 className="font-semibold text-white">All Bases (2-36)</h3>
          <div className="section-card overflow-hidden p-0">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/50 sticky top-0 border-b border-slate-700/60">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-slate-400">Base</th>
                    <th className="text-left px-4 py-2 font-medium text-slate-400">Value</th>
                    <th className="text-right px-4 py-2 font-medium text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 35 }, (_, i) => i + 2).map((base) => (
                    <tr key={base} className={`border-b border-slate-800/50 last:border-0 ${inputBase === base ? 'bg-violet-500/10' : ''}`}>
                      <td className="px-4 py-2 font-medium text-slate-300">
                        {base}
                        {inputBase === base && <span className="ml-2 text-xs text-violet-400">(input)</span>}
                      </td>
                      <td className="px-4 py-2 font-mono break-all text-slate-300">
                        {convertToBase(base) || '0'}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => navigator.clipboard.writeText(convertToBase(base))}
                          className="text-xs text-violet-400 hover:text-violet-300"
                        >
                          Copy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="section-card border-cyan-500/20 bg-cyan-500/5">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold mb-2 text-cyan-300">About Base Systems</h4>
            <ul className="space-y-1 text-slate-400">
              <li><strong className="text-cyan-400">Binary (Base 2):</strong> Uses digits 0-1, common in computing</li>
              <li><strong className="text-violet-400">Octal (Base 8):</strong> Uses digits 0-7, used in Unix permissions</li>
              <li><strong className="text-emerald-400">Decimal (Base 10):</strong> Uses digits 0-9, standard number system</li>
              <li><strong className="text-amber-400">Hexadecimal (Base 16):</strong> Uses 0-9 and A-F, used in colors and memory addresses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
