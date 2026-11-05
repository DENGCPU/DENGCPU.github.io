---
title: "CSS布局02--flex布局"
date: 2021-02-08T12:02:00
channel: frontend
series: "CSS"
summary: "flex布局全称CSS弹性盒子布局（FlexBox），它定义了一种针对用户界面设计而优化的CSS盒子模型。在弹性布局模型种，弹性容器的子元素在任何方向上排布，也…"
---

flex布局全称CSS弹性盒子布局（FlexBox），它定义了一种针对用户界面设计而优化的CSS盒子模型。在弹性布局模型种，弹性容器的子元素在任何方向上排布，也可以“弹性伸缩”其尺寸。既可以增加尺寸以填满未使用的空间，也可以收缩尺寸以避免父元素溢出。子元素的水平对齐和垂直对齐都很好控制，通过嵌套水平框和垂直框，可以在两个维度上构建布局。

要想使用flex布局，只需要在父元素上应用`display: flex`，所有直接子元素都会按照flex进行布局。

举个例子：  
一个父元素wrapper，它的内部有三个div子元素，默认情况下会作为块元素从上到下显示。

```html
<div class="wrapper">
  <div class="box1">One</div>
  <div class="box2">Two</div>
  <div class="box3">Three</div>
</div>
```

现在我们给父元素wrapper加一个样式

```css
.wrapper{
    display: flex;
}
```

那么布局会如下：  
![flex布局例子](https://img.imgdb.cn/item/6020ba8c3ffa7d37b37489f3.jpg)  
可以看到三个子元素自动按列排列。这是由于它们变成了flex项（flex items),按照flex容器（即父元素）的一些flex相关的默认初始值排布：

-   它们整整齐齐排成一行，是因为父元素上flex-direction的初值是row
-   它们全都被拉伸至和最高的元素高度相同，是因为父元素上align-items属性的初值是stretch

上述的flex-direction和align-items属性都是用在**flex容器**，即父元素上的。还有很多属性是用在**flex项**（flex items)上的，这些属性可以改变flex项在flex布局种占用宽、高的方式，允许它们通过伸缩来适应可用空间。

再举个例子：  
我们在所有的子元素上添加一个样式：

```css
.wrapper {
    display: flex;
}
.wrapper > div {
    flex: 1;
}
```

那么三个子元素的排布会变成如下样式：  
![](https://img.imgdb.cn/item/6020bc6b3ffa7d37b3756831.jpg)

所有的子元素上都添加了`flex:1`，这会使得所有的子元素都伸展并填充flex容器，而不是尾部留下空白。如果有更多空间，子元素们会变得更宽；反之会变得更窄。如果你在HTML中追加了一个新元素，它们也会变得更小来为新元素创造空间——不管怎样，最终它们会调整自己直到占用向他宽度的空间。

相关的CSS属性：

-   flex,flex-basis,flex-direction
-   flex-flow, flex-grow, flex-shrink,flex-wrap
-   order

对齐属性：

-   align-content,align-items,align-self
-   justify-content,place-content,row-gap
-   column-gap,gap

参考：[MDN–FlexBox弹性盒子布局](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout)
