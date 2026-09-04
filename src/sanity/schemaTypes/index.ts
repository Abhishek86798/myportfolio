import { type SchemaTypeDefinition } from 'sanity'
import { journeyType } from './journey'
import { experienceType } from './experience'
import { projectType } from './project'
import { postType } from './post'
import { skillType } from './skill'
import { siteSettingsType } from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [journeyType, experienceType, projectType, postType, skillType, siteSettingsType],
}
