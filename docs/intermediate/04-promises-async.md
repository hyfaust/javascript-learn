# Promise 与 Async/Await

## 项目目标

深入理解 JavaScript 异步编程的核心概念。从 Promise 的基础用法到 async/await 的现代语法，掌握处理异步操作的所有技能，包括错误处理、并行请求等实战技巧。

## 核心知识点

### 1. Promise 基础
- **Promise 状态**：pending（进行中）、fulfilled（已成功）、rejected（已失败）
- **链式调用**：使用 `.then()` 串联异步操作
- **返回值**：`.then()` 可以返回值或新的 Promise

### 2. Async/Await
- **async 函数**：声明一个返回 Promise 的异步函数
- **await 表达式**：暂停执行，等待 Promise 完成
- **语法优势**：让异步代码看起来像同步代码

### 3. 错误处理
- **Promise 错误**：使用 `.catch()` 捕获
- **Async/Await 错误**：使用 `try/catch` 块
- **finally 块**：无论成功或失败都执行的清理代码

### 4. Promise.all
- **并行请求**：同时发起多个异步操作
- **等待全部**：所有 Promise 都 resolve 时才 resolve
- **快速失败**：任何一个 reject 则立即 reject

## 代码示例与解析

### 示例 1：创建和使用 Promise
```javascript
// 创建一个 Promise
const myPromise = new Promise((resolve, reject) => {
    // 模拟异步操作
    setTimeout(() => {
        const success = true;
        if (success) {
            resolve("操作成功！");  // 状态变为 fulfilled
        } else {
            reject("操作失败！");   // 状态变为 rejected
        }
    }, 1000);
});

// 处理 Promise
myPromise
    .then(result => console.log(result))     // "操作成功！"
    .catch(error => console.error(error))    // 捕获错误
    .finally(() => console.log("清理工作"));  // 始终执行
```
**解析**：Promise 接收一个执行器函数，该函数有两个参数：`resolve`（成功时调用）和 `reject`（失败时调用）。

### 示例 2：Promise 链式调用
```javascript
fetchUser()
    .then(user => {
        console.log("获取到用户:", user.name);
        return fetchPosts(user.id);  // 返回新的 Promise
    })
    .then(posts => {
        console.log("获取到帖子:", posts);
        return fetchComments(posts[0].id);
    })
    .then(comments => {
        console.log("获取到评论:", comments);
    })
    .catch(error => {
        console.error("链中任何地方的错误都会被捕获:", error);
    });
```
**解析**：每个 `.then()` 都返回一个新的 Promise，允许继续链式调用。链中任何地方的错误都会被最后的 `.catch()` 捕获。

### 示例 3：Async/Await 语法
```javascript
// Promise 语法
function loadData() {
    fetchUser()
        .then(user => fetchPosts(user.id))
        .then(posts => console.log(posts))
        .catch(err => console.error(err));
}

// 等价的 async/await 语法（更简洁）
async function loadData() {
    try {
        const user = await fetchUser();
        const posts = await fetchPosts(user.id);
        console.log(posts);
    } catch (err) {
        console.error(err);
    }
}
```
**解析**：`async` 关键字使函数返回 Promise。`await` 只能在 `async` 函数内使用，它暂停执行直到 Promise 完成，但不阻塞主线程。

### 示例 4：Mock Fetch 模拟网络请求
```javascript
// 模拟 fetch 请求
function mockFetch(url, delay = 1000) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                url: url,
                status: 200,
                data: { message: "响应数据" }
            });
        }, delay);
    });
}

// 使用
async function getData() {
    const response = await mockFetch("/api/users");
    console.log(response.data);
}
```
**解析**：在实际项目中，可以使用 `fetch()` API 或 `axios` 库。Mock 函数帮助我们在没有真实后端的情况下测试异步逻辑。

