import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'createdAt'],
    description: 'User accounts and authentication',
  },
  access: {
    create: () => true, // Keep this for registration
    read: () => true,
    update: ({ req, id }) => {
      if (!req.user) return false;
      return req.user.role === 'admin' || req.user.id === id;
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  auth: {
    tokenExpiration: 7200, // 2 hours
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minutes
  },
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
      minLength: 3,
      maxLength: 30,
      unique: true,
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'profileImageURL',
      label: 'Google Account Image',
      type: 'text',
      required: false,
    },
    {
      name: 'googleId',
      type: 'text',
      required: false,
      unique: true,
    },
    {
      name: 'subscriptionPlan',
      type: 'relationship',
      relationTo: 'billing_plan',
      admin: { position: 'sidebar' },
      filterOptions: {
        category: {
          equals: 'subscription',
        },
      },
    },
    {
      name: 'apiPlan',
      type: 'relationship',
      relationTo: 'billing_plan',
      admin: { position: 'sidebar' },
      filterOptions: {
        category: {
          equals: 'api',
        },
      },
    },
    {
      name: 'paypalSubscriptionExpiresAt',
      type: 'date',
      admin: { position: 'sidebar', hidden: true },
    },
    {
      name: 'availableFeatures',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: "tokens", type: "number", label: "Tokens", min: 0 },
        { name: "ai_tokens", type: "number", label: "AI Tokens", min: 0 },
        { name: "seats", type: "number", label: "Seats", min: 0 },
        { name: "guests", type: "number", label: "Guests", min: 0 },
        { name: "monitoring", type: "number", label: "Monitoring", min: 0 },
      ]
    },
  ],
  hooks: {
    afterLogin: [
      async ({ user }) => {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          profilePicture: user.profilePicture,
          profileImageURL: user.profileImageURL,
          role: user.role,
          subscriptionPlan: user.subscriptionPlan,
          apiPlan: user.apiPlan,
          availableFeatures: user.availableFeatures,
        };
      }
    ]
  },
}
