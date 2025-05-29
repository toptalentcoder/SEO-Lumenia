import axios from 'axios';
import { collectAllMetrics } from './getAllAPIUsageSummary';
import { TELEGRAM_CHAT_ID, TELEGRAM_TOKEN } from '@/config/apiConfig';
import { Payload } from 'payload';

export const sendTelegramReport = async (payload : Payload) => {
    const message = await collectAllMetrics(payload);

    if (!message) {
        console.log('⚠️ Usage levels are OK — no alert sent.');
        return;
    }

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
    });

    console.log('✅ Telegram alert sent!');
};
