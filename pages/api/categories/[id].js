import getSupabase from '../../../lib/supabase'

export default async function handler(req, res) {
  const supabase = getSupabase()
  const { id } = req.query

  if (req.method === 'PUT') {
    const { name } = req.body || {}
    const { data, error } = await supabase.from('categories').update({ name }).eq('id', id).select('*').single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'PUT,DELETE')
  return res.status(405).end('Method Not Allowed')
}
