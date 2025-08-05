export const config = {
  runtime: 'edge'
}

export default async function handler(request) {
  try {
    // Cargar datos desde el repositorio
    const dataUrl = new URL('/data/products.json', request.url);
    const response = await fetch(dataUrl);
    const products = await response.json();

    return new Response(JSON.stringify({
      data: products,
      lastUpdated: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
        'CDN-Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Error loading products',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
