'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Plus, Minus, Clock } from 'lucide-react'

type Mode = 'difference' | 'add-subtract'

export default function DateCalculatorPage() {
  const [mode, setMode] = useState<Mode>('difference')
  const [includeTime, setIncludeTime] = useState(false)

  // Difference mode
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('00:00:00')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('00:00:00')

  // Add/Subtract mode
  const [baseDate, setBaseDate] = useState('')
  const [baseTime, setBaseTime] = useState('00:00:00')
  const [operation, setOperation] = useState<'add' | 'subtract'>('add')
  const [years, setYears] = useState('0')
  const [months, setMonths] = useState('0')
  const [weeks, setWeeks] = useState('0')
  const [days, setDays] = useState('0')
  const [hours, setHours] = useState('0')
  const [minutes, setMinutes] = useState('0')
  const [seconds, setSeconds] = useState('0')

  const calculateDifference = () => {
    if (!startDate || !endDate) return null

    const start = new Date(`${startDate}T${includeTime ? startTime : '00:00:00'}`)
    const end = new Date(`${endDate}T${includeTime ? endTime : '00:00:00'}`)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null

    const diffMs = Math.abs(end.getTime() - start.getTime())
    
    const totalSeconds = Math.floor(diffMs / 1000)
    const totalMinutes = Math.floor(totalSeconds / 60)
    const totalHours = Math.floor(totalMinutes / 60)
    const totalDays = Math.floor(totalHours / 24)
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = Math.floor(totalDays / 30.437) // Average month length
    const totalYears = Math.floor(totalDays / 365.25) // Average year length

    // Breakdown
    const years = Math.floor(totalDays / 365.25)
    const remainingDaysAfterYears = totalDays - Math.floor(years * 365.25)
    const months = Math.floor(remainingDaysAfterYears / 30.437)
    const remainingDaysAfterMonths = remainingDaysAfterYears - Math.floor(months * 30.437)
    const weeks = Math.floor(remainingDaysAfterMonths / 7)
    const days = remainingDaysAfterMonths - (weeks * 7)
    const hoursRemaining = totalHours % 24
    const minutesRemaining = totalMinutes % 60
    const secondsRemaining = totalSeconds % 60

    return {
      breakdown: { years, months, weeks, days, hours: hoursRemaining, minutes: minutesRemaining, seconds: secondsRemaining },
      totals: { totalYears, totalMonths, totalWeeks, totalDays, totalHours, totalMinutes, totalSeconds }
    }
  }

  const calculateAddSubtract = () => {
    if (!baseDate) return null

    const base = new Date(`${baseDate}T${includeTime ? baseTime : '00:00:00'}`)
    if (isNaN(base.getTime())) return null

    const result = new Date(base)
    
    const multiplier = operation === 'add' ? 1 : -1
    
    result.setFullYear(result.getFullYear() + (parseInt(years) || 0) * multiplier)
    result.setMonth(result.getMonth() + (parseInt(months) || 0) * multiplier)
    result.setDate(result.getDate() + (parseInt(weeks) || 0) * 7 * multiplier)
    result.setDate(result.getDate() + (parseInt(days) || 0) * multiplier)
    
    if (includeTime) {
      result.setHours(result.getHours() + (parseInt(hours) || 0) * multiplier)
      result.setMinutes(result.getMinutes() + (parseInt(minutes) || 0) * multiplier)
      result.setSeconds(result.getSeconds() + (parseInt(seconds) || 0) * multiplier)
    }

    return result
  }

  const difference = mode === 'difference' ? calculateDifference() : null
  const addSubtractResult = mode === 'add-subtract' ? calculateAddSubtract() : null

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
          <h1 className="text-3xl font-bold">Date Calculator</h1>
          <p className="text-muted-foreground mt-1">Calculate date differences or add/subtract time</p>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('difference')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
            mode === 'difference'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Calendar className="h-5 w-5 mx-auto mb-1" />
          Date Difference
        </button>
        <button
          onClick={() => setMode('add-subtract')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
            mode === 'add-subtract'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Plus className="h-5 w-5 mx-auto mb-1" />
          Add/Subtract
        </button>
      </div>

      {/* Include Time Toggle */}
      <div className="bg-card border rounded-xl p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeTime}
            onChange={(e) => setIncludeTime(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Include Time (Hours, Minutes, Seconds)</span>
          </div>
        </label>
      </div>

      {/* Difference Mode */}
      {mode === 'difference' && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card border rounded-xl p-4 space-y-3">
              <h3 className="font-semibold">Start Date</h3>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {includeTime && (
                <input
                  type="time"
                  step="1"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              )}
            </div>
            <div className="bg-card border rounded-xl p-4 space-y-3">
              <h3 className="font-semibold">End Date</h3>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {includeTime && (
                <input
                  type="time"
                  step="1"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              )}
            </div>
          </div>

          {difference && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-400 dark:border-blue-700 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 text-blue-900 dark:text-blue-100">Time Difference</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {difference.breakdown.years > 0 && (
                    <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{difference.breakdown.years}</div>
                      <div className="text-xs text-blue-700 dark:text-blue-300">Years</div>
                    </div>
                  )}
                  {difference.breakdown.months > 0 && (
                    <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{difference.breakdown.months}</div>
                      <div className="text-xs text-blue-700 dark:text-blue-300">Months</div>
                    </div>
                  )}
                  {difference.breakdown.weeks > 0 && (
                    <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{difference.breakdown.weeks}</div>
                      <div className="text-xs text-blue-700 dark:text-blue-300">Weeks</div>
                    </div>
                  )}
                  <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{difference.breakdown.days}</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Days</div>
                  </div>
                  {includeTime && (
                    <>
                      <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{difference.breakdown.hours}</div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">Hours</div>
                      </div>
                      <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{difference.breakdown.minutes}</div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">Minutes</div>
                      </div>
                      <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{difference.breakdown.seconds}</div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">Seconds</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-card border rounded-xl p-4">
                <h4 className="font-semibold mb-3">Total Duration</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Years</div>
                    <div className="font-mono font-semibold">{difference.totals.totalYears.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Months</div>
                    <div className="font-mono font-semibold">{difference.totals.totalMonths.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Weeks</div>
                    <div className="font-mono font-semibold">{difference.totals.totalWeeks.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Days</div>
                    <div className="font-mono font-semibold">{difference.totals.totalDays.toLocaleString()}</div>
                  </div>
                  {includeTime && (
                    <>
                      <div>
                        <div className="text-muted-foreground">Hours</div>
                        <div className="font-mono font-semibold">{difference.totals.totalHours.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Minutes</div>
                        <div className="font-mono font-semibold">{difference.totals.totalMinutes.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Seconds</div>
                        <div className="font-mono font-semibold">{difference.totals.totalSeconds.toLocaleString()}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Subtract Mode */}
      {mode === 'add-subtract' && (
        <div className="space-y-4">
          <div className="bg-card border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold">Base Date</h3>
            <input
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {includeTime && (
              <input
                type="time"
                step="1"
                value={baseTime}
                onChange={(e) => setBaseTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setOperation('add')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                operation === 'add'
                  ? 'bg-green-500 text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Plus className="h-4 w-4 inline mr-1" />
              Add
            </button>
            <button
              onClick={() => setOperation('subtract')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                operation === 'subtract'
                  ? 'bg-red-500 text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Minus className="h-4 w-4 inline mr-1" />
              Subtract
            </button>
          </div>

          <div className="bg-card border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold">Amount to {operation === 'add' ? 'Add' : 'Subtract'}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Years</label>
                <input
                  type="number"
                  min="0"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Months</label>
                <input
                  type="number"
                  min="0"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Weeks</label>
                <input
                  type="number"
                  min="0"
                  value={weeks}
                  onChange={(e) => setWeeks(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Days</label>
                <input
                  type="number"
                  min="0"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              {includeTime && (
                <>
                  <div>
                    <label className="text-xs text-muted-foreground">Hours</label>
                    <input
                      type="number"
                      min="0"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Minutes</label>
                    <input
                      type="number"
                      min="0"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Seconds</label>
                    <input
                      type="number"
                      min="0"
                      value={seconds}
                      onChange={(e) => setSeconds(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {addSubtractResult && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-400 dark:border-purple-700 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3 text-purple-900 dark:text-purple-100">Result</h3>
              <div className="space-y-2">
                <div className="bg-white/60 dark:bg-black/20 rounded-lg p-4">
                  <div className="text-sm text-purple-700 dark:text-purple-300 mb-1">Date</div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {addSubtractResult.toLocaleDateString('en-GB', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                {includeTime && (
                  <div className="bg-white/60 dark:bg-black/20 rounded-lg p-4">
                    <div className="text-sm text-purple-700 dark:text-purple-300 mb-1">Time</div>
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 font-mono">
                      {addSubtractResult.toLocaleTimeString('en-GB')}
                    </div>
                  </div>
                )}
                <div className="bg-white/60 dark:bg-black/20 rounded-lg p-4">
                  <div className="text-sm text-purple-700 dark:text-purple-300 mb-1">ISO Format</div>
                  <div className="text-sm font-mono text-purple-900 dark:text-purple-100">
                    {addSubtractResult.toISOString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
