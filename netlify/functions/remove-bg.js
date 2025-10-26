// netlify/functions/remove-bg.js
const fetch = require("node-fetch");
const FormData = require("form-data");

exports.handler = async function(event) {
  try {
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing REMOVE_BG_API_KEY");
      return { statusCode: 500, body: "Missing REMOVE_BG_API_KEY" };
    }

    const body = JSON.parse(event.body || "{}");
    if (!body.imageBase64) {
      return { statusCode: 400, body: "No imageBase64 found in request body" };
    }

    const form = new FormData();
    const imageBuffer = Buffer.from(body.imageBase64, "base64");
    form.append("image_file", imageBuffer, { filename: "input.jpg" });

    // Example remove.bg API endpoint (adjust if using a different endpoint)
    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey
      },
      body: form
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("remove.bg error:", res.status, t);
      return { statusCode: 502, body: `remove.bg error: ${res.status} ${t}` };
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: { "Content-Type": "image/png" },
      body: base64
    };

  } catch (err) {
    console.error("Function error:", String(err));
    return { statusCode: 500, body: String(err) };
  }
};
