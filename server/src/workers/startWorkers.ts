import { Payload } from 'payload';
import './seoGuideWorker';
import { setPayloadInstance } from './seoGuideWorker';

export async function startWorkers(payload: Payload) {
    console.log('Initializing worker with Payload instance:', payload);
    if (!payload) {
        console.error('❌ Payload instance is missing');
        return;
    }
    // Initialize payload instance before starting workers
    setPayloadInstance(payload);
    console.log('✅ Payload instance initialized and workers started');

    // Import the worker file to start it
    await import('./seoGuideWorker');
    console.log('✅ SEO Guide workers started');
} 