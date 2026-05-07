'use client'

import { useState, useMemo } from 'react'
import { Zap } from 'lucide-react'
import PageHeader from '../components/PageHeader'

// ─── Utilities ────────────────────────────────────────────────────────────
const p = (s: string) => parseFloat(s)
const ok = (...ns: number[]) => ns.every(n => isFinite(n) && !isNaN(n))
function fmt(n: number): string {
  if (isNaN(n) || !isFinite(n)) return 'Error'
  if (n === 0) return '0'
  const abs = Math.abs(n)
  if (abs < 0.0001 || abs >= 1e6) return n.toExponential(4)
  return parseFloat(n.toPrecision(6)).toString()
}
const toRad = (deg: number) => (deg * Math.PI) / 180
const toDeg = (rad: number) => (rad * 180) / Math.PI

// ─── UI Components ─────────────────────────────────────────────────────────
function Card({ title, formula, note, children }: {
  title: string; formula: React.ReactNode; note?: string; children: React.ReactNode
}) {
  return (
    <div className="section-card space-y-4">
      <div>
        <h3 className="font-semibold text-white text-sm mb-2">{title}</h3>
        <div className="font-mono text-amber-300 bg-slate-950/60 border border-amber-500/20 rounded-xl px-4 py-2.5 text-sm text-center leading-relaxed">
          {formula}
        </div>
        {note && <p className="text-xs text-slate-500 mt-1.5 text-center">{note}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, unit, value, onChange }: {
  label: string; unit: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="text-xs text-slate-500 block mb-1">{label} <span className="text-slate-700">({unit})</span></label>
      <input type="number" className="input-modern text-center" value={value}
        onChange={e => onChange(e.target.value)} placeholder="0" />
    </div>
  )
}

function Res({ label, unit, val }: { label: string; unit: string; val: number | null }) {
  return (
    <div>
      <label className="text-xs text-amber-600/70 block mb-1">{label} <span className="text-amber-800">({unit})</span></label>
      <div className={`w-full rounded-xl px-4 py-3 text-center font-mono font-bold text-xl ${
        val !== null ? 'bg-amber-500/10 border border-amber-500/40 text-amber-300' :
        'bg-slate-900/40 border border-slate-700/30 text-slate-600'
      }`}>
        {val !== null ? fmt(val) : '—'}
      </div>
    </div>
  )
}

function SolveFor<T extends string>({ solve, setSolve, opts }: {
  solve: T; setSolve: (v: T) => void; opts: { v: T; l: string }[]
}) {
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      <span className="text-xs text-slate-500">หา:</span>
      {opts.map(o => (
        <button key={o.v} onClick={() => setSolve(o.v)}
          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
            solve === o.v ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}>
          {o.l}
        </button>
      ))}
    </div>
  )
}

// ─── Tab 1: General ────────────────────────────────────────────────────────
function OhmsLaw() {
  type S = 'V' | 'I' | 'R'
  const [s, setS] = useState<S>('V')
  const [v, setV] = useState(''); const [i, setI] = useState(''); const [r, setR] = useState('')
  const res = useMemo(() => {
    const V = p(v), I = p(i), R = p(r)
    if (s === 'V' && ok(I, R)) return I * R
    if (s === 'I' && ok(V, R) && R !== 0) return V / R
    if (s === 'R' && ok(V, I) && I !== 0) return V / I
    return null
  }, [s, v, i, r])
  return (
    <Card title="กฎของโอห์ม (Ohm's Law)" formula="V = I × R">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'V', l: 'V (แรงดัน)' }, { v: 'I', l: 'I (กระแส)' }, { v: 'R', l: 'R (ต้านทาน)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'V' ? <Res label="แรงดัน V" unit="V" val={res} /> : <Field label="แรงดัน V" unit="V" value={v} onChange={setV} />}
        {s === 'I' ? <Res label="กระแส I" unit="A" val={res} /> : <Field label="กระแส I" unit="A" value={i} onChange={setI} />}
        {s === 'R' ? <Res label="ต้านทาน R" unit="Ω" val={res} /> : <Field label="ต้านทาน R" unit="Ω" value={r} onChange={setR} />}
      </div>
    </Card>
  )
}

