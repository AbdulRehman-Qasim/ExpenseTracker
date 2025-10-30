import getSupabase from '../../lib/supabase'

export default async function handler(req, res) {
  const supabase = getSupabase()

  const { data, error } = await supabase.from('expenses').select('*')
  if (error) return res.status(500).json({ error: error.message })

  const header = ['id','title','amount','category','spent_at','notes']
  const rows = data.map(e => [e.id, e.title, e.amount, e.category, e.spent_at, (e.notes||'').replace(/\n/g,' ')])
  const csv = [header, ...rows].map(r => r.map(v => typeof v === 'string' && v.includes(',') ? `"${v.replace(/"/g,'""')}"` : v).join(',')).join('\n')

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"')
  return res.status(200).send(csv)
}
