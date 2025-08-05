import { NextResponse } from 'next/server'

const CACHE_TTL = process.env.CACHE_TTL || 60

export function middleware(request) {
  // 1. Configurar headers de caché dinámicos
  const response = NextResponse.next()
  
  // 2. Cachear respuestas JSON
  if (request.nextUrl.pathname.startsWith('/data')) {
    response.headers.set('Cache-Control', `public, max-age=${CACHE_TTL}`)
    response.headers.set('CDN-Cache-Control', `public, max-age=${CACHE_TTL}`)
  }

  // 3. Cachear tiendas HTML
  if (request.nextUrl.pathname.startsWith('/tiendas')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=60, stale-while-revalidate=300'
    )
  }

  return response
}
