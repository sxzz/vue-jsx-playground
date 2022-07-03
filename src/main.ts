import Vue from 'vue'
import App from './App.vue'
import 'uno.css'
import '@unocss/reset/normalize.css'

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
