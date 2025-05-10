// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import mongoose from 'mongoose';
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { FRONTEND_URL } from './config/apiConfig'
import { customEndpoints } from './endpoints'
import { paypalProductID } from './globals/paypalProductID'
import { BillingPlan } from './collections/paypalPlan'
import { createPlansAndGetID } from './services/paypal/plan/CreatePlan'
import { startDailyRankTracking } from './services/cronjob/monitoring';
import { SerpWeatherKeywords } from './collections/SerpWeatherKeywords';
import { SerpVolatilityScores } from './collections/SerpVolatilityScores';
import { SerpSnapshots } from './collections/SerpSnapShots';
import { InternalPageRanks } from './collections/internalPageRank';
import { InternalUrls } from './collections/internalUrlsCollection';
import { PageDuplicates } from './collections/pageDuplicates';
import { BacklinkSites } from './collections/backlinkSites';
import { internalPageRankEndpoint } from './endpoints/internal_page_rank/internalPageRankEndpoint';
import { startWorkers } from './workers/startWorkers'; // Import the function instead of the file
import { setPayloadInstance } from './workers/seoGuideWorker';

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    BillingPlan,
    SerpWeatherKeywords,
    SerpVolatilityScores,
    SerpSnapshots,
    InternalPageRanks,
    InternalUrls,
    PageDuplicates,
    BacklinkSites,
  ],
  globals : [paypalProductID],
  cors: {origins : [FRONTEND_URL]}, // Allow requests from your frontend
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  endpoints: [
    ...(customEndpoints || []), // Ensure customEndpoints is defined
    internalPageRankEndpoint,
  ],
  onInit : async(payload) => {
    const server = (payload as any).server;

    if (server) {
      server.setTimeout(600000) // 60 seconds
      console.log('⏱️ Payload server timeout set to 60 seconds')
    }

    const conn = mongoose.connection

    conn.set('socketTimeoutMS', 300000)
    console.log('Paypal plan check');
    createPlansAndGetID(payload);
    startDailyRankTracking(payload);
    console.log('Daily rank tracking finished');
    
    // Set payload instance for worker
    setPayloadInstance(payload);
    
    // Start workers after other initializations
    await startWorkers(payload);
    console.log('✅ SEO Guide workers started');
  }
})
