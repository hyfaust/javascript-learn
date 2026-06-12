/**
 * ==========================================
 * Markdown 编辑器 - 主脚本 script.js
 * ==========================================
 * 
 * 功能：
 * - 简易 Markdown 解析器（转换为 HTML）
 * - 实时预览（带防抖）
 * - 工具栏按钮插入 Markdown 语法
 * - LocalStorage 自动保存/加载
 * - 导出为 HTML 文件
 * 
 * 核心技术：
 * 1. 字符串解析与正则表达式
 * 2. 防抖（Debounce）优化性能
 * 3. LocalStorage 数据持久化
 * 4. DOM 操作与事件处理
 */

// ==========================================
// DOM 元素获取
// ==========================================

// 获取编辑器 textarea 元素
const editor = document.getElementById('editor');

// 获取预览 div 元素
const preview = document.getElementById('preview');

// 获取拖拽分隔条
const resizer = document.getElementById('resizer');

// 获取编辑器窗格和预览窗格
const editorPane = document.querySelector('.editor-pane');
const previewPane = document.querySelector('.preview-pane');

// 获取保存状态指示器
const saveStatus = document.getElementById('saveStatus');

// 获取导出和清空按钮
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');

// ==========================================
// Markdown 解析器
// ==========================================

/**
 * 简易 Markdown 解析器
 * 将 Markdown 格式文本转换为 HTML
 * 
 * 支持的语法：
 * - 标题: # H1, ## H2, ### H3
 * - 粗体: **text** 或 __text__
 * - 斜体: *text* 或 _text_
 * - 删除线: ~~text~~
 * - 行内代码: `code`
 * - 代码块: ```code```
 * - 引用: > text
 * - 无序列表: - item
 * - 有序列表: 1. item
 * - 链接: [text](url)
 * - 图片: ![alt](url)
 * - 水平分割线: ---
 * 
 * @param {string} markdown - Markdown 格式文本
 * @returns {string} HTML 格式文本
 */
function parseMarkdown(markdown) {
    // --- 步骤 0：预处理 ---
    // 将 Windows 风格的换行符 \r\n 统一为 \n
    // 将制表符 \t 转换为空格
    let text = markdown.replace(/\r\n/g, '\n').replace(/\t/g, '  ');

    // --- 步骤 1：提取代码块 ---
    // 代码块内部不应解析其他 Markdown 语法
    // 使用占位符暂时替换，最后再恢复
    const codeBlocks = [];
    text = text.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        // 转义 HTML 特殊字符（防止 XSS）
        const escaped = escapeHtml(code.trim());
        const langClass = lang ? ` class="language-${lang}"` : '';
        // 存储完整的代码块 HTML
        codeBlocks.push(`<pre><code${langClass}>${escaped}</code></pre>`);
        // 用唯一占位符替换
        return `%%CODEBLOCK_${codeBlocks.length - 1}%%`;
    });

    // --- 步骤 2：按行处理 ---
    // 将文本按行分割
    const lines = text.split('\n');
    let html = '';
    let inList = false;       // 是否在无序列表中
    let inOrderedList = false; // 是否在有序列表中
    let inBlockquote = false;  // 是否在引用块中

    /**
     * 关闭所有打开的块级元素
     * 在切换块类型或处理结束时调用
     */
    function closeOpenBlocks() {
        if (inList) {
            html += '</ul>';
            inList = false;
        }
        if (inOrderedList) {
            html += '</ol>';
            inOrderedList = false;
        }
        if (inBlockquote) {
            html += '</blockquote>';
            inBlockquote = false;
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // --- 处理代码块占位符 ---
        if (line.startsWith('%%CODEBLOCK_')) {
            closeOpenBlocks();
            const index = parseInt(line.match(/%%CODEBLOCK_(\d+)%%/)[1]);
            html += codeBlocks[index] + '\n';
            continue;
        }

        // --- 处理水平分割线 ---
        // 匹配: ---, ***, ___ （至少三个连续字符）
        if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
            closeOpenBlocks();
            html += '<hr>\n';
            continue;
        }

        // --- 处理标题 ---
        // 匹配: # H1, ## H2, ### H3
        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
            closeOpenBlocks();
            const level = headingMatch[1].length; // # 的数量即标题级别
            const content = parseInline(headingMatch[2]); // 行内元素仍需解析
            html += `<h${level}>${content}</h${level}>\n`;
            continue;
        }

        // --- 处理引用 ---
        if (line.startsWith('> ')) {
            if (!inBlockquote) {
                closeOpenBlocks();
                html += '<blockquote>';
                inBlockquote = true;
            }
            const content = parseInline(line.slice(2)); // 移除 '> ' 前缀
            html += `<p>${content}</p>`;
            continue;
        } else {
            closeOpenBlocks(); // 如果上一行是引用，现在关闭
        }

        // --- 处理无序列表 ---
        if (/^[-*+]\s+/.test(line)) {
            if (!inList) {
                closeOpenBlocks();
                html += '<ul>';
                inList = true;
            }
            // 移除列表标记并解析行内元素
            const content = parseInline(line.replace(/^[-*+]\s+/, ''));
            html += `<li>${content}</li>`;
            continue;
        } else {
            closeOpenBlocks(); // 如果上一行是列表，现在关闭
        }

        // --- 处理有序列表 ---
        const olMatch = line.match(/^\d+\.\s+(.+)$/);
        if (olMatch) {
            if (!inOrderedList) {
                closeOpenBlocks();
                html += '<ol>';
                inOrderedList = true;
            }
            const content = parseInline(olMatch[1]);
            html += `<li>${content}</li>`;
            continue;
        } else {
            closeOpenBlocks();
        }

        // --- 处理空行 ---
        if (line.trim() === '') {
            continue; // 跳过空行
        }

        // --- 处理普通段落 ---
        const content = parseInline(line);
        html += `<p>${content}</p>\n`;
    }

    // 确保所有块级元素都已关闭
    closeOpenBlocks();

    return html;
}

