<template>
  <div >
      <v-list-item  three-line   class=" pl-2 py-2" >
        <v-list-item-avatar>
          <v-img
              :src="
          require('@/assets/vmd.svg')"
          />
        </v-list-item-avatar>
        <v-list-item-content class="py-2">
          <v-list-item-title class="title text-h5 text-center font-weight-bold ">
            {{ $t('navbar.title') }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-center mt-4"  >
            {{ $t('navbar.subTitle') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <div class="pa-2">
        <v-divider    ></v-divider>
      </div>


      <v-list
          dense
          nav
      >
        <v-list-item-group>
          <v-list-item
              v-for="item in items"
              :key="item.title"
              link
              :to="item.to"
              active-class="pink_text"
              color="red darken-4"

          >
            <v-list-item-icon>
              <v-icon :color="item.color">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title >{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

      </v-list>
  </div>
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
        { title: this.$t('navbar.home'), icon: 'mdi-account' ,color:'cyan',to:'/admin/index'},
        { title: this.$t('navbar.authority'), icon: 'mdi-shield-lock',color:'cyan',to:'/admin/authority'},
        { title: this.$t('navbar.article'), icon: 'mdi-newspaper-variant-multiple' ,color:'cyan',to:'/admin/article'},
        { title: this.$t('navbar.comment'), icon: 'mdi-chat',color:'cyan',to:'/admin/comment'},
        { title: this.$t('navbar.category'), icon: 'mdi-view-column' ,color:'cyan',to:'/admin/category'},
        { title: this.$t('navbar.users'), icon: 'mdi-account' ,color:'cyan',to:'/admin/user'},
        { title: this.$t('navbar.leaveMessage'), icon: 'mdi-help-box' ,color:'cyan',to:'/admin/leaveMessage'},
        { title: this.$t('navbar.role'), icon: 'mdi-human-queue',color:'cyan',to:'/admin/role'},
        { title: this.$t('navbar.profile'), icon: 'mdi-human-queue',color:'cyan',to:'/admin/profile'},
      ]
    }
  },
  components:{
  }
}
</script>

<style scoped lang="sass">



</style>
