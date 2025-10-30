import getSupabase from '../../../lib/supabase'

export default async function handler(req, res) {
  const supabase = getSupabase()

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('categories').select('*').order('name')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { name } = req.body || {}
    if (!name) return res.status(400).json({ error: 'name required' })
    const { data, error } = await supabase.from('categories').insert([{ name }]).select('*').single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  res.setHeader('Allow', 'GET,POST')
  return res.status(405).end('Method Not Allowed')
}
