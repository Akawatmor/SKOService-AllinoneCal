'use client'

import { useState, useMemo } from 'react'
import { FlaskConical } from 'lucide-react'
import PageHeader from '../components/PageHeader'

// ─── Utilities ────────────────────────────────────────────────────────────
const p = (s: string) => parseFloat(s)
const ok = (...ns: number[]) => ns.every(n => isFinite(n) && !isNaN(n))
function fmt(n: number): string {
  if (isNaN(n) || !isFinite(n)) return 'Error'
  if (n === 0) return '0'
  const abs = Math.abs(n)
  if (abs < 0.0001 || abs >= 1e9) return n.toExponential(4)
  return parseFloat(n.toPrecision(6)).toString()
}
const NA = 6.02214076e23
const R_GAS = 8.314

// ─── UI Components ─────────────────────────────────────────────────────────
function Card({ title, formula, note, children }: {
  title: string; formula: React.ReactNode; note?: string; children: React.ReactNode
}) {
  return (
    <div className="section-card space-y-4">
      <div>
        <h3 className="font-semibold text-white text-sm mb-2">{title}</h3>
        <div className="font-mono text-emerald-300 bg-slate-950/60 border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-center leading-relaxed">
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
      <label className="text-xs text-emerald-600/70 block mb-1">{label} <span className="text-emerald-800">({unit})</span></label>
      <div className={`w-full rounded-xl px-4 py-3 text-center font-mono font-bold text-xl ${
        val !== null ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300' :
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
            solve === o.v ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}>
          {o.l}
        </button>
      ))}
    </div>
  )
}

// ─── Tab 1: Mole Calculations ──────────────────────────────────────────────
function MoleMass() {
  type S = 'n' | 'm' | 'M'
  const [s, setS] = useState<S>('n')
  const [n, setN] = useState(''); const [m, setM] = useState(''); const [M, setMM] = useState('')
  const res = useMemo(() => {
    const nv = p(n), mv = p(m), Mv = p(M)
    if (s === 'n' && ok(mv, Mv) && Mv !== 0) return mv / Mv
    if (s === 'm' && ok(nv, Mv)) return nv * Mv
    if (s === 'M' && ok(mv, nv) && nv !== 0) return mv / nv
    return null
  }, [s, n, m, M])
  return (
    <Card title="โมล ↔ มวล (Mole ↔ Mass)" formula="n = m / M">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'n', l: 'n (โมล)' }, { v: 'm', l: 'm (มวล)' }, { v: 'M', l: 'M (มวลโมลาร์)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'n' ? <Res label="n (โมล)" unit="mol" val={res} /> : <Field label="n (โมล)" unit="mol" value={n} onChange={setN} />}
        {s === 'm' ? <Res label="m (มวล)" unit="g" val={res} /> : <Field label="m (มวล)" unit="g" value={m} onChange={setM} />}
        {s === 'M' ? <Res label="M (มวลโมลาร์)" unit="g/mol" val={res} /> : <Field label="M (มวลโมลาร์)" unit="g/mol" value={M} onChange={setMM} />}
      </div>
    </Card>
  )
}

function MoleVolumeSTP() {
  type S = 'n' | 'V'
  const [s, setS] = useState<S>('n')
  const [n, setN] = useState(''); const [v, setV] = useState('')
  const res = useMemo(() => {
    const nv = p(n), V = p(v)
    if (s === 'n' && ok(V)) return V / 22.4
    if (s === 'V' && ok(nv)) return nv * 22.4
    return null
  }, [s, n, v])
  return (
    <Card title="โมล ↔ ปริมาตร (STP)" formula="V = n × 22.4 L/mol" note="ที่ STP: 0°C, 1 atm">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'n', l: 'n (โมล)' }, { v: 'V', l: 'V (ปริมาตร)' }
      ]} />
      <div className="grid grid-cols-2 gap-3">
        {s === 'n' ? <Res label="n (โมล)" unit="mol" val={res} /> : <Field label="n (โมล)" unit="mol" value={n} onChange={setN} />}
        {s === 'V' ? <Res label="V (ปริมาตร)" unit="L" val={res} /> : <Field label="V (ปริมาตร)" unit="L" value={v} onChange={setV} />}
      </div>
    </Card>
  )
}

function MoleParticles() {
  type S = 'n' | 'N'
  const [s, setS] = useState<S>('N')
  const [n, setN] = useState(''); const [nv, setNv] = useState('')
  const res = useMemo(() => {
    const mol = p(n), N = p(nv)
    if (s === 'N' && ok(mol)) return mol * NA
    if (s === 'n' && ok(N)) return N / NA
    return null
  }, [s, n, nv])
  return (
    <Card title="โมล ↔ จำนวนอนุภาค" formula="N = n × Nₐ  (Nₐ = 6.022×10²³)" note="อนุภาค: อะตอม/โมเลกุล/ไอออน">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'N', l: 'N (จำนวน)' }, { v: 'n', l: 'n (โมล)' }
      ]} />
      <div className="grid grid-cols-2 gap-3">
        {s === 'n' ? <Res label="n (โมล)" unit="mol" val={res} /> : <Field label="n (โมล)" unit="mol" value={n} onChange={setN} />}
        {s === 'N' ? <Res label="N (จำนวน)" unit="อนุภาค" val={res} /> : <Field label="N (จำนวน)" unit="อนุภาค" value={nv} onChange={setNv} />}
      </div>
    </Card>
  )
}

function MoleFraction() {
  const [n1, setN1] = useState(''); const [n2, setN2] = useState('')
  const [xa, xb] = useMemo(() => {
    const N1 = p(n1), N2 = p(n2)
    if (!ok(N1, N2) || N1 + N2 === 0) return [null, null]
    return [N1 / (N1 + N2), N2 / (N1 + N2)]
  }, [n1, n2])
  return (
    <Card title="เศษส่วนโมล (Mole Fraction)" formula="χₐ = nₐ / (nₐ + n_b)">
      <div className="grid grid-cols-2 gap-3">
        <Field label="n₁ (สาร A)" unit="mol" value={n1} onChange={setN1} />
        <Field label="n₂ (สาร B)" unit="mol" value={n2} onChange={setN2} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Res label="χ₁ (A)" unit="" val={xa} />
        <Res label="χ₂ (B)" unit="" val={xb} />
      </div>
    </Card>
  )
}

// ─── Tab 2: Concentration ──────────────────────────────────────────────────
function MolarityCalc() {
  type S = 'C' | 'n' | 'V'
  const [s, setS] = useState<S>('C')
  const [c, setC] = useState(''); const [n, setN] = useState(''); const [v, setV] = useState('')
  const res = useMemo(() => {
    const C = p(c), nv = p(n), V = p(v)
    if (s === 'C' && ok(nv, V) && V !== 0) return nv / V
    if (s === 'n' && ok(C, V)) return C * V
    if (s === 'V' && ok(nv, C) && C !== 0) return nv / C
    return null
  }, [s, c, n, v])
  return (
    <Card title="โมลาริตี (Molarity)" formula="C = n / V">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'C', l: 'C (ความเข้มข้น)' }, { v: 'n', l: 'n (โมล)' }, { v: 'V', l: 'V (ปริมาตร)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'C' ? <Res label="ความเข้มข้น C" unit="mol/L" val={res} /> : <Field label="ความเข้มข้น C" unit="mol/L" value={c} onChange={setC} />}
        {s === 'n' ? <Res label="n (โมล)" unit="mol" val={res} /> : <Field label="n (โมล)" unit="mol" value={n} onChange={setN} />}
        {s === 'V' ? <Res label="ปริมาตร V" unit="L" val={res} /> : <Field label="ปริมาตร V" unit="L" value={v} onChange={setV} />}
      </div>
    </Card>
  )
}

function DilutionCalc() {
  type S = 'C1' | 'V1' | 'C2' | 'V2'
  const [s, setS] = useState<S>('C2')
  const [c1, setC1] = useState(''); const [v1, setV1] = useState(''); const [c2, setC2] = useState(''); const [v2, setV2] = useState('')
  const res = useMemo(() => {
    const C1 = p(c1), V1 = p(v1), C2 = p(c2), V2 = p(v2)
    if (s === 'C2' && ok(C1, V1, V2) && V2 !== 0) return C1 * V1 / V2
    if (s === 'V2' && ok(C1, V1, C2) && C2 !== 0) return C1 * V1 / C2
    if (s === 'C1' && ok(C2, V2, V1) && V1 !== 0) return C2 * V2 / V1
    if (s === 'V1' && ok(C1, C2, V2) && C1 !== 0) return C2 * V2 / C1
    return null
  }, [s, c1, v1, c2, v2])
  return (
    <Card title="การเจือจาง (Dilution)" formula="C₁V₁ = C₂V₂">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'C1', l: 'C₁' }, { v: 'V1', l: 'V₁' }, { v: 'C2', l: 'C₂' }, { v: 'V2', l: 'V₂' }
      ]} />
      <div className="grid grid-cols-2 gap-3">
        {s === 'C1' ? <Res label="ความเข้มข้น C₁" unit="mol/L" val={res} /> : <Field label="ความเข้มข้น C₁" unit="mol/L" value={c1} onChange={setC1} />}
        {s === 'V1' ? <Res label="ปริมาตร V₁" unit="L" val={res} /> : <Field label="ปริมาตร V₁" unit="L" value={v1} onChange={setV1} />}
        {s === 'C2' ? <Res label="ความเข้มข้น C₂" unit="mol/L" val={res} /> : <Field label="ความเข้มข้น C₂" unit="mol/L" value={c2} onChange={setC2} />}
        {s === 'V2' ? <Res label="ปริมาตร V₂" unit="L" val={res} /> : <Field label="ปริมาตร V₂" unit="L" value={v2} onChange={setV2} />}
      </div>
    </Card>
  )
}

function MassPercent() {
  type S = 'pct' | 'ms' | 'msol'
  const [s, setS] = useState<S>('pct')
  const [pct, setPct] = useState(''); const [ms, setMs] = useState(''); const [msol, setMsol] = useState('')
  const res = useMemo(() => {
    const P = p(pct), Ms = p(ms), Msol = p(msol)
    if (s === 'pct' && ok(Ms, Msol) && Msol !== 0) return (Ms / Msol) * 100
    if (s === 'ms' && ok(P, Msol)) return (P / 100) * Msol
    if (s === 'msol' && ok(P, Ms) && P !== 0) return Ms / (P / 100)
    return null
  }, [s, pct, ms, msol])
  return (
    <Card title="เปอร์เซ็นต์มวล (Mass Percent)" formula="% = (m_solute / m_solution) × 100">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'pct', l: '% (เปอร์เซ็นต์)' }, { v: 'ms', l: 'm ตัวละลาย' }, { v: 'msol', l: 'm สารละลาย' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'pct' ? <Res label="เปอร์เซ็นต์" unit="%" val={res} /> : <Field label="เปอร์เซ็นต์" unit="%" value={pct} onChange={setPct} />}
        {s === 'ms' ? <Res label="มวลตัวละลาย" unit="g" val={res} /> : <Field label="มวลตัวละลาย" unit="g" value={ms} onChange={setMs} />}
        {s === 'msol' ? <Res label="มวลสารละลาย" unit="g" val={res} /> : <Field label="มวลสารละลาย" unit="g" value={msol} onChange={setMsol} />}
      </div>
    </Card>
  )
}

function PPMCalc() {
  type S = 'ppm' | 'mg' | 'V'
  const [s, setS] = useState<S>('ppm')
  const [ppm, setPpm] = useState(''); const [mg, setMg] = useState(''); const [v, setV] = useState('')
  const res = useMemo(() => {
    const PPM = p(ppm), MG = p(mg), V = p(v)
    if (s === 'ppm' && ok(MG, V) && V !== 0) return MG / V
    if (s === 'mg' && ok(PPM, V)) return PPM * V
    if (s === 'V' && ok(MG, PPM) && PPM !== 0) return MG / PPM
    return null
  }, [s, ppm, mg, v])
  return (
    <Card title="PPM (Parts per Million)" formula="ppm = mg/L" note="สำหรับสารละลายเจือจาง (aq)">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'ppm', l: 'ppm' }, { v: 'mg', l: 'mg (มวล)' }, { v: 'V', l: 'V (ปริมาตร)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'ppm' ? <Res label="ppm" unit="mg/L" val={res} /> : <Field label="ppm" unit="mg/L" value={ppm} onChange={setPpm} />}
        {s === 'mg' ? <Res label="มวลตัวละลาย" unit="mg" val={res} /> : <Field label="มวลตัวละลาย" unit="mg" value={mg} onChange={setMg} />}
        {s === 'V' ? <Res label="ปริมาตร V" unit="L" val={res} /> : <Field label="ปริมาตร V" unit="L" value={v} onChange={setV} />}
      </div>
    </Card>
  )
}

// ─── Tab 3: Stoichiometry ──────────────────────────────────────────────────
function MoleRatio() {
  const [nA, setNA] = useState(''); const [a, setA] = useState(''); const [b, setB] = useState('')
  const res = useMemo(() => {
    const nAv = p(nA), av = p(a), bv = p(b)
    return ok(nAv, av, bv) && av !== 0 ? nAv * (bv / av) : null
  }, [nA, a, b])
  return (
    <Card title="อัตราส่วนโมล (Mole Ratio)" formula="n_B = n_A × (b / a)  จาก  aA + bB → …">
      <div className="grid grid-cols-3 gap-3">
        <Field label="n_A (โมลสาร A)" unit="mol" value={nA} onChange={setNA} />
        <Field label="a (สัมประสิทธิ์ A)" unit="" value={a} onChange={setA} />
        <Field label="b (สัมประสิทธิ์ B)" unit="" value={b} onChange={setB} />
      </div>
      <Res label="n_B (โมลสาร B)" unit="mol" val={res} />
    </Card>
  )
}

function LimitingReagent() {
  const [nA, setNA] = useState(''); const [a, setA] = useState('');
  const [nB, setNB] = useState(''); const [b, setB] = useState('');
  const [c, setC] = useState('');
  const { limiting, nProduct } = useMemo(() => {
    const NA = p(nA), A = p(a), NB = p(nB), B = p(b), C = p(c)
    if (!ok(NA, A, NB, B) || A === 0 || B === 0) return { limiting: null, nProduct: null }
    const ratioA = NA / A
    const ratioB = NB / B
    const lim = ratioA < ratioB ? 'A' : (ratioB < ratioA ? 'B' : 'เท่ากัน')
    const minRatio = Math.min(ratioA, ratioB)
    const prod = ok(C) ? minRatio * C : null
    return { limiting: lim, nProduct: prod }
  }, [nA, a, nB, b, c])
  return (
    <Card title="รีเอเจนต์จำกัด (Limiting Reagent)" formula="aA + bB → cC  |  หาร n ด้วย a หรือ b">
      <div className="grid grid-cols-2 gap-3">
        <Field label="n_A (โมล A)" unit="mol" value={nA} onChange={setNA} />
        <Field label="a (สัมประสิทธิ์ A)" unit="" value={a} onChange={setA} />
        <Field label="n_B (โมล B)" unit="mol" value={nB} onChange={setNB} />
        <Field label="b (สัมประสิทธิ์ B)" unit="" value={b} onChange={setB} />
      </div>
      <Field label="c (สัมประสิทธิ์ผลิตภัณฑ์ C)" unit="" value={c} onChange={setC} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-emerald-600/70 block mb-1">รีเอเจนต์จำกัด</label>
          <div className={`w-full rounded-xl px-4 py-3 text-center font-bold text-xl ${
            limiting ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300' :
            'bg-slate-900/40 border border-slate-700/30 text-slate-600'
          }`}>{limiting ?? '—'}</div>
        </div>
        <Res label="n_C ได้มาก (max)" unit="mol" val={nProduct} />
      </div>
    </Card>
  )
}

function PercentYield() {
  type S = 'pct' | 'actual' | 'theory'
  const [s, setS] = useState<S>('pct')
  const [pct, setPct] = useState(''); const [actual, setActual] = useState(''); const [theory, setTheory] = useState('')
  const res = useMemo(() => {
    const P = p(pct), A = p(actual), T = p(theory)
    if (s === 'pct' && ok(A, T) && T !== 0) return (A / T) * 100
    if (s === 'actual' && ok(P, T)) return (P / 100) * T
    if (s === 'theory' && ok(P, A) && P !== 0) return A / (P / 100)
    return null
  }, [s, pct, actual, theory])
  return (
    <Card title="เปอร์เซ็นต์ผลผลิต (Percent Yield)" formula="% yield = (actual / theoretical) × 100">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'pct', l: '% yield' }, { v: 'actual', l: 'ผลผลิตจริง' }, { v: 'theory', l: 'ผลผลิตทฤษฎี' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'pct' ? <Res label="% yield" unit="%" val={res} /> : <Field label="% yield" unit="%" value={pct} onChange={setPct} />}
        {s === 'actual' ? <Res label="ผลผลิตจริง" unit="g" val={res} /> : <Field label="ผลผลิตจริง" unit="g" value={actual} onChange={setActual} />}
        {s === 'theory' ? <Res label="ผลผลิตทฤษฎี" unit="g" val={res} /> : <Field label="ผลผลิตทฤษฎี" unit="g" value={theory} onChange={setTheory} />}
      </div>
    </Card>
  )
}

// ─── Tab 4: Thermochemistry ────────────────────────────────────────────────
function HeatCapacity() {
  type S = 'q' | 'm' | 'c' | 'dT'
  const [s, setS] = useState<S>('q')
  const [q, setQ] = useState(''); const [m, setM] = useState(''); const [c, setC] = useState('4.184'); const [dT, setDT] = useState('')
  const res = useMemo(() => {
    const Q = p(q), M = p(m), C = p(c), DT = p(dT)
    if (s === 'q' && ok(M, C, DT)) return M * C * DT
    if (s === 'm' && ok(Q, C, DT) && C * DT !== 0) return Q / (C * DT)
    if (s === 'c' && ok(Q, M, DT) && M * DT !== 0) return Q / (M * DT)
    if (s === 'dT' && ok(Q, M, C) && M * C !== 0) return Q / (M * C)
    return null
  }, [s, q, m, c, dT])
  return (
    <Card title="ความร้อนที่รับ/ปล่อย (Heat)" formula="q = m × c × ΔT" note="น้ำ: c = 4.184 J/g·°C">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'q', l: 'q (ความร้อน)' }, { v: 'm', l: 'm (มวล)' }, { v: 'c', l: 'c (ความจุความร้อน)' }, { v: 'dT', l: 'ΔT (อุณหภูมิ)' }
      ]} />
      <div className="grid grid-cols-2 gap-3">
        {s === 'q' ? <Res label="ความร้อน q" unit="J" val={res} /> : <Field label="ความร้อน q" unit="J" value={q} onChange={setQ} />}
        {s === 'm' ? <Res label="มวล m" unit="g" val={res} /> : <Field label="มวล m" unit="g" value={m} onChange={setM} />}
        {s === 'c' ? <Res label="c (ความจุความร้อน)" unit="J/g·°C" val={res} /> : <Field label="c (ความจุความร้อน)" unit="J/g·°C" value={c} onChange={setC} />}
        {s === 'dT' ? <Res label="ΔT (อุณหภูมิ)" unit="°C" val={res} /> : <Field label="ΔT (อุณหภูมิ)" unit="°C" value={dT} onChange={setDT} />}
      </div>
    </Card>
  )
}

function EnthalpyHess() {
  const [hProd, setHProd] = useState(''); const [hReact, setHReact] = useState('')
  const res = useMemo(() => {
    const HP = p(hProd), HR = p(hReact)
    return ok(HP, HR) ? HP - HR : null
  }, [hProd, hReact])
  return (
    <Card title="เอนทัลปีปฏิกิริยา (Hess's Law)" formula="ΔH_rxn = ΣΔHf(products) − ΣΔHf(reactants)">
      <div className="grid grid-cols-2 gap-3">
        <Field label="ΣΔHf ผลิตภัณฑ์" unit="kJ/mol" value={hProd} onChange={setHProd} />
        <Field label="ΣΔHf สารตั้งต้น" unit="kJ/mol" value={hReact} onChange={setHReact} />
      </div>
      <Res label="ΔH_rxn" unit="kJ/mol" val={res} />
      {res !== null && (
        <p className="text-xs text-center text-slate-400">
          {res < 0 ? '🔥 ปฏิกิริยาคายความร้อน (Exothermic)' : '❄️ ปฏิกิริยาดูดความร้อน (Endothermic)'}
        </p>
      )}
    </Card>
  )
}

function MolarHeat() {
  type S = 'q' | 'n' | 'dH'
  const [s, setS] = useState<S>('q')
  const [q, setQ] = useState(''); const [n, setN] = useState(''); const [dH, setDH] = useState('')
  const res = useMemo(() => {
    const Q = p(q), N = p(n), DH = p(dH)
    if (s === 'q' && ok(N, DH)) return N * DH
    if (s === 'n' && ok(Q, DH) && DH !== 0) return Q / DH
    if (s === 'dH' && ok(Q, N) && N !== 0) return Q / N
    return null
  }, [s, q, n, dH])
  return (
    <Card title="ความร้อนปฏิกิริยาโมลาร์" formula="q = n × ΔH">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'q', l: 'q (ความร้อน)' }, { v: 'n', l: 'n (โมล)' }, { v: 'dH', l: 'ΔH (เอนทัลปี)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'q' ? <Res label="ความร้อน q" unit="J" val={res} /> : <Field label="ความร้อน q" unit="J" value={q} onChange={setQ} />}
        {s === 'n' ? <Res label="n (โมล)" unit="mol" val={res} /> : <Field label="n (โมล)" unit="mol" value={n} onChange={setN} />}
        {s === 'dH' ? <Res label="ΔH (เอนทัลปี)" unit="J/mol" val={res} /> : <Field label="ΔH (เอนทัลปี)" unit="J/mol" value={dH} onChange={setDH} />}
      </div>
    </Card>
  )
}

// ─── Tab 5: Gas Laws ───────────────────────────────────────────────────────
function BoylesLaw() {
  type S = 'P1' | 'V1' | 'P2' | 'V2'
  const [s, setS] = useState<S>('V2')
  const [p1, setP1] = useState(''); const [v1, setV1] = useState(''); const [p2, setP2] = useState(''); const [v2, setV2] = useState('')
  const res = useMemo(() => {
    const P1 = p(p1), V1 = p(v1), P2 = p(p2), V2 = p(v2)
    if (s === 'V2' && ok(P1, V1, P2) && P2 !== 0) return P1 * V1 / P2
    if (s === 'P2' && ok(P1, V1, V2) && V2 !== 0) return P1 * V1 / V2
    if (s === 'V1' && ok(P2, V2, P1) && P1 !== 0) return P2 * V2 / P1
    if (s === 'P1' && ok(P2, V2, V1) && V1 !== 0) return P2 * V2 / V1
    return null
  }, [s, p1, v1, p2, v2])
  return (
    <Card title="กฎบอยล์ (Boyle's Law)" formula="P₁V₁ = P₂V₂  (T คงที่)">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'P1', l: 'P₁' }, { v: 'V1', l: 'V₁' }, { v: 'P2', l: 'P₂' }, { v: 'V2', l: 'V₂' }
      ]} />
      <div className="grid grid-cols-2 gap-3">
        {s === 'P1' ? <Res label="ความดัน P₁" unit="atm" val={res} /> : <Field label="ความดัน P₁" unit="atm" value={p1} onChange={setP1} />}
        {s === 'V1' ? <Res label="ปริมาตร V₁" unit="L" val={res} /> : <Field label="ปริมาตร V₁" unit="L" value={v1} onChange={setV1} />}
        {s === 'P2' ? <Res label="ความดัน P₂" unit="atm" val={res} /> : <Field label="ความดัน P₂" unit="atm" value={p2} onChange={setP2} />}
        {s === 'V2' ? <Res label="ปริมาตร V₂" unit="L" val={res} /> : <Field label="ปริมาตร V₂" unit="L" value={v2} onChange={setV2} />}
      </div>
    </Card>
  )
}

function CharlesLaw() {
  type S = 'V1' | 'T1' | 'V2' | 'T2'
  const [s, setS] = useState<S>('V2')
  const [v1, setV1] = useState(''); const [t1, setT1] = useState(''); const [v2, setV2] = useState(''); const [t2, setT2] = useState('')
  const res = useMemo(() => {
    const V1 = p(v1), T1 = p(t1), V2 = p(v2), T2 = p(t2)
    if (s === 'V2' && ok(V1, T1, T2) && T1 !== 0) return V1 * T2 / T1
    if (s === 'T2' && ok(V1, T1, V2) && V1 !== 0) return T1 * V2 / V1
    if (s === 'V1' && ok(V2, T2, T1) && T2 !== 0) return V2 * T1 / T2
    if (s === 'T1' && ok(V2, T2, V1) && V2 !== 0) return T2 * V1 / V2
    return null
  }, [s, v1, t1, v2, t2])
  return (
    <Card title="กฎชาร์ลส์ (Charles's Law)" formula="V₁/T₁ = V₂/T₂  (P คงที่)" note="T ต้องเป็นหน่วย Kelvin (K = °C + 273.15)">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'V1', l: 'V₁' }, { v: 'T1', l: 'T₁' }, { v: 'V2', l: 'V₂' }, { v: 'T2', l: 'T₂' }
      ]} />
      <div className="grid grid-cols-2 gap-3">
        {s === 'V1' ? <Res label="ปริมาตร V₁" unit="L" val={res} /> : <Field label="ปริมาตร V₁" unit="L" value={v1} onChange={setV1} />}
        {s === 'T1' ? <Res label="อุณหภูมิ T₁" unit="K" val={res} /> : <Field label="อุณหภูมิ T₁" unit="K" value={t1} onChange={setT1} />}
        {s === 'V2' ? <Res label="ปริมาตร V₂" unit="L" val={res} /> : <Field label="ปริมาตร V₂" unit="L" value={v2} onChange={setV2} />}
        {s === 'T2' ? <Res label="อุณหภูมิ T₂" unit="K" val={res} /> : <Field label="อุณหภูมิ T₂" unit="K" value={t2} onChange={setT2} />}
      </div>
    </Card>
  )
}

function IdealGasLaw() {
  type S = 'P' | 'V' | 'n' | 'T'
  const [s, setS] = useState<S>('P')
  const [pv, setPv] = useState(''); const [v, setV] = useState(''); const [n, setN] = useState(''); const [t, setT] = useState('')
  const res = useMemo(() => {
    const P = p(pv), V = p(v), N = p(n), T = p(t)
    if (s === 'P' && ok(N, T, V) && V !== 0) return N * R_GAS * T / V
    if (s === 'V' && ok(N, T, P) && P !== 0) return N * R_GAS * T / P
    if (s === 'n' && ok(P, V, T) && T !== 0) return P * V / (R_GAS * T)
    if (s === 'T' && ok(P, V, N) && N !== 0) return P * V / (R_GAS * N)
    return null
  }, [s, pv, v, n, t])
  const units: Record<S, string> = { P: 'Pa', V: 'm³', n: 'mol', T: 'K' }
  return (
    <Card title="กฎก๊าซอุดมคติ (Ideal Gas Law)" formula="PV = nRT  (R = 8.314 J/mol·K)" note="P ใน Pa, V ใน m³, T ใน K">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'P', l: 'P (ความดัน)' }, { v: 'V', l: 'V (ปริมาตร)' }, { v: 'n', l: 'n (โมล)' }, { v: 'T', l: 'T (อุณหภูมิ)' }
      ]} />
      <div className="grid grid-cols-2 gap-3">
        {s === 'P' ? <Res label="ความดัน P" unit="Pa" val={res} /> : <Field label="ความดัน P" unit="Pa" value={pv} onChange={setPv} />}
        {s === 'V' ? <Res label="ปริมาตร V" unit="m³" val={res} /> : <Field label="ปริมาตร V" unit="m³" value={v} onChange={setV} />}
        {s === 'n' ? <Res label="n (โมล)" unit="mol" val={res} /> : <Field label="n (โมล)" unit="mol" value={n} onChange={setN} />}
        {s === 'T' ? <Res label="อุณหภูมิ T" unit="K" val={res} /> : <Field label="อุณหภูมิ T" unit="K" value={t} onChange={setT} />}
      </div>
      <p className="text-xs text-slate-500 text-center">R = {R_GAS} J/(mol·K)</p>
    </Card>
  )
}

function CelsiusKelvin() {
  const [c, setC] = useState(''); const [k, setK] = useState('');
  const fromC = useMemo(() => ok(p(c)) ? p(c) + 273.15 : null, [c])
  const fromK = useMemo(() => ok(p(k)) ? p(k) - 273.15 : null, [k])
  return (
    <Card title="แปลงอุณหภูมิ °C ↔ K" formula="K = °C + 273.15">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Field label="°C" unit="°C" value={c} onChange={setC} />
          <div className="mt-2"><Res label="→ Kelvin" unit="K" val={fromC} /></div>
        </div>
        <div>
          <Field label="Kelvin" unit="K" value={k} onChange={setK} />
          <div className="mt-2"><Res label="→ °C" unit="°C" val={fromK} /></div>
        </div>
      </div>
    </Card>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────
const TABS = [
  { id: 'mole', label: 'โมล' },
  { id: 'conc', label: 'ความเข้มข้น' },
  { id: 'stoich', label: 'สโตอิคิโอเมทรี' },
  { id: 'thermo', label: 'เทอร์โมเคมี' },
  { id: 'gas', label: 'กฎแก๊ส' },
] as const
type Tab = typeof TABS[number]['id']

export default function ChemistryPage() {
  const [tab, setTab] = useState<Tab>('mole')

  return (
    <div className="page-container space-y-6">
      <PageHeader
        title="สูตรคำนวณเคมี"
        description="Chemistry Formulas — โมล, ความเข้มข้น, สโตอิคิโอเมทรี, เทอร์โมเคมี, กฎแก๊ส"
        icon={FlaskConical}
        color="emerald"
      />

      {/* Tab Bar */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-none px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tab === 'mole' && (
          <>
            <MoleMass />
            <MoleVolumeSTP />
            <MoleParticles />
            <MoleFraction />
          </>
        )}
        {tab === 'conc' && (
          <>
            <MolarityCalc />
            <DilutionCalc />
            <MassPercent />
            <PPMCalc />
          </>
        )}
        {tab === 'stoich' && (
          <>
            <MoleRatio />
            <PercentYield />
            <div className="md:col-span-2">
              <LimitingReagent />
            </div>
          </>
        )}
        {tab === 'thermo' && (
          <>
            <HeatCapacity />
            <MolarHeat />
            <div className="md:col-span-2">
              <EnthalpyHess />
            </div>
          </>
        )}
        {tab === 'gas' && (
          <>
            <BoylesLaw />
            <CharlesLaw />
            <IdealGasLaw />
            <CelsiusKelvin />
          </>
        )}
      </div>
    </div>
  )
}
