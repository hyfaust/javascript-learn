/**
 * ============================================
 * main.js - 主模块（入口文件）
 * ============================================
 * 
 * 这是 ES 模块的入口文件
 * 负责导入其他模块的功能并绑定到页面交互
 * 
 * 注意：
 * 1. 此文件通过 <script type="module"> 加载
 * 2. 导入路径必须包含 .js 扩展名
 * 3. 模块内的变量和函数默认不暴露到全局作用域
 */

// ============================================
// 导入模块
// ============================================

// 【命名导入】从 math.js 导入指定的函数
// 可以导入部分函数，也可以使用 * as 导入全部
import { add, multiply, factorial, fibonacci } from "./math.js";

// 【默认导入】从 config.js 导入默认导出
// 默认导入可以自定义变量名
import config from "./config.js";

// 【命名导入】从 utils.js 导入工具函数
import { formatDate, generateId, debounce } from "./utils.js";

// ============================================
// 将模块功能绑定到 window 对象（仅用于演示）
// ============================================
// 注意：在实际项目中，通常不会将模块功能暴露到全局
// 这里是为了让 HTML 中的 onclick 能够调用这些函数

// --- 一、命名导出演示 ---

/**
 * 命名导出演示
 * 展示如何从 math.js 导入并使用函数
 */
function runNamedExports() {
    const resultEl = document.getElementById("named-exports-result");
    
    // 使用从 math.js 导入的函数
    const sum = add(10, 20);
    const product = multiply(5, 6);
    
    resultEl.textContent = 
        `从 math.js 导入: import { add, multiply } from './math.js'\n\n` +
        `add(10, 20) = ${sum}\n` +
        `multiply(5, 6) = ${product}\n\n` +
        `💡 命名导出允许一个模块导出多个值`;
    resultEl.classList.add("has-content");
}

/**
 * 默认导出演示
 * 展示如何从 config.js 导入默认导出
 */
function runDefaultExport() {
    const resultEl = document.getElementById("default-export-result");
    
    resultEl.textContent = 
        `从 config.js 导入: import config from './config.js'\n\n` +
        `配置对象:\n` +
        `  config.appName = "${config.appName}"\n` +
        `  config.version = "${config.version}"\n` +
        `  config.theme = "${config.theme}"\n` +
        `  config.lang = "${config.lang}"\n` +
        `  config.features.darkMode = ${config.features.darkMode}\n\n` +
        `💡 默认导出每个模块只能有一个，导入时可以自定义名称`;
    resultEl.classList.add("has-content");
}

/**
 * 重命名导入演示
 * 展示如何使用 as 关键字为导入指定别名
 */
function runRenameImport() {
    const resultEl = document.getElementById("rename-import-result");
    
    // 在真实模块中可以这样导入：
    // import { add as sum, multiply as product } from './math.js';
    // 这里使用别名避免与上面的导入冲突
    
    // 模拟重命名导入的效果
    const sum = add;        // add 重命名为 sum
    const product = multiply; // multiply 重命名为 product
    
    resultEl.textContent = 
        `重命名导入: import { add as sum, multiply as product } from './math.js'\n\n` +
        `sum(15, 25) = ${sum(15, 25)}\n` +
        `product(4, 7) = ${product(4, 7)}\n\n` +
        `💡 as 关键字用于：\n` +
        `  1. 避免命名冲突\n` +
        `  2. 使用更简洁的名称`;
    resultEl.classList.add("has-content");
}

// --- 二、工具函数模块演示 ---

/**
 * 日期格式化演示
 */
function runDateFormat() {
    const resultEl = document.getElementById("date-format-result");
    const now = new Date();
    
    // 使用从 utils.js 导入的 formatDate 函数
    const format1 = formatDate(now, "YYYY-MM-DD");
    const format2 = formatDate(now, "YYYY年MM月DD日");
    const format3 = formatDate(now, "YYYY-MM-DD HH:mm:ss");
    const format4 = formatDate(now, "MM/DD/YYYY");
    
    resultEl.textContent = 
        `当前时间: ${now.toLocaleString()}\n\n` +
        `formatDate(now, "YYYY-MM-DD")\n  => "${format1}"\n\n` +
        `formatDate(now, "YYYY年MM月DD日")\n  => "${format2}"\n\n` +
        `formatDate(now, "YYYY-MM-DD HH:mm:ss")\n  => "${format3}"\n\n` +
        `formatDate(now, "MM/DD/YYYY")\n  => "${format4}"`;
    resultEl.classList.add("has-content");
}

/**
 * 生成唯一 ID 演示
 */
function runGenerateId() {
    const resultEl = document.getElementById("generate-id-result");
    
    // 生成多个 ID 展示随机性
    const ids = [];
    for (let i = 0; i < 5; i++) {
        ids.push(generateId());
    }
    
    resultEl.textContent = 
        `生成 5 个长度为 6 的随机 ID:\n\n` +
        ids.map((id, i) => `  ${i + 1}. ${id}`).join("\n") +
        `\n\n` +
        `generateId(8) => "${generateId(8)}" (长度为8)\n\n` +
        `💡 适用于前端临时 ID，不用于安全场景`;
    resultEl.classList.add("has-content");
}

