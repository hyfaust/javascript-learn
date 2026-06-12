/**
 * ==========================================
 * 工具函数模块 - utils.js
 * ==========================================
 * 
 * 提供命令行工具所需的辅助函数：
 * - 彩色终端输出
 * - 文件大小格式化
 * - 日期时间格式化
 */

// ==========================================
// 终端颜色代码 - ANSI 转义序列
// ==========================================

/**
 * ANSI 转义序列用于在终端中输出彩色文本
 * 格式: \x1b[<代码>m
 * 
 * 常用颜色代码：
 * 30-37: 前景色（文字颜色）
 * 40-47: 背景色
 * 0: 重置
 * 1: 加粗
 */
const colors = {
    reset: '\x1b[0m',       // 重置所有样式
    bold: '\x1b[1m',        // 加粗
    dim: '\x1b[2m',         // 变暗
    underline: '\x1b[4m',   // 下划线

    // 前景色（文字颜色）
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',

    // 背景色
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
};

/**
 * 给字符串添加颜色
 * @param {string} text - 要着色的文本
 * @param {string} color - 颜色名称（如 'red', 'green'）
 * @param {string} bgColor - 可选的背景色名称
 * @returns {string} 带颜色的字符串
 * 
 * @example
 * colorize('错误!', 'red')           // 红色文字
 * colorize('成功', 'white', 'green') // 绿底白字
 */
function colorize(text, color, bgColor = null) {
    let result = '';
    // 添加前景色
    if (colors[color]) {
        result += colors[color];
    }
    // 添加背景色
    if (bgColor && colors[bgColor]) {
        result += colors[bgColor];
    }
    // 添加文本和重置代码
    result += text + colors.reset;
    return result;
}

/**
 * 输出带颜色的信息行
 * @param {string} message - 消息内容
 * @param {string} color - 颜色
 */
function log(message, color = 'white') {
    console.log(colorize(message, color));
}

/**
 * 输出成功消息（绿色）
 * @param {string} message - 消息内容
 */
function logSuccess(message) {
    console.log(colorize(` ✓ ${message}`, 'green'));
}

/**
 * 输出错误消息（红色）
 * @param {string} message - 消息内容
 */
function logError(message) {
    console.error(colorize(` ✗ ${message}`, 'red'));
}

/**
 * 输出警告消息（黄色）
 * @param {string} message - 消息内容
 */
function logWarning(message) {
    console.log(colorize(` ⚠ ${message}`, 'yellow'));
}

/**
 * 输出信息消息（蓝色）
 * @param {string} message - 消息内容
 */
function logInfo(message) {
    console.log(colorize(` ℹ ${message}`, 'blue'));
}

// ==========================================
// 文件大小格式化
// ==========================================

/**
 * 将字节数转换为人类可读的文件大小格式
 * 
 * 单位换算关系：
 * 1 KB = 1024 Bytes
 * 1 MB = 1024 KB
 * 1 GB = 1024 MB
 * 
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小字符串（如 "1.5 MB"）
 * 
 * @example
 * formatFileSize(500)        // "500 B"
 * formatFileSize(1024)       // "1.0 KB"
 * formatFileSize(1536000)    // "1.46 MB"
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    if (bytes < 0) return '-' + formatFileSize(-bytes); // 处理负数

    // 单位数组
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];

    // 计算应该使用哪个单位
    // Math.floor(Math.log(bytes) / Math.log(1024)) 计算出单位索引
    const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));

    // 将字节数转换为对应单位的值
    const value = bytes / Math.pow(1024, unitIndex);

    // 保留两位小数，但 B 单位不需要小数
    if (unitIndex === 0) {
        return `${value} ${units[unitIndex]}`;
    }
    return `${value.toFixed(2)} ${units[unitIndex]}`;
}

// ==========================================
// 日期时间格式化
// ==========================================

/**
 * 将 Date 对象格式化为可读的日期时间字符串
 * 
 * @param {Date} date - 日期对象（默认为当前时间）
 * @param {string} format - 格式模板
 *   占位符：
 *   - YYYY: 四位年份
 *   - MM: 两位月份
 *   - DD: 两位日期
 *   - HH: 两位小时（24小时制）
 *   - mm: 两位分钟
 *   - ss: 两位秒
 * 
 * @returns {string} 格式化后的日期字符串
 * 
 * @example
 * formatDate(new Date())                        // "2024-01-15 14:30:00"
 * formatDate(new Date(), 'YYYY/MM/DD')          // "2024/01/15"
 * formatDate(new Date(), 'DD-MM-YYYY HH:mm')    // "15-01-2024 14:30"
 */
function formatDate(date = new Date(), format = 'YYYY-MM-DD HH:mm:ss') {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;  // getMonth() 返回 0-11，需加1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // 辅助函数：补齐前导零
    const pad = (num) => num.toString().padStart(2, '0');

    return format
        .replace('YYYY', year.toString())
        .replace('MM', pad(month))
        .replace('DD', pad(day))
        .replace('HH', pad(hours))
        .replace('mm', pad(minutes))
        .replace('ss', pad(seconds));
}

/**
 * 将文件修改时间戳格式化为易读字符串
 * @param {number|string} timestamp - Unix 时间戳（毫秒或秒）
 * @returns {string} 格式化后的日期字符串
 */
function formatFileDate(timestamp) {
    // 如果时间戳是秒级（10位数字），转换为毫秒
    const ms = String(timestamp).length === 10 ? timestamp * 1000 : timestamp;
    return formatDate(new Date(ms));
}

// ==========================================
// 表格输出辅助函数
// ==========================================

/**
 * 在终端输出对齐的表格数据
 * @param {string[][]} rows - 二维数组，每行是一个字符串数组
 * @param {number[]} colWidths - 每列的宽度
 */
function printTable(rows, colWidths) {
    rows.forEach(row => {
        let line = '';
        row.forEach((cell, i) => {
            // 右填充到指定宽度
            const padded = cell.padEnd(colWidths[i]);
            // 移除 ANSI 颜色代码对长度的影响（简化处理）
            line += padded + '  ';
        });
        console.log(line);
    });
}

// ==========================================
// 导出所有工具函数
// ==========================================
module.exports = {
    // 颜色相关
    colors,
    colorize,
    log,
    logSuccess,
    logError,
    logWarning,
    logInfo,

    // 格式化相关
    formatFileSize,
    formatDate,
    formatFileDate,

    // 表格输出
    printTable
};
