/**
 * 项目 02: 简易计算器 (Simple Calculator)
 * 
 * 功能说明：
 * - 支持基本四则运算（加、减、乘、除）
 * - 支持清除(C)和删除(DEL)功能
 * - 显示计算历史记录
 * - 带有错误处理（防止无效表达式）
 * 
 * 适合初学者：每个概念都有详细的中文注释
 */

// ============================================================
// 第 1 部分：变量声明
// ============================================================

// 使用 const 声明不会改变的变量（只读）
// const 声明的变量一旦赋值就不能重新赋值
const display = document.getElementById('display');        // 获取显示屏元素
const historyList = document.getElementById('history-list'); // 获取历史记录列表元素
const clearBtn = document.getElementById('clear-btn');     // 获取清除按钮
const deleteBtn = document.getElementById('delete-btn');   // 获取删除按钮

// 使用 let 声明会改变的变量（可重新赋值）
// let 声明的变量可以在后续代码中重新赋值
let currentInput = '';    // 当前输入的表达式，初始为空字符串
let history = [];         // 计算历史记录，初始为空数组

// ============================================================
// 第 2 部分：函数定义 - 更新显示屏
// ============================================================

/**
 * 更新显示屏内容
 * 将 currentInput 的值显示到 HTML 的显示屏上
 * 
 * 知识点：箭头函数 (Arrow Function)
 * 语法：const 函数名 = (参数) => { 函数体 }
 * 箭头函数是 ES6 引入的更简洁的函数写法
 */
const updateDisplay = () => {
  // 如果当前输入为空，显示 "0"；否则显示当前输入内容
  // 三元运算符：条件 ? 值1 : 值2 （如果条件为真，返回值1；否则返回值2）
  display.textContent = currentInput === '' ? '0' : currentInput;
};

// ============================================================
// 第 3 部分：函数定义 - 添加字符到输入
// ============================================================

/**
 * 将数字或运算符添加到当前输入
 * @param {string} char - 要添加的字符（数字或运算符）
 * 
 * 知识点：传统函数声明
 * 语法：function 函数名(参数) { 函数体 }
 * 这是最常见的函数声明方式
 */
function appendToInput(char) {
  // 输入验证：防止连续的运算符
  // 定义所有运算符
  const operators = ['+', '-', '*', '/'];
  
  // 检查：如果当前输入为空，且输入的是运算符（除了负号）
  // 则不允许（但负号 "-" 可以作为负数的开头）
  if (currentInput === '' && operators.includes(char) && char !== '-') {
    return; // 直接返回，不执行后面的代码
  }
  
  // 检查：防止连续输入两个运算符
  // charAt(-1) 获取字符串的最后一个字符
  const lastChar = currentInput.charAt(currentInput.length - 1);
  if (operators.includes(lastChar) && operators.includes(char)) {
    // 如果最后一个是运算符，且新输入的也是运算符，则替换最后一个字符
    currentInput = currentInput.slice(0, -1) + char;
    updateDisplay(); // 更新显示屏
    return;
  }
  
  // 检查：防止以小数点开头（如 ".5" 是合法的，但 "5..5" 不合法）
  if (char === '.') {
    // 获取最后一个数字（用正则表达式匹配）
    const match = currentInput.match(/[\d.]*$/);
    if (match && match[0].includes('.')) {
      return; // 如果最后一个数字已经有小数点，则不添加
    }
  }
  
  // 将字符添加到当前输入
  // += 是赋值运算符，等同于 currentInput = currentInput + char
  currentInput += char;
  
  // 更新显示屏显示新的输入
  updateDisplay();
}

// ============================================================
// 第 4 部分：函数定义 - 计算结果
// ============================================================

/**
 * 计算当前表达式的结果
 * 
 * 知识点：try-catch 错误处理
 * 语法：
 * try {
 *   // 可能会出错的代码
 * } catch (error) {
 *   // 出错时执行的代码
 * }
 * 
 * 作用：如果 try 块中的代码出错，程序不会崩溃，
 *       而是跳转到 catch 块中处理错误
 */
function calculate() {
  // 如果输入为空，直接返回
  if (currentInput === '') {
    return;
  }
  
  // 使用 try-catch 捕获可能的错误
  try {
    // 保存原始输入（用于历史记录）
    const expression = currentInput;
    
    // eval() 函数会执行字符串中的 JavaScript 表达式
    // 例如：eval("2 + 3") 会返回 5
    // 注意：eval() 在实际项目中要谨慎使用，因为它会执行任意代码
    // 对于计算器来说，它是简单直接的选择
    const result = eval(currentInput);
    
    // 检查结果是否为有效数字
    // isNaN() 检查一个值是否 "Not a Number"（不是数字）
    if (isNaN(result) || !isFinite(result)) {
      // 如果结果不是数字（如除以0得到Infinity），显示错误
      display.textContent = '错误';
      currentInput = '';
      return;
    }
    
    // 格式化结果：最多保留6位小数，去除末尾的0
    // toFixed(6) 将数字转换为字符串，保留6位小数
    // parseFloat() 将字符串转回数字，自动去除末尾的0
    const formattedResult = parseFloat(result.toFixed(6));
    
    // 添加到历史记录数组
    // push() 方法向数组末尾添加一个元素
    history.push({
      expression: expression,  // 原始表达式
      result: formattedResult  // 计算结果
    });
    
    // 更新历史记录显示
    updateHistoryDisplay();
    
    // 将当前输入更新为计算结果（方便连续计算）
    currentInput = String(formattedResult);
    
    // 更新显示屏
    updateDisplay();
    
  } catch (error) {
    // 如果 eval() 执行出错（如表达式不合法），显示错误信息
    console.error('计算错误:', error); // 在控制台输出错误信息（开发者工具中可见）
    display.textContent = '表达式错误';
    currentInput = ''; // 清空当前输入
  }
}

