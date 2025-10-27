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
const fetch = require('node-fetch');    // v2.x (use ^2.6.7)
const FormData = require('form-data');

exports.handler = async function (event) {
  try {
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing REMOVE_BG_API_KEY");
      return { statusCode: 500, body: "Missing API key" };
    }

    // Expect JSON body { imageBase64: "data:image/png;base64,...." }
    const body = JSON.parse(event.body || "{}");
    if (!body.imageBase64) {
      return { statusCode: 400, body: "No imageBase64 provided" };
    }

    // Remove the data URL prefix if present
    const base64 = body.imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const form = new FormData();
    form.append('image_file_b64', base64);
    // optional: form.append('bg_color', 'transparent');
    // optional: form.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        // Note: do NOT set Content-Type here; form-data sets it
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
    if (!response.ok) {
      const errTxt = await response.text();
      console.error('remove.bg error', response.status, errTxt);
      return { statusCode: 500, body: `remove.bg error: ${response.status}` };
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Result = Buffer.from(arrayBuffer).toString('base64');

    // Return as base64-encoded binary (Netlify supports isBase64Encoded)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'image/png' },
      isBase64Encoded: true,
      body: base64Result
    };

  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: String(err) };
  }
};
