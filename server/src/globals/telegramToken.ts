import { GlobalConfig } from 'payload';

export const telegramTokenSettings: GlobalConfig = {
    slug: 'telegram-token-settings', // The slug determines the API endpoint: /api/globals/site-settings
    label: 'Telegram Token Settings',
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
            label: 'telegramToken',
            validate: (value: string | string[] | null | undefined) => {
                if (typeof value !== 'string' || !/^(\d+):[A-Za-z0-9_-]+$/.test(value)) {
                    return 'Invalid Telegram Bot Token format. It should look like: 123456789:ABCdefGhIJKlmnoPQRstuVWXyZ';
                }
                return true;
            },
            required: true,
        },
    ],
};
