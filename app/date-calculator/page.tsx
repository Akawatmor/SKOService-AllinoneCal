'use client'

import { useState } from 'react'
import { Calendar, Plus, Minus, Clock } from 'lucide-react'
import PageHeader from '../components/PageHeader'

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
    const totalMonths = Math.floor(totalDays / 30.437)
    const totalYears = Math.floor(totalDays / 365.25)

    const yearsCalc = Math.floor(totalDays / 365.25)
    const remainingDaysAfterYears = totalDays - Math.floor(yearsCalc * 365.25)
    const monthsCalc = Math.floor(remainingDaysAfterYears / 30.437)
    const remainingDaysAfterMonths = remainingDaysAfterYears - Math.floor(monthsCalc * 30.437)
    const weeksCalc = Math.floor(remainingDaysAfterMonths / 7)
    const daysCalc = remainingDaysAfterMonths - (weeksCalc * 7)
    const hoursRemaining = totalHours % 24
    const minutesRemaining = totalMinutes % 60
    const secondsRemaining = totalSeconds % 60

    return {
      breakdown: { years: yearsCalc, months: monthsCalc, weeks: weeksCalc, days: daysCalc, hours: hoursRemaining, minutes: minutesRemaining, seconds: secondsRemaining },
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
    <div className="page-container space-y-6">
      <PageHeader
        title="Date Calculator"
        description="Calculate date differences or add/subtract time"
        icon={Calendar}
        color="fuchsia"
      />

      {/* Mode Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('difference')}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            mode === 'difference'
              ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg'
              : 'bg-slate-800/50 text-slate-300 border border-slate-700/60 hover:bg-slate-700/50'
          }`}
        >
          <Calendar className="h-5 w-5 mx-auto mb-1" />
          Date Difference
        </button>
        <button
          onClick={() => setMode('add-subtract')}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            mode === 'add-subtract'
              ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg'
              : 'bg-slate-800/50 text-slate-300 border border-slate-700/60 hover:bg-slate-700/50'
          }`}
        >
          <Plus className="h-5 w-5 mx-auto mb-1" />
          Add/Subtract
        </button>
      </div>

      {/* Include Time Toggle */}
      <div className="section-card">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeTime}
            onChange={(e) => setIncludeTime(e.target.checked)}
            className="w-4 h-4 rounded accent-fuchsia-500"
          />
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-fuchsia-400" />
            <span className="font-medium text-slate-300">Include Time (Hours, Minutes, Seconds)</span>
          </div>
        </label>
      </div>

      {/* Difference Mode */}
      {mode === 'difference' && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="section-card space-y-3">
              <h3 className="font-semibold text-white">Start Date</h3>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-modern"
              />
              {includeTime && (
                <input
                  type="time"
                  step="1"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input-modern"
                />
              )}
            </div>
            <div className="section-card space-y-3">
              <h3 className="font-semibold text-white">End Date</h3>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-modern"
              />
              {includeTime && (
                <input
                  type="time"
                  step="1"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="input-modern"
                />
              )}
            </div>
          </div>

          {difference && (
            <div className="space-y-4">
              <div className="section-card border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10">
                <h3 className="font-bold text-lg mb-4 text-fuchsia-300">Time Difference</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {difference.breakdown.years > 0 && (
                    <div className="bg-slate-950/50 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-fuchsia-400">{difference.breakdown.years}</div>
                      <div className="text-xs text-slate-400">Years</div>
                    </div>
                  )}
                  {difference.breakdown.months > 0 && (
                    <div className="bg-slate-950/50 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-fuchsia-400">{difference.breakdown.months}</div>
                      <div className="text-xs text-slate-400">Months</div>
                    </div>
                  )}
                  {difference.breakdown.weeks > 0 && (
                    <div className="bg-slate-950/50 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-fuchsia-400">{difference.breakdown.weeks}</div>
                      <div className="text-xs text-slate-400">Weeks</div>
                    </div>
                  )}
                  <div className="bg-slate-950/50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-fuchsia-400">{difference.breakdown.days}</div>
                    <div className="text-xs text-slate-400">Days</div>
                  </div>
                  {includeTime && (
                    <>
                      <div className="bg-slate-950/50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-pink-400">{difference.breakdown.hours}</div>
                        <div className="text-xs text-slate-400">Hours</div>
                      </div>
                      <div className="bg-slate-950/50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-pink-400">{difference.breakdown.minutes}</div>
                        <div className="text-xs text-slate-400">Minutes</div>
                      </div>
                      <div className="bg-slate-950/50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-pink-400">{difference.breakdown.seconds}</div>
                        <div className="text-xs text-slate-400">Seconds</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="section-card">
                <h4 className="font-semibold mb-3 text-white">Total Duration</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-slate-500">Years</div>
                    <div className="font-mono font-semibold text-slate-300">{difference.totals.totalYears.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Months</div>
                    <div className="font-mono font-semibold text-slate-300">{difference.totals.totalMonths.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Weeks</div>
                    <div className="font-mono font-semibold text-slate-300">{difference.totals.totalWeeks.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Days</div>
                    <div className="font-mono font-semibold text-slate-300">{difference.totals.totalDays.toLocaleString()}</div>
                  </div>
                  {includeTime && (
                    <>
                      <div>
                        <div className="text-slate-500">Hours</div>
                        <div className="font-mono font-semibold text-slate-300">{difference.totals.totalHours.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Minutes</div>
                        <div className="font-mono font-semibold text-slate-300">{difference.totals.totalMinutes.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Seconds</div>
                        <div className="font-mono font-semibold text-slate-300">{difference.totals.totalSeconds.toLocaleString()}</div>
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
          <div className="section-card space-y-3">
            <h3 className="font-semibold text-white">Base Date</h3>
            <input
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="input-modern"
            />
            {includeTime && (
              <input
                type="time"
                step="1"
                value={baseTime}
                onChange={(e) => setBaseTime(e.target.value)}
                className="input-modern"
              />
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setOperation('add')}
              className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
                operation === 'add'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800/50 text-slate-300 border border-slate-700/60 hover:bg-slate-700/50'
              }`}
            >
              <Plus className="h-4 w-4 inline mr-1" />
              Add
            </button>
            <button
              onClick={() => setOperation('subtract')}
              className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
                operation === 'subtract'
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-800/50 text-slate-300 border border-slate-700/60 hover:bg-slate-700/50'
              }`}
            >
              <Minus className="h-4 w-4 inline mr-1" />
              Subtract
            </button>
          </div>

          <div className="section-card space-y-3">
            <h3 className="font-semibold text-white">Amount to {operation === 'add' ? 'Add' : 'Subtract'}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-slate-500">Years</label>
                <input
                  type="number"
                  min="0"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="input-modern"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Months</label>
                <input
                  type="number"
                  min="0"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  className="input-modern"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Weeks</label>
                <input
                  type="number"
                  min="0"
                  value={weeks}
                  onChange={(e) => setWeeks(e.target.value)}
                  className="input-modern"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Days</label>
                <input
                  type="number"
                  min="0"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="input-modern"
                />
              </div>
              {includeTime && (
                <>
                  <div>
                    <label className="text-xs text-slate-500">Hours</label>
                    <input
                      type="number"
                      min="0"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="input-modern"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Minutes</label>
                    <input
                      type="number"
                      min="0"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      className="input-modern"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Seconds</label>
                    <input
                      type="number"
                      min="0"
                      value={seconds}
                      onChange={(e) => setSeconds(e.target.value)}
                      className="input-modern"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {addSubtractResult && (
            <div className="section-card border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-pink-500/10">
              <h3 className="font-bold text-lg mb-3 text-violet-300">Result</h3>
              <div className="space-y-2">
                <div className="bg-slate-950/50 rounded-xl p-4">
                  <div className="text-sm text-violet-400 mb-1">Date</div>
                  <div className="text-2xl font-bold text-white">
                    {addSubtractResult.toLocaleDateString('en-GB', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                {includeTime && (
                  <div className="bg-slate-950/50 rounded-xl p-4">
                    <div className="text-sm text-violet-400 mb-1">Time</div>
                    <div className="text-2xl font-bold text-white font-mono">
                      {addSubtractResult.toLocaleTimeString('en-GB')}
                    </div>
                  </div>
                )}
                <div className="bg-slate-950/50 rounded-xl p-4">
                  <div className="text-sm text-violet-400 mb-1">ISO Format</div>
                  <div className="text-sm font-mono text-slate-300">
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
