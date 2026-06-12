/**
 * 项目 04: 天气信息模拟器 (Weather Simulator)
 * 
 * 功能说明：
 * - 模拟多个城市的天气信息
 * - 通过下拉菜单选择城市
 * - 动态显示温度、湿度、风速等详细信息
 * - 根据天气类型改变页面背景
 * - 显示未来三天的天气预报
 * 
 * 适合初学者：每个概念都有详细的中文注释
 * 
 * 知识点：
 * - JSON 数据结构
 * - 对象属性访问
 * - 动态 UI 更新
 * - 事件监听
 */

// ============================================================
// 第 1 部分：天气数据（模拟的 JSON 数据）
// ============================================================

/**
 * 天气数据
 * 
 * 知识点：JSON (JavaScript Object Notation)
 * JSON 是一种轻量级的数据交换格式，使用键值对存储数据
 * 
 * JSON 对象语法：
 * {
 *   "键名": 值,          // 字符串、数字、布尔、数组、对象
 *   "数组键": [值1, 值2]  // 数组用方括号 [] 包围
 * }
 * 
 * 访问对象属性的两种方式：
 * 1. 点表示法：weatherData.beijing.temperature  返回 22
 * 2. 方括号表示法：weatherData["beijing"]["temperature"]  返回 22
 *    （当键名是变量或包含特殊字符时，必须使用方括号）
 */
const weatherData = {
  beijing: {
    name: "北京",
    country: "中国",
    current: {
      temperature: 22,        // 当前温度（摄氏度）
      humidity: 45,           // 湿度（百分比）
      windSpeed: 12,          // 风速（km/h）
      pressure: 1013,         // 气压（hPa）
      visibility: 10,         // 能见度（km）
      feelsLike: 21,          // 体感温度（摄氏度）
      uvIndex: 6,             // 紫外线指数（0-11+）
      condition: "sunny",     // 天气状况代码
      description: "晴朗"     // 天气描述
    },
    forecast: [               // 未来三天预报（数组）
      {
        date: "明天",
        temperature: 24,
        condition: "sunny",
        icon: "☀️",
        description: "晴"
      },
      {
        date: "后天",
        temperature: 20,
        condition: "cloudy",
        icon: "⛅",
        description: "多云"
      },
      {
        date: "大后天",
        temperature: 18,
        condition: "rainy",
        icon: "🌧️",
        description: "小雨"
      }
    ]
  },
  shanghai: {
    name: "上海",
    country: "中国",
    current: {
      temperature: 26,
      humidity: 70,
      windSpeed: 8,
      pressure: 1010,
      visibility: 8,
      feelsLike: 28,
      uvIndex: 5,
      condition: "cloudy",
      description: "多云"
    },
    forecast: [
      {
        date: "明天",
        temperature: 25,
        condition: "rainy",
        icon: "🌧️",
        description: "阵雨"
      },
      {
        date: "后天",
        temperature: 23,
        condition: "rainy",
        icon: "🌧️",
        description: "中雨"
      },
      {
        date: "大后天",
        temperature: 24,
        condition: "cloudy",
        icon: "⛅",
        description: "阴转多云"
      }
    ]
  },
  tokyo: {
    name: "东京",
    country: "日本",
    current: {
      temperature: 18,
      humidity: 60,
      windSpeed: 15,
      pressure: 1015,
      visibility: 12,
      feelsLike: 17,
      uvIndex: 4,
      condition: "rainy",
      description: "小雨"
    },
    forecast: [
      {
        date: "明天",
        temperature: 16,
        condition: "rainy",
        icon: "🌧️",
        description: "中雨"
      },
      {
        date: "后天",
        temperature: 17,
        condition: "overcast",
        icon: "☁️",
        description: "阴"
      },
      {
        date: "大后天",
        temperature: 19,
        condition: "cloudy",
        icon: "⛅",
        description: "多云"
      }
    ]
  },
  london: {
    name: "伦敦",
    country: "英国",
    current: {
      temperature: 12,
      humidity: 80,
      windSpeed: 20,
      pressure: 1008,
      visibility: 6,
      feelsLike: 10,
      uvIndex: 2,
      condition: "foggy",
      description: "雾"
    },
    forecast: [
      {
        date: "明天",
        temperature: 11,
        condition: "rainy",
        icon: "🌧️",
        description: "小雨"
      },
      {
        date: "后天",
        temperature: 13,
        condition: "cloudy",
        icon: "☁️",
        description: "多云"
      },
      {
        date: "大后天",
        temperature: 14,
        condition: "overcast",
        icon: "☁️",
        description: "阴"
      }
    ]
  },
  newyork: {
    name: "纽约",
    country: "美国",
    current: {
      temperature: 15,
      humidity: 55,
      windSpeed: 18,
      pressure: 1012,
      visibility: 15,
      feelsLike: 13,
      uvIndex: 3,
      condition: "overcast",
      description: "阴"
    },
    forecast: [
      {
        date: "明天",
        temperature: 14,
        condition: "stormy",
        icon: "⛈️",
        description: "雷暴"
      },
      {
        date: "后天",
        temperature: 10,
        condition: "rainy",
        icon: "🌧️",
        description: "大雨"
      },
      {
        date: "大后天",
        temperature: 12,
        condition: "cloudy",
        icon: "⛅",
        description: "多云"
      }
    ]
  },
  moscow: {
    name: "莫斯科",
    country: "俄罗斯",
    current: {
      temperature: -5,
      humidity: 75,
      windSpeed: 25,
      pressure: 1020,
      visibility: 4,
      feelsLike: -10,
      uvIndex: 1,
      condition: "snowy",
      description: "雪"
    },
    forecast: [
      {
        date: "明天",
        temperature: -8,
        condition: "snowy",
        icon: "❄️",
        description: "大雪"
      },
      {
        date: "后天",
        temperature: -6,
        condition: "snowy",
        icon: "🌨️",
        description: "小雪"
      },
      {
        date: "大后天",
        temperature: -3,
        condition: "overcast",
        icon: "☁️",
        description: "阴"
      }
    ]
  }
};

