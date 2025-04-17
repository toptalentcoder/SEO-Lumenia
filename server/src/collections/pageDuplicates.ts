// src/collections/PageDuplicates.ts
import type { CollectionConfig } from 'payload';

export const PageDuplicates: CollectionConfig = {
    slug: 'page-duplicates',
    admin: {
        useAsTitle: 'baseUrl',
        defaultColumns: ['baseUrl', 'analyzedAt'],
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
            name: 'duplicates',
            type: 'array',
            required: true,
            fields: [
                { name: 'urlA', type: 'text', required: true },
                { name: 'urlB', type: 'text', required: true },
                { name: 'score', type: 'number', required: true, min: 0, max: 100 },
                {
                    name: 'status',
                    type: 'select',
                    required: true,
                    options: [
                        { label: 'Perfect', value: 'Perfect' },
                        { label: 'OK', value: 'OK' },
                        { label: 'Danger', value: 'Danger' },
                    ],
                },
            ],
        },
        {
            name: 'analyzedAt',
            type: 'date',
            required: true,
        },
    ],
};
