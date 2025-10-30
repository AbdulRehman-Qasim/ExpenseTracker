import { useEffect, useState, useMemo } from 'react'
import Layout from '../components/Layout'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import StatsCards from '../components/StatsCards'
import CategoryChart from '../components/CategoryChart'
import { motion } from 'framer-motion'

export default function Home() {
  const [expenses, setExpenses] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  async function fetchExpenses() {
    setLoading(true)
    const res = await fetch('/api/expenses')
    const data = await res.json()
    setExpenses(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchExpenses() }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = expenses
    if (from) list = list.filter(e => new Date(e.spent_at) >= new Date(from))
    if (to) list = list.filter(e => new Date(e.spent_at) <= new Date(to))
    if (!q) return list
    return list.filter(e => `${e.title} ${e.category} ${e.notes}`.toLowerCase().includes(q))
  }, [expenses, query, from, to])

  async function createExpense(payload) {
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    await fetchExpenses()
  }

  async function updateExpense(id, payload) {
    await fetch(`/api/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    await fetchExpenses()
  }

  async function deleteExpense(item) {
    const sure = confirm(`Delete "${item.title}"?`)
    if (!sure) return
    await fetch(`/api/expenses/${item.id}`, { method: 'DELETE' })
    await fetchExpenses()
  }

  return (
    <Layout onOpenCreate={() => { setEditing(null); setOpen(true) }} route="/">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <StatsCards items={expenses} />
          <div className="card p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <input className="input" placeholder="Search expenses..." value={query} onChange={e => setQuery(e.target.value)} />
              <div className="flex items-center gap-2 w-full md:w-auto">
                <input type="date" className="input" value={from} onChange={e => setFrom(e.target.value)} />
                <span className="text-slate-400">to</span>
                <input type="date" className="input" value={to} onChange={e => setTo(e.target.value)} />
              </div>
              <button className="btn" onClick={() => { setEditing(null); setOpen(true) }}>Add Expense</button>
            </div>
          </div>

          {loading ? (
            <div className="card p-6 text-center animate-pulse text-slate-500">Loading...</div>
          ) : (
            <ExpenseList
              items={filtered}
              onEdit={(e) => { setEditing(e); setOpen(true) }}
              onDelete={deleteExpense}
            />
          )}
        </div>
        <div className="space-y-4">
          <CategoryChart items={expenses} />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4"
          >
            <h3 className="font-bold mb-2">Tips</h3>
            <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
              <li>Use the search to quickly find expenses.</li>
              <li>Click the pencil to edit an entry.</li>
              <li>Use the chart to analyze spending patterns.</li>
            </ul>
          </motion.div>
        </div>
      </div>

      <ExpenseForm
        open={open}
        onClose={() => setOpen(false)}
        initial={editing}
        onSubmit={async (payload) => {
          if (editing) await updateExpense(editing.id, payload)
          else await createExpense(payload)
        }}
      />
    </Layout>
  )
}
