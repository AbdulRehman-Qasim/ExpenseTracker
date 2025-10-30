import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const fallbackCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other']

export default function ExpenseForm({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    spent_at: new Date().toISOString().slice(0,10),
    notes: ''
  })
  const [categories, setCategories] = useState(fallbackCategories)

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        if (Array.isArray(data) && data.length) {
          setCategories(data.map(c => c.name))
        }
      } catch {}
    }
    if (open) loadCategories()

    if (initial) {
      setForm({
        title: initial.title ?? '',
        amount: String(initial.amount ?? ''),
        category: initial.category ?? 'Food',
        spent_at: initial.spent_at ? String(initial.spent_at).slice(0,10) : new Date().toISOString().slice(0,10),
        notes: initial.notes ?? ''
      })
    } else {
      setForm({
        title: '',
        amount: '',
        category: 'Food',
        spent_at: new Date().toISOString().slice(0,10),
        notes: ''
      })
    }
  }, [initial, open])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title || !form.amount) return
    const payload = {
      ...form,
      amount: Number(form.amount),
      spent_at: new Date(form.spent_at).toISOString()
    }
    await onSubmit(payload)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="relative z-10 w-full max-w-lg card p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">{initial ? 'Edit Expense' : 'Add Expense'}</h3>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input className="input" name="title" value={form.title} onChange={handleChange} placeholder="Coffee at Starbucks" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Amount</label>
                  <input className="input" type="number" min="0" step="0.01" name="amount" value={form.amount} onChange={handleChange} placeholder="12.50" />
                </div>
                <div>
                  <label className="label">Date</label>
                  <input className="input" type="date" name="spent_at" value={form.spent_at} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Category</label>
                  <select className="input" name="category" value={form.category} onChange={handleChange}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Notes</label>
                  <input className="input" name="notes" value={form.notes} onChange={handleChange} placeholder="Optional" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5">Cancel</button>
                <button type="submit" className="btn">{initial ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
