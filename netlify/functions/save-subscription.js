// Saves push subscription to Supabase when user enables notifications
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  'https://vjjbfrkldngpycnahszh.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || ''
);

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

    const endpoint = subscription.endpoint;
    
    // Upsert — save or update subscription
    const { error } = await sb.from('push_subscriptions').upsert({
      endpoint,
      subscription: JSON.stringify(subscription),
      user_id: userId || null,
      created_at: new Date().toISOString()
    }, { onConflict: 'endpoint' });

    if (error) throw error;
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
