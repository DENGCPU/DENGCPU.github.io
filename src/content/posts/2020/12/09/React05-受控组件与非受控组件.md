---
title: "React05-受控组件与非受控组件"
date: 2020-12-09T19:56:00
channel: frontend
series: "React"
summary: "先看一个非受控组件的例子："
---

### Controlled Components VS unControlled Components

#### 一、非受控组件

先看一个非受控组件的例子：

```js
import React from 'react';

const App = () =>(
    <div>
        <label>
            My uncontrolled Input:
            <input type='text'/>
        </label>
    </div>
)
```

上述代码中的input是不受控制的HTML元素，通常我们也将封装了这种元素的APP组件称为是 “非受控组件”。

🐖：判断一个组件受控与否，跟它是函数组件还是类组件没有关系！

这里的input是不受控的，因为当我们启动这个application后，我们可以在输入框种编辑任何内容，但是我们编辑出来的东西没有展示在其他任何地方，也没有任何行为看可以去改变我们打进去的值。毕竟，这里的input就是一个原生的HTML元素，它自己管理自己的内部状态，而不受任何外界的控制。

我们再来看另外一个例子，这个例子更容易让我们混淆受控组件与非受控组件：

```js
//添加state management 和 React Hooks
import React, {useState} from 'react';

const App = ()=>{
    const [value, setValue] = useState('');

    const handleChange = event => setValue(event.target.value);

    return (
        <div>
            <label>
                My still uncontrolled Input:
                <input type='text' onChange={handleChange} />
            </label>

            <p>
                <strong>Output: </strong> {value}
            </p>
        </div>
    );
};

export default App;
```

我们把在输入框编辑的内容展示到一个段落中（output的后面），当我们启动这个程序后，input输入框编辑什么，output后面也会展示什么。但是，它依然是个非受控组件。这是为什么呢？下面我们把initialState里面写入内容，来解释这个问题：

```js
import React, {useState} from 'react';

const App = ()=>{
    const [value, setValue] = useState('Hello React');

    const handleChange = event => setValue(event.target.value);

    return (
        <div>
            <label>
                My still uncontrolled Input:
                <input type='text' onChange={handleChange} />
            </label>

            <p>
                <strong>Output: </strong> {value}
            </p>
        </div>
    );
};

export default App;
```

运行这个程序后，我们可以看到区别了：  
![](https://pic.downk.cc/item/5fd0c0543ffa7d37b335df1a.jpg)

我们可以看到 input框里是空的，可是output后面却是有内容的（output后面展示的就是initial state）。只有当我们往输入框中输入东西时，二者才似乎重新开始保持“同步”。但其实，**input框的内容仍然是它自己的内部状态，而output后面的内容却来自于真实的React state**(from handler function)。所以when typing, output后面展示的内容虽然看起来似乎和我们在输入框打进去的一样，但其实它们俩的来源不同：

-   input filed receives its value from internal DOM node state;
-   output paragraph receives its value from React’s state。

在我们的React应用中使用非受控组件，可能会导致很多意想不到的bug。如果想利用一种事实来源（one source of truth)来驱动UI，就应该使用props或者是state。对于一个组件来说，有相同的props和state，就应该渲染出相同的UI界面：**（props, state) => view**

#### 二、受控组件

既然非受控组件可能导致bug, 那么我们就应该把input这种不受控制的元素改为受控元素。亦即，我们为input提供一个value (它的值来源于 React state)：

```js
import React, { useState } from 'react';
 
const App = () => {
  const [value, setValue] = useState('Hello React');
 
  const handleChange = event => setValue(event.target.value);
 
  return (
    <div>
      <label>
        My controlled Input:
        <input type="text" value={value} onChange={handleChange} />
      </label>
 
      <p>
        <strong>Output:</strong> {value}
      </p>
    </div>
  );
};
 
export default App;
```

通过给input输入框提供一个来源于react state的value值，它就不再使用自己本身的内部状态了。现在，我们再来启动这个程序时，input输入框里的值和output后面展示的内容就完全一致了！（因为它们都来自于react state）  
![](https://pic.downk.cc/item/5fd0c4643ffa7d37b33a6f41.jpg)

参考：[What are Controlled Components in React?](https://www.robinwieruch.de/react-controlled-components)
