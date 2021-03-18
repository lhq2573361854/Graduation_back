<template>
  <v-container>
      <quill-editor
          ref="myQuillEditor"
          v-model="content"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)"
      >

      </quill-editor>
      <div>
        <v-form>
          <v-container
              id="input-usage"
              fluid
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="inputValue"
                    :error-messages="inputErrors"
                    label="请输入主题"
                    prefix="Title :"
                    @blur="$v.inputValue.$touch()"
                    @input="$v.inputValue.$touch()"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                    v-model="name"
                    :counter="20"
                    :error-messages="nameErrors"
                    label="用户名"
                    required
                    @blur="$v.name.$touch()"
                    @input="$v.name.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="email"
                    :error-messages="emailErrors"
                    label="邮箱"
                    required
                    @blur="$v.email.$touch()"
                    @input="$v.email.$touch()"
                ></v-text-field>

                <v-container >
                  <v-btn
                      class="mr-4"
                      @click="submit"
                      rounded
                      color="primary"
                      :loading="isLoading"

                  >
                    提交
                  </v-btn>
                  <v-btn @click="clear"
                         rounded
                         color="error"
                  >
                    清空
                  </v-btn>
                </v-container>
              </v-col>
            </v-row>

            <v-overlay :value="overlay">
              <div class="text-center ma-2">
                <v-snackbar
                    v-model="snackbar"
                    top
                >
                  {{ text1 }}

                  <template v-slot:action="{ attrs }">
                    <v-btn
                        color="pink"
                        text
                        v-bind="attrs"
                        @click="overlay = false"
                    >
                      Close
                    </v-btn>
                  </template>
                </v-snackbar>
              </div>
            </v-overlay>
          </v-container>

        </v-form>
        <div>{{$t('message.greeting')}}</div>
        <v-btn @click="toggleLocale"></v-btn>
        <v-btn @click="toggleLocale2"></v-btn>

      </div>
  </v-container>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {email, maxLength, required} from 'vuelidate/lib/validators'
import request from "@/axios";
import {format} from "@/utils";

export default {
  name: "PostFormCard",
  mixins: [validationMixin],
  validations: {
    inputValue: {required, maxLength: maxLength(20)},
    name: {required, maxLength: maxLength(20)},
    email: {required, email},
    select: {required},
    checkbox: {
      checked(val) {
        return val
      },
    },
    editorData:{required}
  },
  data () {
    return {
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
      name: 'tianling',
      email: '859073143@qq.com',
      select: null,
      items: [],
      checkbox: false,
      inputValue: 'tianling',
      rules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 3) || 'Min 3 characters',
      ],
      text: '',
      isLoading:false,
      snackbar: false,
      text1: `添加成功`,
      timeout:1000,
      overlay: false,
    }
  },
  methods: {
    toggleLocale(){
      this.$i18n.locale = 'en'

    },
    toggleLocale2(){
      this.$i18n.locale = 'zh'
    },
    //失去焦点事件
    onEditorBlur() {
    },
    //获得焦点事件
    onEditorFocus() {
    },
    // 准备富文本编辑器
    onEditorReady() {
    },
    //内容改变事件
    onEditorChange() {
    },
    submit() {
      this.$v.$touch()
      this.isLoading = true;
      request.post("/leave-message/addLeaveMessage",{
        "userId":1,
        "acceptId":2,
        "sendTime":format(new Date(),"yyyy-MM-dd hh:mm:ss"),
        "message":this.editorData,
        "messageTitle":this.inputValue,
        "messageEmail":this.email,
      }).then(resolve=>{
        this.clear()
        this.isLoading = !resolve
        this.snackbar = !!resolve
        this.overlay = !!resolve
      })
    },
    clear() {
      this.$v.$reset()
      this.name = ''
      this.email = ''
      this.select = null
      this.checkbox = false
      this.inputValue = ''
      this.editorData = ''
    },
  },
  computed:{
    inputErrors() {
      const errors = []
      if (!this.$v.inputValue.$dirty) return errors
      !this.$v.inputValue.required && errors.push('Title is required')
      !this.$v.inputValue.maxLength && errors.push('Name must be at most 20 characters long')

      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.maxLength && errors.push('Name must be at most 20 characters long')
      !this.$v.name.required && errors.push('Name is required.')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors
    },

  },
  watch:{
    overlay (val) {
      val && setTimeout(() => {
        this.overlay = false
      }, this.timeout)
    },
  },
}
</script>

<style >
.editor {
  line-height: normal !important;
  height: 800px;
}
.ql-snow .ql-tooltip[data-mode=link]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode=video]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
  content: '衬线字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
  content: '等宽字体';
}
</style>
