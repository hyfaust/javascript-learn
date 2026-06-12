# 项目 08: SQLite 数据库 CRUD 🗄️

## 🎯 项目目标
使用 SQLite 数据库构建一个完整的 CRUD 应用，支持命令行和 HTTP API 两种操作模式，理解数据库操作和数据持久化。

## 📚 核心知识点

### 1. SQLite 简介
SQLite 是一个轻量级的嵌入式数据库，数据存储在单个文件中：

| 特性 | SQLite | MySQL/PostgreSQL |
|------|--------|-----------------|
| 安装 | 零配置，嵌入应用 | 需要独立安装/部署 |
| 数据存储 | 单个 `.db` 文件 | 服务器进程管理 |
| 适用场景 | 本地应用、原型开发 | 生产环境、多用户并发 |
| 性能 | 读多写少场景优秀 | 高并发场景更好 |

### 2. better-sqlite3 库
```javascript
const Database = require('better-sqlite3');

// 创建/打开数据库（文件不存在会自动创建）
const db = new Database('todos.db');

// 执行 SQL（建表）
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
  )
`);

// 预编译语句（防 SQL 注入）
const insert = db.prepare('INSERT INTO todos (title) VALUES (?)');
insert.run('Learn SQLite');

// 查询数据
const selectAll = db.prepare('SELECT * FROM todos');
const todos = selectAll.all();
```

### 3. SQL 基础语法
```sql
-- 创建表
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed INTEGER DEFAULT 0
);

-- 插入数据
INSERT INTO todos (title) VALUES ('Learn SQL');

-- 查询数据
SELECT * FROM todos WHERE completed = 0 ORDER BY id DESC;

-- 更新数据
UPDATE todos SET completed = 1 WHERE id = 1;

-- 删除数据
DELETE FROM todos WHERE id = 1;
```

### 4. 预编译语句（Prepared Statements）
使用 `?` 占位符防止 SQL 注入攻击：
```javascript
// ❌ 危险：字符串拼接（SQL 注入风险）
db.exec(`INSERT INTO todos (title) VALUES ('${userInput}')`);

// ✅ 安全：预编译语句
const stmt = db.prepare('INSERT INTO todos (title) VALUES (?)');
stmt.run(userInput); // 自动转义特殊字符
```

### 5. CRUD 模式
本项目提供两种操作模式：
- **CLI 模式**：命令行交互式菜单
- **HTTP 模式**：RESTful API 服务器

## 📖 代码解析

### 项目结构
```
08-database-crud/
├── database.js    # 数据库层：SQLite 连接和 CRUD 操作
├── index.js       # CLI 模式：命令行交互菜单
├── server.js      # HTTP 模式：RESTful API 服务器
└── package.json   # 依赖配置
```

### 数据流
```
CLI 模式:  用户输入 → readline → database.js → SQLite → 输出
HTTP 模式: HTTP 请求 → server.js → database.js → SQLite → JSON 响应
```

## 🚀 运行方式

### CLI 模式（命令行交互）
```bash
cd 03-advanced/08-database-crud
npm install
npm start          # 启动命令行菜单
```

### HTTP 模式（API 服务器）
```bash
npm run server     # 启动 HTTP 服务器
```

然后用 curl 测试：
```bash
# 获取所有待办
curl http://localhost:3000/api/todos

# 创建待办
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn SQLite"}'

# 切换完成状态
curl -X PATCH http://localhost:3000/api/todos/1/toggle
```

## ❌ 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `Cannot find module 'better-sqlite3'` | 未安装依赖 | 运行 `npm install` |
| `SQLITE_ERROR: near ...` | SQL 语法错误 | 检查 SQL 语句 |
| `SQLITE_CONSTRAINT: UNIQUE` | 违反唯一约束 | 检查数据是否重复 |
| 数据库文件损坏 | 异常关闭 | 删除 `.db` 文件重新创建 |

## 🔧 调试技巧

1. **查看数据库文件**：`todos.db` 是 SQLite 文件，可用 [DB Browser for SQLite](https://sqlitebrowser.org/) 打开
2. **SQL 日志**：在 `database.js` 中添加 `console.log` 查看执行的 SQL
3. **WAL 模式**：已启用，提供更好的并发读性能

## 🏆 挑战任务

### ⭐ 简单
添加「按状态筛选」功能：CLI 模式中可以只查看已完成或未完成的待办

### ⭐⭐ 中等
添加数据导出功能：将待办事项导出为 JSON 或 CSV 文件

### ⭐⭐⭐ 困难
添加「标签」功能：每个待办可以有多个标签（需要学习多表关联查询）

## 📖 延伸学习

- [SQLite 官方文档](https://www.sqlite.org/docs.html)
- [better-sqlite3 GitHub](https://github.com/WiseLibs/better-sqlite3)
- [SQL 教程 - W3School](https://www.w3school.com.cn/sql/)
- [DB Browser for SQLite](https://sqlitebrowser.org/) — 可视化数据库管理工具
