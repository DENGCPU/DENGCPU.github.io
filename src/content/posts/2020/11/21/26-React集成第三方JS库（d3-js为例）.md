---
title: "26-React集成第三方JS库（d3.js为例）"
date: 2020-11-21T20:08:00
channel: frontend
series: "极客时间 React"
summary: "1、使用ref获取原生DOM节点引用2、手动将组件状态更新到DOM节点3、组件销毁时移除原生节点DOM事件"
---

#### 集成第三方JS库的技术要点：

1、使用ref获取原生DOM节点引用  
2、手动将组件状态更新到DOM节点  
3、组件销毁时移除原生节点DOM事件

d3.js用来画图形的第三方库，操作原生DOM节点，也是以数据驱动（与React非常吻合）。
