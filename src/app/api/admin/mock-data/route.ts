import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 0

// Identificador para dados fictícios (facilita exclusão)
const MOCK_PREFIX = '[MOCK]'

// Dados fictícios para teste
const mockCampaigns = [
  { name: `${MOCK_PREFIX} Black Friday 2025`, slug: 'black-friday-2025', status: 'active' },
  { name: `${MOCK_PREFIX} Natal Mágico`, slug: 'natal-magico', status: 'active' },
  { name: `${MOCK_PREFIX} Volta às Aulas`, slug: 'volta-aulas', status: 'scheduled' },
  { name: `${MOCK_PREFIX} Dia das Crianças`, slug: 'dia-criancas', status: 'ended' },
]

const mockCoupons = [
  { code: 'MOCK10', description: `${MOCK_PREFIX} 10% de desconto`, discount_percent: 10, active: true },
  { code: 'MOCK20', description: `${MOCK_PREFIX} 20% de desconto`, discount_percent: 20, active: true },
  { code: 'MOCK50OFF', description: `${MOCK_PREFIX} R$50 de desconto`, discount_value: 50, active: true },
  { code: 'MOCKFRETE', description: `${MOCK_PREFIX} Frete grátis`, discount_percent: 0, active: false },
]

const mockOrders = [
  { customer_name: `${MOCK_PREFIX} Maria Silva`, customer_email: 'maria@mock.test', total: 259.80, status: 'completed', items: JSON.stringify([{ title: 'Kit Fantasia Brilhante', qty: 2, price: 129.90 }]) },
  { customer_name: `${MOCK_PREFIX} João Santos`, customer_email: 'joao@mock.test', total: 89.90, status: 'pending', items: JSON.stringify([{ title: 'Carrinho Turbo Arco-íris', qty: 1, price: 89.90 }]) },
  { customer_name: `${MOCK_PREFIX} Ana Costa`, customer_email: 'ana@mock.test', total: 329.60, status: 'completed', items: JSON.stringify([{ title: 'Luminária Estrelada', qty: 1, price: 149.90 }, { title: 'Blocos ABC Alegria', qty: 2, price: 79.90 }, { title: 'Kit Arte Mágica', qty: 1, price: 59.90 }]) },
  { customer_name: `${MOCK_PREFIX} Pedro Oliveira`, customer_email: 'pedro@mock.test', total: 199.80, status: 'shipped', items: JSON.stringify([{ title: 'Pelúcia Dino Fofinho', qty: 2, price: 99.90 }]) },
  { customer_name: `${MOCK_PREFIX} Carla Mendes`, customer_email: 'carla@mock.test', total: 119.90, status: 'completed', items: JSON.stringify([{ title: 'Mochila Super Herói', qty: 1, price: 119.90 }]) },
]

const mockSubscriptions = [
  { email: 'mock1@teste.com', name: `${MOCK_PREFIX} Usuário 1` },
  { email: 'mock2@teste.com', name: `${MOCK_PREFIX} Usuário 2` },
  { email: 'mock3@teste.com', name: `${MOCK_PREFIX} Usuário 3` },
  { email: 'mock4@teste.com', name: `${MOCK_PREFIX} Usuário 4` },
  { email: 'mock5@teste.com', name: `${MOCK_PREFIX} Usuário 5` },
]

const mockEvents = [
  { type: 'page_view', payload: JSON.stringify({ page: 'home', mock: true }) },
  { type: 'product_view', payload: JSON.stringify({ product_id: 'k1', mock: true }) },
  { type: 'add_to_cart', payload: JSON.stringify({ product_id: 'k2', mock: true }) },
  { type: 'checkout_start', payload: JSON.stringify({ cart_total: 259.80, mock: true }) },
  { type: 'purchase', payload: JSON.stringify({ order_total: 259.80, mock: true }) },
  { type: 'page_view', payload: JSON.stringify({ page: 'produtos', mock: true }) },
  { type: 'product_view', payload: JSON.stringify({ product_id: 'k3', mock: true }) },
  { type: 'newsletter_signup', payload: JSON.stringify({ source: 'footer', mock: true }) },
]

function getClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const serverClient = url && serviceKey ? createClient(url, serviceKey) : undefined
  return serverClient ?? supabase
}

