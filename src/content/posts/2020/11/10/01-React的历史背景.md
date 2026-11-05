---
title: "01-React的历史背景及特点"
date: 2020-11-10T09:52:00
channel: frontend
series: "极客时间 React"
summary: "传统WebUI存在的问题："
---

### 1\. React 出现的历史背景

#### A.UI方面的——

传统WebUI存在的问题：

-   传统UI关注太多的细节
-   应用程序的状态分散在各处，难以追踪和维护

**\=>** **React的解决方案**：react 始终整体”刷新”页面，无需关心细节。它只判断前后两个状态是否变化，并不关注背后的哪个细节发生了变化。  
![](https://i.bmp.ovh/imgs/2020/11/981310a92f37e99e.png)

#### B.数据方面的——

传统的MVC难以扩展和维护，太多的model和view，关系错综复杂且双向绑定，当出现了问题，很难追踪是model还是view层出现了问题。  
![](https://i.bmp.ovh/imgs/2020/11/0520d5fd55b9ac16.png)

**\=>** **React的解决方案**，提出了单向数据流架构flux.(后面衍生出redux和mobx)  
![](https://i.bmp.ovh/imgs/2020/11/1d93a50d7d4e112b.png)

### 2\. React 的特点：

1个新概念  
4个必须的API  
单向数据流  
完善的错误提示
