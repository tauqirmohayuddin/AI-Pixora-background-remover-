// netlify/functions/remove-bg.js
const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing REMOVE_BG_API_KEY");
      return { statusCode: 500, body: "Missing REMOVE_BG_API_KEY" };
    }

    // Preserve real content-type (with boundary)
    const contentType =
      (event.headers["content-type"] || event.headers["Content-Type"] || "").trim();

    if (!contentType || !contentType.includes("multipart/form-data")) {
      console.error("❌ Invalid or missing Content-Type:", contentType);
      return { statusCode: 400, body: "Invalid or missing Content-Type header." };
    }

    // Decode body properly
    const bodyBuffer = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : Buffer.from(event.body || "", "binary");

    if (!bodyBuffer.length) {
      console.error("❌ Empty request body");
      return { statusCode: 400, body: "No image data received." };
    }

    console.log("✅ Body size:", bodyBuffer.length, "bytes");
    console.log("✅ Content-Type:", contentType);

    // Forward directly to remove.bg
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": contentType,
      },
      body: bodyBuffer,
    });

    console.log("➡️ remove.bg status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ remove.bg error:", errorText);
      return { statusCode: response.status, body: errorText };
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    return {
      statusCode: 200,
      headers: { "Content-Type": "image/png" },
      isBase64Encoded: true,
      body: base64Image,
    };
  } catch (err) {
    console.error("🔥 Function crash:", err);
    return { statusCode: 500, body: String(err.message || err) };
  }
};
