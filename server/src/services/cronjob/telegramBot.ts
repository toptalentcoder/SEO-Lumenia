import cron from 'node-cron';
import { sendTelegramReport } from '../api-metrics/sendToTelegram';
import { Payload } from 'payload';

// --------- CRONJOB ---------

export const startAPIMetricsTracking = async(payload : Payload) => {

    cron.schedule('0 * * * *', async () => {
        console.log('⏰ Running API metrics check...');
        await sendTelegramReport(payload);
    });
}
