# 粒子动画系统

一个使用 HTML5 Canvas 实现的交互式粒子动画系统。移动鼠标即可生成炫酷的粒子效果！

## 功能特性

- **鼠标交互**: 移动鼠标生成粒子，实时响应
- **可调节参数**: 粒子数量、大小、颜色、速度、生命周期、重力
- **浮动控制面板**: 毛玻璃效果 UI，可折叠展开
- **实时统计**: 显示活跃粒子数和 FPS
- **暂停/清空/重置**: 完整的控制功能
- **触摸支持**: 兼容移动设备

## Canvas 基础知识

### 什么是 Canvas？

Canvas 是 HTML5 提供的一种绘图 API，允许使用 JavaScript 在网页上绘制图形。

```html
<canvas id="myCanvas" width="800" height="600"></canvas>
```

获取绘图上下文：
```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
```

### 常用绘图方法

| 方法 | 说明 |
|------|------|
| `fillRect(x, y, w, h)` | 填充矩形 |
| `strokeRect(x, y, w, h)` | 绘制矩形边框 |
| `beginPath()` | 开始新路径 |
| `arc(x, y, r, start, end)` | 绘制圆弧/圆形 |
| `fill()` | 填充当前路径 |
| `stroke()` | 绘制当前路径边框 |
| `clearRect(x, y, w, h)` | 清除矩形区域 |

## 动画原理

### requestAnimationFrame

本项目使用 `requestAnimationFrame` 而非 `setInterval` 或 `setTimeout`：

```javascript
function animate(timestamp) {
    // 更新和绘制逻辑
    requestAnimationFrame(animate);
}
```

**为什么选择 requestAnimationFrame？**

1. **与屏幕刷新率同步**: 通常为 60fps，避免帧撕裂
2. **性能优化**: 页面不可见时自动暂停，节省资源
3. **更流畅**: 浏览器会优化回调的执行时机

### 动画循环的核心要素

```
初始化 → 清除画布 → 更新状态 → 绘制图形 → 请求下一帧
            ↑______________________________|
```

## 粒子系统原理

粒子系统的核心思想：

1. **生成（Spawn）**: 在特定位置创建新粒子
2. **更新（Update）**: 每帧更新粒子的位置、大小、透明度
3. **绘制（Draw）**: 将粒子渲染到画布上
4. **销毁（Destroy）**: 移除超出生命周期的粒子

## 性能优化技巧

### 1. 对象池模式

频繁创建和销毁对象会导致垃圾回收（GC）压力。可以使用对象池复用粒子：

```javascript
// 简易对象池
const particlePool = [];

function getParticle(x, y) {
    if (particlePool.length > 0) {
        return particlePool.pop().reset(x, y);
    }
    return new Particle(x, y);
}
```

### 2. 减少状态保存

`ctx.save()` 和 `ctx.restore()` 会影响性能。尽量减少调用次数：

```javascript
// 低效：每个粒子都保存/恢复状态
particles.forEach(p => {
    ctx.save();
    ctx.fillStyle = p.color;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
});

// 高效：批量处理相同状态
ctx.fillStyle = currentColor;
particles.forEach(p => {
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
});
```

### 3. 避免频繁分配内存

在动画循环中避免创建新对象：

```javascript
// 不好：每帧创建新对象
function draw() {
    const color = { r: 255, g: 0, b: 0 }; // 每帧分配新对象
}

// 好：复用对象
const color = { r: 255, g: 0, b: 0 };
function draw() {
    color.r = 255; // 复用现有对象
}
```

### 4. 使用离屏 Canvas

对于复杂场景，可以使用离屏 Canvas 预渲染：

```javascript
// 创建离屏 Canvas
const offCanvas = document.createElement('canvas');
const offCtx = offCanvas.getContext('2d');

// 在离屏 Canvas 上绘制
// ...

// 一次性绘制到主 Canvas
ctx.drawImage(offCanvas, 0, 0);
```

## 如何使用

1. 直接在浏览器中打开 `index.html` 文件
2. 移动鼠标生成粒子效果
3. 使用右侧控制面板调整参数
4. 点击按钮清空画布、暂停或重置参数

## 文件结构

```
01-particle-animation/
├── index.html     # 页面结构
├── style.css      # 样式表
├── script.js      # 主要逻辑
└── README.md      # 说明文档
```

## 挑战任务

### 初级挑战

1. **改变粒子形状**: 将圆形改为方形、三角形或星形
2. **彩虹模式**: 粒子颜色随时间自动变化（使用 HSL 颜色空间）
3. **拖尾增强**: 调整清除画布的透明度，观察拖尾效果变化

### 中级挑战

4. **粒子连线**: 当两个粒子距离小于阈值时，在它们之间画线
5. **爆炸效果**: 点击鼠标时，从点击位置生成大量粒子
6. **粒子引力**: 添加一个引力中心，粒子被吸引过去

### 高级挑战

7. **实现对象池**: 重构粒子系统，使用对象池减少 GC 压力
8. **物理模拟**: 添加碰撞检测，粒子之间相互反弹
9. **音频响应**: 使用 Web Audio API 让粒子响应音乐节奏

## 技术栈

- HTML5 Canvas API
- CSS3（Flexbox、Backdrop Filter、渐变）
- 原生 JavaScript（ES6+ 类语法）
