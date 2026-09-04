import { defineField, defineType } from 'sanity'

export const journeyType = defineType({
  name: 'journey',
  title: 'Journey (Learning)',
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'current',
      title: 'Is Current?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'summary',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'detail',
      title: 'Detailed Technical Info (Engineer Mode)',
      type: 'text',
    }),
    defineField({
      name: 'tags',
      title: 'Skills / Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'link',
      type: 'object',
      fields: [
        { name: 'label', type: 'string' },
        { name: 'href', type: 'url' },
      ],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Used to sort the timeline (lowest number appears first)',
    }),
  ],
})
