# 项目 03: Vite + Vue 3 实战 🟢

## 🎯 项目目标
使用 Vite + Vue 3 构建一个包含路由和状态管理的完整单页应用（SPA），掌握 Vue 3 组合式 API 的核心用法。

## 📚 核心知识点

### 1. Vue 3 组合式 API
Vue 3 引入了 Composition API，使用 `<script setup>` 语法糖：
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

// ref() 创建响应式数据
const name = ref('Vue Developer')

// computed() 创建计算属性
const greeting = computed(() => `Hello, ${name.value}!`)
</script>

<template>
  <!-- v-model 双向绑定 -->
  <input v-model="name" />
  <!-- 模板插值 -->
  <p>{{ greeting }}</p>
</template>
```

### 2. 单文件组件（SFC）
Vue 的 `.vue` 文件将模板、逻辑、样式组织在一起：
```vue
<script setup lang="ts">
// 逻辑：TypeScript 代码
</script>

<template>
  <!-- 模板：HTML + Vue 指令 -->
</template>

<style scoped>
/* 样式：scoped 表示只作用于当前组件 */
</style>
```

### 3. Vue 常用指令
| 指令 | 用途 | 示例 |
|------|------|------|
| `v-bind` / `:` | 绑定属性 | `<img :src="url" />` |
| `v-on` / `@` | 绑定事件 | `<button @click="handleClick">` |
| `v-model` | 双向绑定 | `<input v-model="text" />` |
| `v-if` / `v-else` | 条件渲染 | `<p v-if="show">Visible</p>` |
| `v-for` | 列表渲染 | `<li v-for="item in list">` |
| `v-show` | 显示/隐藏 | `<div v-show="isVisible">` |

### 4. Vue Router（路由）
实现页面间的导航，无需刷新浏览器：
```typescript
// router.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./views/HomeView.vue') },
    { path: '/counter', component: () => import('./views/CounterView.vue') },
    { path: '/todos', component: () => import('./views/TodosView.vue') },
  ],
})
```

```vue
<!-- App.vue 中使用 -->
<RouterLink to="/">Home</RouterLink>
<RouterView />  <!-- 路由出口：显示当前路由对应的组件 -->
```

### 5. Pinia（状态管理）
Pinia 是 Vue 3 推荐的状态管理库，替代 Vuex：
```typescript
// stores/counter.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // State（状态）
  const count = ref(0)

  // Getters（计算属性）
  const doubleCount = computed(() => count.value * 2)

  // Actions（操作）
  function increment() { count.value++ }
  function decrement() { count.value-- }

  return { count, doubleCount, increment, decrement }
})
```

```vue
<!-- 在组件中使用 -->
<script setup>
import { useCounterStore } from '../stores/counter'
const store = useCounterStore()
</script>

<template>
  <p>{{ store.count }}</p>
  <button @click="store.increment">+</button>
</template>
```

### 6. TransitionGroup（列表动画）
为列表项添加进出动画：
```vue
<TransitionGroup name="todo" tag="ul">
  <li v-for="item in list" :key="item.id">{{ item.text }}</li>
</TransitionGroup>

<style>
.todo-enter-active, .todo-leave-active {
  transition: all 0.3s ease;
}
.todo-enter-from { opacity: 0; transform: translateX(-20px); }
.todo-leave-to { opacity: 0; transform: translateX(20px); }
</style>
```

## 📖 代码解析

### 项目结构
```
03-vite-vue-app/
├── index.html              # 入口 HTML
├── vite.config.ts          # Vite + Vue 插件配置
├── tsconfig.json           # TypeScript 配置
├── src/
│   ├── main.ts             # 应用入口：创建 Vue 实例
│   ├── App.vue             # 根组件：导航 + 路由出口
│   ├── router.ts           # 路由配置
│   ├── style.css           # 全局样式
│   ├── env.d.ts            # Vue SFC 类型声明
│   ├── stores/
│   │   ├── counter.ts      # Pinia 计数器 Store
│   │   └── todos.ts        # Pinia 待办 Store
│   └── views/
│       ├── HomeView.vue    # 首页：特性展示
│       ├── CounterView.vue # 计数器：Pinia 演示
│       └── TodosView.vue   # 待办：CRUD 演示
└── package.json
```

### 数据流
```
用户交互 → Vue 组件 → Pinia Store → 响应式更新 → 视图刷新
                ↕
          Vue Router → 页面切换（无刷新）
```

## 🚀 运行方式

```bash
cd 04-vite-projects/03-vite-vue-app
npm install
npm run dev              # 启动开发服务器
```

浏览器自动打开 `http://localhost:5173`，可以：
- 首页：修改名字观察响应式更新
- Counter：使用 Pinia 管理的计数器
- Todos：完整的待办事项 CRUD

```bash
npm run build            # TypeScript 检查 + 生产构建
npm run preview          # 预览生产构建
```

## ❌ 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `VueCompilerError: v-model requires` | v-model 用在非表单元素 | 只在 input/select/textarea 上使用 |
| `Store is not defined` | 未正确导入 Store | 检查 `import { useXxxStore }` |
| `Cannot find module 'vue-router'` | 未安装依赖 | 运行 `npm install` |
| `ref value is not reactive` | 在模板外忘记用 `.value` | JS 中访问用 `ref.value`，模板中自动解包 |

## 🔧 调试技巧

1. **Vue DevTools**：安装浏览器扩展，查看组件树、Pinia 状态、路由信息
2. **`<script setup>` 中的类型推断**：VS Code + Volar 扩展提供完整的类型支持
3. **响应式调试**：在 `watch()` 中观察数据变化

## 🏆 挑战任务

### ⭐ 简单
在 Counter 页面添加一个「步长」输入框，可以自定义每次点击的增减量

### ⭐⭐ 中等
为 Todos 添加「编辑」功能：双击待办项可以修改文本

### ⭐⭐⭐ 困难
添加一个新页面「About」，使用 Vue Router 的嵌套路由和导航守卫

## 📖 延伸学习

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vue Router 文档](https://router.vuejs.org/zh/)
- [Pinia 文档](https://pinia.vuejs.org/zh/)
- [Vue SFC 语法](https://cn.vuejs.org/guide/scaling-up/sfc.html)
