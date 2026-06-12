# 阶段四：Vite 项目

本阶段引入现代前端构建工具 Vite，体验现代化的开发工作流。

## 前置要求

- 已完成阶段一至阶段三的学习
- 已安装 Node.js v18+ 和 npm
- 了解基本的命令行操作

## 项目列表

| 项目 | 名称 | 技术栈 | 难度 |
|------|------|--------|------|
| [01](./01-vite-vanilla-app) | Vite 纯 JS 应用 | Vite、ESBuild、HMR | ⭐⭐⭐ |
| [02](./02-vite-ts-starter) | Vite + TypeScript | TypeScript、类型系统 | ⭐⭐⭐ |
| [03](./03-vite-vue-app) | Vite + Vue 3 | Vue 3、组合式 API、SFC | ⭐⭐⭐⭐ |

## 通用操作

所有 Vite 项目的操作方式一致：

```bash
# 进入项目目录
cd 04-vite-projects/01-vite-vanilla-app

# 安装依赖
npm install

# 启动开发服务器（支持热模块替换）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 学习建议

1. **重点理解 Vite 的工作原理**：为什么比 Webpack 快？ESBuild 做了什么？
2. **体验 HMR**：修改代码后观察浏览器如何无刷新更新
3. **对比零构建工具**：思考阶段一的纯 HTML 项目和 Vite 项目的开发体验差异
4. **阅读 `vite.config.ts`**：理解构建工具的配置方式
