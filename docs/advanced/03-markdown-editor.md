# Markdown 编辑器

一个带有实时预览功能的 Markdown 编辑器，支持工具栏快捷操作、自动保存和 HTML 导出。

## 功能特性

- **实时预览**: 输入 Markdown 时右侧同步显示渲染效果
- **工具栏按钮**: 一键插入标题、粗体、斜体、列表、链接等语法
- **键盘快捷键**: Ctrl+B 粗体、Ctrl+I 斜体、Ctrl+1/2/3 标题、Ctrl+K 链接
- **自动保存**: 内容自动保存到浏览器 LocalStorage
- **可调节面板**: 拖拽中间分隔条调整编辑器和预览区比例
- **导出 HTML**: 一键导出为带样式的独立 HTML 文件
- **深色主题**: 编辑器采用舒适的暗色配色方案

## Markdown 解析基础

### 什么是解析器？

解析器（Parser）是将一种格式的数据转换为另一种格式的程序。在本项目中，Markdown 解析器将 Markdown 文本转换为 HTML。

### 解析过程

```
Markdown 文本 → 词法分析 → 语法分析 → 生成 HTML
```

本项目采用**两步解析**策略：

#### 1. 块级解析（Block-level）

首先按行处理，识别块级元素：

```javascript
// 标题：以 # 开头
if (line.match(/^#{1,6}\s+(.+)$/)) {
    const level = match[1].length;  // # 的数量
    html += `<h${level}>${content}</h${level}>`;
}

// 列表：以 - 开头
if (line.startsWith('- ')) {
    if (!inList) { html += '<ul>'; inList = true; }
    html += `<li>${content}</li>`;
}

// 引用：以 > 开头
if (line.startsWith('> ')) {
    if (!inBlockquote) { html += '<blockquote>'; inBlockquote = true; }
    html += `<p>${content}</p>`;
}
```

#### 2. 行内解析（Inline-level）

在块级内容内部，解析行内元素：

