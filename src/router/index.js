import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Home from '../views/Home.vue'
import Myposts from '../views/Myposts.vue'
import Createposts from '../views/Createposts.vue'
import Viewedpost from '../views/Viewedpost.vue'






const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'reg',
      component: Register
    },
    {
      path: '/login',
      name: 'log',
      component: Login
    },

    {
      path: '/home',
      name: 'home',
      component: Home
    },

    {
      path: '/dashboard',
      name: 'dash',
      component: Dashboard
    },

    {
      path: '/myposts',
      name: 'mypost',
      component: Myposts
    },

    {
      path: '/createposts',
      name: 'createpost',
      component: Createposts
    },

    {
       path: '/:uid/view-author',
      name: 'viewed',
      component: Viewedpost,
      props: true
    }
    
  
  
  ]
})

export default router
