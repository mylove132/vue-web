/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios';
import router from '../router/index';
import store from '../vuex/vuex';
import swal from 'sweetalert2'

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    router.replace({
        path: '/login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    });
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
    // 状态码判断
    switch (status) {
        // 401: 未登录状态，跳转登录页
        case 401:
            toLogin();
            break;
        // 403 token过期
        // 清除token并跳转登录页
        case 403:
            if (other.message != "用户角色无权限") {
                swal({
                    title:"登录状态失效，请重新登录",
                    type: "warning",
                    timer: 1500
                });
                store.dispatch('LogOut')
                window.location.href = "/login";
                break;
            }else if (other.message == "用户角色无权限"){
                swal({
                    text:"用户角色无权限",
                    type:"warning",
                    timer: 1500
                })
                break;
            }
        // 404请求不存在
        case 404:
            swal({
                text:"请求资源不存在",
                type:"warning",
                timer: 1500
            });
            break;
        default:
            swal({
                text:"请求资源不存在",
                type:"warning",
                timer: 1500
            });
            break;
    }}

// 创建axios实例
var instance = axios.create({timeout: 1000 * 12});
instance.defaults.baseURL = process.env.VUE_APP_BASEURL
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
    config => {
        // 登录流程控制中，根据本地是否存在token判断用户的登录情况
        // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
        // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
        // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
        const token = store.state.token;
        config.headers['token'] = token;
        return config;
    },
    error => Promise.error(error))

axios.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。
                case 401:
                    toLogin();
                    break;

                // 403 token过期
                // 登录过期对用户进行提示
                // 清除本地token和清空vuex中token对象
                // 跳转登录页面
                case 403:
                    if (error.response.data.message == "用户角色无权限"){
                        swal({
                            text:"用户角色无权限",
                            type:"warning",
                            timer: 1500
                        })
                        break;
                    }else{
                    swal({
                        title:"登录状态失效，请重新登录",
                        type: "warning",
                        timer: 1500
                    });
                    store.dispatch('LogOut')
                    window.location.href = "/login";
                    break;
                }
                // 404请求不存在
                case 404:
                    swal({
                        title:"请求资源不存在",
                        type: "warning",
                        timer: 1500
                    });
                    break;
                // 其他错误，直接抛出错误提示
                default:
                    swal({
                        title:error.response.data.message,
                        type: "warning",
                        timer: 2500
                    });
            }
            return Promise.reject(error.response);
        }
    }
)



// // 响应拦截器
// instance.interceptors.response.use(
// // 请求成功
//     res => {
//         console.log(res)
//         res.status === 200 ? Promise.resolve(res) : Promise.reject(res)
//     },
//     // 请求失败
//     error => {
//         const { response } = error;
//         if (response) {
//             // 请求已发出，但是不在2xx的范围
//             errorHandle(response.status, response.data);
//             return Promise.reject(response);
//         } else {
//             // 处理断网的情况
//             // eg:请求超时或断网时，更新state的network状态
//             // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
//             // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
//             store.commit('changeNetwork', false);
//         }
//     });

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params){
    return new Promise((resolve, reject) =>{
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)
        })
    });}

/**
 * 封装del方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function del(url,params={},headers){
    return new Promise((resolve,reject) => {
        instance.delete(url,{
            params:params
        },headers)
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url,data = {},headers){
    return new Promise((resolve,reject) => {
        instance.post(url,data,headers)
            .then(response => {
                resolve(response.data);
            },err => {
                reject(err)
            })
    })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url,data = {},headers){
    return new Promise((resolve,reject) => {
        instance.patch(url,data,headers)
            .then(response => {
                resolve(response.data);
            },err => {
                reject(err)
            })
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url,data = {},headers){
    return new Promise((resolve,reject) => {
        instance.put(url,data,headers)
            .then(response => {
                resolve(response.data);
            },err => {
                reject(err)
            })
    })
}

export default instance;
