import type { CollectionConfig } from 'payload';

export const PageDuplicates: CollectionConfig = {
    slug: 'page-duplicates',
    admin: {
        useAsTitle: 'urlA',
        defaultColumns: ['baseUrl', 'urlA', 'urlB', 'score', 'status', 'analyzedAt'],
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
        },
        {
            name: 'urlA',
            type: 'text',
            required: true,
        },
        {
            name: 'urlB',
            type: 'text',
            required: true,
        },
        {
            name: 'score',
            type: 'number',
            required: true,
            min: 0,
            max: 100,
        },
        {
            name: 'status',
            type: 'select',
            options: [
                { label: 'Perfect', value: 'Perfect' },
                { label: 'OK', value: 'OK' },
                { label: 'Danger', value: 'Danger' },
            ],
            required: true,
        },
        {
            name: 'analyzedAt',
            type: 'date',
            required: true,
        },
    ],
};
