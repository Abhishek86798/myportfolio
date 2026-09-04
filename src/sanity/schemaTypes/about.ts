import { defineArrayMember, defineField, defineType } from 'sanity'

export const aboutType = defineType({
  name: 'about',
  title: 'About & Philosophy',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline Statement',
      type: 'string',
      description: 'Bold personal engineering headline',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'narrative',
      title: 'Narrative Story (First-Person)',
      type: 'array',
      of: [defineArrayMember({ type: 'text' })],
      description: 'First-person paragraphs explaining your philosophy, background, and focus',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'principles',
      title: 'Engineering Principles / Pillars',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Principle Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'tag',
              title: 'Domain / Tag',
              type: 'string',
              description: 'e.g. "Systems & Sandboxing", "Database Architecture"',
            }),
            defineField({
              name: 'description',
              title: 'Detailed Explanation',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'currentFocus',
      title: 'Current Focus / Status',
      type: 'text',
      rows: 2,
      description: 'Brief note on what you are currently exploring or looking for',
    }),
  ],
})
