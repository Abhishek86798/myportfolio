import { defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Global Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'currentlyBuilding',
      title: 'Currently Building Badge Text',
      type: 'string',
      description: 'The text that appears in the top badge of the Hero section.',
      initialValue: 'Currently Building — Zero-Trust Security Gateway',
    }),
    defineField({
      name: 'resumeFile',
      title: 'Resume PDF',
      type: 'file',
      options: { accept: 'application/pdf' },
      description: 'Upload your latest resume PDF here.',
    }),
  ],
})
