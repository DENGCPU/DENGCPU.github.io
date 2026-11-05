---
title: "React01--ref的使用"
date: 2020-11-24T15:18:00
channel: frontend
series: "React"
summary: "在react典型的数据流中，props传递时父子组件交互的唯一方式：通过传递一个新的props值来使子组件重新render，从而达到父子组件通信。但是，某些情况…"
---

## ref的详细用法

在react典型的数据流中，props传递时父子组件交互的唯一方式：通过传递一个新的props值来使子组件重新render，从而达到父子组件通信。但是，某些情况下，你需要在典型数据流之外强制修改子组件。比如：

-   管理焦点，文本选择或者媒体播放
-   触发强制动画
-   集成第三方DOM库

这些情况下，react提供了新的方案：ref

#### 一、ref简介

React提供的ref属性，**表示对组件真正实例的引用**，其实就是ReactDOM.render()返回的组件实例。需要区分一下：ReactDOM.render()渲染组件时返回的是组件实例；而渲染dom元素时，返回的是具体的dom节点。

例如，下面的代码：

```js
const domCom = <button>button</button>;
const refDom = ReactDOM.render(domCom,container);
const refCom = ReactDOM.render(<myComponent />,container);
console.log(refDom);
console.log(refCom);
```

上述代码运行如下：  
![](https://pic.downk.cc/item/5fbcde31b18d6271133f9065.jpg)

ref可以挂在任何组件上，可以挂在组件上也可以是dom元素上：

-   挂在组件上（指有状态组件）的ref表示对组件实例的引用
-   挂载到dom元素上时表示具体的dom节点

#### 二、ref可以设置回调函数

ref属性可以设置为一个回调函数，这也是官方推荐的做法。这个函数的执行时机为：

-   组件被挂载后，回调函数立即执行，回调函数的参数为该组件的具体实例。
-   组件被卸载或者原有的ref属性本身发生变化时，回调也会被立即执行，此时回调函数参数为null，以避免内存泄漏。

例子：

```js
//使用ref存储DOM节点的引用：
class CustomTextInput extends React.Component {
  construtor(props) {
    super(props);
    //创建一个ref来存储 textInput 的DOM元素
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    //直接使用原生的API来使得 text输入框获得焦点
    //注意：我们通过“current” 来访问DOM节点
    this.textInput.current.focus();
  }
  render() {
    //告诉Reacts 我们想把<input> ref
    //关联到constructor里面的'textInput'上
    return (
      <div>
        <input  type='text' ref={this.textInput}/>
        <input type='button' value='focus the text input' onClick={this.focusTextInput} />
      </div>
    )
  }
}
```

上述代码中，React将在组件挂载时，会调用ref回调函数并传入DOM元素，当卸载时也调用它并传入null。在componentDidMount 或 componentDidUpdate触发前，React会保证refs一定是最新的。

#### 三、ref可以设置字符串 (了解)

 ref还可以设置为字符串值，不过这种方式基本不再推荐使用。

```js
<input ref='title' />
```

 然后再其他地方如事件回调中通过**this.refs**可以访问该组件实例，其实就是dom节点

```js
let element = this.refs.title;
```

我的github里react-demos项目下，question分支模仿知乎问答的例子，就使用了ref的这个用法。[简单知乎问答demo](https://github.com/DENGCPU/React-demos/blob/question/README.md)

#### 四、创建与访问Refs

**1.创建refs:**

 refs是使用React.createRef()创建的，并通过ref属性附加到React元素。在构建组件时，通常将refs分配给组件实例属性，以便在整个组件中都引用它们。

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

**2.访问refs:**

 当ref被传递给render中的元素时，对该节点的引用可以在ref的current属性中被访问。

```js
const node = this.myRef.current;
```

ref的值根据节点类型不同而有所不同：

-   当ref属性用于HTML元素时，构造函数中使用 React.createRef() 创建的 ref 接收底层 DOM 元素作为其 current 属性。
-   当ref属性用于自定义class组件时，ref对象接收组件的挂载实例作为其current属性。

🐖：不能在函数组件上使用ref属性，因为他们没有实例！

参考：[React ref的基本使用](https://juejin.cn/post/6844903749211652104) 以及 [React官方文档–Refs and The Dom](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html)
