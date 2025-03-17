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
  ],
}
