import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    hideAPIURL : true
  },
  access : {
    create : () => true,
    read : () => true
  },
  auth: true,
  endpoints : [],
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
  ],
}
