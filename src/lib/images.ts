import { supabase } from '@/lib/supabaseClient'

export function getProductImageUrl(image: string) {
  if (!image) return '/kids/k1.svg'
  if (image.startsWith('http') || image.startsWith('/')) return image
  
  // Se for uma imagem da pasta kids, prefira servir localmente da pasta public
  // para evitar dependência do Supabase Storage se o upload não tiver sido feito
  if (image.startsWith('kids/')) {
    return `/${image}`
  }

  if (supabase) {
    const { data } = supabase.storage.from('products').getPublicUrl(image)
    if (data?.publicUrl) return data.publicUrl
  }
  return image
}
