import { useEffect, useState } from 'react'
import Layout from '../components/Layout'

export default function Settings() {
  const [budget, setBudget] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const r = await fetch('/api/budget')
      const data = await r.json()
      setBudget(String(data?.amount ?? ''))
    }
    load()
  }, [])

  async function save() {
    setSaving(true)
    await fetch('/api/budget', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: Number(budget||0) }) })
    setSaving(false)
    alert('Saved!')
  }

  return (
    <Layout onOpenCreate={() => {}} route="/settings">
      <div className="max-w-xl card p-5">
        <h3 className="font-bold mb-3">Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="label">Monthly Budget Amount</label>
            <input className="input" type="number" min="0" step="0.01" value={budget} onChange={e => setBudget(e.target.value)} />
          </div>
          <button className="btn" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </Layout>
  )
}
