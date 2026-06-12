/**
 * ============================================
 * Promise 与 Async/Await - 交互式演示脚本
 * ============================================
 * 
 * 异步编程是 JavaScript 的核心概念。本文件演示：
 * 1. Promise 的创建与链式调用
 * 2. async/await 语法及其优势
 * 3. 模拟网络请求（Mock Fetch）
 * 4. 错误处理（try/catch）
 * 5. Promise.all 并行请求
 * 
 * Promise 有三种状态：
 * - pending（进行中）
 * - fulfilled（已成功）
 * - rejected（已失败）
 */

// ============================================
// 一、Promise 基础演示
// ============================================

/**
 * 1. Promise 链式调用演示
 * 展示如何使用 .then() 串联多个异步操作
 */
function runPromiseChain() {
    const resultEl = document.getElementById("chain-result");
    resultEl.textContent = "⏳ 开始执行 Promise 链...";
    resultEl.classList.add("has-content");
    
    // 记录步骤日志
    const logs = [];
    const startTime = Date.now();
    
    /**
     * 添加日志的辅助函数
     * @param {string} message - 日志消息
     * @param {string} type - 日志类型 (info/success/time)
     */
    function addLog(message, type = "info") {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        logs.push({ message, type, time: `${elapsed}s` });
        updateDisplay();
    }
    
    /**
     * 更新页面显示
     * 将日志数组渲染为 HTML
     */
    function updateDisplay() {
        resultEl.innerHTML = logs.map(log => 
            `<div class="step-log ${log.type}">⏱️ [${log.time}] ${log.message}</div>`
        ).join("");
    }
    
    // 【Promise 链式调用】每个 .then() 返回新的 Promise
    // 可以将值传递给下一个 .then()
    new Promise((resolve) => {
        // 步骤 1：模拟异步操作（500ms 延迟）
        addLog("步骤 1: 创建 Promise，开始异步操作...", "time");
        setTimeout(() => {
            resolve("步骤 1 完成！");
        }, 500);
    })
    .then((result) => {
        // 步骤 2：处理第一步的结果，并返回新值
        addLog(`✅ ${result}`, "success");
        addLog("步骤 2: 处理结果，返回新 Promise...", "time");
        // 返回的值会自动包装为 Promise
        return new Promise((resolve) => {
            setTimeout(() => resolve("步骤 2 完成！"), 500);
        });
    })
    .then((result) => {
        // 步骤 3：处理第二步的结果
        addLog(`✅ ${result}`, "success");
        addLog("步骤 3: 同步操作，直接返回...", "time");
        // 直接返回值（非 Promise）也会被自动包装
        return "步骤 3 完成！";
    })
    .then((result) => {
        // 步骤 4：最终结果
        addLog(`✅ ${result}`, "success");
        addLog("🎉 Promise 链执行完毕！", "success");
    });
}

/**
 * 2. async/await 转换演示
 * 展示如何用更简洁的语法处理 Promise
 */
function runPromiseChainWithLog(resultEl, logs, startTime) {
    /** 添加日志并更新显示 */
    function addLog(message, type = "info") {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        logs.push({ message, type, time: `${elapsed}s` });
        resultEl.innerHTML = logs.map(log => 
            `<div class="step-log ${log.type}">⏱️ [${log.time}] ${log.message}</div>`
        ).join("");
    }
    return addLog;
}

