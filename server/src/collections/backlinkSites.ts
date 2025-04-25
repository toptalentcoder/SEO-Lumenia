import { CollectionConfig } from 'payload';

export const BacklinkSites: CollectionConfig = {
  slug: 'backlink-sites',
  admin: {
    useAsTitle: 'domain',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'domain',
      type: 'text',
      required: true,
      unique : true
    },
    {
      name: 'searchHistory',
      type: 'array',
      fields: [
        {
          name: 'userEmail',
          type: 'text',
          required: true,
        },
        {
          name: 'searchedAt',
          type: 'date',
          required: true,
        },
        {
          name: 'backlinks',
          type: 'array',
          fields: [
            {
              name: 'sourceUrl',
              type: 'text',
              required: true,
            },
            {
              name: 'targetUrl',
              type: 'text',
              required: true,
            },
            {
              name: 'authorityScore',
              type: 'text',
              required: true,
            },
            {
              name: 'linkStrength',
              type: 'number',
              required: true,
            },
            {
              name: 'anchorText',
              type: 'text',
              required: true,
            },
            {
              name: 'followType',
              type: 'select',
              options: ['dofollow', 'nofollow'],
              required: true,
            },
          ],
        },
      ],
    },
  ]
};
