<template>
  <v-app id="inspire"  >
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name:'App',
  data(){
    return{
      title:'123'
    }
  }

}
</script>

<style lang="sass">
.dark-theme
  background-color: #303030 !important
  color: rgba(0, 0, 0, 0.87)
</style>
