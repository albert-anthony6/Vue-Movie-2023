import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Vue3Mq } from 'vue3-mq'
import Notifications from '@kyvg/vue3-notification'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowRight, faSearch } from '@fortawesome/free-solid-svg-icons'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(Vue3Mq, {
  breakpoints: {
    xxs: 0,
    xs: 375,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600
  }
})

app.use(createPinia())
app.use(router)
app.use(Notifications)

library.add(faArrowRight, faSearch)

app.component('font-awesome-icon', FontAwesomeIcon).mount('#app')
