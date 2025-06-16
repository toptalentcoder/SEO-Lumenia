import { Payload } from 'payload';
import { setSeoGuidePayloadInstance } from './seoGuideWorker';
import { setSeoBriefPayloadInstance } from './seoBriefWorker';
import seoGuideWorker from './seoGuideWorker';
import seoBriefWorker from './seoBriefWorker';

export async function startWorkers(payload: Payload) {
    // console.log('Initializing workers with Payload instance:', payload);
    if (!payload) {
        console.error('❌ Payload instance is missing');
        return;
    }
    // Initialize payload instance before starting workers
    setSeoGuidePayloadInstance(payload);
    setSeoBriefPayloadInstance(payload);
    console.log('✅ Payload instance initialized for both workers');

    // Start the workers
    await Promise.all([
        seoGuideWorker.run(),
        seoBriefWorker.run()
    ]);
    console.log('✅ SEO Guide and SEO Brief workers started');
}