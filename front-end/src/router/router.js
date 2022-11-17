import { createRouter, createWebHistory } from 'vue-router'
import dashboardView from "../views/DashboardView.vue"
import formLogin from "../views/LoginView.vue"
import profileView from "../views/ProfileView.vue"
const routes = [
  {
    path: '/',
    name: 'login',
    component: formLogin,
  },
  {
    path: "/dashboard",
    component: dashboardView,
  },
  {
    path:"/profile",
    component: profileView,
    props:true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes:routes,
  linkActivelistitem:'active',
  linkExactActiveClass:'active',
 
})

export default router