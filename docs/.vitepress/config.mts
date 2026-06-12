import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'JavaScript 系统学习路径',
  description: '一套由浅入深、项目驱动的 JavaScript 学习路线，专为完全零基础初学者设计。',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '学习路线', link: '/guide/' },
      {
        text: '课程',
        items: [
          { text: '阶段一：基础入门', link: '/beginner/' },
          { text: '阶段二：进阶特性', link: '/intermediate/' },
          { text: '阶段三：现代开发实战', link: '/advanced/' },
          { text: '阶段四：Vite 项目', link: '/vite-projects/' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '学习路线总览', link: '/guide/' },
            { text: '环境配置', link: '/guide/environment' },
          ],
        },
      ],
      '/beginner/': [
        {
          text: '阶段一：基础入门',
          items: [
            { text: '总览', link: '/beginner/' },
            { text: '01 - 交互式待办清单', link: '/beginner/01-todo-list' },
            { text: '02 - 简易计算器', link: '/beginner/02-calculator' },
            { text: '03 - 猜数字游戏', link: '/beginner/03-guess-game' },
            { text: '04 - 天气信息模拟器', link: '/beginner/04-weather-simulator' },
            { text: '05 - 动态时钟', link: '/beginner/05-digital-clock' },
            { text: '06 - 数组方法实验室', link: '/beginner/06-array-playground' },
            { text: '07 - 表单验证器', link: '/beginner/07-form-validator' },
          ],
        },
      ],
      '/intermediate/': [
        {
          text: '阶段二：进阶特性',
          items: [
            { text: '总览', link: '/intermediate/' },
            { text: '01 - 箭头函数 vs 普通函数', link: '/intermediate/01-arrow-functions' },
            { text: '02 - 解构赋值', link: '/intermediate/02-destructuring' },
            { text: '03 - 模板字符串', link: '/intermediate/03-template-literals' },
            { text: '04 - Promise 与 async/await', link: '/intermediate/04-promises-async' },
            { text: '05 - ES Modules', link: '/intermediate/05-es-modules' },
            { text: '06 - 可选链与空值合并', link: '/intermediate/06-optional-chaining' },
          ],
        },
      ],
      '/advanced/': [
        {
          text: '阶段三：现代开发实战',
          items: [
            { text: '总览', link: '/advanced/' },
            { text: '01 - 鼠标跟随粒子动画', link: '/advanced/01-particle-animation' },
            { text: '02 - Node.js 命令行工具', link: '/advanced/02-node-cli-tool' },
            { text: '03 - Markdown 编辑预览器', link: '/advanced/03-markdown-editor' },
            { text: '04 - 油猴脚本', link: '/advanced/04-tampermonkey-script' },
            { text: '05 - 排序算法可视化', link: '/advanced/05-sort-visualizer' },
            { text: '06 - Express RESTful API', link: '/advanced/06-express-api-server' },
            { text: '07 - WebSocket 实时聊天', link: '/advanced/07-websocket-chat' },
            { text: '08 - SQLite 数据库 CRUD', link: '/advanced/08-database-crud' },
          ],
        },
      ],
      '/vite-projects/': [
        {
          text: '阶段四：Vite 项目',
          items: [
            { text: '总览', link: '/vite-projects/' },
            { text: '01 - Vite 纯 JS 应用', link: '/vite-projects/01-vite-vanilla-app' },
            { text: '02 - Vite + TypeScript', link: '/vite-projects/02-vite-ts-starter' },
            { text: '03 - Vite + Vue 3', link: '/vite-projects/03-vite-vue-app' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/' },
    ],

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'JavaScript 系统学习路径',
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },

    outline: {
      label: '页面导航',
      level: [2, 3],
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    lastUpdated: {
      text: '最后更新于',
    },

    editLink: {
      pattern: 'https://github.com/YOUR_REPO/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
  },
})
