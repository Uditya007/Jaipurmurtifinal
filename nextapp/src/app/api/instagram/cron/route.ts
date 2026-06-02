import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';
import { products } from '@/lib/products';

// Helper: send Telegram notification
async function sendTelegramAlert(token: string, chatId: string, message: string) {
  if (!token || !chatId) return false;
  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });
    return res.ok;
  } catch (error) {
    console.error('Cron Telegram notification error:', error);
    return false;
  }
}

// Helper: call Gemini to generate a caption
async function generateGeminiCaption(apiKey: string, deity: string, details: string, tone: string, hashtags: string, customMantras: string) {
  const model = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = `
You are the elite social media manager and AI autopilot agent for "Jaipur Murti" (jaipurmurti.me), a premium brand selling museum-grade, hand-carved marble and bronze Hindu deity idols (murtis).

Write an exceptionally beautiful, engaging, and rich Instagram caption for a post featuring:
Deity: ${deity}
Product Details: ${details}
Post Tone: Deeply spiritual, elegant, and showcase high-end temple art heritage.

Guidelines:
1. **Sanskrit Mantra**: Start the caption with an appropriate, highly powerful and elegant Sanskrit mantra related to the deity. Draw from this list if applicable, or choose a perfect one: ${customMantras}. Translate or explain its divine meaning poetically in the next line.
2. **Body Text**:
   - Write 2-3 short, beautifully formatted paragraphs (use spacing/emojis tastefully).
   - Talk about the sacred symbolism of the deity (e.g. blessings, wisdom, prosperity, remover of obstacles).
   - Highlight the exquisite craftsmanship: hand-chiseled by palace artisans in Jaipur, pristine White marble or lost-wax Swamimalai bronze, museum-tier legacy of devotion.
   - Speak to how this Murti brings positive energy, peace, and spiritual aesthetics to a home Mandir or living space.
3. **Call to Action (CTA)**: Elegant invite to visit jaipurmurti.me, explore the collection (worldwide shipping, fully insured).
4. **Hashtags**: Place them at the absolute bottom. Combine these general brand hashtags [${hashtags}] with 5-6 highly specific hashtags for this deity (e.g. #ganeshstatue #homemandir).

Do not include any placeholders, system instructions, or markdown headers like "Here is your caption:". Start directly with the Sanskrit mantra. Ensure it feels authentic, respectful, and luxury-tier.
  `;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini.');
  return text.trim();
}

// Helper: Publish to Instagram Graph API
async function publishToInstagramAPI(
  accessToken: string,
  instaBusinessId: string,
  imageUrl: string,
  caption: string
) {
  // Step 1: Create Image Container
  const containerUrl = `https://graph.facebook.com/v19.0/${instaBusinessId}/media`;
  const containerRes = await fetch(containerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: imageUrl,
      caption: caption,
      access_token: accessToken,
    }),
  });

  if (!containerRes.ok) {
    const errData = await containerRes.json();
    throw new Error(`Meta Container Error: ${errData.error?.message || containerRes.statusText}`);
  }

  const containerData = await containerRes.json();
  const containerId = containerData.id;

  if (!containerId) throw new Error('Failed to retrieve container ID.');

  // Step 2: Publish Container
  const publishUrl = `https://graph.facebook.com/v19.0/${instaBusinessId}/media_publish`;
  const publishRes = await fetch(publishUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: containerId,
      access_token: accessToken,
    }),
  });

  if (!publishRes.ok) {
    const errData = await publishRes.json();
    throw new Error(`Meta Publication Error: ${errData.error?.message || publishRes.statusText}`);
  }

  const publishData = await publishRes.json();
  return publishData.id;
}

export async function GET(request: Request) {
  return handleCron();
}

export async function POST(request: Request) {
  return handleCron();
}