function SeriesResistance() {
  const [rs, setRs] = useState(['', '', '', '', ''])
  const set = (i: number, v: string) => setRs(rs.map((r, j) => j === i ? v : r))
  const total = useMemo(() => {
    const vals = rs.map(p).filter(n => isFinite(n) && n > 0)
    return vals.length >= 2 ? vals.reduce((a, b) => a + b, 0) : null
  }, [rs])
  return (
    <Card title="ความต้านทานอนุกรม (Series)" formula="R = R₁ + R₂ + R₃ + …" note="กรอกค่าที่ต้องการ อย่างน้อย 2 ตัว">
      <div className="grid grid-cols-5 gap-2">
        {rs.map((r, i) => (
          <div key={i}>
            <label className="text-xs text-slate-500 block mb-1 text-center">R{i + 1} (Ω)</label>
            <input type="number" className="input-modern text-center py-2 text-sm" value={r}
              onChange={e => set(i, e.target.value)} placeholder="0" />
          </div>
        ))}
      </div>
      <Res label="R รวม" unit="Ω" val={total} />
    </Card>
  )
}

function ParallelResistance() {
  const [rs, setRs] = useState(['', '', '', '', ''])
  const set = (i: number, v: string) => setRs(rs.map((r, j) => j === i ? v : r))
  const total = useMemo(() => {
    const vals = rs.map(p).filter(n => isFinite(n) && n > 0)
    if (vals.length < 2) return null
    const inv = vals.reduce((a, b) => a + 1 / b, 0)
    return inv > 0 ? 1 / inv : null
  }, [rs])
  return (
    <Card title="ความต้านทานขนาน (Parallel)" formula="1/R = 1/R₁ + 1/R₂ + 1/R₃ + …" note="กรอกค่าที่ต้องการ อย่างน้อย 2 ตัว">
      <div className="grid grid-cols-5 gap-2">
        {rs.map((r, i) => (
          <div key={i}>
            <label className="text-xs text-slate-500 block mb-1 text-center">R{i + 1} (Ω)</label>
            <input type="number" className="input-modern text-center py-2 text-sm" value={r}
              onChange={e => set(i, e.target.value)} placeholder="0" />
          </div>
        ))}
      </div>
      <Res label="R รวม" unit="Ω" val={total} />
    </Card>
  )
}

function VoltageDivider() {
  const [vin, setVin] = useState(''); const [r1, setR1] = useState(''); const [r2, setR2] = useState('')
  const res = useMemo(() => {
    const Vin = p(vin), R1 = p(r1), R2 = p(r2)
    if (ok(Vin, R1, R2) && R1 + R2 !== 0) return Vin * R2 / (R1 + R2)
    return null
  }, [vin, r1, r2])
  return (
    <Card title="ตัวแบ่งแรงดัน (Voltage Divider)" formula="Vout = Vin × R₂ / (R₁ + R₂)">
      <div className="grid grid-cols-3 gap-3">
        <Field label="แรงดันเข้า Vin" unit="V" value={vin} onChange={setVin} />
        <Field label="R₁" unit="Ω" value={r1} onChange={setR1} />
        <Field label="R₂" unit="Ω" value={r2} onChange={setR2} />
      </div>
      <Res label="แรงดันออก Vout" unit="V" val={res} />
    </Card>
  )
}

function CurrentDivider() {
  const [it, setIt] = useState(''); const [r1, setR1] = useState(''); const [r2, setR2] = useState('')
  const res = useMemo(() => {
    const I = p(it), R1 = p(r1), R2 = p(r2)
    if (ok(I, R1, R2) && R1 + R2 !== 0) return I * R2 / (R1 + R2)
    return null
  }, [it, r1, r2])
  return (
    <Card title="ตัวแบ่งกระแส (Current Divider)" formula="I₁ = I × R₂ / (R₁ + R₂)">
      <div className="grid grid-cols-3 gap-3">
        <Field label="กระแสรวม I" unit="A" value={it} onChange={setIt} />
        <Field label="R₁" unit="Ω" value={r1} onChange={setR1} />
        <Field label="R₂" unit="Ω" value={r2} onChange={setR2} />
      </div>
      <Res label="กระแส I₁" unit="A" val={res} />
    </Card>
  )
}

