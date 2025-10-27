// netlify/functions/remove-bg.js
const fetch = require("node-fetch");      // node-fetch v2
const FormData = require("form-data");

exports.handler = async function (event) {
  try {
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      console.error("Missing REMOVE_BG_API_KEY");
      return { statusCode: 500, body: "Missing REMOVE_BG_API_KEY" };
    }

    const body = JSON.parse(event.body || "{}");
    if (!body.imageBase64) {
      return { statusCode: 400, body: "No imageBase64 found" };
    }

    const imageBuffer = Buffer.from(body.imageBase64, "base64");

    const form = new FormData();
    form.append("image_file", imageBuffer, {
      filename: "upload.jpg",
      contentType: "image/jpeg",
    });
    // adapt remove.bg API fields to what you need
    form.append("size", "auto");

    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        // DO NOT set Content-Type here — FormData sets it
      },
      body: form,
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("remove.bg error:", res.status, txt);
      return { statusCode: res.status, body: txt };
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isBase64Encoded: true,
        imageBase64: base64,
      }),
    };
  } catch (err) {
    console.error("Function error:", err && err.stack ? err.stack : err);
    return { statusCode: 500, body: String(err) };
  }
};
