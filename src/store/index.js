import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    title:'',
    currentUser:'',
    updateCurrentUser:(state, payload) =>{
      state.currentUser = payload
    },
  },
  mutations: {
    setTitle:(state, payload) => {
      state.title = payload
    },
    setCurrentUser:(state, payload) =>{
      state.currentUser = payload
    },
  },
  actions: {

  },
  getters: {
    getTitle:state => {
      return state.title
    },
    getAuth:state => {
      return !!state.currentUser && !!state.currentUser.isAuth
    },
    getUserInfo:state => {
      return state.currentUser && state.currentUser.userinfo
    },
    getUserInfoId:state => {
      return state.currentUser && state.currentUser.userinfo && state.currentUser.userinfo.id
    }
  }
})
