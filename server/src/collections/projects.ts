import { CollectionConfig, PayloadRequest } from "payload";

export const Projects : CollectionConfig = {
    slug : 'projects',
    admin : {
        useAsTitle : 'projectID'
    },
    access : {
        read : () => true,
        create : () => true,
        update : () => true
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
                        collection: 'projects',
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
    fields : [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name : 'projectID',
            type : 'number',
            required : true,
        },
        {
            name : 'projectName',
            type : 'text',
            required : true,
        },
        {
            name : 'domainName',
            type : 'text',
            required : false,
        },
        {
            name : 'createdAt',
            type : 'date',
            required : false
        },
    ]
}