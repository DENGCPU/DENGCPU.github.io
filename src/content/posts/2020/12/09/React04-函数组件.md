---
title: "React04-函数组件"
date: 2020-12-09T10:03:00
channel: frontend
series: "React"
summary: "React函数组件是编写现代React应用程序的常用方式，自从React Hook被引入之后，使得完全使用函数式组件来编写一个React应用程序成为可能。函数式…"
---

### React Function Components

  React函数组件是编写现代React应用程序的常用方式，自从React Hook被引入之后，使得完全使用函数式组件来编写一个React应用程序成为可能。函数式组件的核心：就是一个返回JSX的JavaScript函数。

#### 一、一个简单的函数组件的例子

函数式组件的例子：

```js
import React from 'react';
function App(){
    const greeting = 'hello function component!';

    return <h1>{greeting}</h1>
}
export default App;
```

从上述代码中，我们可以注意到函数式组件中并没有类class组件里有的render()函数。实际上，函数主体里面定义的内容都是render函数，该函数最后返JSX。

如果想在React函数组件里面，再渲染一个组件，可以像下面这样写：

```js
import React from 'react';

function App(){
    //将Headline组件作为HTML元素，以JSX的方式渲染出来
    return <Headine />
}

function Headeline(){
    const greeting = 'hello function component!';

    return <h1>{greeting}</h1>;
}
export default App;
```

#### 二、函数组件的参数Props

 在React中，props被用于组件与组件之间传递信息（父组件通过props传递信息给子组件）。Essentially props in React are always passed down the component tree;

一个使用props的例子：

```js
import React from 'react';

function App(){
    const greeting = 'hello function component';

    return <Headline value = {greeting} />;
}

function Headline(props){
    return <h1>{props.value}</h1>
}

export default App;
```

由于props通常都是一个对象，我们也可以使用JS 对象解构的方式从props中抽取我们想要的信息。比如上面的Headline组件也可以写成下面的形式：

```js
function Headline({value}){
    return <h1>{value}</h1>
}
//需要解构多个信息出来时：
//function Headline({value1,value2}){...}
```

关于props的更多使用：可以参考[How to pass props to components in React](https://www.robinwieruch.de/react-pass-props-to-component)

#### 三、React 箭头函数组件

 箭头函数组件 Arrow Funciton Components(or Lambda Function Component)，是随着ES6箭头函数的出现，引入到React中的。

用箭头函数重构上面的函数组件例子：

```js
import React from 'react';

const App=()=>{
    const greeting = 'hello function components!';

    return <Headline value={greeting} />
};

const Headline=({value})=>{
    return <h1>{value}</h1>
};

//根据箭头函数的简写规则，上面的Headline可以简写为：
const Headline = ({value}) =>
     <h1>{value}</h1>;

export default App;
```

#### 四、Stateless Function Component

 到目前为止，我们写的例子里都是无状态的函数组件。它们仅仅接收一个props,然后返回一个输出【以JSX：（props)=>JSX】。 这种类型的组件不需要管理state，也没有任何副作用（例如，接受浏览器的本地存储），所以我们称为“Stateless Function Component”，因为它们是无状态的且以一个函数的形式表达出来。然而，React Hooks使得函数式组件有state成为可能。

#### 五、有state的函数组件

 现在我们先移除上面例子中函数组件里的所有props:

```js
import React from 'react';
 
const App = () => {
  return <Headline />;
};
 
const Headline = () => {
  const greeting = 'Hello Function Component!';
 
  return <h1>{greeting}</h1>;
};
 
export default App;
```

这样，使用这个application的用户就没法和它进行任何交互，也无法改变greeting变量。The application is static and not interactive at all。 State就是让React组件变得可交互，React Hooks 帮助我们实现函数式组件也可以使用state。

```js
import React, {useState} from 'react';

const App=()=>{
    return <Headline />;
}

const Headline=()=>{
    const [greeting , setGreeting] = useState(
        'hello function component!'
    );

    return <h1>{greeting}</h1>
};

export default App;
```

