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
<<<<<<< HEAD
=======
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
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
  },

}
