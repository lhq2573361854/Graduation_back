<template>
  <div >
    <v-navigation-drawer
        v-model="drawer"
        app
        width="280"
    >
      <SideBar></SideBar>
    </v-navigation-drawer>

    <v-app-bar app color="#1976d2" >
      <v-app-bar-nav-icon  @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title >{{ getTitle | defaultTitle | capitalize}}</v-toolbar-title>
      <v-spacer></v-spacer>
        <v-switch
            color="black"
            @change="setTheme"
            hide-details
        ></v-switch>



    </v-app-bar>

    <v-main class="ma-4" >
      <my-transition >
        <keep-alive>
          <router-view  v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </my-transition>
    </v-main>
  </div>
</template>

<script>
import Vue from 'vue'
import { createSimpleTransition } from 'vuetify/lib/components/transitions/createTransition'
const myTransition = createSimpleTransition('my-transition')

Vue.component('my-transition', myTransition)
import {mapGetters} from 'vuex'

export default {
  name:'Main',
  data(){
    return{
      drawer:null,
      active:false
    }
  },
  created() {
    console.log(this.$vuetify.theme.dark)
  },
  methods:{
    setTitle(title){
      this.title = title
    },
    setTheme(value){
      document.body.style.background= 'darkgreen'
      this.$vuetify.theme.dark  = value
    }
  },
  computed:{
    ...mapGetters(["getTitle"])
  },
  components:{
    SideBar:()=> import('@/components/SideBar')
  },
  filters:{
    defaultTitle(value){
      return value || '博客后台管理系统'
    },
    capitalize(value){
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }

  }
}
</script>

<style  lang="sass">
.my-transition
  &-enter-active
    transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0s
  &-enter-to
     opacity: 1
  &-enter
    opacity: 0
</style>
