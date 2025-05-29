// payload.config.ts
import { CollectionConfig } from 'payload';

export const ApiThresholds: CollectionConfig = {
    slug: 'api-thresholds',
    access: { read: () => true, update: () => true },
    fields: [
        {
            name: 'provider',
            type: 'select',
            required: true,
            options: ['azure', 'semrush', 'serpapi', 'serper'],
        },
        {
            name: 'threshold',
            type: 'number',
            required: true,
        },
        {
            name: 'type',
            type: 'select',
            required: true,
            defaultValue: 'percent',
            options: [
                { label: 'Percentage', value: 'percent' },
                { label: 'Absolute Value', value: 'absolute' },
            ],
        },
    ],
};