// ─── Tab 2: Power & Energy ──────────────────────────────────────────────────
function PowerCalc() {
  type S = 'P' | 'V' | 'I' | 'R'
  const [s, setS] = useState<S>('P')
  const [pv, setPv] = useState(''); const [v, setV] = useState(''); const [i, setI] = useState(''); const [r, setR] = useState('')
  const res = useMemo(() => {
    const P = p(pv), V = p(v), I = p(i), R = p(r)
    if (s === 'P') {
      if (ok(V, I)) return V * I
      if (ok(I, R)) return I * I * R
      if (ok(V, R) && R !== 0) return V * V / R
    }
    if (s === 'V') {
      if (ok(P, I) && I !== 0) return P / I
      if (ok(P, R) && P >= 0) return Math.sqrt(P * R)
      if (ok(I, R)) return I * R
    }
    if (s === 'I') {
      if (ok(P, V) && V !== 0) return P / V
      if (ok(P, R) && P >= 0 && R > 0) return Math.sqrt(P / R)
      if (ok(V, R) && R !== 0) return V / R
    }
    if (s === 'R') {
      if (ok(V, I) && I !== 0) return V / I
      if (ok(P, I) && I !== 0) return P / (I * I)
      if (ok(V, P) && P !== 0) return V * V / P
    }
    return null
  }, [s, pv, v, i, r])
  return (
    <Card title="กำลังไฟฟ้า (Electrical Power)" formula="P = V × I  =  I²R  =  V²/R" note="กรอก 2 ค่าใดก็ได้">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'P', l: 'P (กำลัง)' }, { v: 'V', l: 'V (แรงดัน)' }, { v: 'I', l: 'I (กระแส)' }, { v: 'R', l: 'R (ต้านทาน)' }
      ]} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {s === 'P' ? <Res label="กำลัง P" unit="W" val={res} /> : <Field label="กำลัง P" unit="W" value={pv} onChange={setPv} />}
        {s === 'V' ? <Res label="แรงดัน V" unit="V" val={res} /> : <Field label="แรงดัน V" unit="V" value={v} onChange={setV} />}
        {s === 'I' ? <Res label="กระแส I" unit="A" val={res} /> : <Field label="กระแส I" unit="A" value={i} onChange={setI} />}
        {s === 'R' ? <Res label="ต้านทาน R" unit="Ω" val={res} /> : <Field label="ต้านทาน R" unit="Ω" value={r} onChange={setR} />}
      </div>
    </Card>
  )
}

function EnergyCalc() {
  type S = 'E' | 'P' | 't'
  const [s, setS] = useState<S>('E')
  const [e, setE] = useState(''); const [pv, setPv] = useState(''); const [t, setT] = useState('')
  const [unit, setUnit] = useState<'Wh' | 'kWh'>('kWh')
  const res = useMemo(() => {
    const E = p(e), P = p(pv), T = p(t)
    const scale = unit === 'kWh' ? 1000 : 1
    if (s === 'E' && ok(P, T)) return P * T / scale
    if (s === 'P' && ok(E, T) && T !== 0) return E * scale / T
    if (s === 't' && ok(E, P) && P !== 0) return E * scale / P
    return null
  }, [s, e, pv, t, unit])
  return (
    <Card title="พลังงานไฟฟ้า (Electrical Energy)" formula="E = P × t">
      <div className="flex gap-2 items-center flex-wrap">
        <SolveFor solve={s} setSolve={setS} opts={[
          { v: 'E', l: `E (พลังงาน)` }, { v: 'P', l: 'P (กำลัง)' }, { v: 't', l: 't (เวลา)' }
        ]} />
        <select value={unit} onChange={e => setUnit(e.target.value as 'Wh' | 'kWh')}
          className="ml-auto text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-300">
          <option value="kWh">kWh / ชั่วโมง</option>
          <option value="Wh">Wh / ชั่วโมง</option>
        </select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {s === 'E' ? <Res label={`พลังงาน E`} unit={unit} val={res} /> : <Field label={`พลังงาน E`} unit={unit} value={e} onChange={setE} />}
        {s === 'P' ? <Res label="กำลัง P" unit="W" val={res} /> : <Field label="กำลัง P" unit="W" value={pv} onChange={setPv} />}
        {s === 't' ? <Res label="เวลา t" unit="h" val={res} /> : <Field label="เวลา t" unit="h" value={t} onChange={setT} />}
      </div>
    </Card>
  )
}