useState hook函数将初始状态作为参数，返回一个数组（当前的state是这个数组的第一个元素，用于改变state的函数时这个数组的第二个元素）。我们使用了数组解构的方式来获取这个数组的元素。而且数组解构允许我们自己为变量命名。

现在，让我们添加一个input field 来改变state（使用setGreeting):

```js
import React, {useState} from 'react';

const App=()=>{
    return <Headline />;
}

const Headline=()=>{
    const [greeting , setGreeting] = useState(
        'hello function component!'
    );

    return (
        <div>
            <h1>{greeting}<h1>
            
            <input
                type='text'
                value={greeting}
                onChange={event => setGreeting(event.target.value)}
            />
        </div>
    )
};
export default App;
```

上述代码中，我们通过在input中添加一个event handler，这样当input中的值变化时我们就可以利用回调函数做一些事情。回调函数的参数event是一个拥有当前input域中value值的[synthetic React event](https://reactjs.org/docs/events.html)，亦即event.target.value，被用来更新函数组件的state。后续，我们会将这个onChange事件提取出来。

🐖：这个input field 可以接受这个组件的state值。当我们想控制input的value（state）而不想让原生的HTML元素的内部状态接管input中的值时，我们可以使用组件的state值。这时，这个input就成为了”受控组件”[controlled component](https://www.robinwieruch.de/react-controlled-components)。

#### 六、函数组件：event handler

在第五节中，我们给input元素添加了一个onChange事件，这样我们随时可以观察到input内容的变化。但是上一节中我们使用的是内联的箭头函数给onChange事件赋值。我们可以把它抽取出来作为一个命名函数:

```js
import React, {useState} from 'react';

const App = () =>{
    return <Headline />;
}

const Headline = () =>{
    const [greeting, setGreeting] = useState('hello function component')
}
//这里就是提取出来的命名函数
const handleChange = event =>setGreeting(event.target.value);

return(
    <div>
        <h1>{greeting}</h1>

        <input type='text' value={greeting} onChange = {handleChange} />
    </div>
)

export default App;
```

#### 七、父组件给子组件传值(包括callback function)

在第六节中的例子中，我们把所有的逻辑（包括变量和函数）都放在了子组件，也就是Headline中。父组件没有向子组件传递props,。这一节，我们将把greeting和onChange事件的处理逻辑都放在父组件App中，再通过props传递给子组件Headline。如下所示：

```js
import React,{useState} from 'react';

const App = () =>{
    const [greeting, setGreeting] = useState('hello function component');

    const handleChange = event => setGreeting(event.target.value);

    return (
        <Headline headline = {greeting} onChangeHeadline = {handleChange} />
    )
}

const Headline = ({headline,onChangeHeadline}) => (
    <div>
        <h1>{headline}</h1>

        <input type='text' value={headline} onChange={onChangeHeadline}/>
    </div>
)

export default App;
```

进一步地，我们还可以把input抽取出来，使其到单独成为一个组件。从而，我们有个一个父组件App，两个子组件Headline和Input。父组件向两个子组件传递props:

```js
import React,{useState} from 'react';

const App = () =>{
    const [greeting, setGreeting] = useState('hello function component');

    const handleChange = event =>setGreeting(event.target.value);

    return (
        <div>
            <Headline headline={greeting} />

            <Input value={greeting} onChangeInput={handleChange}>Set Greeting: </Input>
        </div>
    )
};

const Headline = ({headline}) =><h1>{headline}</h1>

const Input = ({value,onChangeInput, children}) =>(
    <label>
    {children}
    <input type='text' value={value} onChange = {onChangeInput} />
    </label>
)

export default App;
```

#### 八、设置props的默认值

当父组件给子组件传递props的时候，我们可以在子组件中为这些props设置默认值（default value）去override传递的值。亦即，当父组件传递的props不为空时，我们就使用传递过来的，否则我们就使用子组件的默认值。

给子组件的props设置默认值,有以下三种方式：

```js
//第一种：
import React from 'react';

const App = () =>{
    const sayHello = () => console.log('hello');

    return <Button handleClick={sayHello} />
};

const Button = ({handleClick}) =>{
    const sayDefault = () => console.log('default');

    const onClick = handleClick || sayDefault;

    return (
        <button type='button' onClick={onClick}>
            Button
        </button>
    )
};

export default App;
```

我们也可以在子组件的函数签名（小括号内）为props设置默认值：

```js
//第二种：
import React from 'react';

const App = () => {
    const sayHello = () =>console.log('Hello');

    return <Button handleClick = {sayHello} />
};

const Button = ({handleClick = ()=>console.log('default')}) => (
    <button onClick={handleClick}>
        Button
    </button>
)

export default App;
```

最后一种，我们也可以通过为函数组件增加defaultProps属性的方式来设置默认值：

```js
//第三种：
import React from 'react';

const App = () => {
  const sayHello = () => console.log('Hello');
 
  return <Button handleClick={sayHello} />;
};
 
const Button = ({handleClick}) =>(
    <button onClick={handleClick}>
        Button
    </button>
);

Button.defaultProps = {
    handleClick: ()=>console.log('default');
}

export default App;
```

#### 九、React组件中的异步函数

让我们先来看一个异步函数的例子：

````js
import React from 'react';

const App = () =>{
    //通过setTimeout实现一个异步延迟执行
    const sayHello = () =>
        setTimeout(()=>console.log('hello'),1000);

    return <Button handleClick = {sayHello} />
};

const Button = ({handleClick}) =>(
    <button onClick={handleClick}>
        Button
    </button>
)

export default App;
``` 

下面再看一个例子，通过使用setTimeout造成延迟执行的情况下，如何更新state。

```js
import React, {useState} from 'react';

const App = () => {
    const [count, setCount] = useState(0);

    const handleIncrement = () =>
            setTimeout(
                //这里很容易写成setCount(count+1),错！
                ()=>setCount(count=>count+1),
                1000
            );
    
    const handleDecrement = () =>
            setTimeout(
                //这里很容易写成setCount(count-1),错！
                ()=>setCount(count=>count-1),
                1000
            );

    return (
        <div>
            <h1>{count}</h1>
            <Button handleClick={handleIncrement}>增加1</Button>
            <Button handleClick={handleDecrement}>减少1</Button>
        </div>
    );

    const Button = ({handleClick,children}) =>(
        <button onClick={handleClick}>{children}</button>
    );

export default App;
````

注意观察上述代码是如何更新当前的count值的，我们通过使用setCount 状态函数来更新state。由于来源于useState的setter function 本质上是异步执行的，因此必须确保是对当前状态而不是任何过时状态执行更新。

了解更多，可参考 [how to fetch data with Function Components with React Hooks.](https://www.robinwieruch.de/react-hooks-fetch-data)

#### 十、函数组件中的生命周期实现——LifeCyrcle

如果你之前使用过类组件，一定用过componentDidMout、componentWillUnmount、shouldComponentUpdate等生命周期方法。但是在函数组件中没有这些方法，让我们看看如何在函数式组件中实现它们。

首先，在函数组件中没有constructor。在类组件中，constructor通常被用来设置initial state。但是在函数组件中我们使用useState hook就可以设置initial state，并且可以同时得到一个setter function 用于之后的业务逻辑。  
![](https://pic.downk.cc/item/5fd185883ffa7d37b3e1c35a.jpg)

**1.Funcitonal Component: Mount**

react组件在第一次渲染的时候，会有一个mounting的阶段。如果你想在函数式组件里，当组件**did mount**的时候执行一些逻辑，可以使用**useEffect** hook:

```js
import React ,{ useState, useEffect} from 'react';

const App = () =>{
    const [count, setCount] = useState(0);

    const handleIncrement = () =>
        setCount(currentCount => currntCount+1);
    
    const handleDecrement = () =>
        setCount(currentCount => currntCount-1);

    useEffect(()=>setCount(currentCount => currentCount + 1),[]);

    return (
        <div>
            <h1>{count}</h1>

            <button onClick={handleIncrement}>Increment</button>

            <button onClick={handleDecrement}>Decrement</button>
        </div>
    )
};

export default App;
```

当我们运行这段代码的时候，这个组件第一次渲染时会显示count的初始状态值0，然后当component did mount后，Effect hook 会将count设置为1。

🐖：Effect hook中的第二个参数（1个空数组）是非常重要的，它确保了只有在这个组件加载（mount)或者组件卸载（unmount)时才触发事件。如果不小心漏掉了这个空数组，我们会陷入count不断加1的死循环，因为当state更新了Effect hook总是会执行。然后Effect执行又会触发state更新，这样就会不停地对count+1  
todo: 这里为什么要用空数组而不是别的呢？？

**2.Funcitonal Component: Update**

每次当入参props或者是组件本身的state变化时，react组件就会重新渲染以展示最新的status(from props and state)。在函数式组件中，一次render会执行函数体的所有内容。

如果函数组件没有正确地按照预期更新，我们可以在组件中使用console.log控制台输出state和props的值来debug。如果这两者的值都没有发生变化，就不会有新的render执行。  
![](https://pic.downk.cc/item/5fd1ca843ffa7d37b32b3cee.jpg)

如果我们想对组件重新渲染进行操作，我们可以再一次使用 Effect Hook (在组件did update之后)：

```js
import React, {useEffect, useState} from 'react';

const App = () =>{
    //count的初始值来源于本地存储中的值或0
    const initialCount = +localStorage.getItem('storageCount')||0;
    const [count,setCount]=useState(initialCount);

    const handleIncrement = () =>
        setCount(currentCount => currentCount + 1);
 
    const handleDecrement = () =>
        setCount(currentCount => currentCount - 1);
    //每次组件重新渲染时，count都会被存入浏览器的本地存储
    useEffect(()=>localStorage.setItem('storageCount',count));

    return (
        <div>
            <h1>{count}</h1>

            <button onClick={handleIncrement}>+1</button>

            <button onClick={handleDecrement}>-1</button>
        </div>
    )
}

export default App;
```

你还可以通过给Effect Hook 传递第二个参数（是个数组）的方式，来控制它什么时候运行。每当第二个参数中的变量发生变化时，Effect Hook就会run。下面这个例子，只有当count发生变化的时候，才将其存入localStorage:  
![](https://pic.downk.cc/item/5fd1cdb33ffa7d37b32ef914.jpg)

现在我们可以总结，Effect Hook函数中第二个参数值的用法：（通过第二个参数值来控制它何时run)

-   every time(no argument，不传第二个参数)
-   only on mount or unmount (\[\]argument, 空数组)
-   only when a certain variable changes(例如\[count\]，数组中放入指定变量)

🐖：forceUpdate API可以强制让组件重新渲染，但是我们应该谨慎使用 ，参考[forceUpdate](https://zh-hans.reactjs.org/docs/react-component.html#forceupdate)以及 [Is there something like forceUpdate](https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate)

#### 十一、纯函数组件——Pure React Funtion Component

类组件中，可以通过使用PureComponent 或者 shouldComponentUpdate 来避免重新渲染导致的性能瓶颈【[avoid performance bottlenecks in React by preventing rereders](https://www.robinwieruch.de/react-prevent-rerender-component)】。让我们先看一个例子：

```js
import React, { useState } from 'react';

const App =()=>{
    const [greeting,setGreeting]=useState('hello react');
    const[count,setCount]=useState(0);

    const handleIncrement = ()=>
        setCount(currentCount=>currentCount+1);

    const handleDecrement = ()=>
        setCount(currentCount=>currentCount-1);
    
    const handleChange = event => setGreeting(event.target.value);

    return (
        <div>
            <input onChange={handleChange} />

            <Count count={count} />
            <button onClick={handleIncrement}>Increment</button>
            <button onClick={handleDecrement}>Decrement</button>
        </div>
    )
};

const Count=({count})=>{
    console.log('Does it (re)render?');

    return <h1>{count}</h1>
}
export default App;
```

在这个例子中，每当我们向input输入框输入内容时，这个App组件就会更新它的stater然后重新渲染。与此同时，Count组件也会重新渲染（在控制台中我们可以看到，每次我们在输入框里操作，就会打印“Does it (re)render?”这句）。为了避免这种情况，react函数组件使用React Memo【[React’s top level APIs](https://reactjs.org/docs/react-api.html)】来阻止当props没有变化时的重新渲染。

```js
import React,{useState, memo} from 'react';

const APP=()=>{
    const [greeting,setGreeting] = useState('hello react');
    const [count, setCount] = useState(0);

    const handleIncrement = () =>
        setCount(currentCount => currentCount + 1);
 
    const handleDecrement = () =>
        setCount(currentCount => currentCount - 1);
 
  const handleChange = event => setGreeting(event.target.value);
 
  return (
    <div>
      <input type="text" onChange={handleChange} />
 
      <Count count={count} />
 
      <button type="button" onClick={handleIncrement}>
        Increment
      </button>
      <button type="button" onClick={handleDecrement}>
        Decrement
      </button>
    </div>
  );
}

//memo时把整个箭头函数的内容包裹起来
const Count = memo(({count}) => {
    console.log('does it (re)render?');

    return <h1>{count}</h1>
});

export default App;
```

现在我们再来运行这个程序，当我们向input输入框输入内容时，只有App组件会rerender, Count组件不再rerender了！当然，这种性能优化不应该作为默认设置。当重新渲染组件时间过长遇到问题时可以进行类似的检查。（比如，rendering和updating Table组件中的大量内容）

#### 十二、React Function Component: Ref

refs一般只在少数场景下使用：

-   管理焦点，文本选择或者时媒体播放
-   触发强制动画
-   集成第三方DOM库

在函数式组件中使用refs，要引入useRef。下面这个例子，input输入框将获得焦点（after component did mount)

```js
import React,{useState, useEffect, useRef} from 'react';

const App=()=>{
    const [greeting, setGreeting] = useState('hello React！');

    const handleChange = event =>setGreeting(event.target.value);

    return(
        <div>
            <h1>{greeting}</h1>
            <Input value={greeting} handleChange={handleChange} />
        </div>
    )
};

const Input=({value,handleChange})=>{
    const ref=useRef();

    useEffect(()=>ref.current.focus(),[]);

    return (
        <input 
            type='text' 
            value={value} 
            onChange={handleChange} 
            ref={ref}
        />
    )
};

export default App;
```

但是不能给一个函数组件提供一个ref作为props的一部分！The ref will be assigned to the component but not to the actual DOM node!  
![](https://pic.downk.cc/item/5fd1e2873ffa7d37b34ab442.jpg)

这样写会报错！因为ref指代的不是一个真实的dom节点，而是一个组件实例。

![](https://pic.downk.cc/item/5fd1e2e03ffa7d37b34b4e87.jpg)

从上面的例子也可以看出，我们并不推荐父组件向子组件传递一个ref，这也就是为什么我们说”React function component can’t have refs”。然而，如果我们不得不向一个函数组件传递一个ref(例如，我们想测量一个函数组件DOM节点的数量)，这种情况下我们可以[forward the ref](https://reactjs.org/docs/forwarding-refs.html)

![forwardRef](https://pic.downk.cc/item/5fd1e4643ffa7d37b3519759.jpg)

想知道更多关于ref的问题，可以参考[How to use Ref in React](https://www.robinwieruch.de/react-ref-attribute-dom-node) 以及 [React 官方文档——Refs and the DOM](https://reactjs.org/docs/refs-and-the-dom.html)

全文参考：[React Function Components](https://www.robinwieruch.de/react-function-component)
