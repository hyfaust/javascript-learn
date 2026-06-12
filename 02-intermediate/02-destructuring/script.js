/**
 * ============================================
 * ES6 解构赋值 - 交互式演示脚本
 * ============================================
 * 
 * 本文件包含所有解构赋值的演示函数
 * 每个函数都会在页面上显示结果，而非仅输出到控制台
 * 
 * 解构赋值是 ES6 引入的重要特性，允许我们从数组或对象中
 * 按位置或属性名快速提取值并赋给变量
 */

// ============================================
// 一、数组解构演示函数
// ============================================

/**
 * 1. 基础数组解构演示
 * 按照数组中元素的顺序，依次赋值给对应的变量
 */
function runBasicArray() {
    // 定义一个包含三个水果名称的数组
    const fruits = ["苹果", "香蕉", "橙子"];
    
    // 【解构语法】使用方括号 [] 声明变量，按位置匹配数组元素
    // first 接收第一个元素 "苹果"
    // second 接收第二个元素 "香蕉"
    // third 接收第三个元素 "橙子"
    const [first, second, third] = fruits;
    
    // 将结果显示在页面上
    const resultEl = document.getElementById("basic-array-result");
    resultEl.textContent = 
        `原始数组: ${JSON.stringify(fruits)}\n` +
        `解构结果:\n` +
        `  first  = "${first}"\n` +
        `  second = "${second}"\n` +
        `  third  = "${third}"`;
    resultEl.classList.add("has-content");
}

/**
 * 2. 跳过元素演示
 * 使用逗号占位符跳过不需要的数组元素
 */
function runSkipElements() {
    // 定义一个包含 5 个数字的数组
    const numbers = [1, 2, 3, 4, 5];
    
    // 【跳过语法】在解构模式中使用逗号占位
    // 第1个位置 -> first (值为1)
    // 第2个位置 -> 逗号跳过 (值为2被忽略)
    // 第3个位置 -> third (值为3)
    // 第4个位置 -> 逗号跳过 (值为4被忽略)
    // 第5个位置 -> fifth (值为5)
    const [first, , third, , fifth] = numbers;
    
    // 显示结果
    const resultEl = document.getElementById("skip-result");
    resultEl.textContent = 
        `原始数组: ${JSON.stringify(numbers)}\n` +
        `解构结果:\n` +
        `  first  = ${first}  (跳过索引1)\n` +
        `  third  = ${third}  (跳过索引3)\n` +
        `  fifth  = ${fifth}`;
    resultEl.classList.add("has-content");
}

/**
 * 3. Rest 剩余元素演示
 * 使用扩展运算符 ... 收集剩余的所有元素到一个新数组中
 */
function runRest() {
    // 定义一个编程语言数组
    const languages = ["HTML", "CSS", "JavaScript", "React", "Vue"];
    
    // 【Rest 语法】...rest 会收集剩余的所有元素
    // first  -> "HTML"
    // second -> "CSS"
    // rest   -> ["JavaScript", "React", "Vue"] (剩余元素组成的数组)
    const [first, second, ...rest] = languages;
    
    // 显示结果
    const resultEl = document.getElementById("rest-result");
    resultEl.textContent = 
        `原始数组: ${JSON.stringify(languages)}\n` +
        `解构结果:\n` +
        `  first  = "${first}"\n` +
        `  second = "${second}"\n` +
        `  rest   = ${JSON.stringify(rest)} (包含剩余 ${rest.length} 个元素)`;
    resultEl.classList.add("has-content");
}

/**
 * 4. 交换变量值演示
 * 利用解构语法，无需临时变量即可交换两个变量的值
 */
function runSwap() {
    // 初始值
    let a = 10;
    let b = 20;
    
    // 【交换技巧】右边先创建数组 [b, a] = [20, 10]
    // 然后解构赋值给 [a, b]
    // 等价于: a = b; b = a; 但更加简洁
    [a, b] = [b, a];
    
    // 显示交换前后的值
    const resultEl = document.getElementById("swap-result");
    resultEl.textContent = 
        `交换前: a = 10, b = 20\n` +
        `执行: [a, b] = [b, a]\n` +
        `交换后: a = ${a}, b = ${b}\n\n` +
        `✨ 无需临时变量即可完成交换！`;
    resultEl.classList.add("has-content");
}

// ============================================
// 二、对象解构演示函数
// ============================================

/**
 * 1. 基础对象解构演示
 * 根据属性名从对象中提取对应的值
 */
function runBasicObject() {
    // 定义一个包含个人信息的对象
    const person = {
        name: "张三",
        age: 25,
        city: "北京"
    };
    
    // 【对象解构语法】使用花括号 {} 声明变量，按属性名匹配
    // 变量名必须与对象属性名相同
    const { name, age, city } = person;
    
    // 显示结果
    const resultEl = document.getElementById("basic-object-result");
    resultEl.textContent = 
        `原始对象: ${JSON.stringify(person)}\n` +
        `解构结果:\n` +
        `  name = "${name}"\n` +
        `  age  = ${age}\n` +
        `  city = "${city}"`;
    resultEl.classList.add("has-content");
}