// ============================================================
// 第 5 部分：函数定义 - 清除功能
// ============================================================

/**
 * 清除所有输入（C 按钮）
 * 将所有状态重置为初始值
 */
const clearAll = () => {
  currentInput = '';     // 清空当前输入
  updateDisplay();       // 更新显示屏
};

/**
 * 删除最后一个字符（DEL 按钮）
 * slice(0, -1) 返回从开头到倒数第二个字符的子字符串
 */
const deleteLast = () => {
  currentInput = currentInput.slice(0, -1); // 删除最后一个字符
  updateDisplay(); // 更新显示屏
};

// ============================================================
// 第 6 部分：函数定义 - 历史记录显示
// ============================================================

/**
 * 更新历史记录的显示
 * 
 * 知识点：数组遍历
 * forEach() 方法对数组中的每个元素执行一次提供的函数
 * 语法：数组.forEach((元素) => { 处理代码 })
 */
const updateHistoryDisplay = () => {
  // 清空历史记录列表
  historyList.innerHTML = '';
  
  // 只显示最近的 5 条记录
  // slice(-5) 返回数组的最后 5 个元素
  const recentHistory = history.slice(-5);
  
  // 遍历历史记录，为每条记录创建一个列表项
  recentHistory.forEach((item, index) => {
    // 创建一个新的 div 元素
    const historyItem = document.createElement('div');
    
    // 添加 CSS 类名（用于样式）
    historyItem.className = 'history-item';
    
    // 使用模板字符串设置内容
    // 模板字符串使用反引号 ` ` 包围，可以嵌入变量 ${变量名}
    historyItem.innerHTML = `
      <span class="history-expression">${item.expression}</span>
      <span class="history-result">= ${item.result}</span>
    `;
    
    // 将新元素添加到历史记录列表中
    // appendChild() 方法将一个节点添加到指定父节点的子节点列表末尾
    historyList.appendChild(historyItem);
  });
  
  // 如果没有历史记录，显示提示信息
  if (history.length === 0) {
    historyList.innerHTML = '<div class="no-history">暂无计算记录</div>';
  }
};

// ============================================================
// 第 7 部分：事件监听器 - 按钮点击
// ============================================================

/**
 * 事件监听器 (Event Listener)
 * 语法：元素.addEventListener('事件类型', 回调函数)
 * 
 * 常见事件类型：
 * - 'click': 鼠标点击
 * - 'keydown': 键盘按下
 * - 'input': 输入框内容改变
 * 
 * 当用户触发事件时，回调函数会被执行
 */

// 为所有数字按钮添加点击事件
// querySelectorAll() 获取所有匹配 CSS 选择器的元素
// 返回一个 NodeList（类似数组的对象）
const numberButtons = document.querySelectorAll('.number-btn');
numberButtons.forEach((button) => {
  // 为每个按钮添加点击事件监听器
  button.addEventListener('click', () => {
    // dataset 用于获取 HTML 元素上的 data-* 属性
    // 例如：data-value="7" 可以通过 button.dataset.value 获取
    appendToInput(button.dataset.value);
  });
});

// 为所有运算符按钮添加点击事件
const operatorButtons = document.querySelectorAll('.operator-btn');
operatorButtons.forEach((button) => {
  button.addEventListener('click', () => {
    appendToInput(button.dataset.value);
  });
});

// 为等号按钮添加点击事件
const equalsBtn = document.getElementById('equals-btn');
equalsBtn.addEventListener('click', calculate);

// 为清除按钮添加点击事件
clearBtn.addEventListener('click', clearAll);

// 为删除按钮添加点击事件
deleteBtn.addEventListener('click', deleteLast);

// 为小数点按钮添加点击事件
const decimalBtn = document.getElementById('decimal-btn');
decimalBtn.addEventListener('click', () => {
  appendToInput('.');
});

// ============================================================
// 第 8 部分：事件监听器 - 键盘输入
// ============================================================

/**
 * 键盘事件监听
 * 允许用户使用键盘输入数字和运算符
 * 
 * event.key 返回按下的键的字符
 */
document.addEventListener('keydown', (event) => {
  const key = event.key;
  
  // 检查按下的键是否是数字
  if (key >= '0' && key <= '9') {
    appendToInput(key);
  }
  // 检查是否是运算符
  else if (['+', '-', '*', '/'].includes(key)) {
    appendToInput(key);
  }
  // 检查是否是小数点
  else if (key === '.') {
    appendToInput('.');
  }
  // 检查是否是回车键（执行计算）
  else if (key === 'Enter') {
    event.preventDefault(); // 防止表单提交等默认行为
    calculate();
  }
  // 检查是否是退格键（删除最后一个字符）
  else if (key === 'Backspace') {
    deleteLast();
  }
  // 检查是否是 Escape 键（清除所有）
  else if (key === 'Escape') {
    clearAll();
  }
});

// ============================================================
// 第 9 部分：初始化
// ============================================================

/**
 * 页面加载时的初始化操作
 * DOMContentLoaded 事件在 HTML 文档完全加载后触发
 * 此时可以安全地操作 DOM 元素
 */
document.addEventListener('DOMContentLoaded', () => {
  // 初始化显示屏
  updateDisplay();
  
  // 初始化历史记录显示
  updateHistoryDisplay();
  
  // 在控制台输出一条欢迎信息
  console.log('计算器已加载！欢迎使用。');
});
