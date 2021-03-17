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
              max-width="70%"
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
                        label="userId"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.acceptId"
                        @blur="$v.editedItem.acceptId.$touch()"
                        @input="$v.editedItem.acceptId.$touch()"
                        :error-messages="acceptIdErrors"
                        label="acceptId"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      lg="12"
                  >
                    <v-text-field
                        v-model="editedItem.messageTitle"
                        @blur="$v.editedItem.messageTitle.$touch()"
                        @input="$v.editedItem.messageTitle.$touch()"
                        :error-messages="messageTitleErrors"
                        label="messageTitle"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                      lg="12"
                  >
                    <quill-editor
                        ref="myQuillEditor"
                        v-model="editedItem.message"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @ready="onEditorReady($event)"
                    >
                    </quill-editor>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.messageEmail"
                        @blur="$v.editedItem.messageEmail.$touch()"
                        @input="$v.editedItem.messageEmail.$touch()"
                        :error-messages="messageEmailErrors"
                        label="messageEmail"
                    ></v-text-field>
                  </v-col>

                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        disabled
                        label="sendTime"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.categoryId"
                        @blur="$v.editedItem.categoryId.$touch()"
                        @input="$v.editedItem.categoryId.$touch()"
                        :error-messages="categoryIdErrors"
                        label="categoryId"
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
      <template v-slot:item.message="{ item }">
        {{replaceTag(item.message)}}
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
import {validationMixin} from "vuelidate";
import {email, required} from "vuelidate/lib/validators";
export default {
  name: "LeaveMessageDataTable",
  mixins: [validationMixin],
  validations: {
    editedItem: {
      userId: {required},
      acceptId: {required},
      message: {required},
      messageTitle:{required},
      messageEmail:{required,email},
      categoryId:{required},
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
      editorOption: {
        modules: {
          imageDrop: true,
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          },
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
            ['blockquote', 'code-block'], //引用，代码块
            [{ 'header': 1 }, { 'header': 2}], // 标题，键值对的形式；1、2表示字体大小
            [{'list': 'ordered'}, {'list': 'bullet'}], //列表
            [{ 'script': 'sub'}, {'script': 'super' }], // 上下标
            [{ 'indent': '-1'}, {'indent': '+1'}], // 缩进
            [{'direction': 'rtl' }], // 文本方向
            [{ 'size': ['small', false, 'large', 'huge']}], // 字体大小
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }], //几级标题
            [{ 'color': [] }, { 'background': []}], // 字体颜色，字体背景颜色
            [{'font': []}], //字体
            [{'align': []}], //对齐方式
            ['clean'], //清除字体样式
            ['image', 'video'] //上传图片、上传视频
          ],
        },
        theme: 'snow',
      },
      headers: [
        { text: 'id', value: 'id'},
        { text: '用户id', value: 'userId',},
        { text: '接受留言的用户id', value: 'acceptId' },
        { text: '留言的时间', value: 'sendTime',},
        { text: '留言的内容', value: 'message' },
        { text: '留言的标题', value: 'messageTitle' },
        { text: '留言的邮箱', value: 'messageEmail' },
        { text: '留言的栏目id', value: 'categoryId' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      editedItem: {
        id: '',
        userId: '',
        acceptId: '',
        sendTime: '',
        message: '',
        messageTitle:'',
        messageEmail:'',
        categoryId:'',
      },
      defaultItem: {
        id: '',
        userId: '',
        acceptId: '',
        sendTime: '',
        message: '',
        messageTitle:'',
        messageEmail:'',
        categoryId:'',
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
      const result = await request.get("/leave-message/getAllLeaveMessage")
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

    async deleteItemConfirm () {
      const result = await request.delete(`/leave-message/deleteLeaveMessageById/${this.editedItem.id}`)
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
          result = await request.post("/leave-message/updateLeaveMessage",this.editedItem)
          if(result.code === 200){
            Object.assign(this.desserts[this.editedIndex], this.editedItem)
          }
        } else {
          result = await request.post("/leave-message/addLeaveMessage",this.editedItem)
          if(result.code === 200){
            console.log(result.data)
            this.editedItem.id = result.data.id
            this.editedItem.sendTime = result.data.sendTime
            this.desserts.push(this.editedItem)
          }

        }
        this.close()
        this.snackbarShow(result.msg)
      }


    },
    onEditorBlur() {
    },
    onEditorFocus() {
    },
    onEditorReady() {
    },
    onEditorChange() {
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
    userIdErrors(){
      const errors = []
      if (!this.$v.editedItem.userId.$dirty) return errors
      !this.$v.editedItem.userId.required && errors.push('userId must be required')
      return errors
    },
    acceptIdErrors(){
      const errors = []
      if (!this.$v.editedItem.acceptId.$dirty) return errors
      !this.$v.editedItem.acceptId.required && errors.push('acceptId must be required')
      return errors
    },
    messageErrors(){
      const errors = []
      if (!this.$v.editedItem.message.$dirty) return errors
      !this.$v.editedItem.message.required && errors.push('message must be required')
      return errors
    },
    messageTitleErrors(){
      const errors = []
      if (!this.$v.editedItem.messageTitle.$dirty) return errors
      !this.$v.editedItem.messageTitle.required && errors.push('messageTitle must be required')
      return errors
    },
    messageEmailErrors(){
      const errors = []
      if (!this.$v.editedItem.messageTitle.$dirty) return errors
      !this.$v.editedItem.messageTitle.required && errors.push('messageEmail must be required')
      !this.$v.editedItem.messageEmail.email && errors.push('email be not in a correct format')
      return errors
    },
    categoryIdErrors(){
      const errors = []
      if (!this.$v.editedItem.categoryId.$dirty) return errors
      !this.$v.editedItem.categoryId.required && errors.push('categoryId must be required')
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
