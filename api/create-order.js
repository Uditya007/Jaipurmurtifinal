const Razorpay = require('razorpay');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const order = await razorpay.orders.create({
    amount: req.body.amount * 100,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
  });

  res.json({ orderId: order.id });
};