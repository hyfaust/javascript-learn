# ES 模块 (ES Modules)

## 项目目标

掌握现代 JavaScript 模块化编程。学习如何使用 `import` 和 `export` 组织代码，理解命名导出与默认导出的区别，以及如何在浏览器中使用 ES 模块。

## 核心知识点

### 1. 模块导出 (Export)
- **命名导出 (Named Export)**：一个模块可导出多个值
- **默认导出 (Default Export)**：一个模块只能有一个默认导出
- **重导出**：从一个模块导入并立即导出

### 2. 模块导入 (Import)
- **命名导入**：`import { name } from './module.js'`
- **默认导入**：`import name from './module.js'`
- **重命名导入**：`import { name as alias } from './module.js'`
- **全部导入**：`import * as module from './module.js'`

### 3. 模块特性
- 每个模块有独立作用域
- 自动使用严格模式
- 导入是只读的 live bindings
- 模块代码在加载时自动执行

## 代码示例与解析

### 示例 1：命名导出与导入
```javascript
// math.js - 使用 export 导出多个函数
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }
export const PI = 3.14159;

// main.js - 使用 {} 导入指定的值
import { add, multiply, PI } from './math.js';

console.log(add(2, 3));    // 5
console.log(PI);           // 3.14159
```
**解析**：命名导出允许一个模块导出任意多的值。导入时必须使用 `{}` 并且名称必须与导出时相同（除非使用 `as` 重命名）。

### 示例 2：默认导出与导入
```javascript
// config.js - 使用 export default 导出默认值
const config = { theme: "dark", lang: "zh" };
export default config;

// main.js - 导入时可以自定义名称
import config from './config.js';
import myConfig from './config.js';  // 也可以叫其他名字

console.log(config.theme);  // "dark"
```
**解析**：默认导出不需要 `{}`，导入时可以自由命名。每个模块只能有一个 `export default`。

### 示例 3：重命名导入
```javascript
// 导入时重命名，避免命名冲突
import { add as sum, multiply as product } from './math.js';

console.log(sum(2, 3));       // 5
console.log(product(2, 3));   // 6
```

### 示例 4：工具函数模块 (utils.js)
```javascript
// 日期格式化
import { formatDate } from './utils.js';
formatDate(new Date(), "YYYY-MM-DD");  // "2024-01-15"

// 生成唯一 ID
import { generateId } from './utils.js';
generateId();  // "a3f9k2"

// 防抖函数
import { debounce } from './utils.js';
const debouncedFn = debounce(() => console.log("执行!"), 300);
```

### 示例 5：数学模块 (math.js)
```javascript
import { add, multiply, factorial, fibonacci } from './math.js';

add(10, 20);         // 30
multiply(5, 6);      // 30
factorial(5);        // 120 (5*4*3*2*1)
fibonacci(6);        // 8 (数列: 0,1,1,2,3,5,8)
```

### 示例 6：在 HTML 中使用模块
```html
<!-- 必须添加 type="module" -->
<script type="module" src="main.js"></script>

<!-- 或者内联模块 -->
<script type="module">
    import { add } from './math.js';
    console.log(add(1, 2));
</script>
```

## 运行方式

### ⚠️ 重要：必须通过 HTTP 服务器运行

由于浏览器的 CORS 安全策略，ES 模块**不能**通过 `file://` 协议直接打开。必须使用本地服务器。

### 方法 1：使用 Python（推荐）
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

### 方法 2：使用 Node.js
```bash
# 使用 npx（无需全局安装）
npx serve

# 或使用 http-server
npx http-server -p 8080
```

### 方法 3：使用 VS Code
安装 "Live Server" 扩展，右键 `index.html` 选择 "Open with Live Server"

然后在浏览器访问 `http://localhost:8080`

## 常见错误

### 错误 1：通过 file:// 协议打开
```
❌ 直接双击 index.html 打开
Access to script at 'file:///.../main.js' from origin 'null' 
has been blocked by CORS policy

✅ 必须通过 HTTP 服务器访问
http://localhost:8080
```

### 错误 2：导入路径缺少扩展名
```javascript
// ❌ 错误：浏览器中必须包含 .js 扩展名
import { add } from './math';

// ✅ 正确：包含 .js
import { add } from './math.js';
```
**注意**：Node.js 16+ 和打包工具（Webpack/Vite）可以省略扩展名，但浏览器中不行。

### 错误 3：尝试修改导入的值
```javascript
import { count } from './counter.js';

// ❌ 错误：导入的值是只读的
count = 10;  // TypeError: Assignment to constant variable

// ✅ 正确：通过模块导出的函数修改
import { increment } from './counter.js';
increment();  // 在模块内部修改
```

### 错误 4：混淆命名导出和默认导出
```javascript
// math.js
export function add() {}           // 命名导出
export default function sub() {}   // 默认导出

// main.js
// ❌ 错误：add 是命名导出，不能用默认导入语法
import add from './math.js';

// ✅ 正确：命名导出使用 {}
import { add } from './math.js';

// ✅ 正确：默认导出不使用 {}
import sub from './math.js';

// ✅ 正确：同时导入
import sub, { add } from './math.js';
```

### 错误 5：在普通脚本中使用 import
```html
<!-- ❌ 错误：缺少 type="module" -->
<script src="main.js"></script>

<!-- ✅ 正确：添加 type="module" -->
<script type="module" src="main.js"></script>
```

## 挑战任务

### 🟢 简单
1. 创建一个 `logger.js` 模块，导出 `log`, `warn`, `error` 三个函数
2. 在 main.js 中导入并使用这些日志函数

### 🟡 中等
3. 创建一个 `stringUtils.js` 模块，实现 `capitalize`, `reverse`, `truncate` 函数
4. 修改 `utils.js` 中的 `debounce` 函数，增加一个 `immediate` 参数，支持立即执行模式

### 🔴 困难
5. 创建一个事件总线模块 `eventBus.js`，支持 `on`, `off`, `emit`, `once` 方法
6. 实现一个模块加载器，按需动态导入模块（使用 `import()` 函数）

---

> 💡 **学习提示**：模块化是现代前端开发的基石。无论是 React、Vue 还是 Node.js，都离不开 ES 模块。理解导入导出的机制，才能写出可维护的大型项目！