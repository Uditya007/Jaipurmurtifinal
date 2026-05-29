-- RUN THIS IN YOUR SUPABASE SQL EDITOR:
-- https://supabase.com/dashboard/project/flvovuptqgzbzwgnsnum/sql/new

-- Create table for Instagram postings
CREATE TABLE IF NOT EXISTS instagram_posts (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
  caption TEXT NOT NULL,
  image_url TEXT NOT NULL,
  product_id TEXT, -- linked product if any
  error_message TEXT,
  post_id TEXT -- Instagram media post ID returned from Graph API
);

-- Create table for agent/instagram settings
CREATE TABLE IF NOT EXISTS instagram_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_settings ENABLE ROW LEVEL SECURITY;

-- Simple permissive policies for admin access. 
-- In a production environment, restrict to authenticated admin roles.
CREATE POLICY "Allow public select for instagram_posts" ON instagram_posts
  FOR SELECT USING (true);

CREATE POLICY "Allow public write for instagram_posts" ON instagram_posts
  FOR ALL USING (true);

CREATE POLICY "Allow public select for instagram_settings" ON instagram_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow public write for instagram_settings" ON instagram_settings
  FOR ALL USING (true);

-- Insert initial empty settings if they don't exist
INSERT INTO instagram_settings (key, value)
VALUES (
  'config', 
  '{
    "sandbox_mode": true,
    "autopilot": false,
    "posting_hour": 9,
    "brand_hashtags": "#jaipurmurti #sacredart #marbleidols #spiritualart",
    "gemini_api_key": "",
    "telegram_bot_token": "",
    "telegram_chat_id": "",
    "insta_business_id": "",
    "facebook_access_token": "",
    "custom_mantras": "🕉️ Namo Bhagavate Vasudevaya\\n🕉️ Ganesha Namah"
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;
