// ==UserScript==
// @name         高级网页增强脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动展开评论、移除常见广告元素、添加深色模式切换按钮的综合油猴脚本
// @author       Learner
// @match        *://*.zhihu.com/*
// @match        *://*.weibo.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.github.com/*
// @match        *://localhost/*
// @match        *://127.0.0.1/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      api.example.com
// @run-at       document-end
// ==/UserScript==

/**
 * ============================================================================
 * 油猴脚本 (Tampermonkey Userscript) - 高级网页增强工具
 * ============================================================================
 *
 * 【脚本元数据说明】
 * @name         - 脚本名称，显示在 Tampermonkey 管理面板中
 * @namespace    - 命名空间，用于区分不同作者的脚本，通常使用网址格式
 * @version      - 脚本版本号，Tampermonkey 会根据此版本判断是否需要更新
 * @description  - 脚本功能描述，显示在管理面板中
 * @author       - 脚本作者
 * @match        - 指定脚本在哪些网页上运行，支持通配符 *
 *                 格式: @match <协议>://<域名>/<路径>
 *                 例如: @match *://*.example.com/* 匹配 example.com 所有子域名
 * @grant        - 声明脚本需要使用的 GM_* API 权限
 *                 GM_addStyle: 注入 CSS 样式
 *                 GM_getValue/GM_setValue: 持久化存储数据
 *                 GM_xmlhttpRequest: 跨域 HTTP 请求
 *                 GM_notification: 发送浏览器通知
 * @connect      - 允许 GM_xmlhttpRequest 连接的域名（安全限制）
 * @run-at       - 脚本注入时机
 *                 document-start: DOM 开始构建时（最早）
 *                 document-body: <body> 元素可用时
 *                 document-end: DOM 构建完成时（默认）
 *                 document-idle: DOMContentLoaded 事件之后
 *
 * 【常用 GM_* API 说明】
 * GM_addStyle(css)          - 向页面注入 CSS 样式
 * GM_getValue(key, default) - 从存储中获取值
 * GM_setValue(key, value)   - 将值存入存储（持久化）
 * GM_xmlhttpRequest(details)- 发送跨域 HTTP 请求
 * GM_notification(details)  - 显示桌面通知
 * GM_openInTab(url)         - 在新标签页打开 URL
 *
 * 【跨域注意事项】
 * 普通网页中的 fetch/XMLHttpRequest 受同源策略 (SOP) 限制，
 * 但 GM_xmlhttpRequest 可以突破此限制，实现跨域数据获取。
 * 使用 @connect 声明允许连接的域名是安全最佳实践。
 * ============================================================================
 */

