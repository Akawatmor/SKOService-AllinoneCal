import Link from 'next/link'
import { ArrowLeft, LucideIcon, Sparkles } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description: string
  icon: LucideIcon
  color: string
  badge?: string
}

const colorClasses: Record<string, { icon: string; glow: string }> = {
  violet: { icon: "text-violet-400", glow: "shadow-violet-500/20" },
  emerald: { icon: "text-emerald-400", glow: "shadow-emerald-500/20" },
  green: { icon: "text-green-400", glow: "shadow-green-500/20" },
  amber: { icon: "text-amber-400", glow: "shadow-amber-500/20" },
  pink: { icon: "text-pink-400", glow: "shadow-pink-500/20" },
  cyan: { icon: "text-cyan-400", glow: "shadow-cyan-500/20" },
  fuchsia: { icon: "text-fuchsia-400", glow: "shadow-fuchsia-500/20" },
  indigo: { icon: "text-indigo-400", glow: "shadow-indigo-500/20" },
}

export default function PageHeader({ title, description, icon: Icon, color, badge }: PageHeaderProps) {
  const colors = colorClasses[color] || colorClasses.violet
  
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-800/70 bg-slate-950/70 px-5 py-5 sm:px-7 sm:py-7 shadow-[0_24px_70px_rgba(2,6,23,0.45)] backdrop-blur-xl animate-slide-up">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_32%),linear-gradient(135deg,rgba(148,163,184,0.03),transparent_55%)]" />
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/5 blur-3xl" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <Link
            href="/"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-800/70 bg-slate-900/80 text-slate-400 transition-colors hover:text-white hover:border-slate-700 hover:bg-slate-800/80"
            aria-label="กลับหน้าหลัก"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-slate-800/70 bg-slate-900/85 shadow-2xl ${colors.glow} ${colors.icon}`}>
            <div className="absolute inset-1 rounded-[18px] bg-white/[0.03]" />
            <Icon className="relative h-8 w-8" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="badge badge-primary text-xs">
                <Sparkles className="h-3.5 w-3.5" />
                พร้อมใช้งานทันที
              </span>
              {badge && (
                <span className="badge text-xs">
                  {badge}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              {description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:min-w-[220px]">
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Focus</div>
            <div className="mt-1 text-sm font-semibold text-slate-100">Fast workflow</div>
          </div>
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Style</div>
            <div className="mt-1 text-sm font-semibold text-slate-100">Touch friendly</div>
          </div>
        </div>
      </div>
    </div>
  )
}