/**
 * 解析行内 Markdown 元素
 * 处理粗体、斜体、代码、链接、图片等
 * 
 * @param {string} text - 行内文本
 * @returns {string} 转换后的 HTML
 */
function parseInline(text) {
    // --- 转义 HTML 特殊字符 ---
    // 防止原始 HTML 被直接渲染（安全防护）
    // 注意：必须在解析 Markdown 语法之前转义
    // 但链接和图片中的 URL 不应被转义
    text = escapeHtml(text);

    // --- 行内代码 ---
    // 匹配: `code`
    // 注意：必须在粗体/斜体之前处理，避免冲突
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // --- 图片 ---
    // 匹配: ![alt](url)
    // 注意：必须在链接之前处理，因为图片语法包含链接
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    // --- 链接 ---
    // 匹配: [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // --- 粗体 ---
    // 匹配: **text** 或 __text__
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // --- 斜体 ---
    // 匹配: *text* 或 _text_
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.+?)_/g, '<em>$1</em>');

    // --- 删除线 ---
    // 匹配: ~~text~~
    text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');

    return text;
}

/**
 * HTML 转义函数
 * 将 HTML 特殊字符转换为实体编码，防止 XSS 攻击
 * 
 * @param {string} text - 原始文本
 * @returns {string} 转义后的文本
 */
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')   // & → &amp;
        .replace(/</g, '&lt;')    // < → &lt;
        .replace(/>/g, '&gt;')    // > → &gt;
        .replace(/"/g, '&quot;')  // " → &quot;
        .replace(/'/g, '&#039;'); // ' → &#039;
}

// ==========================================
// 实时预览与防抖
// ==========================================

/**
 * 更新预览内容
 * 将编辑器中的 Markdown 文本转换为 HTML 并显示在预览区
 */
function updatePreview() {
    const markdown = editor.value;

    if (markdown.trim() === '') {
        // 如果编辑器为空，显示占位提示
        preview.innerHTML = '<div class="preview-placeholder"><p>开始输入 Markdown 以预览效果</p></div>';
    } else {
        // 解析并显示
        preview.innerHTML = parseMarkdown(markdown);
    }
}

/**
 * 防抖函数（Debounce）
 * 
 * 原理：在频繁触发的事件中，延迟执行回调函数。
 * 如果在延迟期间再次触发，则重新计时。
 * 只有当事件停止触发超过指定时间后，才执行回调。
 * 
 * 应用场景：
 * - 搜索框输入：避免每输入一个字符就发送请求
 * - 窗口大小调整：避免频繁重新计算布局
 * - 文本编辑预览：避免每输入一个字符就重新解析
 * 
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 包装后的防抖函数
 * 
 * @example
 * const debouncedSearch = debounce((query) => {
 *     fetch('/api/search?q=' + query);
 * }, 300);
 * 
 * input.addEventListener('input', (e) => {
 *     debouncedSearch(e.target.value);
 * });
 */
function debounce(func, delay) {
    let timerId = null; // 闭包：保存定时器 ID

    return function (...args) {
        // 如果之前有定时器，清除它（重新开始计时）
        if (timerId !== null) {
            clearTimeout(timerId);
        }

        // 设置新的定时器
        timerId = setTimeout(() => {
            func.apply(this, args); // 执行原函数
            timerId = null;
        }, delay);
    };
}

// 创建带防抖的预览更新函数（300ms 延迟）
const debouncedUpdatePreview = debounce(updatePreview, 300);

// 监听编辑器输入事件
editor.addEventListener('input', () => {
    debouncedUpdatePreview(); // 使用防抖版本
    autoSave();               // 触发自动保存
});

// ==========================================
// LocalStorage 自动保存
// ==========================================

// LocalStorage 存储键名
const STORAGE_KEY = 'markdown_editor_content';

/**
 * 自动保存编辑器内容到 LocalStorage
 * 
 * LocalStorage 是浏览器提供的客户端存储 API：
 * - 数据持久化：关闭浏览器后数据仍然存在
 * - 同源限制：只有相同协议+域名+端口的页面才能访问
 * - 容量限制：通常 5-10 MB
 * - 同步操作：读写会阻塞主线程（不适合大量数据）
 * 
 * API:
 *   localStorage.setItem(key, value)  - 保存数据
 *   localStorage.getItem(key)         - 读取数据
 *   localStorage.removeItem(key)      - 删除数据
 *   localStorage.clear()              - 清空所有数据
 */
function autoSave() {
    try {
        // 更新状态指示器
        saveStatus.textContent = '保存中...';
        saveStatus.className = 'save-status saving';

        // 保存内容到 LocalStorage
        localStorage.setItem(STORAGE_KEY, editor.value);

        // 更新状态指示器
        saveStatus.textContent = '已保存';
        saveStatus.className = 'save-status saved';
    } catch (error) {
        // 如果存储空间已满或其他错误
        console.error('自动保存失败:', error);
        saveStatus.textContent = '保存失败';
        saveStatus.className = 'save-status';
    }
}

/**
 * 从 LocalStorage 加载之前保存的内容
 */
function loadSavedContent() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
            editor.value = saved; // 恢复内容
            updatePreview();      // 更新预览
            saveStatus.textContent = '已加载';
            saveStatus.className = 'save-status saved';
        }
    } catch (error) {
        console.error('加载保存内容失败:', error);
    }
}

