/**
 * ============================================
 * math.js - 数学工具模块
 * ============================================
 * 
 * 使用命名导出 (Named Exports) 导出多个函数
 * 导入时使用: import { add, multiply, factorial, fibonacci } from './math.js'
 */

/**
 * 加法运算
 * @param {number} a - 第一个数字
 * @param {number} b - 第二个数字
 * @returns {number} 两数之和
 */
export function add(a, b) {
    return a + b;
}

/**
 * 乘法运算
 * @param {number} a - 第一个数字
 * @param {number} b - 第二个数字
 * @returns {number} 两数之积
 */
export function multiply(a, b) {
    return a * b;
}

/**
 * 阶乘运算：n! = n * (n-1) * ... * 1
 * 使用递归实现
 * @param {number} n - 非负整数
 * @returns {number} n 的阶乘
 * @example factorial(5) => 120 (因为 5*4*3*2*1 = 120)
 */
export function factorial(n) {
    // 基础情况：0! = 1, 1! = 1
    if (n <= 1) return 1;
    // 递归情况：n! = n * (n-1)!
    return n * factorial(n - 1);
}

/**
 * 斐波那契数列第 n 项
 * 数列: 0, 1, 1, 2, 3, 5, 8, 13, 21, ...
 * 规则: F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)
 * @param {number} n - 非负整数，表示第几项
 * @returns {number} 斐波那契数列的第 n 项
 * @example fibonacci(6) => 8
 */
export function fibonacci(n) {
    // 基础情况
    if (n <= 0) return 0;
    if (n === 1) return 1;
    // 使用迭代避免递归的性能问题
    let prev = 0;  // F(n-2)
    let curr = 1;  // F(n-1)
    for (let i = 2; i <= n; i++) {
        const next = prev + curr;  // F(n) = F(n-1) + F(n-2)
        prev = curr;
        curr = next;
    }
    return curr;
}