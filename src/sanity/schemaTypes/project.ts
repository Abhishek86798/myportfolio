import { defineField, defineType } from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'buildType',
      title: 'Build Type',
      type: 'string',
      options: {
        list: [
          { title: 'Solo Build', value: 'Solo Build' },
          { title: 'Team Build', value: 'Team Build' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      description: 'Short summary for the project card',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Detailed Content',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    }),
    defineField({
      name: 'images',
      title: 'Project Screenshots',
      type: 'array',
      of: [{ type: 'image' }],
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics (Hairline Row)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value', type: 'string' },
            { name: 'label', title: 'Label', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      description: 'Turn this on to highlight the project in the main recruiter view',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
})
