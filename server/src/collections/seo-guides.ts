import { CollectionConfig } from 'payload';

export const SeoGuides: CollectionConfig = {
    slug: 'seo-guides',
    admin: {
        useAsTitle: 'query',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'project',
            type: 'relationship',
            relationTo: 'projects',
            required: true,
        },
        {
            name: 'query',
            type: 'text',
            required: true,
        },
        {
            name: 'queryID',
            type: 'text', // or 'number' if you never use strings
            required: true,
        },
        {
            name: 'queryEngine',
            type: 'text',
        },
        {
            name: 'language',
            type: 'text',
        },
        {
            name: 'gl',
            type: 'text',
        },
        {
            name: 'createdBy',
            type: 'text',
        },
        {
            name: 'createdAt',
            type: 'number',
        },
        {
            name: 'category',
            type: 'text',
        },
        {
            name: 'soseo',
            type: 'number',
        },
        {
            name: 'dseo',
            type: 'number',
        },
        {
            name: 'monitoringUrl',
            type: 'text',
        },
        {
            name: 'relatedSEOKeywords',
            type: 'array',
            fields: [
                {
                    name: 'keyword',
                    type: 'text',
                },
            ],
        },
        {
            name: 'PAAs',
            type: 'array',
            fields: [
                {
                    name: 'question',
                    type: 'text',
                },
            ],
        },
        {
            name: 'optimizationLevels',
            type: 'array',
            fields: [
                {
                    name: 'keyword',
                    type: 'text',
                },
                {
                    name: 'urlOptimizations',
                    type: 'group',
                    fields: [
                        {
                            name: 'entries',
                            type: 'array',
                            fields: [
                                { name: 'url', type: 'text' },
                                { name: 'score', type: 'number' },
                            ],
                        },
                    ],
                },
                {
                    name: 'optimizationRanges',
                    type: 'group',
                    fields: [
                        { name: 'name', type: 'text' },
                        { name: 'subOptimized', type: 'number' },
                        { name: 'standardOptimized', type: 'number' },
                        { name: 'strongOptimized', type: 'number' },
                        { name: 'overOptimized', type: 'number' },
                    ],
                },
            ],
        },
        {
            name: 'searchResults',
            type: 'array',
            fields: [
                { name: 'title', type: 'text' },
                { name: 'link', type: 'text' },
                { name: 'wordCount', type: 'number' },
                { name: 'soseo', type: 'number' },
                { name: 'dseo', type: 'number' },
                { name: 'categories', type: 'array', fields: [{ name: 'value', type: 'text' }] },
                { name: 'presenceCount', type: 'number' },
            ],
        },
        {
            name: 'cronjob',
            type: 'array',
            fields: [
                { name: 'url', type: 'text' },
                {
                    name: 'positions',
                    type: 'array',
                    fields: [
                        { name: 'date', type: 'date' },
                        { name: 'position', type: 'number' },
                    ],
                },
            ],
        },
        {
            name: 'seoBrief',
            type: 'group',
            fields: [
                { name: 'primaryIntent', type: 'text' },
                {
                    name: 'objective',
                    type: 'array',
                    fields: [{ name: 'value', type: 'text' }],
                },
                {
                    name: 'mainTopics',
                    type: 'array',
                    fields: [{ name: 'value', type: 'text' }],
                },
                {
                    name: 'importantQuestions',
                    type: 'array',
                    fields: [{ name: 'value', type: 'text' }],
                },
                {
                    name: 'writingStyleAndTone',
                    type: 'array',
                    fields: [{ name: 'value', type: 'text' }],
                },
                {
                    name: 'recommendedStyle',
                    type: 'array',
                    fields: [{ name: 'value', type: 'text' }],
                },
                {
                    name: 'valueProposition',
                    type: 'array',
                    fields: [{ name: 'value', type: 'text' }],
                },
            ],
        },
        {
            name: 'briefVerification',
            type: 'group',
            fields: [
                {
                    name: 'verificationResult',
                    type: 'group',
                    fields: [
                    {
                        name: 'objective',
                        type: 'text',
                    },
                    {
                        name: 'mainTopics',
                        type: 'array',
                        fields: [
                            { name: 'item', type: 'text' },
                            { name: 'status', type: 'text' },
                        ],
                    },
                    {
                        name: 'importantQuestions',
                        type: 'array',
                        fields: [
                        { name: 'item', type: 'text' },
                        { name: 'status', type: 'text' },
                        ],
                    },
                    {
                        name: 'writingStyleAndTone',
                        type: 'array',
                        fields: [
                        { name: 'item', type: 'text' },
                        { name: 'status', type: 'text' },
                        ],
                    },
                    {
                        name: 'recommendedStyle',
                        type: 'array',
                        fields: [
                        { name: 'item', type: 'text' },
                        { name: 'status', type: 'text' },
                        ],
                    },
                    {
                        name: 'valueProposition',
                        type: 'array',
                        fields: [
                        { name: 'item', type: 'text' },
                        { name: 'status', type: 'text' },
                        ],
                    },
                    ],
                },
                {
                    name: 'improvementText',
                    type: 'textarea',
                },
                {
                    name: 'verifiedAt',
                    type: 'date',
                },
            ],
        },
        {
            name: 'graphLineData',
            type: 'array',
            fields: [
                {
                    name: 'name',
                    type: 'text',
                },
                {
                    name: 'data',
                    type: 'array',
                    fields: [
                        {
                            name: 'name',
                            type: 'text',
                        },
                        {
                            name: 'value',
                            type: 'number',
                        },
                    ],
                },
            ],
        },
        {
            name: 'socialPost',
            type: 'array',
            fields: [
                { name: 'socialMedia', type: 'text' },
                { name: 'tone', type: 'text' },
                { name: 'language', type: 'text' },
                { name: 'text', type: 'textarea' },
            ],
        },
        {
            name: 'webpageTitleMeta',
            type: 'array',
            fields: [{ name: 'value', type: 'textarea' }],
        },
        {
            name: 'seoEditor',
            type: 'json',
        },
    ],
};
