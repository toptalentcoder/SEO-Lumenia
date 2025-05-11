import Redis from 'ioredis';
import { REDIS_URL } from '@/config/apiConfig';

// Create Redis connection with fallback to localhost
if (!REDIS_URL) {
    throw new Error('❌ REDIS_URL is not defined in the configuration');
}

export const connection = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null, // Required by BullMQ for blocking operations
    enableReadyCheck: true,
    connectTimeout: 60000, // 60 seconds
    disconnectTimeout: 10000, // 10 seconds
    commandTimeout: 60000, // 60 seconds
    retryStrategy: (times) => {
        if (times > 10) {
            console.error('❌ Redis connection failed after 10 retries');
            return null; // Stop retrying after 10 attempts
        }
        const delay = Math.min(times * 3000, 15000);
        console.log(`🔄 Retrying Redis connection in ${delay}ms...`);
        return delay;
    },
    reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
            return true; // Reconnect when Redis is in readonly mode
        }
        return false;
    }
});

// Handle connection events
connection.on('connect', () => {
    console.log('✅ Connected to Redis');
});

connection.on('error', (error) => {
    console.error('❌ Redis connection error:', error);
    // Don't throw the error, just log it
});

connection.on('ready', () => {
    console.log('✅ Redis client ready');
});

connection.on('reconnecting', () => {
    console.log('🔄 Redis client reconnecting...');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    connection.quit();
});

// Export a function to check Redis connection
export async function checkRedisConnection(): Promise<boolean> {
    try {
        await connection.ping();
        return true;
    } catch (error) {
        console.error('❌ Redis connection check failed:', error);
        return false;
    }
} 