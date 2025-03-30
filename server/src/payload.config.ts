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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, BillingPlan],
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
  ],
  onInit : async(payload) => {
    const conn = mongoose.connection

    conn.set('socketTimeoutMS', 30000)
    console.log('Paypal plan check');
    createPlansAndGetID(payload);
    startDailyRankTracking(payload);
    console.log('Daily rank tracking finsihed');
  }
})
