// ============================================================
// 项目 05: 动态时钟
// 核心知识点: setInterval、Date 对象、时间格式化、字符串填充
// ============================================================

// --- 1. 获取 DOM 元素 ---
const timeDisplay = document.getElementById('time');      // 时间显示
const periodDisplay = document.getElementById('period');  // AM/PM 显示
const dateDisplay = document.getElementById('date');      // 日期显示
const formatBtn = document.getElementById('formatBtn');   // 切换格式按钮
const stopBtn = document.getElementById('stopBtn');       // 暂停/开始按钮
const secondsBar = document.getElementById('secondsBar'); // 秒针进度条

// --- 2. 状态变量 ---
let is24Hour = true;     // 是否为 24 小时制
let isRunning = true;    // 时钟是否运行中
let timerId = null;      // setInterval 返回的定时器 ID

// --- 3. 核心函数 ---

/**
 * 更新时钟显示
 * 这个函数每秒被调用一次，获取当前时间并更新页面
 */
function updateClock() {
    // 创建 Date 对象，包含当前时间信息
    const now = new Date();
    
    // 获取时、分、秒
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();
    
    // 处理 12 小时制
    let period = '';  // 存储 AM 或 PM
    if (!is24Hour) {
        period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;  // 0 点显示为 12
    }
    
    // 格式化时间：使用 padStart 确保两位数
    // padStart(2, '0') 意思是：如果字符串长度不足2，在前面补'0'
    // 例如: 5 → '05', 12 → '12'
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');
    
    // 更新时间显示（使用模板字符串）
    timeDisplay.textContent = `${hoursStr}:${minutesStr}:${secondsStr}`;
    
    // 更新 AM/PM 显示
    periodDisplay.textContent = is24Hour ? '' : period;
    
    // 更新日期显示
    // 中文星期表示
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');  // 月份从 0 开始，要 +1
    const day = String(now.getDate()).padStart(2, '0');
    const weekday = weekdays[now.getDay()];
    
    dateDisplay.textContent = `${year}年${month}月${day}日 ${weekday}`;
    
    // 更新秒针进度条（让进度更平滑，加上毫秒）
    const secondsProgress = ((seconds + milliseconds / 1000) / 60) * 100;
    secondsBar.style.width = `${secondsProgress}%`;
}

/**
 * 启动时钟
 */
function startClock() {
    // 先更新一次，避免初始延迟
    updateClock();
    
    // setInterval 每隔指定时间执行一次函数
    // 1000 毫秒 = 1 秒
    timerId = setInterval(updateClock, 1000);
    
    // 更新按钮状态
    stopBtn.textContent = '暂停';
    stopBtn.classList.remove('stopped');
    isRunning = true;
}

/**
 * 暂停时钟
 */
function stopClock() {
    // clearInterval 停止定时器
    // 必须传入 setInterval 返回的 ID
    clearInterval(timerId);
    
    // 更新按钮状态
    stopBtn.textContent = '开始';
    stopBtn.classList.add('stopped');
    isRunning = false;
}

/**
 * 切换 12/24 小时制
 */
function toggleFormat() {
    is24Hour = !is24Hour;  // 切换布尔值
    updateClock();  // 立即更新显示
}

// --- 4. 事件监听 ---

// 切换格式按钮
formatBtn.addEventListener('click', toggleFormat);

// 暂停/开始按钮
stopBtn.addEventListener('click', () => {
    if (isRunning) {
        stopClock();
    } else {
        startClock();
    }
});

// --- 5. 初始化 ---
// 页面加载后立即启动时钟
startClock();

// --- 6. 扩展知识 ---
//
// Date 对象常用方法:
// .getFullYear()   - 四位年份 (如 2026)
// .getMonth()      - 月份 (0-11, 0是1月)
// .getDate()       - 日期 (1-31)
// .getDay()        - 星期 (0-6, 0是周日)
// .getHours()      - 小时 (0-23)
// .getMinutes()    - 分钟 (0-59)
// .getSeconds()    - 秒 (0-59)
//
// setInterval vs setTimeout:
// setInterval(fn, delay)  - 每隔 delay 毫秒重复执行 fn
// setTimeout(fn, delay)   - 只在 delay 毫秒后执行一次 fn
//
// 清理定时器（重要！）:
// clearInterval(id)       - 停止 setInterval
// clearTimeout(id)        - 取消 setTimeout
//
// 在 Console 中可以测试:
// new Date().toLocaleString('zh-CN')  // 中文格式化时间
// String(5).padStart(2, '0')          // '05'
