<template>
  <v-main tag="div">
      <div class="pt-10"></div>
      <v-row justify="center"  >

        <v-col
            cols="12"
            md="3"
        >
          <material-card
              icon="mdi-account"
              color="primary"
              title=" User Login"
          >
              <v-form class="ma-2">
                <v-text-field
                    v-model="userName"
                    :error-messages="userNameErrors"
                    :counter="10"
                    :label="$t('common.userName')"
                    required
                    @input="$v.userName.$touch()"
                    @blur="$v.userName.$touch()"
                    autocomplete="off"

                >
                  <template v-slot:prepend>
                    <v-icon size="30" color="grey darken-2" class="mr-3">mdi-account-outline</v-icon>
                  </template>
                </v-text-field>
                <v-text-field
                    v-model="userPass"
                    :error-messages="userPassErrors"
                    :label="$t('common.userPass')"
                    type="password"
                    clearable
                    required
                    @input="$v.userPass.$touch()"
                    @blur="$v.userPass.$touch()"
                    autocomplete="off"
                >
                  <template v-slot:prepend>
                    <v-icon size="30" color="grey darken-2" class="mr-3">mdi-lock-outline</v-icon>
                  </template>
                </v-text-field>
                <v-text-field
                    placeholder="验证码"
                    solo
                    v-model="validateCode"
                    :error-messages="validateCodeErrorMessage"
                    autocomplete="off"
                    @input="$v.validateCode.$touch()"
                    @blur="$v.validateCode.$touch()"
                >
                  <template v-slot:prepend>
                    <v-icon size="30" color="grey darken-2" class="mr-3">mdi-message-outline</v-icon>
                  </template>
                  <template v-slot:append-outer >
                    <div style="margin-top: -0.5rem">
                      <v-img :src="src" height="45" width="110" @click="getImageCode"  class="ma-0" />
                    </div>
                  </template>

                </v-text-field>

                <v-col cols="12" class="d-flex justify-space-around">
                  <v-btn
                      class="mr-4"
                      color="success"
                      @click="submit"
                      :loading="loading"
                  >
                    {{ $t('common.submit') }}
                  </v-btn>

                  <v-btn @click="clear" color="error">
                    {{ $t('common.clear') }}
                  </v-btn>
                </v-col>
              </v-form>
            <v-snackbar
                v-model="snackbar"
                timeout="1000"
                top
            >
              {{ showText }}

              <template v-slot:action="{ attrs }">
                <v-btn
                    color="red"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                >
                  Close
                </v-btn>
              </template>
            </v-snackbar>
          </material-card>
        </v-col>
      </v-row>

  </v-main>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required} from 'vuelidate/lib/validators'
import {getImg, postData} from "@/utils";
import * as final_variable from "@/utils/finalVariables";
import {mapMutations} from "vuex"
export default {
  name: "Login",
  mixins: [validationMixin],
  validations: {
    userName: { required},
    userPass: { required },
    validateCode:{required},
    formValidate:['userName','userPass','validateCode']
  },
  components:{
    MaterialCard:()=>import("@/components/MaterialCard.vue")
  },
  data(){
    return {
      userName: 'tianling',
      userPass: '123',
      validateCode:'',
      src:'',
      loading:false,
      showText:'',
      snackbar:false
    }
  },
  created() {
    this.getImageCode()
  },
  computed: {

    userNameErrors () {
      const errors = []
      if (!this.$v.userName.$dirty) return errors
      !this.$v.userName.required && errors.push(this.$t('common.userName') + this.$t('errorMessage.required'))
      return errors
    },
    userPassErrors () {
      const errors = []
      if (!this.$v.userPass.$dirty) return errors
      !this.$v.userPass.required && errors.push(this.$t('common.userPass') + this.$t('errorMessage.required'))
      return errors
    },
    validateCodeErrorMessage () {
      const errors = []
      if (!this.$v.validateCode.$dirty) return errors
      !this.$v.validateCode.required && errors.push(this.$t('common.validateCode') + this.$t('errorMessage.required'))
      return errors
    },
    getUserData(){
      return {
        username:this.userName,
        password:this.userPass,
        image_validateCode:this.validateCode
      }
    },

  },
  methods: {
    ...mapMutations(["setCurrentUser"]),
    async submit () {
      this.$v.$touch()
      let result;
      if(!this.$v.formValidate.$invalid){
        this.loading = true
        result = await  postData.post("/login",this.getUserData)
        if(result.code === final_variable.status_success){
          this.loginSuccess(result.data)
        }else {
          this.failSuccess(result.data)
        }
        this.snackbar = !!result
        this.loading = !result
      }
      this.loading = false
    },
    loginSuccess(data){
      console.log(data)
      let payload = {
        userinfo:data[0],
        authority:data[1],
        role: data[2],
        isAuth:true,
      }
      this.setCurrentUser(payload)
      sessionStorage.setItem("currentUser",JSON.stringify(payload),final_variable.storage_time)
      this.$v.$reset()
      this.clear()
      setTimeout(()=>{
        this.$router.push("/admin/index")
      },final_variable.redirect_time)
      this.showText = final_variable.login_success_text
    },
    failSuccess(data){
      this.showText = data.msg
    },
    clear () {
      this.$v.$reset()
      this.userName = ''
      this.userPass = ''
      this.validateCode = ''
    },
    async getImageCode(){
      this.src = await getImg()
    }
  },
}
</script>

<style scoped>

</style>
