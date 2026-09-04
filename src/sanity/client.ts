import { createClient, type QueryParams } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
})

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}) {
  const isDev = process.env.NODE_ENV === 'development'
  return client.fetch<QueryResponse>(query, params, {
    next: {
      revalidate: isDev ? 0 : 60,
      tags,
    },
  })
}