// ============================================================
// 第 2 部分：天气图标映射
// ============================================================

/**
 * 天气状况代码到 emoji 图标的映射
 * 
 * 知识点：对象作为字典/映射使用
 * 使用对象的键来查找对应的值，类似于其他语言中的字典或哈希表
 */
const weatherIcons = {
  sunny: "☀️",        // 晴天
  cloudy: "⛅",       // 多云
  overcast: "☁️",     // 阴天
  rainy: "🌧️",       // 雨天
  snowy: "❄️",       // 雪天
  stormy: "⛈️",      // 雷暴
  foggy: "🌫️"        // 雾天
};

// ============================================================
// 第 3 部分：获取 DOM 元素
// ============================================================

/**
 * 获取所有需要操作的 DOM 元素
 * document.getElementById() 通过元素的 id 属性获取元素
 */
const citySelect = document.getElementById('city-select');         // 城市下拉框
const weatherIcon = document.getElementById('weather-icon');      // 天气图标
const cityName = document.getElementById('city-name');            // 城市名称
const temperature = document.getElementById('temperature');       // 温度
const weatherDesc = document.getElementById('weather-desc');      // 天气描述
const humidity = document.getElementById('humidity');             // 湿度
const windSpeed = document.getElementById('wind-speed');          // 风速
const pressure = document.getElementById('pressure');             // 气压
const visibility = document.getElementById('visibility');         // 能见度
const feelsLike = document.getElementById('feels-like');          // 体感温度
const uvIndex = document.getElementById('uv-index');              // 紫外线指数
const suggestion = document.getElementById('suggestion');         // 建议信息
const forecastContainer = document.getElementById('forecast-container'); // 预报容器

// ============================================================
// 第 4 部分：函数 - 初始化城市选择器
// ============================================================

/**
 * 初始化城市下拉选择器
 * 遍历 weatherData 对象，为每个城市创建一个 option 元素
 * 
 * 知识点：for...in 循环
 * for...in 循环用于遍历对象的可枚举属性
 * 语法：for (const 键 in 对象) { 处理代码 }
 */
const initCitySelector = () => {
  // 遍历天气数据中的所有城市
  for (const cityKey in weatherData) {
    // 使用 hasOwnProperty() 确保只遍历对象自身的属性，不包括原型链上的属性
    if (weatherData.hasOwnProperty(cityKey)) {
      // 获取城市数据
      const city = weatherData[cityKey];
      
      // 创建 option 元素
      // document.createElement() 创建一个新的 HTML 元素
      const option = document.createElement('option');
      
      // 设置 option 的值（用于程序内部识别）
      option.value = cityKey;
      
      // 设置 option 显示的文本
      // 使用模板字符串拼接城市和国家的名称
      option.textContent = `${city.name} - ${city.country}`;
      
      // 将 option 添加到下拉框中
      // appendChild() 将元素添加为指定元素的最后一个子元素
      citySelect.appendChild(option);
    }
  }
};

// ============================================================
// 第 5 部分：函数 - 生成建议信息
// ============================================================

/**
 * 根据天气状况生成生活建议
 * 
 * 知识点：条件判断和模板字符串
 * 根据不同的天气条件，给出不同的生活建议
 * 
 * @param {Object} current - 当前天气数据对象
 * @returns {string} 生活建议文本
 */
