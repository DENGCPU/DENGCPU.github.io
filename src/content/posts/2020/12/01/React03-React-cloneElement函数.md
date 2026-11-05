---
title: "React03-React.cloneElement函数"
date: 2020-12-01T21:20:00
channel: frontend
series: "React"
summary: "这个API以element元素为样板克隆并返回新的React元素。"
---

#### React.cloneElement(element,\[props\],\[…children\])

 这个API以element元素为样板克隆并返回新的React元素。

-   返回元素的props是将新的props与原始元素的props浅层合并后的结果。
-   新的子元素将取代现有的子元素，而来自原始元素的key和ref将被保留。

React.cloneElement() 基本等同于：

```js
<element.type {...element.props}{...props}>{children}</element.type>
```

参考：[React.cloneElement官方文档](https://zh-hans.reactjs.org/docs/react-api.html#cloneelement)
