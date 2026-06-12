/**
 * ============================================
 * ES6 模板字符串 - 交互式演示脚本
 * ============================================
 * 
 * 模板字符串（Template Literals）是 ES6 引入的强大字符串语法
 * 使用反引号 ` 而非引号 " 或 '
 * 
 * 核心功能：
 * 1. 字符串插值：使用 \${\} 嵌入变量和表达式
 * 2. 多行字符串：无需转义符即可换行
 * 3. 标签模板：自定义函数处理模板字符串
 */

// ============================================
// 一、字符串插值演示
// ============================================

/**
 * 1. 基础字符串插值演示
 * 展示如何在字符串中嵌入变量
 */
function runBasicInterpolation() {
    // 定义变量
    const name = "小明";
    const age = 18;
    
    // 【旧方法】使用 + 拼接字符串（繁琐易错）
    const oldWay = "我叫" + name + "，今年" + age + "岁";
    
    // 【新方法】使用模板字符串 \${\} 嵌入变量（简洁优雅）
    // 注意使用反引号 ` 而非单引号或双引号
    const newWay = `我叫${name}，今年${age}岁`;
    
    // 显示对比结果
    const resultEl = document.getElementById("basic-interpolation-result");
    resultEl.textContent = 
        `变量: name = "${name}", age = ${age}\n\n` +
        `旧方法 (+ 拼接):\n  "${oldWay}"\n\n` +
        `新方法 (模板字符串):\n  "${newWay}"\n\n` +
        `✨ 模板字符串让字符串拼接更直观！`;
    resultEl.classList.add("has-content");
}

/**
 * 2. 表达式求值演示
 * \${\} 内可以执行任意 JavaScript 表达式
 */
function runExpressionEval() {
    // 定义价格和数量
    const price = 99;
    const quantity = 3;
    const discount = 0.9;  // 9折优惠
    
    // 【表达式求值】\${\} 内可以进行数学运算
    const subtotal = `小计: ¥${price * quantity}`;
    const total = `折后总价: ¥${(price * quantity * discount).toFixed(2)}`;
    
    // 【三元表达式】\${\} 内可以使用条件表达式
    const savings = `节省了 ¥${(price * quantity * (1 - discount)).toFixed(2)}${discount < 1 ? " 🎉" : ""}`;
    
    // 【方法调用】\${\} 内可以调用方法
    const priceStr = `单价: ¥${price.toFixed(2)}`;
    
    // 显示结果
    const resultEl = document.getElementById("expression-result");
    resultEl.textContent = 
        `数据: 单价 ¥${price}, 数量 ${quantity}, 折扣 ${discount * 10}折\n\n` +
        `${priceStr}\n` +
        `${subtotal}\n` +
        `${total}\n` +
        `${savings}\n\n` +
        `💡 \${\} 内可以执行：数学运算、函数调用、三元表达式等`;
    resultEl.classList.add("has-content");
}

/**
 * 3. 在模板中调用函数演示
 */
function runFnInTemplate() {
    // 定义一些工具函数
    /**
     * 将字符串转为大写
     * @param {string} str - 输入字符串
     * @returns {string} 大写形式的字符串
     */
    function toUpperCase(str) {
        return str.toUpperCase();
    }
    
    /**
     * 计算字符串长度并返回描述
     * @param {string} str - 输入字符串
     * @returns {string} 长度描述
     */
    function describeLength(str) {
        return `共 ${str.length} 个字符`;
    }
    
    /**
     * 反转字符串
     * @param {string} str - 输入字符串
     * @returns {string} 反转后的字符串
     */
    function reverse(str) {
        return str.split("").reverse().join("");
    }
    
    // 测试数据
    const word = "hello";
    
    // 【函数调用】在 \${\} 中直接调用函数
    const upperResult = `大写: ${toUpperCase(word)}`;
    const lengthResult = `${describeLength(word)}`;
    const reverseResult = `反转: ${reverse(word)}`;
    
    // 显示结果
    const resultEl = document.getElementById("fn-template-result");
    resultEl.textContent = 
        `输入: "${word}"\n\n` +
        `${upperResult}\n` +
        `${lengthResult}\n` +
        `${reverseResult}\n\n` +
        `💡 \${\} 内可以调用任何函数，包括箭头函数: ${(x => x * 2)(5)}`;
    resultEl.classList.add("has-content");
}

