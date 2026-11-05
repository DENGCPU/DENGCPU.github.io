---
title: "11-redux之中间件与异步操作"
date: 2020-11-16T20:26:00
channel: frontend
series: "极客时间 React"
summary: "第10篇文章里，介绍了redux的基本做法：用户发出Action, Reducer函数算出新的State，View重新渲染。但是异步操作应该怎么处理呢？Acti…"
---

第10篇文章里，介绍了redux的基本做法：用户发出Action, Reducer函数算出新的State，View重新渲染。  
![](https://pic.downk.cc/item/5fb26119b18d627113c52bcf.jpg)  
但是异步操作应该怎么处理呢？Action发出以后，Reducer立即算出新的State, 这就叫做同步；Action发出后，过一段时间再执行Reducer,这就叫做异步。  
怎么才能让reducer在异步操作结束后自动执行呢？这就要用到新的工具： **中间件**（middleware）  
![](https://pic.downk.cc/item/5fb27135b18d627113c87d35.jpg)

### 一、中间件的概念

为了让redux可以进行异步操作，势必要在redux工作流程中添加新的功能。那么在哪个环节添加合适呢？

（1）Reducer: 纯函数，只能承担计算State的功能，不适合承担其他功能，也承担不了。因为理论上，纯函数不能进行读写的操作。

（2）View: 与State一一对应，可以看作是State的视觉层，也不合适承担其他功能。

（3）Action: 存放数据的对象，即消息的载体，只能被别人操作，自己不能进行任何操作。

想来想去，只有发送Action的这个步骤，即Store.dispatch()这个方法，可以添加功能。  
中间件就是一个函数，对store.dispatch方法进行了改造，在发出Action和执行Reducer这两步之间，添加了其他功能。

### 二、中间件的使用

常用的中间件都是现成的，只有引用别人写好的模块就行。

```js
import { applyMiddleware,createStore} from 'redux';
import createLogger from 'redux-logger';
const logger = createLogger();

const store = createStore(
    reducer,
    initialState, //整个应用的初始状态
    applyMiddleware(logger)
)
```

🐖：中间件的次序有讲究。有的中间件有次序要求，比如logger就一定放在最后，否则输出结果会不正确。使用前要查阅相关文档

```js
const store = createStore(
    reducer,
    appltMiddleware(thunk,promise,logger)
    //这里是用了三个中间件
)
```

\==applyMiddlewares()：== applyMiddlewares是Redux的原生方法，作用是将所有中间件组成一个数组，依次执行。

### 三、异步操作的基本思路

同步操作只要发出一种Action即可，异步操作的差别是它要发出三种Action:

-   操作发起时的Action
-   操作成功时的Action
-   操作失败时的Action

以服务器取出数据为例，三种Action可以有两种写法：

```js
//写法一：名称相同，参数不同
{type:'FETCH_POSTS'}
{type:'FETCH_POSTS',status:'error',error:'OoPS'}
{type:'FETCH_POSTS',status:'success',response:{...} }
//写法二：名称不同
{type:'FETCH_POSTS_REQUEST'}
{type:'FETCH_POSTS_FAILURE',error:'Oops'}
{type:'FETCH_POSTS_SUCCESS',response:{...}}
```

除了Action种类不同，异步操作的State也要进行改造，反映不同的操作状态。  
例子：

```js
let state={
    //...
    isFetching:true, //是否正在抓取数据
    didInvalidate:true,//是否超时
    lastUpdated:'xxxx'//上一次更新时间
}
```

现在，整个异步操作的思路就比较清晰了

-   1.操作开始时，发送一个Action,触发State 更新为“正在操作”状态，View重新渲染
-   2.操作结束后，再送出一个Action,触发State 更新为“操作结束”状态，View再次重新渲染。

### 四、redux-thunk中间件

异步操作至少要发两个Action：用户触发第一个Action,这个跟同步操作一样没有问题，但是，如何才能再操作结束时，系统自动送出第二个Action呢？

这个奥妙在于Action Creator之中。

```js
class AsyncApp extends Component{
    //加载成功后，
    componentDidMount(){
        const {dispatch,selectedPost}=this.props;
        //发送一个Action,向服务器要数据
        //这里的fetchPosts()函数就是Action Creator
        dispatch(fetchPosts(selectedPost));
    }
}
```

下面就是fetchPosts的代码

```js
const fetchPosts = postTitle =>(dispatch,getState)=>{
    //1.先发出一个Action
    dispatch(requestPosts(postTitle));
    //2.进行异步操作
    return fetch('/some/API/${postTitle}.json')
        //3.拿到结果，将结果转换为JSON格式
        .then(response => response.json())
        //4.再发出一个Action
        .then(json => dispatch(receivePosts(postTitle,json)))
}
```

🐖：

-   fetchPosts 返回了一个函数，而普通的Action Creator返回一个Action对象
-   fetchPosts 返回的函数入参时dispatch和getState这两个redux方法，普通的Action Creator的参数是Action的内容。
-   在返回的函数中，先发出一个Action（requestPosts(postTitle)），表示操作开始
-   异步操作结束之后，又发出一个Action（receivePosts(postTitle,json)），表示操作结束。

这样的处理，解决了异步操作中需要自动发出第二个Action的问题，但是，Action是由store.dispatch方法发出的，而这个方法正常情况下，入参只能是对象而不能是函数。  
\====> 这时，就需要中间件redux-think

```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

// Note: this API requires redux@>=3.1.0
const store = createStore(
  reducer,
  applyMiddleware(thunk)
);
```

上面代码使用redux-thunk,改造store.dispatch,使得后者可以接受函数作为参数。

因此，异步操作的第一个解决方案：写一个返回函数的Action Creator,然后使用redux-thunk 中间件改造store.dispatch.

### 五、redux-promise中间件

 既然Action Creator 可以返回函数，当然也可返回其他值。所以另一种异步操作的解决方案就是，让Action Creator返回一个Promise对象.

 这就需要使用redux-promise中间件。

```js
import {createStore,applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise';
import reducer from './reducers';

//这时Action Creator有两种写法，
//1.返回值是一个对象
const fetchPosts=(dispatch,postTitle)=>new Promise(function(resolve,reject){
    dispatch(requestPosts(postTitle));
    return fetch('/some/API/${postTitle}.json)
        .then(response=>{
            type:'FETCH_POSTS',
            payload:response.json()
        })
})

//2.Action对象的payload属性是一个Promise对象，
// 这时需要从redux-actions模块引入createAction方法
```

参考文章：[阮一峰redux教程](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_two_async_operations.html)
