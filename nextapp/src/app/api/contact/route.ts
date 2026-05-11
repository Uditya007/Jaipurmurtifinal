import { createClient } from '@/lib/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { name, email, subject, message } = await req.json()

  const { error } = await supabase
    .from('contacts')
    .insert([{ name, email, phone: subject, message }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Trigger Telegram Notification for Contact Enquiry
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (BOT_TOKEN && CHAT_ID) {
      const msg = encodeURIComponent(
        `📬 *NEW CONTACT ENQUIRY* 📬\n\n` +
        `👤 *Name:* ${name}\n` +
        `📧 *Email:* ${email}\n` +
        `📱 *Phone:* ${subject}\n` +
        `💬 *Message:* ${message}`
      );
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${msg}&parse_mode=Markdown`);
    }
  } catch (err) {
    console.error('Telegram notification failed:', err);
  }

  return NextResponse.json({ success: true })
}