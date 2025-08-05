
export const config = { runtime: 'edge' }

export default async (request) => {
  const { searchParams } = new URL(request.url)
  const store = searchParams.get('tienda')

  try {
    const data = await fetch(new URL('/data/whatsapp_numbers.json', request.url))
    const numbers = await data.json()
    
    // Buscar número por URL única o default
    const numberData = numbers.find(n => n.url_unica === store) || numbers[0]
    
    return new Response(JSON.stringify({
      phone: numberData.phone_number,
      owner: numberData.owner_name,
      active: numberData.is_active
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    })

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Error al cargar WhatsApp" 
    }), { status: 500 })
  }
}
