# ES6 模板字符串 (Template Literals)

## 项目目标

通过交互式演示，全面掌握 ES6 模板字符串的所有功能：字符串插值、多行字符串、表达式求值和标签模板。让字符串处理变得优雅、直观、高效。

## 核心知识点

### 1. 字符串插值
- **基础插值**：使用 `${变量名}` 在字符串中嵌入变量
- **表达式求值**：`${}` 内可以执行任意 JavaScript 表达式
- **函数调用**：`${}` 内可以直接调用函数

### 2. 多行字符串
- **旧方法对比**：`+` 拼接和 `\n` 换行符
- **新方法**：反引号内直接换行
- **优点**：代码更清晰，无需转义

### 3. 标签模板 (Tagged Templates)
- **语法**：`函数名\`模板字符串\``
- **参数**：函数接收静态字符串数组和变量值
- **应用**：HTML 转义、国际化、格式化等

## 代码示例与解析

### 示例 1：基础字符串插值
```javascript
const name = "小明";
const age = 18;

// 旧方法：繁琐的字符串拼接
const oldWay = "我叫" + name + "，今年" + age + "岁";

// 新方法：简洁的模板字符串
const newWay = `我叫${name}，今年${age}岁`;

console.log(newWay);  // "我叫小明，今年18岁"
```
**解析**：模板字符串使用反引号 `` ` ``，变量使用 `${}` 包裹。相比传统的 `+` 拼接，代码更简洁、可读性更强。

### 示例 2：表达式求值
```javascript
const price = 99;
const quantity = 3;

// ${} 内可以进行数学运算
const total = `总价: ¥${price * quantity}`;  // "总价: ¥297"

// 可以使用方法调用
const formatted = `单价: ¥${price.toFixed(2)}`;  // "单价: ¥99.00"

// 可以使用三元表达式
const discount = 0.9;
const msg = `折扣: ${discount < 1 ? "有优惠" : "无折扣"}`;
```
**解析**：`${}` 是一个完整的 JavaScript 表达式上下文，支持运算、函数调用、三元表达式等。

### 示例 3：多行字符串对比
```javascript
// 旧方法：需要手动添加 \n 和使用 + 连接
const oldMulti = "第一行\n" +
    "第二行\n" +
    "第三行";

// 新方法：直接换行
const newMulti = `第一行
第二行
第三行`;
```
**解析**：反引号内的换行会被保留，无需任何转义字符。这使得创建多行文本（如 HTML 模板、SQL 查询等）变得非常简单。

### 示例 4：标签模板
```javascript
// 定义标签函数
function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => {
        return result + (values[i] ? `<mark>${values[i]}</mark>` : "") + str;
    }, "");
}

const name = "JavaScript";
// 使用标签模板
const result = highlight`学习 ${name} 很有趣`;
// 结果: "学习 <mark>JavaScript</mark> 很有趣"
```
**解析**：标签模板允许自定义函数处理模板字符串。函数接收两个参数：
1. `strings`：模板中的静态字符串部分组成的数组
2. `...values`：所有 `${}` 表达式的值

### 示例 5：货币格式化标签
```javascript
function currency(strings, ...values) {
    const formatted = values.map(v => 
        typeof v === "number" ? "¥" + v.toFixed(2) : v
    );
    return strings.reduce((r, s, i) => r + (formatted[i-1] || "") + s);
}

const price = 199.9;
currency`价格是 ${price}`;  // "价格是 ¥199.90"
```
**解析**：标签模板的实用场景之一。自动将数字格式化为货币形式，保持模板语法的简洁性。

## 运行方式

1. **直接打开**：双击 `index.html` 文件即可在浏览器中运行
2. **使用本地服务器**（推荐）：
   ```bash
   # 使用 Python
   python -m http.server 8080
   
   # 或使用 Node.js 的 npx
   npx serve
   ```
   然后在浏览器中访问 `http://localhost:8080`

## 常见错误

### 错误 1：使用错误的引号
```javascript
// ❌ 错误：使用单引号或双引号不支持模板语法
const msg = '你好，${name}';  // 字面输出 "你好，${name}"

// ✅ 正确：必须使用反引号
const msg = `你好，${name}`;  // 正确插值
```

### 错误 2：`${}` 内忘记变量名
```javascript
const name = "小明";

// ❌ 错误：忘记使用 $ 符号
const msg = `你好，{name}`;  // 输出 "你好，{name}"

// ✅ 正确：使用 ${} 语法
const msg = `你好，${name}`;  // 输出 "你好，小明"
```

### 错误 3：标签函数的参数理解错误
```javascript
function tag(strings, ...values) {
    console.log(strings);  // 静态字符串数组
    console.log(values);   // 变量值数组
}

const name = "JS";
tag`学习 ${name}`;

// strings = ["学习 ", ""]  (长度总比 values 多 1)
// values = ["JS"]
```
**解析**：`strings` 数组的长度始终比 `values` 多 1，因为字符串在变量的前后都有。

### 错误 4：模板字符串中的转义问题
```javascript
// ❌ 错误：$ 和 { 之间不能有空格
const msg = `你好，$ {name}`;  // 不会进行插值

// ✅ 正确：紧密书写 ${}
const msg = `你好，${name}`;

// 如需输出字面量 ${}，使用转义
const literal = `输出美元符号: \${notAVariable}`;  // "输出美元符号: ${notAVariable}"
```

## 挑战任务

### 🟢 简单
1. 使用模板字符串创建一个简单的问候消息，包含姓名和城市
2. 在 `${}` 中使用 `Date.now()` 显示当前时间戳

### 🟡 中等
3. 编写一个标签模板函数 `upper`，将模板中的所有变量值转为大写
4. 使用多行模板字符串生成一个简单的 HTML 表格

### 🔴 困难
5. 实现一个 `safeHTML` 标签模板函数，自动转义变量中的 HTML 特殊字符（防止 XSS 攻击）
6. 创建一个 `i18n` 国际化标签模板函数，支持中英文切换

---

> 💡 **学习提示**：模板字符串是现代 JavaScript 开发的基础特性。从 API 调用到 HTML 渲染，从日志记录到错误提示，几乎处处可见其身影。掌握它能让你的代码更加优雅！