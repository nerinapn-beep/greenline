// This function is called by Netlify Scheduled Functions
// It sends notifications to all subscribers at 8am, 1pm and 8pm SAST

const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

const VAPID_PUBLIC_KEY = 'BIeQDK3xiISOHf3RY_JcIS62ssZV2EKYSJjDKe1czz9hHiOrqF8esGXpc_EQFwjd28n2p5DqxGd5WzLtDAdjsME';
const VAPID_PRIVATE_KEY = 'B2nSc2f-GPhwP5jI4nrgRts7A9W7bY2wOtzBH9KkuY0';

webpush.setVapidDetails('mailto:stratlinksales@gmail.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const sb = createClient(
  'https://vjjbfrkldngpycnahszh.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || ''
);

const getNotification = () => {
  // SAST = UTC+2
  const hour = new Date(Date.now() + 2 * 60 * 60 * 1000).getUTCHours();
  if (hour >= 6 && hour < 12) return {
    title: 'Good morning! 🌿 Zest',
    body: "Start your day right — did you log yesterday's purchases?"
  };
  if (hour >= 12 && hour < 17) return {
    title: 'Zest check-in ⚡',
    body: 'Afternoon reminder — log any purchases you made this morning. Less stress. More zest! 🍋'
  };
  return {
    title: 'Evening log 🧾 Zest',
    body: "Take 30 seconds to log today's spending before you forget! Less stress. More zest! 🍋"
  };
};

exports.handler = async () => {
  try {
    // Get all push subscriptions from Supabase
    const { data: subs, error } = await sb.from('push_subscriptions').select('*');
    if (error) throw error;
    if (!subs || subs.length === 0) return { statusCode: 200, body: 'No subscribers' };

    const notif = getNotification();
    const payload = JSON.stringify(notif);
    const results = await Promise.allSettled(
      subs.map(row => webpush.sendNotification(JSON.parse(row.subscription), payload))
    );
    const sent = results.filter(r => r.status === 'fulfilled').length;
    return { statusCode: 200, body: JSON.stringify({ sent, total: subs.length }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