/**
 * 2. 重命名变量演示
 * 使用冒号语法将对象属性赋值给不同名称的变量
 */
function runRename() {
    // 定义一本书的信息
    const book = {
        title: "JavaScript指南",
        author: "李四"
    };
    
    // 【重命名语法】属性名: 新变量名
    // title 属性的值赋给变量 bookTitle
    // author 属性的值赋给变量 bookAuthor
    const { title: bookTitle, author: bookAuthor } = book;
    
    // 注意：此时 title 和 author 变量不存在，只有 bookTitle 和 bookAuthor
    const resultEl = document.getElementById("rename-result");
    resultEl.textContent = 
        `原始对象: ${JSON.stringify(book)}\n` +
        `解构结果:\n` +
        `  bookTitle  = "${bookTitle}"  (来自 title 属性)\n` +
        `  bookAuthor = "${bookAuthor}"  (来自 author 属性)\n\n` +
        `💡 提示: 使用 "原属性名: 新变量名" 语法重命名`;
    resultEl.classList.add("has-content");
}

/**
 * 3. 默认值演示
 * 当对象中不存在某个属性时，使用指定的默认值
 */
function runDefaults() {
    // 定义一个不完整的用户对象（缺少 role 和 status 属性）
    const user = {
        username: "admin"
    };
    
    // 【默认值语法】属性名 = 默认值
    // 如果对象中没有该属性，则使用等号后面的默认值
    const { username, role = "普通用户", status = "在线" } = user;
    
    // 显示结果
    const resultEl = document.getElementById("defaults-result");
    resultEl.textContent = 
        `原始对象: ${JSON.stringify(user)}\n` +
        `解构结果:\n` +
        `  username = "${username}"  (从对象中获取)\n` +
        `  role     = "${role}"  (使用默认值，因为对象中不存在)\n` +
        `  status   = "${status}"  (使用默认值，因为对象中不存在)`;
    resultEl.classList.add("has-content");
}

/**
 * 4. 嵌套对象解构演示
 * 从深层嵌套的对象结构中提取值
 */
function runNested() {
    // 定义一个包含嵌套结构的学生对象
    const student = {
        name: "王五",
        scores: {
            math: 95,
            english: 88,
            chinese: 92
        },
        contact: {
            email: "wangwu@example.com",
            phone: "13800138000"
        }
    };
    
    // 【嵌套解构语法】在解构模式中继续嵌套解构
    // name 直接从顶层获取
    // scores: { math, english } 进入 scores 对象内部解构
    // contact: { email } 进入 contact 对象内部解构
    const { 
        name, 
        scores: { math, english },  // 嵌套解构 scores 对象
        contact: { email }          // 嵌套解构 contact 对象
    } = student;
    
    // 显示结果
    const resultEl = document.getElementById("nested-result");
    resultEl.textContent = 
        `原始对象: ${JSON.stringify(student, null, 2)}\n` +
        `解构结果:\n` +
        `  name    = "${name}"\n` +
        `  math    = ${math}\n` +
        `  english = ${english}\n` +
        `  email   = "${email}"\n\n` +
        `💡 注意: scores 和 contact 本身不会被提取为变量`;
    resultEl.classList.add("has-content");
}

// ============================================
// 三、函数参数解构演示函数
// ============================================

/**
 * 1. 对象参数解构演示
 * 直接在函数参数列表中解构传入的对象
 */
function runFnObjectParam() {
    /**
     * 问候函数 - 直接在参数中解构对象
     * @param {Object} param0 - 传入的参数对象
     * @param {string} param0.name - 姓名
     * @param {number} param0.age - 年龄
     * @param {string} [param0.greeting="你好"] - 问候语（可选，有默认值）
     * @returns {string} 完整的问候消息
     */
    function greet({ name, age, greeting = "你好" }) {
        return `${greeting}，我是${name}，今年${age}岁`;
    }
    
    // 调用函数并显示结果
    const result1 = greet({ name: "赵六", age: 30 });
    const result2 = greet({ name: "孙七", age: 22, greeting: "Hello" });
    
    const resultEl = document.getElementById("fn-object-result");
    resultEl.textContent = 
        `调用 1: greet({ name: "赵六", age: 30 })\n` +
        `结果: "${result1}"\n\n` +
        `调用 2: greet({ name: "孙七", age: 22, greeting: "Hello" })\n` +
        `结果: "${result2}"\n\n` +
        `💡 优点: 函数调用时可以传入任意顺序的参数对象`;
    resultEl.classList.add("has-content");
}

/**
 * 2. 数组参数解构演示
 * 直接在函数参数列表中解构传入的数组
 */
