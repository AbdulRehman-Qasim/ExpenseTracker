// import { createClient } from '@supabase/supabase-js'

// let client = null

// export default function getSupabase() {
//   if (!client) {
//     const url = process.env.SUPABASE_URL
//     const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
//     if (!url || !serviceRoleKey) {
//       throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
//     }
//     client = createClient(url, serviceRoleKey)
//   }
//   return client
// }


import { createClient } from '@supabase/supabase-js'

let client = null

export default function getSupabase() {
  if (!client) {
    const url = process.env.SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
    if (!url || !serviceRoleKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    }
    client = createClient(url, serviceRoleKey)
  }
  return client
}
