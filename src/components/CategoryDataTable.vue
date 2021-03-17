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
              label="Search"
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
              <v-form>
                <v-row>
                  <v-col
                      cols="12"
                      lg="6"
                  >
                    <v-text-field
                        disabled
                        v-model="editedItem.id"
                        label="id"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      lg="6"
                  >
                    <v-text-field
                        v-model="editedItem.categoryName"
                        @blur="$v.editedItem.categoryName.$touch()"
                        @input="$v.editedItem.categoryName.$touch()"
                        :error-messages="categoryNameErrors"
                        label="userId"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      lg="6"
                  >
                    <v-text-field
                        v-model="editedItem.categoryAlias"
                        @blur="$v.editedItem.categoryAlias.$touch()"
                        @input="$v.editedItem.categoryAlias.$touch()"
                        :error-messages="categoryAliasErrors"
                        label="userRole"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      lg="6"
                  >
                    <v-text-field
                        @blur="$v.editedItem.categoryDesc.$touch()"
                        @input="$v.editedItem.categoryDesc.$touch()"
                        :error-messages="categoryDescErrors"
                        v-model="editedItem.categoryDesc"
                        label="userRole"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
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
      <template v-slot:item.articleContent="{ item }">
        {{replaceTag(item.articleContent)}}
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
import { replaceTag, sliceToLength} from "@/utils";
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
export default {
  name: "CategoryDataTable",
  mixins: [validationMixin],
  validations: {
    editedItem: {
      categoryName: {required},
      categoryAlias: {required},
      categoryDesc: {required},
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
      headers: [
        { text: 'id', value: 'id'},
        { text: '栏目名', value: 'categoryName',},
        { text: '栏目别名', value: 'categoryAlias' },
        { text: '栏目描述', value: 'categoryDesc' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      editedItem: {
        id: '',
        categoryName: '',
        categoryAlias: '',
        categoryDesc: '',
      },
      defaultItem: {
        id: '',
        categoryName: '',
        categoryAlias: '',
        categoryDesc: '',
      },
    }
  },
  created() {

  },
  mounted() {
    this.getUserData()
  },
  methods:{
    test($event){
      this.pageCount = $event
    },
    async getUserData(){
      console.log("getUserData")
      const result = await request.get("/category/getAllCategory")
      this.desserts = result.data.map(item=> item)
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

    deleteItemConfirm () {
      this.desserts.splice(this.editedIndex, 1)
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
        result = await request.post("category/updateCategoryById",this.editedItem)
        if(result.code === 200){
          console.log(result.msg)

        }
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        result = await request.post("category/addCategory",this.editedItem)
        if(result.code === 200){
          console.log(result.msg)
        }
        this.editedItem.id = result.data.id
        this.desserts.push(this.editedItem)
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
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    categoryNameErrors(){
      const errors = []
      if (!this.$v.editedItem.categoryName.$dirty) return errors
      !this.$v.editedItem.categoryName.required && errors.push('categoryName must be required')
      return errors
    },
    categoryAliasErrors(){
      const errors = []
      if (!this.$v.editedItem.categoryAlias.$dirty) return errors
      !this.$v.editedItem.categoryAlias.required && errors.push('categoryAlias must be required')
      return errors
    },
    categoryDescErrors(){
      const errors = []
      if (!this.$v.editedItem.categoryDesc.$dirty) return errors
      !this.$v.editedItem.categoryDesc.required && errors.push('categoryDesc must be required')
      return errors
    },

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
