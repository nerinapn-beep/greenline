const webpush = require('web-push');

const VAPID_PUBLIC_KEY = 'BIeQDK3xiISOHf3RY_JcIS62ssZV2EKYSJjDKe1czz9hHiOrqF8esGXpc_EQFwjd28n2p5DqxGd5WzLtDAdjsME';
const VAPID_PRIVATE_KEY = 'B2nSc2f-GPhwP5jI4nrgRts7A9W7bY2wOtzBH9KkuY0';

webpush.setVapidDetails('mailto:stratlinksales@gmail.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    const { subscription, title, body } = JSON.parse(event.body);
    if (!subscription) return { statusCode: 400, headers, body: JSON.stringify({ error: 'No subscription' }) };

    const payload = JSON.stringify({ title, body });
    await webpush.sendNotification(subscription, payload);
    
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Push error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
