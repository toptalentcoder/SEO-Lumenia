import cron from 'node-cron';
import { sendTelegramReport } from '../api-metrics/sendToTelegram';

// --------- CRONJOB ---------

export function startAPIMetricsTracking() {

    cron.schedule('0 * * * *', async () => {
        console.log('⏰ Running API metrics check...');
        await sendTelegramReport();
    });
}
