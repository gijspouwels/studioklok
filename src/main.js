import Vue from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faBars)

Vue.component('font-awesome-icon', FontAwesomeIcon)

import './assets/main.scss'

Vue.config.productionTip = false
Vue.use(require('vue-shortkey'))

new Vue({
  render: h => h(App),
}).$mount('#app')
