// netlify/functions/remove-bg.js
const fetch = require("node-fetch");       // add to package.json
const FormData = require("form-data");     // add to package.json

exports.handler = async function(event) {
  try {
    // parse incoming request
    const payload = event.body ? JSON.parse(event.body) : {};
    let imageBase64 = payload.imageBase64 || payload.image || "";

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return { statusCode: 400, body: "No imageBase64 provided in request body." };
    }

    // remove data: prefix if present
    imageBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: "Missing REMOVE_BG_API_KEY environment variable." };
    }

    // Prepare multipart form-data for remove.bg
    const form = new FormData();
    form.append("image_file_b64", imageBase64);
    form.append("size", "auto");

    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        ...form.getHeaders()
      },
      body: form
    });

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!res.ok) {
      // return error body (text) along with status
      const msg = buffer.toString("utf8");
      return { statusCode: res.status || 500, body: msg || "remove.bg returned an error" };
    }

    // convert to base64 data URL and return JSON with "body" field
    const b64 = "data:image/png;base64," + buffer.toString("base64");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: b64 })
    };
  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: String(err) };
  }
};
