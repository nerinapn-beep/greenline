// Saves push subscription to Supabase when user enables notifications
const { createClient } = require('@supabase/supabase-js');
 
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
 
    // Use service key from environment
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    if (!serviceKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Service key not configured' }) };
    }
 
    const sb = createClient(
      'https://vjjbfrkldngpycnahszh.supabase.co',
      serviceKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
 
    const endpoint = subscription.endpoint;
    
    const { error } = await sb.from('push_subscriptions').upsert({
      endpoint,
      subscription: JSON.stringify(subscription),
      user_id: userId || null,
      created_at: new Date().toISOString()
    }, { onConflict: 'endpoint' });
 
    if (error) {
      console.error('Supabase error:', JSON.stringify(error));
      return { statusCode: 500, headers, body: JSON.stringify({ error: error.message, details: error }) };
    }
    
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Function error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
 
