import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { channelIds } from './data/channels';

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.replace(/\.md$/u, ''),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    channel: z.enum(channelIds),
    series: z.string().optional(),
    summary: z.string().optional(),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string().optional(),
    date: z.coerce.date().optional(),
    stack: z.array(z.string()).default([]),
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts, work };
