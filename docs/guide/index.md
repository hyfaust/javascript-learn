# 学习路线总览

> 一套由浅入深、项目驱动的 JavaScript 学习路线，专为完全零基础初学者设计。

## 路线图

```
阶段一：基础入门 (01-beginner/)     → 掌握核心语法与 DOM 操作
       ↓
阶段二：进阶特性 (02-intermediate/)  → 理解现代 JS 关键特性
       ↓
阶段三：现代开发实战 (03-advanced/)  → 真实场景项目实战
       ↓
阶段四：Vite 项目 (04-vite-projects/) → 现代前端工具链
```

## 🎯 学习原则

### 1. 先跑起来，再理解
- 所有项目都可以直接在浏览器或命令行运行
- 先看到效果，再回头理解代码逻辑
- 鼓励修改参数、注释代码，观察变化

### 2. 动手实验
- 每个项目末尾有「挑战任务」
- 不要只读代码，要改代码、跑代码
- 出错了？太好了！这是最佳学习机会

### 3. 避免过早抽象
- 初期不使用任何框架（React/Vue/jQuery）
- 聚焦原生 JavaScript
- 先理解「为什么需要抽象」，再学习抽象

### 4. 善用工具
- **浏览器开发者工具**：按 `F12` 打开，使用 Console 调试
- **VS Code**：推荐编辑器，安装 ESLint 插件
- **Node.js**：已安装，用于运行后端项目

## 📚 课程目录

### 阶段一：基础入门

| 项目 | 名称 | 核心知识点 |
|------|------|-----------|
| [01](/beginner/01-todo-list) | 交互式待办清单 | DOM 操作、事件监听、数组增删 |
| [02](/beginner/02-calculator) | 简易计算器 | 函数封装、输入验证、错误处理 |
| [03](/beginner/03-guess-game) | 猜数字游戏 | Math.random()、循环、条件判断 |
| [04](/beginner/04-weather-simulator) | 天气信息模拟器 | 对象、JSON、数据渲染 |
| [05](/beginner/05-digital-clock) | 动态时钟 | setInterval、时间格式化 |
| [06](/beginner/06-array-playground) | 数组方法实验室 | map/filter/reduce/sort |
| [07](/beginner/07-form-validator) | 表单验证器 | 正则表达式、事件处理 |

### 阶段二：进阶特性

| 专题 | 名称 | 核心知识点 |
|------|------|-----------|
| [01](/intermediate/01-arrow-functions) | 箭头函数 vs 普通函数 | this 绑定、语法对比 |
| [02](/intermediate/02-destructuring) | 解构赋值 | 数组/对象解构、默认值 |
| [03](/intermediate/03-template-literals) | 模板字符串 | 字符串插值、多行文本 |
| [04](/intermediate/04-promises-async) | Promise 与 async/await | 异步编程、fetch API |
| [05](/intermediate/05-es-modules) | ES Modules | import/export、模块化 |
| [06](/intermediate/06-optional-chaining) | 可选链与空值合并 | ?. 操作符、?? 操作符 |

### 阶段三：现代开发实战

| 项目 | 名称 | 技术栈 |
|------|------|--------|
| [01](/advanced/01-particle-animation) | 鼠标跟随粒子动画 | Canvas、requestAnimationFrame |
| [02](/advanced/02-node-cli-tool) | Node.js 命令行工具 | fs、path、process.argv |
| [03](/advanced/03-markdown-editor) | Markdown 编辑预览器 | 前后端通信、实时预览 |
| [04](/advanced/04-tampermonkey-script) | 油猴脚本 | DOM 监听、页面注入 |
| [05](/advanced/05-sort-visualizer) | 排序算法可视化 | 算法 + Canvas 动画 |
| [06](/advanced/06-express-api-server) | Express RESTful API | Express、路由、中间件 |
| [07](/advanced/07-websocket-chat) | WebSocket 实时聊天 | WebSocket、实时通信 |
| [08](/advanced/08-database-crud) | SQLite 数据库 CRUD | SQL、数据持久化 |

### 阶段四：Vite 项目

| 项目 | 名称 | 技术栈 |
|------|------|--------|
| [01](/vite-projects/01-vite-vanilla-app) | Vite 纯 JS 应用 | Vite、ESBuild、HMR |
| [02](/vite-projects/02-vite-ts-starter) | Vite + TypeScript | TypeScript、类型系统 |
| [03](/vite-projects/03-vite-vue-app) | Vite + Vue 3 | Vue 3、组合式 API、SFC |

## 💡 新手必读建议

### 必须养成的好习惯
1. **始终使用 `const`/`let`，绝不使用 `var`**
2. **理解 `==` 与 `===` 的区别**（推荐始终用 `===`）
3. **善用浏览器开发者工具**（Console、Elements、Sources）
4. **代码写注释**——给未来的自己看
5. **小步提交**——每次只改一点，确认能运行再继续

### 常见陷阱

| 陷阱 | 说明 | 避免方法 |
|------|------|---------|
| 作用域混淆 | `var` 会泄露到函数外 | 用 `const`/`let` |
| 异步陷阱 | `setTimeout` 不会阻塞代码 | 理解事件循环 |
| DOM 性能 | 频繁操作 DOM 会卡顿 | 批量操作或使用 DocumentFragment |
| this 指向 | 普通函数 vs 箭头函数的 this 不同 | 进阶阶段会详细讲解 |

## 🏃 快速开始

**零基础？从这里开始：**
1. 打开 `01-beginner/01-todo-list/`
2. 双击 `index.html` 在浏览器中打开
3. 尝试添加、删除待办事项
4. 打开 `script.js`，对照 README 阅读代码
5. 尝试修改代码，看看会发生什么

**已有基础？可以跳过：**
- 熟悉 HTML/CSS → 直接从 01-beginner/03 开始
- 学过其他编程语言 → 可以从 02-intermediate 开始

---

> 🎓 **学习建议**：每个项目花 1-2 小时，不要急于求成。理解比速度重要得多！
