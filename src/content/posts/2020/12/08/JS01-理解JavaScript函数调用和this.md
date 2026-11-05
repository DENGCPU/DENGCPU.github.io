---
title: "JS01-理解JavaScript函数调用和this"
date: 2020-12-08T20:58:00
channel: frontend
series: "JS"
summary: "我们经常对JS的函数调用，以及this在函数调用中的指代有很多的困惑。通过理解核心函数调用的原语可能会有助于消除很多此类的疑惑，也可以把其他函数调用方式看成是最…"
---

#### 理解JavaScript函数调用与this的语义

 我们经常对JS的函数调用，以及this在函数调用中的指代有很多的困惑。通过理解核心函数调用的原语可能会有助于消除很多此类的疑惑，也可以把其他函数调用方式看成是最原始函数调用的语法糖。The basic idea is the same.

##### 一、 The Core Primitive 核心原语：

First, let’s look at the core function invocation primitive, a Function’s call method\[1\]. The call method is relatively straight forward.

1.  Make an argument list (**argList**) out of parameters 1 through the end
2.  The first parameter is **thisValue**
3.  Invoke the function with **this** set to **thisValue** and the **argList** as its argument list  
    例子：
    
    ```js
    function hello(thing){
    
        console.log(this + 'say hello' + thing);
    
    }
    hello.call('Yehuda','world');//Yehuda says hello world
    ```
    

As you can see, we invoked the **hello** method with this set to “Yehuda” and a single argument “world”. This is the core primitive of JavaScript function invocation. You can think of all other function calls as desugaring to this primitive. (to “desugar” is to take a convenient syntax and describe it in terms of a more basic core primitive).

##### 二、简单函数调用

```js
function hello(thing){

    console.log('Hello' + thing);
}
//简单函数调用
hello('world');

//desugars to:
hello.call(window, 'world')

//在ES5的严格模式中，desugars to:
hello.call(undefined, 'world')
```

在内联声明的函数中，也有相同的“解糖”：  
(function() {})() = (function() {}).call(window或undefined)

##### 三、成员函数

```js
var person = {
    name: 'Eich',
    hello: function(thing){
        console.log(this + 'say hello' + thing)
    }
}
//成员函数调用
person.hello('world');
//desugars to:
person.hello.call(person,'world')
```

如果为一个对象动态的添加成员函数，也有相同的“解糖”：

```js
function hello(thing){
    console.log(this + 'say hello' + thing);
}
person = {name: 'Eich'};
person.hello = hello;

person.hello('world');
//still desugars to :
//person.hello.call(person,'world')

hello('world');//"[object DOMwindow] say hello world"
```

🐖：Notice that the function doesn’t have a persistent notion of its ‘this’. It is always set at call time based upon the way it was invoked by its caller.

##### 四、使用函数原型绑定 Function.prototype.bind

 因为有时使用持久化this值引用函数可能会很方便，所以人们一直以来都使用简单的闭包技巧将函数转换成不变的this值。

```js
var person = {
    name: 'Eich',
    hello: function(this){
        console.log(this.name + 'says hello' +thing);
    }
}
var boundHello = function(thing){
    //使用原始的call方法把this转换为我们想要它指代的值
    return person.hello.call(person,thing)
}
boundHello('world');
//desugars to: boundHello.call(window, 'world')
```

我们还可以进一步改进，让上面的写法更加通用：

```js
var bind = function(func,thisValue){
    return function(){
        return func.apply(thisValue, arguments);
    }
}
var boundHello = bind(person.hello, person);
boundHello('world')//'Eich says hello world'
```

上述代码中，arguments是类数组对象，代表所有被传入函数的参数值。apply() 方法跟call类似，除了它接收的是类数组对象作为参数，而call接收的是一个一个参数组成的列表 call(thisArg, arg1,arg2,…)。  
对上述代码的解释：Our **bind** method simply returns a new function. When it is invoked, our new function simply invokes the original function that was passed in, setting the original value as **this**. It also passes through the arguments.

参考文章： [Understanding JavaScript Function Invocation and “this”](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)
