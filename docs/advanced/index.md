# 阶段三：现代开发实战

本阶段通过真实场景项目，综合运用前两阶段所学知识，并引入 Node.js 后端开发。

## 项目列表

### 浏览器项目

| 项目 | 名称 | 技术栈 | 难度 |
|------|------|--------|------|
| [01](./01-particle-animation) | 鼠标跟随粒子动画 | Canvas、requestAnimationFrame | ⭐⭐⭐ |
| [03](./03-markdown-editor) | Markdown 编辑预览器 | 自定义解析器、LocalStorage | ⭐⭐⭐ |
| [04](./04-tampermonkey-script) | 油猴脚本 | GM_* API、MutationObserver | ⭐⭐⭐ |
| [05](./05-sort-visualizer) | 排序算法可视化 | 4 种排序算法、async/await 动画 | ⭐⭐⭐ |

### Node.js 项目

| 项目 | 名称 | 技术栈 | 难度 |
|------|------|--------|------|
| [02](./02-node-cli-tool) | Node.js 命令行工具 | fs、path、process（零依赖） | ⭐⭐⭐ |
| [06](./06-express-api-server) | Express RESTful API | Express、中间件、路由 | ⭐⭐⭐ |
| [07](./07-websocket-chat) | WebSocket 实时聊天 | ws、事件驱动、实时通信 | ⭐⭐⭐ |
| [08](./08-database-crud) | SQLite 数据库 CRUD | better-sqlite3、SQL | ⭐⭐⭐ |

## 学习建议

1. 浏览器项目可以直接双击 `index.html` 运行（粒子动画、排序可视化）
2. Node.js 项目需要先 `npm install` 安装依赖
3. 建议按编号顺序学习，由浅入深
4. 重点关注 Node.js 项目的模块化设计和错误处理
