import { defineArrayMember, defineField, defineType } from 'sanity'

export const aboutType = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'About Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'specLabel',
              title: 'Label / Tag',
              type: 'string',
              description: 'e.g. "Academics", "Focus", "AI & Security", "Status"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Headline / Title',
              type: 'string',
              description: 'e.g. "B.Tech IT + MBA @ IIITM Gwalior"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'meta',
              title: 'Right-side Meta Tag',
              type: 'string',
              description: 'e.g. "2022–2027" or "Go · Python · Postgres"',
            }),
            defineField({
              name: 'description',
              title: 'Crisp Description',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon Keyword (Optional)',
              type: 'string',
              options: {
                list: [
                  { title: 'Graduation Cap', value: 'graduation' },
                  { title: 'Terminal', value: 'terminal' },
                  { title: 'Shield', value: 'shield' },
                  { title: 'Code', value: 'code' },
                  { title: 'Briefcase / Status', value: 'rocket' },
                ],
              },
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'specLabel',
            },
          },
        }),
      ],
    }),
  ],
})
