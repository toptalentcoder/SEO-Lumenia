import { CollectionConfig } from 'payload';

export const TelegramUsers: CollectionConfig = {
    slug: 'telegram-users',
    admin: {
        useAsTitle: 'username',
    },
    fields: [
        {
            name: 'chatId',
            type: 'text',
            required: true,
            unique: true,
        },
        {
            name: 'username',
            type: 'text',
        },
        {
           name: 'firstName',
            type: 'text',
        },
        {
            name: 'lastName',
            type: 'text',
        },
    ],
};
