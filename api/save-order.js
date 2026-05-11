const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, phone, address, items, total } = req.body;

  const { data, error } = await supabase.from('orders').insert({
    customer_name: name,
    phone,
    address,
    items,
    total,
    status: 'pending',
  });

  if (error) return res.status(500).json({ success: false, error });

  res.json({ success: true, data });
};