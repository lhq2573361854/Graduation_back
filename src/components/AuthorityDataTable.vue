<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="desserts"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        class="elevation-1"
        @page-count="test($event)"
        hide-default-footer
        :search="search"
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
            max-width="500px"
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
                        v-model="editedItem.userId"
                        @blur="$v.editedItem.userId.$touch()"
                        @input="$v.editedItem.userId.$touch()"
                        :error-messages="userIdErrors"
                        :label="$t('common.userId')"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.userAuthority"
                        @blur="$v.editedItem.userAuthority.$touch()"
                        @input="$v.editedItem.userAuthority.$touch()"
                        :error-messages="userAuthorityErrors"
                        :label="$t('common.userAuthority')"

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
            </v-card-actions>f
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">{{ $t("common.cancel") }}</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">ff</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.userId="{ item }">
        {{getUserName(item.userId)}}
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
import request from "@/axios";
import {replaceTag, sliceToLength} from "@/utils";
import {mapGetters, mapMutations} from 'vuex'
import {validationMixin} from "vuelidate";
import {required} from "vuelidate/lib/validators";

export default {
  name: "AuthorityDataTable",
  mixins: [validationMixin],
  validations: {
    editedItem: {
      userId: {required},
      userAuthority: {required},
    }
  },
  data () {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      desserts:[],
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      search:'',
      snackbar:false,
      snackbarText:'',
      timeout:600,

      editedItem: {
        id: '',
        userId: '',
        userAuthority: '',
      },
      defaultItem: {
        id: '',
        userId: '',
        userAuthority: '',
      },
    }
  },
  mounted() {
    this.getUserData()
    this.setTitle(this.$route.name)
  },
  methods:{
    ...mapMutations(["setTitle"]),
    test($event){
      this.pageCount = $event
    },
    async getUserData(){
      const result = await request.get(`/authority/getAuthorityByUserId/${this.getUserInfoId}`)
      this.desserts.push(result.data)

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
      const result = await request.delete(`/authority/deleteAuthorityById/${this.editedItem.id}`)
      if(result.code === 200){
        this.desserts.splice(this.editedIndex, 1)
        this.snackbarShow(result.msg)
      }
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
      let result;
      this.$v.$touch()
      if(!this.$v.$invalid){
      if (this.editedIndex > -1) {
        result = await request.post("/authority/updateAuthority",this.editedItem)
        if(result.code === 200){
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        }
      } else {
        result = await request.post("/authority/addAuthority",this.editedItem)
        if(result.code === 200){
          this.editedItem.id = result.data.id
          this.desserts.push(this.editedItem)
        }

      }
      this.close()
      this.snackbarShow(result.msg)
      }
    },
    snackbarShow(msg){
      this.snackbar = true
      this.snackbarText = msg
    },
  },
  computed:{
    ...mapGetters(["getUserInfoId","getUserName"]),
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    userIdErrors(){
      const errors = []
      if (!this.$v.editedItem.userId.$dirty) return errors
      !this.$v.editedItem.userId.required && errors.push(this.$t('common.userId') + this.$t('errorMessage.required'))
      return errors
    },
    userAuthorityErrors(){
      const errors = []
      if (!this.$v.editedItem.userAuthority.$dirty) return errors
      !this.$v.editedItem.userAuthority.required && errors.push(this.$t('common.userAuthority') + this.$t('errorMessage.required'))
      return errors
    },
    headers(){
      return [
        { text: 'id', value: 'id'},
        { text: `${this.$t("common.userId")}`, value: 'userId',},
        { text: `${this.$t("common.userAuthority")}`, value: 'userAuthority' },
        { text: `${this.$t("common.actions")}`, value: 'actions', sortable: false },
      ]
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

}
</script>

<style scoped>

</style>
