import { CollectionConfig, PayloadRequest } from 'payload';

const BrainstormIdeas: CollectionConfig = {
    slug: 'brainstormIdeas',
    admin: {
        useAsTitle: 'query',
    },
    access: {
        read: ({ req }) => ({
            user: {
                equals: req.user?.id,
            },
        }),
        create: ({ req }) => !!req.user,
        update: () => false,
        delete: () => false,
    },
    endpoints: [
        {
            path: '/me',
            method: 'get',
            handler: async (req : PayloadRequest) : Promise<Response> => {
                try {
                    if (!req.user) {
                        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
                    }

                    const results = await req.payload.find({
                        collection: 'brainstormIdeas',
                        where: {
                            user: {
                                equals: req.user.id,
                            },
                        },
                    });

                    return new Response(JSON.stringify({
                        results
                    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
                } catch (error) {
                    return new Response(JSON.stringify({ error: 'Failed to fetch brainstorm ideas' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
                }
            },
        },
    ],
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users', // Your users collection slug
            required: true,
        },
        {
            name: 'query',
            type: 'text',
            required: true,
        },
        {
            name: 'language',
            type: 'text',
            required: true,
        },
        {
            name: 'ideas',
            type: 'array',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'description',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'keywords',
                    type: 'array',
                    required: true,
                    fields: [
                        {
                            name: 'keyword',
                            type: 'text',
                        },
                    ],
                },
                {
                    name: 'persona',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'outline',
                    type: 'array',
                    required: true,
                    fields: [
                        {
                            name: 'step',
                            type: 'text',
                        },
                    ],
                },
                {
                    name: 'level',
                    type: 'select',
                    options: ['basique', 'avancé', 'expert'],
                    required: true,
                },
            ],
        },
    ],
};

export default BrainstormIdeas;
