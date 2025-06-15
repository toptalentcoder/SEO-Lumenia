import type { CollectionConfig, PayloadRequest } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    hideAPIURL : true
  },
  access : {
    create : () => true,
    read : () => true,
    update: ({ req }) => {
      return !!req.user;
    },
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      access: {
        create: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      name: 'username',
      type: 'text',
      required: false,
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'profileImageURL',
      label : 'Google Account Image',
      type: 'text',
      required: false, // This will store the Google profile image URL
    },
    {
      name: 'googleId',
      type: 'text',
      required: false,
    },
    // Adding the relationships to BillingPlan
    {
      name: 'subscriptionPlan',
      type: 'relationship',
      relationTo: 'billing_plan', // The name of the Billing Plan collection
      admin: { position: 'sidebar' },
      filterOptions: {
        category: {
          equals: 'subscription', // Only include plans with the 'subscription' category
        },
      },
    },
    {
      name: 'apiPlan',
      type: 'relationship',
      relationTo: 'billing_plan', // The name of the Billing Plan collection
      admin: { position: 'sidebar' },
      filterOptions: {
        category: {
          equals: 'api', // Only include plans with the 'subscription' category
        },
      },
    },
    {
      name: 'paypalSubscriptionExpiresAt',
      type: 'text',
      admin: { position: 'sidebar', hidden : true },
    },
    {
      name: 'availableFeatures',
      type: 'group',
      admin: { position: 'sidebar' },
      fields : [
        { name: "tokens", type: "number", label : "Tokens" },
        { name: "ai_tokens", type: "number", label : "AI Tokens" },
        { name: "seats", type: "number", label : "Seats" },
        { name: "guests", type: "number", label : "Guests" },
        { name: "monitoring", type: "number", label : "Monitoring" },
      ]
    },
    {
      name: 'projects',
      type: 'json',
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          const defaultProjectName = "Default";

          const defaultProject = {
            projectID: String(Math.floor(100000 + Math.random() * 900000)),
            projectName: defaultProjectName,
          };

          // Always work with an array
          const existingProjects = Array.isArray(data.projects) ? data.projects : [];

          // Check if default project already exists
          const alreadyHasDefault = existingProjects.some(
            (p: { projectID: string; projectName: string }) => p.projectName === defaultProjectName
          );

          // Only add if it doesn't exist
          if (!alreadyHasDefault) {
            existingProjects.push(defaultProject);
          }

          // Assign back to data
          data.projects = existingProjects;
        }

        return data;
      },
    ],
    afterLogin: [
      async ({ user }) => {
        // Return only selected fields for the login response
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username : user.username,
          profilePicture: user.profilePicture,
          profileImageURL: user.profileImageURL,
          role: user.role,
          subscriptionPlan: user.subscriptionPlan,
          apiPlan: user.apiPlan,
          availableFeatures: user.availableFeatures,
          // Add only safe fields here
        };
      }
    ]
  },
  endpoints: [
    {
      path: '/me',
      method: 'get',
      handler: async (req: PayloadRequest): Promise<Response> => {
        if (!req.user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const fullUser = await req.payload.findByID({
          collection: 'users',
          id: req.user.id,
          depth: 1,
        });

        return new Response(JSON.stringify(fullUser), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      },
    },
    {
      path: '/:id/change-password',
      method: 'post',
      handler: async (req: PayloadRequest): Promise<Response> => {
        const pathParts = req.url?.split('/') || []
        const id = pathParts[pathParts.length - 1]

        const body = typeof req.json === 'function' ? await req.json() : {};
        const newPassword = body.newPassword;

        if (!newPassword || !req.user || req.user.id !== id) {
          return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        try {
          await req.payload.update({
            collection: 'users',
            id,
            data: { password: newPassword },
          });

          return new Response(JSON.stringify({ message: 'Password changed' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (err) {
          return new Response(JSON.stringify({ error: 'Failed to update password' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    },
    {
      path: '/:id/enable-2fa',
      method: 'post',
      handler: async (req: PayloadRequest): Promise<Response> => {
        const pathParts = req.url?.split('/') || []
        const id = pathParts[pathParts.length - 1]
        if (!req.user || req.user.id !== id) {
          return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ message: '2FA enabled (stub)' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      },
    },
  ],

}
