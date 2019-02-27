import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/posts',
      name: 'Posts',
      component: () => import('./components/Posts/Posts.vue')
    },
    {
      path: '/posts/:postId',
      name: 'Post',
      component: () => import('./components/Posts/Post.vue'),
      props: true
    },
    {
      path: '/post/add',
      name: 'AddPost',
      component: () => import('./components/Posts/AddPost.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('./components/Auth/Profile.vue'),
      beforeEnter(to, from, next){
        if(!store.getters.user){
          next({path: '/signin'})
        }else next()
      }
    },
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('./components/Auth/Signin.vue')
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('./components/Auth/Signup.vue')
    }
  ]
})

