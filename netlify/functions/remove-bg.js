'use strict';

// Minimal CommonJS Netlify Function for testing
// This avoids any external dependencies so Netlify can deploy easily.

exports.handler = async function (event, context) {
  try {
    // If called with GET show a small HTML message for testing:
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: 'remove-bg function reachable: GET OK'
      };
    }

    // For POST, echo back the size of the incoming body (safe test)
    const body = event.body || '';
    const size = Buffer.byteLength(body, 'utf8');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, method: event.httpMethod, bodySize: size })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: err.message })
    };
  }
};
