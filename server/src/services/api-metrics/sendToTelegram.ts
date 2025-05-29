import axios from 'axios';
import { collectAllMetrics } from './getAllAPIUsageSummary';
import { Payload } from 'payload';

export const sendTelegramReport = async (payload : Payload) => {
    const message = await collectAllMetrics(payload);

    if (!message) {
        console.log('⚠️ Usage levels are OK — no alert sent.');
        return;
    }

    const telegramTokenFromDB = await payload.findGlobal({
        slug: "telegram-token-settings",
    })

    const TELEGRAM_TOKEN = telegramTokenFromDB?.telegramToken;

    const { docs: users } = await payload.find({
        collection: 'telegram-users',
        limit: 0, // fetch all users
    });

    for (const user of users) {
        try {
            await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                chat_id: user.chatId,
                text: message,
            });
        } catch (err: any) {
            console.error(`❌ Failed to send to ${user.chatId}:`, err?.response?.data || err.message);
        }
        // throttle messages to avoid rate limits
        await new Promise((res) => setTimeout(res, 50));
    }

    console.log('✅ Telegram alerts sent to all users!');
};
