---
title: "面试11-如何解释React的渲染流程？"
date: 2021-07-05T09:14:00
channel: frontend
series: "React 面试"
summary: "破题:"
---

### 面试场景11：如何解释React的渲染流程？

**破题:**

想要讲清楚渲染流程，需要知道什么时渲染过程中的重点？以及渲染过程中的层次该如何划分？

**承题：**

React面试前几讲中提到了渲染流程中的知识点：React渲染节点的挂载、React组件的生命周期、setState触发渲染更新、diff策略与patch方案。 渲染流程中包含的内容很繁杂，有大大小小需要处理的事，专业术语叫**事务**。事务具有**原子性**，必须作为一个整体执行完成，是无法分割的。

事务是通过**调度**的方式协调执行的。有了全局规划的调度，也有了具体的事务，但是工作往往是按**阶段进行划分**的，渲染流程中也存在阶段划分。

这样，初步的答题框架就有了：  
![React渲染](https://pic.imgdb.cn/item/60e262bd5132923bf8fa1861.jpg)

在逐级梳理之前，我们先讲一个渲染流程中绝对绕不开的概念——协调。

#### 一、协调

协调，在React官方博客中原文是Reconciler，官方文档在介绍协调时，是这么说的：

> React提供的声明式API让开发者可以在对React的底层实现没有具体了解的情况下编写应用。在开发者编写应用是虽然保持相对简单的心智，但开发者无法了解内部的实现机制。本文描述了在实现React的“diffing”算法中我们做出的设计决策以保证组件满足更新具有可预测性，以及在繁杂业务下依然保持应用的高性能性。

从这段官方文档可以看出，Reconciler是协助React确认状态变化时要更新哪些DOM元素的diff算法，看上去有点调解员的意思。这是狭义的Reconciler，也是[第10讲“React的diff算法有何特点？”](https://dengcpu.github.io/2021/07/03/%E9%9D%A2%E8%AF%9510-React%E7%9A%84diff%E7%AE%97%E6%B3%95%E6%9C%89%E4%BD%95%E7%89%B9%E7%82%B9%EF%BC%9F/)中提到的内容。

而在React源码中还有一个叫做reconcilers的模块，它通过抽离公共函数与diff算法使声明式渲染、自定义组件、state、生命周期方法和refs等特性实现跨平台工作。  
  
Reconcilers模块以React16为界线分为两个版本：

1.  **Stack Reconciler** 是React15及其以前版本的方案，其核心是以**递归的方式**逐级调度栈中子节点到父节点的渲染。
2.  **Fiber Reconciler**是React16及其以后版本的方案，它的核心设计是**增量渲染**（incremental rendering)，也就是将渲染工作分割为多个区块，并将西其分散到多个帧中。设计初衷是提高react在动画、画布以及手势等场景下的性能表现。

这两者之间的性能可以通过一个[demo](https://claudiopro.github.io/react-fiber-vs-stack-demo/)明显地体会到。

#### 二、渲染

##### 2.1 Stack Reconciler

Stack Reconciler没有单独的包，并没有像Fiber Reconciler一样抽取为独立的[React-Reconciler模块](https://github.com/facebook/react/tree/16.3-dev/packages/react-reconciler)。但它依然是一个经典的设计。在React官方文档中，是通过伪代码的形式介绍其[实现方案](https://react.html.cn/docs/implementation-notes.html)的。

**挂载**：

这里的挂载并不是生命周期里提到的挂载，它是将整个React挂载到ReactDOM.render之上，就像以下代码中的App组件挂载在root节点之上：

```js
class App extends React.Component {
    render(){
        return (
            <div>hello world</div>
        )
    }
}
ReactDOM.render(<App />, document.getElementById('root'))
```

之前说过，JSX会被Babel编译为React.createElement的形式：

```js
ReactDOM.render(React.createElement(App), document.getElementById('root'))
```

但是，这项工作是发生在本地的Node进程中，而不是通过浏览器中的React完成的。（**JSX不是通过React完成编译**）

ReactDOM.render调用之后，实际上是**透传参数给ReactMount.render**.

-   ReactDOM是对外暴露的模块接口
-   ReactMount是实际执行者，完成初始化React组件的整个过程。

初始化第一步就是通过React.createElement创建React Element。不同的组件类型会被创建为不同的Element:

-   App组件会被标记为type function，作为用户自定义的组件，被ReactComponentsiteComponent包裹一次，生成一个对象实例；
-   div 标签作为React内部的已知DOM类型，会实例化为ReactDOMComponent;
-   “hello world”会被直接判断是否为字符串，实例化为ReactDOMComponent。

![](https://pic.imgdb.cn/item/60e2c71e5132923bf867f448.jpg)

这段的逻辑在React源码中大致是这样的，其中isInternalComponentType就是判断当前的组件是否为内部已知类型：

```js
if(typeof element.type === 'string') {
    instance = ReactHostComponent.createInternalComponent(element);
} else if (isInternalComponentType(element.type)){
    instance = new element.type(element)
} else {
    instance = new ReactCompositeComponentWrapper();
}
```

到这里仅仅是完成了实例化，我们还需要与React产生一些联动，比如改变状态、更新界面等。在setState一讲中，我们提到在状态变更后，涉及一个变更收集再批量处理的过程。这里ReactUpates模块就专门**用于批量处理**，而批量处理的前后操作，是由React通过建立事务的概念来处理的。

React事务都是基于Transaction类继承拓展。每个Transaction实例都是一个封闭空间，保持不可变的任务常量，并提供对应的事务处理接口。一段事务在React源码中大概是这样的：

```js
mountComponentIntoNode: function(rootID, container){
    var transaction = ReactComponent.ReactReconcileTransaction.getPooled();
    transaction.perform(
        this._mountComponentIntoNode,
        this,
        rootID,
        container,
        transaction
    );
    ReactComponent.ReactReconcileTransaction.release(transaction);
}
```

这里React团队是从后端领域借鉴到前端的，事务的设计有以下优势：

-   原子性：事务作为一个整体被执行，要么全部被执行，要么都不执行
-   隔离性：多个事务并发执行时，一个事务的执行不应该影响其他事务的执行。
-   一致性: 相同的输入，确定能得到同样的执行结果。

上面提到的事务会调用ReactCompositeComponent.mountComponent函数进入React生命周期，它的源码大致是这样的：

```js
if(inst.componentWillMount){
    inst.componentWillMount();
    if(this._pendingStateQueue) {
        inst.state = this._processPendingState(inst.props, inst.context);
    }
}
```

首先会判断是否有 componentWillMount，然后初始化 state 状态。当 state 计算完毕后，就会调用在 App 组件中声明的 render 函数。接着 render 返回的结果，会处理为新的 React Element，再走一遍上面提到的流程，不停地往下解析，逐步递归，直到开始处理 HTML 元素。到这里我们的 App 组件就完成了首次渲染。

**更新**：

现在来解析当调用setState时会发生什么，setState时会调用Component类中的enqueueSetState函数：

```js
this.updater.enqueueSetState(this, partialState);
```

在执行enqueueSetState后，会调用ReactCompositeComponent实例中的\_pendingStateQueue,将新的状态变更加入实例的等待更新状态队列中，再调用ReactUpdates模块中的enqueueUpdate函数执行更新。这个过程会检查更新是否已经在进行中：

-   如果是，则把组件加入dirtyComponents中；
-   如果不是，先初始化更新事务，然后把组件加入dirtyComponents列表。

这里的初始化更新事务，就是setState一讲中提到的batchingstrategy.isBatchingUpdates开关。接下来就会在更新事务中处理所有记录的dirtyComponents。

**卸载：**

1.  对于自定义组件，也就是ReactCompositeComponent而言，卸载过程需要递归地调用生命周期函数。
    
    ```js
    class CompositeComponent {
        unmout(){
            var publicInstance = this.publicInstance
            if(publicInstance){
                if(publicInstance.componentWillUnmount){
                    publicInstance.componentWillUnmount()
                }
            }
            var renderedComponent = this.renderedComponent
            renderedComponent.unmount()
        }
    }
    ```
    
2.  对于ReactDOMComponent，卸载子元素需要清楚事件监听器并清理一些缓存。
    
    ```js
    class DOMComponent {
        unmount(){
            var renderedChildren = this.renderedChildren
            renderedChildren.forEach(child => child.unmount())
        }
    }
    ```
    
    从以上的流程我们可以看出，React渲染的整体策略是**递归**，并通过事务建立React与虚拟DOM的联系并完成调度。

整体的函数调用流程可查看[全景大图](https://bogdan-lyashenko.github.io/Under-the-hood-ReactJS/stack/images/intro/all-page-stack-reconciler.svg)

##### 2.2 Fiber Reconciler

首先，要理解什么是Fiber?

**Fiber**

在系统开发中，指**一种最轻量化的线程**。与一般线程不同的是，Fiber对于系统内核是不可见的，也不能由内核进行调度。它的运行模式被称为**协作式多任务**；而线程采用的是**抢占式多任务**。

-   在协作式多任务模式下，线程会定时放弃自己的运行权利，告知内核让下一个线程运行；
-   在抢占式下，内核决定调度方案，可以直接剥夺长耗时线程时间片，提供给其他线程。

回到浏览器中，浏览器无法实现抢占式调度，为了提升可用性与流畅度，React在设计上只能采用协作式调度的方案：将渲染任务拆分为多段，每次只执行一段，完成后就把时间控制权还给主线程。这就是Fiber Reconciler得名的原因。

在Fiber Reconciler还引入了两个新的概念，分别是Fiber与effect:

-   在React Element的基础上，通过createFiberFromElement函数创建Fiber对象。Fiber对象不仅包括ReactElement，还包含了指向父、子、兄弟节点的属性，保证Fiber构成的虚拟DOM树成为一个双向链表。
-   effect是指在协调过程中必须执行计算的活动。

在了解了Fiber是什么之后，我们就可以进入Fiber Reconciler的协调过程了。

**协调**

React团队画了一张基于Fiber Reconciler生命周期阶段图，其中协调过程被分为两个部分：Render 和 commit  
![](https://pic.imgdb.cn/item/60e955455132923bf8f17f6e.jpg)

1.  Render阶段
    
    Render阶段主要通过构造workInProgress树计算出diff。以current树为基础，将每个Fiber作为一个基本单位，自下而上逐个节点检查并构造workInProgress树。这个过程不再是递归，而是基于**循环**完成。
    
    在执行上通过requestIdleCallback来调度执行每组任务，每组中的每个计算任务被称为work，每个work完成后会确认是否由优先级更高的work需要插入。如果有就让位，没有就继续。优先级通常标记为动画或high的会先处理。每完成一组后，将调度全交回主线程，直到下一次requestIdleCallback调用，再继续构建workInProgress树。
    
2.  Commit阶段
    
    在Commit阶段处理effec列表，这里的effect列表包含了根据diff更新DOM树，回调生命周期、响应ref等。
    
    但是一定要注意，这个阶段是同步执行的，不可中断暂停。所以不要在componentDidMount、componentDidUpdate、componentWillUnmount中执行重度消耗算力的任务。
    

在上面的讲述中，省去了挂载与更新流程。其实在挂载阶段，ReactMount模块已经不存在了，是直接构造Fiber树。而更新流程大致一样，依然通过IsBatchingUpdates控制。那么Fiber Reconciler与Stack Reconciler最大的不同有两点：

-   协作式多任务模式
-   基于循环遍历计算diff

**答题**

> React的渲染过程大致一致，但是协调并不相同。以React16为分界线，分为Stack Reconciler和Fiber Reconciler。这里的协调从狭义上说，特指React的diff算法。广义上说，有时候也指React的reconciler模块，它通常包含了diff算法和一些公共逻辑。

> 1.Stack Reconciler的核心调度是递归。调度的基本单位是事务，它的事务基类是Transaction，这里的事务是React团队从后端开发中引入的概念。在React16以前，挂载主要通过ReactMount模块完成，更新通过ReactUpdate模块完成，模块之间相互分离，落脚执行点也是事务。

> 2.在React16以后，协调改为了Fiber Reconciler。它的调度方式有两个特点：第一个是协作式多任务模式。这个模式下，线程会定时放弃自己的运行权利，交还给主线程，通过requestIdleCallback实现。第二个特点式策略优先级，调度任务通过标记tag的方式分优先级执行，比如动画或者优先级标为high的任务可以先执行。Fiber Reconciler的基本单位是Fiber, Fiber基于过去的React Element提供了二次封装，提供了指向父、子、兄弟节点的引用，为diff工作的双链表实现提供了基础。

> 在Fiber Reconciler架构下，整个生命周期被划分为Render和Commit两个阶段。Render阶段的执行特点是可中断、可停止、无副作用，主要是通过构造workInProgress树计算出diff。以current树为基础，将每个Fiber作为一个基本单位，自下而上逐个节点检查并构造workInProgress树，这个过程不再是递归，而是基于循环实现。  
>   
> 在执行上通过requestIdleCallback来调度执行每组任务，每组中的每个计算任务被称为work，每个work完成后确认是否有优先级更高的work需要插入。如果有让位，没有就继续。优先级通常是标记为动画或者high的会优先处理。每完成一组后，将调度权交回主线程，直到下一次requestIdleCallback调用，再继续构建workInProgress树

> 在commit阶段需要处理effect列表,这里的effect列表包含了根据diff更新DOM树、回调生命周期、响应ref等。

> 但是一定要注意，这个阶段是同步执行的，不可中断暂停。所以不要在componentDidMount/componentDidUpdate/componentWillUnmount中执行重度消耗算力的任务。

> 如果只是一般的应用场景，比如管理后台、H5展示页。两者的性能差距不大，但是在动画、画布以及手势风场景下，Stack Reconciler的设计回占用主线程，造成卡顿。而Fiber Reconciler的设计则会带来高性能表现。

![React渲染流程](https://pic.imgdb.cn/item/60e7b47e5132923bf81de246.jpg)

**补充：**  
**为什么Stack Reconciler模式下render函数不支持return数组？**

答：Stack Reconciler采用的是递归遍历的模式，那么在递归情况下只能返回一个节点元素，肯定就不支持数组了。
