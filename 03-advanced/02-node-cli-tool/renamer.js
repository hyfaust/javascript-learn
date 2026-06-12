/**
 * ==========================================
 * 文件重命名模块 - renamer.js
 * ==========================================
 * 
 * 提供基于模式的文件批量重命名功能：
 * - 添加前缀（prefix）
 * - 添加后缀（suffix）
 * - 文本替换（replace）
 * - 序号重命名（sequential）
 * 
 * 支持 dry-run（预览）模式，实际执行前可预览更改
 */

// 引入 Node.js 内置模块
const fs = require('fs');     // 文件系统模块
const path = require('path'); // 路径处理模块

// 引入工具函数
const { logInfo, logSuccess, logError, logWarning, formatFileSize, formatFileDate } = require('./utils');

// ==========================================
// 获取目录中的文件列表
// ==========================================

/**
 * 读取指定目录中的文件列表
 * 
 * @param {string} directory - 目标目录路径
 * @param {string} extension - 可选的文件扩展名过滤器（如 '.txt', '.jpg'）
 * @returns {string[]} 文件名数组
 */
function getFilesInDirectory(directory, extension = null) {
    try {
        // fs.readdirSync 同步读取目录内容
        // 返回文件名和子目录名的数组
        const items = fs.readdirSync(directory);

        // 过滤出文件（排除子目录）
        const files = items.filter(item => {
            const fullPath = path.join(directory, item);
            // fs.statSync 获取文件状态信息
            // .isFile() 判断是否为普通文件（而非目录）
            return fs.statSync(fullPath).isFile();
        });

        // 如果指定了扩展名过滤器
        if (extension) {
            // 确保扩展名以 . 开头
            const ext = extension.startsWith('.') ? extension : '.' + extension;
            return files.filter(file => file.toLowerCase().endsWith(ext.toLowerCase()));
        }

        return files;
    } catch (error) {
        logError(`读取目录失败: ${error.message}`);
        return [];
    }
}

// ==========================================
// 重命名模式实现
// ==========================================

/**
 * 添加前缀模式
 * 例: "file.txt" + prefix "my_" → "my_file.txt"
 * 
 * @param {string} filename - 原始文件名
 * @param {string} value - 要添加的前缀
 * @returns {string} 新文件名
 */
function addPrefix(filename, value) {
    // path.extname 获取文件扩展名（含 . 号）
    const ext = path.extname(filename);
    // path.basename 获取不含扩展名的文件名
    const name = path.basename(filename, ext);

    // 新文件名 = 前缀 + 原名称 + 扩展名
    return `${value}${name}${ext}`;
}

/**
 * 添加后缀模式
 * 例: "file.txt" + suffix "_backup" → "file_backup.txt"
 * 
 * @param {string} filename - 原始文件名
 * @param {string} value - 要添加的后缀
 * @returns {string} 新文件名
 */
function addSuffix(filename, value) {
    const ext = path.extname(filename);
    const name = path.basename(filename, ext);

    // 新文件名 = 原名称 + 后缀 + 扩展名
    return `${name}${value}${ext}`;
}

/**
 * 文本替换模式
 * 例: "photo_001.jpg" + replace "photo" → "image" = "image_001.jpg"
 * 
 * @param {string} filename - 原始文件名
 * @param {object} options - 选项对象
 * @param {string} options.search - 要搜索的文本
 * @param {string} options.replace - 替换为的文本
 * @returns {string|null} 新文件名，如果没有匹配则返回 null
 */
function replaceText(filename, options) {
    const { search, replace } = options;

    // 如果文件名中不包含要搜索的文本，返回 null 表示跳过
    if (!filename.includes(search)) {
        return null;
    }

    // String.prototype.replaceAll 替换所有匹配项
    // 注意：如果 search 是空字符串，会报错
    if (!search) {
        logWarning('替换文本模式下，搜索文本不能为空');
        return null;
    }

    return filename.replaceAll(search, replace);
}

/**
 * 序号重命名模式
 * 例: ["a.txt", "b.txt", "c.txt"] → "prefix_001.txt", "prefix_002.txt", "prefix_003.txt"
 * 
 * @param {string[]} files - 文件名数组
 * @param {object} options - 选项对象
 * @param {string} options.prefix - 序号前的前缀
 * @param {number} options.start - 起始序号
 * @param {number} options.digits - 序号位数（补零位数）
 * @returns {string[]} 新文件名数组
 */
function sequentialRename(files, options = {}) {
    const { prefix = 'file', start = 1, digits = 3 } = options;

    return files.map((filename, index) => {
        const ext = path.extname(filename);
        // 计算当前序号
        const number = start + index;

        // String.prototype.padStart 在左侧填充指定字符
        // '1'.padStart(3, '0') → '001'
        const paddedNumber = number.toString().padStart(digits, '0');

        return `${prefix}_${paddedNumber}${ext}`;
    });
}

// ==========================================
// 执行重命名操作
// ==========================================

