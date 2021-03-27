<template>
  <div>
    <v-data-table
        calculate-widths
        :headers="headers"
        :items="$store.state.userList"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        class="elevation-1"
        :search="search"
        @page-count="test($event)"
    >
      <template v-slot:top>
        <v-toolbar
            flat
        >
          <v-spacer></v-spacer>
          <v-text-field
              append-icon="mdi-magnify"
              :label="$t('common.search')"
              single-line
              hide-details
              v-model="search"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog
              v-model="dialog"
              max-width="40%"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="green"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  fab
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>

          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.id"
                        disabled
                        label="id"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.userName"
                        @blur="$v.editedItem.userName.$touch()"
                        @input="$v.editedItem.userName.$touch()"
                        :error-messages="userNameErrors"
                        :label="$t('common.userName')"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.userPass"
                        @blur="$v.editedItem.userPass.$touch()"
                        @input="$v.editedItem.userPass.$touch()"
                        :error-messages="userPassErrors"
                        :label="$t('common.userPass')"

                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.userEmail"
                        @blur="$v.editedItem.userEmail.$touch()"
                        @input="$v.editedItem.userEmail.$touch()"
                        :error-messages="userEmailErrors"
                        :label="$t('common.userEmail')"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.userPhone"
                        @blur="$v.editedItem.userPhone.$touch()"
                        @input="$v.editedItem.userPhone.$touch()"
                        :error-messages="userPhoneErrors"
                        :label="$t('common.userPhone')"


                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.userSex"
                        @blur="$v.editedItem.userSex.$touch()"
                        @input="$v.editedItem.userSex.$touch()"
                        :error-messages="userSexErrors"
                        :label="$t('common.userSex')"

                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.userCountry"
                        @blur="$v.editedItem.userCountry.$touch()"
                        @input="$v.editedItem.userCountry.$touch()"
                        :error-messages="userCountryErrors"
                        :label="$t('common.userCountry')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <div class="divwrap">
                      <v-distpicker   :province="editedItem.userProvince" :city="editedItem.userCity" :area="editedItem.userDistrict"  @province="onChangeProvince" @city="onChangeCity"
                                      @area="onChangeArea"></v-distpicker>
                    </div>
                  </v-col>

                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.registerTime"
                        disabled
                        :label="$t('common.registerTime')"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.previousTime"
                        :label="$t('common.previousTime')"
                        disabled
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.previousTime"
                        :label="$t('common.previousTime')"
                        disabled
                    ></v-text-field>
                  </v-col>

                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
              >
                {{ $t("common.cancel") }}
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
              >
                {{ $t("common.save") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">你确定要删除这个选项？</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">{{ $t("common.cancel") }}</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">{{ $t("common.ok") }}</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.userPass="{ item }">
        {{replaceTag(item.userPass)}}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
            small
            @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
            color="primary"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
          v-model="page"
          :length="pageCount"
      ></v-pagination>
    </div>
    <v-snackbar
        v-model="snackbar"
        :timeout="timeout"
        top

    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import {replaceTag, sliceToLength} from "@/utils";
import request from "@/axios";
import {validationMixin} from "vuelidate";
import {required, email, minLength} from "vuelidate/lib/validators";
import {phone} from "@/validate";
import VDistpicker from 'v-distpicker'
import {mapGetters, mapMutations, mapState} from 'vuex'

export default {
  name:"UserDataTable",
  mixins: [validationMixin],
  components:{
    VDistpicker
  },
  validations: {
    editedItem: {
      userName: {required,minLength:minLength(3)},
      userPass: {required,minLength:minLength(3)},
      userPhone:  {required,phone},
      userEmail:  {required,email},
      userSex: {required},
      userCountry: {required},
      userProvince: {required},
      userCity:  {required},
      userDistrict:  {required},
    }
  },
  data () {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      search:'',
      snackbar:false,
      snackbarText:'',
      timeout:600,
      desserts:this.userList,
      editedItem: {
        id: '',
        userName: '',
        userPass: '',
        userPhone: '',
        userEmail: '',
        userSex:'',
        userCountry:'',
        userProvince:'',
        userCity: '',
        userDistrict: '',
        registerTime:'',
        recentlyTime:'',
        previousTime:'',
      },
      defaultItem: {
        id: '',
        userName: '',
        userPass: '',
        userPhone: '',
        userEmail: '',
        userSex:'',
        userCountry:'',
        userProvince:'',
        userCity: '',
        userDistrict: '',
        registerTime:'',
        recentlyTime:'',
        previousTime:'',
      },
    }
  },
  methods:{
    ...mapMutations(["pushUserToUserList","deleteUserToUserList","updateUserToUserList"]),
    onChangeProvince(val){
      this.editedItem.userProvince = val.value
    },
    onChangeCity(val){
      this.editedItem.userCity =  val.value
    },
    onChangeArea(val){
      this.editedItem.userDistrict =  val.value
    },
    test($event){
      this.pageCount = $event
      console.log($event)
    },
    snackbarShow(msg){
      this.snackbar = true
      this.snackbarText = msg
    },

    replaceTag(str){
      return sliceToLength(replaceTag(str),10)
    },
    editItem (item) {
      this.editedIndex = this.userList.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.userList.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

   async deleteItemConfirm () {
      const result = await request.delete(`/user/deleteUserById/${this.editedItem.id}`)
      if(result.code === 200){
       // this.desserts.splice(this.editedIndex, 1)
        this.deleteUserToUserList(this.editedIndex)
      }
     this.snackbarShow(result.msg)
     this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$v.$reset()
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save () {
      this.$v.$touch()
      if(!this.$v.$invalid){
      let result;
      if (this.editedIndex > -1) {
        result = await request.post("/user/updateUserById",this.editedItem)
        // Object.assign(this.desserts[this.editedIndex], this.editedItem)
        this.updateUserToUserList({"editedIndex":this.editedIndex,"editedItem":this.editedItem})
      } else {
        result = await request.post("/code/addUser",this.editedItem)
        if(result.code === 200){
          this.editedItem.id = result.data.id
          this.editedItem.userPass = result.data.userPass
          this.editedItem.registerTime = result.data.registerTime
          this.editedItem.previousTime = result.data.previousTime
          this.editedItem.recentlyTime = result.data.recentlyTime
          // this.desserts.push(this.editedItem)
          this.pushUserToUserList(this.editedItem)
        }
      }
      this.close()
      this.snackbarShow(result.msg)
      }
    },
  },
  computed:{
    ...mapGetters(["getUserList"]),
    ...mapState(['userList']),
    formTitle () {
      return this.editedIndex === -1 ? '新建' : '修改'
    },
    headers(){
      return [
        {text: 'id', value: 'id'},
        {text: `${this.$t("common.userName")}`, value: 'userName',},
        { text: `${this.$t("common.userPass")}`, value: 'userPass' },
        {text: `${this.$t("common.userPhone")}`, value: 'userPhone',},
        { text: `${this.$t("common.userEmail")}`, value: 'userEmail' },
        { text: `${this.$t("common.userSex")}`, value: 'userSex' },
        { text: `${this.$t("common.userCountry")}`, value: 'userCountry' },
        { text: `${this.$t("common.userProvince")}`, value: 'userProvince' },
        { text: `${this.$t("common.userCity")}`, value: 'userCity' },
        { text: `${this.$t("common.userDistrict")}`, value: 'userDistrict' },
        { text: `${this.$t("common.registerTime")}`, value: 'registerTime' },
        { text: `${this.$t("common.recentlyTime")}`, value: 'recentlyTime' },
        { text: `${this.$t("common.previousTime")}`, value: 'previousTime' },
        { text: `${this.$t("common.actions")}`, value: 'actions', sortable: false },
      ]
    } ,
    userNameErrors(){
      const errors = []
      if (!this.$v.editedItem.userName.$dirty) return errors
      !this.$v.editedItem.userName.required && errors.push(this.$t('common.userName') + this.$t('errorMessage.required'))
      !this.$v.editedItem.userName.minLength && errors.push('minLength must  less at 3')
      return errors
    },
    userPassErrors(){
      const errors = []
      if (!this.$v.editedItem.userPass.$dirty) return errors
      !this.$v.editedItem.userPass.required && errors.push(this.$t('common.userPass') + this.$t('errorMessage.required'))
      !this.$v.editedItem.userPass.minLength && errors.push('minLength must  less at 3')
      return errors
    },
    userEmailErrors(){
      const errors = []
      if (!this.$v.editedItem.userEmail.$dirty) return errors
      !this.$v.editedItem.userEmail.required && errors.push(this.$t('common.userEmail') + this.$t('errorMessage.required'))
      !this.$v.editedItem.userEmail.email && errors.push(this.$t('common.userEmail') + this.$t('errorMessage.format'))
      return errors
    },
    userPhoneErrors(){
      const errors = []
      if (!this.$v.editedItem.userPhone.$dirty) return errors
      !this.$v.editedItem.userPhone.required && errors.push(this.$t('common.userPhone') + this.$t('errorMessage.required'))
      !this.$v.editedItem.userPhone.phone && errors.push(this.$t('common.userPhone') + this.$t('errorMessage.format'))
      return errors
    },
    userSexErrors(){
      const errors = []
      if (!this.$v.editedItem.userSex.$dirty) return errors
      !this.$v.editedItem.userSex.required && errors.push(this.$t('common.userSex') + this.$t('errorMessage.required'))
      return errors
    },
    userCountryErrors(){
      const errors = []
      if (!this.$v.editedItem.userCountry.$dirty) return errors
      !this.$v.editedItem.userCountry.required && errors.push(this.$t('common.userCountry') + this.$t('errorMessage.required'))
      return errors
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  }
}
</script>


<style >
.distpicker-address-wrapper select{
  width: 30% !important;
  margin: 0 3px;
}
</style>
