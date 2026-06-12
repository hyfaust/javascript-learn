# 项目 01: 交互式待办清单 📝

## 🎯 项目目标
创建一个可以在浏览器中添加、删除、标记完成的待办清单应用。

## 📚 核心知识点

### 1. DOM 操作（文档对象模型）
DOM 是浏览器对 HTML 页面的「编程接口」。通过 JavaScript 可以：
- **获取元素**: `document.getElementById('id')`
- **创建元素**: `document.createElement('标签名')`
- **添加元素**: `父元素.appendChild(子元素)`
- **修改内容**: `元素.textContent = '新文本'`
- **修改样式类**: `元素.classList.add('类名')`

### 2. 事件监听
事件是用户与页面的交互（点击、输入、按键等）：
```javascript
元素.addEventListener('事件类型', 回调函数);

// 示例
button.addEventListener('click', () => {
    console.log('按钮被点击了！');
});
```

### 3. 数组基础操作
```javascript
let arr = [];
arr.push(item);      // 在末尾添加
arr.splice(i, 1);    // 删除索引 i 处的元素
arr.forEach(fn);     // 遍历每个元素
```

### 4. 变量声明
```javascript
const todoInput = document.getElementById('...');  // 常量，不会重新赋值
let todos = [];     // 变量，可以重新赋值（但这里我们只修改数组内容）
```

> **重要**: 始终使用 `const` 和 `let`，**不要使用 `var`**！

## 📖 代码解析

### 整体结构
```
HTML (结构) + CSS (样式) + JavaScript (逻辑)
     ↓              ↓              ↓
  页面骨架       美观外观      交互功能
```

### 数据流向
```
用户输入 → addTodo() → todos数组 → renderTodos() → 页面显示
   ↓                      ↓
 输入框              数组操作(push/splice)
```

### 关键代码解读

**获取 DOM 元素**
```javascript
const todoInput = document.getElementById('todoInput');
// 这行代码获取 HTML 中 id="todoInput" 的输入框元素
```

**添加待办**
```javascript
function addTodo(text) {
    const newTodo = { text: text, completed: false };
    todos.push(newTodo);  // 添加到数组
    renderTodos();        // 刷新页面显示
}
```

**渲染列表**
```javascript
todos.forEach((todo, index) => {
    const li = document.createElement('li');  // 创建 li 元素
    // ... 设置内容和事件
    todoList.appendChild(li);  // 添加到列表
});
```

## 🚀 运行方式
1. 双击 `index.html` 在浏览器中打开
2. 在输入框中输入内容，点击「添加」或按回车
3. 点击待办文本可以标记完成/未完成
4. 点击「删除」按钮删除待办

## ⚠️ 常见错误

| 错误 | 原因 | 解决方法 |
|------|------|---------|
| `Cannot read property 'value' of null` | 元素 ID 写错了 | 检查 HTML 和 JS 中的 ID 是否一致 |
| 点击没反应 | 事件没绑定成功 | 在 Console 中检查是否有报错 |
| 列表不更新 | 忘记调用 `renderTodos()` | 修改数组后记得渲染 |

## 🔧 调试技巧
1. 按 `F12` 打开开发者工具
2. 在 Console 中输入 `todos` 查看当前数据
3. 在代码中加 `console.log(变量名)` 查看值
4. 使用 `debugger;` 语句暂停代码执行

## 🎓 挑战任务

### ⭐ 简单
- [ ] 修改样式，换一个你喜欢的颜色主题
- [ ] 添加一个「编辑」按钮，可以修改待办文本

### ⭐⭐ 中等
- [ ] 添加筛选功能：显示「全部/未完成/已完成」
- [ ] 把待办数据保存到 `localStorage`（刷新页面不丢失）

### ⭐⭐⭐ 困难
- [ ] 添加拖拽排序功能
- [ ] 为待办事项设置优先级（高/中/低）并用不同颜色标记

## 💡 延伸学习
- 搜索 `localStorage` 了解浏览器本地存储
- 学习 `JSON.stringify()` 和 `JSON.parse()` 来保存数据
- 尝试用 `addEventListener('DOMContentLoaded', ...)` 确保页面加载完成再执行
