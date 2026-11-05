---
title: "面试05-如何设计React组件？"
date: 2020-12-17T21:46:00
channel: frontend
series: "React 面试"
summary: "分析问题：“如何设计React组件？”其实就是在考察你是否了解React的设计模式。"
---

#### 面试场景5：如何设计React组件？

分析问题：“如何设计React组件？”其实就是在考察你是否了解React的设计模式。

如果在实际开发中，缺乏一个指导性的设计模式，代码会非常凌乱，经常出现下面的情况：

-   将一个页面写成一个组件
-   一个组件包含上千行代码

这些都没有明显的模块划分，缺乏组合的思想。所以，如何将组件更好地组合，这是第一个需要探讨的问题。基于不同的业务场景，组件的组合形式是不一样的。所以，回答这个问题，可以结合具体的场景来谈。

#### 一、React组件的分类

React社区中非常经典的分类模式：

-   展示组件：把只做展示、独立运行，不额外增加功能的组件称为**哑组件**，或**无状态组件**，也叫做**展示组件**。
-   灵巧组件：把处理业务逻辑与数据状态的组件称为有**状态组件**，或**灵巧组件**（灵巧组件一定包含至少一个灵巧组件或者展示组件）

展示组件的复用性更强，灵巧组件更专注于业务本身。  
![组件设计模式](https://i.bmp.ovh/imgs/2020/12/bbe88509298c9a03.png)

#### 二、展示组件

展示组件是没有状态管理的，完全受制于外部的props控制。展示组件的**通用性和复用率很高**，甚至可以做到跨项目级的复用。

展示组件中最常用的是代理组件。

##### 2.1、代理组件

代理组件用于封装常用属性，减少重复代码。

举个例子，当需要定义一个按钮的时候，需要在按钮上添加button属性：

```js
<button type='button' />
```

但是在React中使用的时候，不可能每次都写这样一段代码，过于麻烦。常见的做法就是封装：

```js
const Button = props =>
    <button type='button' {...props}>
```

在开发中使用Button组件代替原生button,可以确保type一致。

在使用Antd进行开发时，也可以采用类似的设计模式：

```js
import {Button as AntdButton} from 'antd';

const Button = props => 
    <AntdButton size='small' type='primary' {...props}/>

export default Button;
```

进行封装可以切断外部组件库的强依赖特性。在大厂中引入外部组件库通常要考虑两点：

-   如果当前组件库不能使用了，是否可以实现业务上的无痛切换？
    
-   如果需要进行批量修改基础组件的字段，如何解决？
    

代理组件的设计模式很好地解决了这两个问题。从业务上看，代理组件隔绝了Antd，仅仅是一个组件Props API层地交互。这一层如果未来需要更换，可以保证兼容、快速替换。其次，如果要修改基础组件的颜色、大小、间距，代理组件也可以相对优雅地解决。

基于这个思想，可以封装类似的其他组件，比如样式组件。

##### 2.2、样式组件

样式组件也是一种代理组件，只是焦点放在了处理样式上。在工程实践中，我们并不会因为一个className而封装一个组件：

```js
//一般不会这样做
const Button = props =>(
    <button type='button' className='btn btn-primary'>
)
```

真实工程中的样式管理往往比较复杂，类似于下面这样：

```js
import classNames from 'classNames';

const StyleButton =({className, primary, isHeight,...props}) => (
    <Button
        type='button'
        className={classNames('btn',{btn-primary:primary,highLight:isHighLighted,}className)}
        {...props}
    / >
)
```

如果直接使用Button,在属性上修改，对于工程代码而言就是编写大量的面条代码。而StyleButton的思路是将样式判断逻辑分离到自身上，更友好。

##### 2.3、布局组件

布局组件的基本设计与样式组件完全一样，但是它基于自身特性做了一个小优化。

布局组件主要用于安放其他组件，类似于这样：

```js
<Layout
    Top={<NavBar />}
    Content={<Article />}
    Bottom={<BottomBar />}
/>
```

布局本身是确定的，不需要根据外部状态变化去修改内部组件，所以这也是一个减少渲染的优化点。

```js
class Layout extends React.Component{
    //由于布局组件无需更新，就可以把shouldComponentUpdate的返回值写死，从而阻断渲染过程
    shouldComponentUpdate(){
        return false;
    }
    render(){
        <div>
            <div>{this.props.NavBar}</div>
            <div>{this.props.Article}</div>
            <div>{this.props.BottomBar}</div>
        </div>
    }
}
```

#### 三、灵巧组件

由于灵巧组件面向业务，相对于展示组件来说，其功能更加丰富、复杂性更高，所以其复用性更低。**展示组件专注于组件本身特性，灵巧组件更专注于组合组件**。最常见的案例就是容器组件。

##### 3.1、容器组件

容器组件几乎没有复用性，它主要用于：拉取数据与组合组件。  
一个例子：

```js
const CardList = ({cards}) => (
    <div>
        {cards.map(card=>(
            <CardLayout
                header={<Avatar url={card.avatarUrl} />}
                Content={<Card {...card} />}
            />
            {comment.body} - {comment.author}
        ))}
    </div>
)
```

上述代码中的CardList组件，负责将cards数据渲染出来。接下来就是获取网络数据：

```js
class CardListContainer extends React.Component{
    state={ cards: []}

    async componentDidMount(){
        const response = await fetch('/api/cards')
        this.setState({ cards:response })
    }

    render(){
        return <CardList cards={this.state.cards} />
    }
}
```

这样切分代码后，容器组件内非常干净，没有冗余得样式和逻辑处理。其实这也用到了“关注点分离”的策略。那么面对复用性更强的业务逻辑用什么处理呢？

##### 3.2、高阶组件

React官方文档中将高阶组件称为是react中**复用组件逻辑的高级技术**。高阶组件本身并不是React API的一部分，它是一种基于React的组合特性而形成的设计模式。实际上，高阶组件就是以组件为参数，返回一个新组件的函数。

这听起来非常像**高阶函数**：如果一个函数可以接收另一个函数作为参数，且在执行后返回一个函数，则称其为高阶函数。 react团队在组件方向也汲取了同样的设计模式，源自高阶函数的高阶组件，可以优雅地抽取公共逻辑。

参考：[React官网-高阶组件](https://zh-hans.reactjs.org/docs/higher-order-components.html#gatsby-focus-wrapper)

**高阶组件抽取公共逻辑**：

一个常见的例子，登录态的判断。假设当前项目有订单页面、用户信息页面及购物车首页，那么订单页面和用户信息页面都需要检查当前是否已登录。如果没有登录，则应该跳转至登录页面。

一般思路如下：

```js
const checkLogin = () =>{
    //!!XXX用于转为布尔值
    return !!LocalStorage.getItem('token')
}

class CartPage extends React.Component{
    ...
}

class UserPage extends React.Component{
    componentDidMount(){
        if(!checkLogin){
            //重定向到登录页面
        }
    }
}

class OrderPage extends React.Component{
    componentDidMount(){
        if(!checkLogin){
            //重定向到登录页面
        }
    }
}
```

上述代码虽然将登录态的判断抽取到了一个函数中，但是还是需要在相应的页面加上判断逻辑。如果有高阶组件的话，情况会完全不同：

```js
const checkLogin = () =>{
    return !!LocalStorage.getItem('token')
}
const checkLogin = (WrappedComponent) =>{
    return (props) => {
        return checkLogin() ? <WrappedComponent {...props} />: <LoginPage/>
    }
}
//1、函数写法
class RawUserPage extends React.Component {
    ...
}
const UserPage = checkLogin(RawUserPage);

//2、装饰器写法
@checkLogin
class UserPage extends React.Component{
    ...
}

@checkLogin
class OrderPage extends React.Component{
    ...
}
```

可以看出，使用了高阶组件后，无论采用函数写法还是装饰器写法，重复代码量都下降了一个维度。  
还有一个非常经典的常见就是**页面埋点统计**：如果采用装饰器写，大致如下：

```js
const trakPageView = (pageName) =>{
    //发送埋点信息
}

const PV = (pageName) => {
    return (WrappedComponent)=>{
        return class Wrap extends Component{
            componentDidMount() {
                trackPageView(pageName)
            }

            render(){
                return (
                    <WrappedComponent {...this.props} />
                );
            }
        }
    };
}
@PV('用户页面')
class UserPage extends React.Component{
    ...
}

@PV('购物车页面')
class CartPage extends React.Component{
    ...
}

@PV('订单页面')
class OrderPage extends React.Component{
    ...
}
```

这样就连埋点的繁琐操作都变得优雅了起来。如果我想同时判断登录态和埋点呢？就是同时使用checkLogin 与 PV应该怎么做呢？这里涉及了一个新的概念：链式调用。

**链式调用**：

由于高阶组件返回的是一个新的组件，所以链式调用是默认支持的。基于checkLogin 与 PV两个例子，链式使用是这样的：

```js
//函数调用方式
class RawUserPage extends React.Component{
    ...
}
const UserPage = checkLogin(PV('用户页面')(RawUserPage));

//装饰器调用方式
@checkLogin
@PV('用户界面')
class UserPage extends React.Component{
    ...
}
```

**渲染劫持**：

渲染劫持可以通过控制render函数修改输出内容，常见的场景是显示加载元素：

```js
function withLoding(WrappedComponent) {
    return class extends WrappedComponent{
        render(){
            if(this.props.isLoding) {
                return <Loading />
            } else {
                return super.render();
            }
        }
    }
}
```

上述代码通过高阶组件继承原组件的方式，劫持修改render函数，篡改返回值，达到显示Loading的效果。但是高阶组件并非万能，它同样也有缺陷。

**高阶组件缺陷**：

1.  丢失静态函数。 由于被包裹了一层，所以静态函数在外层是无法获取的。
    
    ```js
    //Userpage.jsx
    @PV('用户页面')
    export default class UserPage extends React.Component{
        static getUser(){
            ...
        }
    }
    ```
    
    这里的getUser是无法被调用的，如果希望外界可以调用它，那么可以在PV函数中将静态函数复制过来。

```js
const PV = (pageName) => {
    return (WrappedComponent) =>{
        class Wrap extends Component{
            componentDidMount() {
                trackPageView(pageName)
            }
            render(){
                return (
                    <WrappedComponent {...props} />
                )
            }
        }
        Wrap.getUser = WrappedComponent.getUser;
        return Wrap;
    }
}
```

但是一个类的静态函数可能有很多，不可能都这样进行手动复制。于是，社区中出现了现成的工具：通过hoist-non-react-statics处理，可以自动复制所有静态函数。

```js
import hoistNonReactStatics from 'hoist-non-react-statics';

const PV = (pageName) => {

  return (WrappedComponent) => {

    class Wrap extends Component {

      componentDidMount() {

        trackPageView(pageName)

      }

      render() {

        return (

          <WrappedComponent {...this.props} />

        );

      }

    }

     hoistNonReactStatics(Wrap, WrappedComponent);

     return Wrap;

  };

 }
```

2.  refs属性不能透传。 ref属性由于被高阶组件包裹了一次，所以需要进行特殊处理才能获取。React为我们提供了一个React.forwardRef 的API来解决这个问题，以下是官方文档的一个案例：

```js
function withLog(Component) {

  class LogProps extends React.Component {

    componentDidUpdate(prevProps) {

      console.log('old props:', prevProps);

      console.log('new props:', this.props);

    }

    render() {

      const {forwardedRef, ...rest} = this.props;

      // 将自定义的 prop 属性 “forwardedRef” 定义为 ref

      return <Component ref={forwardedRef} {...rest} />;

    }

  }

  // 注意 React.forwardRef 回调的第二个参数 “ref”。

  // 我们可以将其作为常规 prop 属性传递给 LogProps，例如 “forwardedRef”

  // 然后它就可以被挂载到被 LogProps 包裹的子组件上。

  return React.forwardRef((props, ref) => {

    return <LogProps {...props} forwardedRef={ref} />;

  });

}
```

这段代码读起来会有点儿头皮发麻，它正确的阅读顺序应该是从最底下的 React.forwardRef 部分开始，通过 forwardedRef 转发 ref 到 LogProps 内部。

参考：[React官网 - React.forwardRef](https://zh-hans.reactjs.org/docs/react-api.html#reactforwardref)

#### 四、工程实践

通过以上的梳理，我们来看一下如何在目录中给组件安排位置。

```js
src

├── components

│   ├── basic(基本展示组件)

│   ├── container(容器组件)

│   └── hoc(高阶组件)

└── pages
```

在实际开发中，针对basic组件，可以使用StoryBook的工具进行组件管理。它可以有组织地、高效地构建基础组件。可参考[Storybook官网](https://storybook.js.org/)。

#### 五、答题

经过上面几个章节的归类分析，关于React组件的设计，我们应该从设计与工程实际两个方向探讨。

> 从设计上而言，社区主流分类的方案是展示组件与灵巧组件。
> 
> 展示组件内部没有状态管理，仅仅用于最简单的展示表达。展示组件中最基础的一类组件称作代理组件。代理组件常用于封装常用属性、减少重复代码。很经典的场景就是引入 Antd 的 Button 时，你再自己封一层。如果未来需要替换掉 Antd 或者需要在所有的 Button 上添加一个属性，都会非常方便。基于代理组件的思想还可以继续分类，分为样式组件与布局组件两种，分别是将样式与布局内聚在自己组件内部。
> 
> 灵巧组件由于面向业务，其功能更为丰富，复杂性更高，复用度低于展示组件。最经典的灵巧组件是容器组件。在开发中，我们经常会将网络请求与事件处理放在容器组件中进行。容器组件也为组合其他组件预留了一个恰当的空间。还有一类灵巧组件是高阶组件。高阶组件被 React 官方称为 React 中复用组件逻辑的高级技术，它常用于抽取公共业务逻辑或者提供某些公用能力。常用的场景包括检查登录态，或者为埋点提供封装，减少样板代码量。高阶组件可以组合完成链式调用，如果基于装饰器使用，就更为方便了。高阶组件中还有一个经典用法就是反向劫持，通过重写渲染函数的方式实现某些功能，比如场景的页面加载圈等。但高阶组件也有两个缺陷，第一个是静态方法不能被外部直接调用，需要通过向上层组件复制的方式调用，社区有提供解决方案，使用 hoist-non-react-statics 可以解决；第二个是 refs 不能透传，使用 React.forwardRef API 可以解决。
> 
> 从工程实践而言，通过文件夹划分的方式切分代码。我初步常用的分割方式是将页面单独建立一个目录，将复用性略高的 components 建立一个目录，在下面分别建立 basic、container 和 hoc 三类。这样可以保证无法复用的业务逻辑代码尽量留在 Page 中，而可以抽象复用的部分放入 components 中。其中 basic 文件夹放展示组件，由于展示组件本身与业务关联性较低，所以可以使用 Storybook 进行组件的开发管理，提升项目的工程化管理能力。

整理为思维导图如下：  
![React组件设计](https://pic.downk.cc/item/5fdc10213ffa7d37b31b801d.jpg)

**总结**:

在本讲中主要对 React 组件的设计模式进行了梳理与回顾，并探讨了设计模式在工程实践中的作用。

在面试中面试官不仅希望听到设计模式有哪些，社区的推荐方式有哪些，更希望听到模式具体用在哪儿。如果你知道具体的场景，就会显得更有经验。设计模式并非有确定的标准答案，社区流行的分类方式也并非万能。如果你有自己的见解，在面试中与面试官进行探讨，也是非常值得鼓励的。
