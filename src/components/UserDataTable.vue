<template>
  <div>
    <v-data-table
        calculate-widths
        :headers="headers"
        :items="desserts"
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
              label="Search"
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
                        label="userName"
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
                        label="userPass"
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
                        label="userEmail"
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
                        label="userPhone"
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
                        label="userSex"
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
                        label="userCountry"
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
                        label="registerTime"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.previousTime"
                        disabled
                        label="previousTime"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.previousTime"
                        disabled
                        label="previousTime"
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
                Cancel
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
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
      headers: [
        {text: 'id', value: 'id'},
        {text: '用户名', value: 'userName',},
        { text: '密码', value: 'userPass' },
        {text: '用户手机号', value: 'userPhone',},
        { text: '邮箱', value: 'userEmail' },
        { text: '性别', value: 'userSex' },
        { text: '国家', value: 'userCountry' },
        { text: '省', value: 'userProvince' },
        { text: '城市', value: 'userCity' },
        { text: '区县', value: 'userDistrict' },
        { text: '注册时间', value: 'registerTime' },
        { text: '登录时间', value: 'recentlyTime' },
        { text: '上次登录时间', value: 'previousTime' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [
      ],
      editedItem: {
        id: '',
        userName: '213123sss',
        userPass: '1123',
        userPhone: '11114035039',
        userEmail: '859071@qq.com',
        userSex:'男',
        userCountry:'中国',
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
  created() {

  },
  mounted() {
    this.getUserData()
    console.log(this.$vuetify.theme.themes)
  },
  methods:{
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
    async getUserData(){
     const result = await request.get("/user/getAllUser")
      this.desserts = result.data
    },
    replaceTag(str){
      return sliceToLength(replaceTag(str),10)
    },
    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

   async deleteItemConfirm () {
      const result = await request.delete(`/user/deleteUserById/${this.editedItem.id}`)
      if(result.code === 200){
        this.desserts.splice(this.editedIndex, 1)
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
        if(result.code === 200){
          console.log(result.msg)
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        }
      } else {
        result = await request.post("/code/addUser",this.editedItem)
        if(result.code === 200){
          console.log(result.msg)
          this.editedItem.id = result.data.id
          this.editedItem.userPass = result.data.userPass
          this.editedItem.registerTime = result.data.registerTime
          this.editedItem.previousTime = result.data.previousTime
          this.editedItem.recentlyTime = result.data.recentlyTime
          this.desserts.push(this.editedItem)
        }

      }
      this.close()
      this.snackbarShow(result.msg)
      }
    },
  },
  computed:{
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    userNameErrors(){
      const errors = []
      if (!this.$v.editedItem.userName.$dirty) return errors
      !this.$v.editedItem.userName.required && errors.push('userName must be required')
      !this.$v.editedItem.userName.minLength && errors.push('minLength must  less at 3')
      return errors
    },
    userPassErrors(){
      const errors = []
      if (!this.$v.editedItem.userPass.$dirty) return errors
      !this.$v.editedItem.userPass.required && errors.push('userPass must be required')
      !this.$v.editedItem.userPass.minLength && errors.push('minLength must  less at 3')
      return errors
    },
    userEmailErrors(){
      const errors = []
      if (!this.$v.editedItem.userEmail.$dirty) return errors
      !this.$v.editedItem.userEmail.required && errors.push('userEmail must be required')
      !this.$v.editedItem.userEmail.email && errors.push('email be not in a correct format')
      return errors
    },
    userPhoneErrors(){
      const errors = []
      if (!this.$v.editedItem.userPhone.$dirty) return errors
      !this.$v.editedItem.userPhone.required && errors.push('userPhone must be required')
      !this.$v.editedItem.userPhone.phone && errors.push('userPhone be not in a correct format')
      return errors
    },
    userSexErrors(){
      const errors = []
      if (!this.$v.editedItem.userSex.$dirty) return errors
      !this.$v.editedItem.userSex.required && errors.push('userSex must be required')
      return errors
    },
    userCountryErrors(){
      const errors = []
      if (!this.$v.editedItem.userCountry.$dirty) return errors
      !this.$v.editedItem.userCountry.required && errors.push('userCountry must be required')
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
