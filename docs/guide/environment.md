# 环境配置

## 浏览器项目

大多数项目是纯 HTML/CSS/JS，无需任何构建步骤：

1. 打开项目文件夹
2. 双击 `index.html` 即可在浏览器中运行
3. 按 `F12` 打开开发者工具 → Console 查看输出

## Node.js 项目

部分项目（阶段三）需要 Node.js 环境：

```bash
# 进入项目目录
cd 03-advanced/02-node-cli-tool

# 安装依赖（如有 package.json）
npm install

# 运行项目
npm start
# 或
node index.js
```

### Node.js 安装

如果尚未安装 Node.js，请访问 [nodejs.org](https://nodejs.org/) 下载 LTS 版本。

验证安装：
```bash
node --version    # 应显示 v18+ 或更高
npm --version     # 应显示 9+ 或更高
```

## Vite 项目

阶段四的项目使用 Vite 作为构建工具：

```bash
# 进入项目目录
cd 04-vite-projects/01-vite-vanilla-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 推荐工具

| 工具 | 用途 | 链接 |
|------|------|------|
| VS Code | 代码编辑器 | [code.visualstudio.com](https://code.visualstudio.com/) |
| Chrome DevTools | 浏览器调试 | 按 `F12` 打开 |
| Node.js | JavaScript 运行时 | [nodejs.org](https://nodejs.org/) |
| Git | 版本控制 | [git-scm.com](https://git-scm.com/) |

### VS Code 推荐插件

- **ESLint** — JavaScript 代码规范检查
- **Prettier** — 代码格式化
- **Live Server** — 本地 HTTP 服务器（用于 ES Modules 项目）
- **Vue - Official** — Vue 3 支持（阶段四）
