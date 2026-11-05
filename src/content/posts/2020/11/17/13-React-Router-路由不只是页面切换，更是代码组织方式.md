---
title: "13-React-Router:路由不只是页面切换，更是代码组织方式"
date: 2020-11-17T15:34:00
channel: frontend
series: "极客时间 React"
---

### 一、为什么需要路由？

-   1.单页应用需要进行页面切换
-   2.通过URL可以定位到页面
-   3.更有语义的组织资源

![](https://pic.downk.cc/item/5fb37daab18d62711306e930.jpg)

![](https://pic.downk.cc/item/5fb37e3cb18d6271130703a8.jpg)

### 二、React-Router的特性：

1、声明式路由定义  
2、动态路由：页面render时，path才会被解析

### 三、实现路由的三种方式

1、URL路由  
2、Hash路由： #+ 路径，支持低版本  
3、内存路由：MemoryRouter，服务器端渲染

### 四、基于路由配置进行资源组织

1、实现业务逻辑的松耦合  
2、易于扩展，重构和维护  
3、路由层面实现Lazy Load

### 五、React-Router 的几个API

![](https://pic.downk.cc/item/5fb37fdab18d627113075987.jpg)

![](https://pic.downk.cc/item/5fb37feeb18d627113075f96.jpg)

![](https://pic.downk.cc/item/5fb38003b18d627113076520.jpg)

![](https://pic.downk.cc/item/5fb38032b18d627113076f40.jpg)

![](https://pic.downk.cc/item/5fb38056b18d627113077657.jpg)

![](https://pic.downk.cc/item/5fb380a8b18d627113078667.jpg)

### 六、通过URL传递参数

![](https://pic.downk.cc/item/5fb3827bb18d62711307e56e.jpg)

![](https://pic.downk.cc/item/5fb3834eb18d627113081472.jpg)

![](https://pic.downk.cc/item/5fb3842ab18d627113084eaf.jpg)
