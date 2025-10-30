import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Pencil, Trash2, Utensils, ShoppingBag, Receipt, Bus, HeartPulse, Film, Wallet } from 'lucide-react'

function categoryIcon(cat) {
  const map = {
    Food: Utensils,
    Shopping: ShoppingBag,
    Bills: Receipt,
    Transport: Bus,
    Health: HeartPulse,
    Entertainment: Film,
    Other: Wallet,
  }
  return map[cat] || Wallet
}

export default function ExpenseList({ items, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {items.map((e, idx) => {
        const Icon = categoryIcon(e.category)
        return (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="card p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-100 text-primary-700">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">{e.title}</div>
                <div className="text-xs text-slate-500">{e.category} • {format(new Date(e.spent_at), 'PPP')}</div>
                {e.notes ? <div className="text-xs text-slate-500 mt-1">{e.notes}</div> : null}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="font-extrabold text-lg text-slate-900">${Number(e.amount).toFixed(2)}</div>
              <button onClick={() => onEdit(e)} className="p-2 rounded-lg hover:bg-slate-100 transition">
                <Pencil className="w-5 h-5 text-slate-600" />
              </button>
              <button onClick={() => onDelete(e)} className="p-2 rounded-lg hover:bg-slate-100 transition">
                <Trash2 className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </motion.div>
        )
      })}
      {items.length === 0 && (
        <div className="card p-6 text-center text-white/60">
          No expenses yet. Click "Add Expense" to create your first one.
        </div>
      )}
    </div>
  )
}