function EfficiencyCalc() {
  type S = 'η' | 'Pout' | 'Pin'
  const [s, setS] = useState<S>('η')
  const [eta, setEta] = useState(''); const [pout, setPout] = useState(''); const [pin, setPin] = useState('')
  const res = useMemo(() => {
    const η = p(eta), Pout = p(pout), Pin = p(pin)
    if (s === 'η' && ok(Pout, Pin) && Pin !== 0) return (Pout / Pin) * 100
    if (s === 'Pout' && ok(η, Pin)) return (η / 100) * Pin
    if (s === 'Pin' && ok(η, Pout) && η !== 0) return (Pout / η) * 100
    return null
  }, [s, eta, pout, pin])
  return (
    <Card title="ประสิทธิภาพ (Efficiency)" formula="η = (Pout / Pin) × 100%">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'η', l: 'η (ประสิทธิภาพ)' }, { v: 'Pout', l: 'Pout (กำลังออก)' }, { v: 'Pin', l: 'Pin (กำลังเข้า)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'η' ? <Res label="ประสิทธิภาพ η" unit="%" val={res} /> : <Field label="ประสิทธิภาพ η" unit="%" value={eta} onChange={setEta} />}
        {s === 'Pout' ? <Res label="กำลังออก Pout" unit="W" val={res} /> : <Field label="กำลังออก Pout" unit="W" value={pout} onChange={setPout} />}
        {s === 'Pin' ? <Res label="กำลังเข้า Pin" unit="W" val={res} /> : <Field label="กำลังเข้า Pin" unit="W" value={pin} onChange={setPin} />}
      </div>
    </Card>
  )
}

// ─── Tab 3: Reactance ──────────────────────────────────────────────────────
function InductiveReactance() {
  type S = 'XL' | 'f' | 'L'
  const [s, setS] = useState<S>('XL')
  const [xl, setXl] = useState(''); const [f, setF] = useState(''); const [l, setL] = useState('')
  const res = useMemo(() => {
    const XL = p(xl), F = p(f), L = p(l)
    if (s === 'XL' && ok(F, L)) return 2 * Math.PI * F * L
    if (s === 'f' && ok(XL, L) && L !== 0) return XL / (2 * Math.PI * L)
    if (s === 'L' && ok(XL, F) && F !== 0) return XL / (2 * Math.PI * F)
    return null
  }, [s, xl, f, l])
  return (
    <Card title="รีแอคแตนซ์เหนี่ยวนำ (Inductive Reactance)" formula="X_L = 2π × f × L">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'XL', l: 'XL (รีแอคแตนซ์)' }, { v: 'f', l: 'f (ความถี่)' }, { v: 'L', l: 'L (ความเหนี่ยวนำ)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'XL' ? <Res label="X_L" unit="Ω" val={res} /> : <Field label="X_L" unit="Ω" value={xl} onChange={setXl} />}
        {s === 'f' ? <Res label="ความถี่ f" unit="Hz" val={res} /> : <Field label="ความถี่ f" unit="Hz" value={f} onChange={setF} />}
        {s === 'L' ? <Res label="ความเหนี่ยวนำ L" unit="H" val={res} /> : <Field label="ความเหนี่ยวนำ L" unit="H" value={l} onChange={setL} />}
      </div>
    </Card>
  )
}

function CapacitiveReactance() {
  type S = 'XC' | 'f' | 'C'
  const [s, setS] = useState<S>('XC')
  const [xc, setXc] = useState(''); const [f, setF] = useState(''); const [c, setC] = useState('')
  const res = useMemo(() => {
    const XC = p(xc), F = p(f), C = p(c)
    if (s === 'XC' && ok(F, C) && F * C !== 0) return 1 / (2 * Math.PI * F * C)
    if (s === 'f' && ok(XC, C) && XC * C !== 0) return 1 / (2 * Math.PI * XC * C)
    if (s === 'C' && ok(XC, F) && XC * F !== 0) return 1 / (2 * Math.PI * XC * F)
    return null
  }, [s, xc, f, c])
  return (
    <Card title="รีแอคแตนซ์ตัวเก็บประจุ (Capacitive Reactance)" formula="X_C = 1 / (2π × f × C)">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'XC', l: 'XC (รีแอคแตนซ์)' }, { v: 'f', l: 'f (ความถี่)' }, { v: 'C', l: 'C (ความจุ)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'XC' ? <Res label="X_C" unit="Ω" val={res} /> : <Field label="X_C" unit="Ω" value={xc} onChange={setXc} />}
        {s === 'f' ? <Res label="ความถี่ f" unit="Hz" val={res} /> : <Field label="ความถี่ f" unit="Hz" value={f} onChange={setF} />}
        {s === 'C' ? <Res label="ความจุ C" unit="F" val={res} /> : <Field label="ความจุ C" unit="F" value={c} onChange={setC} />}
      </div>
    </Card>
  )
}

