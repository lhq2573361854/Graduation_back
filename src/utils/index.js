import store from '../store'
import request from "@/axios";

 function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
 export function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

export function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

export function clearCookie(name) {
    setCookie(name, "", -1);
}


export function getTokenAuth() {
    let auth_token = document.cookie.split(";").find(item => item.match("auth_token"))
        && document.cookie.split(";").find(item => item.match("auth_token")).split("=")[1];
    return !! auth_token
}

export function assertUserLogin(){
    return  !! ( store.getters.getUserInfo || localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || getTokenAuth())
}


export function  format (date,fmt){
    let o = {
        "M+" : date.getMonth()+1,
        "d+" : date.getDate(),
        "h+" : date.getHours(),
        "m+" : date.getMinutes(),
        "s+" : date.getSeconds(),
        "q+" : Math.floor((date.getMonth()+3)/3),
        "S"  : date.getMilliseconds()
    }

    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(let k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

export function getUuid (){

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4()+ "-" + S4() + S4() + S4());
}


export function  replaceTag(str) {
    let reg1 = /<[^>]*>/g
    let reg2 = /\\&[a-zA-Z]{0,9};/g
    return str.replace(reg2, '').replace(reg1, '')
}

export async  function  getImg() {
    const result =  await request.get("/code/validate", {responseType: 'arraybuffer'})
    const str = 'data:image/jpeg;base64,' + btoa(new Uint8Array(result).reduce((data, byte) => data + String.fromCharCode(byte), ''))
    return str

}

export async function getPhoneCode(){
    const result =   await request.get("/code/tel/" + this.phone)
    return result
}

export function onopen(){
    console.log("open")
}
export function onmessage(payload){
    store.commit("updateStarList",JSON.parse(payload.data))
}
export function onclose() {
    console.log("close")
}

export function sliceToLength(str,length){
     return str.length > length ? str.slice(0,length) + '...' : str
}
export function charsetAdapter(str){
    str = str.replace(/%/g, "%25");
    str = str.replace(/&/g, "%26");
    str = str.replace(/\+/g, "%2B");
    console.log(str)
    return str;
}

export function fromDataAdapter(obj){
     if(typeof obj !== "object"){
         return obj
     }
     Object.keys(obj).forEach(value => {
         if(typeof  obj[value] === 'string')
             obj[value] = charsetAdapter(obj[value])
     })
    return obj;
}
