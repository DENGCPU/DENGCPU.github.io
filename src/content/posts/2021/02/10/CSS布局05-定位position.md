---
title: "CSS布局05-定位position"
date: 2021-02-10T11:43:00
channel: frontend
series: "CSS"
summary: "定位允许你从正常的文档流中取出元素，并使他们具有不同的行为，例如放在另一个元素的上面，或者始终保持在浏览器视窗内的同一位置。"
---

**定位**允许你从正常的文档流中取出元素，并使他们具有不同的行为，例如放在另一个元素的上面，或者始终保持在浏览器视窗内的同一位置。

定位允许我们覆盖正常的文档流行为，以产生更多的布局可能。如果我们想要创建一个浮动在页面其他部分的UI元素，并始终停留在浏览器窗口内的相同位置（无论页面滚动多少），我们就可以使用“定位”这种布局工具。

有许多不同类型的定位，即position属性有很多取值：  
![position的取值](https://img.imgdb.cn/item/6024e5083ffa7d37b33471bf.jpg)

#### 一、静态定位

静态定位是每个元素获取的默认值——它只表示“将元素放入它在文档布局流中的正常位置”，没什么特别的。

静态定位是默认行为！

#### 二、相对定位

相对定位与静态定位非常相似，占据在正常的文档流中。仅仅使用`position: relative`，文档布局不会发生任何变化，它一般和top、bottom、left和right属性搭配使用。

**介绍top,bottom,left和right属性**

top、bottom、left和right用来精确指定元素移动到的位置。这些属性的值可以采用逻辑上期望的任何单位：px、rems、% 等

举个例子：现在有俩上下排列的盒子  
HTML文件

```html
<div class="box1"></div>
<div class="box2"></div>
```

CSS文件

```css
.box1 {
  width: 100px;
  height: 100px;
  background-color: skyblue;
}
.box2 {
  width: 100px;
  height: 100px;
  background-color: pink;
}
```

排版如下：  
![](https://img.imgdb.cn/item/6024e80e3ffa7d37b335c2ff.jpg)  
现在我们将box1设置一个相对定位：

```css
.box1 {
    position: relative;
    top: 50px;
    left: 50px;
}
```

现在排版如下：  
![](https://img.imgdb.cn/item/6024e9203ffa7d37b3363c48.jpg)

🐖 `top:50px;`指距离顶部50px, `left:50px;`指距离左边50px;

#### 三、绝对定位

绝对定位absolute和浮动float有相似之处：**包裹性**和**高度欺骗**

##### 3.1 包裹性

看一个例子：

```html
<div style="border:4px solid blue;">
  <img src="img/25/1.jpg" />
</div>
<div style="border:4px solid red; position: absolute;">
  <img src="img/25/2.jpg" />
</div>
```

效果如下：  
![绝对定位的包裹性](https://img.imgdb.cn/item/60331a065f4313ce257124f8.jpg)

一旦给元素加上absolute和float，就相当于给元素加上了`display: block;` 比如一个内联元素span，本身是无法直接指定高度的，但是给span加上absolute或者是float后，span的属性就自动变为block了。

##### 3.2 高度欺骗

上例中给图片外层的div加上absolute，现在将absolute移到内部图片上，高度欺骗的效果就出来了：

```html
<div style="border:4px solid blue;">
  <img src="img/25/1.jpg" />
</div>
<div style="border:4px solid red;">
  <img style="position: absolute;" src="img/25/2.jpg" />
</div>
```

![绝对定位的高度欺骗效果](https://img.imgdb.cn/item/60331c9b5f4313ce2572810e.jpg)

参照[博客-CSS浮动float详解](https://www.jianshu.com/p/07eb19957991),会发现float和absolute的效果是一样的，但是两者背后的原理是有区别的。加点文字就看出来了：

```html
<div style="border:4px solid blue;">
  <img src="img/25/1.jpg" />
</div>
<div style="border:4px solid red;">
  <img style="position: absolute;" src="img/25/2.jpg" />
  我是一个绝对定位的absolute元素
</div>
```

![](https://img.imgdb.cn/item/60331d7f5f4313ce2573161a.jpg)

显然，文字被图片遮盖了，这点和float不同。float是欺骗父元素，让其父元素误以为其高度塌陷了，但float元素本身仍处于文档流中，文字会环绕着float元素，不会被遮蔽。

但是absolute不算是欺骗父元素了，而是出现了**层级**关系。处于正常文档流中的父元素和设置了absolute的元素已经不是一个次元上的，从父元素的视点看，设置为absolute的图片已经完全消失不见了，因此从最左边开始显示文字。而absolute的层级高，所以图片遮盖了文字。  
有了以上基础之后，还需要了解absolute的以下特点：

-   如何确定定位点
-   和relative相爱相杀
-   和z-index的关系
-   减少重绘和回流的开销

1.  **如何确定定位点？**

由于设置了absolute之后会出现分层，那么该让浏览器在何处显示该元素呢？普通文档流里的元素，浏览器可以根据父子兄弟的大小和位置，计算出该元素的位置。但是分层之后改怎么办？基本思路如下：

第一种情况：用户只给元素指定了absolute，未指定left/top/right/bottom。此时absolute元素的左上角定位点位置就是该元素正常文档流的位置。如上图例子中，图片熊猫是父元素的第一个孩子，因此左上角定位到就是父元素的content的左上角。

如果将熊猫图片和下面的文字顺序改一下，让其成为父元素的第二个孩子：

```html
<div style="border:4px solid red;">
  我是一个绝对定位的absolute元素
  <img style="position: absolute;" src="img/25/2.jpg" />
</div>
```

那么排版就成了这样：  
![定位点](https://img.imgdb.cn/item/6034eb355f4313ce25554119.jpg)

第二种情况：用户给absolute元素指定了left/right/top/bottom

首先最简单的一种，absolute元素的父元素均是默认的position：static布局，此时absolute所处的层是铺满全屏的，即铺满body。这时，会根据用户指定位置在body上进行定位。

只指定left时,元素的左上角定位点的left值会变成用户指定值，但是top值仍旧是该元素在正常文档流中的top值：

```html
<div style="border:4px solid red;">
  我是一个绝对定位的absolute元素
  <img style="position: absolute;left:50px;" src="img/25/2.jpg" />
</div>
```

![只指定left的定位点](https://img.imgdb.cn/item/6034eca35f4313ce2555e0f3.jpg)

只指定top时，元素的左上角定位点的top值会变成用户指定值，但是left值仍旧是该元素在正常文档中的left值。

```html
<div style="border:4px solid red;">
  我是一个绝对定位的absolute元素
  <img style="position: absolute;top:50px;" src="img/25/2.jpg" />
</div>
```

![只指定top的定位点](https://img.imgdb.cn/item/6034ed405f4313ce25561b0d.jpg)

只指定bottom时，元素的**左下角**定位点的bottom值会变成用户指定值，但是left值仍旧是该元素在正常文档流中的left值。

```html
<div style="border:4px solid red;">
  我是一个绝对定位的absolute元素
  <img style="position: absolute;bottom:50px;" src="img/25/2.jpg" />
</div>
```

![只指定bottom时的定位点](https://img.imgdb.cn/item/6034ee165f4313ce25567fbb.jpg)

通过对left/top/right/bottom的组合设置，由于没有position：static以外的父元素，此时absolute元素可以去任意想去的地方。

2.  **和relative相爱相杀**

通常我们对relative的认识是：它用于限制absolute，所谓“子绝（absolute）父相(relative)”。上面说了，如果absolute元素的父元素都是position：static，那么它就相对body定位，天空才是它的极限。一旦父元素被设置为relative，那么absolute子元素将**相对于其父元素定位**，就像是脚被绑了绳子的鸟。

举个栗子：  
比如你要实现下图APP右上角的红圈圈：  
![](https://img.imgdb.cn/item/6035b1735f4313ce259f29b6.jpg)  
通常的做法是将app图片所处的div设为relative，然后将红色圈设成absolute，再设置top/right调整即可。这样无论用户怎么改变app图片的位置，红色圈圈永远固定再右上角。  
例如：

```css
.tipIcon {
  background-color: #f00;
  color: #fff;
  border-radius:50%;
  text-align: center;
  position: absolute;
  width: 20px;
  height: 20px;
  right:-10px;  //负值为自身体积的一半
  top:-10px;
}
```

```html
<div style="display: inline-block;position:relative;">
  <img src="img/25/2.jpg" />
  <span class="tipIcon">6</span>
</div>
```

![](https://img.imgdb.cn/item/6035b25a5f4313ce259f99ba.jpg)

这种实现方法是可行的，兼容性也ok。但是CSS世界里要实现一个效果可以有很多种方式，具体选哪个方案要视情况而定。一般遵循的原则是：1.简洁 2.尽量让每个属性干其本职工作。用这两个标准看上诉实现，其实是可以改进的。首先外层div多了relative未能简洁到极致。其次**relative的本职工作是让元素在相对其正常文档流位置进行偏移**，但是父层div并不需要任何位置偏移，之所以设成relative的唯一目的是限制absolute子元素的定位点。这其实并没有让relative干本职工作。

那么怎么改进呢？其实在上面探讨absolute定位点时说了：在未指定top/right/bottom/left的absolute元素，其在所处层级的定位点就是正常文档流中该元素的定位点。因此改进如下：

```css
.tipIcon2 {
  background-color: #f00;
  color: #fff;
  border-radius:50%;
  text-align: center;
  position: absolute;
  width: 20px;
  height: 20px;
  margin:-10px 0 0 -10px;   //不需要top和right了，改用margin来进行偏移
}

<div style="display: inline-block;">  //父元素不需要relative了
  <img src="img/25/2.jpg" /><!--
 --><span class="tipIcon2">6</span> 
</div>
//img和soan间的HTML注释的目的是消除换行符，你也可以将span紧跟在img后面写到一行里
```

更深入一点看，多一个属性意味着多一层维护。如果父relative+子absolute来实现定位，万一将来页面需要调整，父元素的尺寸需要变化呢？

```html
<div style="display: inline-block; position:relative;width: 200px;">
  <img src="img/25/2.jpg" />
  <span class="tipIcon">6</span>
</div>
```

![](https://img.imgdb.cn/item/6035b4ec5f4313ce25a0ca9b.jpg)

可以看到，仅仅是父元素的width变了就导致右上角absolute图标错位了。由于absolute和relative耦合在一起了，父元素有任何风吹草动，子元素就需要重新寻找定位点。但是如果用上例中absolute自身的定位特点，无论父元素怎么折腾，红色的圈圈都牢牢靠在图片的右上角。

但是absolute和relative也不应该因此断绝关系，它俩在某些功能实现上依然相爱。例如，用absolute常见的一个案例是透明层覆盖元素，要实现对全屏加一层滤镜等效果，这时应该怎么办呢?  
![全屏滤镜](https://img.imgdb.cn/item/6035b67e5f4313ce25a18a40.jpg)

```css
.cover {
    position: absolute;
    left: 0;right: 0;top: 0;bottom: 0;
    background-color: #fff;
    opacity: .5;
    filter: alpha(opacity=50);
}

<div style="display: inline-block;">
  <img src="img/25/2.jpg" /><!--
  --><span class="tipIcon2">6</span>
</div>
现在是全屏滤镜时间
<span class="cover"></span>
```

CSS里个细节需要关注：用absolute的`left:0; right:0; top:0; bottom:0;` 来实现全屏拉伸。对于absolute元素来说，如果同时设置left和right会水平拉伸，同时设置top和bottom会垂直拉伸。（为何不设置width/height为100%呢？前面说了，不设top/right/bottom/left的话absolute元素会从正常文档流应处的位置开始定位，因此做不到全屏。除非设置width/height为100%后，再设置left:0; top:0; 但这样会显得啰嗦。

那我如果不想全屏滤镜，只想对图片部分加滤镜呢？这时就可以使用relative了。

```html
//CSS部分不变
<div style="display: inline-block;position: relative;">
  <span class="cover"></span>
  <img src="img/25/2.jpg" /><!--
  --><span class="tipIcon2">6</span>
</div>
现在是图片滤镜时间
```

效果如下：  
![图片加滤镜](https://img.imgdb.cn/item/6035b8985f4313ce25a26ab8.jpg)

结论：  
（1）相对定位时，不必拘泥于relative+absolute，尝试去掉relative，充分利用absolute自身定位的特点，将relative+absolute解耦，耦合度越低越容易维护。  
（2）拉伸平铺时，用relative可以有效控制子absolute元素的拉伸平铺范围（注意是拉伸，不是缩小，缩小需要再加上width/height：100%）

3.  **和z-index的关系**

z-index经常被滥用，很多人思维定势只要设了absolute就需要同步设置z-index。其实不是这样的，上面所有例子都没有用到z-index,同样正常分层覆盖。

以下情况根本不需要设置z-index:

-   让absolute元素覆盖正常文档流内元素（不用设z-index，自然覆盖）
-   让后一个absolute元素覆盖前一个absolute元素（不用设z-index，只要在html中按先后顺序正确放置两个元素即可）

什么情况下需要设置z-index呢？  
当absolute元素覆盖另一个absolute元素，且html中不方便调整DOM的先后顺序时，需要设置z-index：1; 非常少见的情况下多个absolute交错覆盖，或者需要显示最高层次的模态对话框时，可以设置z-index>1。

查看京东的首页源码，设置z-index的地方也只设了1，2，3。少数地方设置了11，12，13。像是一种内部潜规则，表明更高层级的需要。

查看新浪微博的源码，发现设置了z-index:999; 如果设置了z-index:99;那如果现在需要一个更高的层级怎么办？重构页面代码，将99等数值重构成1，2，3？ 不会，通常为了省事就再设一个z-index:999;

![新浪微博源码](https://img.imgdb.cn/item/6035bdbc5f4313ce25a4ae0c.jpg)

4.  **减少重绘和回流的开销**

例如将元素隐藏，你或许会用`display: none;`。但是使用display：none隐藏容易显示难。比如，A隐藏前是display:block;B隐藏前display:inline;A和B都改成none隐藏后，要显示出来时，必须事先保存元素的display的属性，否则做不到显示后display仍旧是原先的值。

其实使用absolute控制隐藏和显示很好用，**方法是：使用absolute+top: -9999em; 或者absolute+ visibility：hidden;** 这样实现隐藏和显示的优点是：absolute由于层级关系，隐藏和显示只会重绘，但不会回流。（或者说absolute的回流开销小于正常DOM流中回流的开销） 而用display:none 会导致render tree重绘和回流。

另外，考虑到重绘和回流的开销，可以将动效果放在absolute元素中，避免浏览器将render tree回流。

参考：[博客-CSS绝对定位absolute详解](https://www.jianshu.com/p/a3da5e27d22b)

关于重绘和回流：参考[掘金-浏览器的回流与重绘 (Reflow & Repaint)](https://juejin.cn/post/6844903569087266823#comment)
