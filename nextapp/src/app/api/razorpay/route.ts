import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

export async function POST(req: Request) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: 'Razorpay keys not configured' },
      { status: 500 }
    );
  }

  try {
    const { amount, currency = 'INR', receipt = 'receipt_1' } = await req.json();

    // Amount must be in smallest currency unit (paise for INR)
    const options = {
      amount: amount * 100, 
      currency,
      receipt,
      payment_capture: 1, // Auto-capture
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
