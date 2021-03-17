import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    title:''
  },
  mutations: {
    setTitle:(state, payload) => {
      state.title = payload
    }
  },
  actions: {
  },
  getters: {
    getTitle:state => {
      return state.title
    }
  }
})
