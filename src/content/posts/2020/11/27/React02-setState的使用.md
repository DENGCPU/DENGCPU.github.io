---
title: "React02-setState的使用"
date: 2020-11-27T15:09:00
channel: frontend
series: "React"
summary: "1、setState()将对组件state的更新排入队列，并通知React需要使用更新后的state重新渲染此组件及其子组件。这是用于更新用户界面以响应事件处理…"
---

### setState(updater, \[callback\])

#### 一、概述

1、setState()将对组件state的更新排入队列，并通知React需要使用更新后的state重新渲染此组件及其子组件。这是用于更新用户界面以响应事件处理器和处理服务器数据的主要方式。

2、**将setState()视为请求而不是立即更新组件的命令**。为了更好的感知性能，React会延迟调用它，然后通过一次传递更新多个组件。React并不会保证state的变更会立即生效。

3、**setState()并不总是立即更新组件，它会批量推迟更新**。这使得在调用setState()后立即读取this.state成为了隐患。为了消除隐患，应当使用componentDidUpdate或者setState的回调函数，这两种方式都可以保证在应用更新后触发。如果需要基于之前的state来设置当前的state，查看关于updater部分的描述。

4、除非shouldComponentUpate()返回false,否则setState()将始终执行重新渲染操作。

#### 二、参数1：updater函数

```js
(state,props) => stateChange
```

其中，state是对应用变化时组件状态的引用，它不应该直接被修改。应当使用基于state和props构建的新对象来表示变化。例如，我们需要使用props.step来增加state：

```js
this.setState((state, props)=>{
    return { counter: state.counter + props.step}
})
```

updater函数中接收的state和props都保证为最新。updater的返回值会与state进行浅合并。

🐖：setState()的第一个参数除了接受函数外，还接受对象类型：

```js
setState(stateChange[,callback])
```

stateChange会将传入的对象浅合并到新的state中，例子：

```js
this.setState({counter: 2})
```

这种形式的setState()也是异步的！并且在同一个周期内对多个setState进行批处理。例如，如果在同一个时期多次设置商品数量增加,则相当于：

```js
Object.assign(
    previousState,
    {quantiity: state.quantity + 1},
    {quantiity: state.quantity + 1}
)
```

此时，后调用的setState()将覆盖同一周期内先调用setState的值，因此商品数仅增加1次。如果后续状态取决于当前的状态，建议使用updater函数的形式代替：

```js
this.setState((state)=>{
    return {quantity: state.quantity + 1};
})
```

#### 三、参数2：回调函数callback （可选）

这个回调函数，**将在setState完成合并并重新渲染组件后执行**。通常，建议使用componentDidUpdate()方式来代替这个回调函数的使用。
