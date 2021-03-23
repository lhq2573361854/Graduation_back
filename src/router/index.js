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
        path:'index',
        name:'index',
        component:()=>import('@/components/UserDataTable'),
        meta:{
          keepAlive:true
        }
      },
      {
        path:'user',
        name:'users',
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
        path:'profile',
        name:'profile',
        component:()=>import('@/components/UserProfile'),
        meta:{
          keepAlive:true,

        }
      },
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
  let userinfo = sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser")
  userinfo && store.commit("setCurrentUser",JSON.parse(userinfo))
  let auth = store.getters.getAuth

  if(to.path !== "/login" && !auth){
    next("/login");
  }else {
    store.commit('setTitle',to.name)
    next()
  }

})
export default router