(function () {
    'use strict'; // 严格模式：捕获更多潜在错误，禁止不安全操作

    // ========================================================================
    // 全局配置与状态
    // ========================================================================

    /**
     * 配置对象
     * 使用 GM_getValue/GM_setValue 持久化用户偏好设置
     */
    const CONFIG = {
        // 深色模式开关状态（从存储中读取，默认为 false）
        darkMode: GM_getValue('darkModeEnabled', false),
        // 广告移除开关（默认为 true）
        adRemoval: GM_getValue('adRemovalEnabled', true),
        // 自动展开评论开关（默认为 true）
        autoExpand: GM_getValue('autoExpandEnabled', true),
    };

    /**
     * MutationObserver 实例
     * 用于监听动态加载的内容（SPA 单页应用中非常常见）
     */
    let observer = null;

    // ========================================================================
    // 模块一：深色模式 (Dark Mode)
    // ========================================================================

    /**
     * 深色模式 CSS 样式
     * 使用 CSS 变量和选择器覆盖页面默认样式
     * 注意：这是一个简化版本，实际生产环境可能需要更精细的样式适配
     */
    const DARK_MODE_CSS = `
        /* 深色模式基础样式 */
        html.dark-mode,
        html.dark-mode body {
            background-color: #1a1a2e !important;
            color: #e0e0e0 !important;
        }

        /* 反转背景色为深色的元素 */
        html.dark-mode div,
        html.dark-mode section,
        html.dark-mode article,
        html.dark-mode main,
        html.dark-mode header,
        html.dark-mode footer,
        html.dark-mode nav,
        html.dark-mode aside {
            background-color: #16213e !important;
            color: #e0e0e0 !important;
        }

        /* 卡片/容器样式 */
        html.dark-mode .card,
        html.dark-mode .container,
        html.dark-mode .panel,
        html.dark-mode .box {
            background-color: #0f3460 !important;
            border-color: #533483 !important;
        }

        /* 链接颜色 */
        html.dark-mode a {
            color: #00d4ff !important;
        }

        html.dark-mode a:hover {
            color: #00b4d8 !important;
        }

        /* 输入框样式 */
        html.dark-mode input,
        html.dark-mode textarea,
        html.dark-mode select {
            background-color: #1a1a2e !important;
            color: #e0e0e0 !important;
            border-color: #533483 !important;
        }

        /* 表格样式 */
        html.dark-mode table {
            background-color: #16213e !important;
        }

        html.dark-mode th,
        html.dark-mode td {
            border-color: #533483 !important;
        }

        /* 代码块样式 */
        html.dark-mode pre,
        html.dark-mode code {
            background-color: #0d1117 !important;
            color: #c9d1d9 !important;
        }

        /* 滚动条样式（Webkit 浏览器） */
        html.dark-mode ::-webkit-scrollbar {
            width: 8px;
        }

        html.dark-mode ::-webkit-scrollbar-track {
            background: #1a1a2e;
        }

        html.dark-mode ::-webkit-scrollbar-thumb {
            background: #533483;
            border-radius: 4px;
        }
    `;

    /**
     * 深色模式样式 ID（用于后续移除）
     */
    let darkModeStyleId = 'tampermonkey-dark-mode-styles';

    /**
     * 启用深色模式
     * 1. 在 <html> 元素上添加 .dark-mode 类
     * 2. 使用 GM_addStyle 注入深色模式 CSS
     */
    function enableDarkMode() {
        document.documentElement.classList.add('dark-mode');
        GM_addStyle(DARK_MODE_CSS);
        CONFIG.darkMode = true;
        GM_setValue('darkModeEnabled', true);
        console.log('[用户脚本] 深色模式已启用');
    }

    /**
     * 禁用深色模式
     * 1. 移除 <html> 元素上的 .dark-mode 类
     * 2. 移除注入的 CSS 样式
     */
    function disableDarkMode() {
        document.documentElement.classList.remove('dark-mode');
        const styleEl = document.getElementById(darkModeStyleId);
        if (styleEl) {
            styleEl.remove();
        }
        CONFIG.darkMode = false;
        GM_setValue('darkModeEnabled', false);
        console.log('[用户脚本] 深色模式已禁用');
    }

    /**
     * 切换深色模式
     * 根据当前状态切换启用/禁用
     */
    function toggleDarkMode() {
        if (CONFIG.darkMode) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    }

    /**
     * 在页面中创建深色模式切换按钮
     * 固定在页面右下角，点击可切换深色模式
     */
    function createDarkModeToggle() {
        // 创建按钮元素
        const btn = document.createElement('button');
        btn.id = 'tm-dark-mode-toggle';
        btn.textContent = CONFIG.darkMode ? '☀️ 亮色' : '🌙 深色';
        btn.title = '点击切换深色/亮色模式';

        // 按钮样式（使用 GM_addStyle 注入，确保优先级）
        GM_addStyle(`
            #tm-dark-mode-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 999999;
                padding: 10px 16px;
                font-size: 14px;
                cursor: pointer;
                border: 2px solid #533483;
                border-radius: 24px;
                background-color: #16213e;
                color: #e0e0e0;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
                user-select: none;
            }

            #tm-dark-mode-toggle:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
            }

            #tm-dark-mode-toggle:active {
                transform: translateY(0);
            }
        `);

        // 点击事件：切换深色模式并更新按钮文本
        btn.addEventListener('click', () => {
            toggleDarkMode();
            btn.textContent = CONFIG.darkMode ? '☀️ 亮色' : '🌙 深色';
        });

        // 将按钮添加到页面
        document.body.appendChild(btn);
        console.log('[用户脚本] 深色模式切换按钮已创建');
    }

    // ========================================================================
    // 模块二：广告移除 (Ad Removal)
    // ========================================================================

    /**
     * 常见广告元素 CSS 选择器列表
     * 这些选择器覆盖了网页中常见的广告容器元素
     * 注意：不同网站的广告类名不同，这里列出的是通用模式
     */
    const AD_SELECTORS = [
        // 通用广告类名
        '.ad', '.ads', '.advert', '.advertisement',
        // 包含 "ad" 关键词的类名（使用通配符）
        '[class*="ad-"]', '[class*="-ad"]', '[class*="_ad"]', '[class*="ad_"]',
        // 赞助商内容
        '.sponsored', '.sponsor', '[class*="sponsored"]',
        // 推广/营销类
        '.promotion', '.promo', '.marketing', '[class*="promotion"]',
        // 弹窗广告
        '.popup-ad', '.modal-ad', '.overlay-ad',
        // 侧边栏广告
        '.sidebar-ad', '.right-rail-ad', '.left-rail-ad',
        // 信息流广告
        '.feed-ad', '.timeline-ad', '[data-ad]', '[data-ad-type]',
        // 浮动广告
        '.floating-ad', '.sticky-ad',
        // 视频贴片广告
        '.video-ad', '.pre-roll-ad',
        // 百度/ Google AdSense 相关
        '.adsbygoogle', '.baidu-union-ad',
    ];

    /**
     * 移除页面上的广告元素
     * 遍历所有广告选择器，查找并隐藏/移除匹配的元素
     */
    function removeAds() {
        if (!CONFIG.adRemoval) return;

        let removedCount = 0;

        AD_SELECTORS.forEach((selector) => {
            try {
                // 查找所有匹配的广告元素
                const elements = document.querySelectorAll(selector);
                elements.forEach((el) => {
                    // 使用 CSS 隐藏而非直接删除，避免破坏页面布局
                    el.style.display = 'none !important';
                    el.style.visibility = 'hidden';
                    el.style.opacity = '0';
                    // 也可以直接移除: el.remove();
                    removedCount++;
                });
            } catch (e) {
                // 某些选择器可能语法无效，捕获错误避免脚本崩溃
                console.warn(`[用户脚本] 广告选择器无效: ${selector}`, e);
            }
        });

        if (removedCount > 0) {
            console.log(`[用户脚本] 已隐藏 ${removedCount} 个广告元素`);
        }
    }

    /**
     * 注入广告移除 CSS 规则（更高效的方式）
     * 一次性隐藏所有已知广告选择器，比 JS 遍历更高效
     */
    function injectAdRemovalCSS() {
        if (!CONFIG.adRemoval) return;

        const adCSS = AD_SELECTORS.map((selector) =>
            `${selector} { display: none !important; visibility: hidden !important; }`
        ).join('\n');

        GM_addStyle(adCSS);
        console.log('[用户脚本] 广告移除 CSS 已注入');
    }

    // ========================================================================
    // 模块三：自动展开评论 (Auto-Expand Comments)
    // ========================================================================

    /**
     * 评论区域/展开按钮的 CSS 选择器
     * 不同网站有不同的评论展开机制，这里列出常见模式
     */
    const COMMENT_EXPAND_SELECTORS = [
        // "查看更多评论" / "加载更多" 按钮
        '.comment-expand', '.load-more-comments', '.show-more-comments',
        '.expand-comments', '.view-all-comments',
        // 折叠的评论
        '.collapsed-comment', '.comment-collapsed', '[class*="collapsed"]',
        // "展开全文" / "收起" 按钮
        '.expand', '.collapse', '.toggle-content',
        '[class*="expand"]', '[class*="show-more"]',
        // 知乎特定
        '.ContentItem-actions', '.RichContent .ContentItem-rightButton',
        // 微博特定
        '.card-act-main .WB_text_opt', '.list_box .list_li',
        // 通用 "阅读更多" 按钮
        '.read-more', '.show-full', '[class*="read-more"]',
    ];

    /**
     * 自动展开页面上的评论
     * 查找所有匹配"展开/加载更多"按钮的元素并模拟点击
     */
    function autoExpandComments() {
        if (!CONFIG.autoExpand) return;

        let expandedCount = 0;

        COMMENT_EXPAND_SELECTORS.forEach((selector) => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach((el) => {
                    // 检查元素是否可见（避免点击已隐藏的元素）
                    if (isElementVisible(el)) {
                        // 模拟点击展开评论
                        el.click();
                        expandedCount++;
                    }
                });
            } catch (e) {
                console.warn(`[用户脚本] 评论展开选择器无效: ${selector}`, e);
            }
        });

        if (expandedCount > 0) {
            console.log(`[用户脚本] 已展开 ${expandedCount} 个评论区域`);
        }
    }

    /**
     * 检查元素是否在页面上可见
     * @param {HTMLElement} el - 要检查的元素
     * @returns {boolean} 元素是否可见
     */
    function isElementVisible(el) {
        // 检查元素的显示状态
        const style = window.getComputedStyle(el);
        return (
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            el.offsetWidth > 0 && // 元素有宽度
            el.offsetHeight > 0   // 元素有高度
        );
    }

    // ========================================================================
    // 模块四：MutationObserver - 监听动态内容
    // ========================================================================

    /**
     * MutationObserver 配置说明：
     *
     * MutationObserver 是 Web API，用于监听 DOM 树的变化。
     * 在单页应用 (SPA) 中非常有用，因为内容是通过 AJAX/fetch
     * 动态加载的，页面加载时这些元素还不存在。
     *
     * 观察选项 (observerInit):
     * - childList:    观察目标节点的子节点新增/删除
     * - subtree:      扩展到观察所有后代节点（而不仅是直接子节点）
     * - attributes:   观察属性变化（如 class, style 等）
     * - characterData: 观察文本内容变化
     *
     * 性能提示：
     * - 尽量缩小观察范围（使用具体的容器元素而非整个 document.body）
     * - 只开启需要的观察选项，避免不必要的性能开销
     * - 使用防抖 (debounce) 处理高频回调
     */

    /**
     * 初始化 MutationObserver
     * 监听页面动态加载的内容变化，并在变化时重新执行增强功能
     */
    function initMutationObserver() {
        /**
         * 防抖函数 (Debounce)
         * 限制函数在指定延迟时间内只执行一次
         * 用于避免 MutationObserver 回调被频繁触发
         *
         * @param {Function} func - 需要防抖的函数
         * @param {number} wait - 延迟时间（毫秒）
         * @returns {Function} 防抖后的函数
         */
        function debounce(func, wait) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }

        /**
         * 重新应用所有增强功能
         * 当检测到 DOM 变化时调用
         */
        function reApplyEnhancements() {
            removeAds();
            autoExpandComments();
            // 深色模式不需要重新应用，CSS 会自动作用于新元素
        }

        // 创建防抖版本的重新应用函数（300ms 延迟）
        const debouncedReApply = debounce(reApplyEnhancements, 300);

        /**
         * MutationObserver 回调函数
         * 每当检测到 DOM 变化时触发
         *
         * @param {MutationRecord[]} mutations - 变化记录数组
         * @param {MutationObserver} observer - Observer 实例本身
         */
        const callback = (mutations, observer) => {
            // 检查是否有我们关心的变化
            const hasRelevantMutation = mutations.some((mutation) => {
                // 子节点变化（新增/删除元素）
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    return true;
                }
                // 属性变化（例如 class 改变）
                if (mutation.type === 'attributes') {
                    return true;
                }
                return false;
            });

            if (hasRelevantMutation) {
                // 检测到相关变化，重新应用增强功能
                debouncedReApply();
            }
        };

        // 创建 MutationObserver 实例
        observer = new MutationObserver(callback);

        // 开始观察整个 document.body
        // 注意：在 document-end 时 body 已经存在
        observer.observe(document.body, {
            childList: true,    // 观察子节点变化
            subtree: true,      // 观察所有后代节点
            attributes: true,   // 观察属性变化
            attributeFilter: ['class', 'style'], // 只观察 class 和 style 属性变化（性能优化）
        });

        console.log('[用户脚本] MutationObserver 已启动，正在监听动态内容变化');
    }

    /**
     * 断开 MutationObserver
     * 停止监听 DOM 变化（清理用）
     */
    function disconnectObserver() {
        if (observer) {
            observer.disconnect();
            observer = null;
            console.log('[用户脚本] MutationObserver 已断开');
        }
    }

    // ========================================================================
    // 模块五：跨域请求示例 (GM_xmlhttpRequest)
    // ========================================================================

    /**
     * 使用 GM_xmlhttpRequest 进行跨域请求
     *
     * 普通的 fetch/XMLHttpRequest 受浏览器同源策略 (Same-Origin Policy) 限制，
     * 无法向不同域名发送请求。GM_xmlhttpRequest 是 Tampermonkey 提供的 API，
     * 可以绕过此限制，实现真正的跨域数据获取。
     *
     * 使用场景：
     * - 从第三方 API 获取数据
     * - 将数据发送到自己的后端服务
     * - 跨域爬取网页内容
     *
     * 注意：
     * - 必须在脚本元数据中使用 @connect 声明允许连接的域名
     * - 这既是安全机制，也是 Tampermonkey 的权限声明
     */
    function exampleCrossOriginRequest() {
        // 示例：向 API 发送 GET 请求
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.example.com/data', // 必须在 @connect 中声明
            headers: {
                'User-Agent': 'Tampermonkey Userscript',
                'Accept': 'application/json',
            },
            /**
             * 请求成功回调
             * @param {Object} response - 响应对象
             */
            onload: (response) => {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        console.log('[用户脚本] 跨域请求成功:', data);
                        GM_notification({
                            title: '用户脚本',
                            text: '数据获取成功！',
                            timeout: 3000,
                        });
                    } catch (e) {
                        console.error('[用户脚本] JSON 解析失败:', e);
                    }
                } else {
                    console.error(`[用户脚本] 请求失败，状态码: ${response.status}`);
                }
            },
            /**
             * 请求失败回调
             * @param {Object} error - 错误对象
             */
            onerror: (error) => {
                console.error('[用户脚本] 跨域请求出错:', error);
                GM_notification({
                    title: '用户脚本',
                    text: '数据获取失败，请检查网络',
                    timeout: 5000,
                });
            },
        });
    }

    // ========================================================================
    // 模块六：数据持久化 (GM_getValue / GM_setValue)
    // ========================================================================

    /**
     * 用户偏好设置面板
     * 创建一个浮动面板，让用户可以切换各项功能的开关
     * 设置会自动保存到 Tampermonkey 的存储中
     */
    function createSettingsPanel() {
        GM_addStyle(`
            #tm-settings-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999998;
                background-color: #fff;
                border: 2px solid #ccc;
                border-radius: 8px;
                padding: 16px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                min-width: 220px;
            }

            html.dark-mode #tm-settings-panel {
                background-color: #16213e;
                border-color: #533483;
                color: #e0e0e0;
            }

            #tm-settings-panel h3 {
                margin: 0 0 12px 0;
                font-size: 16px;
                border-bottom: 1px solid #eee;
                padding-bottom: 8px;
            }

            #tm-settings-panel .setting-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }

            #tm-settings-panel label {
                cursor: pointer;
            }

            #tm-settings-panel input[type="checkbox"] {
                width: 18px;
                height: 18px;
                cursor: pointer;
            }

            #tm-toggle-settings {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999997;
                padding: 8px 12px;
                cursor: pointer;
                border: 1px solid #ccc;
                border-radius: 4px;
                background: #f0f0f0;
            }

            html.dark-mode #tm-toggle-settings {
                background: #16213e;
                border-color: #533483;
                color: #e0e0e0;
            }
        `);

        // 创建设置面板的 HTML
        const panel = document.createElement('div');
        panel.id = 'tm-settings-panel';
        panel.style.display = 'none'; // 默认隐藏
        panel.innerHTML = `
            <h3>⚙️ 用户脚本设置</h3>
            <div class="setting-item">
                <label for="tm-setting-darkmode">深色模式</label>
                <input type="checkbox" id="tm-setting-darkmode" ${CONFIG.darkMode ? 'checked' : ''}>
            </div>
            <div class="setting-item">
                <label for="tm-setting-ads">移除广告</label>
                <input type="checkbox" id="tm-setting-ads" ${CONFIG.adRemoval ? 'checked' : ''}>
            </div>
            <div class="setting-item">
                <label for="tm-setting-expand">自动展开评论</label>
                <input type="checkbox" id="tm-setting-expand" ${CONFIG.autoExpand ? 'checked' : ''}>
            </div>
        `;

        // 切换面板显示的按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'tm-toggle-settings';
        toggleBtn.textContent = '⚙️';
        toggleBtn.title = '打开/关闭设置面板';
        toggleBtn.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        // 绑定设置变更事件
        panel.querySelector('#tm-setting-darkmode').addEventListener('change', (e) => {
            CONFIG.darkMode = e.target.checked;
            GM_setValue('darkModeEnabled', e.target.checked);
            if (e.target.checked) enableDarkMode(); else disableDarkMode();
        });

        panel.querySelector('#tm-setting-ads').addEventListener('change', (e) => {
            CONFIG.adRemoval = e.target.checked;
            GM_setValue('adRemovalEnabled', e.target.checked);
            if (e.target.checked) injectAdRemovalCSS(); else location.reload();
        });

        panel.querySelector('#tm-setting-expand').addEventListener('change', (e) => {
            CONFIG.autoExpand = e.target.checked;
            GM_setValue('autoExpandEnabled', e.target.checked);
        });

        document.body.appendChild(panel);
        document.body.appendChild(toggleBtn);
        console.log('[用户脚本] 设置面板已创建');
    }

    // ========================================================================
    // 脚本初始化与入口
    // ========================================================================

    /**
     * 初始化函数
     * 页面加载完成后依次调用各模块的初始化方法
     */
    function init() {
        console.log('[用户脚本] ===== 脚本初始化开始 =====');

        // 等待 body 元素可用（某些脚本在 document-end 时 body 可能还未完全加载）
        const waitForBody = setInterval(() => {
            if (document.body) {
                clearInterval(waitForBody);

                // 1. 应用深色模式（如果之前已启用）
                if (CONFIG.darkMode) {
                    enableDarkMode();
                }

                // 2. 注入广告移除 CSS
                injectAdRemovalCSS();

                // 3. 立即执行一次广告移除
                removeAds();

                // 4. 立即执行一次评论展开
                autoExpandComments();

                // 5. 创建深色模式切换按钮
                createDarkModeToggle();

                // 6. 创建设置面板
                createSettingsPanel();

                // 7. 启动 MutationObserver 监听动态内容
                initMutationObserver();

                console.log('[用户脚本] ===== 脚本初始化完成 =====');
            }
        }, 50);
    }

    // 启动脚本
    init();

    /**
     * 清理函数（可选）
     * 在页面卸载时断开 Observer，避免内存泄漏
     */
    window.addEventListener('beforeunload', () => {
        disconnectObserver();
    });

})();
