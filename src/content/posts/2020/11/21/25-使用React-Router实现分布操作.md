---
title: "25-使用React-Router实现分布操作"
date: 2020-11-21T17:18:00
channel: frontend
series: "极客时间 React"
summary: "例子：一个向导页面"
---

#### 向导页面需要考虑的技术要点：

例子：一个向导页面  
![](https://pic.downk.cc/item/5fb8dbeab18d62711350c62f.jpg)

1、使用URL进行导航  
2、表单数据如何管理  
3.页面状态如何切换（根据数据的状态决定UI的状态）

#### 基于路由实现菜单导航：

技术要点：  
1.菜单导航只改变URL状态  
2.根据当前URL显示菜单的当前状态。

可以使用react-router的NavLink,展示当前的选中状态 （NavLink的activeClassName属性）
