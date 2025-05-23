// app/api/users/route.ts
import { getDB } from '@/lib/mongo'
import { NextResponse } from 'next/server'

export async function GET() {
  const db = await getDB()
  const users = await db.collection('users').find().toArray()
  const normalizedUsers = users.map((u) => ({
    ...u,
    id: u._id.toString(), // 🧠 Convert ObjectId to string
  }))

  return NextResponse.json({ docs: normalizedUsers })
}

export async function POST(req: Request) {
  const body = await req.json()
  const db = await getDB()
  const result = await db.collection('users').insertOne(body)
  return NextResponse.json({ success: true, id: result.insertedId })
}
