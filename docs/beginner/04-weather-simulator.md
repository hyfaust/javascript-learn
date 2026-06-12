# 项目 04: 天气信息模拟器 (Weather Simulator)

## 项目目标

创建一个天气信息模拟器，通过静态 JSON 数据模拟多个城市的天气信息。用户可以选择不同城市，查看当前天气状况、详细气象数据以及未来三天的天气预报。通过这个项目，你将学习 JavaScript 中如何组织和访问复杂数据结构、动态更新 UI、以及使用 CSS 实现主题化设计。

## 核心知识点

1. **JSON 数据结构**: 嵌套对象和数组的组织方式
2. **对象属性访问**: 点表示法 vs 方括号表示法
3. **for...in 循环**: 遍历对象的属性
4. **DOM 动态更新**: 创建元素、修改内容、切换 CSS 类
5. **事件监听**: `change` 事件处理下拉框选择变化
6. **模板字符串**: 嵌入变量和表达式的字符串写法
7. **CSS Grid 布局**: 使用 `grid-template-columns` 创建网格
8. **CSS 主题切换**: 通过切换 body 类名改变整体背景

## 代码解析

### script.js 结构

```
script.js
├── 第 1 部分：天气数据            - 6 个城市的 JSON 数据
├── 第 2 部分：天气图标映射        - 天气代码到 emoji 的映射
├── 第 3 部分：获取 DOM 元素       - 获取所有需要操作的元素
├── 第 4 部分：初始化城市选择器    - 动态生成下拉选项
├── 第 5 部分：生成建议信息        - 根据天气给出生活建议
├── 第 6 部分：更新天气显示        - 核心 UI 更新逻辑
├── 第 7 部分：更新天气预报        - 渲染未来三天预报
├── 第 8 部分：事件监听器          - 处理城市选择变化
└── 第 9 部分：页面加载初始化      - DOMContentLoaded 事件
```

### 关键概念解释

#### JSON 数据结构
```javascript
const weatherData = {
  beijing: {                    // 外层：城市键名
    name: "北京",                // 城市信息
    current: {                  // 当前天气（嵌套对象）
      temperature: 22,          // 温度
      humidity: 45,             // 湿度
      // ... 更多属性
    },
    forecast: [                 // 预报（数组）
      { date: "明天", temperature: 24, ... },
      // ... 更多预报
    ]
  }
};
```

#### 对象属性访问
```javascript
// 点表示法：适用于键名已知且合法的情况
cityData.current.temperature    // 返回 22

// 方括号表示法：适用于键名是变量或特殊字符的情况
const key = "beijing";
weatherData[key]                // 返回北京的数据
weatherData["beijing"]          // 等同于上面

// 嵌套访问
weatherData.beijing.current.humidity  // 返回 45
```

#### for...in 循环
```javascript
for (const cityKey in weatherData) {
  // cityKey 依次是 "beijing", "shanghai", "tokyo", ...
  const city = weatherData[cityKey];
  console.log(city.name);
}
```

#### CSS 主题切换
```javascript
// 移除所有天气类
document.body.classList.remove('sunny', 'cloudy', 'rainy', ...);
// 添加当前天气类，触发 CSS 中的背景渐变
document.body.classList.add(current.condition);
```

## 运行方式

1. 直接用浏览器打开 `index.html` 文件
2. 可以使用 VS Code 的 Live Server 插件
3. 从下拉菜单中选择不同城市查看天气

### 数据说明

本项目包含 6 个城市的模拟数据：
- **北京** (中国) - 晴天，22°C
- **上海** (中国) - 多云，26°C
- **东京** (日本) - 小雨，18°C
- **伦敦** (英国) - 雾，12°C
- **纽约** (美国) - 阴，15°C
- **莫斯科** (俄罗斯) - 雪，-5°C

## 常见错误

### 1. 访问不存在的属性
- **现象**: `TypeError: Cannot read properties of undefined`
- **原因**: 尝试访问未定义的对象属性
- **解决**: 使用 `console.log()` 检查对象结构，确保属性名正确

### 2. for...in 遍历原型链属性
- **现象**: 遍历到了意外的属性
- **原因**: for...in 会遍历原型链上的可枚举属性
- **解决**: 使用 `hasOwnProperty()` 过滤，如代码中所示

### 3. CSS 类名不匹配
- **现象**: 背景没有根据天气变化
- **原因**: JavaScript 添加的类名与 CSS 中定义的类名不一致
- **解决**: 确保两者使用相同的类名（如 `sunny`, `cloudy` 等）

### 4. innerHTML 清空导致事件丢失
- **现象**: 动态创建的元素事件不工作
- **原因**: 使用 `innerHTML = ''` 会清空元素及其事件监听器
- **解决**: 事件委托或重新绑定事件（本项目不涉及此问题）

## 调试技巧

1. **查看数据结构**: 在控制台输入 `weatherData` 查看完整的数据结构
2. **测试属性访问**: 输入 `weatherData.beijing.current.temperature` 测试访问
3. **修改数据**: 直接在控制台修改 `weatherData.beijing.current.temperature = 30` 查看效果
4. **检查 CSS 类**: 在 Elements 面板查看 body 的类名，确认主题切换是否生效
5. **添加日志**: 在 `updateWeatherDisplay` 函数中添加 `console.log()` 查看数据流

## 挑战任务

### 简单
- [ ] 添加更多城市数据（如巴黎、悉尼、迪拜等）
- [ ] 修改天气图标的显示方式（使用图片代替 emoji）
- [ ] 在建议信息中添加温度相关的提示（如 "今天很热，注意防暑"）

### 中等
- [ ] 添加温度单位切换功能（摄氏度 °C / 华氏度 °F）
  - 转换公式：`°F = °C × 9/5 + 32`
- [ ] 实现搜索功能：输入城市名快速定位
- [ ] 添加天气数据刷新按钮（模拟数据更新）
- [ ] 根据紫外线指数给出防晒建议（0-2: 不需要, 3-5: 适度, 6-7: 加强, 8+: 避免外出）

### 困难
- [ ] 接入真实的天气 API（如 OpenWeatherMap）
  - 使用 `fetch()` 获取真实数据
  - 处理 API 返回的 JSON 数据
  - 处理网络错误和加载状态
- [ ] 添加天气地图：在简易地图上标记城市位置
- [ ] 实现天气预警系统：当极端天气时显示警告
- [ ] 添加数据缓存：使用 `localStorage` 缓存最近查看的城市数据
- [ ] 实现多语言支持：中英文切换
