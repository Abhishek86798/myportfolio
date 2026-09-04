import { defineField, defineType } from 'sanity'

export const skillType = defineType({
  name: 'skill',
  title: 'Skill Category',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Languages', value: 'Languages' },
          { title: 'Backend', value: 'Backend' },
          { title: 'Tools & Cloud', value: 'Tools & Cloud' },
          { title: 'AI / ML', value: 'AI / ML' },
          { title: 'Systems & Security', value: 'Systems & Security' },
          { title: 'Coursework', value: 'Coursework' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'usage',
      title: 'Detailed Usage (Engineer Mode)',
      type: 'text',
    }),
    defineField({
      name: 'skills',
      title: 'Skills in this category',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name (e.g. Next.js)', type: 'string' },
            { 
              name: 'iconString', 
              title: 'React Icon Identifier (e.g. SiNextdotjs)', 
              type: 'string' 
            },
            {
              name: 'context',
              title: 'Context (Proof of Use)',
              type: 'string',
              description: 'A thin mono note on where you used this skill.',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Order in which this category appears',
    }),
  ],
})
