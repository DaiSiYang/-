import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      component: () => import('../components/layout/Layout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('../views/dashboard/Index.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'wallet',
          name: 'WalletList',
          component: () => import('../views/wallet/List.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'wallet/create',
          name: 'CreateWallet',
          component: () => import('../views/wallet/Create.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'transactions',
          name: 'Transactions',
          component: () => import('../views/transactions/History.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('../views/settings/Index.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/auth',
      component: () => import('../components/layout/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import('../views/auth/Login.vue')
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('../views/auth/Register.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  console.log('Route navigation:', { 
    to: { path: to.path, name: to.name, meta: to.meta },
    from: { path: from.path, name: from.name },
    token: !!token,
    matched: to.matched.map(record => record.path)
  })
  
  if (to.meta.requiresAuth && !token) {
    console.log('Authentication required, redirecting to login')
    ElMessage.warning('请先登录')
    next('/auth/login')
  } else if (token && to.path.startsWith('/auth')) {
    console.log('Already authenticated, redirecting to dashboard')
    next('/dashboard')
  } else {
    console.log('Proceeding with navigation')
    next()
  }
})

export default router
