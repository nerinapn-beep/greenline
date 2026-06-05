const webpush = require('web-push');
const { getStore } = require('@netlify/blobs');

const VAPID_PUBLIC_KEY = 'BIeQDK3xiISOHf3RY_JcIS62ssZV2EKYSJjDKe1czz9hHiOrqF8esGXpc_EQFwjd28n2p5DqxGd5WzLtDAdjsME';
const VAPID_PRIVATE_KEY = 'B2nSc2f-GPhwP5jI4nrgRts7A9W7bY2wOtzBH9KkuY0';

webpush.setVapidDetails('mailto:stratlinksales@gmail.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const getNotification = () => {
  const hour = new Date(Date.now() + 2 * 60 * 60 * 1000).getUTCHours();
  if (hour >= 6 && hour < 12) return {
    title: 'Good morning! 🌿 Zest',
    body: "Start your day right — did you log yesterday's purchases? Less stress. More zest! 🍋"
  };
  if (hour >= 12 && hour < 17) return {
    title: 'Zest check-in ⚡',
    body: 'Afternoon reminder — log any purchases from this morning. Less stress. More zest! 🍋'
  };
  return {
    title: 'Evening log 🧾 Zest',
    body: "30 seconds to log today's spending before you forget! Less stress. More zest! 🍋"
  };
};

exports.handler = async () => {
  try {
    const store = getStore('push-subscriptions');
    const { blobs } = await store.list();
    
    if (!blobs || blobs.length === 0) {
      return { statusCode: 200, body: 'No subscribers yet' };
    }

    const notif = getNotification();
    const payload = JSON.stringify(notif);
    let sent = 0;

    for (const blob of blobs) {
      try {
        const data = await store.get(blob.key, { type: 'json' });
        if (data && data.subscription) {
          await webpush.sendNotification(data.subscription, payload);
          sent++;
        }
      } catch (err) {
        // Remove expired subscriptions
        if (err.statusCode === 410) await store.delete(blob.key);
      }
    }

    return { statusCode: 200, body: JSON.stringify({ sent, total: blobs.length }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
