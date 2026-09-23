import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to handle redirection
router.beforeEach((to, from, next) => {
  const isLogged = sessionStorage.getItem('usuarioLogueado')
  if (to.path === '/dashboard' && !isLogged) {
    next('/')
  } else if (to.path === '/' && isLogged) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
