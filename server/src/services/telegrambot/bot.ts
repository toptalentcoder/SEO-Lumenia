import { Telegraf } from 'telegraf';
import { Payload } from 'payload';
import { TELEGRAM_TOKEN } from '@/config/apiConfig';

export const createTelegramBot = (payload: Payload) => {
    
    console.log('🔑 Telegram Token starts with:', TELEGRAM_TOKEN?.slice(0, 10));
    if (!TELEGRAM_TOKEN || !/^(\d+):[A-Za-z0-9_-]+$/.test(TELEGRAM_TOKEN)) {
        throw new Error('❌ TELEGRAM_TOKEN is missing or invalid');
    }

    const bot = new Telegraf(TELEGRAM_TOKEN);

    bot.start(async (ctx) => {
        const chatId = ctx.chat.id.toString();
        const username = ctx.from?.username || '';
        const firstName = ctx.from?.first_name || '';
        const lastName = ctx.from?.last_name || '';

        try {
            const existing = await payload.find({
                collection: 'telegram-users',
                where: { chatId: { equals: chatId } },
                limit: 1,
            });

            if (!existing.docs.length) {
                await payload.create({
                    collection: 'telegram-users',
                    data: { chatId, username, firstName, lastName },
                });
            }

            await ctx.reply('✅ You are now subscribed to API metric updates!');
        } catch (err) {
            console.error('❌ Failed to save Telegram user:', err);
            await ctx.reply('⚠️ An error occurred while subscribing.');
        }
    });

    bot.command('stop', async (ctx) => {
        const chatId = ctx.chat.id.toString();

        try {
            await payload.delete({
                collection: 'telegram-users',
                where: { chatId: { equals: chatId } },
            });

            await ctx.reply('🚫 You have been unsubscribed.');
        } catch (err) {
            console.error('❌ Failed to unsubscribe:', err);
            await ctx.reply('⚠️ Failed to unsubscribe.');
        }
    });

    bot.catch((err, ctx) => {
        console.error('❌ Telegraf error:', err);
    });

    return bot;
};
