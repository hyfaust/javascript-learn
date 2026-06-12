# 可选链 (Optional Chaining) 与空值合并 (Nullish Coalescing)

## 项目目标

掌握 ES2020 引入的两个实用特性：可选链操作符 (`?.`) 和空值合并操作符 (`??`)。学会安全访问嵌套对象属性，优雅处理可能为空的数据，让代码更加健壮和简洁。

## 核心知识点

### 1. 可选链 (`?.`)
- **属性访问**：`obj?.property` 安全访问可能不存在的属性
- **方法调用**：`obj?.method()` 安全调用可能不存在的方法
- **数组索引**：`arr?.[index]` 安全访问可能为 null 的数组元素
- **嵌套访问**：`a?.b?.c?.d` 在深层嵌套中安全访问

### 2. 空值合并 (`??`)
- **基本用法**：`value ?? defaultValue` 仅在 null/undefined 时使用默认值
- **与 || 的区别**：`||` 在所有假值时使用，`??` 只在 null/undefined 时使用
- **链式使用**：`a ?? b ?? c ?? d` 提供多个备选值

### 3. 组合使用
- **安全提取**：`obj?.a?.b ?? defaultValue`
- **API 响应处理**：安全处理可能缺失的字段
- **配置合并**：用户配置 > 默认配置 > 硬编码默认值

## 代码示例与解析

### 示例 1：可选链属性访问
```javascript
const user = { profile: { name: "小明" } };

// ❌ 旧方法：需要层层判断
const name1 = user && user.profile && user.profile.name;

// ✅ 新方法：使用可选链
const name2 = user?.profile?.name;  // "小明"

// 访问不存在的属性（不会报错）
const age = user?.profile?.age;  // undefined
```
**解析**：`?.` 在访问属性前检查左侧值是否为 `null` 或 `undefined`。如果是，则短路返回 `undefined`，不继续访问。

### 示例 2：可选链方法调用
```javascript
const api = {
    getUser: () => ({ name: "小明" }),
    // getPost 方法不存在
};

// ✅ 安全调用
const user = api.getUser?.();      // { name: "小明" }
const post = api.getPost?.();      // undefined (不会报错)

// ❌ 不使用可选链会报错
const post2 = api.getPost();       // TypeError: api.getPost is not a function
```

### 示例 3：可选链数组索引
```javascript
const response = { data: null };

// 安全访问数组元素
const firstItem = response.data?.[0];     // undefined (data 为 null)

// 获取 API 返回列表的第一个元素
const firstUser = response.users?.[0]?.name;  // 安全
```

### 示例 4：?? 与 || 的区别
```javascript
const count = 0;
const name = "";
const enabled = false;

// || 在所有假值时使用默认值
count || 10;     // 10  (0 是假值)
name || "匿名";   // "匿名" (空字符串是假值)
enabled || true;  // true  (false 是假值)

// ?? 只在 null/undefined 时使用默认值
count ?? 10;     // 0   (0 不是 null/undefined)
name ?? "匿名";   // ""  (空字符串不是 null/undefined)
enabled ?? true;  // false (false 不是 null/undefined)
```
**解析**：这是最重要的区别！当处理数字 `0`、空字符串 `""`、布尔值 `false` 时，使用 `||` 会错误地使用默认值，而 `??` 会保留原始值。

### 示例 5：组合使用
```javascript
const config = { theme: null, fontSize: 0 };

// 组合使用 ?. 和 ??
const theme = config?.theme ?? "dark";       // "dark" (theme 为 null)
const fontSize = config?.fontSize ?? 16;     // 0 (fontSize 为 0，不是 null)

// 深层嵌套安全访问
const user = { settings: { notifications: { email: true } } };
const emailEnabled = user?.settings?.notifications?.email ?? true;
// => true
```

### 示例 6：API 响应处理
```javascript
// 可能不完整的 API 响应
const response = { data: { user: { name: "小明" } } };

// 安全提取所有字段
const name = response?.data?.user?.name ?? "匿名用户";
const avatar = response?.data?.user?.avatar ?? "默认头像";
const bio = response?.data?.user?.bio ?? "这个人很懒";
const theme = response?.data?.user?.settings?.theme ?? "light";

// 无论 response 缺少哪些字段，代码都不会崩溃！
```

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

### 错误 1：在 ?. 前使用 null/undefined
```javascript
const obj = null;

// ❌ 错误：?. 只能在左侧是 null/undefined 时短路
// 但如果已经知道是 null，访问任何属性都会返回 undefined
obj?.property;  // undefined (这是正确的行为)

// 注意：这不是错误，是预期行为
// ?. 的作用是在链中间可能为 null 时不报错
```

### 错误 2：混淆 ?? 和 ||
```javascript
const settings = { count: 0, enabled: false };

// ❌ 错误：使用 || 会丢失有效值
const count = settings.count || 10;     // 10 (但 0 是有效值！)
const enabled = settings.enabled || true; // true (但 false 是有效值！)

// ✅ 正确：使用 ?? 保留有效值
const count = settings.count ?? 10;     // 0
const enabled = settings.enabled ?? true; // false
```

### 错误 3：可选链赋值
```javascript
const obj = {};

// ❌ 错误：可选链不能用于赋值
obj?.property = "value";  // SyntaxError

// ✅ 正确：使用逻辑空值赋值
obj.property = obj.property ?? "value";

// ✅ 或使用逻辑或赋值（ES2021）
obj.property ||= "value";  // 仅在 property 为假值时赋值
```

### 错误 4：过度使用可选链
```javascript
const user = { name: "小明" };

// ❌ 不必要：确定存在的对象不需要可选链
user?.name;  // 可以简化为 user.name

// ✅ 推荐：仅在可能为 null/undefined 时使用
const name = response?.data?.user?.name;  // API 响应可能不完整
```

### 错误 5：可选链与删除操作
```javascript
const obj = { a: { b: 1 } };

// ❌ 错误：不能用可选链删除属性
delete obj?.a?.b;  // SyntaxError

// ✅ 正确：使用普通访问
if (obj?.a) {
    delete obj.a.b;
}
```

## 挑战任务

### 🟢 简单
1. 使用可选链安全访问 `window.navigator?.geolocation?.getCurrentPosition`
2. 用 `??` 为可能为空的变量提供默认值：`username ?? "匿名用户"`

### 🟡 中等
3. 编写函数 `getDeepValue(obj, path, defaultValue)`，使用可选链安全访问深层属性
4. 创建一个配置合并函数，支持三层优先级：用户配置、默认配置、硬编码默认值

### 🔴 困难
5. 实现一个类型安全的 API 响应包装器，自动处理所有可能为空的字段
6. 创建一个 `safeGet` 函数，支持数组索引语法如 `safeGet(obj, "users[0].name", "未知")`

---

> 💡 **学习提示**：可选链和空值合并是现代 JavaScript 处理不确定数据的最佳工具。特别是在处理 API 响应、用户输入和配置对象时，它们能大幅减少 `Cannot read properties of undefined` 类型的错误。养成使用 `?.` 和 `??` 的习惯，你的代码会更加健壮！