// ============================================
// 二、多行字符串对比演示
// ============================================

/**
 * 旧方法：使用 + 和 \n 拼接多行字符串
 */
function runOldWay() {
    // 【旧方法】使用加号和换行符拼接，容易出错
    const title = "ES6 教程";
    const author = "张老师";
    
    // 需要手动添加 \n 换行，并使用 + 连接每行
    const oldMultiLine = "=== " + title + " ===\n" +
        "作者: " + author + "\n" +
        "----------------\n" +
        "第一行：欢迎学习 ES6\n" +
        "第二行：模板字符串很好用\n" +
        "第三行：多多练习";
    
    // 显示结果和源代码长度对比
    const resultEl = document.getElementById("old-way-result");
    resultEl.textContent = 
        `【输出结果】\n${oldMultiLine}\n\n` +
        `【缺点分析】\n` +
        `  ❌ 需要手动添加 \\n 换行符\n` +
        `  ❌ 每行都要用 + 连接\n` +
        `  ❌ 缩进会被包含在字符串中\n` +
        `  ❌ 容易遗漏引号或加号`;
    resultEl.classList.add("has-content");
}

/**
 * 新方法：使用模板字符串直接书写多行内容
 */
function runNewWay() {
    // 【新方法】使用反引号，直接换行
    const title = "ES6 教程";
    const author = "张老师";
    
    // 反引号内可以直接换行，无需任何转义
    const newMultiLine = `=== ${title} ===
作者: ${author}
----------------
第一行：欢迎学习 ES6
第二行：模板字符串很好用
第三行：多多练习`;
    
    // 显示结果和优势对比
    const resultEl = document.getElementById("new-way-result");
    resultEl.textContent = 
        `【输出结果】\n${newMultiLine}\n\n` +
        `【优点分析】\n` +
        `  ✅ 直接换行，无需 \\n\n` +
        `  ✅ 无需 + 连接符\n` +
        `  ✅ 可以嵌入 \${\} 变量\n` +
        `  ✅ 代码更清晰易读`;
    resultEl.classList.add("has-content");
}

// ============================================
// 三、标签模板演示
// ============================================

/**
 * 1. 简单标签模板演示
 * 标签函数接收模板的各个部分作为参数
 * 
 * @param {string[]} strings - 模板中的静态字符串部分
 * @param {...any} values - 模板中 \${\} 表达式的值
 * @returns {string} 处理后的字符串
 */
function runTaggedTemplate() {
    /**
     * 高亮函数 - 将所有变量值用 <mark> 标签包裹
     * 第一个参数 strings 是静态字符串数组
     * 后续参数 ...values 是 \${\} 中的变量值
     */
    function highlight(strings, ...values) {
        // 使用 reduce 将字符串和值交错拼接
        // 每个值都用 <mark> 标签包裹以实现高亮效果
        return strings.reduce((result, str, i) => {
            // 如果当前有对应的值，则用 mark 标签包裹
            const highlighted = values[i] ? `<mark>${values[i]}</mark>` : "";
            return result + highlighted + str;
        }, "");
    }
    
    // 测试数据
    const name = "JavaScript";
    const year = "2024";
    
    // 【标签模板语法】函数名后直接跟模板字符串
    // 等价于: highlight(["学习 ", " 很有趣", ""], name)
    const result1 = highlight`学习 ${name} 很有趣`;
    
    // 多个变量
    // 等价于: highlight(["", " 诞生于 ", " 年", ""], name, year)
    const result2 = highlight`${name} 诞生于 ${year} 年`;
    
    // 显示结果
    const resultEl = document.getElementById("tagged-result");
    resultEl.innerHTML = 
        `<strong>【标签模板工作原理】</strong>\n\n` +
        `模板: \`学习 $\{name\} 很有趣\`\n` +
        `调用: highlight\`学习 $\{name\} 很有趣\`\n\n` +
        `函数接收:\n` +
        `  strings = ["学习 ", " 很有趣"]\n` +
        `  values  = ["${name}"]\n\n` +
        `<strong>【处理结果】</strong>\n` +
        `${result1}\n\n` +
        `${result2}\n\n` +
        `💡 标签模板常用于：HTML 转义、国际化、样式化等`;
    resultEl.classList.add("has-content");
}

