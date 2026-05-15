import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/eval/:expr',
    name: 'eval-expr',
    component: () => import('@/views/Calculator.vue'),
    // Mappa automaticamente ":id" come prop del componente
    props: true,
  },
]

// 2. Create the router instance
export const router = createRouter({
  // Use HTML5 history mode (requires server config)
  history: createWebHistory(),
  routes,
})
