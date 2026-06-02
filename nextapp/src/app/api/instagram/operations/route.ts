import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

// Fallback in-memory database to ensure immediate out-of-the-box functionality
// even if Supabase is not fully configured or tables don't exist yet.
let localMemoryPosts: any[] = [];
let localMemorySettings: any = {
  sandbox_mode: true,
  autopilot: false,
  posting_hour: 9,
  brand_hashtags: '#jaipurmurti #sacredart #marbleidols #spiritualart',
  gemini_api_key: '',
  telegram_bot_token: '',
  telegram_chat_id: '',
  insta_business_id: '',
  facebook_access_token: '',
  custom_mantras: '🕉️ Namo Bhagavate Vasudevaya\n🕉️ Ganesha Namah\n🕉️ Sri Ramaya Namah'
};

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
        disable_web_page_preview: false,
      }),
    });
    return res.ok;
  } catch (error) {
    console.error('Telegram notification error:', error);
    return false;
  }
}

// Helper: call Gemini to generate a caption
async function generateGeminiCaption(apiKey: string, deity: string, details: string, tone: string, hashtags: string, customMantras: string) {
  const model = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Tailor instructions based on the requested tone
  let toneGuideline = '';
  if (tone === 'spiritual') {
    toneGuideline = 'Deeply spiritual, meditative, serene, and devotional. Incorporate Vedic philosophy and inner peace vibes.';
  } else if (tone === 'sales') {
    toneGuideline = 'Captivating and exclusive, showcasing the elite heritage and master craftsmanship. Focus on high-end art collecting, worldwide shipping, and premium home styling.';
  } else if (tone === 'elegant') {
    toneGuideline = 'Poetic, sophisticated, luxury art-gallery style. Emphasize legacy, the beauty of White marble/lost-wax bronze, and aesthetic placement in home design.';
  } else {
    toneGuideline = 'Graceful and warm devotional greeting, highlighting positive energy, new beginnings, and housewarming blessings.';
  }

  const prompt = `
You are the elite social media manager and AI agent for "Jaipur Murti" (jaipurmurti.me), a premium brand selling museum-grade, hand-carved marble and bronze Hindu deity idols (murtis).

Write an exceptionally beautiful, engaging, and rich Instagram caption for a post featuring:
Deity: ${deity}
Product Details: ${details}
Chosen Post Tone: ${toneGuideline}

Guidelines:
1. **Sanskrit Mantra**: Start the caption with an appropriate, highly powerful and elegant Sanskrit mantra related to the deity. Draw from this list if applicable, or choose a perfect one: ${customMantras}. Translate or explain its divine meaning poetically in the next line.
2. **Body Text**:
   - Write 2-3 short, beautifully formatted paragraphs (use spacing/emojis tastefully, avoid dense walls of text).
   - Talk about the sacred symbolism of the deity's posture (e.g. Abhaya Mudra for protection, Veena for arts/harmony).
   - Highlight the exquisite craftsmanship: chiseled by palace artisans in Jaipur/Swamimalai, premium White marble, 24K gold leaf detail, 100% handmade, representing a legacy of devotion.
   - Speak to how this Murti brings positive energy, peace, and spiritual aesthetics to a home Mandir, creative studio, or living space.
3. **Call to Action (CTA)**: Elegant, non-pushy invite to visit jaipurmurti.me, explore the collection (worldwide shipping, fully insured), or DM for custom sizes.
4. **Hashtags**: Place them at the absolute bottom, separated by a couple of clean dots/lines. Combine these general brand hashtags [${hashtags}] with 5-6 highly specific hashtags for this deity (e.g. #ganeshstatue #homemandir).

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
  if (!text) throw new Error('Empty response from Gemini API.');
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
    throw new Error(`Meta API Container Error: ${errData.error?.message || containerRes.statusText}`);
  }

  const containerData = await containerRes.json();
  const containerId = containerData.id;

  if (!containerId) {
    throw new Error('Failed to retrieve media container ID from Meta.');
  }

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
    throw new Error(`Meta API Publication Error: ${errData.error?.message || publishRes.statusText}`);
  }

  const publishData = await publishRes.json();
  return publishData.id; // Returns published post ID
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;
    const supabase = createClient();

    // 1. GET SETTINGS
    if (action === 'get_settings') {
      try {
        const { data, error } = await supabase
          .from('instagram_settings')
          .select('value')
          .eq('key', 'config')
          .single();

        if (error || !data) {
          // Fall back to memory
          return NextResponse.json({ success: true, settings: localMemorySettings, fallbackUsed: true });
        }
        return NextResponse.json({ success: true, settings: data.value });
      } catch (err) {
        return NextResponse.json({ success: true, settings: localMemorySettings, fallbackUsed: true });
      }
    }

    // 2. SAVE SETTINGS
    if (action === 'save_settings') {
      const { settings } = body;
      try {
        const { error } = await supabase
          .from('instagram_settings')
          .upsert({ key: 'config', value: settings, updated_at: new Date().toISOString() });

        if (error) {
          localMemorySettings = settings;
          return NextResponse.json({ success: true, settings, fallbackUsed: true });
        }
        return NextResponse.json({ success: true, settings });
      } catch (err) {
        localMemorySettings = settings;
        return NextResponse.json({ success: true, settings, fallbackUsed: true });
      }
    }

    // 3. GENERATE CAPTION
    if (action === 'generate_caption') {
      const { deity, details, tone, config } = body;
      const apiKey = config.gemini_api_key || process.env.GEMINI_API_KEY || localMemorySettings.gemini_api_key;

      if (!apiKey) {
        return NextResponse.json({ 
          success: false, 
          error: 'Gemini API Key is missing. Please configure it in the Settings tab of the Dashboard.' 
        }, { status: 400 });
      }

      try {
        const caption = await generateGeminiCaption(
          apiKey,
          deity,
          details,
          tone,
          config.brand_hashtags || '#jaipurmurti',
          config.custom_mantras || '🕉️'
        );
        return NextResponse.json({ success: true, caption });
      } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message || 'Failed to generate caption with Gemini.' }, { status: 500 });
      }
    }

    // 4. PUBLISH POST
    if (action === 'publish_post') {
      const { post, config } = body;
      const isSandbox = config.sandbox_mode;

      try {
        let publishedPostId = `mock_ig_${Math.random().toString(36).substr(2, 9)}`;
        let actualImageUrl = post.image_url;

        // If not sandbox, verify credentials and call Graph API
        if (!isSandbox) {
          const accessToken = config.facebook_access_token;
          const instaId = config.insta_business_id;

          if (!accessToken || !instaId) {
            throw new Error('Meta Page Access Token or Instagram Business ID is missing. Provide them in settings or turn on Sandbox Mode.');
          }

          // If the image is a base64 encoded canvas output, we need a public URL.
          // In a real production setup, we can upload it to Supabase Storage.
          if (post.image_url.startsWith('data:image')) {
            // Upload to Supabase Storage bucket 'instagram-images'
            const base64Data = post.image_url.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const fileName = `ig_post_${Date.now()}.jpg`;

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('instagram-images')
              .upload(fileName, buffer, {
                contentType: 'image/jpeg',
                upsert: true
              });

            if (uploadError) {
              throw new Error(`Failed to upload canvas graphic to Supabase Storage: ${uploadError.message}. Make sure you created an 'instagram-images' bucket with public select access.`);
            }

            const { data: publicUrlData } = supabase.storage
              .from('instagram-images')
              .getPublicUrl(fileName);

            actualImageUrl = publicUrlData.publicUrl;
          }

          // Publish to real Instagram
          publishedPostId = await publishToInstagramAPI(accessToken, instaId, actualImageUrl, post.caption);
        }

        // Save post status to Database/Memory
        const savedPost = {
          ...post,
          id: post.id || `post_${Date.now()}`,
          status: 'published',
          published_at: new Date().toISOString(),
          post_id: publishedPostId,
          image_url: actualImageUrl
        };

        try {
          const { error } = await supabase
            .from('instagram_posts')
            .upsert(savedPost);

          if (error) throw error;
        } catch (dbErr) {
          // Fall back to local memory
          const idx = localMemoryPosts.findIndex(p => p.id === savedPost.id);
          if (idx > -1) localMemoryPosts[idx] = savedPost;
          else localMemoryPosts.push(savedPost);
        }

        // Send Telegram notification alert
        const telegramToken = config.telegram_bot_token || localMemorySettings.telegram_bot_token;
        const telegramChatId = config.telegram_chat_id || localMemorySettings.telegram_chat_id;

        if (telegramToken && telegramChatId) {
          const modeLabel = isSandbox ? '<b>[SANDBOX SIMULATION]</b>' : '<b>[PRODUCTION LIVE]</b>';
          const postLink = isSandbox 
            ? 'https://instagram.com/jaipur_murti' 
            : `https://instagram.com/p/${publishedPostId}`;

          const telegramMessage = `
✨ <b>Instagram Post Uploaded Successfully!</b> ✨
${modeLabel}

<b>Product/Deity:</b> ${post.deity || 'Sacred Collection'}
<b>Status:</b> Published ✅
<b>Post ID:</b> <a href="${postLink}">${publishedPostId}</a>

<b>Caption Preview:</b>
<i>"${post.caption.slice(0, 180)}..."</i>

Visit: <a href="https://jaipurmurti.me">jaipurmurti.me</a>
          `.trim();

          await sendTelegramAlert(telegramToken, telegramChatId, telegramMessage);
        }

        return NextResponse.json({ success: true, post: savedPost });
      } catch (err: any) {
        console.error('Publishing error:', err);
        
        // Save failed post to Database/Memory
        const failedPost = {
          ...post,
          id: post.id || `post_${Date.now()}`,
          status: 'failed',
          error_message: err.message || 'Unknown publishing error'
        };

        try {
          await supabase.from('instagram_posts').upsert(failedPost);
        } catch (dbErr) {
          const idx = localMemoryPosts.findIndex(p => p.id === failedPost.id);
          if (idx > -1) localMemoryPosts[idx] = failedPost;
          else localMemoryPosts.push(failedPost);
        }

        // Notify failure via Telegram
        const telegramToken = config.telegram_bot_token || localMemorySettings.telegram_bot_token;
        const telegramChatId = config.telegram_chat_id || localMemorySettings.telegram_chat_id;

        if (telegramToken && telegramChatId) {
          const telegramMessage = `
⚠️ <b>Instagram Publishing Failed!</b> ⚠️
<b>Product/Deity:</b> ${post.deity || 'Sacred Collection'}
<b>Error:</b> <code>${err.message || 'Unknown error'}</code>
          `.trim();
          await sendTelegramAlert(telegramToken, telegramChatId, telegramMessage);
        }

        return NextResponse.json({ success: false, error: err.message || 'Failed to publish post.' }, { status: 500 });
      }
    }

    // 5. GET POSTS (HISTORY & QUEUE)
    if (action === 'get_posts') {
      try {
        const { data, error } = await supabase
          .from('instagram_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error || !data) {
          return NextResponse.json({ success: true, posts: localMemoryPosts, fallbackUsed: true });
        }
        return NextResponse.json({ success: true, posts: data });
      } catch (err) {
        return NextResponse.json({ success: true, posts: localMemoryPosts, fallbackUsed: true });
      }
    }

    // 6. SCHEDULE POST
    if (action === 'schedule_post') {
      const { post } = body;
      const scheduledPost = {
        ...post,
        id: post.id || `post_${Date.now()}`,
        status: 'scheduled',
        created_at: new Date().toISOString()
      };

      try {
        const { error } = await supabase
          .from('instagram_posts')
          .upsert(scheduledPost);

        if (error) throw error;
      } catch (err) {
        const idx = localMemoryPosts.findIndex(p => p.id === scheduledPost.id);
        if (idx > -1) localMemoryPosts[idx] = scheduledPost;
        else localMemoryPosts.push(scheduledPost);
      }

      return NextResponse.json({ success: true, post: scheduledPost });
    }

    // 7. DELETE POST
    if (action === 'delete_post') {
      const { id } = body;
      try {
        const { error } = await supabase
          .from('instagram_posts')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (err) {
        localMemoryPosts = localMemoryPosts.filter(p => p.id !== id);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown action specified.' }, { status: 400 });

  } catch (err: any) {
    console.error('Operations route global error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