/**
 * 2. 货币格式化标签模板演示
 */
function runCurrencyTag() {
    /**
     * 货币格式化函数 - 自动将数字转为人民币格式
     */
    function currency(strings, ...values) {
        // 遍历所有值，将数字类型格式化为人民币形式
        const formatted = values.map(value => {
            // 如果是数字，添加货币符号和两位小数
            if (typeof value === "number") {
                return "¥" + value.toFixed(2);
            }
            // 非数字值保持原样
            return value;
        });
        
        // 将静态字符串和格式化后的值交错拼接
        return strings.reduce((result, str, i) => {
            // formatted[i-1] 是因为 strings 比 values 多一个元素
            return result + (i > 0 ? formatted[i - 1] : "") + str;
        }, "");
    }
    
    // 测试数据
    const price = 199.9;
    const quantity = 3;
    const tax = 12.5;
    
    // 【使用标签模板】自动格式化其中的数字
    const message = currency`商品价格: ${price}，购买数量: ${quantity}，税费: ${tax}，总计: ${price * quantity + tax}`;
    
    // 显示结果
    const resultEl = document.getElementById("currency-result");
    resultEl.innerHTML = 
        `<strong>【货币格式化标签】</strong>\n\n` +
        `输入值:\n` +
        `  price = ${price}\n` +
        `  quantity = ${quantity}\n` +
        `  tax = ${tax}\n\n` +
        `<strong>输出:</strong>\n` +
        `${message}\n\n` +
        `💡 所有数字自动格式化为 ¥XXX.XX 格式`;
    resultEl.classList.add("has-content");
}

// ============================================
// 四、个性化消息生成器
// ============================================

/**
 * 根据用户输入和选择的风格生成个性化消息
 * 使用模板字符串的不同风格来创建消息
 */
function generateMessage() {
    // 获取用户输入
    const name = document.getElementById("user-name").value || "朋友";
    const age = document.getElementById("user-age").value || "18";
    const city = document.getElementById("user-city").value || "某地";
    const hobby = document.getElementById("user-hobby").value || "生活";
    const style = document.getElementById("message-style").value;
    
    // 定义不同风格的消息模板
    const templates = {
        // 友好问候风格
        friendly: `👋 你好呀，${name}！

很高兴认识来自${city}的你！
听说你喜欢${hobby}，这真是太棒了！

🎂 ${age}岁正是充满活力和梦想的年纪
愿你在${city}这座城市，
用${hobby}点亮每一天！

✨ 加油，未来可期！`,

        // 正式介绍风格
        formal: `【个人简介】

姓名：${name}
年龄：${age}岁
所在城市：${city}
兴趣爱好：${hobby}

---
${name}，${age}岁，现居${city}。
热衷于${hobby}，并在此领域不断探索与成长。`,

        // 幽默风格
        funny: `🚨 紧急播报！

${city}惊现一位${age}岁的大佬！
名字叫${name}！
据说${hobby}水平已经修炼到满级！

据知情人士透露：
"${name}的${hobby}技术，
那是${city}第一，宇宙第二！
（第一是谁？目前还在寻找中...😄）"

🎮 鉴定完毕：${hobby}爱好者一枚！`,

        // 诗意风格
        poetic: `「${name}·${city}」

${city}的微风轻拂，
${age}岁的年华正好。

你以${hobby}为笔，
在时光的画卷上，
写下属于自己的诗篇。

山高水长，岁月静好，
愿你的${hobby}之路，
如夏花般绚烂，
如秋水般绵长。

🌸 —— 为你而作`
    };
    
    // 获取对应风格的消息
    const message = templates[style];
    
    // 显示生成的消息
    const resultEl = document.getElementById("generated-message");
    resultEl.textContent = message;
    resultEl.classList.add("has-content");
}

// ============================================
// 页面加载完成后的初始化操作
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    // 页面加载时显示欢迎信息
    console.log("🎓 ES6 模板字符串交互式学习页面已加载");
    console.log("点击各个演示按钮来查看模板字符串的功能");
});