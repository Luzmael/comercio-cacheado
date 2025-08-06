
import { join } from 'path';
import { readFileSync } from 'fs';

const numbersData = JSON.parse(readFileSync(join(process.cwd(), 'data/whatsapp_numbers.json')));

export const config = {
  runtime: 'experimental-edge'
};

export default function (request) {
  try {
    const url = new URL(request.url);
    const store = url.searchParams.get('store');
    const numberData = numbersData.find(n => n.url_unica === store) || numbersData[0];

    return new Response(JSON.stringify({
      number: numberData.phone_number,
      owner: numberData.owner_name
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500
    });
  }
}