/**
 * 执行文件重命名（或预览）
 * 
 * @param {string} directory - 目标目录
 * @param {string} mode - 重命名模式（prefix, suffix, replace, sequential）
 * @param {object} options - 选项对象
 * @param {boolean} options.dryRun - 是否为预览模式（不实际执行）
 * @param {string} options.extension - 文件扩展名过滤器
 * @param {string} options.value - 模式参数值（前缀/后缀/搜索替换文本）
 * @param {object} options.replaceOptions - 替换模式的选项（search, replace）
 * @param {object} options.sequentialOptions - 序号模式的选项（prefix, start, digits）
 */
function executeRename(directory, mode, options = {}) {
    const { dryRun = true, extension = null } = options;

    // 获取目标文件列表
    const files = getFilesInDirectory(directory, extension);

    if (files.length === 0) {
        logWarning('未找到匹配的文件');
        return;
    }

    logInfo(`找到 ${files.length} 个文件`);

    let newNames = [];

    // 根据模式生成新文件名
    switch (mode) {
        case 'prefix':
            newNames = files.map(f => addPrefix(f, options.value));
            break;

        case 'suffix':
            newNames = files.map(f => addSuffix(f, options.value));
            break;

        case 'replace':
            newNames = files.map(f => replaceText(f, options.replaceOptions || {}));
            // 过滤掉 null 值（没有匹配的文件）
            const replacedPairs = files.filter((_, i) => newNames[i] !== null)
                                       .map((f, i) => ({ old: f, new: newNames[i] }));
            if (replacedPairs.length === 0) {
                logWarning('没有文件包含要替换的文本');
                return;
            }
            performRenameOrPreview(directory, replacedPairs, dryRun);
            return;

        case 'sequential':
            newNames = sequentialRename(files, options.sequentialOptions);
            break;

        default:
            logError(`未知的重命名模式: ${mode}`);
            return;
    }

    // 构建旧新文件名配对数组
    const pairs = files.map((oldName, index) => ({
        old: oldName,
        new: newNames[index]
    }));

    performRenameOrPreview(directory, pairs, dryRun);
}

/**
 * 执行实际的重命名或预览输出
 * 
 * @param {string} directory - 目标目录
 * @param {object[]} pairs - 旧新文件名配对数组 [{old: 'a.txt', new: 'b.txt'}]
 * @param {boolean} dryRun - 是否为预览模式
 */
function performRenameOrPreview(directory, pairs, dryRun) {
    let successCount = 0;
    let failCount = 0;

    // 打印模式标题
    if (dryRun) {
        console.log('\n--- 预览模式（不会实际修改文件）---\n');
    } else {
        console.log('\n--- 执行重命名 ---\n');
    }

    // 遍历每个文件对
    pairs.forEach(({ old, new: newName }) => {
        if (!newName) return; // 跳过无效的新名称

        const oldPath = path.join(directory, old);
        const newPath = path.join(directory, newName);

        // 检查新文件名是否已存在
        if (fs.existsSync(newPath) && oldPath !== newPath) {
            logWarning(`跳过 ${old}: 目标文件 ${newName} 已存在`);
            failCount++;
            return;
        }

        if (dryRun) {
            // 预览模式：仅打印信息
            console.log(`  ${old} → ${newName}`);
            successCount++;
        } else {
            // 实际执行重命名
            try {
                // fs.renameSync 同步重命名文件
                fs.renameSync(oldPath, newPath);
                logSuccess(`${old} → ${newName}`);
                successCount++;
            } catch (error) {
                logError(`重命名失败 ${old}: ${error.message}`);
                failCount++;
            }
        }
    });

    // 打印汇总信息
    console.log('');
    if (dryRun) {
        logInfo(`预览完成: 将重命名 ${successCount} 个文件`);
        logInfo('使用 --execute 参数执行实际重命名');
    } else {
        logInfo(`完成: 成功 ${successCount} 个，失败 ${failCount} 个`);
    }
}

// ==========================================
// 文件信息查看功能
// ==========================================

/**
 * 显示目录中文件的详细信息
 * 
 * @param {string} directory - 目标目录
 * @param {string} extension - 可选的文件扩展名过滤器
 */
function showFileInfo(directory, extension = null) {
    const files = getFilesInDirectory(directory, extension);

    if (files.length === 0) {
        logWarning('未找到匹配的文件');
        return;
    }

    console.log('');
    logInfo(`目录: ${directory}`);
    logInfo(`文件数量: ${files.length}`);
    console.log('');

    // 打印表头
    const header = ['文件名'.padEnd(30), '大小'.padEnd(12), '修改时间'.padEnd(22)];
    console.log(header.join(''));
    console.log('-'.repeat(66));

    // 打印每个文件的信息
    files.forEach(filename => {
        const filePath = path.join(directory, filename);
        const stats = fs.statSync(filePath);

        // 格式化文件大小
        const size = formatFileSize(stats.size);

        // 格式化修改时间
        const modified = formatFileDate(stats.mtimeMs);

        const row = [
            filename.padEnd(30),
            size.padEnd(12),
            modified.padEnd(22)
        ];
        console.log(row.join(''));
    });
}

// ==========================================
// 导出函数
// ==========================================
module.exports = {
    getFilesInDirectory,
    addPrefix,
    addSuffix,
    replaceText,
    sequentialRename,
    executeRename,
    showFileInfo
};