```javascript
// 粗体：**text**
text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

// 斜体：*text*
text.replace(/\*(.+?)\*/g, '<em>$1</em>');

// 链接：[text](url)
text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

// 行内代码：`code`
text.replace(/`([^`]+)`/g, '<code>$1</code>');
```

### 解析顺序的重要性

某些 Markdown 语法存在嵌套和冲突，解析顺序很关键：

1. 先处理**代码块**（代码块内不解析其他语法）
2. 处理**块级元素**（标题、列表、引用等）
3. 处理**行内代码**（避免代码内的语法被解析）
4. 处理**图片**（`![alt](url)` 包含链接语法）
5. 处理**链接**
6. 处理**粗体和斜体**

### 正则表达式基础

| 模式 | 含义 | 示例 |
|------|------|------|
| `^` | 行首 | `^#` 匹配行首的 # |
| `$` | 行尾 | `---$` 匹配行尾的 --- |
| `.` | 任意字符 | `a.c` 匹配 abc, adc 等 |
| `*` | 零次或多次 | `a*` 匹配 "", "a", "aa" |
| `+` | 一次或多次 | `a+` 匹配 "a", "aa" |
| `?` | 零次或一次（非贪婪） | `a??` 非贪婪匹配 |
| `\s` | 空白字符 | 空格、制表符、换行 |
| `\d` | 数字 | `[0-9]` |
| `[abc]` | 字符集 | 匹配 a、b 或 c |
| `[^abc]` | 否定字符集 | 匹配除 a、b、c 外的字符 |
| `()` | 捕获组 | 提取匹配的部分 |
| `(?:)` | 非捕获组 | 分组但不捕获 |

## 防抖（Debounce）

### 什么是防抖？

防抖是一种性能优化技术，用于限制函数的执行频率。当事件频繁触发时，防抖确保函数只在事件停止触发一段时间后执行一次。

### 工作原理

```
事件触发 ──→ 重置计时器 ──→ 事件触发 ──→ 重置计时器 ──→ ... ──→ [等待延迟] ──→ 执行函数
   t=0         t=100ms          t=200ms         t=300ms                         t=600ms
```

### 实现代码

```javascript
function debounce(func, delay) {
    let timerId = null;  // 闭包保存定时器 ID
    
    return function(...args) {
        // 清除之前的定时器
        if (timerId !== null) {
            clearTimeout(timerId);
        }
        
        // 设置新定时器
        timerId = setTimeout(() => {
            func.apply(this, args);
            timerId = null;
        }, delay);
    };
}
```

### 使用场景

| 场景 | 问题 | 防抖解决 |
|------|------|----------|
| 搜索框输入 | 每输入一个字符就发送请求 | 停止输入 300ms 后才发送 |
| 窗口调整大小 | 频繁重新计算布局 | 停止调整后才计算 |
| 文本预览 | 每按键就解析 Markdown | 停止输入后才更新预览 |

### 防抖 vs 节流

- **防抖（Debounce）**: 事件停止触发 N 毫秒后才执行
- **节流（Throttle）**: 在固定时间间隔内最多执行一次

## LocalStorage 数据持久化

### Web Storage API

浏览器提供了两种客户端存储机制：

| 特性 | LocalStorage | SessionStorage |
|------|-------------|----------------|
| 数据有效期 | 永久（手动清除） | 关闭标签页清除 |
| 存储容量 | 约 5-10 MB | 约 5 MB |
| 共享 | 同源所有页面 | 仅当前标签页 |
| 发送请求 | 不随请求发送 | 不随请求发送 |

### 基本操作

```javascript
// 保存数据（值必须是字符串）
localStorage.setItem('key', 'value');

// 读取数据（不存在返回 null）
const value = localStorage.getItem('key');

// 删除指定数据
localStorage.removeItem('key');

// 清空所有数据
localStorage.clear();
```

### 存储复杂数据

LocalStorage 只能存储字符串，需要使用 JSON 序列化：

```javascript
// 保存对象
const data = { name: 'John', age: 30 };
localStorage.setItem('user', JSON.stringify(data));

// 读取对象
const user = JSON.parse(localStorage.getItem('user'));
```

### 注意事项

1. **同步操作**: LocalStorage 读写会阻塞主线程
2. **存储空间**: 存储满时会抛出 `QuotaExceededError`
3. **安全性**: 不要存储敏感信息（密码、Token 等）
4. **兼容性**: 所有现代浏览器都支持

## 如何使用

1. 直接在浏览器中打开 `index.html` 文件
2. 在左侧编辑器输入 Markdown 文本
3. 右侧实时显示渲染效果
4. 使用工具栏按钮或键盘快捷键快速插入语法
5. 拖拽中间分隔条调整面板宽度
6. 点击"导出 HTML"按钮下载 HTML 文件

## 文件结构

```
03-markdown-editor/
├── index.html    # 页面结构（工具栏 + 双栏布局）
├── style.css     # 样式表（深色主题 + 响应式）
├── script.js     # 主要逻辑（解析器 + 编辑器功能）
└── README.md     # 说明文档
```

## 挑战任务

### 初级挑战

1. **添加表格支持**: 解析 Markdown 表格语法（`| 列1 | 列2 |`）
2. **添加任务列表**: 支持 `- [ ]` 和 `- [x]` 语法
3. **更改主题**: 添加亮色/暗色主题切换按钮

### 中级挑战

4. **添加撤销/重做**: 使用栈结构实现 Ctrl+Z / Ctrl+Y 功能
5. **字数统计**: 在底部显示字数和行数统计
6. **同步滚动**: 编辑器滚动时，预览区按相同比例滚动

### 高级挑战

7. **使用 marked.js**: 用第三方解析库替换自定义解析器，对比功能差异
8. **添加图片上传**: 支持拖拽上传图片并自动生成 Markdown 图片语法
9. **添加主题插件系统**: 允许用户自定义 CSS 变量来改变编辑器主题

## 技术栈

- HTML5
- CSS3（Flexbox、自定义属性、响应式设计）
- 原生 JavaScript（ES6+，正则表达式，闭包，事件处理）
