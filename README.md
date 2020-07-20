# ThinkPHP Vue 项目文档说明

    当前版本：
    ThinkPHP v:5.0.0
    Vue v:2.6.11

## 目录结构

|_ build: 项目构建配置

|_ server: ThinkPHP 包含服务端功能逻辑、配置等

    |_ ...{ThinkPHP项目架构及常用配置项}

|_ src: 前端主要功能逻辑、配置等

    |_ assets: 前端资源
    |_ components: Vue 组件
    |_ layouts: 页面布局
    |_ mixin: 混合配置项
    |_ module: 前端组结构模板

        |_ [index].html
        |_ [index].template.html: 页面主页布局+功能代码书写文件
        |_ [index].js
        |_ [index].scss

    |_ router: 路由（这里不一定用到）
    |_ store: 全局变量（本项目中特指本地存储，如：LocalStorage、SessionStorage、Cookie）
    |_ utils: 公共工具
    |_ views: 页面所依赖主逻辑及样式(js、scss)

|_ .babelrc: ES6 => es5 编译配置

|_ .gitignore: git 忽略 push 文件配置

|_ gulpfile.js: Gulp 构建配置

|_ package.json: npm 依赖

|_ README.md: 项目说明

|_ yarn.lock: 依赖关系

## 启动项目

### 启动服务端

- 通过 phpStudy 搭建本地服务器

### 启动前端项目

> 这里使用 Yarn 管理

- 项目未初始化，需执行

```shell
PS [项目根目录]> yarn
```

- 初始化后，启动本地编译-开发

```shell
PS [项目根目录]> yarn dev
```

执行此命令：
1、会自动将编译后的文件生成到：**application/public/assets/dev** 目录下
2、cli 自动监听文件的变化，包括（Change、Add、Unlink）

- 初始化后，启动本地编译-生产

```shell
PS [项目根目录]> yarn build
```

执行此命令，会自动将编译后的文件生成到：**application/public/assets/bundle** 目录下

- 生成页面模板

```shell
PS [项目根目录]> yarn [p | page] [file path]
```

如：

```shell
PS [项目根目录]> yarn p portal/view/user/login
```

执行以上命令会在 

1、application/index/view/user 文件夹下生成两个文件

|_ login.html

|_ login.template.html

2、src/views/index/user 文件夹下同样也生成两个文件

|_ login.[唯一标记 = MD5('index/view/user/login').substring(9, 25)].js

|_ login.[唯一标记 = MD5('index/view/user/login').substring(9, 25)].scss
