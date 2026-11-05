---
title: "面试12-React的渲染异常会造成什么后果？"
date: 2021-07-11T08:49:00
channel: frontend
series: "React 面试"
summary: "破题"
---

### 面试场景12: React的渲染异常会造成什么后果？

**破题**

  在[第3讲“如何避免生命周期中的坑”](https://dengcpu.github.io/2020/12/07/%E9%9D%A2%E8%AF%9503-%E5%A6%82%E4%BD%95%E9%81%BF%E5%85%8D%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E4%B8%AD%E7%9A%84%E5%9D%91%EF%BC%9F/)中，有讲到“错误边界”的相关内容：如果渲染异常，在没有任何降级保护措施的情况下，，页面会直接显示白屏。但是问题到这里并没有结束，在类似“会产生什么影响”或“会造成什么后果”的问题后，紧接着会问“怎么解决”。

**审题：**

从上面的分析中可以整理出两个答题方向：

-   “是什么”，即阐述现象与原理，在描述原理时，也要注意提供相应的案例；
-   “怎么解决”，即从工程化的角度展开，拿出通用化方案，并能量化结果，给出数据与指标。

![](https://pic.imgdb.cn/item/60ea4d435132923bf801de94.jpg)

#### 一、渲染异常是什么？

下面举个例子就能很好的说明：

```js
import React from 'react';
export default class App extends React.Component {
    state = {
        fruits: ["apple","banana","pear","orange"]
    };
    handleClick = () => {
        this.setState({
            fruits: undefined
        })
    };

    render() {
        return (
            <div className="App">
                <ul>
                    {this.state.fruits.map((fruit)=>{
                        <li>{fruit}</li>
                    })}
                </ul>
                <button onClick={this.handleClick}>Make a chaos</button>
            </div>
        )
    }
}
```

这段代码包含了两个部分：

-   渲染this.state.fruits的常规操作
-   按钮点击事件，通过点击按钮将fruits重置为undefined

整段代码运行后，展示的内容如下图所示：  
![](https://pic.imgdb.cn/item/60ea57a45132923bf837e0f5.jpg)

这时如果点击按钮，就会看到熟悉的React报错。这是因为在开发模式下react-error-overlay，所以在代码抛出异常后，能够在页面上直接看见。  
![](https://pic.imgdb.cn/item/60ea58215132923bf83a753e.jpg)

如果是生产模式呢？即直接把代码打包上线，运行在线上会怎么样呢？这时，点击按钮，整个界面会直接消失。

为什么会产生这种现象呢？React官方团队是这样说的：

> 组件内的 JavaScript 错误会导致 React 的内部状态被破坏，并且在下一次渲染时产生可能无法追踪的错误。这些错误基本上是由较早的其他代码（非 React 组件代码）错误引起的，但 React 并没有提供一种在组件中优雅处理这些错误的方式，也无法从错误中恢复。

简而言之，如果有JS的错误出现在React内部渲染层，就会导致整个应用的崩溃。从现象来看，就是整个界面从页面中被移除掉，也就展现出了所谓的白屏。

#### 二、怎么解决渲染异常呢？

在[第3讲“如何避免生命周期中的坑”](https://dengcpu.github.io/2020/12/07/%E9%9D%A2%E8%AF%9503-%E5%A6%82%E4%BD%95%E9%81%BF%E5%85%8D%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E4%B8%AD%E7%9A%84%E5%9D%91%EF%BC%9F/)中有讲到“错误边界”的概念，其中应用了getDerivedStateFromError与componentDidCatch两个函数。但这并不是完整的解决方案，完整的方案通常要从预防和兜底两个角度解决问题。

##### 2.1 预防

预防就需要事先知道病灶在哪里。既然是渲染异常，就需要分析异常会出现在哪里。我们可以知道，在渲染层，也就是render中return后的JSX，都是在进行数据的**拼接**与**转换**

-   如果在拼接的过程出现错误，那直接会导致编译的失败
-   如果在转换的过程出现错误，就很不容易被发现

比如上述案例中的this.state.fruits为undefined就很难发现，尤其是前端的渲染数据基本都是通过后端业务接口获取的，那么数据是否可靠就成了至关重要的问题。

这个问题被称为**null-safety**，也就是空安全。它没有最优解，不仅困扰着我们，也困扰着Facebook这样的大公司，目前他们对于这个问题的解决方案是使用idx。 idx在使用时需要配置Babel插件，再引入idx库，然后通过idx函数包裹需要使用的object，再在回调函数中取需要的值。

```js
import idx from 'idx';
//使用时
function getFriends() {
    return idx(props, _ => _.user.friends[0].friends)
}
//转换后
function getFriends() {
    return props.user == null ? props.user :
    props.user.friends == null ? props.user.friends:
    props.user.friends[0] == null ? props.user.friends[0]:
    props.user.friend[0].friends
}
```

idx的代码既不优雅，也不简洁，还需要引入Babel插件，所以在社区中使用者寥寥无几，还不如使用Lodash的get函数。那么有没有优雅的解决方案呢？ 有，就是ES2020中的Optional chaining 中文叫**可选链操作符**。如果用可选链操作符重新render函数的话，可以写成：

```js
render() 
    return (
        <div className='App'>
            <ul>
                {this.state?.fruits.map((fruit) => {
                    <li>{fruit}</li>
                })}
            </ul>
            <button onClick={this.handleClick}>Make a chaos</button>
        </div>
    )
}
```

并不是所有浏览器都支持该特性，但是可以通过引入Babel插件保证浏览器兼容性：

```js
{
    "plugins": ["@babel/plugin-proposal-optional-chaining"]
}
```

可选链操作符是一个遵循ES标准，侵入性比较低的方案。那么有没有不需要配置的方案呢?也是有的，如果使用TypeScript的话，在3.7版本中可以直接使用该特性。

##### 2.2 兜底

虽然空安全的预防方案足够完善，但我们不可能在每行代码中都使用。而且旧项目的代码，逐行修改费时费力。所以，以防万一，肯定是需要兜底方案的。

兜底应该限制崩溃的层级。错误边界加到哪里，崩溃就止步于哪里，其他组件还可以正常使用，所以只需要给关键的UI组件添加错误边界。这时可以使用我们在[第5讲“如何设计React组件？”](https://dengcpu.github.io/2020/12/17/%E9%9D%A2%E8%AF%9505-%E5%A6%82%E4%BD%95%E8%AE%BE%E8%AE%A1React%E7%BB%84%E4%BB%B6%EF%BC%9F/)中提到的高阶组件：

```js
export const errorBoundary = (WrappedComponent) => {
    return class Wrap extends Component {
        state = {
            hasError: false,
        };
        static getDerivedStateFromError(err) {
            return {
                hasError: true,
            };
        }
        componentDidCatch(err: Error, info: React.ErrorInfo) {
            console.log(err,info)
        }

        render() {
            return (
                this.state.hasError ? <ErrorDefaultUI error={this.state.error} /> : <WrappedComponent>
            )
        }
    }
}
```

用这个高阶组件拦截报错信息，展示统一的错误页面，也就是ErrorDefaultUI。使用起来也很简单，直接在原函数上挂上注解就可以了。

```js
@errorBoundary
export default class UserProfile {

}
```

这个方案可以在团队内部抽取为一个npm包，提供能力复用。

##### 2.3 量化结果

我们做了这么多事情，那如何评估做得好不好呢？就需要数据说话，来评估事情到底有没有价值。

-   在预防层面，需要看空安全方案在项目中覆盖量，从而保证团队内项目都将空安全用了起来
-   在兜底层面，同样需要保证方案在项目中覆盖量，其次需要统计兜底页面成功兜底的次数，最后兜底页面展示时能够及时完成线上报警。

所以，量化工作应该从**覆盖**与**统计**两方向展开：

1.  覆盖量，最简单的方式就是直接查看项目的package.json文件是否引入了相关的库。有的公司代码检测使用统一的工具，比如sonar, 那么你就只需要去写配置文件就行。那如果公司什么没接入呢？你甚至可以用一个最原始简单的方案去实现，比如写一个node脚本，去拉去相关仓库的代码自行分析。然后每周产出一个dashboard查看使用情况
2.  统计，相对容易。因为每个公司至少会接入一种统计工具，比如百度统计、Google统计或者mixpanel来完成业务分析。所以只需要在代码中，添加一行统计代码，直接上报相关信息就行。如果有条件的话，最好也接入一下报警系统，这样能够及时发现问题并上报。
    
    ```js
    componentDidCatch(err: Error, info: React.ErrorInfo) {
        //业务统计
        trackEvent('error boundary', {err, info});
        //业务报警
        reportError(error, info);
    }
    ```
    

**答题：**

> React渲染异常的时候，在没有做任何拦截的情况下，会出现整个页面白屏的现象。它的成型原因是在渲染层出现了JS的错误，导致整个应用崩溃。这种错误通常是在render中没有控制好空安全，使值取到了空值。

> 在治理上，主要从预防与兜底两个角度去处理。  
>   
> 在预防策略上，引入空安全相关的方案。技术选型上主要有三个方案：第一个使引入外部函数，比如Facebook的idx或者Lodash.get;第二个是引入Babel插件，使用ES2020的标准——可选链操作符；第三个是TypeScript，它在3.7版本之后可以直接使用可选链操作符。  
>   
> 在兜底策略上，考虑到团队内部可能存在一样的问题，抽取兜底的公共高阶组件，封装NPM包供团队内部使用。

> （举例）从最终的数据来看，预防与治理方案覆盖了团队内部100%的React项目，前三个月兜底组件统计到了日均10次的报警信息，其中有10%是公司关键业务。那么经过分析与统计，首为关键的ui组件添加兜底组件进行拦截，然后就是做内部培训，对易错点的代码进行指导，加强code review。后续到现在，线上只收到过1次报警。

![](https://pic.imgdb.cn/item/60ea9c975132923bf8d19d93.jpg)
