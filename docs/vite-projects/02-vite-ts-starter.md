# 项目 02: Vite + TypeScript 入门 🔷

## 🎯 项目目标
在 Vite 项目中引入 TypeScript，学习类型系统的基础知识，理解 TypeScript 如何在编译时捕获错误。

## 📚 核心知识点

### 1. TypeScript 是什么？
TypeScript 是 JavaScript 的超集，添加了静态类型系统：

```typescript
// JavaScript：运行时才发现错误
function add(a, b) {
  return a + b;
}
add("hello", 1); // 返回 "hello1"，不是预期结果

// TypeScript：编译时就能发现错误
function add(a: number, b: number): number {
  return a + b;
}
add("hello", 1); // ❌ 编译错误：类型不匹配
```

### 2. 基础类型
```typescript
// 基本类型
const name: string = "TypeScript";
const version: number = 5.6;
const isAwesome: boolean = true;

// 数组
const numbers: number[] = [1, 2, 3];
const names: Array<string> = ["Alice", "Bob"];

// 元组（固定长度和类型的数组）
const pair: [string, number] = ["age", 25];

// 联合类型（可以是多种类型之一）
type Status = "loading" | "success" | "error";

// 任意类型（不推荐，失去类型检查）
const data: any = "anything";
```

### 3. 接口（Interface）
定义对象的"形状"：
```typescript
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  role: "admin" | "user" | "guest"; // 联合类型
}

const user: User = {
  id: 1,
  name: "Alice",
  age: 25,
  email: "alice@example.com",
  role: "admin",
};
```

### 4. 类型守卫（Type Guard）
在运行时检查类型：
```typescript
function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function process(input: unknown) {
  if (isNonEmptyString(input)) {
    // 这里 TypeScript 知道 input 是 string
    console.log(input.toUpperCase());
  }
}
```

### 5. 泛型（Generics）
创建可复用的类型安全组件：
```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push("hello"); // ❌ 编译错误：类型不匹配
```

### 6. tsconfig.json
TypeScript 编译器配置文件：
```json
{
  "compilerOptions": {
    "target": "ES2020",       // 编译目标
    "strict": true,           // 启用严格模式
    "module": "ESNext",       // 模块系统
    "moduleResolution": "bundler" // Vite 推荐的模块解析
  }
}
```

## 📖 代码解析

### 项目结构
```
02-vite-ts-starter/
├── index.html          # 入口 HTML
├── src/
│   ├── main.ts         # 入口 TypeScript 文件
│   └── style.css       # 样式
├── tsconfig.json       # TypeScript 配置
├── vite.config.ts      # Vite 配置（也用 TypeScript）
└── package.json
```

### Vite + TypeScript 的工作方式
```
1. 浏览器请求 main.ts
2. Vite 拦截请求，使用 ESBuild 将 TS 编译为 JS
3. 编译后的 JS 返回给浏览器
4. 类型检查由 tsc（TypeScript 编译器）负责
```

## 🚀 运行方式

```bash
cd 04-vite-projects/02-vite-ts-starter
npm install
npm run dev            # 启动开发服务器
```

```bash
npm run build          # 编译检查 + 构建
```

## ❌ 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `Type 'string' is not assignable to type 'number'` | 类型不匹配 | 检查变量类型 |
| `Property 'xxx' does not exist on type 'yyy'` | 访问不存在的属性 | 检查拼写或添加属性定义 |
| `Cannot find module 'xxx'` | 缺少类型声明 | 安装 `@types/xxx` |
| `Object is possibly 'undefined'` | 未处理 null/undefined | 添加空值检查 |

## 🔧 调试技巧

1. **悬停查看类型**：在 VS Code 中悬停变量名，显示推断的类型
2. **错误面板**：VS Code 的"问题"面板显示所有类型错误
3. **`tsc --noEmit`**：单独运行类型检查，不生成文件

## 🏆 挑战任务

### ⭐ 简单
给 Stack 类添加一个 `peek()` 方法，返回栈顶元素但不移除它

### ⭐⭐ 中等
创建一个 `Queue<T>` 泛型类，实现 `enqueue`、`dequeue`、`size` 方法

### ⭐⭐⭐ 困难
创建一个表单验证系统：定义 `ValidationRule<T>` 接口，支持自定义验证规则

## 📖 延伸学习

- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [TypeScript Playground](https://www.typescriptlang.org/play) — 在线体验
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
