const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    const { subscription, userId } = JSON.parse(event.body);
    if (!subscription) return { statusCode: 400, headers, body: JSON.stringify({ error: 'No subscription' }) };

    // Store subscription in Netlify Blobs
    const store = getStore('push-subscriptions');
    const key = Buffer.from(subscription.endpoint).toString('base64').slice(0, 100);
    
    await store.setJSON(key, {
      subscription,
      userId: userId || null,
      createdAt: new Date().toISOString()
    });

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
