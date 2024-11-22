import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/process',
                    name: 'process',
                    component: () => import('@/views/CreateProcess.vue')
                },
                {
                    path: '/process/:id',
                    name: 'process-detail',
                    component: () => import('@/views/ProcessDetail.vue')
                },
                {
                    path: '/process/:id/edit',
                    name: 'process-edit',
                    component: () => import('@/views/EditProcess.vue')
                },
                {
                    path: '/process-list',
                    name: 'process-list',
                    component: () => import('@/views/ProcessList.vue')
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/Users.vue')
                }
            ]
        }
        // {
        //     path: '/landing',
        //     name: 'landing',
        //     component: () => import('@/views/pages/Landing.vue')
        // },
        // {
        //     path: '/pages/notfound',
        //     name: 'notfound',
        //     component: () => import('@/views/pages/NotFound.vue')
        // },

        // {
        //     path: '/auth/login',
        //     name: 'login',
        //     component: () => import('@/views/pages/auth/Login.vue')
        // },
        // {
        //     path: '/auth/access',
        //     name: 'accessDenied',
        //     component: () => import('@/views/pages/auth/Access.vue')
        // },
        // {
        //     path: '/auth/error',
        //     name: 'error',
        //     component: () => import('@/views/pages/auth/Error.vue')
        // }
    ]
});

export default router;