function ImpedanceRL() {
  const [r, setR] = useState(''); const [xl, setXl] = useState('')
  const res = useMemo(() => {
    const R = p(r), XL = p(xl)
    return ok(R, XL) ? Math.sqrt(R * R + XL * XL) : null
  }, [r, xl])
  const angle = useMemo(() => {
    const R = p(r), XL = p(xl)
    return ok(R, XL) && R !== 0 ? toDeg(Math.atan(XL / R)) : null
  }, [r, xl])
  return (
    <Card title="อิมพีแดนซ์ RL (RL Impedance)" formula="Z = √(R² + X_L²)">
      <div className="grid grid-cols-2 gap-3">
        <Field label="ความต้านทาน R" unit="Ω" value={r} onChange={setR} />
        <Field label="รีแอคแตนซ์ X_L" unit="Ω" value={xl} onChange={setXl} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Res label="อิมพีแดนซ์ Z" unit="Ω" val={res} />
        <Res label="มุมเฟส φ" unit="°" val={angle} />
      </div>
    </Card>
  )
}

function ImpedanceRLC() {
  const [r, setR] = useState(''); const [xl, setXl] = useState(''); const [xc, setXc] = useState('')
  const res = useMemo(() => {
    const R = p(r), XL = p(xl), XC = p(xc)
    return ok(R, XL, XC) ? Math.sqrt(R * R + (XL - XC) ** 2) : null
  }, [r, xl, xc])
  const angle = useMemo(() => {
    const R = p(r), XL = p(xl), XC = p(xc)
    return ok(R, XL, XC) && R !== 0 ? toDeg(Math.atan((XL - XC) / R)) : null
  }, [r, xl, xc])
  return (
    <Card title="อิมพีแดนซ์ RLC (RLC Impedance)" formula="Z = √(R² + (X_L − X_C)²)">
      <div className="grid grid-cols-3 gap-3">
        <Field label="ความต้านทาน R" unit="Ω" value={r} onChange={setR} />
        <Field label="รีแอคแตนซ์ X_L" unit="Ω" value={xl} onChange={setXl} />
        <Field label="รีแอคแตนซ์ X_C" unit="Ω" value={xc} onChange={setXc} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Res label="อิมพีแดนซ์ Z" unit="Ω" val={res} />
        <Res label="มุมเฟส φ" unit="°" val={angle} />
      </div>
    </Card>
  )
}

function ResonanceFreq() {
  type S = 'f' | 'L' | 'C'
  const [s, setS] = useState<S>('f')
  const [f, setF] = useState(''); const [l, setL] = useState(''); const [c, setC] = useState('')
  const res = useMemo(() => {
    const F = p(f), L = p(l), C = p(c)
    if (s === 'f' && ok(L, C) && L * C > 0) return 1 / (2 * Math.PI * Math.sqrt(L * C))
    if (s === 'L' && ok(F, C) && F * C > 0) return 1 / (4 * Math.PI ** 2 * F ** 2 * C)
    if (s === 'C' && ok(F, L) && F * L > 0) return 1 / (4 * Math.PI ** 2 * F ** 2 * L)
    return null
  }, [s, f, l, c])
  return (
    <Card title="ความถี่เรโซแนนซ์ (Resonance Frequency)" formula="f₀ = 1 / (2π√(LC))">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'f', l: 'f₀ (ความถี่)' }, { v: 'L', l: 'L (ความเหนี่ยวนำ)' }, { v: 'C', l: 'C (ความจุ)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'f' ? <Res label="ความถี่ f₀" unit="Hz" val={res} /> : <Field label="ความถี่ f₀" unit="Hz" value={f} onChange={setF} />}
        {s === 'L' ? <Res label="ความเหนี่ยวนำ L" unit="H" val={res} /> : <Field label="ความเหนี่ยวนำ L" unit="H" value={l} onChange={setL} />}
        {s === 'C' ? <Res label="ความจุ C" unit="F" val={res} /> : <Field label="ความจุ C" unit="F" value={c} onChange={setC} />}
      </div>
    </Card>
  )
}

