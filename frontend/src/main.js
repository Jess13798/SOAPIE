import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // <-- Importa el router que creamos
import './style.css'

const app = createApp(App)
app.use(router) // <-- Dile a Vue que use el router
app.mount('#app')