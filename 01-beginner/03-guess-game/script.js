/**
 * 项目 03: 猜数字游戏 (Guess Number Game)
 * 
 * 游戏说明：
 * - 系统随机生成一个 1-100 之间的数字
 * - 玩家输入猜测的数字
 * - 系统提示"太大了"或"太小了"
 * - 玩家根据提示继续猜，直到猜中
 * - 记录猜测次数和历史
 * 
 * 适合初学者：每个概念都有详细的中文注释
 */

// ============================================================
// 第 1 部分：变量声明与初始化
// ============================================================

/**
 * 获取 DOM 元素
 * document.getElementById() 通过元素的 id 属性获取元素
 * 返回一个 HTML 元素对象
 */
const guessInput = document.getElementById('guess-input');     // 输入框
const guessBtn = document.getElementById('guess-btn');         // 猜测按钮
const messageEl = document.getElementById('message');          // 消息显示区域
const attemptsEl = document.getElementById('attempts-count');  // 尝试次数显示
const historyEl = document.getElementById('guess-history');    // 历史记录区域
const restartBtn = document.getElementById('restart-btn');     // 重新开始按钮

/**
 * 游戏状态变量
 * 使用 let 声明，因为这些值会在游戏过程中改变
 */
let targetNumber;      // 目标数字（系统随机生成的数字）
let attempts = 0;      // 当前尝试次数
let gameOver = false;  // 游戏是否结束
let guessHistory = []; // 猜测历史记录（数组）

// ============================================================
// 第 2 部分：核心函数 - 生成随机数
// ============================================================

/**
 * 生成指定范围内的随机整数
 * 
 * 知识点：Math 对象
 * Math 是 JavaScript 内置的数学对象，提供数学常数和函数
 * 
 * Math.random() - 返回 0 到 1 之间的随机数（包含0，不包含1）
 * Math.floor()  - 向下取整，返回小于或等于给定数字的最大整数
 * 
 * 公式：Math.floor(Math.random() * (max - min + 1)) + min
 * 生成 min 到 max 之间的随机整数（包含 min 和 max）
 * 
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} 随机整数
 */
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ============================================================
// 第 3 部分：核心函数 - 初始化游戏
// ============================================================

/**
 * 初始化/重置游戏
 * 将游戏状态重置为初始值
 * 
 * 这个函数会在：
 * 1. 页面首次加载时调用
 * 2. 玩家点击"重新开始"按钮时调用
 */
const initGame = () => {
  // 生成 1-100 之间的随机数
  targetNumber = getRandomNumber(1, 100);
  
  // 重置游戏状态
  attempts = 0;        // 尝试次数归零
  gameOver = false;    // 游戏未结束
  guessHistory = [];   // 清空历史记录
  
  // 重置 UI
  guessInput.value = '';           // 清空输入框
  guessInput.disabled = false;     // 启用输入框
  guessBtn.disabled = false;       // 启用猜测按钮
  attemptsEl.textContent = '0';    // 更新尝试次数显示
  
  // 显示欢迎消息
  showMessage('游戏开始！请输入 1-100 之间的数字', 'wait');
  
  // 重置历史记录显示
  historyEl.innerHTML = '<p class="no-history">还没有猜测记录</p>';
  
  // 移除输入区域的禁用样式
  document.querySelector('.input-section').classList.remove('disabled');
  
  // 将焦点设置到输入框，方便玩家直接输入
  guessInput.focus();
  
  // 在控制台输出目标数字（调试用，实际游戏中可以注释掉）
  console.log(`（调试）目标数字是：${targetNumber}`);
};

// ============================================================
// 第 4 部分：核心函数 - 显示消息
// ============================================================

/**
 * 在消息区域显示提示信息
 * 
 * 知识点：模板字符串
 * 使用反引号 ` ` 包围，可以在字符串中嵌入变量 ${变量名}
 * 例如：`你好，${name}！` 会输出 "你好，小明！"
 * 
 * @param {string} text - 要显示的消息文本
 * @param {string} type - 消息类型（用于不同的样式）
 *                       'wait'    - 等待输入
 *                       'too-low' - 猜小了
 *                       'too-high'- 猜大了
 *                       'correct' - 猜对了
 *                       'invalid' - 输入无效
 */
