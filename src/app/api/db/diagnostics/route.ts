import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export const revalidate = 0

export async function GET() {
  const cwd = process.cwd()
  const rootDirExpected = 'palita-imports'
  const rootDirMatched = cwd.endsWith(rootDirExpected)
  const configured = Boolean(supabase)
  if (!configured) {
    return NextResponse.json({ supabaseConfigured: false, canQueryProducts: false, canQueryOrders: false, reason: 'missing_env', cwd, rootDirExpected, rootDirMatched }, { status: 200 })
  }
  try {
    const client = supabase!
    const { data: pData, error: pError } = await client.from('products').select('id').limit(1)
    const { data: oData, error: oError } = await client.from('orders').select('id').limit(1)
    const canQueryProducts = !pError
    const canQueryOrders = !oError
    if (!canQueryProducts || !canQueryOrders) {
      return NextResponse.json({ supabaseConfigured: true, canQueryProducts, canQueryOrders, error: pError?.message ?? oError?.message, cwd, rootDirExpected, rootDirMatched }, { status: 200 })
    }
    return NextResponse.json({ supabaseConfigured: true, canQueryProducts, canQueryOrders, productsSampleCount: pData?.length ?? 0, ordersSampleCount: oData?.length ?? 0, cwd, rootDirExpected, rootDirMatched }, { status: 200 })
  } catch (err) {
    const message = typeof err === 'object' && err && 'message' in err ? String((err as { message: unknown }).message) : String(err)
    return NextResponse.json({ supabaseConfigured: true, canQueryProducts: false, canQueryOrders: false, error: message, cwd, rootDirExpected, rootDirMatched }, { status: 200 })
  }
}
