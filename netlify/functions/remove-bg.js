// ✅ netlify/functions/remove-bg.js
const fetch = require("node-fetch");
const FormData = require("form-data");

exports.handler = async function (event) {
  try {
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing REMOVE_BG_API_KEY");
      return { statusCode: 500, body: "Missing REMOVE_BG_API_KEY" };
    }

    const form = new FormData();
    const body = JSON.parse(event.body || "{}");

    if (!body.imageBase64) {
      return { statusCode: 400, body: "No imageBase64 found in request" };
    }

    const imageBuffer = Buffer.from(body.imageBase64, "base64");
    form.append("image_file", imageBuffer, { filename: "image.png" });
    form.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": apiKey },
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("remove.bg error:", errorText);
      return { statusCode: response.status, body: errorText };
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return {
      statusCode: 200,
      headers: { "Content-Type": "image/png" },
      isBase64Encoded: true,
      body: base64,
    };
  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: String(err) };
  }
};
