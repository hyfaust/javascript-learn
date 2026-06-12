# JavaScript 系统学习路径

[English](README.md) | [简体中文](README_zh.md)

---

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![VitePress](https://img.shields.io/badge/docs-VitePress-646cff.svg)](https://vitepress.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff.svg)](https://vitejs.dev/)

> 一套由浅入深、项目驱动的 JavaScript 学习路线 —— 从零基础到现代前端开发，包含 24 个实战项目和 VitePress 文档站。

---

> ⚠️ **声明**：本项目及其文档由 AI 辅助生成，内容仅供参考和学习使用。在生产环境中使用前，请自行验证和适配代码。

---

## 目录

- [简介](#简介)
- [学习路线](#学习路线)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [课程概览](#课程概览)
  - [阶段一：基础入门](#阶段一基础入门)
  - [阶段二：进阶特性](#阶段二进阶特性)
  - [阶段三：现代开发实战](#阶段三现代开发实战)
  - [阶段四：Vite 项目](#阶段四vite-项目)
- [文档站](#文档站)
- [许可证](#许可证)

## 简介

本仓库是一个面向完全零基础初学者的结构化 JavaScript 学习路径。包含 **24 个项目**，分为 4 个渐进式阶段，涵盖从基础 DOM 操作到 Vite、TypeScript、Vue 3 等现代前端工具链的全部内容。

**核心特色：**

- **从零到进阶** —— 从 `getElementById` 到 Vue 3 + Pinia
- **项目驱动** —— 每个知识点都通过一个可运行的项目来学习
- **前期无需构建工具** —— 直接双击 `index.html` 即可运行
- **详细中文注释** —— 每一行代码都有解释
- **挑战任务** —— 每个项目附带简单 / 中等 / 困难三个难度的挑战
- **VitePress 文档站** —— 支持全文搜索、暗色模式、移动端适配

## 学习路线

```
阶段一：基础入门 (01-beginner/)       → 掌握核心语法与 DOM 操作
       ↓
阶段二：进阶特性 (02-intermediate/)    → 理解现代 JS 关键特性
       ↓
阶段三：现代开发实战 (03-advanced/)    → 真实场景项目实战
       ↓
阶段四：Vite 项目 (04-vite-projects/)  → 现代前端工具链
```

## 快速开始

### 浏览器项目（阶段一 & 阶段二）

无需安装任何依赖，直接打开 HTML 文件即可：

```bash
# 进入任意项目
cd 01-beginner/01-todo-list
# 双击 index.html，或使用本地服务器：
npx serve .
```

### Node.js 项目（阶段三）

```bash
cd 03-advanced/06-express-api-server
npm install
npm start
```

### Vite 项目（阶段四）

```bash
cd 04-vite-projects/03-vite-vue-app
npm install
npm run dev
```

### 文档站

```bash
npm install
npm run docs:dev      # 启动开发服务器（localhost:5173）
npm run docs:build    # 构建静态站点
npm run docs:preview  # 预览构建结果
```

## 项目结构

```
javascript-learn/
├── 01-beginner/              # 阶段一：7 个入门项目
│   ├── 01-todo-list/         #   DOM、事件、数组
│   ├── 02-calculator/        #   函数封装、输入验证
│   ├── 03-guess-game/        #   Math.random、循环
│   ├── 04-weather-simulator/ #   对象、JSON
│   ├── 05-digital-clock/     #   setInterval、Date
│   ├── 06-array-playground/  #   map/filter/reduce
│   └── 07-form-validator/    #   正则表达式、事件处理
│
├── 02-intermediate/          # 阶段二：6 个 ES6+ 特性演示
│   ├── 01-arrow-functions/   #   this 绑定、语法对比
│   ├── 02-destructuring/     #   数组/对象解构
│   ├── 03-template-literals/ #   字符串插值
│   ├── 04-promises-async/    #   async/await、fetch
│   ├── 05-es-modules/        #   import/export
│   └── 06-optional-chaining/ #   ?. 和 ?? 操作符
│
├── 03-advanced/              # 阶段三：8 个进阶项目
│   ├── 01-particle-animation/  # Canvas、requestAnimationFrame
│   ├── 02-node-cli-tool/       # Node.js、fs、path
│   ├── 03-markdown-editor/     # 自定义解析器、LocalStorage
│   ├── 04-tampermonkey-script/ # 油猴 API
│   ├── 05-sort-visualizer/     # 排序算法 + 动画
│   ├── 06-express-api-server/  # Express、REST API、中间件
│   ├── 07-websocket-chat/      # WebSocket、实时通信
│   └── 08-database-crud/       # SQLite、better-sqlite3
│
├── 04-vite-projects/         # 阶段四：3 个 Vite 项目
│   ├── 01-vite-vanilla-app/  # Vite + 原生 JS
│   ├── 02-vite-ts-starter/   # Vite + TypeScript
│   └── 03-vite-vue-app/      # Vite + Vue 3 + Router + Pinia
│
├── docs/                     # VitePress 文档站
│   ├── .vitepress/config.mts # 站点配置
│   ├── index.md              # 首页
│   ├── guide/                # 学习路线 & 环境配置
│   ├── beginner/             # 阶段一文档
│   ├── intermediate/         # 阶段二文档
│   ├── advanced/             # 阶段三文档
│   └── vite-projects/        # 阶段四文档
│
├── .github/workflows/        # GitHub Pages 自动部署
├── package.json              # VitePress 依赖
├── LICENSE                   # GPL v3 许可证
└── README.md
```

## 课程概览

### 阶段一：基础入门

所有项目直接在浏览器中运行，无需构建工具和 npm。

| 编号 | 项目 | 核心知识点 |
|------|------|-----------|
| 01 | 交互式待办清单 | DOM 操作、事件监听、数组增删 |
| 02 | 简易计算器 | 函数封装、输入验证、错误处理 |
| 03 | 猜数字游戏 | Math.random()、循环、条件判断 |
| 04 | 天气信息模拟器 | 对象、JSON、数据渲染 |
| 05 | 动态时钟 | setInterval、时间格式化 |
| 06 | 数组方法实验室 | map / filter / reduce / sort / find |
| 07 | 表单验证器 | 正则表达式、事件处理 |

### 阶段二：进阶特性

现代 JavaScript 特性的交互式演示。

| 编号 | 主题 | 核心知识点 |
|------|------|-----------|
| 01 | 箭头函数 vs 普通函数 | `this` 绑定、语法对比 |
| 02 | 解构赋值 | 数组/对象解构、默认值 |
| 03 | 模板字符串 | 字符串插值、多行文本 |
| 04 | Promise 与 async/await | 异步编程、fetch API |
| 05 | ES Modules | import / export、模块系统 |
| 06 | 可选链与空值合并 | `?.` 和 `??` 操作符 |

### 阶段三：现代开发实战

包含 Node.js 后端开发的真实场景项目。

| 编号 | 项目 | 技术栈 |
|------|------|--------|
| 01 | 鼠标跟随粒子动画 | Canvas 2D、requestAnimationFrame、面向对象 |
| 02 | Node.js 命令行工具 | fs、path、process（零依赖） |
| 03 | Markdown 编辑预览器 | 自定义解析器、LocalStorage、DOM |
| 04 | 油猴脚本 | UserScript API、MutationObserver |
| 05 | 排序算法可视化 | 4 种排序算法、async/await 动画 |
| 06 | Express RESTful API | Express、路由、中间件 |
| 07 | WebSocket 实时聊天 | ws、事件驱动、实时通信 |
| 08 | SQLite 数据库 CRUD | better-sqlite3、SQL、CLI & HTTP 模式 |

### 阶段四：Vite 项目

使用 Vite 的现代前端工具链。

| 编号 | 项目 | 技术栈 |
|------|------|--------|
| 01 | Vite 纯 JS 应用 | Vite、ESBuild、HMR |
| 02 | Vite + TypeScript | TypeScript、类型系统、泛型 |
| 03 | Vite + Vue 3 | Vue 3、组合式 API、Vue Router、Pinia |

## 文档站

本项目包含一个基于 [VitePress](https://vitepress.dev/) 构建的完整文档站。

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev

# 构建生产版本
npm run docs:build

# 预览构建结果
npm run docs:preview
```

文档站特性：
- 🌐 24 个项目的中文文档
- 🔍 全文搜索
- 🌙 暗色模式
- 📱 移动端适配
- 🚀 通过 GitHub Actions 自动部署到 GitHub Pages

## 许可证

本项目基于 [GNU 通用公共许可证 v3.0](LICENSE) 开源。

```
本程序是自由软件：你可以再分发和/或修改它，
遵循由自由软件基金会发布的 GNU 通用公共许可证第 3 版，
或（根据你的选择）任何更高版本。
```
