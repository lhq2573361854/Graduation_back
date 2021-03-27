<template>
  <v-container
    id="user-profile-view"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <material-card
          color="primary"
          icon="mdi-account-outline"
        >
          <template #title>
            {{ $t('common.editProfile') }} — <small class="text-body-1">{{ $t('common.completeProfile') }}</small>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row justify="space-around">

                <v-col
                  cols="12"
                  md="5"
                >
                  <v-text-field
                    color="purple"
                    disabled
                    :label="$t('common.userName')"
                    v-model="userInfo.userName"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="5"
                >
                  <v-text-field
                    disabled
                    color="purple"
                    :label="$t('common.userEmail')"
                    v-model="userInfo.userEmail"

                  />
                </v-col>
                <v-col
                    cols="12"
                    md="5"
                >
                  <v-text-field
                      disabled
                      color="purple"
                      :label="$t('common.userPass')"
                      type="password"
                      :value="userPass | passwordFilter"
                  />
                </v-col>
                <v-col
                    cols="12"
                    md="5"
                >
                  <v-text-field
                      color="purple"
                      :label="$t('common.userPhone')"
                      v-model="userInfo.userPhone"
                      disabled
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="5"
                >
                  <v-text-field
                    color="purple"
                    :label="$t('common.userCity')"
                    v-model="userInfo.userCity"
                    disabled

                  />
                </v-col>

                <v-col
                  cols="12"
                  md="5"
                >
                  <v-text-field
                    color="purple"
                    :label="$t('common.userCountry')"
                    v-model="userInfo.userCountry"
                    disabled

                  />
                </v-col>
                <v-col
                    cols="12"
                    md="5"
                >
                  <v-text-field
                      color="purple"
                      :label="$t('common.userDistrict')"
                      v-model="userInfo.userDistrict"
                      disabled

                  />
                </v-col>
                <v-col
                    cols="12"
                    md="5"
                >
                  <v-text-field
                      color="purple"
                      :label="$t('common.userProvince')"
                      v-model="userInfo.userProvince"
                      disabled

                  />
                </v-col>

              </v-row>
            </v-container>
          </v-form>
        </material-card>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <material-card  class="mt-4 text-center">
          <v-img
            class="rounded-circle elevation-6 mt-n12 d-inline-block"
            src="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg"
            width="128"
          />

          <v-card-text class="text-center">
            <h6 class="text-h6 mb-2 text--secondary">
              {{this.role | indexCharAtUppercase }}
            </h6>

            <h4 class="text-h4 mb-3 text--primary">
              {{userInfo.userName | indexCharAtUppercase }}
            </h4>

            <p class="text--secondary">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione dolorem deserunt veniam tempora magnam quisquam quam error iusto cupiditate ducimus, et eligendi saepe voluptatibus assumenda similique temporibus placeat animi dicta?
            </p>

            <v-btn
              class="mr-0"
              color="primary"
              min-width="100"
              rounded
            >
              {{ $t('common.follow') }}
            </v-btn>
          </v-card-text>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
  export default {
    name: 'UserProfileView',

    components:{
      MaterialCard:()=> import("@/components/MaterialCard"),
    },
    data(){
      return {
        userInfo:{},
        role:'',
        userPass:''
      }
    },
    created() {
      this.userInfo = this.getUserInfo
      this.role = this.getRole
    },
    computed:{
      ...mapGetters(["getUserInfo","getRole"])
    },
    filters:{
      passwordFilter(){
          return '*'.repeat(8)
      },
      indexCharAtUppercase(value){
        if(!value) return ''
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
  }
</script>
<style  >
.distpicker-address-wrapper select{
  width: 20% !important;

}
</style>
