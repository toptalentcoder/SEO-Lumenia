import { Payload } from 'payload';
import './seoGuideWorker';

export async function startWorkers(payload: Payload) {
    // Import the worker file to start it
    await import('./seoGuideWorker');
    console.log('✅ SEO Guide workers started');
} 