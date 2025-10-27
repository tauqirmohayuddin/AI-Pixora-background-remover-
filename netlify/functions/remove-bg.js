'use strict';

// ✅ Test version of your background remover Netlify Function
// This checks that your function deploys and runs successfully.

exports.handler = async function (event, context) {
  try {
    // 🔹 Create a tiny 1x1 white PNG (base64 encoded)
    const tinyBase64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

    const dataUrl = 'data:image/png;base64,' + tinyBase64;

    // ✅ Return success response
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Test function executed successfully 🎉',
        result: dataUrl
      })
    };
  } catch (error) {
    // ❌ Handle any unexpected errors
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