### 示例 5：Promise.all 并行请求
```javascript
// 串行：总时间 = 800 + 600 + 1000 = 2400ms
const users = await fetchUsers();     // 800ms
const posts = await fetchPosts();     // 600ms
const comments = await fetchComments(); // 1000ms

// 并行：总时间 = max(800, 600, 1000) = 1000ms
const [users, posts, comments] = await Promise.all([
    fetchUsers(),     // 同时开始
    fetchPosts(),     // 同时开始
    fetchComments()   // 同时开始
]);
```
**解析**：`Promise.all` 接收 Promise 数组，所有 Promise 同时开始执行。当全部完成后，返回结果数组。如果任何一个失败，立即 reject。

### 示例 6：错误处理
```javascript
// Promise 错误处理
fetchData()
    .then(data => console.log(data))
    .catch(error => console.error("请求失败:", error.message));

// Async/Await 错误处理
async function loadData() {
    try {
        const data = await fetchData();
        console.log(data);
    } catch (error) {
        console.error("请求失败:", error.message);
    } finally {
        // 无论成功或失败都会执行
        console.log("请求完成");
    }
}
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

### 错误 1：忘记 await
```javascript
async function loadData() {
    // ❌ 错误：忘记 await，data 是 Promise 对象而非实际数据
    const data = fetchData();
    console.log(data);  // Promise {<pending>}
    
    // ✅ 正确：使用 await 等待完成
    const data2 = await fetchData();
    console.log(data2);  // 实际数据
}
```

### 错误 2：在非 async 函数中使用 await
```javascript
// ❌ 错误：普通函数不能使用 await
function loadData() {
    const data = await fetchData();  // SyntaxError
}

// ✅ 正确：函数必须声明为 async
async function loadData() {
    const data = await fetchData();
}

// ✅ 变通：使用 .then()
function loadData() {
    fetchData().then(data => console.log(data));
}
```

### 错误 3：Promise.all 中一个失败全部失败
```javascript
// ❌ 如果 fetchPosts 失败，整个 Promise.all 会 reject
try {
    const [users, posts, comments] = await Promise.all([
        fetchUsers(),
        fetchPosts(),    // 这个失败了
        fetchComments()
    ]);
} catch (error) {
    // 会进入这里，即使其他两个成功了
    console.error("至少一个请求失败");
}

// ✅ 使用 Promise.allSettled 获取所有结果（包括失败的）
const results = await Promise.allSettled([
    fetchUsers(),
    fetchPosts(),
    fetchComments()
]);
// results 是数组，每个元素有 status: "fulfilled" 或 "rejected"
```

### 错误 4：forEach 中使用 await 无效
```javascript
// ❌ 错误：forEach 不会等待 await
async function processItems(items) {
    items.forEach(async item => {
        await processItem(item);  // 不会按顺序执行
    });
    console.log("全部完成");  // 会立即执行！
}

// ✅ 正确：使用 for...of 循环
async function processItems(items) {
    for (const item of items) {
        await processItem(item);  // 按顺序等待
    }
    console.log("全部完成");  // 等待所有完成后执行
}

// ✅ 正确：使用 Promise.all 并行处理
async function processItems(items) {
    await Promise.all(items.map(item => processItem(item)));
    console.log("全部完成");
}
```

## 挑战任务

### 🟢 简单
1. 创建一个返回 Promise 的函数 `delay(ms)`，在指定毫秒后 resolve
2. 使用 async/await 调用 `delay(2000)`，等待 2 秒后打印"等待完成"

### 🟡 中等
3. 实现 `Promise.allSettled` 的简易版本，即使有失败也返回所有结果
4. 创建一个函数 `retry(fn, maxRetries)`，失败时自动重试最多 maxRetries 次

### 🔴 困难
5. 实现一个 `raceWithTimeout(fn, timeout)` 函数，如果 fn 在 timeout 毫秒内未完成则 reject
6. 创建一个异步队列系统，支持并发度限制（最多同时执行 N 个异步任务）

---

> 💡 **学习提示**：异步编程是 JavaScript 最难掌握的概念之一。多练习 Promise 链、async/await 和错误处理，逐渐会形成直觉。记住：await 让代码暂停但不阻塞！