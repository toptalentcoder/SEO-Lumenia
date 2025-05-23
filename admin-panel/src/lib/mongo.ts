// lib/mongo.ts
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const dbName = 'Lumenia'

const client = new MongoClient(uri)
let cachedDb : Awaited<ReturnType<typeof client.db>>

export const getDB = async () => {
    if (!cachedDb) {
        await client.connect()
        cachedDb  = client.db(dbName)
    }
    return cachedDb 
}
