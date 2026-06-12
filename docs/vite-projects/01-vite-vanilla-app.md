# 项目 01: Vite 纯 JS 应用 ⚡

## 🎯 项目目标
使用 Vite 构建一个纯 JavaScript 应用，体验现代化的开发工作流，理解为什么 Vite 比传统构建工具快得多。

## 📚 核心知识点

### 1. 什么是 Vite？
Vite（法语"快"的意思）是一个新一代前端构建工具：

| 特性 | Vite | Webpack |
|------|------|---------|
| 开发服务器启动 | 毫秒级 | 秒~分钟级 |
| 热更新（HMR） | 即时 | 随项目增大变慢 |
| 构建工具 | ESBuild（Go 编写） | 自身（JS 编写） |
| 配置复杂度 | 极简 | 较复杂 |

### 2. Vite 为什么快？
- **开发阶段**：利用浏览器原生 ES Modules，不需要打包
- **构建阶段**：使用 ESBuild（Go 语言编写，比 JS 打包器快 10-100 倍）
- **按需编译**：只编译当前请求的模块，而非整个项目

### 3. 热模块替换（HMR）
修改代码后，浏览器无需刷新即可更新：
```javascript
// Vite 的 HMR API
if (import.meta.hot) {
  import.meta.hot.accept(); // 接受热更新
}
```

### 4. ES Modules 在浏览器中的工作方式
```html
<!-- index.html 中直接使用 type="module" -->
<script type="module" src="/main.js"></script>
```

```javascript
// main.js 中使用 import/export
import './style.css';  // Vite 会自动处理 CSS
import { helper } from './utils.js';  // 原生 ES Module 导入
```

### 5. Vite 项目结构
```
01-vite-vanilla-app/
├── index.html        # 入口 HTML（Vite 以 HTML 为入口）
├── main.js           # 入口 JS
├── style.css         # 样式文件
├── vite.config.js    # Vite 配置
└── package.json      # 项目配置
```

::: tip 对比
传统项目中，`<script src="main.js">` 直接加载文件。Vite 项目中，`<script type="module" src="/main.js">` 触发 Vite 的模块解析，自动处理导入、CSS、TypeScript 等。
:::

## 📖 代码解析

### Vite 配置文件
```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,    // 开发服务器端口
    open: true,    // 自动打开浏览器
  },
  build: {
    outDir: 'dist', // 构建输出目录
  },
})
```

### CSS 导入
```javascript
// main.js 中直接导入 CSS
import './style.css';
// Vite 会自动将 CSS 注入到页面中，支持 HMR
```

## 🚀 运行方式

```bash
cd 04-vite-projects/01-vite-vanilla-app
npm install          # 安装 vite 依赖
npm run dev          # 启动开发服务器
```

浏览器自动打开 `http://localhost:5173`。

```bash
npm run build        # 构建生产版本（输出到 dist/）
npm run preview      # 预览生产构建
```

## ❌ 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `vite: command not found` | 未安装依赖 | 运行 `npm install` |
| `Port 5173 is already in use` | 端口被占用 | 关闭其他 Vite 实例或修改端口 |
| CSS 未生效 | 路径错误 | 检查 CSS 文件路径 |
| 模块加载失败 | 浏览器不支持 ES Modules | 使用现代浏览器（Chrome 60+） |

## 🔧 调试技巧

1. **Vite DevTools**：浏览器 Network 标签可以看到每个模块的请求
2. **Source Maps**：Vite 开发模式自动生成 source map，可直接调试源码
3. **终端日志**：Vite 终端会显示编译错误和警告

## 🏆 挑战任务

### ⭐ 简单
修改 `main.js` 中的计数器步长，从每次 +1 改为 +10

### ⭐⭐ 中等
添加一个「暗色模式」切换按钮，使用 CSS 变量实现主题切换

### ⭐⭐⭐ 困难
添加一个「Fetch API」演示卡片，从公开 API 获取数据并显示

## 📖 延伸学习

- [Vite 官方文档](https://vitejs.dev/)
- [Vite 为什么这么快？](https://vitejs.dev/guide/why.html)
- [ES Modules MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)
