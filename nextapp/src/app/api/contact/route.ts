import { createClient } from '@/lib/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { name, email, subject, message } = await req.json()

  const { error } = await supabase
    .from('contacts')
    .insert([{ name, email, phone: subject, message }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}