import ChainCalculator from "./chain"
import { Calculator, Info, Banknote, ShoppingCart, TrendingUp } from "lucide-react"
import PageHeader from "../components/PageHeader"

export default function Page() {
  return (
    <div className="page-container space-y-6">
      <PageHeader
        title="Chain Calculator"
        description="Apply a sequence of operations step-by-step, seeing running totals at every stage"
        icon={Calculator}
        color="amber"
      />

      {/* What is it */}
      <div className="section-card border-amber-500/30 bg-amber-500/5 space-y-3">
        <div className="flex gap-2 items-center text-amber-300 font-semibold text-sm">
          <Info className="h-4 w-4" />
          How it works
        </div>
        <p className="text-sm text-slate-400">
          Start with any number, then chain operations (add, subtract, multiply, divide) one after another.
          Each step shows a running total so you can track exactly how the value changes.
          Label each step so it reads like a story.
        </p>
        <div className="grid sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-slate-900/60 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <Banknote className="h-3.5 w-3.5" /> Salary Breakdown
            </div>
            <p className="text-xs text-slate-500">Start with gross salary → subtract tax → subtract insurance → subtract loan → see net pay</p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <ShoppingCart className="h-3.5 w-3.5" /> Shopping Budget
            </div>
            <p className="text-xs text-slate-500">Start with budget → subtract groceries → subtract transport → subtract bills → see what's left</p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <TrendingUp className="h-3.5 w-3.5" /> Price with Markups
            </div>
            <p className="text-xs text-slate-500">Start with cost → multiply by 1.2 (20% markup) → add shipping → add VAT → see final price</p>
          </div>
        </div>
      </div>

      <ChainCalculator />
    </div>
  )
}