/**
 * 防抖函数演示
 */
function runDebounce() {
    const resultEl = document.getElementById("debounce-result");
    resultEl.textContent = "";
    resultEl.classList.add("has-content");
    
    // 记录执行次数
    let executeCount = 0;
    let logs = [];
    
    /**
     * 模拟搜索函数
     */
    function searchApi(query) {
        executeCount++;
        const log = `✅ 第 ${executeCount} 次执行: 搜索 "${query}"`;
        logs.push(log);
        updateDisplay();
    }
    
    /**
     * 更新显示
     */
    function updateDisplay() {
        resultEl.textContent = 
            `【防抖演示】\n` +
            `在 2 秒内快速点击 5 次按钮...\n` +
            `防抖延迟: 500ms\n\n` +
            logs.join("\n") +
            (logs.length === 0 ? "⏳ 等待防抖延迟结束..." : "");
    }
    
    // 创建防抖版本的搜索函数
    // 只有在最后一次调用后等待 500ms 才会真正执行
    const debouncedSearch = debounce(searchApi, 500);
    
    // 模拟快速调用 5 次（代表用户快速输入）
    const queries = ["J", "Ja", "Jav", "Java", "JavaScript"];
    
    resultEl.textContent = `⏳ 模拟快速输入: ${queries.join(" -> ")}\n等待防抖结果...\n`;
    
    queries.forEach((query, index) => {
        setTimeout(() => {
            debouncedSearch(query);
        }, index * 200);  // 每 200ms 调用一次
    });
}

// --- 三、数学模块演示 ---

/**
 * 数学模块演示
 * 使用用户输入的数字进行各种数学运算
 */
function runMathDemo() {
    const resultEl = document.getElementById("math-result");
    const a = parseInt(document.getElementById("math-a").value) || 5;
    const b = parseInt(document.getElementById("math-b").value) || 3;
    
    // 使用从 math.js 导入的函数
    const sum = add(a, b);
    const product = multiply(a, b);
    const factA = factorial(a);
    const factB = factorial(b);
    const fibA = fibonacci(a);
    const fibB = fibonacci(b);
    
    // 生成斐波那契数列前几项
    const fibSequence = [];
    for (let i = 0; i <= Math.min(a, 10); i++) {
        fibSequence.push(fibonacci(i));
    }
    
    resultEl.textContent = 
        `输入: a = ${a}, b = ${b}\n\n` +
        `【基础运算】\n` +
        `  add(${a}, ${b}) = ${sum}\n` +
        `  multiply(${a}, ${b}) = ${product}\n\n` +
        `【阶乘】\n` +
        `  factorial(${a}) = ${factA}\n` +
        `  factorial(${b}) = ${factB}\n\n` +
        `【斐波那契】\n` +
        `  fibonacci(${a}) = ${fibA}\n` +
        `  fibonacci(${b}) = ${fibB}\n\n` +
        `  斐波那契数列前 ${Math.min(a, 10) + 1} 项:\n` +
        `  [${fibSequence.join(", ")}]`;
    resultEl.classList.add("has-content");
}

// --- 四、配置模块演示 ---

/**
 * 配置模块演示
 */
function runConfigDemo() {
    const resultEl = document.getElementById("config-result");
    
    resultEl.textContent = 
        `【应用配置】\n\n` +
        `基本信息:\n` +
        `  名称: ${config.appName}\n` +
        `  版本: ${config.version}\n` +
        `  作者: ${config.author}\n\n` +
        `界面设置:\n` +
        `  主题: ${config.theme}\n` +
        `  语言: ${config.lang}\n` +
        `  字体大小: ${config.fontSize}px\n\n` +
        `功能开关:\n` +
        `  暗色模式: ${config.features.darkMode ? "✅" : "❌"}\n` +
        `  通知: ${config.features.notifications ? "✅" : "❌"}\n` +
        `  分析: ${config.features.analytics ? "✅" : "❌"}\n\n` +
        `API 设置:\n` +
        `  基础URL: ${config.api.baseUrl}\n` +
        `  超时: ${config.api.timeout}ms\n` +
        `  重试: ${config.api.retries}次`;
    resultEl.classList.add("has-content");
}

// ============================================
// 将函数暴露到全局作用域（仅用于演示）
// ============================================
// 在实际项目中，推荐使用事件监听器而非全局函数
// 例如: document.querySelector('.btn').addEventListener('click', runNamedExports);

window.runNamedExports = runNamedExports;
window.runDefaultExport = runDefaultExport;
window.runRenameImport = runRenameImport;
window.runDateFormat = runDateFormat;
window.runGenerateId = runGenerateId;
window.runDebounce = runDebounce;
window.runMathDemo = runMathDemo;
window.runConfigDemo = runConfigDemo;

// ============================================
// 页面加载完成后的日志
// ============================================
console.log("📦 ES 模块已加载");
console.log("导入的模块:");
console.log("  - math.js: add, multiply, factorial, fibonacci");
console.log("  - utils.js: formatDate, generateId, debounce");
console.log("  - config.js: (默认导出)");
console.log("\n⚠️  注意: 必须通过 HTTP 服务器运行此页面!");