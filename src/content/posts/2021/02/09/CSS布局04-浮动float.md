---
title: "CSS布局04-浮动float"
date: 2021-02-09T15:32:00
channel: frontend
series: "CSS"
summary: "最初，引入float属性是为了让web开发人员实现简单的布局，包括在一列文本中浮动的图像，文字环绕在它的左边或右边。"
---

### 一、浮动的背景知识

最初，引入float属性是为了让web开发人员实现简单的布局，包括在一列文本中浮动的图像，文字环绕在它的左边或右边。

但是，开发人员发现，万物皆可浮动，而不仅仅是图片，所以浮动的使用范围扩大了。浮动层被用来实现整个网站页面的布局，它使信息列得以横向排列（默认是按照在源码中出现得顺序纵向排列）。目前出现了更新更好的页面布局技术，所以使用浮动来进行页面布局是传统的布局方法之一。

### 二、一个简单的浮动例子

HTML文件：

```html
<h1>Simple float example</h1>

<img src="https://mdn.mozillademos.org/files/13340/butterfly.jpg" alt="A pretty butterfly with red, white, and brown coloring, sitting on a large leaf">

<p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus aliquam dolor, eu lacinia lorem placerat vulputate. Duis felis orci, pulvinar id metus ut, rutrum luctus orci. Cras porttitor imperdiet nunc, at ultricies tellus laoreet sit amet. Sed auctor cursus massa at porta. Integer ligula ipsum, tristique sit amet orci vel, viverra egestas ligula. Curabitur vehicula tellus neque, ac ornare ex malesuada et. In vitae convallis lacus. Aliquam erat volutpat. Suspendisse ac imperdiet turpis. Aenean finibus sollicitudin eros pharetra congue. Duis ornare egestas augue ut luctus. Proin blandit quam nec lacus varius commodo et a urna. Ut id ornare felis, eget fermentum sapien.</p>

<p>Nam vulputate diam nec tempor bibendum. Donec luctus augue eget malesuada ultrices. Phasellus turpis est, posuere sit amet dapibus ut, facilisis sed est. Nam id risus quis ante semper consectetur eget aliquam lorem. Vivamus tristique elit dolor, sed pretium metus suscipit vel. Mauris ultricies lectus sed lobortis finibus. Vivamus eu urna eget velit cursus viverra quis vestibulum sem. Aliquam tincidunt eget purus in interdum. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
```

CSS文件：

```css
body {
  width: 90%;
  max-width: 900px;
  margin: 0 auto;
}

p {
  line-height: 2;
  word-spacing: 0.1rem;
}
```

