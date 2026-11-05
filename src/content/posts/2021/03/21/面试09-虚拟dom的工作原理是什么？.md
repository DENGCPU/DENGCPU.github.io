---
title: "面试09-虚拟dom的工作原理是什么？"
date: 2021-03-21T20:31:00
channel: frontend
series: "React 面试"
summary: "破题："
---

### 面试场景9：Virtual DOM的工作原理是什么？

**破题**：

Virtual DOM,简称VDOM，也被称为虚拟DOM。在[面试场景2：“为什么React要用JSX”](https://dengcpu.github.io/2020/12/02/%E9%9D%A2%E8%AF%9502-%E4%B8%BA%E4%BB%80%E4%B9%88React%E8%A6%81%E7%94%A8JSX%EF%BC%9F/)中，我们已经提到了，为了更便捷高效地使用声明式开发组件，引入了XML语法结构的JSX。JSX经过编译后会生成类似React.createElement函数包裹标签及属性。那么这里的React.createElement函数所返回的就是一个虚拟DOM。虚拟DOM并不是只有React才有，只是经过React的发扬光大，变得很流行。 同样地，vue从1.0到2.0，最大的变化就是引入了虚拟DOM。那么虚拟DOM为什么能够引起关注，触发流行呢？

**承题**：

![虚拟DOM工作原理思维导图](https://pic.imgdb.cn/item/60de89615132923bf8f3206c.jpg)

答题的框架如上图所示，除了基础部分的“讲说理列”之外，还要尽量回答出虚拟DOM流行的原因。

#### 一、虚拟DOM的由来 （历史）

React的原型是XHP，FaceBook创建XHP的目的主要有两点：

1.  **简化前端开发**，按照现在流行的说法叫后端赋能，让后端开发人员可以快速交付页面。
2.  **避免跨站点脚本攻击**，也就是避免XSS攻击。XSS不会直接攻击网页，而是通过嵌入JS代码的方式，将恶意攻击附加到用户的请求中来攻击用户。它可以别用作窃取用户信息，或者恶意增删用户的一些资料。而XHP的优势在于默认启用XSS把保护。

所有的页面在XHP中构建完成，并没有直接的HTML，都是通过**转义的方式**生成的。这样的过程确保可以在XHP中写出安全的静态页面，但是如果需要构建动态的网页应用就会出现一些问题。一旦状态发生更改，网页就需要重新渲染，从而丢失之前网页中的信息。Facebook团队意识到，这个问题对也页面性能和用户体验来说是非常糟糕的。这就使得他们产生了思考：为什么仅仅因为状态的改变，就不得不重新渲染整个页面？ 最后出现了React的最初构想：不再基于XHP，而是基于JS的用户界面搭建。  
…  
回顾这段历史，就会发现Facebook一开始的初衷是**简化前端开发、防止XSS**。它的解决方案也很粗暴，就是不要直接操作DOM，而是通过虚拟DOM规避风险。因为直接操作DOM可能会带来XSS的风险，也可能因为技术水平的限制带来性能问题。如果你不想让一个东西被外人触碰，最好的方式就是把它封起来，与使用者隔离，这就是我们今天看到的虚拟DOM。

#### 二、虚拟DOM到底长什么样子？

先整理下之前关于虚拟DOM的内容：

-   在JSX的使用中，JSX所描述的结构会被转移为React.createElement函数，大致像这样：
    
    ```js
    // JSX描述
    <input type="button" />
    //Babel 转译后
    React.createElement('input',{type: "button"})
    ```
    
-   React会持有一棵虚拟DOM树，在状态更新后，会触发虚拟DOM树的修改，再以此为基础修改真实DOM。
    

根据上述条件，可以很快得出结论：React.createElement的返回结果应该是一个JS Object。由于是树结构，所以一定包含一个children字段，来建立与子级的关系。所以可以推测出它的结构像下面这样：

```js
// 推测出的DOM结构
{
    tag: 'input',
    props: {
        type: 'button'
    },
    children: []
}
```

基于基本认知，React有两个函数：

-   diff函数，去**计算**状态变更前后的虚拟DOM树差异；
-   渲染函数，**渲染**整个虚拟DOM树或者处理差异结点。

现在应该可以理解为什么有React和ReactDOM两个库了。正是由于计算与渲染的分工，在日常的开发中，需要同时引入React和ReactDOM两个库：

```js
import React from 'react';
import ReactDOM from 'react-dom';
ReactDOM.render(<h1>hello</h1>, document.getElementById('root'));
```

其中React库主要的工作是组件实现、更新调度；而ReactDOM提供了在网页上渲染的基础。

也正是因为这样的划分，当React向ios/Android开发时，只需要通过React Native提供Native层的元素渲染即可完成。

#### 三、虚拟DOM的优势

从上面的内容进行整理，似乎可以总结出虚拟DOM有以下优势：

-   性能优越；
-   规避XSS；
-   可跨平台

但是这样笼统的回答是不合适的，有的面试官会问：“虚拟DOM一定比真实的DOM操作性能更高吗？”，其实不是！如果只是修改一个按钮的文案，那么虚拟DOM的操作无论如何都不可能比真实的DOM更快。所以，一定要回到具体的场景进行讨论。  
如果大量的直接操作DOM则容易引起**网页性能**的下降，这时React基于虚拟DOM的diff处理与批处理操作，可以降低DOM的操作范围与频次，提升页面性能。在这样的场景下虚拟DOM就比较快，但是像首次渲染或微量操作，虚拟DOM的渲染速度就会比真实DOM更慢！（这里可参考 [虚拟DOM一定比真实DOM性能好吗？-尤雨溪的回答](https://www.zhihu.com/question/31809713/answer/53544875)

那么虚拟DOM一定可以**规避XSS**吗？虚拟DOM内部确保了字符转义，所以确实可以做到这点，但是React存在风险，因为React留有dangerousSetInnerHTMLAPI绕过转义。

没有虚拟DOM不能实现**跨平台**吗？比如NativeScript没有虚拟DOM层，它是通过提供兼容原生API的JS API实现跨平台开发。那么虚拟DOM的优势在哪里？实际上，虚拟DOM真正的优势在于跨平台的成本更低。在React Native之后，前端社区从虚拟DOM中体会到了跨平台的无限前景，所以在后续的发展中，都借鉴了虚拟DOM。比如：社区流行的小程序同构方案，在构建过程中会提供类似虚拟DOM的结构描述对象，来支撑多端转换。

#### 四、虚拟DOM的缺点

社区公认的虚拟DOM缺点主要有两个：

-   **内存占用较高**。因为当前网页的虚拟DOM包含了真实DOM的完整信息，而且由于是Object，其内存占用肯定会有所上升。
-   **无法进行极致优化**。虽然虚拟DOM足以应对绝大部分应用的性能需求，但在一些性能要求较高的应用中，虚拟DOM取法进行针对性的极致优化。比如，类似于Google Earth的场景。

**答题：**

> 虚拟DOM的**工作原理**是通过JS对象模拟DOM的节点。在Facebook构建React初期时，考虑到要提升代码抽象能力、避免认为的DOM操作、降低代码整体风险等因素，所以引入了虚拟DOM。

> 虚拟DOM的**实现**通常时Plain Object,以React为例，在render函数中写的JSX会在Babel插件的作用下，编译为React.createElement执行JSX中的属性参数。  
> React.createElement执行完后会返回一个Plain Object，它会描述自己的tag类型、props属性以及children情况等。这些Plain Object通过树结构组成一颗虚拟DOM树。当状态发生变更时，将变更前后的虚拟DOM树进行差异对比，这个过程叫diff，生成的结果叫patch。计算之后，会渲染patch完成对真实DOM的操作。

> 虚拟DOM的**优点**主要有三点：改善大规模DOM操作的性能、规避XSS风险、能以较低的成本实现跨平台开发。  
> 虚拟DOM的**缺点**在社区中主要有两点：1.内存占用较高，因为需要模拟整个网页的真实DOM。2.高性能应用场景存在难以优化的情况，类似于Google Earth等高性能应用在技术选型上往往不会选择React。

![虚拟DOM工作原理解答](https://pic.imgdb.cn/item/60dec8d85132923bf883ec77.jpg)

补充：  
除了渲染页面，虚拟DOM还有哪些应用场景？  
答：只要记录了真实DOM变更，虚拟DOM甚至还可以应用于**埋点统计**与**数据记录**
