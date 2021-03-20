<template>
  <v-card
      class="mx-auto"
      flat
      height="100%"
      style="background-image:url('https://demos.creative-tim.com/material-dashboard-pro/assets/img/sidebar-1.jpg')"
  >
      <v-list-item  three-line   class=" pl-2">
        <v-list-item-avatar>
          <v-img
              :src="
          require('@/assets/vmd.svg')"
          />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title text-h5 text-center font-weight-bold ">
            {{ $t('navbar.title') }}
          </v-list-item-title>
          <v-list-item-subtitle class=" text-center" >
            {{ $t('navbar.subTitle') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
          dense
      >
        <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            :to="item.to"
        >
          <v-list-item-icon>
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
  </v-card>
</template>



<script>
export default {
  name: "SideBar",
  data () {
    return {

    }
  },
  computed:{
    items(){
      return [
        { title: this.$t('navbar.home'), icon: 'mdi-account' ,color:'primary',to:'/admin'},
        { title: this.$t('navbar.authority'), icon: 'mdi-shield-lock',color:'primary',to:'/admin/authority'},
        { title: this.$t('navbar.article'), icon: 'mdi-newspaper-variant-multiple' ,color:'primary',to:'/admin/article'},
        { title: this.$t('navbar.comment'), icon: 'mdi-chat',color:'primary',to:'/admin/comment'},
        { title: this.$t('navbar.category'), icon: 'mdi-view-column' ,color:'primary',to:'/admin/category'},
        { title: this.$t('navbar.users'), icon: 'mdi-account' ,color:'primary',to:'/admin/user'},
        { title: this.$t('navbar.leaveMessage'), icon: 'mdi-help-box' ,color:'primary',to:'/admin/leaveMessage'},
        { title: this.$t('navbar.role'), icon: 'mdi-human-queue',color:'primary',to:'/admin/role'},
      ]
    }
  }
}
</script>

<style scoped>

</style>
