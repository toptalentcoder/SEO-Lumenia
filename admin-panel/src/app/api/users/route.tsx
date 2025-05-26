import { getDB } from '@/lib/mongo'
import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

export async function GET() {
  const db = await getDB()

  // Step 1: Get all users
  const users = await db.collection('users').find().toArray()
  console.log('Users:', users)

  // Step 2: Extract plan IDs (as strings)
  const planIds = users
    .map((u) => u.subscriptionPlan)
    .filter((id) => id)
    .map((id) => id.toString())

  console.log('planIds', planIds)

  // Step 3: Deduplicate and convert to ObjectIds
  const uniquePlanIds = [...new Set(planIds)]
  console.log('uniquePlanIds', uniquePlanIds)

  const objectIdPlanIds = uniquePlanIds.map(id => new ObjectId(id))

  // Step 4: Fetch plan documents from billing_plan
const plans = await db.collection('billing_plan')
  .find({ _id: { $in: uniquePlanIds } }) // use strings directly
  .toArray()

  console.log('Plans:', plans)

  // Step 5: Build a map from _id -> plan
  const planMap = Object.fromEntries(plans.map((plan) => [plan._id.toString(), plan]))
  console.log('Plan Map:', planMap)

  // Step 6: Enrich users with full plan data
  const enrichedUsers = users.map((u) => ({
    ...u,
    id: u._id.toString(),
    _id: undefined,
    subscriptionPlan: u.subscriptionPlan
      ? planMap[u.subscriptionPlan.toString()] || null
      : null,
  }))

  return NextResponse.json({ docs: enrichedUsers })
}

export async function POST(req: Request) {
  const body = await req.json()
  const db = await getDB()
  const result = await db.collection('users').insertOne(body)
  return NextResponse.json({ success: true, id: result.insertedId.toString() })
}
