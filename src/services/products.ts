import { supabase } from '@/lib/supabaseClient'
import { products as mock } from '@/data/products'

export async function fetchProducts() {
  if (!supabase) return mock
  const { data, error } = await supabase.from('products').select('id,title,price,image').limit(12)
  if (error || !data) return mock
  return data
}