async function handleCron() {
  const supabase = createClient();
  const logs: string[] = [];
  
  try {
    logs.push(`Cron started at ${new Date().toISOString()}`);

    // 1. Fetch Config
    let config: any = null;
    try {
      const { data, error } = await supabase
        .from('instagram_settings')
        .select('value')
        .eq('key', 'config')
        .single();
      
      if (!error && data) {
        config = data.value;
      }
    } catch (e) {
      logs.push(`Failed to fetch database settings: ${(e as Error).message}`);
    }

    // Default configuration fallback if db isn't set up yet
    if (!config) {
      config = {
        sandbox_mode: true,
        autopilot: false,
        posting_hour: 9,
        brand_hashtags: '#jaipurmurti #sacredart #marbleidols #spiritualart',
        gemini_api_key: process.env.GEMINI_API_KEY,
        telegram_bot_token: process.env.TELEGRAM_BOT_TOKEN,
        telegram_chat_id: process.env.TELEGRAM_CHAT_ID,
        insta_business_id: '',
        facebook_access_token: '',
        custom_mantras: '🕉️ Namo Bhagavate Vasudevaya\n🕉️ Ganesha Namah'
      };
      logs.push('Using default environment variables configuration fallback.');
    }

    const isSandbox = config.sandbox_mode;
    const isAutopilot = config.autopilot;
    const telegramToken = config.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = config.telegram_chat_id || process.env.TELEGRAM_CHAT_ID;

    // 2. Check for Pending Scheduled Posts
    let scheduledPost: any = null;
    try {
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .eq('status', 'scheduled')
        .lte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(1);

      if (!error && data && data.length > 0) {
        scheduledPost = data[0];
      }
    } catch (e) {
      logs.push(`Error checking scheduled queue: ${(e as Error).message}`);
    }

    // A. IF THERE IS A SCHEDULED POST, PUBLISH IT
    if (scheduledPost) {
      logs.push(`Found scheduled post in queue: ID ${scheduledPost.id}`);
      
      try {
        let publishedId = `mock_ig_${Math.random().toString(36).substr(2, 9)}`;

        if (!isSandbox) {
          if (!config.facebook_access_token || !config.insta_business_id) {
            throw new Error('Meta Page Access Token or Instagram Business ID is missing in settings.');
          }
          publishedId = await publishToInstagramAPI(
            config.facebook_access_token,
            config.insta_business_id,
            scheduledPost.image_url,
            scheduledPost.caption
          );
        }

        // Update database status
        try {
          await supabase
            .from('instagram_posts')
            .update({
              status: 'published',
              published_at: new Date().toISOString(),
              post_id: publishedId
            })
            .eq('id', scheduledPost.id);
        } catch (e) {}

        logs.push(`Successfully published scheduled post ${scheduledPost.id}. ID: ${publishedId}`);

        // Notify Telegram
        if (telegramToken && telegramChatId) {
          const modeLabel = isSandbox ? '<b>[SANDBOX SIMULATION]</b>' : '<b>[PRODUCTION LIVE]</b>';
          const postLink = isSandbox ? 'https://instagram.com/jaipur_murti' : `https://instagram.com/p/${publishedId}`;
          await sendTelegramAlert(
            telegramToken,
            telegramChatId,
            `✨ <b>Scheduled Post Published on Autopilot!</b> ✨\n${modeLabel}\n\n<b>Product:</b> ${scheduledPost.deity || 'Sacred Collection'}\n<b>Status:</b> Success ✅\n<b>Post ID:</b> <a href="${postLink}">${publishedId}</a>\n\n<b>Caption:</b>\n<i>"${scheduledPost.caption.slice(0, 150)}..."</i>`
          );
        }

        return NextResponse.json({ success: true, action: 'published_scheduled', postId: publishedId, logs });
      } catch (err: any) {
        logs.push(`Failed to publish scheduled post: ${err.message}`);
        
        try {
          await supabase
            .from('instagram_posts')
            .update({
              status: 'failed',
              error_message: err.message
            })
            .eq('id', scheduledPost.id);
        } catch (e) {}

        if (telegramToken && telegramChatId) {
          await sendTelegramAlert(
            telegramToken,
            telegramChatId,
            `⚠️ <b>Failed to publish scheduled post!</b>\n<b>Post ID:</b> ${scheduledPost.id}\n<b>Error:</b> <code>${err.message}</code>`
          );
        }

        return NextResponse.json({ success: false, error: err.message, logs }, { status: 500 });
      }
    }

    // B. IF NO SCHEDULED POST BUT AUTOPILOT IS ON, AUTO-GENERATE A POST
    if (isAutopilot) {
      logs.push('No scheduled posts in queue. Autopilot is ACTIVE. Generating fresh post.');
      
      const apiKey = config.gemini_api_key || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API Key is missing. Cannot run Autopilot post generator.');
      }

      // 1. Select a random product from products library
      const randomIndex = Math.floor(Math.random() * products.length);
      const product = products[randomIndex];
      logs.push(`Selected random product for Autopilot: ${product.name}`);

      // 2. Generate caption with Gemini
      const details = `Name: ${product.name}, Material: ${product.material}, Height: ${product.height}, Description: ${product.description}, Keywords: ${product.keywords}`;
      const caption = await generateGeminiCaption(
        apiKey,
        product.deity,
        details,
        'spiritual',
        config.brand_hashtags || '#jaipurmurti',
        config.custom_mantras || '🕉️'
      );
      logs.push('Gemini caption successfully generated.');

      // 3. Post primary product image
      // Instagram Graph API requires a public URL. Product images in Murti2 are local (e.g. /products/ganesha-hero.png).
      // We will map it to the public domain.
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaipurmurti.me';
      // Fallback: If image path is full URL, keep it, else prepend domain
      const postImageUrl = product.images[0].startsWith('http') 
        ? product.images[0] 
        : `${baseUrl}${product.images[0]}`;
      
      logs.push(`Target image URL: ${postImageUrl}`);

      // 4. Publish
      let publishedId = `mock_ig_${Math.random().toString(36).substr(2, 9)}`;

      if (!isSandbox) {
        if (!config.facebook_access_token || !config.insta_business_id) {
          throw new Error('Meta Page Access Token or Instagram Business ID is missing in settings.');
        }
        publishedId = await publishToInstagramAPI(
          config.facebook_access_token,
          config.insta_business_id,
          postImageUrl,
          caption
        );
      }

      // 5. Save to database history
      const autopilotPost = {
        id: `auto_${Date.now()}`,
        created_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        status: 'published',
        caption: caption,
        image_url: postImageUrl,
        product_id: product.id,
        post_id: publishedId
      };

      try {
        await supabase
          .from('instagram_posts')
          .insert(autopilotPost);
      } catch (dbErr) {
        logs.push(`Failed to save Autopilot post history in DB: ${(dbErr as Error).message}`);
      }

      logs.push(`Autopilot post published successfully. ID: ${publishedId}`);

      // Send Telegram alert
      if (telegramToken && telegramChatId) {
        const modeLabel = isSandbox ? '<b>[SANDBOX SIMULATION]</b>' : '<b>[PRODUCTION LIVE]</b>';
        const postLink = isSandbox ? 'https://instagram.com/jaipur_murti' : `https://instagram.com/p/${publishedId}`;
        
        await sendTelegramAlert(
          telegramToken,
          telegramChatId,
          `🤖 <b>Autopilot Social Agent Run Succeeded!</b> 🤖\n${modeLabel}\n\n<b>Product:</b> ${product.name}\n<b>Deity:</b> ${product.deity}\n<b>Status:</b> Auto-Published ✅\n<b>Post Link:</b> <a href="${postLink}">${publishedId}</a>\n\n<b>Caption Preview:</b>\n<i>"${caption.slice(0, 150)}..."</i>`
        );
      }

      return NextResponse.json({ success: true, action: 'autopilot_generated', postId: publishedId, logs });
    }

    logs.push('No scheduled posts found and Autopilot is toggled OFF. Nothing to do.');
    return NextResponse.json({ success: true, action: 'idle', logs });

  } catch (err: any) {
    logs.push(`Cron Error: ${err.message}`);
    console.error('Autopilot Cron Error:', err);

    // Send Telegram alert on cron failure
    try {
      const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_CHAT_ID;
      if (telegramToken && telegramChatId) {
        await sendTelegramAlert(
          telegramToken,
          telegramChatId,
          `🤖❌ <b>Autopilot Social Agent Run Failed!</b>\n<b>Error:</b> <code>${err.message}</code>`
        );
      }
    } catch (e) {}

    return NextResponse.json({ success: false, error: err.message, logs }, { status: 500 });
  }
}
