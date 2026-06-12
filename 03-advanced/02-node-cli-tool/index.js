#!/usr/bin/env node

/**
 * ==========================================
 * 文件重命名工具 - 主入口文件 index.js
 * ==========================================
 * 
 * 命令行文件批量重命名工具
 * 支持前缀、后缀、替换、序号四种重命名模式
 * 
 * 使用方法:
 *   node index.js <命令> [选项]
 * 
 * 命令:
 *   rename  - 执行文件重命名
 *   info    - 查看文件信息
 *   help    - 显示帮助信息
 */

// 引入 Node.js 内置模块
const path = require('path'); // 路径处理模块
const fs = require('fs');     // 文件系统模块

// 引入自定义模块
const { executeRename, showFileInfo } = require('./renamer');
const { log, logError, logInfo, logWarning, colorize } = require('./utils');

// ==========================================
// 命令行参数解析
// ==========================================

/**
 * process.argv 是 Node.js 提供的一个数组，包含启动进程时的命令行参数
 * 
 * 例如执行: node index.js rename --dir ./files --mode prefix --value my_
 * 
 * process.argv 的值为:
 * [
 *   'C:\\Program Files\\nodejs\\node.exe',  // argv[0]: Node.js 可执行文件路径
 *   'F:\\project\\index.js',                 // argv[1]: 当前脚本的绝对路径
 *   'rename',                                // argv[2]: 第一个实际参数（命令）
 *   '--dir',                                 // argv[3]: 选项标志
 *   './files',                               // argv[4]: 选项值
 *   '--mode',                                // argv[5]: 选项标志
 *   'prefix',                                // argv[6]: 选项值
 *   '--value',                               // argv[7]: 选项标志
 *   'my_'                                    // argv[8]: 选项值
 * ]
 * 
 * 因此我们通常从 process.argv[2] 开始解析
 */
const args = process.argv.slice(2); // 移除前两个元素，只保留实际参数

// ==========================================
// 简单的命令行参数解析器
// ==========================================

/**
 * 将命令行参数解析为键值对对象
 * 
 * 支持的格式：
 *   --key value    长选项
 *   -k value       短选项
 *   value          位置参数（无标志）
 * 
 * @param {string[]} argv - 参数数组
 * @returns {object} 解析后的参数对象
 * 
 * @example
 * parseArgs(['--dir', './files', '--mode', 'prefix'])
 * // 返回: { dir: './files', mode: 'prefix', _: [] }
 * 
 * parseArgs(['rename', '--dir', './files', '-d'])
 * // 返回: { dir: './files', d: true, _: ['rename'] }
 */
function parseArgs(argv) {
    const result = { _: [] }; // _ 数组存储位置参数（无标志的参数）
    let i = 0;

    while (i < argv.length) {
        const arg = argv[i];

        if (arg.startsWith('--')) {
            // 长选项: --key value
            const key = arg.slice(2); // 移除 -- 前缀

            // 检查下一个参数是否存在且不是另一个选项标志
            if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
                result[key] = argv[i + 1];
                i += 2; // 跳过键和值
            } else {
                // 只有标志没有值，视为布尔值 true
                result[key] = true;
                i += 1;
            }
        } else if (arg.startsWith('-')) {
            // 短选项: -k value
            const key = arg.slice(1); // 移除 - 前缀

            if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
                result[key] = argv[i + 1];
                i += 2;
            } else {
                result[key] = true;
                i += 1;
            }
        } else {
            // 位置参数：直接添加到 _ 数组
            result._.push(arg);
            i += 1;
        }
    }

    return result;
}

// 解析命令行参数
const params = parseArgs(args);

// ==========================================
// 获取命令并分发处理
// ==========================================

/**
 * 命令分发器
 * 根据第一个位置参数决定执行哪个命令
 */
const command = params._[0]; // 获取第一个位置参数作为命令

if (!command) {
    // 没有提供命令时显示帮助
    printHelp();
    process.exit(0);
}

// 根据命令执行对应函数
switch (command) {
    case 'rename':
        handleRename(params);
        break;

    case 'info':
        handleInfo(params);
        break;

    case 'help':
        printHelp();
        break;

    default:
        logError(`未知命令: ${command}`);
        logInfo('使用 "node index.js help" 查看可用命令');
        process.exit(1); // 非零退出码表示错误
}

// ==========================================
// 命令处理函数
// ==========================================

/**
 * 处理 rename 命令
 * 
 * 用法示例：
 *   node index.js rename --dir ./files --mode prefix --value my_
 *   node index.js rename --dir ./files --mode suffix --value _backup
 *   node index.js rename --dir ./files --mode replace --search old --replace new
 *   node index.js rename --dir ./files --mode sequential --prefix photo --start 1
 *   node index.js rename --dir ./files --mode prefix --value my_ --ext .txt
 *   node index.js rename --dir ./files --mode prefix --value my_ --execute  (实际执行)
 */
