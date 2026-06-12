// ============================================================
// 项目: 箭头函数 vs 普通函数
// 核心知识点: this 绑定差异、语法对比、使用场景
// ============================================================

// --- 1. 基础语法对比 ---

// 普通函数声明
function add(a, b) {
    return a + b;
}

// 箭头函数表达式
const multiply = (a, b) => {
    return a * b;
};

// 箭头函数简写（单表达式可省略 return 和花括号）
const subtract = (a, b) => a - b;

// 单参数可省略括号
const square = x => x * x;

// 无参数需要空括号
const getRandom = () => Math.random();

// --- 2. this 绑定演示 ---

/**
 * 演示 1: 对象方法中的 this
 * 箭头函数不能用对象方法，因为 this 会指向外层作用域
 */
function runObjectDemo() {
    const resultDiv = document.getElementById('objectDemo');
    
    // 普通函数: this 指向调用它的对象 ✅
    const person = {
        name: '张三',
        greet: function() {
            return `你好，我是${this.name}`;  // this 指向 person
        }
    };
    
    // 箭头函数: this 指向定义时的外层作用域 ❌
    const personArrow = {
        name: '李四',
        greet: () => {
            return `你好，我是${this.name}`;  // this 指向 window（全局）
        }
    };
    
    resultDiv.innerHTML = `
        <div><strong>普通函数:</strong> person.greet() = "${person.greet()}" ✅</div>
        <div><strong>箭头函数:</strong> personArrow.greet() = "${personArrow.greet()}" ❌ (this 指向全局)</div>
        <div class="tip">💡 结论: 对象方法必须用普通函数！</div>
    `;
}

/**
 * 演示 2: setTimeout 中的 this
 */
function runTimeoutDemo() {
    const resultDiv = document.getElementById('timeoutDemo');
    
    const counter = {
        count: 0,
        incrementRegular: function() {
            // 普通函数: setTimeout 中 this 会丢失（指向全局）
            setTimeout(function() {
                this.count++;  // this 是 window，不是 counter！
                resultDiv.innerHTML += `<div>普通函数: this.count = ${this.count} (实际修改了全局)</div>`;
            }, 100);
        },
        incrementArrow: function() {
            // 箭头函数: this 保持指向 counter（词法作用域）
            setTimeout(() => {
                this.count++;  // this 正确指向 counter
                resultDiv.innerHTML += `<div>箭头函数: this.count = ${this.count} ✅</div>`;
            }, 100);
        }
    };
    
    resultDiv.innerHTML = '<strong>开始演示...</strong>';
    counter.incrementRegular();
    counter.incrementArrow();
}

/**
 * 演示 3: 事件监听器中的 this
 */
document.getElementById('eventBtn').addEventListener('click', function() {
    const resultDiv = document.getElementById('eventDemo');
    
    // 普通函数: this 指向被点击的元素 ✅
    resultDiv.innerHTML = `<div>普通函数: this.textContent = "${this.textContent}" ✅</div>`;
    resultDiv.innerHTML += `<div>this === button? ${this === document.getElementById('eventBtn')}</div>`;
});

// --- 3. 回调函数中的箭头函数（最佳实践）---

const numbers = [1, 2, 3, 4, 5];

// map 中使用箭头函数（推荐）
const doubled = numbers.map(n => n * 2);

// filter 中使用箭头函数
const evens = numbers.filter(n => n % 2 === 0);

// reduce 中使用箭头函数
const sum = numbers.reduce((acc, cur) => acc + cur, 0);

// --- 4. 不能使用箭头函数的场景 ---

// ❌ 构造函数（会报错）
// const Person = (name) => { this.name = name; };

// ❌ 对象字面量方法（this 错误）
// const obj = { method: () => console.log(this) };

// ❌ 需要 arguments 对象
// const logArgs = () => console.log(arguments);  // arguments 未定义

// --- 5. 初始化 ---
// 页面加载后运行对象演示
window.addEventListener('DOMContentLoaded', () => {
    runObjectDemo();
});

// 导出函数供 HTML 调用
window.runObjectDemo = runObjectDemo;
window.runTimeoutDemo = runTimeoutDemo;
