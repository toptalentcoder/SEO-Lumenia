import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
  ],
  upload: true,
}
