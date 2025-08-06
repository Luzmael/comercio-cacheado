export const config = {
  runtime: 'edge'
};

export default async function (request) {
  try {
    const url = new URL(request.url);
    const store = url.searchParams.get('store');
    
   
    const response = await fetch(new URL('/data/whatsapp_numbers.json', request.url));
    const numbers = await response.json();

    
    const numberData = numbers.find(n => n.url_unica === store) || numbers.find(n => n.is_default);

    if (!numberData) {
      throw new Error("Número no encontrado");
    }

    return new Response(JSON.stringify({
      number: numberData.phone_number,
      owner: numberData.owner_name,
      active: numberData.is_active
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Error al cargar WhatsApp",
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
