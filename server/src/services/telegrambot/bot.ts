import { Telegraf } from 'telegraf';
import { Payload } from 'payload';

let currentBot: Telegraf | null = null;

export async function startOrRestartTelegramBot(payload: Payload) {
    try {
        // Load token fresh every time
        const globalSettings = await payload.findGlobal({ slug: 'telegram-token-settings' });
        const token = globalSettings?.telegramToken;

        if (!token || !/^(\d+):[A-Za-z0-9_-]+$/.test(token)) {
            console.error('❌ Invalid or missing Telegram token, bot not started.');
            return;
        }

        // If already running, stop the old bot cleanly
        if (currentBot instanceof Telegraf) {
            console.log('⚙️ Stopping existing Telegram bot...');
            await currentBot.stop('SIGINT'); // Send SIGINT to stop the bot gracefully
            currentBot = null;
            await new Promise((res) => setTimeout(res, 2000)); // Wait for cleanup (0.5 seconds)
        }

        console.log('⚙️ Creating new Telegram bot instance...');
        const bot = new Telegraf(token);

        // Register your bot handlers here
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

        console.log('🔧 Deleting webhook...');
        await bot.telegram.deleteWebhook({ drop_pending_updates: true });

        console.log('🚀 Launching bot...');
        await bot.launch({
            dropPendingUpdates: true,
            allowedUpdates: [] // Disables polling updates — use only webhook or no updates
        });

        console.log('🚀 Telegram bot launched with token:', token.slice(0, 10));

        currentBot = bot;
    } catch (err) {
        console.error('❌ Failed to start or restart Telegram bot:', err);
    }
}

// Example of handling process signals for graceful shutdown
process.once('SIGINT', () => {
    if (currentBot) {
        currentBot.stop('SIGINT');
    }
});

process.once('SIGTERM', () => {
    if (currentBot) {
        currentBot.stop('SIGTERM');
    }
});

process.once('SIGUSR2', () => {
    if (currentBot) {
        currentBot.stop('SIGUSR2');
        process.kill(process.pid, 'SIGTERM'); // Allow restart (e.g., nodemon restart)
    }
});
