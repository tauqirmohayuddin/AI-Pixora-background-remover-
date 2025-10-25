import fetch from "node-fetch";
import FormData from "form-data";

export async function handler(event) {
  try {
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: "Missing REMOVE_BG_API_KEY" };
    }

    const formData = new FormData();
    const contentType = event.headers["content-type"];
    if (contentType && contentType.includes("multipart/form-data")) {
      formData.append("image_file", event.body);
    }

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": apiKey },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { statusCode: response.status, body: errorText };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return {
      statusCode: 200,
      headers: { "Content-Type": "image/png" },
      body: buffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
}


---
