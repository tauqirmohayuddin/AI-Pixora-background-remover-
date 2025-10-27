// netlify/functions/remove-bg.js
const fetch = require('node-fetch');
const FormData = require('form-data');

exports.handler = async function(event) {
  try {
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: "Missing REMOVE_BG_API_KEY environment variable" }) };
    }

    // parse incoming body (front-end sends JSON { imageBase64: "..." })
    const payload = event.body ? JSON.parse(event.body) : {};
    let imageBase64 = payload.imageBase64 || payload.image || "";

    if (!imageBase64) {
      return { statusCode: 400, body: JSON.stringify({ error: "No imageBase64 provided" }) };
    }

    // If data url prefix present, remove it
    imageBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const imageBuffer = Buffer.from(imageBase64, "base64");

    const form = new FormData();
    form.append("image_file", imageBuffer, { filename: "upload.png" });
    // remove.bg accepts size param; adjust as needed
    form.append("size", "auto");

    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        ...form.getHeaders()
      },
      body: form
    });

    if (!res.ok) {
      const errText = await res.text();
      return { statusCode: res.status || 500, body: JSON.stringify({ error: "remove.bg failed", details: errText }) };
    }

    const arrayBuffer = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);

    // return base64-encoded PNG in JSON so front-end can show it
    const outBase64 = buf.toString("base64");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: "data:image/png;base64," + outBase64 })
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
