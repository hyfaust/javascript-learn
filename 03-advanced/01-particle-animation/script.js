/**
 * ==========================================
 * 粒子动画系统 - Particle Animation System
 * ==========================================
 * 
 * 功能说明：
 * - 鼠标移动时生成粒子效果
 * - 粒子具有生命周期，随时间淡出消失
 * - 控制面板可实时调节粒子参数
 * - 支持重力效果模拟
 * 
 * 核心概念：
 * 1. Canvas 2D 绘图 API
 * 2. requestAnimationFrame 动画循环
 * 3. 面向对象编程（Particle 类）
 * 4. 事件监听与响应
 */

// ==========================================
// 配置对象 - 存储所有可调参数
// ==========================================
const config = {
    maxParticles: 50,       // 最大粒子数量
    particleSize: 5,        // 粒子大小（像素）
    particleColor: '#00aaff', // 粒子颜色（十六进制）
    particleSpeed: 3,       // 粒子速度
    particleLife: 100,      // 粒子生命周期（帧数）
    gravity: 0,             // 重力加速度
    spawnRate: 0.8,         // 生成率（每次鼠标移动生成的粒子数比例）
    isPaused: false         // 是否暂停动画
};

// ==========================================
// Particle 类 - 粒子对象
// ==========================================
/**
 * 粒子类定义了每个粒子的属性和行为
 * @param {number} x - 粒子初始 X 坐标
 * @param {number} y - 粒子初始 Y 坐标
 */
class Particle {
    constructor(x, y) {
        // --- 位置属性 ---
        this.x = x;                          // 当前 X 坐标
        this.y = y;                          // 当前 Y 坐标

        // --- 大小与颜色 ---
        this.size = config.particleSize;     // 粒子大小（从配置读取）
        this.color = config.particleColor;   // 粒子颜色（从配置读取）

        // --- 速度属性 ---
        // 随机方向：使用 Math.random() 生成 -0.5 到 0.5 的随机数
        // 乘以 speed 系数控制速度大小
        this.speedX = (Math.random() - 0.5) * config.particleSpeed * 2;
        this.speedY = (Math.random() - 0.5) * config.particleSpeed * 2;

        // --- 生命周期 ---
        this.life = config.particleLife;     // 最大生命值（帧数）
        this.maxLife = config.particleLife;  // 记录最大生命值用于计算透明度

        // --- 衰减 ---
        // 每帧减少的大小，确保粒子在生命周期结束时大小为零
        this.sizeDecay = this.size / this.maxLife;
    }

    /**
     * 更新粒子状态 - 每帧调用一次
     * 更新位置、大小、生命值
     * @returns {boolean} 粒子是否仍然存活
     */
    update() {
        // 更新位置：新位置 = 旧位置 + 速度
        this.x += this.speedX;
        this.y += this.speedY;

        // 应用重力效果：每帧在 Y 方向增加重力加速度
        this.speedY += config.gravity;

        // 衰减大小
        this.size -= this.sizeDecay;

        // 减少生命值
        this.life--;

        // 如果大小小于等于0或生命值耗尽，粒子死亡
        return this.size > 0 && this.life > 0;
    }

    /**
     * 绘制粒子 - 每帧调用一次
     * 使用 Canvas 2D API 绘制圆形
     * 透明度根据剩余生命值计算（淡出效果）
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D 渲染上下文
     */
    draw(ctx) {
        // 计算透明度：生命值比例映射到 0-1 范围
        const alpha = this.life / this.maxLife;

        // 将十六进制颜色转换为带透明度的 RGBA 格式
        const rgbaColor = hexToRgba(this.color, alpha);

        ctx.save(); // 保存当前画布状态

        // 设置填充颜色
        ctx.fillStyle = rgbaColor;
        ctx.beginPath();

        // 绘制圆形：arc(x, y, radius, startAngle, endAngle)
        // Math.PI * 2 表示完整圆周（360度）
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 添加发光效果
        ctx.shadowBlur = 15;             // 发光模糊半径
        ctx.shadowColor = rgbaColor;     // 发光颜色

        ctx.restore(); // 恢复画布状态
    }
}

