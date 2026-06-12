/**
 * ============================================
 * config.js - 应用配置模块
 * ============================================
 * 
 * 使用默认导出 (Default Export) 导出配置对象
 * 每个模块只能有一个默认导出
 * 导入时使用: import config from './config.js'
 * 注意：导入时可以自定义变量名
 */

/**
 * 应用配置对象
 * 包含全局设置和常量
 */
const config = {
    // 应用基本信息
    appName: "ES 模块学习",
    version: "1.0.0",
    author: "学习者",
    
    // 界面设置
    theme: "dark",        // 主题: "dark" | "light"
    lang: "zh-CN",        // 语言: "zh-CN" | "en-US"
    fontSize: 16,         // 默认字体大小（像素）
    
    // 功能开关
    features: {
        darkMode: true,   // 暗色模式
        notifications: true,  // 通知
        analytics: false  // 分析
    },
    
    // API 设置
    api: {
        baseUrl: "https://api.example.com",
        timeout: 5000,    // 请求超时时间（毫秒）
        retries: 3        // 重试次数
    }
};

// 【默认导出】每个模块只能有一个 export default
export default config;