'use client'

import { useState, useMemo } from 'react'
import { Rocket } from 'lucide-react'
import PageHeader from '../components/PageHeader'

// ─── Utilities ────────────────────────────────────────────────────────────
const p = (s: string) => parseFloat(s)
const ok = (...ns: number[]) => ns.every(n => isFinite(n) && !isNaN(n))
function fmt(n: number): string {
  if (isNaN(n) || !isFinite(n)) return 'Error'
  if (n === 0) return '0'
  const abs = Math.abs(n)
  if (abs < 0.0001 || abs >= 1e8) return n.toExponential(4)
  return parseFloat(n.toPrecision(6)).toString()
}
const toRad = (deg: number) => (deg * Math.PI) / 180
const G = 9.81

// ─── UI Components ─────────────────────────────────────────────────────────
function Card({ title, formula, note, children }: {
  title: string; formula: React.ReactNode; note?: string; children: React.ReactNode
}) {
  return (
    <div className="section-card space-y-4">
      <div>
        <h3 className="font-semibold text-white text-sm mb-2">{title}</h3>
        <div className="font-mono text-cyan-300 bg-slate-950/60 border border-cyan-500/20 rounded-xl px-4 py-2.5 text-sm text-center leading-relaxed">
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
      <label className="text-xs text-cyan-600/70 block mb-1">{label} <span className="text-cyan-800">({unit})</span></label>
      <div className={`w-full rounded-xl px-4 py-3 text-center font-mono font-bold text-xl ${
        val !== null ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-300' :
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
            solve === o.v ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}>
          {o.l}
        </button>
      ))}
    </div>
  )
}

// ─── Tab 1: Kinematics ─────────────────────────────────────────────────────
function KinematicVAT() {
  type S = 'v' | 'u' | 'a' | 't'
  const [s, setS] = useState<S>('v')
  const [v, setV] = useState(''); const [u, setU] = useState(''); const [a, setA] = useState(''); const [t, setT] = useState('')
  const res = useMemo(() => {
    const V = p(v), U = p(u), A = p(a), T = p(t)
    if (s === 'v' && ok(U, A, T)) return U + A * T
    if (s === 'u' && ok(V, A, T)) return V - A * T
    if (s === 'a' && ok(V, U, T) && T !== 0) return (V - U) / T
    if (s === 't' && ok(V, U, A) && A !== 0) return (V - U) / A
    return null
  }, [s, v, u, a, t])
  return (
    <Card title="สมการที่ 1: v = u + at" formula="v = u + at">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'v', l: 'v (ความเร็วสุดท้าย)' }, { v: 'u', l: 'u (ความเร็วต้น)' },
        { v: 'a', l: 'a (ความเร่ง)' }, { v: 't', l: 't (เวลา)' }
      ]} />
      <div className="grid grid-cols-2 gap-3">
        {s === 'v' ? <Res label="ความเร็วสุดท้าย v" unit="m/s" val={res} /> : <Field label="ความเร็วสุดท้าย v" unit="m/s" value={v} onChange={setV} />}
        {s === 'u' ? <Res label="ความเร็วต้น u" unit="m/s" val={res} /> : <Field label="ความเร็วต้น u" unit="m/s" value={u} onChange={setU} />}
        {s === 'a' ? <Res label="ความเร่ง a" unit="m/s²" val={res} /> : <Field label="ความเร่ง a" unit="m/s²" value={a} onChange={setA} />}
        {s === 't' ? <Res label="เวลา t" unit="s" val={res} /> : <Field label="เวลา t" unit="s" value={t} onChange={setT} />}
      </div>
    </Card>
  )
}

function KinematicSUAT() {
  type S = 's' | 'u' | 'a' | 't'
  const [s, setS] = useState<S>('s')
  const [sv, setSv] = useState(''); const [u, setU] = useState(''); const [a, setA] = useState(''); const [t, setT] = useState('')
  const res = useMemo(() => {
    const S = p(sv), U = p(u), A = p(a), T = p(t)
    if (s === 's' && ok(U, A, T)) return U * T + 0.5 * A * T * T
    if (s === 'u' && ok(S, A, T) && T !== 0) return (S - 0.5 * A * T * T) / T
    if (s === 'a' && ok(S, U, T) && T !== 0) return 2 * (S - U * T) / (T * T)
    // solve for t requires quadratic formula
    if (s === 't' && ok(S, U, A) && A !== 0) {
      const disc = U * U + 2 * A * S
      if (disc < 0) return null
      const t1 = (-U + Math.sqrt(disc)) / A
      const t2 = (-U - Math.sqrt(disc)) / A
      return t1 >= 0 ? t1 : (t2 >= 0 ? t2 : null)
    }
    if (s === 't' && ok(S, U) && U !== 0) return S / U
    return null
  }, [s, sv, u, a, t])
  return (
    <Card title="สมการที่ 2: s = ut + ½at²" formula="s = ut + ½at²">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 's', l: 's (ระยะทาง)' }, { v: 'u', l: 'u (ความเร็วต้น)' },
        { v: 'a', l: 'a (ความเร่ง)' }, { v: 't', l: 't (เวลา)' }
      ]} />
      <div className="grid grid-cols-2 gap-3">
        {s === 's' ? <Res label="ระยะทาง s" unit="m" val={res} /> : <Field label="ระยะทาง s" unit="m" value={sv} onChange={setSv} />}
        {s === 'u' ? <Res label="ความเร็วต้น u" unit="m/s" val={res} /> : <Field label="ความเร็วต้น u" unit="m/s" value={u} onChange={setU} />}
        {s === 'a' ? <Res label="ความเร่ง a" unit="m/s²" val={res} /> : <Field label="ความเร่ง a" unit="m/s²" value={a} onChange={setA} />}
        {s === 't' ? <Res label="เวลา t" unit="s" val={res} /> : <Field label="เวลา t" unit="s" value={t} onChange={setT} />}
      </div>
    </Card>
  )
}

function KinematicV2U2AS() {
  type S = 'v' | 'u' | 'a' | 's'
  const [s, setS] = useState<S>('v')
  const [v, setV] = useState(''); const [u, setU] = useState(''); const [a, setA] = useState(''); const [sv, setSv] = useState('')
  const res = useMemo(() => {
    const V = p(v), U = p(u), A = p(a), S = p(sv)
    if (s === 'v' && ok(U, A, S)) { const r = U * U + 2 * A * S; return r >= 0 ? Math.sqrt(r) : null }
    if (s === 'u' && ok(V, A, S)) { const r = V * V - 2 * A * S; return r >= 0 ? Math.sqrt(r) : null }
    if (s === 'a' && ok(V, U, S) && S !== 0) return (V * V - U * U) / (2 * S)
    if (s === 's' && ok(V, U, A) && A !== 0) return (V * V - U * U) / (2 * A)
    return null
  }, [s, v, u, a, sv])
  return (
    <Card title="สมการที่ 3: v² = u² + 2as" formula="v² = u² + 2as">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'v', l: 'v (ความเร็วสุดท้าย)' }, { v: 'u', l: 'u (ความเร็วต้น)' },
        { v: 'a', l: 'a (ความเร่ง)' }, { v: 's', l: 's (ระยะทาง)' }
      ]} />
      <div className="grid grid-cols-2 gap-3">
        {s === 'v' ? <Res label="ความเร็วสุดท้าย v" unit="m/s" val={res} /> : <Field label="ความเร็วสุดท้าย v" unit="m/s" value={v} onChange={setV} />}
        {s === 'u' ? <Res label="ความเร็วต้น u" unit="m/s" val={res} /> : <Field label="ความเร็วต้น u" unit="m/s" value={u} onChange={setU} />}
        {s === 'a' ? <Res label="ความเร่ง a" unit="m/s²" val={res} /> : <Field label="ความเร่ง a" unit="m/s²" value={a} onChange={setA} />}
        {s === 's' ? <Res label="ระยะทาง s" unit="m" val={res} /> : <Field label="ระยะทาง s" unit="m" value={sv} onChange={setSv} />}
      </div>
    </Card>
  )
}

function AverageVelocity() {
  type S = 's' | 'u' | 'v' | 't'
  const [s, setS] = useState<S>('s')
  const [sv, setSv] = useState(''); const [u, setU] = useState(''); const [v, setV] = useState(''); const [t, setT] = useState('')
  const res = useMemo(() => {
    const S = p(sv), U = p(u), V = p(v), T = p(t)
    if (s === 's' && ok(U, V, T)) return 0.5 * (U + V) * T
    if (s === 'u' && ok(S, V, T) && T !== 0) return 2 * S / T - V
    if (s === 'v' && ok(S, U, T) && T !== 0) return 2 * S / T - U
    if (s === 't' && ok(S, U, V) && U + V !== 0) return 2 * S / (U + V)
    return null
  }, [s, sv, u, v, t])
  return (
    <Card title="สมการที่ 4: s = ½(u+v)t" formula="s = ½(u + v)t">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 's', l: 's (ระยะทาง)' }, { v: 'u', l: 'u (ความเร็วต้น)' },
        { v: 'v', l: 'v (ความเร็วสุดท้าย)' }, { v: 't', l: 't (เวลา)' }
      ]} />
      <div className="grid grid-cols-2 gap-3">
        {s === 's' ? <Res label="ระยะทาง s" unit="m" val={res} /> : <Field label="ระยะทาง s" unit="m" value={sv} onChange={setSv} />}
        {s === 'u' ? <Res label="ความเร็วต้น u" unit="m/s" val={res} /> : <Field label="ความเร็วต้น u" unit="m/s" value={u} onChange={setU} />}
        {s === 'v' ? <Res label="ความเร็วสุดท้าย v" unit="m/s" val={res} /> : <Field label="ความเร็วสุดท้าย v" unit="m/s" value={v} onChange={setV} />}
        {s === 't' ? <Res label="เวลา t" unit="s" val={res} /> : <Field label="เวลา t" unit="s" value={t} onChange={setT} />}
      </div>
    </Card>
  )
}

// ─── Tab 2: Forces ─────────────────────────────────────────────────────────
function NewtonsSecond() {
  type S = 'F' | 'm' | 'a'
  const [s, setS] = useState<S>('F')
  const [f, setF] = useState(''); const [m, setM] = useState(''); const [a, setA] = useState('')
  const res = useMemo(() => {
    const F = p(f), M = p(m), A = p(a)
    if (s === 'F' && ok(M, A)) return M * A
    if (s === 'm' && ok(F, A) && A !== 0) return F / A
    if (s === 'a' && ok(F, M) && M !== 0) return F / M
    return null
  }, [s, f, m, a])
  return (
    <Card title="กฎที่ 2 ของนิวตัน (Newton's 2nd Law)" formula="F = ma">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'F', l: 'F (แรง)' }, { v: 'm', l: 'm (มวล)' }, { v: 'a', l: 'a (ความเร่ง)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'F' ? <Res label="แรง F" unit="N" val={res} /> : <Field label="แรง F" unit="N" value={f} onChange={setF} />}
        {s === 'm' ? <Res label="มวล m" unit="kg" val={res} /> : <Field label="มวล m" unit="kg" value={m} onChange={setM} />}
        {s === 'a' ? <Res label="ความเร่ง a" unit="m/s²" val={res} /> : <Field label="ความเร่ง a" unit="m/s²" value={a} onChange={setA} />}
      </div>
    </Card>
  )
}

function FrictionCalc() {
  type S = 'f' | 'mu' | 'N'
  const [s, setS] = useState<S>('f')
  const [fv, setFv] = useState(''); const [mu, setMu] = useState(''); const [n, setN] = useState('')
  const res = useMemo(() => {
    const F = p(fv), μ = p(mu), N = p(n)
    if (s === 'f' && ok(μ, N)) return μ * N
    if (s === 'mu' && ok(F, N) && N !== 0) return F / N
    if (s === 'N' && ok(F, μ) && μ !== 0) return F / μ
    return null
  }, [s, fv, mu, n])
  return (
    <Card title="แรงเสียดทาน (Friction Force)" formula="f = μ × N">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'f', l: 'f (แรงเสียดทาน)' }, { v: 'mu', l: 'μ (สัมประสิทธิ์)' }, { v: 'N', l: 'N (แรงกดปกติ)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'f' ? <Res label="แรงเสียดทาน f" unit="N" val={res} /> : <Field label="แรงเสียดทาน f" unit="N" value={fv} onChange={setFv} />}
        {s === 'mu' ? <Res label="สัมประสิทธิ์ μ" unit="" val={res} /> : <Field label="สัมประสิทธิ์ μ" unit="" value={mu} onChange={setMu} />}
        {s === 'N' ? <Res label="แรงกดปกติ N" unit="N" val={res} /> : <Field label="แรงกดปกติ N" unit="N" value={n} onChange={setN} />}
      </div>
    </Card>
  )
}

function InclinedPlane() {
  const [m, setM] = useState(''); const [theta, setTheta] = useState(''); const [g, setGv] = useState('9.81')
  const { Fpar, Fperp, Nval } = useMemo(() => {
    const M = p(m), θ = toRad(p(theta)), G = p(g)
    if (!ok(M, p(theta), G)) return { Fpar: null, Fperp: null, Nval: null }
    return { Fpar: M * G * Math.sin(θ), Fperp: M * G * Math.cos(θ), Nval: M * G * Math.cos(θ) }
  }, [m, theta, g])
  return (
    <Card title="พื้นเอียง (Inclined Plane)" formula="F∥ = mg sin(θ)  |  N = mg cos(θ)">
      <div className="grid grid-cols-3 gap-3">
        <Field label="มวล m" unit="kg" value={m} onChange={setM} />
        <Field label="มุมเอียง θ" unit="°" value={theta} onChange={setTheta} />
        <Field label="g" unit="m/s²" value={g} onChange={setGv} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Res label="แรงขนานพื้น F∥" unit="N" val={Fpar} />
        <Res label="แรงตั้งฉากพื้น F⊥" unit="N" val={Fperp} />
        <Res label="แรงกดปกติ N" unit="N" val={Nval} />
      </div>
    </Card>
  )
}

function CentripetalForce() {
  type S = 'Fc' | 'm' | 'v' | 'r'
  const [s, setS] = useState<S>('Fc')
  const [fc, setFc] = useState(''); const [m, setM] = useState(''); const [v, setV] = useState(''); const [r, setR] = useState('')
  const res = useMemo(() => {
    const Fc = p(fc), M = p(m), V = p(v), R = p(r)
    if (s === 'Fc' && ok(M, V, R) && R !== 0) return M * V * V / R
    if (s === 'm' && ok(Fc, V, R) && V !== 0 && R !== 0) return Fc * R / (V * V)
    if (s === 'v' && ok(Fc, M, R) && M !== 0) { const r2 = Fc * R / M; return r2 >= 0 ? Math.sqrt(r2) : null }
    if (s === 'r' && ok(Fc, M, V) && Fc !== 0) return M * V * V / Fc
    return null
  }, [s, fc, m, v, r])
  return (
    <Card title="แรงสู่ศูนย์กลาง (Centripetal Force)" formula="F_c = mv² / r">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'Fc', l: 'F_c (แรง)' }, { v: 'm', l: 'm (มวล)' }, { v: 'v', l: 'v (ความเร็ว)' }, { v: 'r', l: 'r (รัศมี)' }
      ]} />
      <div className="grid grid-cols-2 gap-3">
        {s === 'Fc' ? <Res label="แรง F_c" unit="N" val={res} /> : <Field label="แรง F_c" unit="N" value={fc} onChange={setFc} />}
        {s === 'm' ? <Res label="มวล m" unit="kg" val={res} /> : <Field label="มวล m" unit="kg" value={m} onChange={setM} />}
        {s === 'v' ? <Res label="ความเร็ว v" unit="m/s" val={res} /> : <Field label="ความเร็ว v" unit="m/s" value={v} onChange={setV} />}
        {s === 'r' ? <Res label="รัศมี r" unit="m" val={res} /> : <Field label="รัศมี r" unit="m" value={r} onChange={setR} />}
      </div>
    </Card>
  )
}

// ─── Tab 3: Energy & Work ──────────────────────────────────────────────────
function KineticEnergy() {
  type S = 'KE' | 'm' | 'v'
  const [s, setS] = useState<S>('KE')
  const [ke, setKe] = useState(''); const [m, setM] = useState(''); const [v, setV] = useState('')
  const res = useMemo(() => {
    const KE = p(ke), M = p(m), V = p(v)
    if (s === 'KE' && ok(M, V)) return 0.5 * M * V * V
    if (s === 'm' && ok(KE, V) && V !== 0) return 2 * KE / (V * V)
    if (s === 'v' && ok(KE, M) && M !== 0) { const r = 2 * KE / M; return r >= 0 ? Math.sqrt(r) : null }
    return null
  }, [s, ke, m, v])
  return (
    <Card title="พลังงานจลน์ (Kinetic Energy)" formula="KE = ½mv²">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'KE', l: 'KE (พลังงานจลน์)' }, { v: 'm', l: 'm (มวล)' }, { v: 'v', l: 'v (ความเร็ว)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'KE' ? <Res label="พลังงานจลน์ KE" unit="J" val={res} /> : <Field label="พลังงานจลน์ KE" unit="J" value={ke} onChange={setKe} />}
        {s === 'm' ? <Res label="มวล m" unit="kg" val={res} /> : <Field label="มวล m" unit="kg" value={m} onChange={setM} />}
        {s === 'v' ? <Res label="ความเร็ว v" unit="m/s" val={res} /> : <Field label="ความเร็ว v" unit="m/s" value={v} onChange={setV} />}
      </div>
    </Card>
  )
}

function GravitationalPE() {
  type S = 'PE' | 'm' | 'h'
  const [s, setS] = useState<S>('PE')
  const [pe, setPe] = useState(''); const [m, setM] = useState(''); const [h, setH] = useState(''); const [gv, setGv] = useState('9.81')
  const res = useMemo(() => {
    const PE = p(pe), M = p(m), H = p(h), G = p(gv)
    if (s === 'PE' && ok(M, H, G)) return M * G * H
    if (s === 'm' && ok(PE, H, G) && H * G !== 0) return PE / (H * G)
    if (s === 'h' && ok(PE, M, G) && M * G !== 0) return PE / (M * G)
    return null
  }, [s, pe, m, h, gv])
  return (
    <Card title="พลังงานศักย์โน้มถ่วง (Gravitational PE)" formula="PE = mgh">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'PE', l: 'PE (พลังงาน)' }, { v: 'm', l: 'm (มวล)' }, { v: 'h', l: 'h (ความสูง)' }
      ]} />
      <div className="grid grid-cols-2 gap-3">
        {s === 'PE' ? <Res label="พลังงานศักย์ PE" unit="J" val={res} /> : <Field label="พลังงานศักย์ PE" unit="J" value={pe} onChange={setPe} />}
        {s === 'm' ? <Res label="มวล m" unit="kg" val={res} /> : <Field label="มวล m" unit="kg" value={m} onChange={setM} />}
        {s === 'h' ? <Res label="ความสูง h" unit="m" val={res} /> : <Field label="ความสูง h" unit="m" value={h} onChange={setH} />}
        <Field label="g" unit="m/s²" value={gv} onChange={setGv} />
      </div>
    </Card>
  )
}

function WorkCalc() {
  type S = 'W' | 'F' | 'd'
  const [s, setS] = useState<S>('W')
  const [wv, setWv] = useState(''); const [f, setF] = useState(''); const [d, setD] = useState(''); const [theta, setTheta] = useState('0')
  const res = useMemo(() => {
    const W = p(wv), F = p(f), D = p(d), cosT = Math.cos(toRad(p(theta)))
    if (s === 'W' && ok(F, D)) return F * D * cosT
    if (s === 'F' && ok(W, D) && D * cosT !== 0) return W / (D * cosT)
    if (s === 'd' && ok(W, F) && F * cosT !== 0) return W / (F * cosT)
    return null
  }, [s, wv, f, d, theta])
  return (
    <Card title="งาน (Work)" formula="W = F × d × cos(θ)">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'W', l: 'W (งาน)' }, { v: 'F', l: 'F (แรง)' }, { v: 'd', l: 'd (ระยะทาง)' }
      ]} />
      <div className="grid grid-cols-2 gap-3">
        {s === 'W' ? <Res label="งาน W" unit="J" val={res} /> : <Field label="งาน W" unit="J" value={wv} onChange={setWv} />}
        {s === 'F' ? <Res label="แรง F" unit="N" val={res} /> : <Field label="แรง F" unit="N" value={f} onChange={setF} />}
        {s === 'd' ? <Res label="ระยะทาง d" unit="m" val={res} /> : <Field label="ระยะทาง d" unit="m" value={d} onChange={setD} />}
        <Field label="มุม θ (แรงกับทิศ)" unit="°" value={theta} onChange={setTheta} />
      </div>
    </Card>
  )
}

function PowerCalcPhys() {
  type S = 'P' | 'W' | 't'
  const [s, setS] = useState<S>('P')
  const [pv, setPv] = useState(''); const [w, setW] = useState(''); const [t, setT] = useState('')
  const res = useMemo(() => {
    const P = p(pv), W = p(w), T = p(t)
    if (s === 'P' && ok(W, T) && T !== 0) return W / T
    if (s === 'W' && ok(P, T)) return P * T
    if (s === 't' && ok(W, P) && P !== 0) return W / P
    return null
  }, [s, pv, w, t])
  return (
    <Card title="กำลัง (Power)" formula="P = W / t">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'P', l: 'P (กำลัง)' }, { v: 'W', l: 'W (งาน)' }, { v: 't', l: 't (เวลา)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'P' ? <Res label="กำลัง P" unit="W" val={res} /> : <Field label="กำลัง P" unit="W" value={pv} onChange={setPv} />}
        {s === 'W' ? <Res label="งาน W" unit="J" val={res} /> : <Field label="งาน W" unit="J" value={w} onChange={setW} />}
        {s === 't' ? <Res label="เวลา t" unit="s" val={res} /> : <Field label="เวลา t" unit="s" value={t} onChange={setT} />}
      </div>
    </Card>
  )
}

// ─── Tab 4: Springs & SHM ──────────────────────────────────────────────────
function HookesLaw() {
  type S = 'F' | 'k' | 'x'
  const [s, setS] = useState<S>('F')
  const [f, setF] = useState(''); const [k, setK] = useState(''); const [x, setX] = useState('')
  const res = useMemo(() => {
    const F = p(f), K = p(k), X = p(x)
    if (s === 'F' && ok(K, X)) return K * X
    if (s === 'k' && ok(F, X) && X !== 0) return F / X
    if (s === 'x' && ok(F, K) && K !== 0) return F / K
    return null
  }, [s, f, k, x])
  return (
    <Card title="กฎฮุก (Hooke's Law)" formula="F = k × x">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'F', l: 'F (แรงสปริง)' }, { v: 'k', l: 'k (ค่าคงสปริง)' }, { v: 'x', l: 'x (การยืด/หด)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'F' ? <Res label="แรงสปริง F" unit="N" val={res} /> : <Field label="แรงสปริง F" unit="N" value={f} onChange={setF} />}
        {s === 'k' ? <Res label="ค่าคงสปริง k" unit="N/m" val={res} /> : <Field label="ค่าคงสปริง k" unit="N/m" value={k} onChange={setK} />}
        {s === 'x' ? <Res label="การยืด/หด x" unit="m" val={res} /> : <Field label="การยืด/หด x" unit="m" value={x} onChange={setX} />}
      </div>
    </Card>
  )
}

function SpringPE() {
  type S = 'PE' | 'k' | 'x'
  const [s, setS] = useState<S>('PE')
  const [pe, setPe] = useState(''); const [k, setK] = useState(''); const [x, setX] = useState('')
  const res = useMemo(() => {
    const PE = p(pe), K = p(k), X = p(x)
    if (s === 'PE' && ok(K, X)) return 0.5 * K * X * X
    if (s === 'k' && ok(PE, X) && X !== 0) return 2 * PE / (X * X)
    if (s === 'x' && ok(PE, K) && K !== 0) { const r = 2 * PE / K; return r >= 0 ? Math.sqrt(r) : null }
    return null
  }, [s, pe, k, x])
  return (
    <Card title="พลังงานสะสมสปริง (Spring PE)" formula="PE = ½kx²">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'PE', l: 'PE (พลังงาน)' }, { v: 'k', l: 'k (ค่าคงสปริง)' }, { v: 'x', l: 'x (การยืด)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'PE' ? <Res label="พลังงาน PE" unit="J" val={res} /> : <Field label="พลังงาน PE" unit="J" value={pe} onChange={setPe} />}
        {s === 'k' ? <Res label="ค่าคงสปริง k" unit="N/m" val={res} /> : <Field label="ค่าคงสปริง k" unit="N/m" value={k} onChange={setK} />}
        {s === 'x' ? <Res label="การยืด x" unit="m" val={res} /> : <Field label="การยืด x" unit="m" value={x} onChange={setX} />}
      </div>
    </Card>
  )
}

function SHMPeriod() {
  const [m, setM] = useState(''); const [k, setK] = useState('')
  const { T, f, omega } = useMemo(() => {
    const M = p(m), K = p(k)
    if (!ok(M, K) || K <= 0 || M <= 0) return { T: null, f: null, omega: null }
    const T = 2 * Math.PI * Math.sqrt(M / K)
    return { T, f: 1 / T, omega: 2 * Math.PI / T }
  }, [m, k])
  return (
    <Card title="คาบการสั่น SHM สปริง-มวล" formula="T = 2π√(m/k)">
      <div className="grid grid-cols-2 gap-3">
        <Field label="มวล m" unit="kg" value={m} onChange={setM} />
        <Field label="ค่าคงสปริง k" unit="N/m" value={k} onChange={setK} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Res label="คาบ T" unit="s" val={T} />
        <Res label="ความถี่ f" unit="Hz" val={f} />
        <Res label="ω" unit="rad/s" val={omega} />
      </div>
    </Card>
  )
}

function PendulumPeriod() {
  const [l, setL] = useState(''); const [gv, setGv] = useState('9.81')
  const { T, f } = useMemo(() => {
    const L = p(l), G = p(gv)
    if (!ok(L, G) || L <= 0 || G <= 0) return { T: null, f: null }
    const T = 2 * Math.PI * Math.sqrt(L / G)
    return { T, f: 1 / T }
  }, [l, gv])
  return (
    <Card title="คาบลูกตุ้ม (Pendulum Period)" formula="T = 2π√(L/g)" note="สำหรับมุมแกว่งเล็กน้อย (<15°)">
      <div className="grid grid-cols-2 gap-3">
        <Field label="ความยาวเชือก L" unit="m" value={l} onChange={setL} />
        <Field label="g" unit="m/s²" value={gv} onChange={setGv} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Res label="คาบ T" unit="s" val={T} />
        <Res label="ความถี่ f" unit="Hz" val={f} />
      </div>
    </Card>
  )
}

// ─── Tab 5: Projectile ─────────────────────────────────────────────────────
function ProjectileCalc() {
  const [v0, setV0] = useState(''); const [theta, setTheta] = useState('45'); const [gv, setGv] = useState('9.81')
  const results = useMemo(() => {
    const V0 = p(v0), θ = toRad(p(theta)), G = p(gv)
    if (!ok(V0, p(theta), G) || G <= 0 || V0 < 0) return null
    const sinT = Math.sin(θ), cosT = Math.cos(θ)
    const R = V0 * V0 * Math.sin(2 * θ) / G
    const H = V0 * V0 * sinT * sinT / (2 * G)
    const T = 2 * V0 * sinT / G
    const vx = V0 * cosT
    const vy0 = V0 * sinT
    return { R, H, T, vx, vy0 }
  }, [v0, theta, gv])
  return (
    <Card title="การเคลื่อนที่แบบโพรเจกไทล์ (Projectile Motion)" formula={'R = v₀²sin(2θ)/g  |  H = v₀²sin²(θ)/(2g)'}>
      <div className="grid grid-cols-3 gap-3">
        <Field label="ความเร็วต้น v₀" unit="m/s" value={v0} onChange={setV0} />
        <Field label="มุมยิง θ" unit="°" value={theta} onChange={setTheta} />
        <Field label="g" unit="m/s²" value={gv} onChange={setGv} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Res label="ระยะยิงสูงสุด R" unit="m" val={results?.R ?? null} />
        <Res label="ความสูงสูงสุด H" unit="m" val={results?.H ?? null} />
        <Res label="เวลาบิน T" unit="s" val={results?.T ?? null} />
        <Res label="ความเร็วแนวนอน vₓ" unit="m/s" val={results?.vx ?? null} />
        <Res label="ความเร็วแนวตั้งต้น v_{y0}" unit="m/s" val={results?.vy0 ?? null} />
      </div>
    </Card>
  )
}

function ProjectilePosition() {
  const [v0, setV0] = useState(''); const [theta, setTheta] = useState('45');
  const [t, setT] = useState(''); const [gv, setGv] = useState('9.81')
  const { x, y, vx, vy } = useMemo(() => {
    const V0 = p(v0), θ = toRad(p(theta)), T = p(t), G = p(gv)
    if (!ok(V0, p(theta), T, G)) return { x: null, y: null, vx: null, vy: null }
    return {
      x: V0 * Math.cos(θ) * T,
      y: V0 * Math.sin(θ) * T - 0.5 * G * T * T,
      vx: V0 * Math.cos(θ),
      vy: V0 * Math.sin(θ) - G * T,
    }
  }, [v0, theta, t, gv])
  return (
    <Card title="ตำแหน่งและความเร็วที่เวลา t" formula="x = v₀cos(θ)·t  |  y = v₀sin(θ)·t − ½gt²">
      <div className="grid grid-cols-2 gap-3">
        <Field label="ความเร็วต้น v₀" unit="m/s" value={v0} onChange={setV0} />
        <Field label="มุมยิง θ" unit="°" value={theta} onChange={setTheta} />
        <Field label="เวลา t" unit="s" value={t} onChange={setT} />
        <Field label="g" unit="m/s²" value={gv} onChange={setGv} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Res label="ตำแหน่ง x" unit="m" val={x} />
        <Res label="ตำแหน่ง y" unit="m" val={y} />
        <Res label="ความเร็ว vₓ" unit="m/s" val={vx} />
        <Res label="ความเร็ว v_y" unit="m/s" val={vy} />
      </div>
    </Card>
  )
}

// ─── Tab 6: Waves ──────────────────────────────────────────────────────────
function WaveRelation() {
  type S = 'v' | 'f' | 'lambda'
  const [s, setS] = useState<S>('v')
  const [v, setV] = useState(''); const [f, setF] = useState(''); const [lam, setLam] = useState('')
  const res = useMemo(() => {
    const V = p(v), F = p(f), L = p(lam)
    if (s === 'v' && ok(F, L)) return F * L
    if (s === 'f' && ok(V, L) && L !== 0) return V / L
    if (s === 'lambda' && ok(V, F) && F !== 0) return V / F
    return null
  }, [s, v, f, lam])
  return (
    <Card title="ความสัมพันธ์คลื่น (Wave Equation)" formula="v = f × λ">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'v', l: 'v (ความเร็วคลื่น)' }, { v: 'f', l: 'f (ความถี่)' }, { v: 'lambda', l: 'λ (ความยาวคลื่น)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'v' ? <Res label="ความเร็วคลื่น v" unit="m/s" val={res} /> : <Field label="ความเร็วคลื่น v" unit="m/s" value={v} onChange={setV} />}
        {s === 'f' ? <Res label="ความถี่ f" unit="Hz" val={res} /> : <Field label="ความถี่ f" unit="Hz" value={f} onChange={setF} />}
        {s === 'lambda' ? <Res label="ความยาวคลื่น λ" unit="m" val={res} /> : <Field label="ความยาวคลื่น λ" unit="m" value={lam} onChange={setLam} />}
      </div>
    </Card>
  )
}

function PhotonEnergy() {
  type S = 'E' | 'f' | 'lambda'
  const [s, setS] = useState<S>('E')
  const [e, setE] = useState(''); const [f, setF] = useState(''); const [lam, setLam] = useState('')
  const h = 6.62607015e-34, c = 2.99792458e8
  const res = useMemo(() => {
    const E = p(e), F = p(f), L = p(lam)
    if (s === 'E') {
      if (ok(F)) return h * F
      if (ok(L) && L > 0) return h * c / L
    }
    if (s === 'f' && ok(E) && E > 0) return E / h
    if (s === 'lambda' && ok(E) && E > 0) return h * c / E
    return null
  }, [s, e, f, lam])
  return (
    <Card title="พลังงานโฟตอน (Photon Energy)" formula="E = hf = hc/λ  (h = 6.626×10⁻³⁴ J·s)">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'E', l: 'E (พลังงาน)' }, { v: 'f', l: 'f (ความถี่)' }, { v: 'lambda', l: 'λ (ความยาวคลื่น)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'E' ? <Res label="พลังงาน E" unit="J" val={res} /> : <Field label="พลังงาน E" unit="J" value={e} onChange={setE} />}
        {s === 'f' ? <Res label="ความถี่ f" unit="Hz" val={res} /> : <Field label="ความถี่ f" unit="Hz" value={f} onChange={setF} />}
        {s === 'lambda' ? <Res label="ความยาวคลื่น λ" unit="m" val={res} /> : <Field label="ความยาวคลื่น λ" unit="m" value={lam} onChange={setLam} />}
      </div>
    </Card>
  )
}

function SnellsLaw() {
  type S = 'n1' | 'theta1' | 'n2' | 'theta2'
  const [s, setS] = useState<S>('theta2')
  const [n1, setN1] = useState('1'); const [t1, setT1] = useState('');
  const [n2, setN2] = useState(''); const [t2, setT2] = useState('')
  const res = useMemo(() => {
    const N1 = p(n1), T1 = toRad(p(t1)), N2 = p(n2), T2 = toRad(p(t2))
    if (s === 'theta2' && ok(N1, p(t1), N2) && N2 !== 0) {
      const sinT2 = N1 * Math.sin(T1) / N2
      return Math.abs(sinT2) <= 1 ? (180 / Math.PI) * Math.asin(sinT2) : null
    }
    if (s === 'theta1' && ok(N1, N2, p(t2)) && N1 !== 0) {
      const sinT1 = N2 * Math.sin(T2) / N1
      return Math.abs(sinT1) <= 1 ? (180 / Math.PI) * Math.asin(sinT1) : null
    }
    if (s === 'n1' && ok(N2, p(t2), p(t1)) && Math.sin(T1) !== 0) return N2 * Math.sin(T2) / Math.sin(T1)
    if (s === 'n2' && ok(N1, p(t1), p(t2)) && Math.sin(T2) !== 0) return N1 * Math.sin(T1) / Math.sin(T2)
    return null
  }, [s, n1, t1, n2, t2])
  return (
    <Card title="กฎสเนลล์ (Snell's Law)" formula="n₁ sin(θ₁) = n₂ sin(θ₂)">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'n1', l: 'n₁' }, { v: 'theta1', l: 'θ₁' }, { v: 'n2', l: 'n₂' }, { v: 'theta2', l: 'θ₂' }
      ]} />
      <div className="grid grid-cols-2 gap-3">
        {s === 'n1' ? <Res label="ดัชนีหักเห n₁" unit="" val={res} /> : <Field label="ดัชนีหักเห n₁" unit="" value={n1} onChange={setN1} />}
        {s === 'theta1' ? <Res label="มุม θ₁" unit="°" val={res} /> : <Field label="มุม θ₁" unit="°" value={t1} onChange={setT1} />}
        {s === 'n2' ? <Res label="ดัชนีหักเห n₂" unit="" val={res} /> : <Field label="ดัชนีหักเห n₂" unit="" value={n2} onChange={setN2} />}
        {s === 'theta2' ? <Res label="มุม θ₂" unit="°" val={res} /> : <Field label="มุม θ₂" unit="°" value={t2} onChange={setT2} />}
      </div>
    </Card>
  )
}

function ThinLens() {
  type S = 'f' | 'do' | 'di'
  const [s, setS] = useState<S>('di')
  const [f, setF] = useState(''); const [dov, setDov] = useState(''); const [div, setDiv] = useState('')
  const res = useMemo(() => {
    const F = p(f), Do = p(dov), Di = p(div)
    if (s === 'di' && ok(F, Do) && Do !== 0 && F !== Do) return 1 / (1 / F - 1 / Do)
    if (s === 'do' && ok(F, Di) && Di !== 0 && F !== Di) return 1 / (1 / F - 1 / Di)
    if (s === 'f' && ok(Do, Di) && Do !== 0 && Di !== 0) return 1 / (1 / Do + 1 / Di)
    return null
  }, [s, f, dov, div])
  return (
    <Card title="สมการเลนส์บาง (Thin Lens)" formula="1/f = 1/d_o + 1/d_i" note="ระยะห่างเป็นบวก = วัตถุ/ภาพจริง">
      <SolveFor solve={s} setSolve={setS} opts={[
        { v: 'f', l: 'f (ความยาวโฟกัส)' }, { v: 'do', l: 'd_o (ระยะวัตถุ)' }, { v: 'di', l: 'd_i (ระยะภาพ)' }
      ]} />
      <div className="grid grid-cols-3 gap-3">
        {s === 'f' ? <Res label="ความยาวโฟกัส f" unit="m" val={res} /> : <Field label="ความยาวโฟกัส f" unit="m" value={f} onChange={setF} />}
        {s === 'do' ? <Res label="ระยะวัตถุ d_o" unit="m" val={res} /> : <Field label="ระยะวัตถุ d_o" unit="m" value={dov} onChange={setDov} />}
        {s === 'di' ? <Res label="ระยะภาพ d_i" unit="m" val={res} /> : <Field label="ระยะภาพ d_i" unit="m" value={div} onChange={setDiv} />}
      </div>
    </Card>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────
const TABS = [
  { id: 'kinematics', label: 'จลนศาสตร์' },
  { id: 'forces', label: 'แรงและกฎนิวตัน' },
  { id: 'energy', label: 'พลังงาน/งาน' },
  { id: 'springs', label: 'สปริง/SHM' },
  { id: 'projectile', label: 'โพรเจกไทล์' },
  { id: 'waves', label: 'คลื่นและแสง' },
] as const
type Tab = typeof TABS[number]['id']

export default function PhysicsPage() {
  const [tab, setTab] = useState<Tab>('kinematics')

  return (
    <div className="page-container space-y-6">
      <PageHeader
        title="สูตรคำนวณฟิสิกส์"
        description="Physics Formulas — จลนศาสตร์, แรง, พลังงาน, สปริง/SHM, โพรเจกไทล์, คลื่น"
        icon={Rocket}
        color="cyan"
      />

      {/* Tab Bar */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-none px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tab === 'kinematics' && (
          <>
            <KinematicVAT />
            <KinematicSUAT />
            <KinematicV2U2AS />
            <AverageVelocity />
          </>
        )}
        {tab === 'forces' && (
          <>
            <NewtonsSecond />
            <FrictionCalc />
            <InclinedPlane />
            <CentripetalForce />
          </>
        )}
        {tab === 'energy' && (
          <>
            <KineticEnergy />
            <GravitationalPE />
            <WorkCalc />
            <PowerCalcPhys />
          </>
        )}
        {tab === 'springs' && (
          <>
            <HookesLaw />
            <SpringPE />
            <SHMPeriod />
            <PendulumPeriod />
          </>
        )}
        {tab === 'projectile' && (
          <>
            <div className="md:col-span-2"><ProjectileCalc /></div>
            <div className="md:col-span-2"><ProjectilePosition /></div>
          </>
        )}
        {tab === 'waves' && (
          <>
            <WaveRelation />
            <PhotonEnergy />
            <SnellsLaw />
            <ThinLens />
          </>
        )}
      </div>
    </div>
  )
}
