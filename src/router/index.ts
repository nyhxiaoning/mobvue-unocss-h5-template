/*
 * @Author: ningyongheng ningyongheng@jeejio.com
 * @Date: 2024-10-09 18:18:15
 * @LastEditors: ningyongheng ningyongheng@jeejio.com
 * @LastEditTime: 2025-02-18 17:08:17
 * @FilePath: /cupsystem/src/router/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHashHistory, useRouter } from 'vue-router';

import { useUserStore } from './../store/index';

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
const newTal = defineAsyncComponent(() => import('@/components/newTal.vue'));
const CutTimeDown = defineAsyncComponent(() => import('@/components/CutTimeDown.vue'));
const TigerView = defineAsyncComponent(() => import('@/components/TigerView.vue'));
const PlayList = defineAsyncComponent(() => import('@/components/PlayList.vue'));



const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'cutTimedown',
            component: CutTimeDown,
        },

        {
            path: '/tigerview',
            name: 'tigerview',
            component: TigerView,
        },
        {
            path: '/playlist',
            name: 'playlist',
            component: PlayList,
        },
    ],
});



export default router;
