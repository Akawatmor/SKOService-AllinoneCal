import Link from 'next/link'
import { ArrowLeft, LucideIcon } from 'lucide-react'

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
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 animate-slide-up">
      <Link
        href="/"
        className="p-2 -ml-2 w-fit rounded-xl hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white"
        aria-label="กลับหน้าหลัก"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>
      
      <div className="flex items-center gap-4 flex-1">
        <div className={`p-3 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg ${colors.glow} ${colors.icon}`}>
          <Icon className="w-7 h-7" aria-hidden="true" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
              {title}
            </h1>
            {badge && (
              <span className="badge badge-primary text-xs">
                {badge}
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
