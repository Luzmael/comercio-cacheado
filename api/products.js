export const config = { runtime: 'edge' }

export default async (request) => {
  try {
    // 1. Cargar configuración
    const settingsUrl = new URL('/data/app_settings.json', request.url)
    const productsUrl = new URL('/data/products.json', request.url)
    
    const [settingsRes, productsRes] = await Promise.all([
      fetch(settingsUrl),
      fetch(productsUrl)
    ])

    // 2. Procesar datos
    const settings = await settingsRes.json()
    let products = await productsRes.json()

    // 3. Aplicar tasa de cambio
    products = products.map(p => ({
      ...p,
      local_price: (p.price * settings.rate).toFixed(2),
      original_local_price: (p.original_price * settings.rate).toFixed(2)
    }))

    // 4. Responder con caché
    return new Response(JSON.stringify({
      data: products,
      settings: {
        shipping_cost: settings.shipping_cost,
        min_order: settings.min_order_quantity
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
      }
    })

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Error al cargar productos",
      details: error.message 
    }), { status: 500 })
  }
}
