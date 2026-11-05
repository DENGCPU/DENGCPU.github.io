---
title: "05-理解VirtualDOM及key属性的作用"
date: 2020-11-11T09:52:00
channel: frontend
series: "极客时间 React"
summary: "JSX的基础：虚拟DOM"
---

JSX的基础：虚拟DOM

![](https://i.bmp.ovh/imgs/2020/11/6244a9607b4da0d0.png)

![](https://i.bmp.ovh/imgs/2020/11/314414dd61ae46e0.png)

从根节点开始比较，针对不同情况，diff算法有不同的处理方式：

**1\. 属性变化及顺序：**  
![](https://i.bmp.ovh/imgs/2020/11/231a0e379e4ef3a4.png)

\==处理方式==：根据key属性，交换A与B的位置

**2\. 节点类型发生变化：**  
![](https://i.bmp.ovh/imgs/2020/11/c65c14d031817b7e.png)

\==处理方式==：暴力删除F节点（不管他是否在其他地方用到），创建一个新的G节点，append到A节点上。

**3\. 节点跨层级移动：**  
![](https://i.bmp.ovh/imgs/2020/11/06f09ef16c9da001.png)

\==处理方式==：diff算法直接删除左边B下面的D节点（以及其子树），到了右边，React直接创建一个新的D节点。

#### 虚拟DOM的两个假设：

**1、组件的DOM结构是相对稳定的（一般很少出现跨层级移动的情况）**

  跨层级的节点移动，react的diff算法是直接删除。

**2、类型相同的兄弟节点可以被唯一标识（key属性）。**

* * *

### 总结：

-   算法复杂度为O(n)
-   虚拟DOM如何计算diff
-   key属性的作用
