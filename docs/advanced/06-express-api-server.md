# 项目 06: Express RESTful API 🌐

## 🎯 项目目标
使用 Express 框架构建一个完整的 RESTful API 服务，实现笔记（Notes）的增删改查操作，理解服务端开发的核心概念。

## 📚 核心知识点

### 1. Express 框架基础
Express 是 Node.js 最流行的 Web 框架，提供了简洁的 API 来创建 Web 服务器：
```javascript
const express = require('express');
const app = express();

// 中间件：解析 JSON 请求体
app.use(express.json());

// 路由：处理 HTTP 请求
app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

// 启动服务器
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### 2. RESTful API 设计
REST 是一种 API 设计风格，用 HTTP 方法表示操作：

| HTTP 方法 | 路径 | 操作 | 示例 |
|-----------|------|------|------|
| GET | /api/notes | 获取所有笔记 | `fetch('/api/notes')` |
| GET | /api/notes/1 | 获取单个笔记 | `fetch('/api/notes/1')` |
| POST | /api/notes | 创建笔记 | `fetch('/api/notes', { method: 'POST', body: ... })` |
| PUT | /api/notes/1 | 更新笔记 | `fetch('/api/notes/1', { method: 'PUT', body: ... })` |
| DELETE | /api/notes/1 | 删除笔记 | `fetch('/api/notes/1', { method: 'DELETE' })` |

### 3. 路由模块化
将路由拆分到独立文件，保持代码组织清晰：
```javascript
// routes/notes.js
const router = express.Router();

router.get('/', (req, res) => { /* 获取所有 */ });
router.get('/:id', (req, res) => { /* 获取单个 */ });
router.post('/', (req, res) => { /* 创建 */ });

module.exports = router;

// index.js
app.use('/api/notes', notesRouter);
```

### 4. 中间件（Middleware）
中间件是请求处理链中的函数，可以：
- 解析请求体（`express.json()`）
- 记录日志
- 验证身份
- 处理错误

```javascript
// 自定义日志中间件
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // 传递给下一个中间件
});
```

### 5. HTTP 状态码
| 状态码 | 含义 | 使用场景 |
|--------|------|---------|
| 200 | OK | 成功获取/更新数据 |
| 201 | Created | 成功创建资源 |
| 400 | Bad Request | 请求参数错误 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器内部错误 |

## 📖 代码解析

### 项目结构
```
06-express-api-server/
├── index.js              # 主入口：创建 Express 应用
├── routes/
│   └── notes.js          # 笔记路由：CRUD 操作
├── middleware/
│   └── errorHandler.js   # 错误处理中间件
└── package.json          # 项目配置和依赖
```

### 数据流
```
客户端请求 → Express 中间件 → 路由处理 → 响应返回
     ↓              ↓              ↓           ↓
  HTTP 请求    解析/日志/验证   业务逻辑    JSON 响应
```

## 🚀 运行方式

```bash
cd 03-advanced/06-express-api-server
npm install          # 安装 express 依赖
npm start            # 启动服务器
# 或
npm run dev          # 开发模式（自动重启）
```

服务器启动后，可以用以下方式测试：
- 浏览器访问 `http://localhost:3000` 查看 API 信息
- 使用 `curl` 命令测试 API

```bash
# 获取所有笔记
curl http://localhost:3000/api/notes

# 创建笔记
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "New Note", "content": "Hello Express!"}'

# 搜索笔记
curl "http://localhost:3000/api/notes?keyword=express"
```

## ❌ 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `Cannot find module 'express'` | 未安装依赖 | 运行 `npm install` |
| `EADDRINUSE: port 3000` | 端口被占用 | 更换端口或关闭占用进程 |
| `SyntaxError: Unexpected token` | JSON 格式错误 | 检查请求体的 JSON 格式 |
| `req.body is undefined` | 未使用 JSON 中间件 | 确保 `app.use(express.json())` 在路由之前 |

## 🔧 调试技巧

1. **查看请求日志**：中间件已记录每个请求的方法和路径
2. **使用浏览器**：GET 请求可以直接在浏览器中查看
3. **使用 curl `-v` 参数**：查看完整的请求/响应头
4. **检查状态码**：非 200 状态码表示有问题

## 🏆 挑战任务

### ⭐ 简单
为 API 添加分页功能：`GET /api/notes?page=1&limit=10`

### ⭐⭐ 中等
添加数据验证：创建笔记时，title 不能超过 100 字符，content 不能为空

### ⭐⭐⭐ 困难
添加一个用户系统：`/api/users` 路由，笔记关联到用户（`userId` 字段）

## 📖 延伸学习

- [Express 官方文档](https://expressjs.com/)
- [RESTful API 设计指南](https://restfulapi.net/)
- [HTTP 状态码完整列表](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
