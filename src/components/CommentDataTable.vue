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
              max-width="70%"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="green"
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  fab
                  dark
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
                      lg="12"
                  >
                    <quill-editor
                        ref="myQuillEditor"
                        v-model="editedItem.commentContent"
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
                        v-model="editedItem.commentUserId"
                        :label="$t('common.commentUserId')"
                        @blur="$v.editedItem.commentUserId.$touch()"
                        @input="$v.editedItem.commentUserId.$touch()"
                        :error-messages="commentUserIdErrors"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.commentTime"
                        disabled
                        :label="$t('common.commentTime')"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.commentOtherId"
                        @blur="$v.editedItem.commentOtherId.$touch()"
                        @input="$v.editedItem.commentOtherId.$touch()"
                        :error-messages="commentOtherIdErrors"
                        :label="$t('common.commentOtherId')"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.commentStars"
                        @blur="$v.editedItem.commentStars.$touch()"
                        @input="$v.editedItem.commentStars.$touch()"
                        :error-messages="commentStarsErrors"
                        :label="$t('common.commentStars')"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.commentArticleId"
                        @blur="$v.editedItem.commentArticleId.$touch()"
                        @input="$v.editedItem.commentArticleId.$touch()"
                        :error-messages="commentArticleIdErrors"
                        :label="$t('common.commentArticleId')"
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
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">  {{ $t("common.cancel") }}</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">  {{ $t("common.ok") }}</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.commentContent="{ item }">
        {{replaceTag(item.commentContent)}}
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
import {required} from "vuelidate/lib/validators";

export default {
  name: "CommentDataTable",
  mixins: [validationMixin],
  validations: {
    editedItem: {
      commentContent:{required},
      commentUserId:{required},
      commentOtherId:{required},
      commentStars:{required},
      commentArticleId:{required},
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
        commentContent: '',
        commentUserId: '',
        commentTime: '',
        commentOtherId: '',
        commentStars: '',
        commentArticleId: '',
      },
      defaultItem: {
        id: '',
        commentContent: '',
        commentUserId: '',
        commentTime: '',
        commentOtherId: '',
        commentStars: '',
        commentArticleId: '',
      },
      // 富文本编辑器默认内容
      content: '<h2>I am Example</h2>',
      //富文本编辑器配置
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

    }
  },

  mounted() {
    this.getUserData()
  },
  methods:{
    test($event){
      this.pageCount = $event
    },
    async getUserData(){
      const result = await request.get("/comment/getAllComment")
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
      const result = await request.delete(`/comment/deleteCommentById/${this.editedItem.id}`)
      if(result.code === 200){
        this.desserts.splice(this.editedIndex, 1)
        this.snackbarShow(result.msg)
      }
      this.closeDelete()
    },

    close () {
      this.dialog = false
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
    snackbarShow(msg){
      this.snackbar = true
      this.snackbarText = msg
    },
    async save () {
      let result;
      this.$v.$touch()
      if(!this.$v.$invalid){
        if (this.editedIndex > -1) {
          result = await request.post("/comment/updateComment",this.editedItem)
          if(result.code === 200){
            Object.assign(this.desserts[this.editedIndex], this.editedItem)
          }
        } else {
          result = await request.post("/comment/addComment",this.editedItem)
          if(result.code === 200){
            this.editedItem.id = result.data.id
            this.editedItem.commentTime = result.data.commentTime
            this.desserts.push(this.editedItem)
          }

        }
        this.close()
        this.snackbarShow(result.msg)
      }
    },
    onEditorBlur(quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus(quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady(quill) {
      console.log('editor ready!', quill)
    },
    onEditorChange({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
      this.content = html
    },
  },
  computed:{
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    headers(){
      return [
        { text: 'id', value: 'id'},
        { text: `${this.$t("common.commentContent")}`, value: 'commentContent',},
        { text: `${this.$t("common.commentUserId")}`, value: 'commentUserId' },
        { text: `${this.$t("common.commentTime")}`, value: 'commentTime' },
        { text: `${this.$t("common.commentOtherId")}`, value: 'commentOtherId' },
        { text: `${this.$t("common.commentStars")}`, value: 'commentStars' },
        { text: `${this.$t("common.commentArticleId")}`, value: 'commentArticleId' },
        { text: `${this.$t("common.actions")}`, value: 'actions', sortable: false },
      ]
    } ,
    commentContentErrors(){
      const errors = []
      if (!this.$v.editedItem.commentContent.$dirty) return errors
      !this.$v.editedItem.commentContent.required && errors.push(this.$t('common.commentContent') + this.$t('errorMessage.required'))
      return errors
    },
    commentUserIdErrors(){
      const errors = []
      if (!this.$v.editedItem.commentUserId.$dirty) return errors
      !this.$v.editedItem.commentUserId.required && errors.push(this.$t('common.commentUserId') + this.$t('errorMessage.required'))
      return errors
    },
    commentOtherIdErrors(){
      const errors = []
      if (!this.$v.editedItem.commentOtherId.$dirty) return errors
      !this.$v.editedItem.commentOtherId.required && errors.push(this.$t('common.commentOtherId') + this.$t('errorMessage.required'))
      return errors
    },
    commentStarsErrors(){
      const errors = []
      if (!this.$v.editedItem.commentStars.$dirty) return errors
      !this.$v.editedItem.commentStars.required && errors.push(this.$t('common.commentStars') + this.$t('errorMessage.required'))
      return errors
    },
    commentArticleIdErrors(){
      const errors = []
      if (!this.$v.editedItem.commentArticleId.$dirty) return errors
      !this.$v.editedItem.commentArticleId.required && errors.push(this.$t('common.commentArticleId') + this.$t('errorMessage.required'))
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
