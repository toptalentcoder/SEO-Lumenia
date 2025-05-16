import { Worker, Job } from 'bullmq';
import { connection } from '../lib/redis';
import { verifyContentWithSeoBrief } from '../services/createSeoGuide/createSeoEditor/verifySeoBrief';
import { Payload, getPayload } from 'payload';
import configPromise from '@payload-config';

let seoBriefPayloadInstance: Payload | undefined;

export function setSeoBriefPayloadInstance(payload: Payload) {
    seoBriefPayloadInstance = payload;
}

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
    result?: any;
    error?: string;
    completed?: boolean;
    completedAt?: string;
    failed?: boolean;
    failedAt?: string;
}

const seoBriefWorker = new Worker<SeoBriefJobData>(
    'seoBriefQueue',
    async (job: Job<SeoBriefJobData>) => {
        console.log("Worker processing SEO brief verification job", job.id);
        try {
            // Update progress to 10% - Starting
            await job.updateProgress(10);

            const { content, seoBrief, language, queryID, email } = job.data;

            // Get or create payload instance
            const payload = seoBriefPayloadInstance || await getPayload({
                config: configPromise,
            });

            // Update progress to 30% - Payload instance ready
            await job.updateProgress(30);

            // Verify content with SEO brief
            const result = await verifyContentWithSeoBrief(content, seoBrief, language);

            // Update progress to 50% - Verification complete
            await job.updateProgress(50);

            // Save the verification result to the database
            const users = await payload.find({
                collection: "users",
                where: { email: { equals: email } },
                limit: 1,
            });

            if (users.docs.length > 0) {
                const user = users.docs[0];
                const updatedProjects = (Array.isArray(user.projects) ? user.projects : []).map((project: any) => {
                    return typeof project === "object" && project !== null
                        ? {
                            ...project,
                            seoGuides: ((project as { seoGuides?: { queryID: string }[] }).seoGuides || []).map((guide) => {
                                if (guide.queryID === queryID) {
                                    return {
                                        ...guide,
                                        briefVerification: {
                                            verificationResult: {
                                                objective: result.objective,
                                                mainTopics: result.mainTopics,
                                                importantQuestions: result.importantQuestions,
                                                writingStyleAndTone: result.writingStyleAndTone,
                                                recommendedStyle: result.recommendedStyle,
                                                valueProposition: result.valueProposition,
                                            },
                                            improvementText: result.improvementText,
                                            verifiedAt: new Date().toISOString()
                                        }
                                    };
                                }
                                return guide;
                            })
                        }
                        : project;
                });

                // Update progress to 80% - Database update in progress
                await job.updateProgress(80);

                await payload.update({
                    collection: "users",
                    id: user.id,
                    data: {
                        projects: updatedProjects,
                    },
                });
            }

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
            console.error('❌ SEO Brief worker error:', error);
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
        autorun: false,
        stalledInterval: 30000, // Check for stalled jobs every 30 seconds
        maxStalledCount: 2, // Allow up to 2 stalled checks before failing
        lockDuration: 300000, // Lock duration of 5 minutes
        lockRenewTime: 15000, // Renew lock every 15 seconds
        drainDelay: 5, // Wait 5 seconds before draining
        settings: {
            backoffStrategy: (attemptsMade: number) => {
                return Math.min(attemptsMade * 1000, 10000);
            }
        }
    }
);

// Handle worker events
seoBriefWorker.on('error', (error) => {
    console.error('❌ Worker error:', error);
});

seoBriefWorker.on('failed', (job, error) => {
    console.error(`❌ Job ${job?.id} failed:`, error);
});

seoBriefWorker.on('completed', async (job) => {
    console.log(`✅ Job ${job.id} completed`);
});

seoBriefWorker.on('stalled', (jobId) => {
    console.warn(`⚠️ Job ${jobId} stalled`);
});

seoBriefWorker.on('active', (job) => {
    console.log(`🔄 Job ${job.id} started processing`);
});

seoBriefWorker.on('progress', (job, progress) => {
    console.log(`📊 Job ${job.id} progress: ${progress}%`);
});

export default seoBriefWorker;