async function runAsyncAwait() {
    const resultEl = document.getElementById("async-result");
    resultEl.textContent = "⏳ 开始执行 async/await 演示...";
    resultEl.classList.add("has-content");
    
    const logs = [];
    const startTime = Date.now();
    const addLog = runPromiseChainWithLog(resultEl, logs, startTime);
    
    // 【模拟异步函数】返回 Promise
    /**
     * 模拟获取用户数据
     * @returns {Promise<Object>} 用户数据对象
     */
    function fetchUser() {
        return new Promise(resolve => {
            setTimeout(() => resolve({ name: "小明", age: 18 }), 500);
        });
    }
    
    /**
     * 模拟获取用户帖子
     * @param {string} username - 用户名
     * @returns {Promise<string[]>} 帖子列表
     */
    function fetchPosts(username) {
        return new Promise(resolve => {
            setTimeout(() => resolve([`帖子1 by ${username}`, `帖子2 by ${username}`]), 500);
        });
    }
    
    // ====== 对比展示 ======
    
    // 方式一：Promise .then() 链式调用（嵌套较深）
    addLog("【方式一】Promise 链式调用:", "time");
    addLog("fetchUser().then(user => fetchPosts(user.name).then(posts => ...))", "info");
    
    // 方式二：async/await（线性、易读）
    addLog("【方式二】async/await 语法:", "success");
    
    // 【立即执行函数】在普通函数中使用 await 需要包裹在 async 函数中
    (async () => {
        try {
            // await 暂停执行，等待 Promise 完成
            // 代码看起来像同步，但不会阻塞主线程
            const user = await fetchUser();
            addLog(`✅ 获取用户: ${JSON.stringify(user)}`, "success");
            
            // 可以方便地使用前面获取的数据
            const posts = await fetchPosts(user.name);
            addLog(`✅ 获取帖子: ${JSON.stringify(posts)}`, "success");
            
            addLog("🎉 async/await 执行完毕！代码更清晰！", "success");
        } catch (error) {
            addLog(`❌ 错误: ${error.message}`, "error");
        }
    })();
}

// ============================================
// 二、模拟网络请求演示
// ============================================

/**
 * 1. Mock Fetch 演示
 * 使用 setTimeout 模拟异步网络请求
 */
function runMockFetch() {
    const resultEl = document.getElementById("mock-fetch-result");
    resultEl.textContent = "⏳ 发起模拟网络请求...";
    resultEl.classList.add("has-content");
    
    const logs = [];
    const startTime = Date.now();
    
    /** 添加日志并更新显示 */
    function addLog(message, type = "info") {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        logs.push({ message, type, time: `${elapsed}s` });
        resultEl.innerHTML = logs.map(log => 
            `<div class="step-log ${log.type}">⏱️ [${log.time}] ${log.message}</div>`
        ).join("");
    }
    
    /**
     * 模拟 fetch 请求
     * 实际项目中会使用 fetch API 或 axios 等
     * @param {string} url - 请求的 URL
     * @param {number} delay - 模拟延迟时间（毫秒）
     * @returns {Promise<Object>} 模拟的响应数据
     */
    function mockFetch(url, delay = 800) {
        return new Promise((resolve) => {
            addLog(`📡 发起 GET 请求: ${url}`, "time");
            setTimeout(() => {
                // 模拟返回 JSON 数据
                const mockData = {
                    url: url,
                    status: 200,
                    data: {
                        id: Math.floor(Math.random() * 1000),
                        message: `来自 ${url} 的响应数据`,
                        timestamp: new Date().toLocaleTimeString()
                    }
                };
                resolve(mockData);
            }, delay);
        });
    }
    
    // 执行模拟请求
    mockFetch("/api/users/1")
        .then(response => {
            addLog(`✅ 收到响应! 状态码: ${response.status}`, "success");
            addLog(`📦 数据: ${JSON.stringify(response.data, null, 2)}`, "success");
        });
}

/**
 * 2. 错误处理演示
 * 展示如何使用 try/catch 处理异步错误
 */
