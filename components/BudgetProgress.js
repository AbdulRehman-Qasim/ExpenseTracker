import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PiggyBank } from 'lucide-react'

export default function BudgetProgress({ items, budget = 0 }) {
  const spent = useMemo(() => items.reduce((s, i) => s + Number(i.amount||0), 0), [items])
  const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Monthly Budget</div>
            <div className="text-lg font-extrabold text-slate-900">${budget.toFixed(2)}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Spent</div>
          <div className="text-lg font-extrabold text-slate-900">${spent.toFixed(2)} ({pct}%)</div>
        </div>
      </div>
      <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6 }}
          className={`h-full rounded-full ${pct>90 ? 'bg-red-400' : pct>75 ? 'bg-amber-400' : 'bg-primary-500'}`}
        />
      </div>
    </div>
  )
}
