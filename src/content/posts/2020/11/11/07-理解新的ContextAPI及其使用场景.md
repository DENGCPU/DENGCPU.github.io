---
title: "07-理解新的ContextAPI及其使用场景"
date: 2020-11-11T16:28:00
channel: frontend
series: "极客时间 React"
summary: "Context解决的是：组件之间的通信问题"
---

**Context解决的是：组件之间的通信问题**

Context提供了一个无需为每层组件手动添加props,就能在组件树间进行数据传递的方法。

![](https://i.bmp.ovh/imgs/2020/11/c51c0b02a804b0fb.png)

#### 1.设计目的

 Context设计的目的：为了共享那些对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或者首选语言。  
 在一个典型的React应用中，数据是通过props属性自上而下（由父亲到儿子）进行传递的，但是这种做法对于某些属性是及其繁琐的（比如上文说的UI主题，），这些属性是应用程序中许多组件都需要的。

**\==>** 所以，Context被设计出来，提供了一种在组件间共享“全局”数据的方式，从而不必显示地通过组件树逐层地传递props.

#### 2.使用Context前的考虑

**Context主要应用场景**：很多不同层级之间的组件需要访问同样的一些数据。(但是需要谨慎使用，因为这会让组件的复用性变差。)  
如果只是想避免层层传递一些属性，[组件组合（component composition）](https://zh-hans.reactjs.org/docs/composition-vs-inheritance.html)有时是一个比Context更好的解决方案。

#### 3.相关的API

***(1) React.createContext***  

```js
const MyContext = React.createContext(defaultValue);
```

-   createContext函数创建一个Context对象，当React渲染一个订阅了这个Context对象的组件时，这个组件会从组件树中离自身最近的匹配到的Provider中读取当前的context值。  
    …
-   *defaultValue*: 只有当组件所处的组件树中没有匹配到Provider时，其defaultValue参数才起作用。即使Provider中的value值是”undefined”，消费组件的defaultValue也不会生效。  
    （defaultValue有助于在不使用Provider包装组件的情况下，对组件进行测试）

***(2)Context.Provider***

```js
<MyContext.Provider value={/*某个值*/}>
```

-   每个Context对象都会返回一个Provider React组件，它允许消费组件订阅context的变化。
    
-   一个Provider可以和多个消费组件有对应关系。多个Provider也可以嵌套使用，里面的会覆盖外层的数据。
    
-   Provider有一个value属性，传递给消费组件。当value值发生变化时，Provider内部的所有消费组件都会重新渲染。  
    （Provider及其内部的消费组件都不受制于shouldComponentUpdate函数，所以当消费组件在其祖先组件推出更新的情况下也能更新）
    
-   通过新旧值检测确定变化，使用了和 Object.is相同的算法。
    

***(3) Class.contextType***

```js
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* 在组件挂载完成后，使用 MyContext 组件的值来执行一些有副作用的操作 */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* 基于 MyContext 组件的值进行渲染 */
  }
}
MyClass.contextType = MyContext;
```

-   挂载在class上的contextType属性会被重新赋值为一个由React.createContext()创建的Context对象。所以使用this.context可以消费最近Context上的那个值，我们可以任何生命周期访问到this.context，包括render函数。
-   通过class.contextType只能订阅一个context

***(4) Context.Consumer***

```js
<MyContext.Consumer>
    {value=>/*基于context值进行渲染*/}
</MyContext.Consumer>
```

-   这是一个可以订阅context的变更的React组件，它在函数式组件中可以订阅一个context。
    
-   这种方法需要一个[函数作为子元素（function as a child)](https://zh-hans.reactjs.org/docs/render-props.html#using-props-other-than-render),这个函数接收当前的context值，并返回一个React节点。
    
-   传递给Consumer的value值也就是组件树上方离context最近的Provider提供的value值，如果没有对应的Provider,就用createContext()中的defaultValue.
    

***(5) Context.displayName***

示例，下述组件在DevTools中将是显示MyDisplayName:

```js
const MyContext = React.createContext(/*some value*/);
MyContext.displayName = 'MyDisplayName';
<MyContext.Provider> // "MyDisplayName.Provider" 在 DevTools 中
<MyContext.Consumer> // "MyDisplayName.Consumer" 在 DevTools 中
```

-   context对象接受一个名为displayName的属性，类型为字符串。React DevTools使用该字符串来确定context要显示的内容。
