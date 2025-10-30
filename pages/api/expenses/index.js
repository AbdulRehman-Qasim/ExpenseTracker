import getSupabase from '../../../lib/supabase'

export default async function handler(req, res) {
  const supabase = getSupabase()

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('expenses').select('*').order('spent_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { title, amount, category, spent_at, notes } = req.body || {}
    if (!title || typeof amount !== 'number') {
      return res.status(400).json({ error: 'title and amount are required' })
    }
    const { data, error } = await supabase.from('expenses').insert([{
      title, amount, category, spent_at, notes
    }]).select('*').single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  res.setHeader('Allow', 'GET,POST')
  return res.status(405).end('Method Not Allowed')
}
