# 项目 07: 表单验证器 📋

## 🎯 项目目标
创建一个带有实时验证功能的注册表单，学习正则表达式和事件处理。

## 📚 核心知识点

### 1. 正则表达式 (Regular Expression)
正则表达式是用模式来匹配字符串的工具：

```javascript
// 创建正则表达式（两种写法）
const regex1 = /pattern/;           // 字面量
const regex2 = new RegExp('pattern'); // 构造函数

// 测试是否匹配
regex.test('要测试的字符串');  // 返回 true 或 false
```

### 2. 常用正则符号
| 符号 | 含义 | 示例 |
|------|------|------|
| `^` | 字符串开始 | `^abc` 匹配以 abc 开头的字符串 |
| `$` | 字符串结束 | `abc$` 匹配以 abc 结尾的字符串 |
| `\d` | 数字 | `^\d{3}$` 匹配恰好3位数字 |
| `[a-z]` | 小写字母 | `^[a-z]+$` 匹配纯小写字母 |
| `+` | 一次或多次 | `a+` 匹配 a, aa, aaa... |
| `{n,m}` | n到m次 | `\d{3,5}` 匹配3到5位数字 |
| `(?=...)` | 正向先行断言 | `(?=.*\d)` 确保包含数字 |

### 3. 表单验证事件
```javascript
// input 事件: 每次输入都触发（实时验证）
input.addEventListener('input', (e) => {
    validate(e.target.value);
});

// blur 事件: 失去焦点时触发
input.addEventListener('blur', (e) => {
    validate(e.target.value);
});

// submit 事件: 表单提交时触发
form.addEventListener('submit', (e) => {
    e.preventDefault();  // 阻止默认提交
    validateAll();
});
```

## 📖 代码解析

### 验证流程
```
用户输入 → input 事件触发 → validateField()
                ↓
        选择对应正则规则
                ↓
        regex.test(value) 验证
                ↓
    更新 UI (样式 + 错误信息)
                ↓
    检查所有字段 → 启用/禁用提交按钮
```

### 密码强度计算
```javascript
let score = 0;
if (password.length >= 8) score++;       // 长度
if (/[A-Z]/.test(password)) score++;     // 大写字母
if (/[0-9]/.test(password)) score++;     // 数字
if (/[^A-Za-z0-9]/.test(password)) score++; // 特殊字符
```

## 🚀 运行方式
双击 `index.html` 在浏览器中打开。

## ⚠️ 常见错误

| 错误 | 原因 | 解决方法 |
|------|------|---------|
| 验证不通过但应该通过 | 正则写错了 | 用 regex101.com 测试正则 |
| `preventDefault()` 忘了加 | 表单会刷新页面 | 提交处理函数第一句就加 |
| 密码不一致没检测 | 密码修改后没重新验证确认密码 | 密码输入时触发确认密码验证 |

## 🎓 挑战任务

### ⭐ 简单
- [ ] 添加「显示/隐藏密码」按钮
- [ ] 添加验证码（如简单的数学题：3+5=?）

### ⭐⭐ 中等
- [ ] 添加用户名可用性检查（模拟异步检查）
- [ ] 添加表单数据保存到 localStorage

### ⭐⭐⭐ 困难
- [ ] 实现一个通用的验证函数库，支持更多字段类型
- [ ] 添加国际化支持（中英文切换）
