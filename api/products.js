import { NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
  regions: ['iad1'] // Virginia, USA (Edge location óptima)
}

export async function GET(request) {
  try {
    // Cache control (prioriza el cache del vercel.json)
    const response = NextResponse.json({
      data: require('../data/products.json'),
      lastUpdated: new Date().toISOString()
    })

    response.headers.set('CDN-Cache-Control', 'public, max-age=3600, stale-while-revalidate=1800')
    return response

  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Error loading products' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
