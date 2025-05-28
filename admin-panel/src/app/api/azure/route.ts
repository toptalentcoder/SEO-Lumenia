import { NextResponse } from 'next/server'
import redis from '@/lib/redis'
import { getAzureOPenAIUsage } from '@/lib/azureScraper'

const CACHE_KEY = 'azure-usage-data'
const TTL_SECONDS = 60 * 30 // 30 minutes

export async function GET() {
    // Check Redis cache
    const cached = await redis.get(CACHE_KEY)
    if (cached) {
        return NextResponse.json(JSON.parse(cached))
    }

    // Scrape via Puppeteer if no cache
    const fresh = await getAzureOPenAIUsage()
    if ((fresh as any).error) return fresh as Response

    // Save to Redis
    await redis.set(CACHE_KEY, JSON.stringify(fresh), 'EX', TTL_SECONDS)

    return NextResponse.json(fresh)
}
