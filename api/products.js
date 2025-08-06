export const config = {
  runtime: 'edge'
};

export default async function (request) {
  try {
   
    const [settingsRes, productsRes] = await Promise.all([
      fetch(new URL('/data/app_settings.json', request.url)),
      fetch(new URL('/data/products.json', request.url))
    ]);

    const settings = await settingsRes.json();
    const products = await productsRes.json();

    
    const processedProducts = products.map(product => ({
      ...product,
      local_price: (product.price * settings.rate).toFixed(2),
      original_local_price: (product.original_price * settings.rate).toFixed(2)
    }));

    return new Response(JSON.stringify({
      products: processedProducts,
      shipping_cost: settings.shipping_cost,
      min_order: settings.min_order_quantity
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Error al cargar productos",
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
