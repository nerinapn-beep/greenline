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

    // Send test notification immediately AND save subscription
    // For now just send the welcome notification directly
    const payload = JSON.stringify({
      title: title || 'Zest reminders are on! 🌿',
      body: body || "You will get nudges at 8am, 1pm and 8pm. Less stress. More zest! 🍋"
    });

    await webpush.sendNotification(subscription, payload);

    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ success: true, message: 'Notification sent!' }) 
    };
  } catch (err) {
    console.error('Error:', err.message, err.statusCode);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: err.message }) 
    };
  }
};