// ─── Tab 4: Phase / AC ─────────────────────────────────────────────────────
function PowerFactor() {
  type S = 'PF' | 'φ' | 'R' | 'X'
  const [s, setS] = useState<S>('PF')
  const [pf, setPf] = useState(''); const [phi, setPhi] = useState(''); const [r, setR] = useState(''); const [x, setX] = useState('')
  const res = useMemo(() => {
    const PF = p(pf), φ = p(phi), R = p(r), X = p(x)
    if (s === 'PF') {
      if (ok(φ)) return Math.cos(toRad(φ))
      if (ok(R, X)) return R / Math.sqrt(R * R + X * X)
    }
    if (s === 'φ' && ok(PF) && Math.abs(PF) <= 1) return toDeg(Math.acos(PF))
    if (s === 'R' && ok(PF, X)) return PF * X / Math.sqrt(1 - PF ** 2)
    if (s === 'X' && ok(R, PF) && PF !== 0) return R * Math.sqrt(1 - PF ** 2) / PF
    return null
  }, [s, pf, phi, r, x])
  return (
    <Card title="ตัวประกอบกำลัง (Power Factor)" formula="PF = cos(φ) = R / Z" note="PF อยู่ระหว่าง 0–1">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'PF', l: 'PF' }, { v: 'φ', l: 'φ (มุมเฟส)' }, { v: 'R', l: 'R (ต้านทาน)' }, { v: 'X', l: 'X (รีแอคแตนซ์)' }
      ]} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {s === 'PF' ? <Res label="Power Factor" unit="" val={res} /> : <Field label="Power Factor" unit="0–1" value={pf} onChange={setPf} />}
        {s === 'φ' ? <Res label="มุมเฟส φ" unit="°" val={res} /> : <Field label="มุมเฟส φ" unit="°" value={phi} onChange={setPhi} />}
        {s === 'R' ? <Res label="ความต้านทาน R" unit="Ω" val={res} /> : <Field label="ความต้านทาน R" unit="Ω" value={r} onChange={setR} />}
        {s === 'X' ? <Res label="รีแอคแตนซ์ X" unit="Ω" val={res} /> : <Field label="รีแอคแตนซ์ X" unit="Ω" value={x} onChange={setX} />}
      </div>
    </Card>
  )
}

function ACPowerTriangle() {
  const [v, setV] = useState(''); const [i, setI] = useState(''); const [pf, setPf] = useState('')
  const { S, P, Q } = useMemo(() => {
    const V = p(v), I = p(i), PF = p(pf)
    if (!ok(V, I)) return { S: null, P: null, Q: null }
    const S = V * I
    const P = ok(PF) ? S * PF : null
    const Q = ok(PF) ? S * Math.sqrt(1 - Math.min(PF, 1) ** 2) : null
    return { S, P, Q }
  }, [v, i, pf])
  return (
    <Card title="กำลังไฟฟ้า AC (AC Power Triangle)" formula="S = V×I  |  P = S×cos(φ)  |  Q = S×sin(φ)">
      <div className="grid grid-cols-3 gap-3">
        <Field label="แรงดัน V" unit="V" value={v} onChange={setV} />
        <Field label="กระแส I" unit="A" value={i} onChange={setI} />
        <Field label="Power Factor" unit="0–1" value={pf} onChange={setPf} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Res label="กำลังปรากฏ S" unit="VA" val={S} />
        <Res label="กำลังจริง P" unit="W" val={P} />
        <Res label="กำลังรีแอคทีฟ Q" unit="VAR" val={Q} />
      </div>
    </Card>
  )
}

function ThreePhasePower() {
  type S = 'P' | 'VL' | 'IL'
  const [s, setS] = useState<S>('P')
  const [pv, setPv] = useState(''); const [vl, setVl] = useState(''); const [il, setIl] = useState(''); const [pf, setPf] = useState('0.8')
  const res = useMemo(() => {
    const P = p(pv), VL = p(vl), IL = p(il), PF = p(pf)
    if (s === 'P' && ok(VL, IL, PF)) return Math.sqrt(3) * VL * IL * PF
    if (s === 'VL' && ok(P, IL, PF) && IL * PF !== 0) return P / (Math.sqrt(3) * IL * PF)
    if (s === 'IL' && ok(P, VL, PF) && VL * PF !== 0) return P / (Math.sqrt(3) * VL * PF)
    return null
  }, [s, pv, vl, il, pf])
  return (
    <Card title="ไฟฟ้า 3 เฟส (3-Phase Power)" formula="P = √3 × V_L × I_L × cos(φ)">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'P', l: 'P (กำลัง)' }, { v: 'VL', l: 'VL (แรงดันสาย)' }, { v: 'IL', l: 'IL (กระแสสาย)' }
      ]} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {s === 'P' ? <Res label="กำลัง P" unit="W" val={res} /> : <Field label="กำลัง P" unit="W" value={pv} onChange={setPv} />}
        {s === 'VL' ? <Res label="แรงดันสาย V_L" unit="V" val={res} /> : <Field label="แรงดันสาย V_L" unit="V" value={vl} onChange={setVl} />}
        {s === 'IL' ? <Res label="กระแสสาย I_L" unit="A" val={res} /> : <Field label="กระแสสาย I_L" unit="A" value={il} onChange={setIl} />}
        <Field label="Power Factor" unit="0–1" value={pf} onChange={setPf} />
      </div>
    </Card>
  )
}

