export const config = {
  runtime: 'edge'
}

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const store = searchParams.get('store') || 'default';

  try {
    const numbersUrl = new URL('/data/whatsapp-numbers.json', request.url);
    const response = await fetch(numbersUrl);
    const numbers = await response.json();

    return new Response(JSON.stringify({
      number: numbers[store] || numbers.default,
      status: 'active'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Error loading WhatsApp numbers' 
    }), {
      status: 500
    });
  }
}