// ==========================================
// 工具栏操作
// ==========================================

/**
 * 在光标位置插入文本
 * 支持包裹选中的文本
 * 
 * @param {string} before - 选中文本前插入的内容
 * @param {string} after - 选中文本后插入的内容（可选，默认与 before 相同）
 * @param {string} placeholder - 无选中内容时的占位文本
 */
function insertText(before, after = before, placeholder = '') {
    // 获取编辑器焦点
    editor.focus();

    // 获取光标选区信息
    const start = editor.selectionStart; // 选区起始位置
    const end = editor.selectionEnd;     // 选区结束位置
    const selectedText = editor.value.substring(start, end); // 选中的文本

    // 确定要插入的内容
    // 如果有选中文本，用选中文本；否则用占位符
    const textToInsert = selectedText || placeholder || '';

    // 构建新内容
    // 如果有 after 参数且选中文本，格式为 before + 选中 + after
    // 否则只插入 before + placeholder + after
    const newText = editor.value.substring(0, start) + 
                    before + textToInsert + after + 
                    editor.value.substring(end);

    // 更新编辑器内容
    editor.value = newText;

    // 重新定位光标
    if (selectedText) {
        // 如果有选中文本，光标移到插入内容之后
        const newCursorPos = start + before.length + selectedText.length + after.length;
        editor.setSelectionRange(newCursorPos, newCursorPos);
    } else {
        // 如果没有选中文本，光标定位在占位符中间
        const cursorPos = start + before.length + (placeholder ? placeholder.length : 0);
        editor.setSelectionRange(cursorPos, cursorPos);
    }

    // 触发 input 事件以更新预览和保存
    editor.dispatchEvent(new Event('input'));
}

