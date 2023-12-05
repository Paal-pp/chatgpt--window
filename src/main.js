// src/main.js
import axios from 'axios';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';


axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401: // 令牌过期或未提供
                          // 引导用户到登录页面
                    router.push('/login');
                    break;
                case 422: // 无效的令牌
                          // 显示错误信息并可能需要重新登录
                    alert("Invalid token. Please log in again.");
                    router.push('/login');
                    break;
                // 其他错误处理
            }
        }
        return Promise.reject(error);
    }
);
const app = createApp(App);

app.use(router);
app.config.globalProperties.$apiUrl = 'http://localhost:5000';
app.mount('#app');