const showMessage = (text, type) => {
  // 设置消息文本
  messageEl.textContent = text;
  
  // 移除所有可能的消息类型类名
  // classList.remove() 从元素中移除指定的 CSS 类
  messageEl.classList.remove('wait', 'too-low', 'too-high', 'correct', 'invalid');
  
  // 添加新的消息类型类名
  // classList.add() 向元素添加指定的 CSS 类
  messageEl.classList.add(type);
};

// ============================================================
// 第 5 部分：核心函数 - 更新尝试次数
// ============================================================

/**
 * 更新尝试次数的显示
 * 将 attempts 变量的值显示在页面上
 */
const updateAttempts = () => {
  attemptsEl.textContent = attempts;
};

// ============================================================
// 第 6 部分：核心函数 - 添加猜测历史
// ============================================================

/**
 * 将当前猜测添加到历史记录中
 * 
 * 知识点：数组的 push() 方法
 * push() 向数组末尾添加一个或多个元素，并返回新数组的长度
 * 
 * @param {number} guess - 玩家猜测的数字
 * @param {string} result - 猜测结果 ('low', 'high', 'correct')
 */
const addGuessToHistory = (guess, result) => {
  // 将猜测信息添加到数组
  guessHistory.push({
    guess: guess,      // 猜测的数字
    result: result     // 结果：'low'（小了）, 'high'（大了）, 'correct'（正确）
  });
  
  // 更新历史记录显示
  updateHistoryDisplay();
};

// ============================================================
// 第 7 部分：核心函数 - 更新历史显示
// ============================================================

/**
 * 更新历史记录的 HTML 显示
 * 
 * 知识点：数组的 forEach() 方法
 * forEach() 对数组中的每个元素执行一次提供的函数
 * 语法：数组.forEach((元素, 索引) => { 处理代码 })
 */
const updateHistoryDisplay = () => {
  // 清空当前的历史记录显示
  historyEl.innerHTML = '';
  
  // 如果没有任何记录，显示提示信息
  if (guessHistory.length === 0) {
    historyEl.innerHTML = '<p class="no-history">还没有猜测记录</p>';
    return;  // 提前返回，不执行后面的代码
  }
  
  // 遍历历史记录，为每条记录创建一个 div 元素
  guessHistory.forEach((item, index) => {
    // 根据结果确定 CSS 类名
    let resultClass = '';
    let resultText = '';
    
    // switch 语句：根据不同的值执行不同的代码块
    // 类似于多个 if-else 的简化写法
    switch (item.result) {
      case 'low':
        resultClass = 'low';
        resultText = '太小了 ↑';
        break;  // break 防止代码继续执行到下一个 case
      case 'high':
        resultClass = 'high';
        resultText = '太大了 ↓';
        break;
      case 'correct':
        resultClass = 'correct';
        resultText = '恭喜你，猜对了！';
        break;
    }
    
    // 创建历史项元素
    const historyItem = document.createElement('div');
    historyItem.className = `history-item ${resultClass}`;  // 使用模板字符串
    
    // 设置内容：第几次猜测 + 猜测数字 + 结果
    historyItem.textContent = `第 ${index + 1} 次: ${item.guess} - ${resultText}`;
    
    // 将新元素添加到历史记录容器
    historyEl.appendChild(historyItem);
  });
  
  // 滚动到历史记录底部（显示最新的记录）
  historyEl.scrollTop = historyEl.scrollHeight;
};

// ============================================================
// 第 8 部分：核心函数 - 处理猜测
// ============================================================

/**
 * 处理玩家的猜测
 * 这是游戏的核心逻辑函数
 */
