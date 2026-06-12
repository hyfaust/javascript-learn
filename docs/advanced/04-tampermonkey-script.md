# 项目 04：油猴脚本 (Tampermonkey Userscript)

## 项目目标

本项目演示如何编写一个功能完整的 Tampermonkey 用户脚本，实现以下功能：

1. **自动展开评论** - 自动点击页面上的"展开/加载更多评论"按钮
2. **移除广告元素** - 隐藏页面上常见的广告容器
3. **深色模式切换** - 添加一个浮动按钮，一键切换深色/亮色模式
4. **动态内容监听** - 使用 MutationObserver 处理 SPA 应用中动态加载的内容
5. **用户设置持久化** - 使用 GM_getValue/GM_setValue 保存用户偏好

## 什么是 Tampermonkey？

Tampermonkey（油猴）是一款流行的浏览器扩展，允许用户安装和运行"用户脚本" (Userscripts)。用户脚本是一段 JavaScript 代码，可以在网页加载时自动运行，从而修改页面内容、添加新功能或自动化操作。

### 安装 Tampermonkey

| 浏览器 | 安装地址 |
|--------|----------|
| Chrome | [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| Firefox | [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/tampermonkey/) |
| Edge | [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) |
| Safari | [Mac App Store](https://apps.apple.com/app/tampermonkey/id1482490089) |

安装完成后，浏览器工具栏会出现 Tampermonkey 图标（黑色方块中有两个眼睛）。

## 用户脚本元数据说明

脚本顶部的 `==UserScript==` 注释块是 Tampermonkey 的配置区域，每一项都有特定含义：

```javascript
// ==UserScript==
// @name         高级网页增强脚本        ← 脚本名称
// @namespace    http://tampermonkey.net/ ← 命名空间（区分作者）
// @version      1.0.0                   ← 版本号
// @description  功能描述                 ← 脚本说明
// @author       Learner                 ← 作者
// @match        *://*.zhihu.com/*       ← 匹配网址（支持通配符）
// @grant        GM_addStyle             ← 申请 API 权限
// @run-at       document-end            ← 注入时机
// ==/UserScript==
```

### @match 匹配规则

| 模式 | 说明 | 示例 |
|------|------|------|
| `*://example.com/*` | 匹配 example.com 所有页面 | http/https 均可 |
| `*://*.example.com/*` | 匹配所有子域名 | www.example.com, api.example.com |
| `https://example.com/path/*` | 匹配特定路径 | 仅 /path/ 下的页面 |

### @run-at 注入时机

| 值 | 时机 | 适用场景 |
|----|------|----------|
| `document-start` | DOM 开始构建 | 需要在页面加载前修改内容 |
| `document-body` | `<body>` 可用 | 需要操作 body 元素 |
| `document-end` | DOM 构建完成（默认） | 大多数情况使用此值 |
| `document-idle` | DOMContentLoaded 之后 | 需要等待所有脚本加载完 |

## DOM 操作技术要点

### 1. 元素选择与修改

```javascript
// 使用 CSS 选择器查找元素
const elements = document.querySelectorAll('.ad');

// 隐藏元素（推荐：不破坏布局）
el.style.display = 'none';

// 直接移除元素（可能影响布局）
el.remove();
```

### 2. 注入 CSS 样式

```javascript
// 使用 GM_addStyle（油猴 API，优先级高）
GM_addStyle(`
    .my-class { color: red !important; }
`);

// 或者创建 <style> 元素
const style = document.createElement('style');
style.textContent = '.my-class { color: red; }';
document.head.appendChild(style);
```

### 3. 创建和操作元素

```javascript
// 创建元素
const btn = document.createElement('button');
btn.textContent = '点击我';
btn.addEventListener('click', () => alert('Hello!'));

// 添加到页面
document.body.appendChild(btn);
```

## MutationObserver 使用指南

### 什么是 MutationObserver？

`MutationObserver` 是浏览器提供的 Web API，用于监听 DOM 树的变化。在单页应用 (SPA) 中非常关键，因为内容是通过 AJAX/fetch 动态加载的，页面初始加载时这些元素还不存在。

### 基本用法

```javascript
// 1. 创建回调函数
const callback = (mutations, observer) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            console.log('子节点发生变化:', mutation.addedNodes);
        }
    });
};

// 2. 创建 Observer 实例
const observer = new MutationObserver(callback);

// 3. 开始观察
observer.observe(document.body, {
    childList: true,    // 观察子节点增删
    subtree: true,      // 观察所有后代节点
    attributes: true,   // 观察属性变化
    characterData: true // 观察文本变化
});

// 4. 停止观察（清理用）
observer.disconnect();
```

### 观察选项详解

| 选项 | 说明 | 性能影响 |
|------|------|----------|
| `childList` | 子节点新增/删除 | 低 |
| `subtree` | 扩展到所有后代 | 中~高（范围越大越慢） |
| `attributes` | 属性变化（class, style 等） | 低 |
| `characterData` | 文本节点内容变化 | 低 |

### 性能优化建议

```javascript
// 技巧 1：使用 attributeFilter 只观察特定属性
observer.observe(target, {
    attributes: true,
    attributeFilter: ['class', 'style'] // 只观察 class 和 style
});

// 技巧 2：使用防抖 (debounce) 避免频繁回调
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedHandler = debounce(handleDOMChange, 300);
```

## 常见模式与陷阱

### 模式 1：IIFE 包裹（避免全局污染）

```javascript
(function() {
    'use strict';
    // 你的代码...
})();
```

### 模式 2：等待元素可用

```javascript
// 在脚本运行前等待 body 存在
const waitForBody = setInterval(() => {
    if (document.body) {
        clearInterval(waitForBody);
        init();
    }
}, 50);
```

### 陷阱 1：选择器在脚本运行时还不存在

SPA 应用中，元素是动态加载的。解决方法：
- 使用 MutationObserver 监听动态内容
- 或者使用 `setInterval` 轮询查找

### 陷阱 2：CSS 优先级不够

使用 `!important` 或 `GM_addStyle`（其注入的样式优先级高于页面自带样式）。

### 陷阱 3：跨域请求失败

普通 `fetch` 受同源策略限制。解决方法：
- 使用 `GM_xmlhttpRequest` API
- 在 `@connect` 中声明允许的域名

## 如何测试和调试

### 安装脚本

1. 打开 Tampermonkey 管理面板
2. 点击 "创建新脚本"
3. 将 `user-script.js` 的内容粘贴进去
4. 按 `Ctrl+S` 保存
5. 打开匹配的网页（如 zhihu.com），脚本自动运行

### 调试方法

| 方法 | 操作 |
|------|------|
| 控制台日志 | 打开浏览器 DevTools (F12) → Console，查看 `console.log` 输出 |
| 断点调试 | DevTools → Sources → 找到 Tampermonkey 脚本 → 设置断点 |
| 实时编辑 | DevTools → Sources → Tampermonkey → 直接编辑并保存 |

### 常见问题排查

```
问题：脚本没有运行
解决：检查 @match 网址是否匹配当前页面

问题：元素找不到
解决：检查选择器是否正确，使用 DevTools Elements 面板验证

问题：CSS 没有生效
解决：使用 !important 或 GM_addStyle 提高优先级

问题：跨域请求报错
解决：检查 @connect 是否声明了目标域名
```

## 挑战任务

### 🟢 简单：添加页面字数统计

在页面右上角添加一个浮动面板，实时显示当前页面的文字数量（不含 HTML 标签）。

**提示**：
- 使用 `document.body.innerText.length` 获取纯文本字数
- 使用 `setInterval` 或 MutationObserver 实时更新

### 🟡 中等：图片懒加载增强

修改页面上的 `<img>` 元素，为所有不在可视区域内的图片添加懒加载功能（使用 `loading="lazy"` 属性或 IntersectionObserver API）。

**提示**：
- 遍历所有 `<img>` 元素
- 检查元素是否在视口中：`el.getBoundingClientRect()`
- 使用 IntersectionObserver 实现更精确的懒加载

### 🔴 困难：自动表单填充器

编写一个功能，检测页面上的表单元素（`<input>`, `<select>`, `<textarea>`），并根据 `name`/`id`/`placeholder` 属性自动填充合理的值。

**要求**：
- 支持常见字段：姓名、邮箱、电话、地址等
- 提供一个浮动按钮触发自动填充
- 使用 `GM_getValue/GM_setValue` 保存用户自定义的填充模板

**提示**：
- 查找表单元素：`document.querySelectorAll('input, select, textarea')`
- 根据字段类型映射值：
  ```javascript
  const fieldMap = {
      'email': 'user@example.com',
      'name': '张三',
      'phone': '13800138000',
  };
  ```
