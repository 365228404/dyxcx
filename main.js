import Vue from 'vue';
import App from './App';
import store from './store';

// 全局组件
import auth from './components/regComponents/auth';
import loading from './components/regComponents/loading';
import noData from './components/regComponents/noData';
import toast from './components/regComponents/toast';
Vue.component('auth',auth);
Vue.component('loading',loading);
Vue.component('noData',noData);
Vue.component('toast',toast);

Vue.config.productionTip = false;

App.mpType = 'app';
Vue.prototype.$store = store;


import './utils/util.js';
import './utils/filter.js';
const app = new Vue({
    ...App
})
app.$mount()
