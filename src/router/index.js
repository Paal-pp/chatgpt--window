import { createRouter, createWebHistory } from 'vue-router';
import ChatView from '@/views/ChatView.vue';
import LoginView from '@/views/LoginView.vue';

const routes = [
    {
        path: '/',
        name: 'Chat',
        component: ChatView,
        meta: { requiresAuth: true } // 聊天视图需要认证
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView // 登录组件
    }
    // 其他路由定义...
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isLoggedIn = localStorage.getItem('access_token'); // 直接从localStorage检查token

    if (requiresAuth && !isLoggedIn) {
        next('/login'); // 重定向到登录页面
    } else {
        next(); // 允许访问
    }
});

export default router;
