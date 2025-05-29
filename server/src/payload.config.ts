// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import mongoose from 'mongoose';
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, Payload } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
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
import { startWorkers } from './workers/startWorkers';
import { intercomSettings } from './globals/intercomSettings';
import { startAPIMetricsTracking } from './services/cronjob/telegramBot';
import { ApiThresholds } from './collections/apiThresolds';
import { TelegramUsers } from './collections/telegramUsers';
import { createTelegramBot } from './services/telegrambot/bot';
import { telegramTokenSettings } from './globals/telegramToken';

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const startBot = async (payload: Payload) => {
  try {

    const telegramTokenFromDB = await payload.findGlobal({
      slug: "telegram-token-settings",
    })

    const TELEGRAM_TOKEN = telegramTokenFromDB?.telegramToken;

    console.log('⚙️ Creating bot instance...');
    const bot =await createTelegramBot(payload);

    console.log('🔑 Telegram Token starts with:', TELEGRAM_TOKEN?.slice(0, 10));

    // Step 1: Delete webhook before launching (to avoid silent hang)
    console.log('🔧 Deleting any existing webhook...');
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });

    bot.catch((err) => {
      console.error('❌ Telegraf error:', err);
    });

    console.log('🚀 Launching bot ...');

    try {
      const me = await bot.telegram.getMe();
      console.log(`Bot @${me.username} is reachable`);
    } catch (err) {
      console.error("Failed to reach Telegram API:", err);
    }

    await bot.launch({ dropPendingUpdates: true });

  } catch (error) {
    console.error('❌ Failed to launch bot:', error);
  }
};



export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Admin',
    },
  },
  debug: true,
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
    ApiThresholds,
    TelegramUsers
  ],
  globals : [paypalProductID, intercomSettings, telegramTokenSettings],
  cors: {
    origins: [
      process.env.FRONTEND_URL,
      'http://167.235.246.98:7778',
      'http://localhost:7778',
      'http://167.235.246.98:4001',
      'http://localhost:4001'
    ].filter((url): url is string => Boolean(url)),
  },
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
  onInit: async(payload) => {
    const server = (payload as any).server;

    if (server) {
      server.setTimeout(600000) // 60 seconds
      console.log('⏱️ Payload server timeout set to 60 seconds')
    }

    const conn = mongoose.connection
    conn.set('socketTimeoutMS', 300000)
    
    // Add connection status logging
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    console.log('Initializing Payload services...');

    console.log('Paypal plan check');
    createPlansAndGetID(payload);

    startBot(payload)
    // Run these async in background
    startDailyRankTracking(payload)
      .then(() => console.log('✅ Daily rank tracking started'))
      .catch(console.error);

    startAPIMetricsTracking(payload)
      .then(() => console.log('✅ API metrics tracking started'))
      .catch(console.error);

    startWorkers(payload)
      .then(() => console.log('✅ Workers started in background'))
      .catch((err) => console.error('Error starting workers:', err));
  }
})

