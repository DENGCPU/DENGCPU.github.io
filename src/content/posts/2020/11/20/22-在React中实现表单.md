---
title: "22-在React中实现表单"
date: 2020-11-20T14:16:00
channel: frontend
series: "极客时间 React"
summary: "1、单纯使用React的方式实现表单"
---

#### 一、实现表单：初始数据、提交和跳转

1、单纯使用React的方式实现表单

![](https://pic.downk.cc/item/5fb76076b18d627113eb2a31.jpg)

🐖：是在form中编辑onSubmit，而不是在button的点击事件里提交，这样即使你点回车也会进行提交（给出错误提示）

可以发现这样实现表单是比较麻烦的！

2、使用UI library实现表单（比如Antd)

具体参照：[Antd-Form表单](https://ant.design/components/form-cn/#header)

3、可以对API进行封装

#### 二、实现表单：错误处理、动态操作表单元素，内容动态加载

以Antd为例：一个demo  
[https://codesandbox.io/s/6n20nrzlxz?file=/src/c29/FormBuilder.js](https://codesandbox.io/s/6n20nrzlxz?file=/src/c29/FormBuilder.js)
