import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

export const i18n = new VueI18n({
    locale: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'zh',
    messages: {
        'zh': require('@/assets/languages/zh.json'),
        'en': require('@/assets/languages/en.json')
    }
})


