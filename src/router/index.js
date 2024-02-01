import { createRouter, createWebHistory } from 'vue-router';
import ChatView from '@/views/ChatView.vue';
import LoginView from '@/views/LoginView.vue';
import Stream from '@/views/steam.vue'

const routes = [
    {
        path: '/chat',
        name: 'Chat',
        component: ChatView,
        meta: { requiresAuth: true } // 聊天视图需要认证
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView // 登录组件
    },
    {
        path: '/stream',
        name: 'stream',
        component: Stream // 登录组件
    }
    // 其他路由定义...
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    console.log('Routing from', from.path, 'to', to.path);
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isLoggedIn = localStorage.getItem('access_token');

    console.log('Requires auth:', requiresAuth, 'Is logged in:', !!isLoggedIn);

    if (requiresAuth && !isLoggedIn) {
        next('/login');
    } else {
        next();
    }
});


export default router;
