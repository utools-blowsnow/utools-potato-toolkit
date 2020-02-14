import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import dialog from './components/dialog/dialog'
import VClamp from 'vue-clamp'
import ElementUI from 'element-ui'
import CKEditor from '@ckeditor/ckeditor5-vue'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import './theme/index.css'

library.add(fas)
library.add(far)
library.add(fab)
dom.watch()

Vue.component('v-clamp', VClamp)

Vue.use(CKEditor)
Vue.use(ElementUI)
Vue.use(dialog)

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false



new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
