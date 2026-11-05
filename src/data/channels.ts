export const channelIds = ['frontend', 'ai', 'books', 'life', 'other'] as const;

export type ChannelId = (typeof channelIds)[number];

export const channels: {
  id: ChannelId;
  title: string;
  description: string;
}[] = [
  {
    id: 'frontend',
    title: '前端学习',
    description: '课程笔记、面试题，和当时正在弄懂的前端问题。',
  },
  {
    id: 'ai',
    title: 'AI',
    description: '使用和理解模型时留下的记录。',
  },
  {
    id: 'books',
    title: '书籍',
    description: '读完或读到一半，值得写下来的书。',
  },
  {
    id: 'life',
    title: '生活',
    description: '工作之外，仍然想记住的事。',
  },
  {
    id: 'other',
    title: '其他',
    description: '工具、灵感，和暂时放不下的东西。',
  },
];

export const seriesOrder = [
  '极客时间 React',
  'React 面试',
  'CSS',
  'React',
  'JS',
  'HTML',
  'npm',
  'bug',
];