async function runErrorHandling() {
    const resultEl = document.getElementById("error-result");
    resultEl.textContent = "⏳ 开始错误处理演示...";
    resultEl.classList.add("has-content");
    
    const logs = [];
    const startTime = Date.now();
    
    /** 添加日志并更新显示 */
    function addLog(message, type = "info") {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        logs.push({ message, type, time: `${elapsed}s` });
        resultEl.innerHTML = logs.map(log => 
            `<div class="step-log ${log.type}">⏱️ [${log.time}] ${log.message}</div>`
        ).join("");
    }
    
    /**
     * 可能失败的模拟请求
     * @param {string} url - 请求 URL
     * @param {boolean} shouldFail - 是否模拟失败
     * @returns {Promise<Object>} 响应或错误
     */
    function mockFetchWithErrors(url, shouldFail = false) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldFail) {
                    // 模拟网络错误或 404
                    reject(new Error(`请求失败: ${url} - 404 Not Found`));
                } else {
                    resolve({ status: 200, data: { message: "成功获取数据" } });
                }
            }, 600);
        });
    }
    
    // 【立即执行 async 函数】使用 try/catch 处理错误
    (async () => {
        // 测试用例 1：成功请求
        addLog("【测试 1】正常请求:", "time");
        try {
            const result1 = await mockFetchWithErrors("/api/success", false);
            addLog(`✅ 成功: ${JSON.stringify(result1.data)}`, "success");
        } catch (error) {
            addLog(`❌ 捕获错误: ${error.message}`, "error");
        }
        
        // 测试用例 2：失败请求
        addLog("【测试 2】模拟错误:", "time");
        try {
            const result2 = await mockFetchWithErrors("/api/not-found", true);
            addLog(`✅ 成功: ${JSON.stringify(result2)}`, "success");
        } catch (error) {
            // catch 块会捕获到 Promise reject 的错误
            addLog(`❌ 捕获错误: ${error.message}`, "error");
        }
        
        addLog("\n💡 try/catch 让错误处理更加清晰和可控", "success");
    })();
}

// ============================================
// 三、Promise.all 演示
// ============================================

/**
 * Promise.all 演示
 * 等待多个 Promise 全部完成后统一处理
 */
async function runPromiseAll() {
    const resultEl = document.getElementById("promise-all-result");
    resultEl.textContent = "⏳ 发起并行请求...";
    resultEl.classList.add("has-content");
    
    const logs = [];
    const startTime = Date.now();
    
    /** 添加日志并更新显示 */
    function addLog(message, type = "info") {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        logs.push({ message, type, time: `${elapsed}s` });
        resultEl.innerHTML = logs.map(log => 
            `<div class="step-log ${log.type}">⏱️ [${log.time}] ${log.message}</div>`
        ).join("");
    }
    
    /**
     * 模拟获取用户列表
     * @returns {Promise<string[]>} 用户列表
     */
    function fetchUsers() {
        return new Promise(resolve => {
            setTimeout(() => resolve(["用户A", "用户B", "用户C"]), 800);
        });
    }
    
    /**
     * 模拟获取帖子列表
     * @returns {Promise<string[]>} 帖子列表
     */
    function fetchPosts() {
        return new Promise(resolve => {
            setTimeout(() => resolve(["帖子1", "帖子2", "帖子3", "帖子4"]), 600);
        });
    }
    
    /**
     * 模拟获取评论列表
     * @returns {Promise<string[]>} 评论列表
     */
    function fetchComments() {
        return new Promise(resolve => {
            setTimeout(() => resolve(["评论A", "评论B"]), 1000);
        });
    }
    
    // 【立即执行函数】演示 Promise.all
    (async () => {
        addLog("【对比】串行 vs 并行:", "time");
        
        // 方式一：串行（一个接一个）- 总时间 = 800 + 600 + 1000 = 2400ms
        addLog("串行请求: fetchUsers → fetchPosts → fetchComments", "info");
        const serialStart = Date.now();
        const u1 = await fetchUsers();
        const p1 = await fetchPosts();
        const c1 = await fetchComments();
        addLog(`串行耗时: ${Date.now() - serialStart}ms`, "info");
        
        // 方式二：并行（同时发起）- 总时间 = max(800, 600, 1000) = 1000ms
        addLog("\n并行请求: Promise.all([fetchUsers, fetchPosts, fetchComments])", "success");
        const parallelStart = Date.now();
        
        // Promise.all 接收 Promise 数组，返回结果数组
        // 所有 Promise 都 resolve 时，返回结果数组
        // 任何一个 reject 时，立即 reject 并返回错误
        const [users, posts, comments] = await Promise.all([
            fetchUsers(),
            fetchPosts(),
            fetchComments()
        ]);
        
        addLog(`并行耗时: ${Date.now() - parallelStart}ms`, "success");
        addLog(`\n✅ 获取到 ${users.length} 个用户: ${JSON.stringify(users)}`, "success");
        addLog(`✅ 获取到 ${posts.length} 个帖子: ${JSON.stringify(posts)}`, "success");
        addLog(`✅ 获取到 ${comments.length} 个评论: ${JSON.stringify(comments)}`, "success");
        addLog(`\n💡 并行比串行快很多！(${2400}ms → ${Date.now() - parallelStart}ms)`, "success");
    })();
}

