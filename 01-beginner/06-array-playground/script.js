// ============================================================
// 项目 06: 数组方法实验室
// 核心知识点: map, filter, reduce, sort, find, some, every, includes, flat
// ============================================================

// --- 1. 示例数据 ---

// 数字数组
const numbers = [5, 12, 8, 130, 44, 23, 1, 9, 67];

// 对象数组（学生信息）
const students = [
    { name: '张三', age: 20, score: 85, grade: '大二' },
    { name: '李四', age: 21, score: 92, grade: '大三' },
    { name: '王五', age: 19, score: 78, grade: '大一' },
    { name: '赵六', age: 22, score: 95, grade: '大四' },
    { name: '孙七', age: 20, score: 60, grade: '大二' },
];

// 嵌套数组（用于 flat 演示）
const nested = [1, [2, 3], [4, [5, 6]], 7];

// --- 2. 显示初始数据 ---
document.getElementById('numbersData').textContent = JSON.stringify(numbers);
document.getElementById('studentsData').textContent = JSON.stringify(students, null, 2);

// --- 3. 数组方法实现 ---

/**
 * 定义所有数组方法的演示
 * 每个方法返回一个对象，包含: 方法名、代码、结果、解释
 */
const arrayMethods = {
    // map: 对每个元素执行函数，返回新数组（长度不变）
    map() {
        const result = numbers.map(n => n * 2);
        return {
            name: 'map() - 映射',
            code: `numbers.map(n => n * 2)`,
            output: JSON.stringify(result),
            explanation: 'map() 对数组中每个元素执行一次函数，返回一个新数组。原数组不变，新数组长度与原数组相同。'
        };
    },

    // filter: 过滤出满足条件的元素
    filter() {
        const result = numbers.filter(n => n > 10);
        return {
            name: 'filter() - 过滤',
            code: `numbers.filter(n => n > 10)`,
            output: JSON.stringify(result),
            explanation: 'filter() 返回一个新数组，只包含使回调函数返回 true 的元素。常用于筛选数据。'
        };
    },

    // reduce: 将数组归约为单个值
    reduce() {
        const sum = numbers.reduce((accumulator, current) => accumulator + current, 0);
        return {
            name: 'reduce() - 归约',
            code: `numbers.reduce((acc, cur) => acc + cur, 0)`,
            output: `总和: ${sum}`,
            explanation: 'reduce() 将数组所有元素累积为一个值。第一个参数是累加器，第二个是当前元素，0 是初始值。非常适合求和、求平均值等。'
        };
    },

    // sort: 排序
    sort() {
        // 数字排序需要比较函数，否则会按字符串排序
        const sorted = [...numbers].sort((a, b) => a - b);
        return {
            name: 'sort() - 排序',
            code: `[...numbers].sort((a, b) => a - b)`,
            output: JSON.stringify(sorted),
            explanation: 'sort() 默认按字符串排序（所以 130 会排在 12 前面！）。数字排序需要传入比较函数：a-b 升序，b-a 降序。用 [...] 创建副本避免修改原数组。'
        };
    },

    // find: 查找第一个匹配的元素
    find() {
        const result = students.find(s => s.score >= 90);
        return {
            name: 'find() - 查找',
            code: `students.find(s => s.score >= 90)`,
            output: result ? JSON.stringify(result) : '未找到',
            explanation: 'find() 返回第一个使回调函数返回 true 的元素，找到后立即停止遍历。如果没找到返回 undefined。'
        };
    },

    // some: 检查是否有元素满足条件
    some() {
        const hasHighScore = students.some(s => s.score >= 90);
        return {
            name: 'some() - 部分匹配',
            code: `students.some(s => s.score >= 90)`,
            output: `是否有分数≥90的学生: ${hasHighScore}`,
            explanation: 'some() 检查数组中是否至少有一个元素满足条件，返回 true 或 false。找到一个就停止遍历。'
        };
    },

    // every: 检查是否所有元素都满足条件
    every() {
        const allPass = students.every(s => s.score >= 60);
        return {
            name: 'every() - 全部匹配',
            code: `students.every(s => s.score >= 60)`,
            output: `是否所有学生都及格(≥60): ${allPass}`,
            explanation: 'every() 检查是否所有元素都满足条件，返回 true 或 false。找到一个不满足的就停止。'
        };
    },

    // includes: 检查数组是否包含某个值
    includes() {
        const hasFive = numbers.includes(5);
        return {
            name: 'includes() - 包含',
            code: `numbers.includes(5)`,
            output: `数组是否包含 5: ${hasFive}`,
            explanation: 'includes() 检查数组是否包含指定值，返回 true 或 false。比 indexOf() 更直观。'
        };
    },

    // flat: 展平嵌套数组
    flat() {
        const flattened = nested.flat();
        const deepFlattened = nested.flat(Infinity);
        return {
            name: 'flat() - 展平',
            code: `nested.flat() → ${JSON.stringify(flattened)}\nnested.flat(Infinity) → ${JSON.stringify(deepFlattened)}`,
            output: `展平一层: ${JSON.stringify(flattened)}\n完全展平: ${JSON.stringify(deepFlattened)}`,
            explanation: 'flat() 将嵌套数组展平。默认展平一层，传入 Infinity 可以完全展平任意嵌套。'
        };
    }
};

// --- 4. 结果显示 ---
const resultDiv = document.getElementById('result');

/**
 * 在页面上显示方法结果
 * @param {Object} info - 方法返回的信息对象
 */
function displayResult(info) {
    resultDiv.innerHTML = `
        <div class="method-name">${info.name}</div>
        <div class="code">代码: ${info.code}</div>
        <div class="output">结果: ${info.output}</div>
        <div class="explanation">💡 ${info.explanation}</div>
    `;
}

// --- 5. 事件监听 ---

// 为所有方法按钮添加点击事件
document.querySelectorAll('.method-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const method = btn.dataset.method;  // 获取 data-method 属性值
        const result = arrayMethods[method]();  // 调用对应方法
        displayResult(result);
    });
});

// --- 6. 扩展知识 ---
//
// 数组方法链式调用（方法链）:
// numbers
//     .filter(n => n > 10)    // [12, 130, 44, 23, 67]
//     .map(n => n * 2)        // [24, 260, 88, 46, 134]
//     .sort((a, b) => a - b)  // [24, 46, 88, 134, 260]
//
// 在 Console 中试试:
// students.filter(s => s.score >= 80).map(s => s.name)
// students.reduce((sum, s) => sum + s.score, 0) / students.length  // 平均分
//
// 性能提示:
// - 方法链会创建中间数组，大数据量时考虑 for 循环
// - find/some/every 都会短路（找到就停），比 filter 更高效
