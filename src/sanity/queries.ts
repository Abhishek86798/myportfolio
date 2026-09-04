import { groq } from 'next-sanity'

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] {
  currentlyBuilding,
  "resumeUrl": resumeFile.asset->url
}`

export const journeyQuery = groq`*[_type == "journey"] | order(order asc) {
  _id,
  year,
  period,
  title,
  summary,
  detail,
  tags,
  current,
  link {
    label,
    href
  }
}`

export const experienceQuery = groq`*[_type == "experience" && defined(company)] | order(order asc) {
  _id,
  company,
  role,
  duration,
  current,
  description,
  tags,
  metrics[] {
    value,
    label
  }
}`

export const skillsQuery = groq`*[_type == "skill"] | order(order asc) {
  _id,
  category,
  usage,
  skills[] {
    name,
    iconString,
    context
  }
}`

export const projectsQuery = groq`*[_type == "project"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  buildType,
  description,
  liveUrl,
  githubUrl,
  tags,
  featured,
  metrics[] {
    value,
    label
  },
  "image": images[0],
  content
}`

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  buildType,
  description,
  liveUrl,
  githubUrl,
  tags,
  featured,
  metrics[] {
    value,
    label
  },
  "images": images[],
  content
}`

