import { Worker, Job } from 'bullmq';
import { connection } from '../lib/redis';
import { processSeoGuide } from '../services/createSeoGuide/processSeoGuide';
import { Payload, getPayload } from 'payload';
import configPromise from '@payload-config';

let seoGuidePayloadInstance: Payload | undefined;

export function setSeoGuidePayloadInstance(payload: Payload) {
    console.log('Setting Payload instance for SEO Guide worker');
    seoGuidePayloadInstance = payload;
}

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

const seoGuideWorker = new Worker<SeoGuideJobData>(
    'seoGuideQueue',
    async (job: Job<SeoGuideJobData>) => {
        console.log("🔄 Worker processing SEO guide creation job", job.id);
        console.log("📝 Job data:", JSON.stringify(job.data, null, 2));
        try {
            // Update progress to 10% - Starting
            await job.updateProgress(10);
            console.log("✅ Initial progress update complete");

            const { query, projectID, email, queryID, language, queryEngine, hl, gl, lr } = job.data;

            // Get or create payload instance
            console.log("🔑 Getting Payload instance...");
            let payload = seoGuidePayloadInstance;
            
            if (!payload) {
                console.log("Payload instance not found, creating new instance...");
                payload = await getPayload({
                    config: configPromise,
                });
                seoGuidePayloadInstance = payload;
            }
            
            if (!payload) {
                throw new Error("Failed to get or create Payload instance");
            }
            
            console.log("✅ Payload instance obtained");

            // Update progress to 30% - Payload instance ready
            await job.updateProgress(30);

            // Process the SEO guide
            console.log("🚀 Starting SEO guide processing...");
            const result = await processSeoGuide(job.data, payload, job);
            console.log("✅ SEO guide processing complete");

            // Update progress to 50% - Processing complete
            await job.updateProgress(50);

            // Update progress to 80% - Database update in progress
            await job.updateProgress(80);

            // Update progress to 100% - Complete
            await job.updateProgress(100);

            // Save the result as job data to ensure it's preserved
            console.log("💾 Saving job results...");
            await job.updateData({
                ...job.data,
                result,
                completed: true,
                completedAt: new Date().toISOString()
            });
            console.log("✅ Job results saved");

            return result;
        } catch (error) {
            console.error('❌ SEO Guide worker error:', error);
            console.error('Error details:', error instanceof Error ? error.stack : 'Unknown error');
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
        autorun: false,
        stalledInterval: 30000,
        maxStalledCount: 2,
        lockDuration: 300000,
        lockRenewTime: 15000,
        drainDelay: 5,
        settings: {
            backoffStrategy: (attemptsMade: number) => {
                return Math.min(attemptsMade * 1000, 10000);
            }
        }
    }
);

// Handle worker events
seoGuideWorker.on('error', (error) => {
    console.error('❌ Worker error:', error);
});

seoGuideWorker.on('failed', (job, error) => {
    console.error(`❌ Job ${job?.id} failed:`, error);
});

seoGuideWorker.on('completed', async (job) => {
    console.log(`✅ Job ${job.id} completed`);
});

seoGuideWorker.on('stalled', (jobId) => {
    console.warn(`⚠️ Job ${jobId} stalled`);
});

seoGuideWorker.on('active', (job) => {
    console.log(`🔄 Job ${job.id} started processing`);
});

seoGuideWorker.on('progress', (job, progress) => {
    console.log(`📊 Job ${job.id} progress: ${progress}%`);
});

export default seoGuideWorker; 