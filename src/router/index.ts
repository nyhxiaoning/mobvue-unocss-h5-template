/*
 * @Author: ningyongheng ningyongheng@jeejio.com
 * @Date: 2024-10-09 18:18:15
 * @LastEditors: ningyongheng ningyongheng@jeejio.com
 * @LastEditTime: 2025-01-24 14:37:02
 * @FilePath: /cupsystem/src/router/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHashHistory } from 'vue-router';

import { defineAsyncComponent } from 'vue';

/**
 * Components
 */
// import HomePage from '@/pages/HomePage.vue';
const HomePage = defineAsyncComponent(() => import('@/pages/HomePage.vue'));
// const Home = defineAsyncComponent(() => import('@/components/Home.vue'));
const CityView = defineAsyncComponent(() => import('@/components/CityView.vue'));
const WeatherView = defineAsyncComponent(() => import('@/components/WeatherView.vue'));
const Setting = defineAsyncComponent(() => import('@/pages/SwitchPage.vue'));
const TimeZone = defineAsyncComponent(() => import('@/components/Timezone.vue'));

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: '首页',
            component: HomePage,
        },
        {
            path: '/city',
            name: 'city',
            component: CityView,
        },
        {
            path: '/timezone',
            name: 'timezone',
            component: TimeZone,
        },
        {
            path: '/weather',
            name: 'weather',
            component: WeatherView,
        },
        {
            path: '/setting',
            name: 'setting',
            component: Setting
        }
    ],
}) as any;

export default router;
