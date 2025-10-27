// netlify/functions/remove-bg.js
// Very small test function that always returns a small PNG data-url wrapped in JSON.
// This verifies Netlify functions are running correctly.

exports.handler = async function(event) {
  try {
    const tinyBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";
    const dataUrl = "data:image/png;base64," + tinyBase64;
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: dataUrl })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
