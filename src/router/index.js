import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  {
    path:'/admin',
    name:'main',
    component:()=>import('@/components/Main'),
    meta:{
      keepAlive:true
    },
    children:[
      {
        path:'user',
        name:'user',
        component:()=>import('@/components/UserDataTable'),
        meta:{
          keepAlive:true
        }
      },
      {
        path:'article',
        name:'article',
        component:()=>import('@/components/ArticleDataTable'),
        meta:{
          keepAlive:true
        }
      },
      {
        path:'leaveMessage',
        name:'leaveMessage',
        component:()=>import('@/components/LeaveMessageDataTable'),
        meta:{
          keepAlive:true
        }
      },
      {
        path:'role',
        name:'role',
        component:()=>import('@/components/RoleDataTable'),
        meta:{
          keepAlive:true
        }
      },
      {
        path:'authority',
        name:'authority',
        component:()=>import('@/components/AuthorityDataTable'),
        meta:{
          keepAlive:true
        }
      },
      {
        path:'comment',
        name:'comment',
        component:()=>import('@/components/CommentDataTable'),
        meta:{
          keepAlive:true
        }
      },
      {
        path:'category',
        name:'category',
        component:()=>import('@/components/CategoryDataTable'),
        meta:{
          keepAlive:true,

        }
      },
      {
        path: 'post',
        name: 'post',
        component: () => import('@/components/PostFormCard'),
        meta: {
          keepAlive: true
        },
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/Login'),
    meta: {
      keepAlive: true
    },
  },


]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,

})

router.beforeEach((to, from, next) => {
  console.log(to.name)
  store.commit('setTitle',to.name)
  next()
})
export default router