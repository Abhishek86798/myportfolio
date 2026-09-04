import { defineField, defineType } from 'sanity'

export const experienceType = defineType({
  name: 'experience',
  title: 'Experience (Internships & Work)',
  type: 'document',
  fields: [
    defineField({
      name: 'company',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'duration',
      type: 'string',
      description: 'e.g., "June 2024 - August 2024"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'current',
      title: 'Is Current?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Job Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'tags',
      title: 'Skills / Tech Used',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'metrics',
      title: 'Impact Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'string' },
            { name: 'label', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Used to sort the experiences',
    }),
  ],
})
