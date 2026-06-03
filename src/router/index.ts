import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import AppLayout from '../layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'SplashScreen',
    component: () => import('../views/SplashScreen.vue')
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('../views/Onboarding.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { guest: true }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import('../views/PrivacyPolicy.vue')
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('../views/Terms.vue')
  },
  {
    path: '/home',
    component: AppLayout,
    meta: { requiresAuth: true },
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
      },
      {
        path: 'edit-profile',
        name: 'EditProfile',
        component: () => import('../views/EditProfile.vue')
      },
      {
        path: 'about-ppn',
        name: 'AboutPPN',
        component: () => import('../views/AboutPPN.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard: redirect to login if not authenticated
router.beforeEach((to, _from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  const isSplashScreen = to.name === 'SplashScreen'
  const isOnboarding = to.name === 'Onboarding'

  // Allow splash screen and onboarding routes without authentication
  if (isSplashScreen || isOnboarding) {
    next()
    return
  }

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.matched.some(record => record.meta.guest) && isAuthenticated) {
    // Already logged in users shouldn't see login/register
    next('/home')
  } else {
    next()
  }
})

export default router
