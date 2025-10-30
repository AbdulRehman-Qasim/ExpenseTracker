import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import CategoryChart from '../components/CategoryChart'
import MonthlyChart from '../components/MonthlyChart'
import BudgetProgress from '../components/BudgetProgress'
import { Download } from 'lucide-react'

export default function Reports() {
  const [expenses, setExpenses] = useState([])
  const [budget, setBudget] = useState(0)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const [er, br] = await Promise.all([
      fetch('/api/expenses').then(r => r.json()),
      fetch('/api/budget').then(r => r.json()),
    ])
    setExpenses(er || [])
    setBudget(Number(br?.amount || 0))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <Layout onOpenCreate={() => {}} route="/reports">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <BudgetProgress items={expenses} budget={budget} />
          <MonthlyChart items={expenses} />
        </div>
        <div className="space-y-4">
          <CategoryChart items={expenses} />
          <div className="card p-5">
            <h3 className="font-bold mb-2">Export</h3>
            <p className="text-sm text-slate-600 mb-3">Download your expenses as CSV for spreadsheets.</p>
            <a className="btn inline-flex" href="/api/exports/csv">
              <Download className="w-4 h-4" /> Download CSV
            </a>
          </div>
        </div>
      </div>
      {loading && <div className="card p-6 text-center text-slate-500">Loading...</div>}
    </Layout>
  )
}
