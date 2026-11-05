# DorothyJay

个人站点。首页介绍自己，文章按大类存放，旧的前端笔记都在「前端学习」里。

## 本地

```bash
npm install
npm run dev
```

## 写一篇文章

在 `src/content/posts/` 新增 Markdown。旧文的链接沿用原来的日期路径，新文也可以自定路径。

```md
---
title: "标题"
date: 2026-11-05T10:00:00
channel: ai
summary: "一句话摘要"
---
```

`channel` 目前是 `frontend`、`ai`、`books`、`life`、`other`。前端学习的旧分类写在 `series` 里。

## 加一个大类

改 `src/data/channels.ts` 里的 `channelIds` 和 `channels`。导航不用动，大类会出现在首页和文章页的筛选里。

## 加一个作品

在 `src/content/work/` 放一篇 Markdown。没有作品时，首页不显示作品区。

```md
---
title: "项目名"
summary: "一句话"
role: "你做了什么"
stack: ["TypeScript"]
url: "https://example.com"
repo: "https://github.com/example/project"
featured: true
---
```

首页的介绍、关于页的句子在 `src/data/site.ts`。

## 从手机写文章

打开网站里的「新文章」：https://dengcpu.github.io/write/

第一次要把一个只属于这个仓库的 GitHub 令牌贴进去，它只保存在这台手机上。之后填写标题和正文，点发布就会自动出现在网站上。

改已经发布的文章：打开那篇文章，点日期旁边的「修改」。

也可以继续用 GitHub issue：https://github.com/DENGCPU/DENGCPU.github.io/issues/new?template=new-post.yml

## 部署

提交到 `master` 之后，GitHub Actions 会安装依赖、构建并发布。不需要再提交 `dist`。

仓库的 Pages 来源是 **GitHub Actions**。