// POST - Criar dados fictícios
export async function POST() {
  try {
    const client = getClient()
    if (!client) {
      return NextResponse.json({ success: false, error: 'Supabase não configurado' }, { status: 500 })
    }

    const results = {
      campaigns: 0,
      coupons: 0,
      orders: 0,
      subscriptions: 0,
      events: 0,
      errors: [] as string[]
    }

    // Inserir campanhas
    try {
      const { data, error } = await client.from('campaigns').insert(mockCampaigns).select()
      if (error) throw error
      results.campaigns = data?.length ?? 0
    } catch (e) {
      results.errors.push(`Campanhas: ${e instanceof Error ? e.message : JSON.stringify(e)}`)
    }

    // Inserir cupons
    try {
      const { data, error } = await client.from('coupons').insert(mockCoupons).select()
      if (error) throw error
      results.coupons = data?.length ?? 0
    } catch (e) {
      results.errors.push(`Cupons: ${e instanceof Error ? e.message : JSON.stringify(e)}`)
    }

    // Inserir pedidos
    try {
      const { data, error } = await client.from('orders').insert(mockOrders).select()
      if (error) throw error
      results.orders = data?.length ?? 0
    } catch (e) {
      results.errors.push(`Pedidos: ${e instanceof Error ? e.message : JSON.stringify(e)}`)
    }

    // Inserir inscrições newsletter
    try {
      const { data, error } = await client.from('newsletter_subscriptions').insert(mockSubscriptions).select()
      if (error) throw error
      results.subscriptions = data?.length ?? 0
    } catch (e) {
      results.errors.push(`Newsletter: ${e instanceof Error ? e.message : JSON.stringify(e)}`)
    }

    // Inserir eventos
    try {
      const { data, error } = await client.from('marketing_events').insert(mockEvents).select()
      if (error) throw error
      results.events = data?.length ?? 0
    } catch (e) {
      results.errors.push(`Eventos: ${e instanceof Error ? e.message : JSON.stringify(e)}`)
    }

    return NextResponse.json({ 
      success: results.errors.length === 0, 
      message: results.errors.length === 0 ? 'Dados fictícios criados com sucesso!' : 'Alguns dados não foram criados',
      created: results,
      errors: results.errors.length > 0 ? results.errors : undefined
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

// DELETE - Excluir dados fictícios
export async function DELETE() {
  try {
    const client = getClient()
    if (!client) {
      return NextResponse.json({ success: false, error: 'Supabase não configurado' }, { status: 500 })
    }

    const results = {
      campaigns: 0,
      coupons: 0,
      orders: 0,
      subscriptions: 0,
      events: 0,
      errors: [] as string[]
    }

    // Excluir campanhas mock
    try {
      const { data, error } = await client.from('campaigns').delete().like('name', `${MOCK_PREFIX}%`).select()
      if (error) throw error
      results.campaigns = data?.length ?? 0
    } catch (e) {
      results.errors.push(`Campanhas: ${e instanceof Error ? e.message : 'erro'}`)
    }

    // Excluir cupons mock
    try {
      const { data, error } = await client.from('coupons').delete().like('code', 'MOCK%').select()
      if (error) throw error
      results.coupons = data?.length ?? 0
    } catch (e) {
      results.errors.push(`Cupons: ${e instanceof Error ? e.message : 'erro'}`)
    }

    // Excluir pedidos mock
    try {
      const { data, error } = await client.from('orders').delete().like('customer_name', `${MOCK_PREFIX}%`).select()
      if (error) throw error
      results.orders = data?.length ?? 0
    } catch (e) {
      results.errors.push(`Pedidos: ${e instanceof Error ? e.message : 'erro'}`)
    }

    // Excluir inscrições mock
    try {
      const { data, error } = await client.from('newsletter_subscriptions').delete().like('email', 'mock%@teste.com').select()
      if (error) throw error
      results.subscriptions = data?.length ?? 0
    } catch (e) {
      results.errors.push(`Newsletter: ${e instanceof Error ? e.message : 'erro'}`)
    }

    // Excluir eventos mock
    try {
      const { data, error } = await client.from('marketing_events').delete().like('payload', '%"mock":true%').select()
      if (error) throw error
      results.events = data?.length ?? 0
    } catch (e) {
      results.errors.push(`Eventos: ${e instanceof Error ? e.message : 'erro'}`)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Dados fictícios excluídos com sucesso!',
      deleted: results
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

// GET - Verificar quantidade de dados fictícios
export async function GET() {
  try {
    const client = getClient()
    if (!client) {
      return NextResponse.json({ hasMockData: false, counts: {} }, { status: 200 })
    }

    const counts = {
      campaigns: 0,
      coupons: 0,
      orders: 0,
      subscriptions: 0,
      events: 0
    }

    try {
      const { count } = await client.from('campaigns').select('id', { count: 'exact', head: true }).like('name', `${MOCK_PREFIX}%`)
      counts.campaigns = count ?? 0
    } catch {}

    try {
      const { count } = await client.from('coupons').select('code', { count: 'exact', head: true }).like('code', 'MOCK%')
      counts.coupons = count ?? 0
    } catch {}

    try {
      const { count } = await client.from('orders').select('id', { count: 'exact', head: true }).like('customer_name', `${MOCK_PREFIX}%`)
      counts.orders = count ?? 0
    } catch {}

    try {
      const { count } = await client.from('newsletter_subscriptions').select('email', { count: 'exact', head: true }).like('email', 'mock%@teste.com')
      counts.subscriptions = count ?? 0
    } catch {}

    try {
      const { count } = await client.from('marketing_events').select('id', { count: 'exact', head: true }).like('payload', '%"mock":true%')
      counts.events = count ?? 0
    } catch {}

    const total = Object.values(counts).reduce((a, b) => a + b, 0)

    return NextResponse.json({ 
      hasMockData: total > 0,
      total,
      counts
    })
  } catch (err) {
    return NextResponse.json({ hasMockData: false, error: String(err) }, { status: 500 })
  }
}
