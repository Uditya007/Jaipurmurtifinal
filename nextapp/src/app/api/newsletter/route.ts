import { createClient } from '@/lib/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert([{ email }])

  if (error) {
    // Check if the error is due to a unique constraint violation (already subscribed)
    if (error.code === '23505') {
      return NextResponse.json({ success: true, message: 'Already subscribed' })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}
