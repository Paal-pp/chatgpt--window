// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import ChatView from '@/views/ChatView.vue';

const routes = [
    {
        path: '/',
        name: 'Chat',
        component: ChatView
    }
    // 你可以在这里添加更多的路由
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
