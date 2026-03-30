"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, Search, ArrowLeft } from "lucide-react"
import { UnitCategory, unitCategories, units, convert } from "@/lib/units"
import Link from "next/link"

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length')
  const [amount, setAmount] = useState<string>("1")
  const [fromUnit, setFromUnit] = useState<string>(units.length[0].id)
  const [toUnit, setToUnit] = useState<string>(units.length[1].id)
  const [result, setResult] = useState<number>(0)
  const [fromSearch, setFromSearch] = useState<string>("")
  const [toSearch, setToSearch] = useState<string>("")

  useEffect(() => {
    setFromUnit(units[category][0].id)
    setToUnit(units[category][1]?.id || units[category][0].id)
    setFromSearch("")
    setToSearch("")
  }, [category])

  useEffect(() => {
    const val = parseFloat(amount)
    if (!isNaN(val)) {
      setResult(convert(val, fromUnit, toUnit, category))
    }
  }, [amount, fromUnit, toUnit, category])

  const filteredFromUnits = units[category].filter(u => 
    u.label.toLowerCase().includes(fromSearch.toLowerCase()) ||
    u.id.toLowerCase().includes(fromSearch.toLowerCase())
  )
  
  const filteredToUnits = units[category].filter(u => 
    u.label.toLowerCase().includes(toSearch.toLowerCase()) ||
    u.id.toLowerCase().includes(toSearch.toLowerCase())
  )

  const swapUnits = () => {
    const temp = fromUnit
    setFromUnit(toUnit)
    setToUnit(temp)
  }

  const formatResult = (num: number): string => {
    if (num === 0) return "0"
    if (Math.abs(num) < 0.000001 || Math.abs(num) > 999999999) {
      return num.toExponential(6)
    }
    return parseFloat(num.toPrecision(10)).toString()
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="bg-blur-circle w-[400px] h-[400px] bg-violet-600/15 -top-32 -right-32" />
        <div className="bg-blur-circle w-[300px] h-[300px] bg-cyan-600/15 bottom-0 -left-20" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/" 
            className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Unit Converter</h1>
            <p className="text-sm text-muted-foreground">แปลงหน่วย 15+ หมวดหมู่</p>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            หมวดหมู่
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as UnitCategory)}
            className="select-premium"
          >
            {Object.entries(unitCategories).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Main Card */}
        <div className="card-premium p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              จำนวน
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-premium text-2xl md:text-3xl font-bold h-16"
              placeholder="0"
            />
          </div>

          {/* From Unit */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              จาก
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={fromSearch}
                onChange={(e) => setFromSearch(e.target.value)}
                placeholder="ค้นหาหน่วย..."
                className="input-premium pl-10 text-sm"
              />
            </div>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="select-premium"
              size={Math.min(filteredFromUnits.length, 5)}
              style={{ height: 'auto', minHeight: '44px' }}
            >
              {filteredFromUnits.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2">
            <button 
              onClick={swapUnits}
              className="p-3 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all"
              title="สลับหน่วย"
            >
              <ArrowUpDown className="h-5 w-5" />
            </button>
          </div>

          {/* To Unit */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              เป็น
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={toSearch}
                onChange={(e) => setToSearch(e.target.value)}
                placeholder="ค้นหาหน่วย..."
                className="input-premium pl-10 text-sm"
              />
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="select-premium"
              size={Math.min(filteredToUnits.length, 5)}
              style={{ height: 'auto', minHeight: '44px' }}
            >
              {filteredToUnits.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </div>

          {/* Result */}
          <div className="pt-6 border-t border-border">
            <label className="block text-sm font-medium text-muted-foreground mb-3">
              ผลลัพธ์
            </label>
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-500/20">
              <div className="text-3xl md:text-4xl font-bold text-gradient break-all">
                {result === 0 && amount !== "0" && amount !== "" ? "—" : formatResult(result)}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {units[category].find(u => u.id === toUnit)?.label}
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            💡 ใช้ช่องค้นหาเพื่อหาหน่วยที่ต้องการได้เร็วขึ้น
          </p>
        </div>
      </div>
    </div>
  )
}
