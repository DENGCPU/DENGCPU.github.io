import { getCollection, type CollectionEntry } from 'astro:content';
import { channels, seriesOrder, type ChannelId } from '../data/channels';

export type Post = CollectionEntry<'posts'>;
export type Work = CollectionEntry<'work'>;

export function channelById(id: string) {
  return channels.find((channel) => channel.id === id);
}

export async function getPosts() {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getWorks() {
  const works = await getCollection('work');
  return works.sort((a, b) => {
    const aTime = a.data.date?.valueOf() ?? 0;
    const bTime = b.data.date?.valueOf() ?? 0;
    return bTime - aTime;
  });
}

export function countByChannel(posts: Post[]) {
  const counts = new Map<ChannelId, number>();
  for (const channel of channels) counts.set(channel.id, 0);
  for (const post of posts) {
    counts.set(post.data.channel, (counts.get(post.data.channel) ?? 0) + 1);
  }
  return counts;
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function postHref(post: Post) {
  return `/${post.id}/`;
}

export function seriesAnchor(name: string) {
  return name.replace(/\s+/g, '-');
}

export function seriesGroups(posts: Post[]) {
  const groups = new Map<string, Post[]>();
  for (const post of posts) {
    const name = post.data.series ?? '未归系列';
    const list = groups.get(name);
    if (list) list.push(post);
    else groups.set(name, [post]);
  }
  for (const list of groups.values()) {
    list.sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
  }
  const names = [
    ...seriesOrder.filter((name) => groups.has(name)),
    ...[...groups.keys()].filter((name) => !seriesOrder.includes(name)),
  ];
  return names.map((name) => ({ name, posts: groups.get(name) ?? [] }));
}

export function seriesNeighbors(posts: Post[], current: Post) {
  const pool = current.data.series
    ? posts.filter((post) => post.data.series === current.data.series)
    : posts.filter((post) => post.data.channel === current.data.channel && !post.data.series);
  const ordered = [...pool].sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
  const index = ordered.findIndex((post) => post.id === current.id);
  return {
    previous: index > 0 ? ordered[index - 1] : undefined,
    next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : undefined,
  };
}
