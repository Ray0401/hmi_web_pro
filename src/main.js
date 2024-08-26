import Vue from 'vue';
import App from './App.vue';
import 'normalize.css';

import store from './store';
import router from './router';
import md5 from 'js-md5';
// import { WebSocketClient } from '@/socket/index';
import WebSocketClient from '@/utils/socket';

import eventBus from '@/utils/eventBus';
Vue.prototype.$bus = eventBus;

// 全局组件
import buttonDialog from '@/components/dialog/buttonDialog.vue';
import MButton from '@/components/components/mButton.vue';
import radioDialog from '@/components/dialog/radioDialog.vue';
import MessageModal from '@/components/components/messageModal.vue';
import Modal from '@/components/components/modal.vue';
import CommonModal from '@/components/components/commonModal';

// toast
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
const options = {
  position: 'top-center',
  transition: 'Vue-Toastification__fade',
  maxToasts: 1,
  timeout: 3000,
  closeOnClick: false,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  draggable: false,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false,
  filterBeforeCreate: (toast, toasts) => {
    if (toasts.filter(t => t.type === toast.type).length !== 0) {
      // Returning false discards the toast
      return false;
    }
    // You can modify the toast if you want
    return toast;
  },
};
Vue.use(Toast, options);
// switch组件
import ToggleButton from 'vue-js-toggle-button';
Vue.use(ToggleButton);

// 国际化i18n
import VueI18n from 'vue-i18n';
import { vueI18n } from './mixins/vueI18n';
import { getCookie } from './utils/utils';
import { EN } from './lang/en';
import { ZH } from './lang/zh';
Vue.use(VueI18n);
Vue.mixin(vueI18n);

// 动态设置ws url
import { isWsMock, local_ws_url, ws_url, ws_reconnet_time } from './constant';
const { host } = window.location;
const target_url =
  isWsMock == 'no'
    ? host.includes('dev.tage.com')
      ? ws_url
      : host.includes('127.0.0.1')
      ? local_ws_url
      : `ws://${host}:8081/cmdstream`
    : local_ws_url;
console.log('target_url', target_url);
const socket = new WebSocketClient(target_url, ws_reconnet_time);

// 设置全局变量
Vue.prototype.md5 = md5;
Vue.prototype.socket = socket;

// 挂载全局组件
Vue.component('buttonDialog', buttonDialog);
Vue.component('radioDialog', radioDialog);
Vue.component('MessageModal', MessageModal);
Vue.component('Modal', Modal);
Vue.component('MButton', MButton);
Vue.component('CommonModal', CommonModal);

const i18n = new VueI18n({
  locale: getCookie(),
  messages: {
    zh: { ...ZH },
    en: { ...EN },
  },
});

export default new Vue({
  i18n,
  store,
  router,
  render: h => h(App),
}).$mount('#app');
