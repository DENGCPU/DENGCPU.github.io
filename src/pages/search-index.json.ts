import type { APIRoute } from 'astro';
import { channelById, formatDate, getPosts, postHref, postTitle } from '../lib/posts';
import { markdownToSearchText } from '../lib/search-text';

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const index = posts
    .filter((post) => !post.data.private)
    .map((post) => ({
      title: postTitle(post),
      summary: post.data.summary ?? '',
      channel: channelById(post.data.channel)?.title ?? '',
      series: post.data.series ?? '',
      date: formatDate(post.data.date),
      href: postHref(post),
      body: markdownToSearchText(post.body ?? ''),
    }));
  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};