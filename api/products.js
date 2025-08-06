// Usaremos una estrategia alternativa para cargar datos
export const config = {
  runtime: 'edge'
};

export default async function (request) {
  try {
    const PRODUCTS_URL = new URL('/data/products.json', request.url);
    const SETTINGS_URL = new URL('/data/app_settings.json', request.url);
    
    const [productsRes, settingsRes] = await Promise.all([
      fetch(PRODUCTS_URL),
      fetch(SETTINGS_URL)
    ]);

    const products = await productsRes.json();
    const settings = await settingsRes.json();

    const processedProducts = products.map(p => ({
      ...p,
      local_price: (p.price * settings.rate).toFixed(2)
    }));

    return new Response(JSON.stringify(processedProducts), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Server error",
      details: error.message 
    }), {
      status: 500
    });
  }
}
