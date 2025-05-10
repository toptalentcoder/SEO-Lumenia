import { Worker, Job } from 'bullmq';
import { connection } from '../lib/redis';
import { processSeoGuide } from '../services/createSeoGuide/processSeoGuide';
import { Payload } from 'payload';

interface SeoGuideJobData {
    query: string;
    projectID: string;
    email: string;
    queryID: string;
    language: string;
    queryEngine: string;
    hl: string;
    gl: string;
    lr: string;
    result?: any;
    completed?: boolean;
    completedAt?: string;
    error?: string;
    failed?: boolean;
    failedAt?: string;
}

let payloadInstance: Payload | undefined;

export function setPayloadInstance(payload: Payload) {
    payloadInstance = payload;
}

const worker = new Worker<SeoGuideJobData>(
    'seoGuideQueue',
    async (job: Job<SeoGuideJobData>) => {
        try {
            // Update progress to 10% - Starting
            await job.updateProgress(10);

            // Process the SEO guide with job instance for progress updates
            const result = await processSeoGuide(job.data, payloadInstance, job);

            // Update progress to 100% - Complete
            await job.updateProgress(100);

            // Save the result as job data to ensure it's preserved
            await job.updateData({
                ...job.data,
                result,
                completed: true,
                completedAt: new Date().toISOString()
            });

            return result;
        } catch (error) {
            console.error('❌ SEO Guide worker error:', error);
            // Save error information to job data
            await job.updateData({
                ...job.data,
                error: error instanceof Error ? error.message : 'Unknown error',
                failed: true,
                failedAt: new Date().toISOString()
            });
            throw error;
        }
    },
    {
        connection,
        concurrency: 1,
        autorun: true,
        stalledInterval: 30000, // Check for stalled jobs every 30 seconds
        maxStalledCount: 2 // Allow up to 2 stalled checks before failing
    }
);

// Handle worker events
worker.on('error', (error) => {
    console.error('❌ Worker error:', error);
});

worker.on('failed', (job, error) => {
    console.error(`❌ Job ${job?.id} failed:`, error);
});

worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`);
});

worker.on('stalled', (jobId) => {
    console.warn(`⚠️ Job ${jobId} stalled`);
});

export default worker; 