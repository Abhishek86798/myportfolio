import { groq } from 'next-sanity'

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] {
  currentlyBuilding,
  "resumeUrl": resumeFile.asset->url
}`

export const aboutQuery = groq`*[_type == "about"][0] {
  _id,
  headline,
  narrative,
  principles[] {
    title,
    tag,
    description
  },
  currentFocus
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

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  "date": publishedAt,
  "description": excerpt,
  tags,
  canonical,
  "cover": coverImage.asset->url,
  body
}`

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  "date": publishedAt,
  "description": excerpt,
  tags,
  canonical,
  "cover": coverImage.asset->url,
  body
}`