const handleGuess = () => {
  // 如果游戏已经结束，直接返回
  if (gameOver) {
    return;
  }
  
  // 获取玩家输入的值
  // .value 属性获取输入框的当前值（返回字符串）
  const inputValue = guessInput.value;
  
  // 将输入转换为数字
  // parseInt() 将字符串解析为整数
  // 例如：parseInt("42") 返回 42
  const guess = parseInt(inputValue);
  
  // ============================================================
  // 输入验证
  // ============================================================
  
  // 检查输入是否为空
  if (inputValue === '') {
    showMessage('请输入一个数字！', 'invalid');
    return;
  }
  
  // 检查输入是否为有效数字
  // isNaN() 检查一个值是否 "Not a Number"（不是数字）
  if (isNaN(guess)) {
    showMessage('请输入有效的数字！', 'invalid');
    guessInput.value = '';  // 清空输入框
    guessInput.focus();     // 重新聚焦到输入框
    return;
  }
  
  // 检查数字是否在 1-100 范围内
  if (guess < 1 || guess > 100) {
    showMessage('请输入 1-100 之间的数字！', 'invalid');
    guessInput.value = '';
    guessInput.focus();
    return;
  }
  
  // 检查是否重复猜测了同一个数字
  // some() 方法测试数组中是否至少有一个元素通过了测试
  // 语法：数组.some((元素) => 返回布尔值的表达式)
  if (guessHistory.some(item => item.guess === guess)) {
    showMessage(`你已经猜过 ${guess} 了，请换一个数字！`, 'invalid');
    guessInput.value = '';
    guessInput.focus();
    return;
  }
  
  // ============================================================
  // 核心游戏逻辑
  // ============================================================
  
  // 增加尝试次数
  attempts++;
  updateAttempts();  // 更新显示
  
  // 清空输入框，方便下一次输入
  guessInput.value = '';
  guessInput.focus();
  
  // 比较猜测与目标数字
  if (guess < targetNumber) {
    // 猜小了
    showMessage(`${guess} 太小了！再试试更大的数字`, 'too-low');
    addGuessToHistory(guess, 'low');
    
  } else if (guess > targetNumber) {
    // 猜大了
    showMessage(`${guess} 太大了！再试试更小的数字`, 'too-high');
    addGuessToHistory(guess, 'high');
    
  } else {
    // 猜对了！
    showMessage(`恭喜你！${guess} 就是正确答案！你用了 ${attempts} 次猜中了！`, 'correct');
    addGuessToHistory(guess, 'correct');
    
    // 游戏结束
    gameOver = true;
    
    // 禁用输入框和按钮
    guessInput.disabled = true;
    guessBtn.disabled = true;
    
    // 添加禁用样式
    document.querySelector('.input-section').classList.add('disabled');
  }
};

// ============================================================
// 第 9 部分：事件监听器
// ============================================================

/**
 * 事件监听器
 * 语法：元素.addEventListener('事件类型', 回调函数)
 * 
 * 当指定的事件发生时，回调函数会被自动调用
 */

// 猜测按钮点击事件
guessBtn.addEventListener('click', handleGuess);

/**
 * 键盘事件
 * 监听输入框的按键事件
 * event.key 返回按下的键的字符
 * event.preventDefault() 阻止事件的默认行为（如表单提交）
 */
guessInput.addEventListener('keydown', (event) => {
  // 如果按下的是回车键
  if (event.key === 'Enter') {
    event.preventDefault();  // 防止默认的表单提交行为
    handleGuess();           // 执行猜测逻辑
  }
});

// 重新开始按钮点击事件
restartBtn.addEventListener('click', () => {
  // 显示确认对话框
  // confirm() 显示一个确认对话框，返回 true（确定）或 false（取消）
  if (confirm('确定要重新开始游戏吗？当前进度将会丢失。')) {
    initGame();
  }
});

// ============================================================
// 第 10 部分：页面加载初始化
// ============================================================

/**
 * DOMContentLoaded 事件
 * 当 HTML 文档完全加载并解析完成后触发
 * 此时可以安全地操作 DOM 元素
 */
document.addEventListener('DOMContentLoaded', () => {
  // 初始化游戏
  initGame();
  
  // 在控制台输出欢迎信息
  console.log('猜数字游戏已加载！祝你玩得开心！');
});
