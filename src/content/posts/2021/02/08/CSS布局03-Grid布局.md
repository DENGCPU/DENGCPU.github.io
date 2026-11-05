---
title: "CSS布局03--Grid布局"
date: 2021-02-08T15:32:00
channel: frontend
series: "CSS"
summary: "上一节中讲到的Flexbox布局用户设计横向或纵向的布局，而Grid布局则被设计用于同时在两个维度上把元素按行和列排列整齐。同flex一样，可以指定displa…"
---

上一节中讲到的Flexbox布局用户设计横向或纵向的布局，而Grid布局则被设计用于同时在两个维度上把元素按行和列排列整齐。  
同flex一样，可以指定display属性来实现grid布局：`display: grid` 。grid布局又叫网格布局。

### 一、什么是网格布局？

网格是一系列水平及垂直的线构成的一种布局模式。根据网格，我们能够将设计元素进行排列，帮助我们设计出一系列具有固定位置以及宽度的元素的页面。

一个网格通常具有许多的列（column）和行（row），以及行与行、列与列之间的间隙（亦称沟槽，gutter）组成。  
![网格](https://img.imgdb.cn/item/6020eb233ffa7d37b38dd0c6.jpg)

举个例子：

```html
<div class="container">
    <div>One</div>
    <div>Two</div>
    <div>Three</div>
    <div>Four</div>
    <div>Five</div>
    <div>Six</div>
    <div>Seven</div>
</div>
```

默认情况下，子项按照正常布局流自定向下排布。如下所示：  
![](https://img.imgdb.cn/item/6020ec363ffa7d37b38e6dac.jpg)

现在我们逐一加上样式，来了解网格是如何工作的。

### 二、定义网格：

与flex布局一样，我们是对父元素添加样式，使其改为**网格容器**，它的直接子项会变为**网格项**

```css
.container{
    display: grid;
}
```

与flex布局不同的是，在定义网格后，你的网页并不会马上发生变化。因为`display:grid` 的声明只创建了一个只要一列的网格，所有的子项还是像正常布局流那样一个接一个的上下排列。  
为了让我们的容器更像一个网格，我们要给刚定义的网格加一些列。现在加上三个200px的列（这里可以使用任何单位长度，甚至是百分比）

```css
.container{
    display: grid;
    grid-template-columns: 200px 200px 200px;
}
```

现在你的网页将变为下面这种：  
![](https://img.imgdb.cn/item/6020ee2b3ffa7d37b38f7578.jpg)

### 三、使用fr单位的灵活网格

除了使用长度和百分比，我们也可以用fr这个单位灵活定义网格的行与列的大小。这个单位表示可用空间的一个比例。

```css
.container{
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
}
```

这里，第一列被分配了2fr的可用空间，余下的两列都各被分配了1fr的可用空间，这会使得第一列的宽度是第二三列的两倍。每一列的宽度都会随着可用空间变小而变小。

另外，fr可以与一般的长度单位混合使用，比如`grid-template-columns: 200px 2fr 1fr`，那么第一列的宽度是200px,剩下的两列会根据除去200px后的可用空间按照比例分配。

🐖：fr单位分配的是“可用空间” 而不是“所有空间”，如果某一格包含的内容变多，那么整个可用空间就减少。

### 四、网格间隙

使用grid-column-gap属性定义列间隙；使用gird-row-gap属性定义行间隙；使用grid-gap可以同时设定两者。

间隙距离可以使用任何长度单位包括百分比单位表示，但是不能使用fr单位。

```css
.container{
    display: grid;
    grid-temmplate-columns: 2fr 1fr 1fr;
    grid-gap: 20px;
}
```

效果如下图：  
![](https://img.imgdb.cn/item/6020f1903ffa7d37b3915514.jpg)  
![](https://img.imgdb.cn/item/6020f1c73ffa7d37b39171c8.jpg)

🐖：grid-gap属性现在也写作gap属性，目的是让它们能够在不同的布局方法中都起作用。为了代码的健壮性，你可以把两个属性都写上。

```css
.container {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-gap: 20px;
  gap: 20px;
}
```

### 五、重复构建行/列

可以使用repeat来重复构建具有某些宽度配置的某些列。

```css
.container {
    display: grid;
    grid-template-columns:repeat(3,1fr);
    grid-gap: 20px;
}
```

这里得到了3个1fr的列，第一个传入repeat函数的值（3）表明了后续列宽的配置要重复多少次，第二个值（1fr）表示需要重复的构建配置，这个配置可以具有多个长度设定，例如repeat(2,2fr,1fr)，这相当于填入了2fr,1fr,2fr,1fr

#### 六、显式网格与隐式网格

显式网格是我们用grid-template-columns或grid-template-rows属性构建的。而隐式网格则是当有内容被放到网格外时才会生成的。简单地说，隐式网格就是为了放显式网格放不下的元素，浏览器根据已经定义的显示网格自动生成的网格部分。

隐式网格中生成的行/列大小的默认参数是auto，大小会根据放入的内容自动调整。当然也可以使用grid-auto-rows/grid-auto-columns属性手动设定隐式网格的大小。

举个例子，现在将上面案例中的隐式网格中的行设为100px:

```css
.container{
    display: grid;
    grid-template-columns: repeat(3,1fr);
    grid-auto-rows: 100px;
    grid-gap: 20px;
}
```

则网格的样式如下所示：  
![](https://img.imgdb.cn/item/6021f0a23ffa7d37b3f5dd99.jpg)  
![](https://img.imgdb.cn/item/6021f0c03ffa7d37b3f5eeca.jpg)

你可以看到那些隐式网格中的行（因为这个例子里没有设置grid-template-rows,因此所有的行都位于隐式网格内）现在都是100像素高了。

#### 七、方便的minmax()函数

将行/列设死为100px时，我们要方进去的内容可能会超过100像素。所以我们希望可以将行/列设为“至少100px”,而且可以跟随内容来自动拓展尺寸保证能容纳所有内容。因此，我们有了minmax()函数。

minmax函数为一个行/列的尺寸设置了取值范围，比如设定为`minmax(100px,auto)`，那么尺寸就至少为100像素，并且如果内容尺寸大于100像素则会根据内容自动调整。

```css
.container{
    display: grid;
    grid-template-columns: repeat(3,1fr);
    grid-auto-rows: minmax(100px,auto);
    grid-gap: 20px;
}
```

#### 八、自动使用多列填充

现在把repeat与minmax函数组合起来，来实现一个非常有用的功能。某些情况下，我们需要让网格自动创建很多列来填满整个容器，通过设置grid-template-columns属性，我们可以实现这个效果，但是现在，我们使用repeat函数中的一个关键字auto-fill来替代确定的重复次数。repeat函数中的第二个参数，我们使用minmax函数来设定一个行/列的最小值，以及最大值1fr

```css
.container{
    display: grid;
    grid-template-columns: repeat(auto-fill,minmax(200px,1fr));
    grid-auto-rows: minmax(100px,auto);
    grid-gap: 20px;
}
```

![自动多列填充](https://img.imgdb.cn/item/6021f7ab3ffa7d37b3f848fc.jpg)

可以看到形成了一个包含许多至少200像素的列的网络将容器填满。随着容器宽度的改变，网格回自动根据宽度进行体调整，每一列的宽度总是大于200像素，并且容器总会被列填满。

#### 九、基于线的元素放置

在定义完网格之后，我们要把元素放入网格之中。我们的网格有许多分隔线。我们根据这些分隔线来放置元素，通过以下属性来指定哪条线开始到哪条线结束。

-   grid-column-start
-   grid-column-end
-   grid-row-start
-   grid-row-end

这些属性的值均为分隔线序号，也可以用以下缩写形式来同时指定开始与结束的线。

-   grid-column: 开始线/结束线
-   grid-row：开始线/结束线

🐖：可以用-1来定位到最后一条列分隔线/行分隔线，并且可以用负数来指定倒数的某一条分隔线。但这只能用于显式网格。

参考：  
1.[MDN–Grid布局](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Grids)  
2.[MDN–CSS网格指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Grid_Layout#Guides)
