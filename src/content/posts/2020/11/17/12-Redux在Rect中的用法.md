---
title: "12-Redux在Rect中的用法"
date: 2020-11-17T08:29:00
channel: frontend
series: "极客时间 React"
summary: "为了方便在react中使用redux, Redux的作者封装了一个React专用的库React-Redux."
---

为了方便在react中使用redux, Redux的作者封装了一个React专用的库**React-Redux**.

 这个库是可选的，在实际项目中应该权衡下是直接使用redux还是使用React-Redux。后者虽然方便，但是要掌握额外的API，并且要遵守它的组件拆分规则。

### 一、UI组件

 React-Redux将所有组件分为两大类：

-   UI组件（presentational component）
-   容器组件（container component）

 UI组件有以下特征：

-   1、只负责UI的呈现，不带任何业务逻辑
-   2、没有状态（即不适用this.state这个变量）
-   3、所有数据都由参数（this.props)提供
-   4、不使用任何Redux的API

一个UI组件的例子：

```js
const Title = value => <h1>{value}</h1>
```

 因为不含有状态，UI组件又称为‘纯组件’，即它和纯函数一样，纯粹由参数决定它的值。

### 二、容器组件

  容器组件的特征恰恰相反：

-   负责管理数据和业务逻辑，不负责UI的呈现
-   带有内部状态
-   使用Redux的API

 总之，UI组件负责UI的呈现，容器组件负责管理数据和逻辑。

 如果一个组件既有UI又有业务逻辑，那么应该将它拆分为下面的结构：外面是一个容器组件，里面包含一个UI组件。前者负责与外部的通信，将数据传给后者，由后者渲染出试图。

 React-Redux规定，所有的UI组件由用户提供，容器组件则由React-Redux自动生成。也就是说，用户负责视觉层，状态管理则是全部交给它。

### 三、connect()

 React-Redux提供connect方法，用于从UI组件生成容器组件。（connect的意思就是将这两种组件连起来）

```js
import {connect} from 'react-redux'
const VisibleTodoList = connect()(TodoList);
//TodoList是UI组件，VisibleTodoList就是通过connect方法自动生成的容器组件
```

 但是由于没有定义业务逻辑，上面这个容器组件没有任何意义，只是UI组件的一个单纯的包装层。为了定义业务逻辑，需要给出以下信息：

-   （1）输入逻辑：外部的数据（即state对象）如何转换为UI组件的参数。
-   （2）输出逻辑：用户发出的动作如何变为Action对象，从UI组件传出去。

 因此，connect方法的完整API如下：

```js
import {connect} from 'react-redux';

const VisibleTodoList = connect(
    mapStateToProps,
    mapDispatchToProps
)(TodoList)
```

 connect函数接受两个参数：mapStateToProps 和 mapDispatchToProps。它们定义了UI组件的业务逻辑：前者负责输入逻辑，即将state映射到UI组件的参数（props),后者负责输出逻辑，即将用户对UI组件的操作映射为Action对象。

### 四、mapStateToProps()

  mapStateToProps是一个函数，它的作用就是像它的名字那样，建立一个从（外部的）state对象到（UI组件的）props对象的映射关系。

 作为函数，mapStateToProps执行后应该返回一个对象，里面的每一个键值对就是一个映射。  
例子：

```js
const mapStateToProps=(state)=>{
    return {
        //todos属性，代表UI组件的同名属性
        //getVisibleTodos可以从state算出todos的值
        todos: getVisibleTodos(state.todos,state.visibilityFilter)
    }
}

//getVisibleTodos可以从state算出todos的值
const getVisibleTodos=(todos,filter)=>{
    switch(filter){
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(t=>t.completed);
        case 'SHOW_ACTIVE':
            return todos.filter(t=>!t.completed);
        default:
            throw new Error('Unknow filter:'+filter)
    }
}
```

 mapStateToProps 会订阅Store,每当state更新的时候，会自动执行，重新计算UI组件的参数，从而触发UI组件的重新渲染。

 mapStateToProps 的第一个参数总是state对象，还可以使用第二个参数，代表容器组件的props对象。

```js
//容器组件的代码
// <FilterLink filter='SHOW_ALL'>ALL</FilterLink>

const mapStateToProps = (state,ownProps) =>{
    return {
        active:ownProps.filter === state.visibilityFilter
    }
}
```

 使用ownProps作为参数后，如果容器组件的参数发生变化，也会引起UI组件重新渲染。

 connect方法可以省略mapStateToProps参数，那样的话UI组件就不会订阅Store, 也就是说Store的更新不会引起UI组件渲染。

### 五、mapDispatchToProps()

 mapDispatchToProps 是connect函数的第二个参数，用来建立UI组件的参数到Store.dispatch的映射，它定义了哪些用户的操作应该当作Action，传给Store。它可以是一个函数，也可以是一个对象。

 1、**如果mapDispatchToProps是一个函数**，会得到dispatch和ownProps(容器组件的props对象)两个参数。

```js
const mapDispatchToProps = (
    dispatch,
    ownProps
) => {
    return {
        onClick:()=>{
            dispatch({
                type:'SET_VISIBILITY_FILTER',
                filter:ownProps.filter
            })
        }
    }
}
```

 从上述代码中可以看出，mapispatchToProps作为函数，应该返回以一个对象，该对象的每个键值对都是一个映射，定义了UI组件的参数怎样发出action。

 2、**如果mapDispatchToProps是一个对象**，它的每个键名也是对应UI的同名参数，键值应该是一个函数，会被当作是Action Creator,返回的Action会由Redux自动发出。

```js
const mapDispatchToProps={
    onClick:(filter)=>{
        type:'SET_VISIBILITY_FILTER',
        filter:filter
    }
}
```

### 六、Provider组件

 connect方法生成容器组件以后，需要让容器组件拿到state对象，才能生成UI组件的参数。一种解决方法是将state对象作为参数，传给容器组件。但是这样比较麻烦，尤其是容器组件在很深的层级时，一级级将state传下去就很麻烦。

 React-Redux提供Provider组件，可以让容器组件拿到state。

```js
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import todoApp from './reducers';
import App from './components/App';

let store = createStore(todoApp);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
```

 Provider 在根组件外面包了一层，这样一来，App的所有子组件默认都可以拿到state了。Provider的原理时React组件的context属性。  
源码：

```js
class Provider extends Component{
    getChildContext(){
        return {
            store:this.props.store
        }
    }
    render(){
        return this.props.children;
    }
}

Provider.childContextTypes = {
    store:React.PropTypes.object
}
```

 上面代码中，store放在了上下文对象context上面。然后，子组件就可以从context拿到store。代码如下：

```js
class VisibleTodoList extends Component{
    componentDidMount(){
        const {store} = this.context;
        this.unsubscribe=store.subscribe(()=>
            this.forceUpdate()
        );
    }
    render(){
        const props=this.props;
        const {store}=this.context;
        const state=store.getState();
        //...
    }
}

VisibleTodoList.contextTypes = {
    store:React.PropTypes.object
}
```

React-Redux 自动生成的容器组件的代码就是类似于上面这样，拿到store。

### 七、React-Router 路由库

 使用React-Router的项目，与其他项目没有不同之处，也是使用Provider在Router外面包一层。毕竟Provider的唯一功能就是传入store对象。

```js
const Root = ({store}) => (
    <Provider store={store}>
        <Router>
            <Route path="/" component={App} />
        </Router>
    </Provider>
)
```
