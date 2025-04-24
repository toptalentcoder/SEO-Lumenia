import { CollectionConfig } from 'payload';

export const BacklinkSites: CollectionConfig = {
  slug: 'backlink-sites',
  admin: {
    useAsTitle: 'domain',
  },
  fields: [
    {
      name: 'domain',
      type: 'text',
      required: true,
      unique: true,
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
          type: 'number',
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
          options: ['follow', 'nofollow'],
          required: true,
        },
      ],
    },
  ],
};
