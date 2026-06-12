# 文件重命名工具

一个基于 Node.js 的命令行文件批量重命名工具，支持前缀、后缀、替换和序号四种重命名模式，带有 dry-run 预览功能。

## 功能特性

- **四种重命名模式**: 前缀、后缀、文本替换、序号重命名
- **Dry-Run 预览**: 执行前预览更改，避免误操作
- **扩展名过滤**: 按文件类型筛选要处理的文件
- **彩色终端输出**: 清晰的彩色提示和错误信息
- **文件信息查看**: 查看目录中文件的详细信息

## Node.js 基础知识

### 核心模块

本项目使用了 Node.js 的三个内置模块：

#### 1. `fs` 模块 - 文件系统

```javascript
const fs = require('fs');

// 同步读取目录
const files = fs.readdirSync('./mydir');

// 获取文件状态
const stats = fs.statSync('./myfile.txt');
console.log(stats.size);   // 文件大小（字节）
console.log(stats.isFile()); // 是否为文件

// 重命名文件
fs.renameSync('./old.txt', './new.txt');

// 检查路径是否存在
if (fs.existsSync('./path')) { ... }
```

**同步 vs 异步**: 
- `fs.readFileSync` / `fs.writeFileSync`: 阻塞执行，简单直接
- `fs.readFile` / `fs.writeFile`: 异步非阻塞，需要回调或 Promise

对于 CLI 工具，同步方法通常更合适，因为操作是顺序执行的。

#### 2. `path` 模块 - 路径处理

```javascript
const path = require('path');

// 拼接路径（自动处理不同操作系统的路径分隔符）
const fullPath = path.join('folder', 'subfolder', 'file.txt');
// Windows: folder\subfolder\file.txt
// macOS/Linux: folder/subfolder/file.txt

// 获取扩展名
path.extname('photo.jpg');  // '.jpg'

// 获取不含扩展名的文件名
path.basename('photo.jpg', '.jpg');  // 'photo'

// 获取绝对路径
path.resolve('./relative/path');
```

#### 3. `process` 对象 - 进程信息

```javascript
// 命令行参数数组
console.log(process.argv);
// ['node.exe', 'script.js', 'arg1', 'arg2']

// 当前工作目录
console.log(process.cwd());

// 退出进程
process.exit(0);  // 正常退出
process.exit(1);  // 错误退出

// 环境变量
console.log(process.env.NODE_ENV);
```

### CLI 工具参数解析

命令行参数通过 `process.argv` 获取：

```
node script.js rename --dir ./files --mode prefix --value my_
         ↑         ↑                    ↑              ↑
       argv[2]   argv[3]              argv[5]        argv[7]
```

需要自己解析这些参数，或使用第三方库如 `commander`、`yargs`。

## CLI 设计模式

### 命令-选项模式

许多 CLI 工具采用 `command [options]` 模式：

```
git commit -m "message"
  ↑     ↑      ↑
程序名 命令   选项
```

本项目也采用此模式，第一个位置参数是命令，后续 `--flag value` 是选项。

### Dry-Run 模式

重要的 CLI 工具通常提供 dry-run（空跑/预览）功能：

```
# 默认仅预览
node index.js rename --dir ./files --mode prefix --value my_

# 添加 --execute 才实际执行
node index.js rename --dir ./files --mode prefix --value my_ --execute
```

这为用户提供了一层安全保障。

## 使用方法

### 安装

无需安装，直接运行即可：

```bash
# 进入项目目录
cd 02-node-cli-tool
```

### 查看帮助

```bash
node index.js help
```

### 查看文件信息

```bash
# 查看目录中所有文件
node index.js info --dir ./your-folder

# 只查看特定类型的文件
node index.js info --dir ./your-folder --ext .txt
```

### 重命名文件

**重要：默认是预览模式！添加 `--execute` 才会实际执行重命名。**

```bash
# 1. 添加前缀（预览）
node index.js rename --dir ./files --mode prefix --value my_

# 2. 添加前缀（实际执行）
node index.js rename --dir ./files --mode prefix --value my_ --execute

# 3. 添加后缀（只处理 .txt 文件）
node index.js rename --dir ./files --mode suffix --value _backup --ext .txt --execute

# 4. 文本替换
node index.js rename --dir ./files --mode replace --search old --replace new --execute

# 5. 序号重命名
node index.js rename --dir ./files --mode sequential --prefix photo --start 1 --digits 4 --execute
```

### 短选项

所有选项都有短形式：

```bash
node index.js rename -d ./files -m prefix -v my_ --execute
node index.js info -d ./files -e .txt
```

## 文件结构

```
02-node-cli-tool/
├── package.json    # 项目配置和依赖
├── index.js        # 主入口文件（CLI 参数解析和命令分发）
├── renamer.js      # 重命名逻辑模块
├── utils.js        # 工具函数（颜色输出、格式化等）
└── README.md       # 说明文档
```

## 挑战任务

### 初级挑战

1. **添加统计功能**: 在执行重命名后，统计不同类型的文件数量
2. **添加撤销功能**: 记录上次操作，可以撤销重命名
3. **添加正则替换**: 在 replace 模式中支持正则表达式

### 中级挑战

4. **递归子目录**: 添加 `--recursive` 选项，处理子目录中的文件
5. **添加大小写转换**: 添加 `uppercase` 和 `lowercase` 模式
6. **添加日期插入**: 将文件修改日期插入到新文件名中

### 高级挑战

7. **异步处理**: 将所有同步 fs 操作改为异步（使用 async/await）
8. **配置文件支持**: 支持 `.renamerrc` 配置文件保存常用设置
9. **第三方库集成**: 使用 `commander.js` 或 `yargs` 重构参数解析
