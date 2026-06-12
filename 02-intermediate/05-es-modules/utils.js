/**
 * ============================================
 * utils.js - 通用工具函数模块
 * ============================================
 * 
 * 使用命名导出 (Named Exports) 导出多个实用函数
 * 导入时使用: import { formatDate, generateId, debounce } from './utils.js'
 */

/**
 * 日期格式化函数
 * 将 Date 对象格式化为指定格式的字符串
 * 
 * 支持的格式占位符：
 * - YYYY: 四位年份
 * - MM: 两位月份 (01-12)
 * - DD: 两位日期 (01-31)
 * - HH: 两位小时 (00-23)
 * - mm: 两位分钟 (00-59)
 * - ss: 两位秒数 (00-59)
 * 
 * @param {Date} date - 要格式化的日期对象
 * @param {string} format - 格式字符串，默认 "YYYY-MM-DD HH:mm:ss"
 * @returns {string} 格式化后的日期字符串
 * 
 * @example
 * formatDate(new Date(2024, 0, 15, 14, 30, 0), "YYYY-MM-DD")
 * // => "2024-01-15"
 * 
 * @example
 * formatDate(new Date(), "YYYY年MM月DD日 HH:mm")
 * // => "2024年01月15日 14:30"
 */
export function formatDate(date, format = "YYYY-MM-DD HH:mm:ss") {
    // 获取日期各部分数值
    const year = date.getFullYear();       // 四位年份: 2024
    const month = date.getMonth() + 1;     // 月份 (0-11)，需要 +1
    const day = date.getDate();            // 日期 (1-31)
    const hours = date.getHours();         // 小时 (0-23)
    const minutes = date.getMinutes();     // 分钟 (0-59)
    const seconds = date.getSeconds();     // 秒数 (0-59)
    
    // 替换格式字符串中的占位符
    return format
        .replace("YYYY", year)
        .replace("MM", String(month).padStart(2, "0"))   // padStart 补零
        .replace("DD", String(day).padStart(2, "0"))
        .replace("HH", String(hours).padStart(2, "0"))
        .replace("mm", String(minutes).padStart(2, "0"))
        .replace("ss", String(seconds).padStart(2, "0"));
}

/**
 * 生成简短的唯一标识符
 * 使用随机字符和数字组合生成长度为 6 的 ID
 * 适用于前端临时 ID 生成（不适用于安全场景）
 * 
 * @param {number} length - ID 长度，默认 6
 * @returns {string} 随机生成的 ID 字符串
 * 
 * @example
 * generateId();   // => "a3f9k2" (随机)
 * generateId(8);  // => "x7m2p4q1" (随机)
 */
export function generateId(length = 6) {
    // 可用字符集：小写字母 + 数字
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    
    // 随机选择字符拼接
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
}

/**
 * 防抖函数 (Debounce)
 * 创建一个防抖版本的函数，在连续调用时延迟执行
 * 只有当调用停止指定时间后，才会真正执行原函数
 * 
 * 适用场景：
 * - 搜索框输入（避免每次按键都发请求）
 * - 窗口 resize 事件（避免频繁计算）
 * - 按钮点击（避免重复提交）
 * 
 * @param {Function} func - 要防抖的原始函数
 * @param {number} wait - 等待时间（毫秒），默认 300ms
 * @returns {Function} 防抖后的新函数
 * 
 * @example
 * const debouncedSearch = debounce(searchApi, 500);
 * // 快速调用 10 次，只会执行最后一次
 * debouncedSearch("a");
 * debouncedSearch("ab");
 * debouncedSearch("abc");  // 只有这次会在 500ms 后执行
 */
export function debounce(func, wait = 300) {
    // 闭包保存定时器 ID
    let timeoutId = null;
    
    // 返回新的防抖函数
    return function (...args) {
        // 每次调用都清除之前的定时器
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        
        // 设置新的定时器，等待指定时间后执行
        timeoutId = setTimeout(() => {
            // 使用 apply 确保 this 和参数正确
            func.apply(this, args);
            timeoutId = null;
        }, wait);
    };
}