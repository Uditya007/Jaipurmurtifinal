const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

  // Verify signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSig !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Payment verification failed' });
  }

  // Save order to Supabase
  await supabase.from('orders').insert({
    customer_name: orderData.name,
    phone: orderData.phone,
    address: orderData.address,
    items: orderData.items,
    total: orderData.total,
    payment_id: razorpay_payment_id,
    status: 'paid',
  });

  // Send Telegram notification
  const msg = `🛕 New Order!\n👤 ${orderData.name}\n📞 ${orderData.phone}\n💰 ₹${orderData.total}\n🧾 ${razorpay_payment_id}`;
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: msg }),
  });

  res.json({ success: true });
};