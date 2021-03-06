import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import {fetch,post,put,patch,del} from './utils/request'
import api from './url/urls'
import store from './vuex/vuex'
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import QS from 'qs'
// import ViewUI from 'view-design';
import Highlight from './utils/highlight'; // from 路径是highlight.js的路径，纯属自定义
Vue.use(Highlight);
import JSONView from 'vue-json-viewer'
Vue.use(JSONView)
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)


Vue.prototype.qs = QS;
// Vue.use(ViewUI)
Vue.config.productionTip = false;
Vue.prototype.$api=api;
Vue.prototype.$fetch=fetch;
Vue.prototype.$post=post;
Vue.prototype.$put=put;
Vue.prototype.$del=del;
Vue.prototype.$patch=patch;

Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     document.title = `${to.meta.title}`;
//     const role = localStorage.getItem('user');
//     if (!role && to.path !== '/login') {
//         next('/login');
//     }else {
//         // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//         if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//             Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//                 confirmButtonText: '确定'
//             });
//         } else {
//             next();
//         }
//     }
// });

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');
