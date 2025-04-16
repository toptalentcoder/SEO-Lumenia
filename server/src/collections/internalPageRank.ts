import type { CollectionConfig } from 'payload';

export const InternalPageRanks: CollectionConfig = {
    slug: 'internalPageRanks',
    admin: {
        useAsTitle: 'baseUrl',
    },
    access: {
        read: () => true,
        create: () => true,
        update: () => true,
    },
    fields: [
        {
            name: 'baseUrl',
            type: 'text',
            required: true,
            unique: true,
        },
        {
            name: 'scores',
            type: 'array',
            fields: [
                {
                    name: 'url',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'score',
                    type: 'number',
                    required: true,
                },
            ],
        },
        {
            name: 'lastCrawledAt',
            type: 'date',
            required: true,
        },
    ],
};
