import { helpers } from 'vuelidate/lib/validators'

export const phone = helpers.regex('手机号必须1开头的11位数字', /^1\d{10}$/ );

export const regTime = helpers.regex('时间格式不正确', /\d{4}(-\d{2}){2} \d{2}(:\d{2}){2}/ );






