import axios from 'axios';
import { collectAllMetrics } from './getAllAPIUsageSummary';
import { TELEGRAM_CHAT_ID, TELEGRAM_TOKEN } from '@/config/apiConfig';

export const sendTelegramReport = async () => {
    const message = await collectAllMetrics();

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
    });

    console.log('✅ Telegram alert sent!');
};
