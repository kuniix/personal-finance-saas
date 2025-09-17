import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from './axios'; // Importa a configuração do axios (instância configurada)
import './assets/theme.css'; // Importa o arquivo de estilos de tema

const app = createApp(App)

app.use(router)

// Torna o axios disponível globalmente em todos os componentes via this.$axios
app.config.globalProperties.$axios = axios;

app.mount('#app')
