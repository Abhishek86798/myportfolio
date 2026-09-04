import { createClient } from 'next-sanity'
import { journey } from '../src/data/journey'
import { projects } from '../src/data/projects'
import { skillGroups } from '../src/data/skills'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function migrate() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('Error: SANITY_API_TOKEN is not set in .env.local')
    process.exit(1)
  }

  console.log('Migrating Skills...')
  for (let i = 0; i < skillGroups.length; i++) {
    const group = skillGroups[i]
    await client.create({
      _type: 'skill',
      category: group.category,
      usage: group.usage,
      order: i,
      skills: group.skills.map((s) => ({
        _key: s.replace(/\s+/g, '-').toLowerCase(),
        name: s,
        iconString: '', // User will manually assign the react-icon string in the studio later
      })),
    })
    console.log(`Created skill category: ${group.category}`)
  }

  console.log('Migrating Journey (Experience)...')
  for (let i = 0; i < journey.length; i++) {
    const item = journey[i]
    await client.create({
      _type: 'experience',
      year: item.year,
      title: item.title,
      summary: item.summary,
      detail: item.detail,
      tags: item.tags || [],
      current: item.current || false,
      order: i,
      link: item.link ? { label: item.link.label, href: item.link.href } : undefined,
    })
    console.log(`Created journey item: ${item.title}`)
  }

  console.log('Migrating Projects...')
  for (const project of projects) {
    await client.create({
      _type: 'project',
      title: project.title,
      slug: { _type: 'slug', current: project.slug },
      buildType: project.metrics?.find((m) => m.label.toLowerCase().includes('solo')) ? 'Solo Build' : 'Team Build',
      description: project.recruiter.overview,
      liveUrl: project.demo,
      githubUrl: project.github,
      tags: project.techStack,
      content: [
        {
          _type: 'block',
          _key: 'b1',
          style: 'normal',
          children: [{ _type: 'span', _key: 's1', text: project.engineer.summary }],
        },
      ],
    })
    console.log(`Created project: ${project.title}`)
  }

  console.log('Migration Complete! 🎉')
}

migrate().catch(console.error)
