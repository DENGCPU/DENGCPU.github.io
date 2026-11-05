---
title: "CSS06-50道CSS基础面试题"
date: 2021-07-12T09:23:00
channel: frontend
series: "CSS"
summary: "标准 W3C 盒子模型的范围包括 margin、border、padding、content，并且 content 部分不包含其他部分。IE盒模型也包括 mar…"
---

#### CSS06——50道CSS基础面试题

##### 1、介绍一下标准的CSS盒子模型？与低版本的IE盒子模型什么不同？

-   标准盒子模型：宽度 = 内容的宽度（content）+ border + padding + margin
-   IE盒子模型： 宽度 = 内容宽度（content + border + padding）+ margin

标准 W3C 盒子模型的范围包括 margin、border、padding、content，并且 content 部分不包含其他部分。  
IE盒模型也包括 margin、border、padding、content，和标准 W3C 盒子模型不同的是：IE 盒子模型的 content 部分包含了 border 和 padding。

可参考：[谈谈你对CSS盒模型的认识](https://segmentfault.com/a/1190000015235886)

##### 2、box-sizing属性？

```css
/* 默认值是content-box，标准盒模型，设置元素的 height/width 属性指的是content部分的高/宽 */
box-sizing: conent-box;
/* border-box IE盒模型，设置元素的height/width属性指的是border+padding+content的高/宽 */
box-sizing: border-box;
```

##### 3、CSS选择器有哪些？哪些属性可以继承？

CSS选择器：

-   id选择器(#myid)
-   类选择器(.myclassname)
-   标签选择器(div,h1,p)
-   相邻选择器(h1+p)
-   子选择器(ul>li)
-   后代选择器(li a)
-   通配符选择器(\*)
-   属性选择器(a\[rel=”external”\])
-   伪类选择器(a:hover, li:nth-child)

可继承的属性：font-size, font-family, color

不可继承的属性：border, padding, margin, width, height

选择器优先级（就近原则）：!important > 内联 > ID选择器 > 类选择器 > 标签选择器。

注意：!important比内联优先级高

##### 4、CSS优先级算法如何计算？

权重：

1.  第一优先级：`!important` 会覆盖页面内任何位置的元素样式
2.  内联样式，如`style="color:red"`，权值为**1000**
3.  ID选择器，如`#app`，权值为**0100**
4.  类、伪类、属性选择器，如`.foo,:first-child,div[class='foo']`，权值为**0001**
5.  标签、伪元素选择器，如`div::first-line`，权值为**0001**
6.  通配符、子类选择器、兄弟选择器，如`*,>,+`，权值为**0000**
7.  继承的样式没有权值

比较规则：

1.  1000 > 0100 从左往右逐个比较，前一级相等才往后比较
2.  权重相同时，后面的样式会覆盖前面的样式
3.  通配符、子选择器、兄弟选择器，虽然权重为0000，但是优先于继承的样式

##### 5、CSS3新增伪类有哪些？

-   p:first-of-type 选择属于其父元素的首个元素
-   p:last-of-type 选择属于其父元素的最后元素
-   p:only-of-type 选择属于其父元素的唯一的元素
-   p:only-child 选择属于父元素的唯一子元素
-   p:nth-child(2) 选择属于其父元素的第二个子元素
-   :enabled :disabled 表单控件的禁用状态
-   :checked 单选框或复选框被选中

##### 6、如何居中div？ 如何居中一个浮动元素？如何让绝对定位的元素居中？

div居中：可参[div居中的几种方法](https://juejin.cn/post/6844903821529841671)

##### 7、display有哪些值？

inline(默认)——内联  
none——隐藏  
block——块显示  
inline-block——内联块  
list-item——项目列表

##### 8、position有哪些值？

-   static(默认)：按照正常文档流进行排列
    
-   relative（相对定位）：不脱离文档流，参考自身静态位置通过top/bottom/left/right定位
    
-   absolute（绝对定位）：参考距其最近一个不为static的父级元素通过top/bottom/left/right定位
    
-   fixed(固定定位)：所固定的参照对象是可视化窗口
    
-   inherit: 从父元素继承该属性的值
    
    具体可参考：[CSS布局05—定位position](https://dengcpu.github.io/2021/02/10/CSS%E5%B8%83%E5%B1%8005-%E5%AE%9A%E4%BD%8Dposition/)
    

##### 9、CSS3有哪些新特性？

参考：[前端面试之 CSS3 新特性](https://juejin.cn/post/6844903486618861575#heading-1)

（1）边框：

-   border-radius 圆角边框
-   border-shadow 添加阴影
-   border-image 使用图片来绘制边框

（2）背景：

-   background-clip 确定背景画区
-   background-origin 确定背景位置，通常与background-position联合使用
-   background-size 调整背景图片大小
-   background-break CSS3中元素可以被分成几个独立的盒子（如使内联元素span跨越多行），background-break 属性用来控制背景怎样在这些不同的盒子中显示。

（3）文字效果

-   word-wrap 强制文本换行
-   text-overflow 设置超出指定容器的边界时如何显示
-   text-shadow 文本阴影
-   text-decoration 文字渲染

（4）字体

@font-face特性 允许开发人员为网页指定在线字体

参考 [MDN–@font-face](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@font-face)

（5）过渡、转换和动画

-   过渡 Transition: 元素从一个样式变换为另一个样式时添加效果
-   转换 Transform: 2D和3D转换，允许我们对元素进行旋转、缩放、移动或倾斜
-   动画 Animation：[MDN-animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation)

（6）渐变

CSS3 Gradient分为：linear-gradient（线性渐变）、radial-gradient（径向渐变）

（7）多列布局

CSS3可以通过创建多个列对文本进行布局：

-   column-count: 规定元素应该被分隔的列数
-   column-gap: 规定列之间的间隔
-   column-rule: 设置列之间的宽度、样式、颜色等

（8）用户界面

-   resize: 规定是否可由用户调整元素尺寸
-   box-sizing: content-box/border-box/inherit
-   outline-offset: 对轮廓进行偏移，并在超出边框的位置绘制轮廓

（9）媒体查询 @media

参考 [MDN-@media](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media)

（10） 弹性盒子（Flex Box)

弹性盒子是 CSS3 的一种新的布局模式。

参考: [弹性盒子-菜鸟教程](https://www.runoob.com/css3/css3-flexbox.html)

（11）RGBA 和透明度