// ==========================================
// 工具栏按钮事件绑定
// ==========================================

/**
 * 工具栏按钮操作映射表
 * 定义每个按钮对应的插入行为
 */
const toolbarActions = {
    // 标题
    'h1': () => insertText('# ', '', '一级标题'),
    'h2': () => insertText('## ', '', '二级标题'),
    'h3': () => insertText('### ', '', '三级标题'),

    // 格式
    'bold': () => insertText('**', '**', '粗体文本'),
    'italic': () => insertText('*', '*', '斜体文本'),
    'strikethrough': () => insertText('~~', '~~', '删除线文本'),

    // 列表
    'ul': () => insertText('- ', '', '列表项'),
    'ol': () => insertText('1. ', '', '列表项'),

    // 插入
    'link': () => insertText('[', '](https://)', '链接文本'),
    'image': () => insertText('![', '](https://)', '图片描述'),
    'code': () => insertText('`', '`', '代码'),
    'codeblock': () => insertText('```\n', '\n```', '在此输入代码'),
    'quote': () => insertText('> ', '', '引用文本'),
    'hr': () => insertText('\n---\n', '', '')
};

// 为每个工具栏按钮添加点击事件
document.querySelectorAll('.toolbar-btn').forEach(btn => {
    const action = btn.dataset.action; // 获取 data-action 属性值

    if (toolbarActions[action]) {
        btn.addEventListener('click', () => {
            toolbarActions[action](); // 执行对应的操作
        });
    }
});

// ==========================================
// 键盘快捷键
// ==========================================

/**
 * 监听键盘事件，实现快捷键功能
 * 支持 Ctrl/Cmd + B/I/1/2/3 快速插入语法
 */
editor.addEventListener('keydown', (e) => {
    // 检查是否按下了 Ctrl（Windows）或 Cmd（Mac）
    const isCtrl = e.ctrlKey || e.metaKey;

    if (!isCtrl) return; // 非 Ctrl/Cmd 组合键不处理

    // 根据按下的键执行对应操作
    switch (e.key.toLowerCase()) {
        case 'b':
            e.preventDefault(); // 阻止浏览器默认的加粗行为
            toolbarActions.bold();
            break;
        case 'i':
            e.preventDefault(); // 阻止浏览器默认的斜体行为
            toolbarActions.italic();
            break;
        case '1':
            e.preventDefault();
            toolbarActions.h1();
            break;
        case '2':
            e.preventDefault();
            toolbarActions.h2();
            break;
        case '3':
            e.preventDefault();
            toolbarActions.h3();
            break;
        case 'k':
            e.preventDefault();
            toolbarActions.link();
            break;
    }
});

// ==========================================
// 拖拽分隔条 - 调整面板宽度
// ==========================================

let isResizing = false; // 是否正在拖拽

// 鼠标按下：开始拖拽
resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    resizer.classList.add('resizing'); // 添加高亮样式
    document.body.style.cursor = 'col-resize'; // 全局鼠标样式
    document.body.style.userSelect = 'none';   // 禁止选中文本
    e.preventDefault();
});

// 鼠标移动：调整面板宽度
document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    // 获取容器总宽度
    const containerWidth = document.querySelector('.main-container').offsetWidth;
    // 计算编辑器宽度比例
    const editorWidth = e.clientX;
    const percentage = (editorWidth / containerWidth) * 100;

    // 限制范围：20% - 80%
    if (percentage >= 20 && percentage <= 80) {
        editorPane.style.flex = `0 0 ${percentage}%`;
        previewPane.style.flex = `0 0 ${100 - percentage}%`;
    }
});

