---
title: "面试02-为什么React要用JSX？"
date: 2020-12-02T15:34:00
channel: frontend
series: "React 面试"
summary: "针对”为什么采用改技术方案？”类型的题，其实主要在考察两个方面："
---

#### 面试场景2：为什么React要用JSX？（论证题）

 针对”为什么采用改技术方案？”类型的题，其实主要在考察两个方面：

-   技术广度，深挖知识面涉猎广度，对流行框架的模板方案是否知悉了解。
-   技术方案调研能力

所以，针对这类问题，可以采用 “一句话解释，核心概念，方案对比” 三步走的技巧来作答：

1、一句话解析JSX。用一句话说清楚JSX到底是什么。  
2、核心概念。JSX用于解决什么问题？如何使用？  
3、方案对比。与其他方案进行对比，说明React选用JSX的必要性。

##### 一、一句话解释

 按照React官方解释，**JSX是一个JavaScript的语法扩展，或者说是一个类似于XML的ECMAScript语法扩展**，它本身没有太多的语法定义，也不期望引入更多的标准。

##### 二、核心概念

 其实React本身并不强制使用JSX，在没有JSX的时候，React实现一个组件依赖于使用React.createElement函数。代码如下：

```js
class Hello extends React.Component{
    render(){
        return React.createElment(
            'div',
            null,
            `Hello ${this.props.toWhat}`
        );
    }
}
ReactDOM.render(
    React.createElement('Hello,{toWhat:'World'}),
    document.getElementById('root')
)
```

而JSX更像是语法糖，通过类似XML的描述方式，描写函数对象。采用JSX之后，上述代码会变成如下：

```js
class Hello extends React.Component{
    render(){
        return <div>Hello,{this.props.toWhat}</div>
    }
}
ReactDOM.render(<Hello toWhat='world'/>,document.getElementById('root'))
```

通过这样对比，显然可以看出，**JSX使得代码变得更为简洁，而且代码结构层次更为清晰。**

因为React需要将组件转化为虚拟DOM树，所以我们手写代码时，其实是在手写一颗结构树。而XML在树结构的描述上天然具有可读性强优势。  
🐖：实际在运行的时候，会使用Babel插件将JSX语法的代码还原为React.createElement的代码。

##### 三、方案对比

**1.React设计初衷**

React的设计初衷是：关注点分离（Separation of concerns)。在React种，关注点的基本单位是组件。React单个组件时高内聚的，而组件与组件之间时低耦合的。

> 关注点分离：是计算机科学里面的一个重要概念。主要思想是将代码分隔为不同部分，每一部分都有各自的关注点。优点： 当关注点分开时，各部分可以重复使用，独立开发和更新。具有特殊价值的部分能够稍后改进或修改一段代码，而无须知道其他部分的细节做出的相应更改。

**2.React为什么不使用模板呢？**

React团队认为引入模板是一种不佳的实现。因为模板分离了技术栈，而非关注点的模板同时又引入了很多的概念，比如新的模板语法、模板指令等。以AngularJS为例，可以看下有多少新概念：

```js
<!doctype html>

<html ng-app="docsBindExample">

  <head>

    <script src="http://code.angularjs.org/1.2.25/angular.min.js"></script>

    <script src="script.js"></script>

  </head>

  <body>

    <div ng-controller="Ctrl1">

      Hello <input ng-model='name'> <hr/>

      <span ng-bind="name"></span> <br/>

      <span ng:bind="name"></span> <br/>

      <span ng_bind="name"></span> <br/>

      <span data-ng-bind="name"></span> <br/>

      <span x-ng-bind="name"></span> <br/>

    </div>

  </body>

</html>

angular.module('docsBindExample', [])

  .controller('Ctrl1', function Ctrl1($scope) {

    $scope.name = 'Max Karl Ernst Ludwig Planck (April 23, 1858 – October 4, 1947)';

  });
```

看完会发现这段代码很难懂，因为它引入了非常多的AngularJS独有的概念，但是JSX却不会有很多新概念，它依然是JavaScript，就连条件表达式和循环都仍然是JavaScript的方式。

```js
const App=(props)=>{
    return(
        <div>
            {props.isShow?<a>show</a>:<a>hidden</a>}
            {props.names.map(name=><a>{name}</a>)}
        </div>
    )
}
```

这样比较下来，可以看出React代码更简洁，更具有可读性，更贴近HTML。

那模板字符串也可以套用HTML，为什么不用模板字符串呢？

**3.React为什么不使用模板字符串呢？**

来看一个模板字符串的例子：

```js
var box = jsx`

  <${Box}>

    ${

      shouldShowAnswer(user) ?

      jsx`<${Answer} value=${false}>no</${Answer}>` :

      jsx`

        <${Box.Comment}>

         Text Content

        </${Box.Comment}>

      `

    }

  </${Box}>

`;
```

显然代码结构还是非常复杂（存在多次内部嵌套），也不利于开发工具的代码提示。

**4.React为什么不使用JXON呢？**

JXON很像目前使用的JSX，它的结构如下：

```js
<catalog>

  <product description="Cardigan Sweater">

   <catalog_item gender="Men's">

     <item_number>QWZ5671</item_number>

     <price>39.95</price>

     <size description="Medium">

       <color_swatch image="red_cardigan.jpg">Red</color_swatch>

       <color_swatch image="burgundy_cardigan.jpg">Burgundy</color_swatch>

     </size>

     <size description="Large">

       <color_swatch image="red_cardigan.jpg">Red</color_swatch>

       <color_swatch image="burgundy_cardigan.jpg">Burgundy</color_swatch>

     </size>

   </catalog_item>

   <catalog_item gender="Women's">

     <item_number>RRX9856</item_number>

     <discount_until>Dec 25, 1995</discount_until>

     <price>42.50</price>

     <size description="Medium">

       <color_swatch image="black_cardigan.jpg">Black</color_swatch>

     </size>

   </catalog_item>

  </product>

  <script type="text/javascript"><![CDATA[function matchwo(a,b) {

    if (a < b && a < 0) { return 1; }

    else { return 0; }

}]]></script>

</catalog>
```

最后放弃JXON这一方案的原因是，大括号不能作为元素在树种开始和结束的位置，无法提供很好的语法提示。

最后总结下，React为什么使用JSX?

![react使用JSX原因](https://pic.downk.cc/item/5fc752d5394ac523789ece3c.jpg)

\==答题==：

> 首先，JSX 是一个 JavaScript 的语法扩展，结构类似 XML。  
> （JSX 主要用于声明 React 元素，但 React 中并不强制使用 JSX。即使使用了 JSX，也会在构建过程中，通过 Babel 插件编译为 React.createElement。所以 JSX 更像是 React.createElement 的一种语法糖。  
> React团队并不想引入JavaScript本身以外的开发体系，而是希望通过合理的关注点分离保持组件开发的纯粹性。）

> 然后，是JSX与其他三种技术方案的对比：  
> 1.模板。 React 团队认为模板不应该是开发过程中的关注点，因为引入了模板语法、模板指令等概念，是一种不佳的实现方案。  
> 2.模板字符串。 模板字符串编写的结构会造成多次内部嵌套，使整个结构变得复杂，并且优化代码提示也会变得困难重重。  
> 3.JXON。 同样因为代码提示困难的原因而被放弃

✨所以，React选择了JSX，因为JSX与其设计思想最为吻合，不需要引入过多的新概念，对编辑器代码提示也很友好。