文本排版如下：  
![](https://img.imgdb.cn/item/60223e0f3ffa7d37b318d964.jpg)

现在我们给img元素加上浮动：

```css
img {
  float：left;
  margin-right: 30px;
}
```

原文档现在排版如下：

![](https://img.imgdb.cn/item/60223d9e3ffa7d37b318a540.jpg)

浮动是如何工作的： 浮动元素img会脱离正常的文档布局流，并吸附到其父容器（body元素）的左边。在正常布局中位于该浮动元素之下的内容，此时会围绕着浮动元素，填满其右侧的空间。

浮动元素内容仍然遵循盒子模型（外边距，边界等），设置图片的右侧外边距就能阻止右侧的文字紧贴着图片。向右浮动的内容效果一样，只是反过来了——浮动元素会吸附在父元素的右边。

### 三、首字下沉案例

HTML文件：

```html
<p>This is my very important paragraph.
 I am a distinguished gentleman of such renown that my paragraph
 needs to be styled in a manner befitting my majesty. Bow before
my splendour, dear students, and go forth and learn CSS!</p>
```

css文件：

```css
p {
    width: 400px;
    margin: 0 auto;
}
p::first-line {
    text-transform: uppercase;
}
p::first-letter {
    font-size: 3em;
    border: 1px solid black;
    background: red;
    float: left;
    padding: 2px;
    margin-right: 4px;
}
```

最终的实现效果如下：  
![首字下沉](https://img.imgdb.cn/item/602240ad3ffa7d37b31a31c3.jpg)

### 四、多列浮动布局

浮动通常用于创建多个列布局，但是会有一些奇怪的副作用，后面再讨论。现在，我们先看两列布局和三列布局是如何实现的。

#### 4.1 两列布局

HTML文件：

```html
<h1>2 column layout example</h1>
<div>
  <h2>First column</h2>
  <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus aliquam dolor, eu lacinia lorem placerat vulputate. Duis felis orci, pulvinar id metus ut, rutrum luctus orci. Cras porttitor imperdiet nunc, at ultricies tellus laoreet sit amet. Sed auctor cursus massa at porta. Integer ligula ipsum, tristique sit amet orci vel, viverra egestas ligula. Curabitur vehicula tellus neque, ac ornare ex malesuada et. In vitae convallis lacus. Aliquam erat volutpat. Suspendisse ac imperdiet turpis. Aenean finibus sollicitudin eros pharetra congue. Duis ornare egestas augue ut luctus. Proin blandit quam nec lacus varius commodo et a urna. Ut id ornare felis, eget fermentum sapien.</p>
</div>

<div>
  <h2>Second column</h2>
  <p>Nam vulputate diam nec tempor bibendum. Donec luctus augue eget malesuada ultrices. Phasellus turpis est, posuere sit amet dapibus ut, facilisis sed est. Nam id risus quis ante semper consectetur eget aliquam lorem. Vivamus tristique elit dolor, sed pretium metus suscipit vel. Mauris ultricies lectus sed lobortis finibus. Vivamus eu urna eget velit cursus viverra quis vestibulum sem. Aliquam tincidunt eget purus in interdum. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
</div>
```

CSS文件：

```css
/* 在宽度<900px时，整个视图的宽度占90%
   在宽度>900px时，它将保持这个宽度，并在视口居中
 */
body {
    width: 90%;
    max-width: 900px;
    margin: 0 auto;
}
/* 
左右两个div总占96%，两者间的沟槽占4%
 */
div:nth-of-type(1){
    width: 48%;
    float: left;
}
div:nth-of-type(2){
    width: 48%;
    float: right;
}
```

最终的效果如下图：  
![两列布局](https://img.imgdb.cn/item/602252c23ffa7d37b3232143.jpg)

这个例子里，我们所有列使用宽度百分比——这个策略会创建一个**流式布局**（liquid layout），可以根据不同的屏幕尺寸调整，在较小的尺寸下保持相同的列宽度比例。这是响应式网页设计的一个有价值的工具。

#### 4.2 三列布局

我们在上面的例子中再追加一个第三列，通过添加一个div:

追加HTML文件：

```html
<div>
  <h2>Third column</h2>
  <p>Nam consequat scelerisque mattis. Duis pulvinar dapibus magna, eget congue purus mollis sit amet. Sed euismod lacus sit amet ex tempus, a semper felis ultrices. Maecenas a efficitur metus. Nullam tempus pharetra pharetra. Morbi in leo mauris. Nullam gravida ligula eros, lacinia sagittis lorem fermentum ut. Praesent dapibus eros vel mi pretium, nec convallis nibh blandit. Sed scelerisque justo ac ligula mollis laoreet. In mattis, risus et porta scelerisque, augue neque hendrerit orci, sit amet imperdiet risus neque vitae lectus. In tempus lectus a quam posuere vestibulum. Duis quis finibus mi. Nullam commodo mi in enim maximus fermentum. Mauris finibus at lorem vel sollicitudin.</p>
</div>
```

更新CSS文件：

```css
body{
    width:90%;
    max-width:900px;
    margin:0 auto;
}

div:nth-of-type(1){
    width: 36%;
    float: left;
}

div:nth-of-type(2){
    width: 30%;
    float: left;
    margin-left: 4%;
}

div:nth-of-type(3){
    width: 26%;
    float: right;
}
```

三列布局如下：

![三列布局](https://img.imgdb.cn/item/602254c73ffa7d37b324135d.jpg)

需要注意的是，必须考虑清楚将列放在什么位置，以及如何浮动他们，以获得需要的效果。比如，如果我们将第二列的float值改为right，那么的三个div的顺序将变为：

> div1 div3 div2

这是因为div2的源代码顺序在div3上，所以浮动顺序等级比div3高，两者又同时右浮动，所以div2更靠右。

### 五、清除浮动

设置元素浮动带来的问题——所有在浮动下面的自身不浮动的内容将围绕浮动元素进行包装，如果没有处理这些元素，排版将变得很糟糕。

举例：现在在4.2的例子中追加一个footer  
追加HTML文件：

```html
<footer>
  <p>&copy;2016 your imagination. This isn't really copyright, this is a mockery of the very concept. Use as you wish.</p>
</footer>
```

排版将会变成这样：  
![浮动的影响](https://img.imgdb.cn/item/6022579e3ffa7d37b32588df.jpg)

你会发现页脚在最长的列旁边环绕着，而正常情况下我们希望footer保持在所有列的下面。这时，我们便需要清除浮动。使用clear属性可以清除浮动，当把这个属性应用到一个元素上时，它意味着“此处停止浮动”——这个元素和源码中后面的元素都将不再浮动（除非你设置了新的float在后面的元素身上）

```css
footer {
    clear：both;
}
```

现在排版就正常了：  
![清除浮动](https://img.imgdb.cn/item/602258b03ffa7d37b326396b.jpg)

clear属性可以取三个值：

-   left: 停止任何活动的左浮动
-   right: 停止任何活动的右浮动
-   both: 停止任何活动的左右浮动

**1.清除浮动的本质**

**清除浮动**：本质是为解决父级元素因为子级元素浮动而引起高度为0的问题。

很多时候，我们不方便给父盒子一个确定的高度，因为我们不知道有多少子盒子，有多少内容，通常都是让内容来撑开父盒子的高度。

但是如果父盒子中有子盒子浮动了之后，就会影响到后面的盒子。因为浮动元素脱离了标准流，会把后面还在标准流的盒子覆盖，解决这个问题的方法就是**清除浮动**

原理图:  
![清除浮动原理图](https://img.imgdb.cn/item/60234d5c3ffa7d37b387e061.jpg)

**2.常见的清除浮动的方法：**

清除浮动其实叫做闭合浮动更合适，因为是把浮动的元素圈起来，让父元素闭合出口和入口不然他们出来影响其他的元素。上文的例子中已经提到，CSS中用于清除浮动的是clear属性。

（1）额外标签法:

-   尾部标签法：通过在**浮动元素的末尾**添加一个空标签。这时W3C推荐的用法，虽然简单但是添加了无意义的标签，导致结构化较差，所以不推荐使用。  
    三种写法：
    
    ```html
    <!-- 第一种 -->
    <div style="clear:both"></div>
    
    <!-- 第二种 -->
    <div class='clear'></div>
    .clear {clear: both}
    
    <!-- 第三种 -->
    <br class='clear' />
    .clear {clear: both}
    ```
    
-   内部标签法：把div放进父盒子里，盒子会撑开，一般也不用。

（2）父元素添加overflow法:

给父级元素添加overflow的样式，也可以清除浮动。但是因为overflow的本质是溢出隐藏的效果，所以也存在一些问题（比如内容增多的时候不会自行换行导致内容被隐藏掉，无法显示出要溢出的元素）

```css
.father {
  overflow: auto;
  /* overflow: hidden|auto|scroll
  都可以实现清除浮动 */
}
```

（3）✨伪元素法:

伪元素法是最常用的清除浮动的方法，常见的有以下几种：

-   **after伪元素法**：

在父元素上加一个类名clearfix。after在父元素中加一个盒子，这个元素是通过css添加的，符合闭合浮动思想，结构语义化正确。

但是这个方法IE6，7不识别，要进行兼容的话，需要使用`zoom:1`触发hasLayout来清除浮动。

代表网站：百度，网易，淘宝等

```css
.clearfix::after{
  content: '.'; /*尽量不要为空，一般写一个点*/
  height: 0;  /*盒子高度为0，看不见*/
  display: block;  /*插入伪元素是行内元素，要转化为块级元素*/
  visibility: hidden; /*content有内容，将元素隐藏*/
  clear: both;
}

.clearfix {
  *zoom: 1; /*只有IE6，7识别*/
}
```

> 在Unicode字符里有一个“零宽度空格”,级U+200B，代替”.”，可以减少代码量，不需要再使用`visibility:hidden`

代表网站：阿里巴巴

```css
.clearfix::after{
    content:"\200B";   /* content:'\0200'; 也可以 */
    display:block;
    height:0;
    clear:both;
}

.clearfix {
    *zoom: 1; 
}
```

-   **before和after双伪元素法：**（推荐）

完全符合闭合浮动思想的方法。

做法：给父元素加一个类名clearfix ，需要兼容IE6，7

代码网站：小米，腾讯

```css
.clearfix:before, .clearfix:after{
  content: "",
  display: table;
}
.clearfix:after {
  clear: both;
}
.clearfix {
  *zoom: 1;
}
```

参考：[MDN–浮动float](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Floats)
