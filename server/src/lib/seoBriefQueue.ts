import { Queue, Job, QueueEvents } from 'bullmq';
import { connection } from './redis';
import { Payload } from 'payload';

interface SeoBriefJobData {
    content: string;
    seoBrief: {
        objective: string[];
        mainTopics: string[];
        importantQuestions: string[];
        writingStyleAndTone: string[];
        recommendedStyle: string[];
        valueProposition: string[];
    };
    language?: string;
    queryID: string;
    email: string;
    payload?: Payload;
}

// Create the queue with default options
export const seoBriefQueue = new Queue<SeoBriefJobData>('seoBriefQueue', { 
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        },
        removeOnComplete: {
            age: 3600, // Keep completed jobs for 1 hour
            count: 100 // Keep last 100 completed jobs
        },
        removeOnFail: {
            age: 24 * 3600 // Keep failed jobs for 24 hours
        }
    }
});

// Create queue events instance
const queueEvents = new QueueEvents('seoBriefQueue', { 
    connection,
    autorun: true
});

// Handle queue events
seoBriefQueue.on('error', (error) => {
    console.error('❌ Queue error:', error);
}); 

// Handle job events through queueEvents instead of queue
queueEvents.on('failed', ({ jobId, failedReason }) => {
    console.error(`❌ Job ${jobId} failed:`, failedReason);
});

queueEvents.on('stalled', ({ jobId }) => {
    console.warn(`⚠️ Job ${jobId} stalled`);
});

queueEvents.on('completed', ({ jobId }) => {
    console.log(`✅ Job ${jobId} completed`);
}); 