# 项目 07: WebSocket 实时聊天室 💬

## 🎯 项目目标
基于 WebSocket 协议构建一个多人实时聊天室，理解实时通信的原理和事件驱动编程模型。

## 📚 核心知识点

### 1. WebSocket 协议
WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议：

| 特性 | HTTP | WebSocket |
|------|------|-----------|
| 通信方式 | 请求-响应（单向） | 全双工（双向） |
| 连接状态 | 无状态 | 有状态（持久连接） |
| 服务端推送 | 不支持（需要轮询） | 原生支持 |
| 数据格式 | 文本/二进制 | 文本/二进制（帧） |
| 典型场景 | 网页加载、API 调用 | 聊天、游戏、实时数据 |

### 2. ws 库（Node.js WebSocket 库）
```javascript
const { WebSocketServer } = require('ws');

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // 接收消息
  ws.on('message', (data) => {
    console.log('Received:', data.toString());
  });

  // 发送消息
  ws.send('Welcome!');
});
```

### 3. 事件驱动编程
WebSocket 基于事件模型，常见事件：
- `connection` — 新客户端连接
- `message` — 收到消息
- `close` — 客户端断开
- `error` — 发生错误

```javascript
ws.on('message', (data) => { /* 处理消息 */ });
ws.on('close', () => { /* 清理资源 */ });
ws.on('error', (err) => { /* 错误处理 */ });
```

### 4. 广播模式
将消息发送给所有连接的客户端：
```javascript
function broadcast(message) {
  const data = JSON.stringify(message);
  for (const client of wss.clients) {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(data);
    }
  }
}
```

### 5. 浏览器端 WebSocket API
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => console.log('Connected');
ws.onmessage = (event) => console.log('Received:', event.data);
ws.onclose = () => console.log('Disconnected');

ws.send(JSON.stringify({ type: 'chat', content: 'Hello!' }));
```

## 📖 代码解析

### 项目结构
```
07-websocket-chat/
├── server.js       # WebSocket 服务器 + HTTP 静态文件服务
├── index.html      # 聊天客户端页面
├── style.css       # 样式
└── package.json    # 依赖配置
```

### 消息格式
```javascript
// 聊天消息
{ type: 'chat', username: 'Alice', content: 'Hello!', timestamp: '14:30:00' }

// 系统消息
{ type: 'system', content: 'A new user joined', online: 3 }
```

### 通信流程
```
浏览器 A ──ws──→ 服务器 ──ws──→ 浏览器 B
浏览器 B ──ws──→ 服务器 ──ws──→ 浏览器 A
```

## 🚀 运行方式

```bash
cd 03-advanced/07-websocket-chat
npm install          # 安装 ws 依赖
npm start            # 启动服务器
```

打开浏览器访问 `http://localhost:3000`，在多个标签页中打开以测试多人聊天。

## ❌ 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `Cannot find module 'ws'` | 未安装依赖 | 运行 `npm install` |
| `WebSocket connection failed` | 服务器未启动 | 先运行 `npm start` |
| `SyntaxError: Unexpected token` | JSON 解析错误 | 检查消息格式 |
| 消息发送后无响应 | 客户端未正确解析 | 检查 `ws.onmessage` 处理 |

## 🔧 调试技巧

1. **浏览器 DevTools**：Network 标签 → WS 过滤，查看 WebSocket 帧
2. **多标签页测试**：在同一浏览器中打开多个标签页
3. **Console 日志**：服务器端和客户端都有连接/断开日志

## 🏆 挑战任务

### ⭐ 简单
添加用户昵称输入框，让每条消息显示发送者的名字

### ⭐⭐ 中等
添加「正在输入...」提示：当用户在输入框中打字时，其他用户看到提示

### ⭐⭐⭐ 困难
添加私聊功能：`/whisper username message` 只发送给指定用户

## 📖 延伸学习

- [WebSocket MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)
- [ws 库 GitHub](https://github.com/websockets/ws)
- [Socket.io](https://socket.io/) — 更高级的实时通信库
