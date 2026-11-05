---
title: "bug记录"
date: 2020-11-18T10:39:00
channel: frontend
series: "bug"
summary: "在redux的练习中，blog这个demo报了这个错："
---

### 1、 Error: “Objects are not valid as a React child”

在redux的练习中，blog这个demo报了这个错：

![](https://pic.downk.cc/item/5fb48937b18d62711347d6df.jpg)

原代码：

```js
const response = await jsonPlaceholder.get(`/users/${id}`);
dispatch({ type: "FETCH_USER", payload: response.data });
```

打开访问的API后发现，response.data是个object类型，不能直接赋值给payload  
应该先通过JSON.stringify()将其转换为JSON格式，再进行赋值。

修改后的代码如下：

```js
const response = await jsonPlaceholder.get(`/users/${id}`);
const data = JSON.stringify(response.data);
dispatch({ type: "FETCH_USER", payload: data });
```
