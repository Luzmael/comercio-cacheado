export const config = {
  runtime: 'edge'
};

export default async function (request) {
  try {
    const WHATSAPP_URL = new URL('/data/whatsapp_numbers.json', request.url);
    const numbers = await (await fetch(WHATSAPP_URL)).json();
    
    const { searchParams } = new URL(request.url);
    const store = searchParams.get('store');
    const numberData = numbers.find(n => n.url_unica === store) || numbers[0];

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
      error: "Error al cargar WhatsApp" 
    }), {
      status: 500
    });
  }
}
