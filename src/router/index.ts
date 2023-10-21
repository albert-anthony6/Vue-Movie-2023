import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/category/:categoryName',
      name: 'catgegory',
      component: () => import('@/views/CategoryView.vue')
    },
  ]
})

export default router
