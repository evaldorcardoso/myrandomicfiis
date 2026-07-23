import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: () => import('@/views/RankingView.vue'),
    },
    {
      path: '/simulador',
      name: 'simulador',
      component: () => import('@/views/SimuladorView.vue'),
    },
  ],
})

export default router
