import { useMemo } from 'react'
import { Wallet, TrendingDown, CalendarDays } from 'lucide-react'

export default function StatsCards({ items }) {
  const { total, avg, last30 } = useMemo(() => {
    const total = items.reduce((s, i) => s + Number(i.amount || 0), 0)
    const avg = items.length ? total / items.length : 0
    const last30 = items
      .filter(i => Date.now() - new Date(i.spent_at).getTime() <= 30*24*60*60*1000)
      .reduce((s, i) => s + Number(i.amount || 0), 0)
    return { total, avg, last30 }
  }, [items])

  const stat = (icon, label, value, gradient) => (
    <div className={`card p-5 ${gradient}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-slate-50">
          {icon}
        </div>
        <div>
          <div className="text-xs text-slate-500">{label}</div>
          <div className="text-xl font-extrabold text-slate-900">${value.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stat(<Wallet className="w-5 h-5 text-primary-600" />, 'Total Spent', total, 'bg-gradient-to-br from-white to-surface-300')}
      {stat(<TrendingDown className="w-5 h-5 text-accent-600" />, 'Average per Expense', avg, 'bg-gradient-to-br from-white to-surface-300')}
      {stat(<CalendarDays className="w-5 h-5 text-primary-600" />, 'Last 30 days', last30, 'bg-gradient-to-br from-white to-surface-300')}
    </div>
  )
}
