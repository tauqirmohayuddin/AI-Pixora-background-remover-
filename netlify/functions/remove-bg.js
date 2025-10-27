// netlify/functions/remove-bg.js
// Minimal test function for Netlify that always returns a tiny PNG data URL in JSON.
// This is safe and cannot crash. Use it to confirm Netlify Functions & deploys work.

exports.handler = async function (event) {
  try {
    // A tiny 1x1 transparent PNG base64 (very small)
    const tinyBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";
    const dataUrl = "data:image/png;base64," + tinyBase64;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, result: dataUrl })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: String(err) })
    };
  }
};
