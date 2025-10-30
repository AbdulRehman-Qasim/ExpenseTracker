import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Pencil, Trash2, Plus, Tag } from 'lucide-react'

export default function Categories() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [editing, setEditing] = useState(null)

  async function load() {
    const res = await fetch('/api/categories')
    setItems(await res.json())
  }
  useEffect(() => { load() }, [])

  async function add() {
    if (!name.trim()) return
    await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
    setName('')
    await load()
  }
  async function update(id) {
    await fetch(`/api/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: editing.name }) })
    setEditing(null)
    await load()
  }
  async function remove(id) {
    if (!confirm('Delete category?')) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <Layout onOpenCreate={() => {}} route="/categories">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-bold mb-3 flex items-center gap-2"><Tag className="w-5 h-5 text-primary-600"/> Manage Categories</h3>
          <div className="flex gap-2">
            <input className="input" placeholder="New category name" value={name} onChange={e => setName(e.target.value)} />
            <button className="btn" onClick={add}><Plus className="w-4 h-4"/>Add</button>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-bold mb-3">Existing</h3>
          <div className="space-y-2">
            {items.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50">
                {editing?.id === c.id ? (
                  <input className="input" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
                ) : (
                  <div className="font-semibold">{c.name}</div>
                )}
                <div className="flex items-center gap-2">
                  {editing?.id === c.id ? (
                    <button className="btn" onClick={() => update(c.id)}>Save</button>
                  ) : (
                    <button className="p-2 rounded-lg hover:bg-slate-100" onClick={() => setEditing(c)}><Pencil className="w-4 h-4 text-slate-600"/></button>
                  )}
                  <button className="p-2 rounded-lg hover:bg-slate-100" onClick={() => remove(c.id)}><Trash2 className="w-4 h-4 text-slate-600"/></button>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="text-sm text-slate-500">No categories yet.</div>}
          </div>
        </div>
      </div>
    </Layout>
  )
}