function handleRename(params) {
    // --- 解析必需参数 ---

    // --dir: 目标目录路径
    const directory = params.dir || params.d;
    if (!directory) {
        logError('缺少必需参数: --dir <目录路径>');
        logInfo('示例: node index.js rename --dir ./my-files --mode prefix --value test_');
        process.exit(1);
    }

    // 检查目录是否存在
    if (!fs.existsSync(directory)) {
        logError(`目录不存在: ${directory}`);
        process.exit(1);
    }

    // --mode: 重命名模式
    const mode = params.mode || params.m;
    if (!mode) {
        logError('缺少必需参数: --mode <模式>');
        logInfo('可用模式: prefix, suffix, replace, sequential');
        process.exit(1);
    }

    // 验证模式是否有效
    const validModes = ['prefix', 'suffix', 'replace', 'sequential'];
    if (!validModes.includes(mode)) {
        logError(`无效的重命名模式: ${mode}`);
        logInfo(`可用模式: ${validModes.join(', ')}`);
        process.exit(1);
    }

    // --- 解析可选参数 ---

    // --ext: 文件扩展名过滤器
    const extension = params.ext || params.e || null;

    // --execute: 是否实际执行（默认是预览模式）
    const isExecute = params.execute || params.exec || false;

    // --- 构建选项对象 ---
    const options = {
        dryRun: !isExecute,  // dryRun 与 execute 相反
        extension: extension
    };

    // 根据模式添加特定选项
    switch (mode) {
        case 'prefix':
        case 'suffix':
            // 需要 --value 参数指定前缀/后缀文本
            const value = params.value || params.v;
            if (!value) {
                logError(`缺少必需参数: --value <${mode === 'prefix' ? '前缀' : '后缀'}文本>`);
                process.exit(1);
            }
            options.value = value;
            break;

        case 'replace':
            // 需要 --search 和 --replace 参数
            const search = params.search;
            const replace = params.replace;
            if (!search || replace === undefined) {
                logError('替换模式需要 --search 和 --replace 参数');
                logInfo('示例: node index.js rename --dir ./files --mode replace --search old --replace new');
                process.exit(1);
            }
            options.replaceOptions = { search, replace };
            break;

        case 'sequential':
            // 序号模式选项
            options.sequentialOptions = {
                prefix: params.prefix || params.p || 'file',
                start: parseInt(params.start) || 1,
                digits: parseInt(params.digits) || 3
            };
            break;
    }

    // 打印操作信息
    logInfo(`目录: ${path.resolve(directory)}`);
    logInfo(`模式: ${mode}`);
    if (extension) logInfo(`扩展名过滤: ${extension}`);
    logInfo(isExecute ? '执行模式: 实际重命名' : '执行模式: 预览（Dry-Run）');
    console.log('');

    // 执行重命名
    executeRename(directory, mode, options);
}

/**
 * 处理 info 命令
 * 
 * 用法示例：
 *   node index.js info --dir ./files
 *   node index.js info --dir ./files --ext .txt
 */
function handleInfo(params) {
    const directory = params.dir || params.d;
    if (!directory) {
        logError('缺少必需参数: --dir <目录路径>');
        process.exit(1);
    }

    if (!fs.existsSync(directory)) {
        logError(`目录不存在: ${directory}`);
        process.exit(1);
    }

    const extension = params.ext || params.e || null;
    showFileInfo(directory, extension);
}

// ==========================================
// 帮助信息输出
// ==========================================

/**
 * 打印帮助信息
 * 显示所有可用命令、选项和使用示例
 */
function printHelp() {
    console.log('');
    logInfo('文件重命名工具 v1.0.0');
    console.log('');
    log(colorize('用法:', 'bold'));
    console.log('  node index.js <命令> [选项]');
    console.log('');

    log(colorize('可用命令:', 'bold'));
    console.log('  rename    批量重命名文件');
    console.log('  info      显示文件信息');
    console.log('  help      显示此帮助信息');
    console.log('');

    log(colorize('通用选项:', 'bold'));
    console.log('  --dir, -d <路径>       目标目录路径（必需）');
    console.log('  --ext, -e <扩展名>     按扩展名过滤（如 .txt）');
    console.log('');

    log(colorize('rename 命令选项:', 'bold'));
    console.log('  --mode, -m <模式>      重命名模式（必需）');
    console.log('                         可选: prefix, suffix, replace, sequential');
    console.log('  --value, -v <文本>     prefix/suffix 模式的值');
    console.log('  --search <文本>        replace 模式的搜索文本');
    console.log('  --replace <文本>       replace 模式的替换文本');
    console.log('  --prefix, -p <文本>    sequential 模式的前缀（默认: file）');
    console.log('  --start <数字>         sequential 模式的起始序号（默认: 1）');
    console.log('  --digits <数字>        sequential 模式的序号位数（默认: 3）');
    console.log('  --execute              执行实际重命名（默认仅预览）');
    console.log('');

    log(colorize('示例:', 'bold'));
    console.log('  # 预览：给所有文件添加前缀 "my_"');
    console.log('  node index.js rename --dir ./files --mode prefix --value my_');
    console.log('');
    console.log('  # 执行：给 .txt 文件添加后缀 "_backup"');
    console.log('  node index.js rename --dir ./files --mode suffix --value _backup --ext .txt --execute');
    console.log('');
    console.log('  # 预览：将文件名中的 "old" 替换为 "new"');
    console.log('  node index.js rename --dir ./files --mode replace --search old --replace new');
    console.log('');
    console.log('  # 执行：序号重命名，前缀 "photo"，从 10 开始');
    console.log('  node index.js rename --dir ./files --mode sequential --prefix photo --start 10 --execute');
    console.log('');
    console.log('  # 查看文件信息');
    console.log('  node index.js info --dir ./files');
    console.log('');
}
