import { startOrRestartTelegramBot } from '@/services/telegrambot/bot';
import { GlobalConfig } from 'payload';

export const telegramTokenSettings: GlobalConfig = {
    slug: 'telegram-token-settings', // The slug determines the API endpoint: /api/globals/site-settings
    label: 'Telegram Token and API Thresold Settings',
    admin : {
        hideAPIURL : true
    },
    access: {
        read: () => true,  // Adjust this to your needs
        update: () => true,  // Adjust this to your needs
    },
    fields: [
        {
            name: 'telegramToken',
            type: 'text',
            label: 'Telegram Bot Token',
            validate: (value: string | string[] | null | undefined) => {
                if (typeof value !== 'string' || !/^(\d+):[A-Za-z0-9_-]+$/.test(value)) {
                    return 'Invalid Telegram Bot Token format. It should look like: 123456789:ABCdefGhIJKlmnoPQRstuVWXyZ';
                }
                return true;
            },
            required: true,
        },
        {
            name: 'azureThreshold',
            type: 'number',
            label: 'Azure Open AI Threshold (Unit is remaining USD - For example: 50 for under $50 remaining)',
            required: true,  // Required field for Azure threshold
        },
        {
            name: 'semrushThreshold',
            type: 'number',
            label: 'SEMrush API Threshold (Units are remaining API credits - For example: 10000 for under 10000 credits remaining)',
            required: true,  // Required field for SEMrush threshold
        },
        {
            name: 'serpapiThreshold',
            type: 'number',
            label: 'SERP API Threshold (Units are remaining number of searches - For example: 300 for under 300 searches remaining)',
            required: true,  // Required field for SERP API threshold
        },
        {
            name: 'serperThreshold',
            type: 'number',
            label: 'Serper.dev Threshold (Units are remaining credits - For example: 300 for under 300 credits remaining)',
            required: true,  // Required field for Serper.dev threshold
        },
    ],
    hooks: {
        afterChange: [
            async ({ previousDoc, req }) => {
                if (previousDoc) {
                    console.log('🔄 Telegram token updated, restarting bot...');
                    // Don't await — restart in background
                    startOrRestartTelegramBot(req.payload).catch(err => {
                        console.error('Failed to restart Telegram bot:', err);
                    });
                }
            }
        ]

    }
};
