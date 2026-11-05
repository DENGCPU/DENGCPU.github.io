---
title: "面试06-setState是同步更新还是异步更新？"
date: 2020-12-22T19:20:00
channel: frontend
series: "React 面试"
summary: "分析问题：“是A还是B”是一个面试中经常问的问题，这种题可能在不同的场景中会有不同的选择："
---

#### 面试场景6：setState是同步更新还是异步更新？

分析问题：“是A还是B”是一个面试中经常问的问题，这种题可能在不同的场景中会有不同的选择：

-   可能是A
-   也可能是B
-   甚至是A和B同时存在

所以需要把问题放在具体的场景中探讨，一定不要想当然，不要觉得肯定是XXX啊。在面对类似的问题，要先把场景理清楚，再思考如何回答。

回到setState本身上来，setState用于变更状态，触发组件重新渲染，更新试图UI。在分析场景之前，需要先了解一个概念合成事件，它也经常在React面试中被问到。合成事件与setState的触发有千丝万缕的联系。

#### 一、合成事件

在没有合成事件之前，大家是怎么处理事件的呢？先看一个很常见的场景：假设ul标签下有10000个li标签，现在需要添加点击事件，通过点击li获取当前li标签中的文本。之前大家的做法是：为每一个li标签添加onclick事件。

```js
<ul>
    <li onclick='getText(this')>1</li>
    <li onclick='getText(this')>2</li>
    <li onclick='getText(this')>3</li>
    ...
    <li onclick='getText(this')>10000</li>
</ul>
```

这是一种非常不友好的方式，会对页面的性能产生影响。

如何优化呢?最恰当的处理方式是采用事件委托。通过将事件绑定在ul标签上，当li被点击的时候，由事件冒泡到父级的ul标签上触发，并在ul的onclick事件中，确认是哪一个li标签触发的点击事件。

```html
<ul id='test'>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    ...
    <li>10000</li>
</ul>
<script>
    function getEventTarget(e) {
        //处理兼容性
        e = e||window.event;
        return e.target || e.srcElement;
    }
    var ul = document.getElementById('test');
    ul.onclick = function(event){
        var target = getEventTarget(event);
        alert(target.innerHTML);
    }
</script>
```

同样地，出于性能考虑，合成事件也是类似的做法：

1.  React给document挂上事件监听
2.  DOM事件触发后冒泡到document
3.  React找到对应的组件，造成一个合成事件出来
4.  并按组件树模拟一遍事件冒泡

