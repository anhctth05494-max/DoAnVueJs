import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Nhập router từ file index.js ở thư mục router
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

app.use(router) // Gắn router vào ứng dụng trước khi mount
app.mount('#app')
