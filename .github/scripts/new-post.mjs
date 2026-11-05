import fs from 'node:fs';
import path from 'node:path';

const channels = {
  前端学习: 'frontend',
  AI: 'ai',
  书籍: 'books',
  生活: 'life',
  其他: 'other',
  frontend: 'frontend',
  ai: 'ai',
  books: 'books',
  life: 'life',
  other: 'other',
};

const body = process.env.ISSUE_BODY ?? '';
const fields = parseIssue(body);
const title = cleanLine(fields['标题']);
const channelName = cleanLine(fields['大类']);
const series = empty(fields['系列']);
const summary = empty(fields['摘要']);
const content = (fields['正文'] ?? '').replace(/\r\n/g, '\n').trim();
const channel = channels[channelName];

if (!title) throw new Error('缺少标题');
if (!channel) throw new Error(`大类无法识别：${channelName || '空'}`);
if (!content) throw new Error('缺少正文');

const stamp = shanghaiStamp();
const [year, month, day] = stamp.day.split('-');
const fileName = `${safeName(title)}.md`;
const postsRoot = path.join(process.cwd(), 'src/content/posts', year, month, day);
const filePath = uniquePath(path.join(postsRoot, fileName));
const relativePath = path.relative(process.cwd(), filePath);
const markdown = render({ title, channel, series, summary, content, iso: stamp.iso });
const url = `https://dengcpu.github.io/${relativePath
  .replace(/^src\/content\/posts\//, '')
  .replace(/\.md$/, '')}/`;

if (process.env.DRY_RUN === '1') {
  console.log(relativePath);
  console.log(url);
  console.log(markdown);
} else {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, markdown);
}

const output = process.env.GITHUB_OUTPUT;
if (output) {
  fs.appendFileSync(output, `path=${relativePath}\nurl=${url}\n`);
}

function parseIssue(text) {
  const result = {};
  const parts = text.replace(/\r\n/g, '\n').split(/^### /m).slice(1);
  for (const part of parts) {
    const breakAt = part.indexOf('\n');
    const name = (breakAt === -1 ? part : part.slice(0, breakAt)).trim();
    const value = breakAt === -1 ? '' : part.slice(breakAt + 1).trim();
    result[name] = value;
  }
  return result;
}

function cleanLine(value) {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function empty(value) {
  const text = cleanLine(value);
  if (!text || text === '_No response_' || text === '无') return '';
  return text;
}

function safeName(value) {
  const name = value
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\.+/g, '')
    .slice(0, 80)
    .trim();
  if (!name || name === '.' || name === '..') throw new Error('标题不能作为文件名');
  return name;
}

function uniquePath(filePath) {
  if (!fs.existsSync(filePath)) return filePath;
  const extension = path.extname(filePath);
  const base = filePath.slice(0, -extension.length);
  let index = 2;
  while (fs.existsSync(`${base}-${index}${extension}`)) index += 1;
  return `${base}-${index}${extension}`;
}

function yamlString(value) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function render({ title, channel, series, summary, content, iso }) {
  const lines = ['---', `title: ${yamlString(title)}`, `date: ${iso}`, `channel: ${channel}`];
  if (series) lines.push(`series: ${yamlString(series)}`);
  if (summary) lines.push(`summary: ${yamlString(summary)}`);
  lines.push('---', '', content, '');
  return lines.join('\n');
}

function shanghaiStamp(date = new Date()) {
  const text = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Shanghai',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
  const [day, time] = text.split(' ');
  return { day, time, iso: `${day}T${time}` };
}
