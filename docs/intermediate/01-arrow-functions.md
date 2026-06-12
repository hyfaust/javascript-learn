# 项目: 箭头函数 vs 普通函数 ➡️

## 🎯 项目目标
理解箭头函数与普通函数的语法差异，特别是 `this` 绑定的行为差异。

## 📚 核心知识点

### 1. 语法对比

| 特性 | 普通函数 | 箭头函数 |
|------|---------|---------|
| 声明方式 | `function fn() {}` | `const fn = () => {}` |
| this 指向 | 调用时决定 | 定义时决定（词法作用域） |
| arguments | 有 | 无（用 rest 参数替代） |
| 作为构造函数 | 可以 | 不可以 |
| 简写 | 无 | 单表达式可省略 `{}` 和 `return` |

### 2. this 绑定规则

**普通函数**: `this` 取决于**如何调用**
- 作为方法调用: `obj.fn()` → this 指向 obj
- 作为函数调用: `fn()` → this 指向全局（严格模式为 undefined）
- 作为构造函数: `new Fn()` → this 指向新对象
- 使用 call/apply/bind: 可手动指定

**箭头函数**: `this` 取决于**在哪里定义**
- 始终指向外层作用域的 this
- 不能通过 call/apply/bind 改变
- 适合需要保持外层 this 的场景

## 📖 代码解析

### 适合箭头函数的场景

```javascript
// 1. 数组方法回调
numbers.map(n => n * 2);

// 2. setTimeout/setInterval
setTimeout(() => {
    this.count++;  // this 正确指向外层对象
}, 1000);

// 3. Promise 链
fetch(url)
    .then(res => res.json())
    .then(data => console.log(data));
```

### 不能用箭头函数的场景

```javascript
// 1. 对象方法
const obj = {
    name: 'test',
    greet: function() {  // 必须用普通函数
        console.log(this.name);
    }
};

// 2. 构造函数
function Person(name) {  // 不能用箭头
    this.name = name;
}

// 3. DOM 事件处理器
button.addEventListener('click', function() {  // 需要 this 指向按钮
    console.log(this.textContent);
});

// 4. 需要 arguments
function sum() {
    console.log(arguments);  // 箭头函数没有 arguments
}
```

## 🚀 运行方式
双击 `index.html` 在浏览器中打开，点击各演示按钮查看结果。

## ⚠️ 常见错误

| 错误 | 原因 | 解决方法 |
|------|------|---------|
| `this` 是 undefined | 箭头函数用于对象方法 | 改用普通函数 |
| 事件处理器 this 错误 | 箭头函数 this 不指向元素 | 用普通函数或保存引用 |
| `new ArrowFn()` 报错 | 箭头函数不能构造 | 改用普通函数 |

## 🎓 挑战任务

### ⭐ 简单
- [ ] 将所有数组方法回调改为箭头函数
- [ ] 添加一个演示 `bind()` 改变 this 的例子

### ⭐⭐ 中等
- [ ] 实现一个 `debounce` 函数，比较箭头/普通函数版本
- [ ] 演示 `call/apply/bind` 对两种函数的影响

### ⭐⭐⭐ 困难
- [ ] 实现一个事件发射器（EventEmitter），理解 this 在事件回调中的行为
- [ ] 解释为什么 class 方法中不能用箭头函数