// ─── Tab 5: Transformer ────────────────────────────────────────────────────
function TransformerCalc() {
  type S = 'V1' | 'V2' | 'N1' | 'N2' | 'I1' | 'I2'
  const [s, setS] = useState<S>('V2')
  const [vals, setVals] = useState({ V1: '', V2: '', N1: '', N2: '', I1: '', I2: '' })
  const set = (k: S, v: string) => setVals(prev => ({ ...prev, [k]: v }))
  const res = useMemo(() => {
    const { V1, V2, N1, N2, I1, I2 } = Object.fromEntries(Object.entries(vals).map(([k, v]) => [k, p(v)])) as Record<S, number>
    const ratio = ok(N1, N2) && N1 !== 0 ? N2 / N1 : (ok(V1, V2) && V1 !== 0 ? V2 / V1 : null)
    if (!ratio) return null
    if (s === 'V2' && ok(V1)) return V1 * ratio
    if (s === 'V1' && ok(V2)) return V2 / ratio
    if (s === 'N2' && ok(N1)) return N1 * ratio
    if (s === 'N1' && ok(N2)) return N2 / ratio
    if (s === 'I1' && ok(I2)) return I2 * ratio
    if (s === 'I2' && ok(I1)) return I1 / ratio
    return null
  }, [s, vals])
  const labels: Record<S, { l: string; u: string }> = {
    V1: { l: 'แรงดันปฐมภูมิ V₁', u: 'V' }, V2: { l: 'แรงดันทุติยภูมิ V₂', u: 'V' },
    N1: { l: 'รอบปฐมภูมิ N₁', u: 'รอบ' }, N2: { l: 'รอบทุติยภูมิ N₂', u: 'รอบ' },
    I1: { l: 'กระแสปฐมภูมิ I₁', u: 'A' }, I2: { l: 'กระแสทุติยภูมิ I₂', u: 'A' },
  }
  return (
    <Card title="หม้อแปลงไฟฟ้า (Transformer)" formula="V₁/V₂ = N₁/N₂ = I₂/I₁" note="ใส่ 2 ค่าในกลุ่มเดียวกัน (V หรือ N) และกำหนดสิ่งที่หา">
      <SolveFor solve={s} setSolve={setS} opts={(Object.keys(labels) as S[]).map(k => ({ v: k, l: labels[k].l.split(' ')[0] }))} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {(Object.keys(labels) as S[]).map(k => (
          s === k
            ? <Res key={k} label={labels[k].l} unit={labels[k].u} val={res} />
            : <Field key={k} label={labels[k].l} unit={labels[k].u} value={vals[k]} onChange={v => set(k, v)} />
        ))}
      </div>
    </Card>
  )
}

// ─── Tab 6: RC / RL ────────────────────────────────────────────────────────
function RCTimeConst() {
  type S = 'τ' | 'R' | 'C'
  const [s, setS] = useState<S>('τ')
  const [tau, setTau] = useState(''); const [r, setR] = useState(''); const [c, setC] = useState('')
  const res = useMemo(() => {
    const τ = p(tau), R = p(r), C = p(c)
    if (s === 'τ' && ok(R, C)) return R * C
    if (s === 'R' && ok(τ, C) && C !== 0) return τ / C
    if (s === 'C' && ok(τ, R) && R !== 0) return τ / R
    return null
  }, [s, tau, r, c])
  return (
    <Card title="ค่าคงที่เวลา RC (RC Time Constant)" formula="τ = R × C">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'τ', l: 'τ (ค่าคงที่เวลา)' }, { v: 'R', l: 'R (ความต้านทาน)' }, { v: 'C', l: 'C (ความจุ)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'τ' ? <Res label="ค่าคงที่เวลา τ" unit="s" val={res} /> : <Field label="ค่าคงที่เวลา τ" unit="s" value={tau} onChange={setTau} />}
        {s === 'R' ? <Res label="ความต้านทาน R" unit="Ω" val={res} /> : <Field label="ความต้านทาน R" unit="Ω" value={r} onChange={setR} />}
        {s === 'C' ? <Res label="ความจุ C" unit="F" val={res} /> : <Field label="ความจุ C" unit="F" value={c} onChange={setC} />}
      </div>
    </Card>
  )
}

