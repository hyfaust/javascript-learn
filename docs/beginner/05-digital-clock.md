# 项目 05: 动态时钟 ⏰

## 🎯 项目目标
创建一个实时更新的数字时钟，支持 12/24 小时制切换和暂停功能。

## 📚 核心知识点

### 1. Date 对象
JavaScript 内置的日期/时间对象，包含丰富的时间信息：
```javascript
const now = new Date();  // 创建当前时间的 Date 对象

now.getFullYear();   // 2026 (四位年份)
now.getMonth();      // 0-11 (注意: 0 是一月!)
now.getDate();       // 1-31 (日期)
now.getDay();        // 0-6 (0 是周日)
now.getHours();      // 0-23 (小时)
now.getMinutes();    // 0-59 (分钟)
now.getSeconds();    // 0-59 (秒)
```

### 2. setInterval 和 clearInterval
```javascript
// 每隔指定时间重复执行
const timerId = setInterval(函数, 间隔毫秒数);

// 停止定时器
clearInterval(timerId);

// 示例: 每秒执行
const id = setInterval(() => {
    console.log('滴答!');
}, 1000);

// 5 秒后停止
setTimeout(() => clearInterval(id), 5000);
```

### 3. 字符串填充 padStart
```javascript
String(5).padStart(2, '0');   // '05'
String(12).padStart(2, '0');  // '12'
String(3).padStart(3, '0');   // '003'
```

### 4. 布尔状态切换
```javascript
let isRunning = true;
isRunning = !isRunning;  // true → false → true ...
```

## 📖 代码解析

### 时钟更新流程
```
setInterval 每秒触发
       ↓
   new Date() 获取当前时间
       ↓
   格式化（补零、12/24小时转换）
       ↓
   更新 DOM 显示
       ↓
   更新秒针进度条
```

### 12 小时制转换逻辑
```javascript
let hours = now.getHours();  // 0-23

// 转换为 12 小时制
const period = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12;           // 13→1, 14→2, ...
hours = hours ? hours : 12;   // 0→12 (午夜)
```

## 🚀 运行方式
双击 `index.html` 在浏览器中打开即可。

## ⚠️ 常见错误

| 错误 | 原因 | 解决方法 |
|------|------|---------|
| 时间不更新 | 忘记调用 `setInterval` | 确保启动时钟 |
| 内存泄漏 | 未清理定时器 | 页面卸载时 `clearInterval` |
| 月份错误 | `getMonth()` 返回 0-11 | 显示时记得 `+1` |
| 秒针跳动不平滑 | 只更新整数秒 | 加入毫秒计算 |

## 🔧 调试技巧
1. 在 Console 输入 `new Date()` 查看当前时间对象
2. 输入 `new Date().toLocaleString('zh-CN')` 查看中文格式化
3. 用 `console.log()` 检查时间变量值
4. 暂停后检查 `timerId` 是否被正确清理

## 🎓 挑战任务

### ⭐ 简单
- [ ] 添加倒计时功能（如倒计时到新年）
- [ ] 修改颜色主题

### ⭐⭐ 中等
- [ ] 添加闹钟功能（设定时间弹出提醒）
- [ ] 添加世界时钟（显示不同时区时间）

### ⭐⭐⭐ 困难
- [ ] 制作模拟时钟（带时针、分针、秒针的圆盘）
- [ ] 添加秒表功能（开始/停止/计次）
