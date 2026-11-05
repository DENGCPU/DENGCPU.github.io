---
title: "面试08-列举一种你了解的React状态管理框架"
date: 2021-02-05T18:23:00
channel: frontend
series: "React 面试"
summary: "破题："
---

### 面试场景8：列举一种你了解的react状态管理框架？

**破题**：

正如面试07组件间通信中提到的：跨越多个层级之间的组件仍然需要共享状态、响应变化。传统的状态提升方案例如Context，难以高效地解决这个问题。

Context存储的变量难以追溯数据源以及确认变动点。当组件依赖Context，会提高组件耦合度，不利于组件的复用与测试。而状态管理框架就很好地解决了这个问题。

当前React社区最流行的三大状态管理框架：Flux，React， Mobx。

#### 一、Flux

Flux提出了一种MVC以外的成功实践——**单向数据流**。 2014年Facebook F8大会上提出了一个观点，MVC更适用于小型应用，大型前端项目使用MVC会使项目变得复杂（每当添加新的功能，系统复杂度就会疯狂增长）。如下图所示，Model与View的关联是错综复杂的，很难理解和调式，尤其是Model与View之间存在**双向数据流动**

![MVC架构图](https://img.imgdb.cn/item/601d2cc93ffa7d37b3f544dc.jpg)

这种MVC模式，对于就接手老代码的人也是个令人头疼的难题，因为他们害怕承担风险，所以不敢轻易修改代码。所以，facebook提出了一种基于单向数据流的架构。如下图所示：

![Flux架构](https://img.imgdb.cn/item/601d2ec03ffa7d37b3f5f5e5.jpg)

几个核心概念：

-   View是视图层，即代码中的React组件
-   Store是数据层，维护了数据和数据处理的逻辑
-   Dispatcher是管理数据流动的中央枢纽。每一个Store提供一个回调，当Dispatcher接收一个Action时，所以的Store接收注册表中的Action，然后通过回调产生数据
-   Action可以理解为一种事件通知,通常用type标记。

具体的流程是：Store存储了视图层的所有数据，当Store变化后会引起View层的更新。如果在View层触发一个Action，比如点击一个按钮，当前的页面数据值会发生变化。Action会被Dispatcher进行统一的收发处理，传递给Store层。由于Store层以及注册过相关Action的处理逻辑，处理相应的内部状态变化后，会触发View层更新。

从应用场景来看，Flux除了在FaceBook内部大规模应用以外，业界很少使用，它的概念和样板代码与后起之秀比略显冗余。

#### 二、Redux

**前言–Elm**:

Elm是一种主要用于网页开发的语言，它设计了一种Model、View、Message、Update的更新思想。

![elm架构](https://img.imgdb.cn/item/601e05143ffa7d37b345b584.jpg)

Elm的主要思想：

-   全局单一数据源：不像Flux一样有多个Store
-   纯函数：可以保证输入输出的恒定。
-   静态类型：可以保证允许安全

Redux借鉴了Elm的这个设计，确立的自己的三原则：

-   **单一数据源**：整个应用的state被存储在一个object tree中，并且这个object tree 只存在于唯一的store中
-   **纯函数Reducer**: 即为了描述Action如何改变状态树，编写的一个纯函数的Reducer
-   **state是只读的**：唯一可以改变state的方法是触发Action，Action是一个用于描述已发生事件的普通对象

如何解决副作用(Side Effect):

\==> 任何具备业务价值的Web应用都必然执行复杂的逻辑，比如Ajax请求等异步工作，这类逻辑函数在每次的执行过程中产生不同的变化，这样与外界的交互被称为“副作用”。 一个常见的副作用的栗子：你发送你一个网络请求，需要界面先显示Loading，再根据请求是否成功来决定界面是显示报错还是数据内容。面对这样的场景，你会发现在整个过程中，异步操作在Redux中无从添加，因为Redux本身深受函数式编程的影响。导致：

-   所有的事件都收拢到Action中去触发
-   所有的UI状态都交给Store去管理
-   所有的业务逻辑都交给Reducer去处理

这里的Action和Reducer是纯函数，Store只是一个状态树，都不能完成处理副作用的操作。真正可以解决副作用的方案有两类：

1.  在Dispatch的时候有一个middleware中间件层，拦截分发的Action并添加额外的复杂行为，还可以添加副作用。

这类方案中的代表是Redux-thunk，其作用是处理异步Action，它的源码经常在面试中经常被要求独立编写。

```js
function createThunkMiddleware(extraArgument){
    return ({ dispatch, getState }) => (next) => (Action) => {
        if(typeof Action === 'function'){
            return Action(dispatch,getState,extraArgument);
        }
        return next(Action)
    }
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware();

export default thunk;
```

redux-thunk通过添加中间件来判断Action是否是函数：

-   如果是函数：则Dispatch,将当前的整个state以及额外的参数传入其中
-   否则继续流转Action

这类方案是最经典的处理redux副作用的方案，用户还可以自定义Store的middleware。如果Action是一个数组或者是一个promise，还可以是迭代器，或者rxjs, 社区中有相应的中间件，redux-saga, redux-promise,redux-observable等。

2.  第二类方案较为冷门，但是设计上思考得更为深刻。例如redux loop就深入地借鉴了Elm。Elm的副作用处理是在update层，这样的设计叫分形架构【如果子组件能够以同样的结构，作为一个应用使用，这样的结构就是分形架构】

分形架构的好处显而易见，复用容易，组合方便。Redux Loop就做出了这样的尝试，但是在实际的项目中应用的很少。

```js
//redux-loop
import {loop,Cmd} from 'redux-loop';

function initAction(){
    return {
        type:'INIT',
    };
}
function fetchUser(userId){
    return fetch(`/api/user/${userId}`)
}
function userFetchSuccessAction(user){
    return {
        type: 'USER_FETCH_SUCCESS',
        user
    }
}
function userFetchFailAction(err){
    return {
        type: 'USER_FETCH_FAILED',
        err
    }
}
const initialState = {
    initStarted:false,
    user:null,
    error:null
};
function Reducer(state=initialState,Action){
    switch(Action.type){
        case 'INIT':
            return loop(
                {...state, initStarted:true},
                Cmd.run(fetchUser, {
                    successActionCreator: userFetchSuccessAction,
                    failActionCreator:userFetchFailAction,
                    args:['123']
                })
            );
        case 'USER_FETCH_SUCCESS':
            return {...state, user: Action.user};
        case 'USER_FETCH_FAILED':
            return {...state, error: Action.error};
        default:
            return state;
    }
}
```

虽然redux loop在分形架构上做出了探索，但是redux作者并不是那么满意，甚至写了一篇[There is no easy way to compose Redux applications](https://redux.canny.io/feature-requests/p/there-is-no-easy-way-to-compose-redux-applicati)认为没有一种简单的方案可以组合redux应用，并提出了一个长久为未被解决的[issue](https://github.com/reduxjs/redux/issues/1528)

最后就是关于redux的一揽子解决方案：

-   在国外社区流行的方案是rematch,它提供了一个标准的范式写redux。有一些[rematch案例](https://github.com/rematch/rematch/tree/next/examples)可供参考，rematch的模块更为内聚，插件更丰富。
-   国内的流行解决方案是[dva](https://github.com/dvajs/dva)

#### 三、Mobx

先看一个Mobx的官方示例：

```js
import {observable,autorun} from 'mobx';

var todoStore = observable({
    //一些观察的状态
    todos:[],
    //推导值
    get completedCount(){
        return this.todos.filter(todo=>todo.completed).length;
    }
});
//观察状态改变的函数
autorun(function(){
    console.log("completed %d id %d items",
        todoStore.completedCount,
        todoStore.todos.length
    )
});
//一些改变状态的动作
todoStore.todos[0]={
    title: 'take a walk',
    completed: false
}
// ->同步打印 ‘Completed 0 of 1 items'
todoStore.todos[0].completed=true;
// ->同步打印 ‘Completed 1 of 1 items'
```

Mobx是通过监听数据的属性变化，直接在数据上更改来触发UI的渲染。Mobx的监听方式有两种：

-   在Mobx5之前，实现监听的方式是Object.defineProperty
-   在Mobx5之后，采用的是Proxy方案。

**答题**：  
![状态管理库总结](https://img.imgdb.cn/item/601e8c683ffa7d37b3801282.jpg)

> 一、首先介绍Flux,Flux是一种使用单向数据流的形式来组合React组件的应用架构。
> 
> Flux包含了4个部分：Dispatcher,Store,View,Action。Store存储了视图层所有的数据，当Store变化后引起View层的更新。如果在视图层触发一个Action,就会使当前的页面数据值发生变化。Action会被Dispatcher进行统一的收发处理，传递给Store层，Store层已经注册过相关Action的处理逻辑，处理对应的内部状态变化后，触发View层更新。
> 
> Flux的优点使单向数据流，解决了MVC中数据流向不清的问题，使开发者可以快速了解应用行为。从项目结构上简化了视图层设计，数据与业务逻辑也统一存放管理，使在大型架构中更容易管理与维护代码。

> 二、其次是Redux，Redux 中整个数据流的方案与 Flux 大同小异。它的核心设计包含三大原则：单一数据源、纯函数reducer、state是只读的。
> 
> Redux 中的另一大核心点是处理“副作用”，AJAX 请求等异步工作，或不是纯函数产生的第三方的交互都被认为是 “副作用”。这就造成在纯函数设计的 Redux 中，处理副作用变成了一件至关重要的事情。社区通常有两种解决方案：  
> (1)第一类是在 Dispatch 的时候会有一个 middleware 中间件层，拦截分发的 Action 并添加额外的复杂行为，还可以添加副作用。第一类方案的流行框架有 Redux-thunk、Redux-Promise、Redux-Observable、Redux-Saga 等。  
> (2)第二类是允许 Reducer 层中直接处理副作用，采取该方案的有 React Loop，React Loop 在实现中采用了 Elm 中分形的思想，使代码具备更强的组合能力。
> 
> Redux 的优点很多：结果可预测；代码结构严格易维护；模块分离清晰且小函数结构容易编写单元测试；Action 触发的方式，可以在调试器中使用时间回溯，定位问题更简单快捷；单一数据源使服务端同构变得更为容易；社区方案多，生态也更为繁荣。

> 三、最后是 Mobx，Mobx 通过监听数据的属性变化，可以直接在数据上更改触发UI 的渲染。在使用上更接近 Vue，比起 Flux 与 Redux 的手动挡的体验，更像开自动挡的汽车。Mobx 的响应式实现原理与 Vue 相同，以 Mobx 5 为分界点，5 以前采用 Object.defineProperty 的方案，5 及以后使用 Proxy 的方案。它的优点是样板代码少、简单粗暴、用户学习快、响应式自动更新数据让开发者的心智负担更低。

总结:

对技术进行横向比较的时候切忌踩一捧一!谈个人观点的时候可以使用类似下面这种说法：

我认为Flux的设计更偏向Facebook内部的应用场景，Facebook的方案略显臃肿，拓展能力不佳，所以在社区中热度不够。而Redux因为纯函数的元婴，简洁而不简单的API设计使社区疯狂贡献发展。但从工程角度而言，不是每一个项目都适合单一数据源。因为有的项目数据是按页面级别划分的，页面之间相对隔绝，并不需要共享数据源，是否需要用Redux要视情况而定。Modx在开发项目是简单快速，但应用Mobx的场景其实可以使用Vue取代，而且使用Vue体积会更小巧。