function RLTimeConst() {
  type S = 'τ' | 'R' | 'L'
  const [s, setS] = useState<S>('τ')
  const [tau, setTau] = useState(''); const [r, setR] = useState(''); const [l, setL] = useState('')
  const res = useMemo(() => {
    const τ = p(tau), R = p(r), L = p(l)
    if (s === 'τ' && ok(L, R) && R !== 0) return L / R
    if (s === 'R' && ok(L, τ) && τ !== 0) return L / τ
    if (s === 'L' && ok(τ, R)) return τ * R
    return null
  }, [s, tau, r, l])
  return (
    <Card title="ค่าคงที่เวลา RL (RL Time Constant)" formula="τ = L / R">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'τ', l: 'τ (ค่าคงที่เวลา)' }, { v: 'R', l: 'R (ความต้านทาน)' }, { v: 'L', l: 'L (ความเหนี่ยวนำ)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'τ' ? <Res label="ค่าคงที่เวลา τ" unit="s" val={res} /> : <Field label="ค่าคงที่เวลา τ" unit="s" value={tau} onChange={setTau} />}
        {s === 'R' ? <Res label="ความต้านทาน R" unit="Ω" val={res} /> : <Field label="ความต้านทาน R" unit="Ω" value={r} onChange={setR} />}
        {s === 'L' ? <Res label="ความเหนี่ยวนำ L" unit="H" val={res} /> : <Field label="ความเหนี่ยวนำ L" unit="H" value={l} onChange={setL} />}
      </div>
    </Card>
  )
}

function RCVoltage() {
  const [v0, setV0] = useState(''); const [tau, setTau] = useState(''); const [t, setT] = useState('')
  const charge = useMemo(() => {
    const V0 = p(v0), τ = p(tau), T = p(t)
    return ok(V0, τ, T) && τ > 0 ? V0 * (1 - Math.exp(-T / τ)) : null
  }, [v0, tau, t])
  const discharge = useMemo(() => {
    const V0 = p(v0), τ = p(tau), T = p(t)
    return ok(V0, τ, T) && τ > 0 ? V0 * Math.exp(-T / τ) : null
  }, [v0, tau, t])
  return (
    <Card title="แรงดันตัวเก็บประจุ (Capacitor Voltage)" formula={'V(t) = V₀(1−e^(−t/τ))  |  V(t) = V₀·e^(−t/τ)'}>
      <div className="grid grid-cols-3 gap-3">
        <Field label="แรงดันเริ่มต้น V₀" unit="V" value={v0} onChange={setV0} />
        <Field label="ค่าคงที่เวลา τ" unit="s" value={tau} onChange={setTau} />
        <Field label="เวลา t" unit="s" value={t} onChange={setT} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Res label="V ขณะชาร์จ" unit="V" val={charge} />
        <Res label="V ขณะคายประจุ" unit="V" val={discharge} />
      </div>
    </Card>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────
const TABS = [
  { id: 'general', label: 'ทั่วไป' },
  { id: 'power', label: 'กำลังงาน' },
  { id: 'reactance', label: 'Reactance' },
  { id: 'phase', label: 'เฟส / AC' },
  { id: 'transformer', label: 'หม้อแปลง' },
  { id: 'rc_rl', label: 'RC / RL' },
] as const
type Tab = typeof TABS[number]['id']

export default function ElectricalPage() {
  const [tab, setTab] = useState<Tab>('general')

  return (
    <div className="page-container space-y-6">
      <PageHeader
        title="สูตรคำนวณไฟฟ้า"
        description="Electrical Formulas — กฎโอห์ม, กำลังไฟฟ้า, Reactance, เฟส/AC, หม้อแปลง, RC/RL"
        icon={Zap}
        color="amber"
      />

      {/* Tab Bar */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-none px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tab === 'general' && (
          <>
            <OhmsLaw />
            <VoltageDivider />
            <CurrentDivider />
            <SeriesResistance />
            <ParallelResistance />
          </>
        )}
        {tab === 'power' && (
          <>
            <PowerCalc />
            <EnergyCalc />
            <EfficiencyCalc />
          </>
        )}
        {tab === 'reactance' && (
          <>
            <InductiveReactance />
            <CapacitiveReactance />
            <ImpedanceRL />
            <ImpedanceRLC />
            <ResonanceFreq />
          </>
        )}
        {tab === 'phase' && (
          <>
            <PowerFactor />
            <ACPowerTriangle />
            <ThreePhasePower />
          </>
        )}
        {tab === 'transformer' && (
          <div className="md:col-span-2">
            <TransformerCalc />
          </div>
        )}
        {tab === 'rc_rl' && (
          <>
            <RCTimeConst />
            <RLTimeConst />
            <div className="md:col-span-2">
              <RCVoltage />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