// ============================================
// 四、猫咪图片获取器
// ============================================

/**
 * 模拟猫咪图片数据
 * 每只猫咪有名字、品种和表情
 */
const CAT_DATA = [
    { emoji: "🐱", name: "小橘", breed: "橘猫", expression: "慵懒" },
    { emoji: "😺", name: "咪咪", breed: "英短", expression: "开心" },
    { emoji: "😸", name: "花花", breed: "美短", expression: "微笑" },
    { emoji: "😻", name: "甜甜", breed: "布偶", expression: "花痴" },
    { emoji: "😽", name: "亲亲", breed: "暹罗", expression: "亲吻" },
    { emoji: "🙀", name: "惊惊", breed: "无毛猫", expression: "惊讶" },
    { emoji: "😿", name: "悲伤", breed: "波斯猫", expression: "难过" },
    { emoji: "😼", name: "坏坏", breed: "缅因猫", expression: "狡黠" },
    { emoji: "🐈", name: "小黑", breed: "黑猫", expression: "优雅" },
    { emoji: "🐈‍⬛", name: "煤球", breed: "黑猫", expression: "神秘" }
];

/**
 * 模拟获取猫咪图片的 API
 * @param {number} count - 获取猫咪的数量
 * @returns {Promise<Array>} 猫咪数据数组
 */
function mockFetchCats(count) {
    return new Promise(resolve => {
        // 模拟网络延迟 (500ms - 1500ms 随机)
        const delay = 500 + Math.random() * 1000;
        setTimeout(() => {
            // 随机选择指定数量的猫咪
            const shuffled = [...CAT_DATA].sort(() => Math.random() - 0.5);
            resolve(shuffled.slice(0, count));
        }, delay);
    });
}

/**
 * 获取猫咪的主函数
 * 根据选择的请求方式执行不同的异步模式
 */
async function fetchCats() {
    const count = parseInt(document.getElementById("cat-count").value);
    const method = document.getElementById("fetch-method").value;
    const galleryEl = document.getElementById("cat-gallery");
    const loadingEl = document.getElementById("cat-loading");
    const btn = document.querySelector(".cat-btn");
    
    // 显示加载状态
    loadingEl.style.display = "block";
    galleryEl.innerHTML = "";
    btn.disabled = true;
    
    try {
        let cats = [];
        
        if (method === "promise") {
            // 方式一：Promise 链式调用
            cats = await mockFetchCats(count);
        } else if (method === "async") {
            // 方式二：async/await
            cats = await mockFetchCats(count);
        } else if (method === "all") {
            // 方式三：Promise.all 并行获取多只
            const promises = [];
            for (let i = 0; i < count; i++) {
                promises.push(mockFetchCats(1));
            }
            // Promise.all 等待所有请求完成
            const results = await Promise.all(promises);
            cats = results.flat();
        }
        
        // 渲染猫咪卡片
        galleryEl.innerHTML = cats.map(cat => `
            <div class="cat-card">
                <div class="cat-emoji">${cat.emoji}</div>
                <div class="cat-name">${cat.name}</div>
                <div class="cat-status">${cat.breed} · ${cat.expression}</div>
            </div>
        `).join("");
        
    } catch (error) {
        galleryEl.innerHTML = `<p style="color:red;">❌ 获取失败: ${error.message}</p>`;
    } finally {
        // 无论成功或失败，都隐藏加载状态
        loadingEl.style.display = "none";
        btn.disabled = false;
    }
}

// ============================================
// 页面加载完成后的初始化操作
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("🎓 Promise 与 Async/Await 交互式学习页面已加载");
    console.log("提示: 异步编程是 JavaScript 的核心技能");
});