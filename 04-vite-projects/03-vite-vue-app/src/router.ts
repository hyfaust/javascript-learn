/**
 * Vue Router Configuration
 *
 * Core concepts:
 * - Route definitions
 * - Lazy-loaded routes
 * - Navigation guards
 */

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/HomeView.vue'),
    },
    {
      path: '/counter',
      name: 'counter',
      component: () => import('./views/CounterView.vue'),
    },
    {
      path: '/todos',
      name: 'todos',
      component: () => import('./views/TodosView.vue'),
    },
  ],
})

export default router
