<template>
  <v-card
      class="mx-auto"
      flat

  >
      <v-list >
        <v-list-item class="text-center">
          <v-list-item-content>
            <v-list-item-title class="title text-h5 font-weight-bold pa-5">
              Admin Application
            </v-list-item-title>
            <v-list-item-subtitle class="pa-2" >
              An admin dashboard base on Vuetify
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>


      <v-divider></v-divider>

      <v-list
          dense
          nav
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
      items: [
        { title: 'Authority', icon: 'mdi-shield-lock',color:'primary',to:'/admin/authority'},
        { title: 'Article', icon: 'mdi-newspaper-variant-multiple' ,color:'primary',to:'/admin/article'},
        { title: 'Comment', icon: 'mdi-chat',color:'primary',to:'/admin/comment'},
        { title: 'Category', icon: 'mdi-view-column' ,color:'primary',to:'/admin/category'},
        { title: 'Users', icon: 'mdi-account' ,color:'primary',to:'/admin/user'},
        { title: 'LeaveMessage', icon: 'mdi-help-box' ,color:'primary',to:'/admin/leaveMessage'},
        { title: 'Post', icon: 'mdi-account' ,color:'primary',to:'/admin/post'},
        { title: 'Role', icon: 'mdi-human-queue',color:'primary',to:'/admin/role'},
      ],
      right: null,
    }
  },
}
</script>

<style scoped>

</style>
