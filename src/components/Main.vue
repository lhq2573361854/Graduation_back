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
      <v-toolbar-title >{{ getLangTile | defaultTitle | capitalize}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-switch
          color="red"
          @change="setTheme"
          hide-details
          label="主题切换"
          class="mx-2"
          inset
      ></v-switch>
      <v-switch
          color="black"
          @change="setLang"
          label="中英切换"
          hide-details
          inset
          class="mx-2"
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
  methods:{
    setTitle(title){
      this.title = title
    },
    setTheme(value){
      document.body.style.background= 'darkgreen'
      this.$vuetify.theme.dark  = value
    },
    setLang(value){
      value ? this.$i18n.locale = 'en' : this.$i18n.locale = 'zh'
    }
  },
  computed:{
    ...mapGetters(["getTitle"]),
    getLangTile(){
      return this.$t(`navbar.${this.getTitle}`)
    }
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
