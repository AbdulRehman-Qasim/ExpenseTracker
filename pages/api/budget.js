import getSupabase from '../../lib/supabase'

export default async function handler(req, res) {
  const supabase = getSupabase()

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('budgets').select('*').limit(1).maybeSingle()
    if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message })
    return res.status(200).json(data || { amount: 0 })
  }

  if (req.method === 'POST') {
    const { amount } = req.body || {}
    if (typeof amount !== 'number') return res.status(400).json({ error: 'amount must be number' })
    const { data, error } = await supabase.from('budgets').upsert({ id: 1, amount, period: 'monthly' }, { onConflict: 'id' }).select('*').single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  res.setHeader('Allow', 'GET,POST')
  return res.status(405).end('Method Not Allowed')
}
