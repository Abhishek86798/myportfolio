import { defineArrayMember, defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Post Title',
      type: 'string',
      description: 'The main headline of your article',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug / URL',
      type: 'slug',
      description: 'URL address identifier (e.g. "my-first-post")',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Excerpt / Summary',
      type: 'text',
      rows: 3,
      description: 'Brief 1-2 sentence preview shown on the blog index and SEO meta tags',
      validation: (rule) => rule.required().max(260),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Main feature graphic shown at the top of the article',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Accessibility description for screen readers',
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional image credit or caption',
        }),
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags / Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL (Optional)',
      type: 'url',
      description: 'If this was originally published elsewhere (e.g. Medium or Dev.to), link it here for SEO.',
    }),
    defineField({
      name: 'body',
      title: 'Article Body (Medium-Style Rich Text)',
      type: 'array',
      of: [
        // 1. Text block with formatting, headings, bullet/number lists, and hyperlinks
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2 (H2)', value: 'h2' },
            { title: 'Heading 3 (H3)', value: 'h3' },
            { title: 'Heading 4 (H4)', value: 'h4' },
            { title: 'Quote Block', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet List', value: 'bullet' },
            { title: 'Numbered List', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Code', value: 'code' },
              { title: 'Underline', value: 'underline' },
              { title: 'Strike', value: 'strike-through' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Hyperlink',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'Target URL',
                    type: 'url',
                    validation: (rule) =>
                      rule.uri({
                        allowRelative: true,
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  }),
                  defineField({
                    name: 'openInNewTab',
                    title: 'Open in new tab',
                    type: 'boolean',
                    initialValue: true,
                  }),
                ],
              },
            ],
          },
        }),

        // 2. Inline Image block with caption, alt text & hotspot
        defineArrayMember({
          name: 'image',
          title: 'Inline Image',
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Important for screen readers and SEO',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Caption displayed underneath the image',
            }),
          ],
        }),

        // 3. Code block with language dropdown and filename
        defineArrayMember({
          name: 'codeBlock',
          title: 'Code Block',
          type: 'object',
          fields: [
            defineField({
              name: 'language',
              title: 'Language',
              type: 'string',
              options: {
                list: [
                  { title: 'TypeScript', value: 'typescript' },
                  { title: 'JavaScript', value: 'javascript' },
                  { title: 'Python', value: 'python' },
                  { title: 'Bash / Shell', value: 'bash' },
                  { title: 'JSON', value: 'json' },
                  { title: 'SQL', value: 'sql' },
                  { title: 'Go', value: 'go' },
                  { title: 'Rust', value: 'rust' },
                  { title: 'HTML', value: 'html' },
                  { title: 'CSS', value: 'css' },
                  { title: 'YAML', value: 'yaml' },
                  { title: 'Markdown', value: 'markdown' },
                  { title: 'Plain Text', value: 'plaintext' },
                ],
              },
              initialValue: 'typescript',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'filename',
              title: 'Filename / Tab Label (Optional)',
              type: 'string',
              description: 'e.g. src/auth.ts or deploy.sh',
            }),
            defineField({
              name: 'code',
              title: 'Code Snippet',
              type: 'text',
              rows: 8,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'filename',
              subtitle: 'language',
              code: 'code',
            },
            prepare({ title, subtitle, code }) {
              return {
                title: title || `${(subtitle || 'code').toUpperCase()} Snippet`,
                subtitle: code
                  ? code.length > 60
                    ? code.slice(0, 60) + '...'
                    : code
                  : '',
              }
            },
          },
        }),

        // 4. Callout / Alert card (Tip, Warning, Info, Quote)
        defineArrayMember({
          name: 'callout',
          title: 'Callout Box',
          type: 'object',
          fields: [
            defineField({
              name: 'tone',
              title: 'Tone',
              type: 'string',
              options: {
                list: [
                  { title: 'Info (Blue)', value: 'info' },
                  { title: 'Tip (Green / Emerald)', value: 'tip' },
                  { title: 'Warning (Amber)', value: 'warning' },
                  { title: 'Quote / Accent (Purple)', value: 'quote' },
                ],
              },
              initialValue: 'info',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Callout Title (Optional)',
              type: 'string',
              description: 'e.g. "Pro Tip", "Important Security Warning"',
            }),
            defineField({
              name: 'text',
              title: 'Message',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'text',
              tone: 'tone',
            },
            prepare({ title, subtitle, tone }) {
              return {
                title: title || `[${(tone || 'info').toUpperCase()}] Callout`,
                subtitle: subtitle
                  ? subtitle.length > 60
                    ? subtitle.slice(0, 60) + '...'
                    : subtitle
                  : '',
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'coverImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : 'Draft',
        media,
      }
    },
  },
})
