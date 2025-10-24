


// netlify/functions/remove-bg.js
export async function handler(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const imageBase64 = body.image;
    if (!imageBase64) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing image in request body.' }) };
    }

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfigured: REMOVE_BG_API_KEY missing.' }) };
    }

    const resp = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image_file_b64: imageBase64, size: 'auto' })
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return { statusCode: resp.status, body: txt };
    }

    const arrayBuffer = await resp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'image/png' },
      isBase64Encoded: true,
      body: base64
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}

4. Scroll do