// 鼠标释放：结束拖拽
document.addEventListener('mouseup', () => {
    if (isResizing) {
        isResizing = false;
        resizer.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }
});

// ==========================================
// 导出 HTML 功能
// ==========================================

/**
 * 将当前 Markdown 内容导出为独立 HTML 文件
 * 生成的 HTML 文件包含内联样式，可以直接在浏览器中打开
 */
exportBtn.addEventListener('click', () => {
    const markdown = editor.value;
    if (!markdown.trim()) {
        alert('编辑器为空，无法导出');
        return;
    }

    // 解析 Markdown 为 HTML
    const bodyHtml = parseMarkdown(markdown);

    // 构建完整的 HTML 文档
    const htmlDocument = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>导出的 Markdown 文档</title>
    <style>
        body {
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            font-family: 'Microsoft YaHei', sans-serif;
            line-height: 1.7;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 12px;
            font-weight: 600;
        }
        h1 { font-size: 2em; border-bottom: 2px solid #eaecef; padding-bottom: 8px; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 6px; }
        h3 { font-size: 1.25em; }
        code {
            padding: 3px 6px;
            background: #f0f0f0;
            border-radius: 3px;
            font-family: 'Consolas', monospace;
            color: #e83e8c;
        }
        pre {
            padding: 16px;
            background: #282c34;
            border-radius: 6px;
            overflow-x: auto;
        }
        pre code {
            background: transparent;
            color: #abb2bf;
        }
        blockquote {
            padding: 8px 16px;
            border-left: 4px solid #dfe2e5;
            background: #f8f9fa;
            color: #6a737d;
            margin: 0 0 16px 0;
        }
        a { color: #0366d6; text-decoration: none; }
        a:hover { text-decoration: underline; }
        img { max-width: 100%; border-radius: 4px; }
        hr { height: 2px; margin: 24px 0; background: #eaecef; border: none; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
        th, td { padding: 8px 12px; border: 1px solid #dfe2e5; }
        th { background: #f6f8fa; }
    </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

    // 创建 Blob 对象（二进制大对象）
    const blob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });

    // 创建下载链接
    const url = URL.createObjectURL(blob); // 生成临时 URL
    const link = document.createElement('a');
    link.href = url;
    link.download = 'markdown-export.html'; // 下载文件名

    // 触发下载
    document.body.appendChild(link);
    link.click(); // 模拟点击
    document.body.removeChild(link); // 移除元素

    // 释放 URL 对象（释放内存）
    URL.revokeObjectURL(url);
});

// ==========================================
// 清空按钮
// ==========================================

clearBtn.addEventListener('click', () => {
    // 确认对话框
    if (confirm('确定要清空编辑器内容吗？此操作不可撤销。')) {
        editor.value = '';
        updatePreview();
        localStorage.removeItem(STORAGE_KEY); // 同时清除 LocalStorage
        saveStatus.textContent = '已清空';
        saveStatus.className = 'save-status';
    }
});

// ==========================================
// 页面加载时初始化
// ==========================================

window.addEventListener('load', () => {
    // 加载之前保存的内容
    loadSavedContent();

    // 如果没有保存的内容，显示示例文本
    if (!editor.value) {
        editor.value = `# 欢迎使用 Markdown 编辑器

这是一个**实时预览**的 Markdown 编辑器，支持以下语法：

## 文本格式

- **粗体文本** 使用 \`**文本**\`
- *斜体文本* 使用 \`*文本*\`
- ~~删除线~~ 使用 \`~~文本~~\`
- \`行内代码\` 使用反引号

## 列表

### 无序列表
- 第一项
- 第二项
- 第三项

### 有序列表
1. 第一步
2. 第二步
3. 第三步

## 引用

> 这是一段引用文本
> 可以包含多行

## 代码块

\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

## 链接与图片

[访问 GitHub](https://github.com)

---

*开始编辑以预览效果，内容会自动保存。*
`;
        updatePreview();
    }
});
