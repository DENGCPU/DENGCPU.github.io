---
title: "010-状态管理库Redux"
date: 2020-11-16T09:33:00
channel: frontend
series: "极客时间 React"
---

### 一、React为何需要状态管理库

![](https://i.bmp.ovh/imgs/2020/11/26a4726bd6216f11.png)

![](https://i.bmp.ovh/imgs/2020/11/8ed5fe88ed497e9c.png)  
组件之间通信非常麻烦，有了redux把状态单独拧出来，组件通信就变得简单了。

Redux的特性：

-   **1、Single Source of Truth**

 传统的MVC架构：一个view可能对应多个model,一个model也可能对应多个view,关系错综复杂，这样一旦出现错误很难追踪。  
![](https://i.bmp.ovh/imgs/2020/11/5a9cb384b94cc272.png)

 Redux的结构：只有一个Store,出现错误容易追踪。

![](https://i.bmp.ovh/imgs/2020/11/fbb96f01a9c20437.png)

-   **2、可预测性** （不可变性immutable）
    
    ![](https://i.bmp.ovh/imgs/2020/11/4753506caf528c03.png)
    
-   **3、纯函数更新State**
    

  redux没有副作用.  
![](https://i.bmp.ovh/imgs/2020/11/17c05a6f634a7eaf.png)

### 二、理解Redux的核心概念：Store, Action,Reducer

**1.理解Store:**  
![](https://i.bmp.ovh/imgs/2020/11/bc6be7d1bc1deaf2.png)

Store就是保存数据的地方，可以把它看作是一个容器。整个应用只能有一个Store。  
Redux提供**createStore**这个函数，用来生成Store。

```js
import {createStore} from 'redux';

//createStore接受一个函数，返回新生成的store对象。
const store = createStore(fn);
```

**\==State:==**  Store对象包含所有数据，如果想得到某个时点的数据，就要对Store生成快照。这种时点的数据集合，就叫做State。  
当前时刻的State,可以通过 store.getState() 拿到。

```js
import {createStore} from 'redux';

const store = createStore(fn);
const state = store.getState();
```

redux规定，**一个state对应一个view**。只要state相同，view就相同。知道了State,就知道了View是什么样，反之亦然。

**2.理解Action:**

 State的变化，会导致view的变化。但是，用户接触不到State,只能接触到view。所以，State的变化必须是view导致的。Action就是view发出的通知，标识State应该要变化了。

 Action是一个对象，其中的type属性是必须的，标识Action的名称。其他属性可以自由设置。

```js
const action = {
  type:'ADD_TODO',
  payload:'learn redux'
}
```

上述代码中，Action的名称是ADD\_TODO，它携带的信息是字符串 learn redux.

可以这么理解，Action描述当前发生的事情。改变State的唯一方法，就是使用Action。它会运送数据给Store。

**Action Creator:**  
View要发生多少种消息，就会有多少种Action.如果都手写，会很麻烦。所以，可以定义一个函数用来生成Action,这个函数就叫 Action Creator

````js
const ADD_TODO = '添加TODO';
function addTodo(text){
  return {
    type:ADD_TODO,
    text
  }
}
const action=addTodo('learn redux')

``` 
上面代码中，addTodo函数就是一个Action Creator

**store.dispatch():**
store.dispatch()是View发出Action的唯一方法。
```js
import {createStore} from 'redux';

const store = createStore(fn);

store.dispatch({
  type:'ADD_TODO',
  payload:'learn redux'
})
````

结合 Action Crreator,这段代码可以改写如下：

```js
store.dispatch(addTodo('learn redux'));
```

**3.理解Reducer：**

Store在收到Action之后，必须给出一个新的State,这样View才会发生变化。这种State的计算过程，就叫做 Reducer。

Reducer是一个函数，它接受Action和当前的State,返回一个新的State。

```js
const reducer = function(state,action){
  //...
  return new_state;
}
```

整个应用的初始状态，可以作为State的默认值，下面就是一个实际的例子。

```js
const defaultState=0;
const reducer = (state=defaultState,action)=>{
  switch(action.type){
    case 'ADD':
      return state + action.payload;
    default:
      return state;
  }
};
const state=reducer(1,{
  type:'ADD',
  payload:2
})
```

上面代码中，reducer函数接收到一个名为ADD的action以后，就返回一个新的State。  
实际应用中，Reducer不需要像上面这样手动调用，store.dispatch方法会触发reducer的自动执行。为此，Store需要知道reducer函数，做法就是在生成Store的时候，就将reducer传入给createStore方法。

```js
import {createStore} from 'redux';
const store = createStore(reducer);
//以后每当store.dispatch发送过来一个新的Action,
//就会自动调用Reducer，得到新的State
```

🐖为什么这个函数被叫做Reducer呢？  
✨因为它可以作为数组的reduce方法的参数，下面是一个例子，一系列的Action对象按照顺序作为一个数组。

```js
const actions = [
  {type:'ADD',payload:0},
  {type:'ADD',payload:1},
  {type:'ADD',payload:2}
];
const total = actions.reduce(reducer,0)//3
```

上面代码中，数组actions表示依次有三个 Action，分别是加0、加1和加2。数组的reduce方法接受 Reducer 函数作为参数，就可以直接得到最终的状态3。

![](https://i.bmp.ovh/imgs/2020/11/43ed9499a953d590.png)

**Reducer函数最重要的特征是:它是一个纯函数。**  
\==纯函数==： 纯函数是函数式编程的概念，必须遵守以下一些约束。

-   不得改写参数
-   不能调用系统 I/O的API
-   不能调用Date.now()或者Math.random等不纯的方法，因为每次都会得到不一样的结果。

由于Reducer是纯函数，就可以保证同样的State必定得到同样的View。但也正因为这一点，Reducer函数里面不能改变State，必须返回一个全新的对象。所以，一般常采用 拓展运算符…和Object.assign()对state进行更新。(最好把State对象设为只读)

```js
//1.state是一个对象
function reducer(state,action){
  return Object.assign({},state,{thingTochange});
  //或者
  return {...state,...newState};
}
//2.state是一个数组
function reducer(state,action){
  return [...state,newItem]
}
```

下图综合理解这三个概念，可以看出redux的单向数据流动。  
![](https://i.bmp.ovh/imgs/2020/11/9fceb4adcb97b639.png)

### 三、redux的几个工具函数

**1.combineReducers:**

将多个reducer结合起来形成新的reducer。

![](https://pic.downk.cc/item/5fb1ddf2b18d627113a841a0.jpg)

**2.bindActionCreators:**

![](https://pic.downk.cc/item/5fb1de1eb18d627113a848fb.jpg)

![](https://pic.downk.cc/item/5fb1de6fb18d627113a8563c.jpg)

### 四、在React中使用Redux

redux提供了一个**react-redux**的package，用connect把一个已有的组件连接到store上。

![](https://pic.downk.cc/item/5fb1e29cb18d627113a9146f.jpg)

![](https://pic.downk.cc/item/5fb1e356b18d627113a93618.jpg)

### 五、理解Redux的异步action以及中间件

中间件截获后去访问一个API，根据访问的结果再dispatch.

![](https://pic.downk.cc/item/5fb1eab2b18d627113aabab1.jpg)

异步的action并不是一个新的action类型, 而是几个同步action的组合使用.

![](https://pic.downk.cc/item/5fb1eb4eb18d627113aae915.jpg)

![](https://pic.downk.cc/item/5fb1ecf0b18d627113ab5f8a.jpg)

### 六、如何在redux中组织Action和Reducer

![](https://pic.downk.cc/item/5fb1ede4b18d627113ab90f7.jpg)

![](https://pic.downk.cc/item/5fb1ee82b18d627113abad69.jpg)

![](https://pic.downk.cc/item/5fb1eec1b18d627113abb8da.jpg)

### 七、 Redux的运行基础:不可变数据(immutability)

![](https://pic.downk.cc/item/5fb1efbcb18d627113abe8a3.jpg)

##### 1.为什么需要不可变数据?

-   **1.性能优化:**  
     store变化时会通知组件更新==> store的变化都是由action触发==>action触发在旧的state上形成新的state。不需要比较新旧state值是否变了,只需要判断**前后状态的引用**有没有变化
    
-   **2.易于调试和跟踪:**  
    任何时候，store变化时可以记录之前和之后的状态值。
    
-   **3.易于推测:**  
    任何时候，都可以找到是什么引起store的变化
    
    ##### 2.如何操作不可变数据?
    

\==三种方式:==  
![](https://pic.downk.cc/item/5fb1f0f2b18d627113ac3540.jpg)

简单场景：使用原生写法就可以了。

![](https://pic.downk.cc/item/5fb1f37cb18d627113acb0d5.jpg)

复杂场景：需要借助一些类库。

![](https://pic.downk.cc/item/5fb1f414b18d627113accfd2.jpg)

immer: 性能差一点，适用应用程序小，场景简单的情况。  
![](https://pic.downk.cc/item/5fb1f44fb18d627113acdf4d.jpg)

### 八、梳理Redux的工作流程

![](https://pic.downk.cc/item/5fb26119b18d627113c52bcf.jpg)

1.首先，用户发出Action。

```js
store.dispatch(action)
```

2.然后，Store自动调用Reducer,并且传入两个参数：当前State和收到的Action。Reducer会返回新的State

```js
let nextState = todoApp(previousState,action);
```

State一旦有变化，Store就会调用监听函数

```js
//设置监听函数
store.subscribe(listener);
```

listener可以通过store.getState()得到当前状态，如果使用的是React,这时可以触发重新渲染View。

```js
function listener(){
  let newState = store.getState();
  component.setState(newState);
}
```
