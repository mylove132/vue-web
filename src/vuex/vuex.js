import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import api from '../url/urls'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        user: localStorage.getItem('user') || '',
        LOADING: false
    },
    mutations: {
        auth_request(state) {
            state.status = 'loading';
        },
        auth_success(state, token, user) {
            state.status = 'success';
            state.token = token;
            state.user = user;
        },
        auth_error(state) {
            state.status = 'error';
        },
        logout(state) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('user_id')
            state.token = ''
            state.user = ''
        },
        showLoading(state){
            state.LOADING = true
        },
        hideLoading (state) {
            state.LOADING = false
        }
    },
    actions: {
        Login({commit}, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request')
                axios.post(api.login, user)
                    .then(resp => {
                        const token = resp.data.result.token
                        const user = resp.data.result.name
                        const id = resp.data.result.user_id
                        localStorage.setItem('token', token)
                        localStorage.setItem('user', user)
                        localStorage.setItem('user_id', id)
                        // 更新token
                        commit('auth_success', token, user)
                        resolve(resp)
                    })
                    .catch(err => {
                        commit('auth_error')
                        localStorage.removeItem('token')
                        reject(err)
                    })
            })
        },
        LogOut({ commit }) {
            commit('logout')

        }
    },
    getters: {
        // !!将state.token强制转换为布尔值，若state.token存在且不为空(已登录)则返回true，反之返回false
        isLoggedIn: state => !!state.token,
        username: state => localStorage.user,
        isLoading : state => state.LOADING
    }
});

export default store;
