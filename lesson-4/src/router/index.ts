import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import('@/views/TaskManager.vue'),
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})