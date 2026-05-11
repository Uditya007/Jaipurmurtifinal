import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderDetails } = await req.json();
    
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error('Telegram config missing');
      return NextResponse.json({ error: 'Not configured' }, { status: 500 });
    }

    const message = encodeURIComponent(
      `🔔 *NEW ORDER RECEIVED* 🔔\n\n` +
      `👤 *Customer:* ${orderDetails.name}\n` +
      `💰 *Total:* ₹${orderDetails.total.toLocaleString('en-IN')}\n` +
      `📦 *Items:* ${orderDetails.items.map((i: any) => `${i.name} (x${i.quantity})`).join(', ')}\n` +
      `📍 *City:* ${orderDetails.city}\n\n` +
      `🙏 _May the Divine Bless the Shop!_`
    );

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${message}&parse_mode=Markdown`;

    const response = await fetch(url);

    if (response.ok) {
      return NextResponse.json({ success: true });
    } else {
      const errorData = await response.json();
      console.error('Telegram API error:', errorData);
      throw new Error('Failed to send Telegram message');
    }
  } catch (error) {
    console.error('Notification Error:', error);
    return NextResponse.json({ error: 'Failed to notify' }, { status: 500 });
  }
}
