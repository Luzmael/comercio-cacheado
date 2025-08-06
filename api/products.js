import { join } from 'path';
import { readFileSync } from 'fs';

// Cargar datos en tiempo de compilación
const productsData = JSON.parse(readFileSync(join(process.cwd(), 'data/products.json'));
const settingsData = JSON.parse(readFileSync(join(process.cwd(), 'data/app_settings.json'));

export const config = {
  runtime: 'experimental-edge'
};

export default function (request) {
  try {
    const processedProducts = productsData.map(p => ({
      ...p,
      local_price: (p.price * settingsData.rate).toFixed(2)
    }));

    return new Response(JSON.stringify(processedProducts), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500
    });
  }
}
