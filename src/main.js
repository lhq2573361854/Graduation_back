import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import CKEditor from '@ckeditor/ckeditor5-vue2'
import Meta from 'vue-meta'
import Vuelidate from 'vuelidate'
import VueBus from 'vue-bus';
import  VueQuillEditor  from 'vue-quill-editor'
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { ImageExtend } from 'quill-image-extend-module'
import { ImageDrop } from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-module'
import {i18n} from "@/plugins/i18n";

Quill.register('modules/ImageExtend', ImageExtend)
Quill.register('modules/imageResize', ImageResize)
Quill.register('modules/imageDrop', ImageDrop)

Vue.use(CKEditor).use(Vuelidate).use(Meta).use(VueBus).use(VueQuillEditor)
Vue.config.productionTip = false
Vue.config.devtools = true;




new Vue({
  router,
  i18n,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