function runFnArrayParam() {
    /**
     * 计算两点间距离 - 直接解构坐标数组
     * @param {number[]} point1 - 第一个点的坐标 [x1, y1]
     * @param {number[]} point2 - 第二个点的坐标 [x2, y2]
     * @returns {number} 两点间的欧几里得距离
     */
    function getDistance([x1, y1], [x2, y2]) {
        const dx = x2 - x1;  // x 方向的差值
        const dy = y2 - y1;  // y 方向的差值
        // 使用勾股定理计算距离
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // 测试用例
    const pointA = [0, 0];
    const pointB = [3, 4];
    const distance = getDistance(pointA, pointB);
    
    const resultEl = document.getElementById("fn-array-result");
    resultEl.textContent = 
        `点 A: (${pointA[0]}, ${pointA[1]})\n` +
        `点 B: (${pointB[0]}, ${pointB[1]})\n` +
        `计算: getDistance([${pointA}], [${pointB}])\n` +
        `距离: ${distance}\n\n` +
        `📐 公式: √((x2-x1)² + (y2-y1)²) = √(3² + 4²) = √25 = 5`;
    resultEl.classList.add("has-content");
}

// ============================================
// 四、互动练习区函数
// ============================================

/**
 * 根据选择的类型切换输入框显示
 */
function updateInput() {
    // 获取用户选择的解构类型
    const type = document.getElementById("destructure-type").value;
    const arrayGroup = document.getElementById("array-input-group");
    const objectGroup = document.getElementById("object-input-group");
    
    // 根据类型显示对应的输入框
    if (type === "array") {
        arrayGroup.style.display = "block";
        objectGroup.style.display = "none";
    } else {
        arrayGroup.style.display = "none";
        objectGroup.style.display = "block";
    }
}

/**
 * 执行自定义解构练习
 * 解析用户输入的数据并执行相应的解构操作
 */
function runCustomDestruct() {
    const type = document.getElementById("destructure-type").value;
    const resultEl = document.getElementById("custom-result");
    
    if (type === "array") {
        // 处理数组解构
        const input = document.getElementById("array-input").value;
        // 将输入字符串按逗号分割，并去除每个元素的首尾空格
        const arr = input.split(",").map(item => item.trim());
        
        // 演示基础解构（提取前三个元素）
        const [first, second, third, ...rest] = arr;
        
        let output = `【数组解构结果】\n`;
        output += `输入数组: ${JSON.stringify(arr)}\n`;
        output += `解构: const [first, second, third, ...rest] = arr\n\n`;
        output += `  first  = "${first}"\n`;
        output += `  second = "${second}"\n`;
        output += `  third  = "${third}"\n`;
        output += `  rest   = ${JSON.stringify(rest)}\n`;
        
        // 演示交换前两个元素
        const [a, b] = arr;
        const swapped = [b, a];
        output += `\n【交换演示】原: ["${a}", "${b}"] -> 交换后: ["${swapped[0]}", "${swapped[1]}"]`;
        
        resultEl.textContent = output;
    } else {
        // 处理对象解构
        const input = document.getElementById("object-input").value;
        // 解析输入字符串: "key1:value1; key2:value2" -> { key1: "value1", key2: "value2" }
        const obj = {};
        input.split(";").forEach(pair => {
            const [key, value] = pair.split(":").map(s => s.trim());
            if (key && value) {
                // 尝试将数字字符串转换为数字类型
                obj[key] = isNaN(value) ? value : Number(value);
            }
        });
        
        // 获取对象的所有键
        const keys = Object.keys(obj);
        
        // 构建解构表达式和结果
        let destructureExpr = `const { ${keys.join(", ")} } = obj`;
        let output = `【对象解构结果】\n`;
        output += `输入对象: ${JSON.stringify(obj)}\n`;
        output += `解构: ${destructureExpr}\n\n`;
        
        // 动态提取所有属性并显示
        keys.forEach(key => {
            output += `  ${key} = ${typeof obj[key] === "string" ? `"${obj[key]}"` : obj[key]}\n`;
        });
        
        // 演示带默认值的解构（添加一个对象中不存在的属性）
        output += `\n【带默认值演示】\n`;
        output += `const { ${keys[0]}, nonExist = "默认值" } = obj\n`;
        output += `  ${keys[0]} = ${typeof obj[keys[0]] === "string" ? `"${obj[keys[0]]}"` : obj[keys[0]]}\n`;
        output += `  nonExist = "默认值" (对象中不存在此属性)`;
        
        resultEl.textContent = output;
    }
    
    resultEl.classList.add("has-content");
}

// ============================================
// 页面加载完成后的初始化操作
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    // 页面加载时显示欢迎信息
    console.log("🎓 ES6 解构赋值交互式学习页面已加载");
    console.log("点击各个演示按钮来查看解构赋值的效果");
});