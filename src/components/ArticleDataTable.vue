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
                  dark
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
                          label="id"
                          disabled
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                      <v-text-field
                          v-model="editedItem.userId"
                          :label="$t('common.userId')"
                          @blur="$v.editedItem.userId.$touch()"
                          @input="$v.editedItem.userId.$touch()"
                          :error-messages="userIdErrors"
                          autocomplete="off"
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                      <v-text-field
                          v-model="editedItem.articleTitle"
                          @blur="$v.editedItem.articleTitle.$touch()"
                          @input="$v.editedItem.articleTitle.$touch()"
                          :error-messages="articleTitleErrors"
                          :label="$t('common.articleTitle')"
                          autocomplete="off"
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
                          v-model="editedItem.articleContent"
                          :options="editorOption"
                      >
                      </quill-editor>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                      <v-text-field
                          v-model="editedItem.articleDate"
                          disabled
                          :label="$t('common.articleDate')"
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                      <v-text-field
                          v-model="editedItem.articleStars"
                          :label="$t('common.articleStars')"
                          @blur="$v.editedItem.articleStars.$touch()"
                          @input="$v.editedItem.articleStars.$touch()"
                          :error-messages="articleStarsErrors"
                          autocomplete="off"
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                      <v-text-field
                          v-model="editedItem.articleAddress"
                          :label="$t('common.articleAddress')"
                          @blur="$v.editedItem.articleAddress.$touch()"
                          @input="$v.editedItem.articleAddress.$touch()"
                          :error-messages="articleAddressErrors"
                          autocomplete="off"
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                      <v-text-field
                          v-model="editedItem.categoryId"
                          :label="$t('common.categoryId')"
                          @blur="$v.editedItem.categoryId.$touch()"
                          @input="$v.editedItem.categoryId.$touch()"
                          :error-messages="categoryIdErrors"
                          autocomplete="off"
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
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">{{ $t("common.ok") }}</v-btn>
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
import {replaceTag, sliceToLength} from "@/utils";
import {mapMutations} from 'vuex'
import {validationMixin} from "vuelidate";
import {required} from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  validations: {
    editedItem: {
      userId: {required},
      articleTitle: {required},
      articleStars:{required},
      articleAddress:{required},
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
      title:'',
      snackbar:false,
      snackbarText:'',
      timeout:600,

      editedItem: {
        id: '',
        userId: '',
        articleTitle: '',
        articleContent: '',
        articleDate: '',
        articleStars:'',
        articleAddress:'',
        categoryId:'',
      },
      defaultItem: {
        id: '',
        userId: '',
        articleTitle: '',
        articleContent: '',
        articleDate: '',
        articleStars:'',
        articleAddress:'',
        categoryId:'',
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
  created() {
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
     const result = await request.get("/article/getAllArticle")
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
      let result;
      this.$v.$touch()
      if(!this.$v.$invalid){
        if(!this.editedItem.articleContent){
          this.snackbarShow("内容不能为空")
          return
        }
        console.log(123123)
        if (this.editedIndex > -1) {
          result = await request.post("/article/updateArticle",this.editedItem)
          if(result.code === 200){
            Object.assign(this.desserts[this.editedIndex], this.editedItem)
          }
        } else {
          result = await request.post("/article/addArticle",this.editedItem)
          if(result.code === 200){
            this.editedItem.id = result.data.id
            this.editedItem.articleTitle = result.data.articleDate
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
    onEditorChange(e) {
      console.log(e)
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
    headers(){
      return [
        { text: 'id', value: 'id'},
        { text: `${this.$t("common.userId")}`, value: 'userId',},
        { text: `${this.$t("common.articleTitle")}`, value: 'articleTitle' },
        { text: `${this.$t("common.articleContent")}`, value: 'articleContent',},
        { text: `${this.$t("common.articleDate")}`, value: 'articleDate' },
        { text: `${this.$t("common.articleStars")}`, value: 'articleStars' },
        { text: `${this.$t("common.articleAddress")}`, value: 'articleAddress' },
        { text: `${this.$t("common.categoryId")}`, value: 'categoryId' },
        { text: `${this.$t("common.actions")}`, value: 'actions', sortable: false },
      ]
    },
    userIdErrors(){
      const errors = []
      if (!this.$v.editedItem.userId.$dirty) return errors
      !this.$v.editedItem.userId.required && errors.push('userId must be required')
      return errors
    },
    articleTitleErrors(){
      const errors = []
      if (!this.$v.editedItem.articleTitle.$dirty) return errors
      !this.$v.editedItem.articleTitle.required && errors.push(this.$t('common.articleTitle') + this.$t('errorMessage.required'))
      return errors
    },
    articleContentErrors(){
      const errors = []
      if (!this.$v.editedItem.articleContent.$dirty) return errors
      !this.$v.editedItem.articleContent.required && errors.push(this.$t('common.articleContent') + this.$t('errorMessage.required'))
      return errors
    },
    articleStarsErrors(){
      const errors = []
      if (!this.$v.editedItem.articleStars.$dirty) return errors
      !this.$v.editedItem.articleStars.required && errors.push(this.$t('common.articleStars') + this.$t('errorMessage.required'))
      return errors
    },
    articleAddressErrors(){
      const errors = []
      if (!this.$v.editedItem.articleAddress.$dirty) return errors
      !this.$v.editedItem.articleAddress.required && errors.push(this.$t('common.articleAddress') + this.$t('errorMessage.required'))
      return errors
    },
    categoryIdErrors(){
      const errors = []
      if (!this.$v.editedItem. categoryId.$dirty) return errors
      !this.$v.editedItem. categoryId.required && errors.push(this.$t('common.categoryId') + this.$t('errorMessage.required'))
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
