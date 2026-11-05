---
title: "03-JSX的本质是语法糖"
date: 2020-11-10T15:17:00
channel: frontend
series: "极客时间 React"
summary: "理解 JSX：在 JavaScript 里直接写 HTML 标记。"
---

### 理解JSX

*JSX：在javaScript代码中直接写HTML标记。*

```js
const name='jane'
const element=<h1>hello,{name}</h1>
```

**1.JSX的本质**  
![](https://i.bmp.ovh/imgs/2020/11/5e744edbbade47d2.png)

**2.在JSX中使用表达式**  
![](https://i.bmp.ovh/imgs/2020/11/87d92de0fdbd6f36.png)

**3.JSX的优点**

-   声明创建界面的直观
-   代码动态创建界面的灵活
-   无需学习新的模板语言

**约定：自定义组件首字母大写**  
1.react认为小写的tag是原生DOM节点，如div  
2.大写字母开头的组件是自定义节点  
3.JSX标记可以直接使用属性语法，如<menu.Item />
