import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import AppLayout from '../layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'schedule',
        name: 'Schedule',
        component: () => import('../views/Schedule.vue')
      },
      {
        path: 'report',
        name: 'Report',
        component: () => import('../views/Report.vue')
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('../views/Chat.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue')
      },
      {
        path: 'commodity',
        name: 'Commodity',
        component: () => import('../views/Commodity.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
