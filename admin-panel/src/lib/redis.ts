import { REDIS_URL } from '@/config/apiConfig'
import Redis from 'ioredis'

const redis = new Redis(REDIS_URL)

export default redis
