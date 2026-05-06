import { createClient } from '@/lib/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { name, email, phone, message } = await req.json()

  console.log('Received:', { name, email, phone, message })

  const { data, error } = await supabase
    .from('contacts')
    .insert([{ name, email, phone, message }])
    .select()

  console.log('Supabase response:', { data, error })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}