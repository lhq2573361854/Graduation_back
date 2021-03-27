import Vue from 'vue'
import Vuex from 'vuex'
import request from "@/axios";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    title:'',
    currentUser:'',
    userList:[],
    categoryList:[]
  },
  mutations: {
    setTitle:(state, payload) => {
      state.title = payload
    },
    setCategoryList:(state, payload) => {
      state.categoryList = payload
    },
    setCurrentUser:(state, payload) =>{
      state.currentUser = payload
    },
    setUserList:(state, payload) =>{
      state.userList = payload
    },
    pushUserToUserList:(state, payload) => {
      state.userList.push(payload)
    },
    updateUserToUserList:(state, payload) => {
      console.log(payload)
      Object.assign(state.userList[payload.editedIndex],payload.editedItem)
    },
    deleteUserToUserList:(state, payload) => {
      state.userList.splice(payload,1)
    },
    pushCategoryToCategoryList:(state, payload) => {
      state.categoryList.push(payload)
    },
    updateCategoryToCategoryList:(state, payload) => {
      Object.assign(state.categoryList[payload.editedIndex],payload.editedItem)
    },
    deleteCategoryToCategoryList:(state, payload) => {
      state.categoryList.splice(payload,1)
    }

  },
  actions: {
     async getAllUserData({commit}){
      const result = await request.get("/user/getAllUser")
      commit('setUserList',result.data)
    },
    async getAllCategoryData({commit}){
      const result = await request.get("/category/getAllCategory")
      commit('setCategoryList',result.data)
    },
  },
  getters: {
    getTitle:state => {
      return state.title
    },
    getRole:state => {
      return state.currentUser && state.currentUser.role
    },
    getAuth:state => {
      return !!state.currentUser && !!state.currentUser.isAuth
    },
    getUserInfo:state => {
      return state.currentUser && state.currentUser.userinfo
    },
    getUserInfoId:state => {
      return state.currentUser && state.currentUser.userinfo && state.currentUser.userinfo.id
    },
    getUserList:state => {
      return state.userList
    },
    getUserName:state => (id)=> {
      return state.userList && state.userList.find(item=> item.id === id) &&  state.userList.find(item=> item.id === id)["userName"]
    },
    getCategoryList:state =>{
      return state.categoryList
    },
    getCategoryName:state => (id)=> {
      return state.categoryList && state.categoryList.find(item=> item.id === id) &&  state.categoryList.find(item=> item.id === id)["categoryName"]
    },
  }
})
