import { createRouter, createWebHistory } from 'vue-router'
import Push from '@/view/Push.vue'
import Post from '@/view/Post.vue'
import Profile from '@/view/Profile.vue'
import Detail from '@/view/Detail.vue'

const routes = [
  {
    path: '/',
    alias: '/push',
    name: 'Push',
    component: Push,
  },
  {
    path: '/post',
    name: 'Post',
    component: Post,
  },
  {
    path: '/profile/:userId',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/detail/:postId',
    name: 'Detail',
    component: Detail,
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach((to, from, next) => {
  if (to.name !== 'Push') {
    window.scrollTo(0, 0)
  }
  next()
})
export default router