![React17之前的事件冒泡流程图](https://pic.downk.cc/item/5fe1dd603ffa7d37b37d3071.jpg)

由于事件挂在了document上，这样在一个页面中只能有一个版本的react。如果有多个版本，事件就乱套了。React17中解决了这个问题，事件委托不再挂在document上，而是挂在DOM容器上，也就是ReactDOM.render所调用的根节点上。  
![React17后的事件冒泡流程图](https://pic.downk.cc/item/5fe1de423ffa7d37b37e2fb4.jpg)

那么到底哪些事件会被捕获生成事件呢？可以从React的源码中一探究竟。下面的测试快照中罗列了大量的事件名，只有这些事件会被捕获成合成事件。

```js
// react/packages/react-dom/src/__tests__/__snapshots__/ReactTestUtils-test.js.snap

Array [
    	  "abort",
	  "animationEnd",
	  "animationIteration",
	  "animationStart",
	  "auxClick",
	  "beforeInput",
	  "blur",
	  "canPlay",
	  "canPlayThrough",
	  "cancel",
	  "change",
	  "click",
	  "close",
	  "compositionEnd",
	  "compositionStart",
	  "compositionUpdate",
	  "contextMenu",
	  "copy",
	  "cut",
	  "doubleClick",
	  "drag",
	  "dragEnd",
	  "dragEnter",
	  "dragExit",
	  "dragLeave",
	  "dragOver",
	  "dragStart",
	  "drop",
	  "durationChange",
	  "emptied",
	  "encrypted",
	  "ended",
	  "error",
	  "focus",
	  "gotPointerCapture",
	  "input",
	  "invalid",
	  "keyDown",
	  "keyPress",
	  "keyUp",
	  "load",
	  "loadStart",
	  "loadedData",
	  "loadedMetadata",
	  "lostPointerCapture",
	  "mouseDown",
	  "mouseEnter",
	  "mouseLeave",
	  "mouseMove",
	  "mouseOut",
	  "mouseOver",
	  "mouseUp",
	  "paste",
	  "pause",
	  "play",
	  "playing",
	  "pointerCancel",
	  "pointerDown",
	  "pointerEnter",
	  "pointerLeave",
	  "pointerMove",
	  "pointerOut",
	  "pointerOver",
	  "pointerUp",
	  "progress",
	  "rateChange",
	  "reset",
	  "scroll",
	  "seeked",
	  "seeking",
	  "select",
	  "stalled",
	  "submit",
	  "suspend",
	  "timeUpdate",
	  "toggle",
	  "touchCancel",
	  "touchEnd",
	  "touchMove",
	  "touchStart",
	  "transitionEnd",
	  "volumeChange",
	  "waiting",
	  "wheel",
]
```

#### 二、调用顺序

setState是不是异步的？我们从头梳理

**异步场景**

通常情况我们认为setState是异步的，看一个简单的例子：

```js
class Test extends Component {

    state = {
        count: 0
    }

    componentDidMount(){

        this.setState({

           count: 1

         }, () => {

            console.log(this.state.count) //1

         });

        console.log(this.state.count) // 0

    }
    render(){
          ...
    }

}
```

由于我们认为setState是异步的，所以会认为回调函数是异步回调，控制台先输出0后输出1。  
再看一个例子：

```js
class Test extends Component {

    state = {

        count: 0

    }

    componentDidMount(){

        this.setState({

           count: this.state.count + 1

         }, () => {

            console.log(this.state.count) //1

         });

         this.setState({

           count: this.state.count + 1

         }, () => {

            console.log(this.state.count) //1

         });

    }
    render(){
        ...
    }
}
```

在这个例子中，连续调用两次setState，但是React在同一个周期内会对多个setState进行批处理。相同于：

```js
Object.assign(
    previousState,
    {count: state.count + 1},
    {count: state.count + 1}
)
```

后调用的setState()将覆盖同一周期内先调用setState的值，因此count其实只增加1次。如果后续状态取决于当前状态，setState(updater\[,callback\]) 中的第一个参数建议使用函数形式的代替。

```js
this.setState((state) => {
    return {count: state.count + 1}
})
```

再看一个具有迷惑性的例子：

```js
class Test extends Component {

    state = {

        count: 0

    }

    componentDidMount(){
        //第一次setState
        this.setState(

          preState=> ({

            count:preState.count + 1

        }),()=>{

           console.log(this.state.count);//2

        });
        //第二次setState
        this.setState(

          preState=>({

            count:preState.count + 1

        }),()=>{

           console.log(this.state.count);//2

        });

    }

    render(){

        ...

    }
}
```

这里为什么又会输出2，2呢？当调用seState函数时，就会把当前的操作放入一个队列中。React根据队列内容，**合并state数据**，合并完成后再逐一执行回调，根据结果渲染虚拟DOM，触发渲染.所以回调时,state已经合并计算完成了,输出的结果就是2, 2了。

为什么React团队采用这样一种行为模式，而不是同步进行呢？一种常见的说法是：为了优化。通过异步操作的方式，累计更新后批量合并处理，减少渲染次数，提升性能。但是同步就不能批量处理吗？github上有人提出了[为什么setState是异步的](https://github.com/facebook/react/issues/11527)这个问题，官方团队进行了回答：

1.  保持内部一致性。如果改为同步更新的方式，尽管setState变成了同步，但是props不是（you can’t know props until you rerender the parent component ,and if you do this synchronously, batching goes out of the window–props是同步的话，批处理将无法进行）
    
2.  为后续的架构升级启用并发更新。为了完成异步渲染，react会在setState时，根据它们的数据来源分配不同的优先级，这些数据来源有：事件回调句柄、动画效果等，再根据优先级并发处理，提升渲染性能。
    

从React17的角度分析，异步的设计是合理的，它可以使得异步渲染等最终能在React落地。那什么情况下它是同步的呢？

#### 三、同步场景

上面的异步场景让我们觉得：setState是异步的，但是下面这个案例中，将setState放在setTimeout中，情况又完全不同了。

```js
class Test extends Component {

    state = {

        count: 0

    }

    componentDidMount(){

        this.setState({ count: this.state.count + 1 });

        console.log(this.state.count);//0

        setTimeout(() => {

          this.setState({ count: this.state.count + 1 });

          console.log("setTimeout: " + this.state.count); //1

        }, 0);

    }

    render(){

        ...

    }

}
```

为什么会输出0，1呢？因为setState并不是真正的异步函数，**它实际上是通过队列延迟执行操作实现的**，通过isBatchingUpdates来判断setState是先存进state队列还是直接更新。isBatchingUpdates值为true,则执行异步操作，isBatchingUpdates值为false,则直接更新。  
![setState的执行机制](https://ae02.alicdn.com/kf/Hae4f7b71dba44f14b0405b74c565c191R.png)

在onClick,onFocus等事件中，由于合成事件封装了一层，所以可以将isBatchingUpdates的状态更新为true; 在React自己的生命周期和合成事件中，可以拿到isBatchingUpdates的控制权，将状态放进队列，控制执行节奏。而在外部的原生事件中，并没有外层封装和拦截，无法更新isBatchingUpdates的状态为true。这就造成isBatchingUpdates的状态只会为false, 且立即执行。所以在addEventListener、setTimeout、setInterval这些原生事件中都会同步更新。

#### 四、回答问题

> setState 并非真异步，只是看上去像异步。在源码中，通过isBatchingUpdates来判断setState 是先存进 state 队列还是直接更新，如果值为 true 则执行异步操作，为 false 则直接更新。
> 
> 那么什么情况下 isBatchingUpdates 会为 true 呢?
> 
> A. 在 React 可以控制的地方，就为 true，比如在 React 生命周期事件和合成事件中，都会走合并操作，延迟更新的策略。
> 
> B. 但在 React 无法控制的地方，比如原生事件，具体就是在 addEventListener 、setTimeout、setInterval 等事件中，就只能同步更新。
> 
> 一般认为，做异步设计是为了性能优化、减少渲染次数，React 团队还补充了两点。
> 
> 1.  保持内部一致性。如果将 state 改为同步更新，那尽管 state 的更新是同步的，但是 props不是。
>     
> 2.  启用并发更新，完成异步渲染。
>     

可以看出，setState是异步还是同步的关键在于：更新队列。将上述过程整理为思维导图如下：

![setState的执行场景](https://ae02.alicdn.com/kf/Hac1e627114684a4db843b27cdfaf12edm.png)

进阶 — 再看一道题

```js
class Test extends React.Component {

  state  = {

      count: 0

  };

    componentDidMount() {

    this.setState({count: this.state.count + 1});

    console.log(this.state.count);//0

    this.setState({count: this.state.count + 1});

    console.log(this.state.count);//0

    setTimeout(() => {

      this.setState({count: this.state.count + 1});

      console.log(this.state.count);//2

      this.setState({count: this.state.count + 1});

      console.log(this.state.count);//3

    }, 0);

  }

  render() {

    return null;

  }

};
```

输出：0 0 2 3

分析：

-   首先第一次和第二次的 console.log，都在 React 的生命周期事件中，所以是异步的处理方式，则输出都为 0；
-   而在 setTimeout 中的 console.log 处于原生事件中，所以会同步的处理再输出结果，但需要注意，虽然 count 在前面经过了两次的 this.state.count + 1，但是由于前面说的批处理和覆盖的特点，setTimeout中拿到的值是1，那么后续在 setTimeout 中的输出则是 2 和 3
