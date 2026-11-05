---
title: "npm01--dependencies与devDependencies的区别"
date: 2020-12-06T16:53:00
channel: frontend
series: "npm"
summary: "当我们在使用npm install 安装node模块时，有两种命令参数将这些node模块的信息写入到package.json文件中："
---

#### dependencies 与 devDependencies

 当我们在使用npm install 安装node模块时，有两种命令参数将这些node模块的信息写入到package.json文件中：

-   npm install \*\*\* –save，这个命令是将依赖包的信息添加到package.json文件的dependencies键下。
-   npm install \*\*\* –save-dev，这个命令是将依赖包的信息添加到devDependencies键下。

#### 1.不同点：

**devDependencies是开发环境**，我们使用的一些构建工具如webpack、glup等只是在开发过程中用的包，上线后就和它们没有关系了，所以这种都写入devDependencies（还有一些单元测试工具也卸载这里）

**dependencies是生产环境**，比如我们写一个项目需要依赖React/Vue/jQuery才能执行，没有这个包的依赖运行就会出错，这时候就必须把依赖写入dependencies里。

#### 2.相同点：

dependencies和 devDependencies相同的地方在于：就是当我们clone别人的库进行开发测试的时候，可以通过npm install 一键安装这两个目录下的所有依赖，而不需要一行行地查找别人到底在文件中引用了哪些依赖。

参考：[npm官方文档–dependencies](https://docs.npmjs.com/cli/v6/configuring-npm/package-json#dependencies)
