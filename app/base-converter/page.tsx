'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Hash } from 'lucide-react'

const COMMON_BASES = [
  { base: 2, name: 'Binary', color: 'blue' },
  { base: 8, name: 'Octal', color: 'purple' },
  { base: 10, name: 'Decimal', color: 'green' },
  { base: 16, name: 'Hexadecimal', color: 'orange' },
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
          <h1 className="text-3xl font-bold">Base Converter</h1>
          <p className="text-muted-foreground mt-1">Convert numbers between different bases (2-36)</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-card border rounded-xl p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input Number</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={`Enter number in base ${inputBase}`}
            className="w-full px-4 py-3 border rounded-lg font-mono text-lg uppercase focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <p className="text-xs text-muted-foreground">
            Valid characters for base {inputBase}: {getValidChars(inputBase)}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Input Base</label>
          <div className="flex gap-2">
            {COMMON_BASES.map(({ base, name }) => (
              <button
                key={base}
                onClick={() => {
                  setInputBase(base)
                  setInputValue('')
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  inputBase === base
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {name} ({base})
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="2"
              max="36"
              value={customBase}
              onChange={(e) => setCustomBase(e.target.value)}
              placeholder="Custom (2-36)"
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
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
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Use
            </button>
          </div>
        </div>

        {decimal !== null && (
          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-1">Decimal Value</div>
            <div className="text-3xl font-bold font-mono text-green-600">
              {decimal.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Common Bases Output */}
      {decimal !== null && (
        <div className="space-y-3">
          <h3 className="font-semibold">Common Bases</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {COMMON_BASES.map(({ base, name, color }) => (
              <div key={base} className="bg-card border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">{name}</div>
                  <div className="text-xs text-muted-foreground">Base {base}</div>
                </div>
                <div className={`font-mono text-xl font-bold text-${color}-600 break-all`}>
                  {convertToBase(base) || '0'}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(convertToBase(base))
                  }}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Bases Output */}
      {decimal !== null && (
        <div className="space-y-3">
          <h3 className="font-semibold">All Bases (2-36)</h3>
          <div className="bg-card border rounded-xl overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0 border-b">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Base</th>
                    <th className="text-left px-4 py-2 font-medium">Value</th>
                    <th className="text-right px-4 py-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 35 }, (_, i) => i + 2).map((base) => (
                    <tr key={base} className={`border-b last:border-0 ${inputBase === base ? 'bg-primary/5' : ''}`}>
                      <td className="px-4 py-2 font-medium">
                        {base}
                        {inputBase === base && <span className="ml-2 text-xs text-primary">(input)</span>}
                      </td>
                      <td className="px-4 py-2 font-mono break-all">
                        {convertToBase(base) || '0'}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => navigator.clipboard.writeText(convertToBase(base))}
                          className="text-xs text-primary hover:underline"
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
      <div className="bg-muted/30 border rounded-xl p-4 text-sm text-muted-foreground">
        <h4 className="font-semibold mb-2 text-foreground">💡 About Base Systems</h4>
        <ul className="space-y-1 list-disc list-inside">
          <li><strong>Binary (Base 2):</strong> Uses digits 0-1, common in computing</li>
          <li><strong>Octal (Base 8):</strong> Uses digits 0-7, used in Unix permissions</li>
          <li><strong>Decimal (Base 10):</strong> Uses digits 0-9, standard number system</li>
          <li><strong>Hexadecimal (Base 16):</strong> Uses 0-9 and A-F, used in colors and memory addresses</li>
          <li><strong>Higher Bases (17-36):</strong> Use letters up to Z for additional digits</li>
        </ul>
      </div>
    </div>
  )
}
