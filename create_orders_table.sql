-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/flvovuptqgzbzwgnsnum/sql/new

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'processing',
  total_amount INTEGER NOT NULL,
  items JSONB NOT NULL,
  shipping_address TEXT,
  tracking_number TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
