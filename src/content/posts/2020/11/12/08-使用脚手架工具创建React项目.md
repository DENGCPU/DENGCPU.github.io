---
title: "08-使用脚手架工具创建React项目"
date: 2020-11-12T16:01:00
channel: frontend
series: "极客时间 React"
summary: "项目越来越复杂，需要用："
---

### 1.为什么需要脚手架？

![](https://i.bmp.ovh/imgs/2020/11/1df974a0ce1a7435.png)  
项目越来越复杂，需要用：

-   react: 做UI，
    
-   redux: 做状态管理，
    
-   react-router: 做路由管理
    
-   babel: 把js新特性翻译为浏览器可以识别的旧语法
    
-   webpack: 打包
    
-   eslint: 用于语法检查  
    …  
    ![](https://i.bmp.ovh/imgs/2020/11/611411d14c00f1a4.png)
    
     这些工具背后需要很多的package,我们需要了解每一个package的配置和使用，这使得创建项目非常繁琐。而创建一个项目的过程大致是差不多的，完全可以抽象出来做成一个工具  
     ===>所以，脚手架应运而生。
    

### 2.常见的用于创建React应用的脚手架工具：

-   **Create React APP**  
    ![](https://i.bmp.ovh/imgs/2020/11/6a1c377349d0f209.png)  
      facebook 官方推出的，使用了最简策略，用于学习或创建简单的react项目
    
-   **Rekit**  
    ![](https://i.bmp.ovh/imgs/2020/11/57aaa6b41498f44a.png)
    
     基于create-react-app,提供了更多的功能，可以开发大型的项目。
    
-   **Codesandbox**  
    ![](https://i.bmp.ovh/imgs/2020/11/c18cd49b5e89621e.png)  
      Online,在线的创建项目，webpack运行在浏览器端,大大提高打包速度。支持react,vue,angular
