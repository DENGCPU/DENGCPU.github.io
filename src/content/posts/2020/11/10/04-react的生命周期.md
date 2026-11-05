---
title: "04-react的生命周期"
date: 2020-11-10T15:47:00
channel: frontend
series: "极客时间 React"
---

### React的生命周期图

![](https://i.bmp.ovh/imgs/2020/11/32b8163f9eadfd47.png)

🐖：mounting到底意味着什么？  
答： When we talk about mounting， we’re talking about the process of converting the virtual components into actual DOM elements that are placed in the DOM by React.（其实就是React将虚拟DOM转化为真实DOM的过程)

**1.constructor:**

-   用于初始化内部状态，很少使用
-   唯一可以直接修改state的地方

**2.getDerivedStateFromProps:**

-   当state需要从props初始化时使用。
-   尽量不要使用：维护两者状态一致性会增加复杂度。
-   每次render都会调用。
-   典型场景：表单控件获取默认值。

**3.componentDidMount:**

-   UI渲染完成后调用
-   只执行一次
-   典型场景：获取外部资源

**4.componeWillUnmout:**

-   组件移除时被调用
-   典型场景：资源释放

**5.getSnapshotBeforeUpdate:**

-   在页面render之前调用，state已经更新
-   典型场景：获取render之前的DOM状态

**6.componentDidUpdate:**

-   每次UI更新时被调用
-   典型场景：页面需要根据props变化重新获取数据

**7.shouldComponentUpdate:**

-   决定Vitual DOM是否重绘
-   一般由PureComponent自动实现
-   典型场景：性能优化
