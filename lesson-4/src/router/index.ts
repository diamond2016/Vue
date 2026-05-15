import { createRouter, createWebHistory } from 'vue-router'
import { defineRouteComponent } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'tasks',
    component: () => import('@/views/TaskManager.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})