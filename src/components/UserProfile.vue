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
            Edit Profile — <small class="text-body-1">Complete your profile</small>
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
                    :label="$t('common.userName')"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="5"
                >
                  <v-text-field
                    color="purple"
                    :label="$t('common.userEmail')"
                  />
                </v-col>
                <v-col
                    cols="12"
                    md="5"
                >
                  <v-text-field
                      color="purple"
                      :label="$t('common.userPass')"
                  />
                </v-col>
                <v-col
                    cols="12"
                    md="5"
                >
                  <v-text-field
                      color="purple"
                      :label="$t('common.userPhone')"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="5"
                >
                  <v-text-field
                    color="purple"
                    :label="$t('common.userCity')"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="5"
                >
                  <v-text-field
                    color="purple"
                    :label="$t('common.userCountry')"
                  />
                </v-col>

                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="primary"
                    min-width="150"
                  >
                    Update Profile
                  </v-btn>
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
              CEO / FOUNDER
            </h6>

            <h4 class="text-h4 mb-3 text--primary">
              John Leider
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
              Follow
            </v-btn>
          </v-card-text>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'UserProfileView',
    components:{
      MaterialCard:()=> import("@/components/MaterialCard"),
    }
  }
</script>
<style  >
.distpicker-address-wrapper select{
  width: 20% !important;

}
</style>
