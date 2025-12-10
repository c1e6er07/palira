import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

async function run() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    console.error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente.')
    process.exit(1)
  }
  const client = createClient(url, serviceKey)

  try { await client.storage.createBucket('products', { public: true }) } catch {}

  const dir = path.join(process.cwd(), 'public', 'kids')
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.svg'))
  for (const file of files) {
    const filePath = path.join(dir, file)
    const content = fs.readFileSync(filePath)
    const storagePath = `kids/${file}`
    const { error } = await client.storage.from('products').upload(storagePath, content, { upsert: true, contentType: 'image/svg+xml' })
    if (error) console.error(`Falha ao enviar ${file}:`, error.message)
    else {
      const { data } = client.storage.from('products').getPublicUrl(storagePath)
      console.log(`OK ${file} -> ${data.publicUrl}`)
    }
  }
}

run()