const generateSuggestion = (current) => {
  // 使用 switch 语句根据不同的天气状况返回不同的建议
  switch (current.condition) {
    case 'sunny':
      return '☀️ 今天天气很好！适合外出活动，记得涂防晒霜哦。';
    case 'cloudy':
      return '⛅ 多云天气，气温适宜，可以带件薄外套出门。';
    case 'overcast':
      return '☁️ 阴天，可能会下雨，建议携带雨伞出门。';
    case 'rainy':
      return '🌧️ 今天有雨，出门记得带伞，注意路滑。';
    case 'snowy':
      return '❄️ 下雪啦！注意保暖，路面可能湿滑，小心慢行。';
    case 'stormy':
      return '⛈️ 雷暴天气，尽量减少外出，注意安全！';
    case 'foggy':
      return '🌫️ 雾天能见度低，开车请减速慢行，开启雾灯。';
    default:
      return '请根据天气状况合理安排出行。';
  }
};

// ============================================================
// 第 6 部分：函数 - 更新天气显示
// ============================================================

/**
 * 更新页面上的天气信息
 * 
 * 知识点：对象属性访问
 * 使用点表示法访问嵌套对象的属性
 * 例如：cityData.current.temperature 访问当前温度
 * 
 * @param {string} cityKey - 城市的键名（如 "beijing"）
 */
const updateWeatherDisplay = (cityKey) => {
  // 获取选中城市的数据
  // 使用方括号表示法，因为键名存储在变量中
  const cityData = weatherData[cityKey];
  
  // 获取当前天气数据
  const current = cityData.current;
  
  // 更新城市名称
  // 模板字符串可以嵌入变量：`${变量}`
  cityName.textContent = `${cityData.name}, ${cityData.country}`;
  
  // 更新天气图标
  weatherIcon.textContent = weatherIcons[current.condition];
  
  // 更新温度
  temperature.textContent = current.temperature;
  
  // 更新天气描述
  weatherDesc.textContent = current.description;
  
  // 更新详细信息
  humidity.textContent = `${current.humidity}%`;
  windSpeed.textContent = `${current.windSpeed} km/h`;
  pressure.textContent = `${current.pressure} hPa`;
  visibility.textContent = `${current.visibility} km`;
  feelsLike.textContent = `${current.feelsLike}°C`;
  uvIndex.textContent = current.uvIndex;
  
  // 更新建议信息
  suggestion.textContent = generateSuggestion(current);
  
  // 更新页面背景
  // classList.remove() 移除所有天气类名
  document.body.classList.remove('sunny', 'cloudy', 'overcast', 'rainy', 'snowy', 'stormy', 'foggy');
  // classList.add() 添加当前天气的类名，触发 CSS 中的背景渐变
  document.body.classList.add(current.condition);
  
  // 更新天气预报
  updateForecast(cityData.forecast);
};

// ============================================================
// 第 7 部分：函数 - 更新天气预报
// ============================================================

/**
 * 更新未来三天的天气预报显示
 * 
 * 知识点：数组遍历和动态创建元素
 * 为每条预报创建一个卡片元素并添加到页面中
 * 
 * @param {Array} forecast - 天气预报数组
 */
const updateForecast = (forecast) => {
  // 清空当前的预报内容
  // innerHTML = '' 清空元素的所有子元素
  forecastContainer.innerHTML = '';
  
  // 遍历预报数据
  // forEach() 对数组中的每个元素执行回调函数
  forecast.forEach((day) => {
    // 创建预报卡片
    const card = document.createElement('div');
    card.className = 'forecast-card';  // 添加 CSS 类名
    
    // 使用模板字符串设置卡片内容
    card.innerHTML = `
      <div class="forecast-date">${day.date}</div>
      <div class="forecast-icon">${day.icon}</div>
      <div class="forecast-temp">${day.temperature}°C</div>
      <div class="forecast-desc">${day.description}</div>
    `;
    
    // 将卡片添加到预报容器
    forecastContainer.appendChild(card);
  });
};

// ============================================================
// 第 8 部分：事件监听器
// ============================================================

/**
 * 城市选择器变化事件
 * 当用户选择不同的城市时触发
 * 
 * event.target.value 获取下拉框当前选中的值
 */
citySelect.addEventListener('change', (event) => {
  // 获取选中的城市键名
  const selectedCity = event.target.value;
  
  // 更新天气显示
  updateWeatherDisplay(selectedCity);
  
  // 在控制台输出信息（方便调试）
  console.log(`已切换到：${weatherData[selectedCity].name}`);
});

// ============================================================
// 第 9 部分：页面加载初始化
// ============================================================

/**
 * DOMContentLoaded 事件
 * 当 HTML 文档完全加载后触发
 */
document.addEventListener('DOMContentLoaded', () => {
  // 初始化城市选择器
  initCitySelector();
  
  // 默认显示第一个城市（北京）的天气
  // Object.keys() 返回对象所有键名组成的数组
  const defaultCity = Object.keys(weatherData)[0];
  
  // 设置下拉框的默认选中项
  citySelect.value = defaultCity;
  
  // 更新天气显示
  updateWeatherDisplay(defaultCity);
  
  // 在控制台输出欢迎信息
  console.log('天气信息模拟器已加载！');
  console.log(`可用城市：${Object.keys(weatherData).length} 个`);
});
