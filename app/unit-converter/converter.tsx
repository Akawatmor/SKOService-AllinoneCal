"use client"

import { useState, useEffect } from "react"
import { ArrowLeftRight, Search } from "lucide-react"
import { UnitCategory, unitCategories, units, convert } from "@/lib/units"

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
    setAmount(formatResult(result))
  }

  const formatResult = (num: number): string => {
    if (num === 0) return "0"
    if (Math.abs(num) < 0.000001 || Math.abs(num) > 999999999) {
      return num.toExponential(6)
    }
    return parseFloat(num.toPrecision(10)).toString()
  }

  return (
    <div className="relative z-10 space-y-6">
      <div className="section-card border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-slate-900/70 to-cyan-500/10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="badge badge-primary">15+ categories</span>
          <span className="badge">Thai + SI units</span>
          <span className="badge">Quick search</span>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
          เลือกหมวดหมู่ ใส่ค่า และค้นหาหน่วยต้นทางหรือปลายทางได้ทันที หน้านี้เหมาะกับการแปลงทั้งหน่วยทั่วไป หน่วยวิศวกรรม และหน่วยไทยในหน้าเดียว
        </p>
      </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            หมวดหมู่
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as UnitCategory)}
            className="select-modern"
          >
            {Object.entries(unitCategories).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Main Card - Horizontal Layout */}
        <div className="section-card p-5 sm:p-6">
          <div className="grid grid-cols-[1fr_44px_1fr] gap-3 sm:gap-4 items-start">

            {/* From Column */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                จาก
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-modern text-xl sm:text-2xl font-bold h-14"
                placeholder="0"
              />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={fromSearch}
                  onChange={(e) => setFromSearch(e.target.value)}
                  placeholder="ค้นหาหน่วย..."
                  className="input-modern pl-10 text-sm"
                />
              </div>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="select-modern"
                size={Math.min(filteredFromUnits.length, 5)}
                style={{ height: 'auto', minHeight: '44px' }}
              >
                {filteredFromUnits.map((u) => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
            </div>

            {/* Swap Button - centered vertically */}
            <div className="flex items-start justify-center pt-7">
              <button
                onClick={swapUnits}
                className="btn-gradient p-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all"
                title="สลับหน่วย"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            </div>

            {/* To Column */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                เป็น
              </label>
              <div className="h-14 flex items-center px-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-500/20">
                <div className="text-xl sm:text-2xl font-bold text-gradient break-all leading-tight">
                  {result === 0 && amount !== "0" && amount !== "" ? "—" : formatResult(result)}
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={toSearch}
                  onChange={(e) => setToSearch(e.target.value)}
                  placeholder="ค้นหาหน่วย..."
                  className="input-modern pl-10 text-sm"
                />
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="select-modern"
                size={Math.min(filteredToUnits.length, 5)}
                style={{ height: 'auto', minHeight: '44px' }}
              >
                {filteredToUnits.map((u) => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 text-center">
                {units[category].find(u => u.id === toUnit)?.label}
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-center">
          <p className="text-xs text-slate-400">
            💡 ใช้ช่องค้นหาเพื่อหาหน่วยที่ต้องการได้เร็วขึ้น
          </p>
        </div>
    </div>
  )
}


 
