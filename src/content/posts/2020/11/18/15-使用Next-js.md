---
title: "15-使用Next.js"
date: 2020-11-18T13:53:00
channel: frontend
series: "极客时间 React"
summary: "使用next.js开发React项目的同构应用。"
---

使用next.js开发React项目的同构应用。

### 一、什么是同构应用？

![](https://pic.downk.cc/item/5fb4b6adb18d62711350daf9.jpg)

next.js可以自动配置好同构应用的webpack配置等细节。

### 二、next的基本用法

![](https://pic.downk.cc/item/5fb4b787b18d62711350fce5.jpg)

**在页面中使用其他的React组件：**

1、页面也是标准的node模块，可使用其他的React组件 （放在components目录下面）  
2、页面会针对性打包， 仅包含起引入的组件。

![](https://pic.downk.cc/item/5fb4b95bb18d627113515a13.jpg)

🐖：prefetch并不会预加载服务器端的数据

**关于lazy load:**  
![](https://pic.downk.cc/item/5fb4ba11b18d627113517eef.jpg)