// ==========================================
// 辅助函数：十六进制颜色转 RGBA
// ==========================================
/**
 * 将十六进制颜色（如 "#ff0000"）转换为 RGBA 格式
 * @param {string} hex - 十六进制颜色字符串
 * @param {number} alpha - 透明度（0-1）
 * @returns {string} RGBA 颜色字符串
 */
function hexToRgba(hex, alpha) {
    // 移除 # 符号（如果存在）
    hex = hex.replace('#', '');

    // 解析 RGB 分量：parseInt(str, 16) 将十六进制字符串转为十进制数
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // 返回 RGBA 格式字符串
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

// ==========================================
// 主程序 - 动画循环与事件处理
// ==========================================

// 获取 Canvas 元素和渲染上下文
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// 粒子数组 - 存储所有活跃粒子
let particles = [];

// 鼠标状态
let mouse = { x: 0, y: 0, isMoving: false };

// FPS 计算相关变量
let lastTime = 0;        // 上一帧时间戳
let frameCount = 0;      // 帧计数器
let fps = 0;             // 当前 FPS
let fpsUpdateTime = 0;   // FPS 更新时间戳

/**
 * 初始化画布大小
 * 在页面加载和窗口大小改变时调用
 */
function resizeCanvas() {
    canvas.width = window.innerWidth;   // 设置为窗口宽度
    canvas.height = window.innerHeight; // 设置为窗口高度
}

/**
 * 生成粒子
 * 在鼠标位置周围生成指定数量的粒子
 */
function spawnParticles() {
    // 如果粒子数已达上限，则不再生成
    if (particles.length >= config.maxParticles * 3) return;

    // 根据生成率计算本次生成的粒子数
    const count = Math.ceil(config.maxParticles * config.spawnRate);

    for (let i = 0; i < count; i++) {
        // 在鼠标位置附近生成粒子（添加随机偏移）
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        particles.push(new Particle(mouse.x + offsetX, mouse.y + offsetY));
    }
}

/**
 * 主动画循环
 * 使用 requestAnimationFrame 实现流畅动画
 * 与 setTimeout/setInterval 不同，requestAnimationFrame 会与屏幕刷新率同步
 * @param {number} timestamp - 当前帧的时间戳（毫秒）
 */
function animate(timestamp) {
    // --- 计算 FPS ---
    frameCount++; // 增加帧计数
    if (timestamp - fpsUpdateTime >= 1000) {
        // 每 1000ms（1秒）更新一次 FPS 显示
        fps = frameCount;
        frameCount = 0;
        fpsUpdateTime = timestamp;
        document.getElementById('fpsDisplay').textContent = fps;
    }

    // 如果暂停则跳过更新，但继续请求下一帧以保持 FPS 计算
    if (config.isPaused) {
        requestAnimationFrame(animate);
        return;
    }

    // --- 清除画布 ---
    // 使用半透明黑色填充实现拖尾效果
    // 与 clearRect 不同，这种方式会让上一帧的内容逐渐淡化
    ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- 更新和绘制所有粒子 ---
    // 使用 filter 移除已死亡的粒子
    particles = particles.filter(particle => {
        const isAlive = particle.update(); // 更新粒子状态
        if (isAlive) {
            particle.draw(ctx); // 如果存活则绘制
        }
        return isAlive; // 返回 true 保留粒子，false 移除
    });

    // --- 更新统计信息 ---
    document.getElementById('activeCount').textContent = particles.length;

    // --- 请求下一帧 ---
    // requestAnimationFrame 告诉浏览器在下一次重绘前调用 animate 函数
    // 通常与屏幕刷新率一致（60Hz = 约16.67ms/帧）
    requestAnimationFrame(animate);
}

// ==========================================
// 事件监听器
// ==========================================

// 窗口大小改变时重新调整画布尺寸
window.addEventListener('resize', resizeCanvas);

/**
 * 鼠标移动事件
 * 更新鼠标位置并生成粒子
 */
canvas.addEventListener('mousemove', (event) => {
    // 更新鼠标坐标（相对于画布）
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.isMoving = true;

    // 生成粒子
    spawnParticles();
});

/**
 * 鼠标离开画布事件
 * 停止生成粒子
 */
canvas.addEventListener('mouseleave', () => {
    mouse.isMoving = false;
});

// 触摸设备支持
canvas.addEventListener('touchmove', (event) => {
    event.preventDefault(); // 防止滚动
    const touch = event.touches[0];
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
    spawnParticles();
}, { passive: false });

// ==========================================
// 控制面板事件处理
// ==========================================

// 获取控制面板元素
const particleCountSlider = document.getElementById('particleCount');
const particleSizeSlider = document.getElementById('particleSize');
const particleColorPicker = document.getElementById('particleColor');
const particleSpeedSlider = document.getElementById('particleSpeed');
const particleLifeSlider = document.getElementById('particleLife');
const gravitySlider = document.getElementById('gravity');
const clearBtn = document.getElementById('clearBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const togglePanelBtn = document.getElementById('togglePanel');
const controlPanel = document.getElementById('controlPanel');

// 粒子数量滑块
particleCountSlider.addEventListener('input', (e) => {
    config.maxParticles = parseInt(e.target.value);
    document.getElementById('countValue').textContent = config.maxParticles;
});

// 粒子大小滑块
particleSizeSlider.addEventListener('input', (e) => {
    config.particleSize = parseInt(e.target.value);
    document.getElementById('sizeValue').textContent = config.particleSize;
});

// 颜色选择器
particleColorPicker.addEventListener('input', (e) => {
    config.particleColor = e.target.value;
});

// 粒子速度滑块
particleSpeedSlider.addEventListener('input', (e) => {
    config.particleSpeed = parseInt(e.target.value);
    document.getElementById('speedValue').textContent = config.particleSpeed;
});

// 粒子生命周期滑块
particleLifeSlider.addEventListener('input', (e) => {
    config.particleLife = parseInt(e.target.value);
    document.getElementById('lifeValue').textContent = config.particleLife;
});

// 重力滑块
gravitySlider.addEventListener('input', (e) => {
    config.gravity = parseFloat(e.target.value);
    document.getElementById('gravityValue').textContent = config.gravity;
});

// 清空画布按钮
clearBtn.addEventListener('click', () => {
    particles = []; // 清空粒子数组
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 完全清除画布
});

// 暂停/继续按钮
pauseBtn.addEventListener('click', () => {
    config.isPaused = !config.isPaused; // 切换暂停状态
    pauseBtn.textContent = config.isPaused ? '继续' : '暂停';
});

// 重置参数按钮
resetBtn.addEventListener('click', () => {
    // 重置配置为默认值
    config.maxParticles = 50;
    config.particleSize = 5;
    config.particleColor = '#00aaff';
    config.particleSpeed = 3;
    config.particleLife = 100;
    config.gravity = 0;

    // 重置控件显示
    particleCountSlider.value = 50;
    particleSizeSlider.value = 5;
    particleColorPicker.value = '#00aaff';
    particleSpeedSlider.value = 3;
    particleLifeSlider.value = 100;
    gravitySlider.value = 0;

    // 更新显示值
    document.getElementById('countValue').textContent = '50';
    document.getElementById('sizeValue').textContent = '5';
    document.getElementById('speedValue').textContent = '3';
    document.getElementById('lifeValue').textContent = '100';
    document.getElementById('gravityValue').textContent = '0';
});

// 折叠/展开面板按钮
togglePanelBtn.addEventListener('click', () => {
    controlPanel.classList.toggle('collapsed');
    togglePanelBtn.textContent = controlPanel.classList.contains('collapsed') ? '<' : '>';
});

// ==========================================
// 页面加载时初始化
// ==========================================
window.addEventListener('load', () => {
    // 初始化画布大小
    resizeCanvas();

    // 启动动画循环
    requestAnimationFrame(animate);

    // 在控制台输出提示信息
    console.log('粒子动画系统已启动！移动鼠标生成粒子效果。');
    console.log('Particle Animation System initialized! Move your mouse to create particles.');
});
