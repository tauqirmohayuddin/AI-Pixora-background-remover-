// netlify/functions/remove-bg.js
// Simple test function — returns JSON so we can confirm the function runs.
exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true, message: "remove-bg test running" }),
  };
};
