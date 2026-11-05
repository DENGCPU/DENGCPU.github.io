---
title: "CSS布局01--正常布局流"
date: 2021-02-08T10:05:00
channel: frontend
series: "CSS"
summary: "在介绍正常布局流之前，我们需要先了解下用于布局的元素：盒子。"
---

在介绍正常布局流之前，我们需要先了解下用于布局的元素：盒子。

### 一、盒模型

#### 1.1 块级盒子和内联盒子

在CSS中我们广泛的使用两种盒子——块级盒子（block box)和内联盒子（inline box），这两种盒子在页面流和元素之间的关系方面会表现出不同的行为：  
![块级盒子vs内联盒子](https://img.imgdb.cn/item/6020a0123ffa7d37b3684039.jpg)

默认情况下：

-   常见的块级盒子：h1-h6、p、div、ul、ol、table、form  
    …详细见[MDN-块级元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Block-level_elements)
    
-   常见的内联盒子：a、span、em、strong、i、img、input、select、textarea…详细见[MDN-行内元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Inline_elements)
    

我们可以通过设置display属性，来控制盒子的外部显示类型。

**补充：内部和外部显示类型**

> css的box模型有一个**外部显示类型**，来决定盒子是块级还是内联。  
> css的box模型有一个**内部显示类型**，来决定盒子内部元素的如何布局的（默认情况下是安装正常文档流布局）  
> 但是我们可以通过使用display: flex的类似属性值来更改内部显示类型。例如，如果一个元素的外部显示类型是block，但是内部显示类型修改为flex，该盒子内的所有直接子元素都会成为flex元素，这些子元素会根据弹性盒子规则进行布局。

接下来的内容我们专注于盒模型的外部显示类型。

#### 1.2 盒模型的主要内容

完整的CSS盒模型主要应用与块级盒子，内联盒子只使用盒模型中定义的部分内容。盒模型定义了盒子的每个部分——margin，border，padding，content。常见的有标注盒模型和IE盒模型。

##### 1.2.1 盒模型的各个部分

CSS中组成一个块级盒子需要以下几个部分：

-   Content box: 内容区域，大小可通过width 和 height设置
-   Padding box: 内边距（包围在内容区域外部的空白区域），大小可通过padding相关属性设置。
-   Border box：边框盒（包裹内容和内边距），大小可通过border相关属性设置
-   Margin box: 外边距（盒子和其他元素之间的空白区域），大小可通过margin相关属性设置。

如下图所示：  
![盒模型](https://img.imgdb.cn/item/6020a4d63ffa7d37b36a644c.jpg)

##### 1.2.2 标准盒模型

在标准盒模型中，如果你给盒设置width和height，实际设置的是Content box。padding 和 border再加上盒子的width height才一起决定了整个盒子的大小。

举个栗子：

```css
.box {
    width: 350px;
    height: 150px;
    margin: 26px;
    padding: 25px;
    border: 5px solid black;
}
```

使用标准盒模型，该盒子的宽度width = 350px+25px+25px+5px+5px = 410px; 该盒子的高度height = 150px+25px+25px+5px+5px = 210px;(content+padding+border)

![标准盒模型](https://img.imgdb.cn/item/6020add03ffa7d37b36e6757.jpg)

🐖：margin不计入实际盒子的大小，当然，它会影响盒子在页面的所占空间，但是影响的是盒子外部空间。盒子的范围到border为止，不会延神到margin。

##### 1.2.3 替代(IE)盒模型

盒子的大小还得加上边框和内边距，这样有些麻烦。所以CSS还有一个替代盒模型，使用整个模型，所有宽度都是可见宽度，所以内容宽度 content= 该宽度-border-padding

![替代盒模型](https://img.imgdb.cn/item/6020afca3ffa7d37b36f258a.jpg)

默认情况下，浏览器会使用标准模型。如果需要使用替代模型，可以通过设置 `box-sizing: border-box;` 来实现。这样你设置的width和height就是盒子的实际宽高。  
如果你希望所以的元素都使用替代盒模型，可以像下面这样设置：

```css
html {
    box-sizing: border-box;
}
*,*::before,*::after{
    box-sizing: inherit;
}
```

### 二、正常布局流（Normal flow）

正常布局流是指在不对页面进行任何布局控制时，浏览器默认的HTML布局方式。  
举个例子：

```html
<p>I love my cat</p>
<ul>
  <li>Buy cat food</li>
  <li>Exercise</li>
  <li>Cheer up friend</li>
</ul>

<p>The end!</p>
```

默认情况下，浏览器的显示如下:  
![](https://img.imgdb.cn/item/6020b1df3ffa7d37b36fec6b.jpg)

HTML元素完全安按照源码中出现的先后次序显示。**块级元素**出现在一个元素的下面，**内联元素**出现在另一个元素的旁边。对于页面上的多数元素，**正常布局流**完全足够创建一个你所需要的布局。所以，从一个结构良好的HTML文档开始非常重要，因为你可以按照默认的方式来搭建页面，而不是自造车轮！

下面的布局技术会覆盖默认的正常流式布局：

-   display属性——标准的value值如：block,inline,inline-block影响元素在正常布局流中的表现形式。还有一些全新的布局可以通过设置display的值实现，如CSS Grid 和 Flexbox。
-   浮动——应用float值，例如left能让块级元素互相排成一行，而不是一个在另一个的下面。
-   position属性——允许你精准设置盒子中的盒子的位置，正常布局流中默认为static，使用其他值会引起元素不同的布局方式。例如，将元素固定在浏览器视口的左上角。
-   表格布局—— 使用`display: table`可以将表格的布局方式用在非表格内容上。
-   多列布局—— 这个[Multi-column layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Columns)属性，可以让块按列布局，比如报纸的布局就是一列一列排布的。

参考：[MDN–CSS布局](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Introduction)
