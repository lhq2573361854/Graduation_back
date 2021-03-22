import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
// import {charsetAdapter} from "@/utils";

Vue.use(VueAxios,axios)
Vue.axios.defaults.baseURL='/api'

//let auth_token = document.cookie.split(";").find(item => item.match("auth_token")).split("=")[1];
// let utils = require('./utils');
// let normalizeHeaderName = require('./normalizeHeaderName');
// function setContentTypeIfUnset(headers, value) {
//     if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
//         headers['Content-Type'] = value;
//     }
// }
const request = Vue.axios.create({
    headers: {
        get: {
            'Content-Type': 'application/json',
            "auth_token":'BearereyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYWRtaW4iLCJhdXRob3JpdHkiOiIvYXJ0aWNsZS8qKiwvYXV0aG9yaXR5LyoqLC9jYXRlZ29yeS8qKiwvY29tbWVudC8qKiwvbGVhdmUtbWVzc2FnZS8qKiwvcm9sZS8qKiwvdGVzdC8qKiwvdXNlci8qKiIsInN1YiI6InRpYW5saW5nIiwiaWF0IjoxNjE2MjkxMTI1LCJleHAiOjE2MTY4OTU5MjV9.FJgavHZp_EAuYrMZbZFdLiKvUe4X_j0w2iAUm_X9vA8'
        },
        post: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        }
    },
    timeout: 10000,
    // transformRequest: [function transformRequest(data, headers) {
    //     normalizeHeaderName(headers, 'Content-Type');
    //     if (utils.isFormData(data) ||
    //         utils.isArrayBuffer(data) ||
    //         utils.isBuffer(data) ||
    //         utils.isStream(data) ||
    //         utils.isFile(data) ||
    //         utils.isBlob(data)
    //     ) {
    //         return data;
    //     }
    //     if (utils.isArrayBufferView(data)) {
    //         return data.buffer;
    //     }
    //     if (utils.isURLSearchParams(data)) {
    //         setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
    //         return data.toString();
    //     }
    //
    //     if (utils.isObject(data)) {
    //         setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
    //         let _data = Object.keys(data)
    //         console.log(charsetAdapter(encodeURI(_data.map(name => `${name}=${data[name]}`).join('&'))))
    //         return encodeURI(_data.map(name => `${name}=${data[name]}`).join('&'));
    //     }
    //     return data;
    // }],
})

request.interceptors.request.use((config) => {
    return config
}, (error) => {
    error.data = {}
    error.data.msg = '服务器异常，请联系管理员！'
    return Promise.resolve(error)
})

request.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    error.data = {}
    error.data.msg = '请求超时或服务器异常，请检查网络或联系管理员！'
    error.data.code= 500
    return Promise.resolve(error)
})

export default request
