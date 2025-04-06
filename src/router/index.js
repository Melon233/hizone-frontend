import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/view/Push.vue'),
  },
  {
    path: '/push',
    name: 'Push',
    component: () => import('@/view/Push.vue'),
  },
  {
    path: '/post',
    name: 'Post',
    component: () => import('@/view/Post.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/view/Profile.vue'),
  },
  {
    path: '/detail/:postId',
    name: 'Detail',
    component: () => import('@/view/Detail.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
