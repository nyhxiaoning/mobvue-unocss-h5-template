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


const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
        },
        {
            path: '/city',
            name: 'city',
            component: CityView,
            beforeEnter: (to, from, next) => {
                const userStore = useUserStore();
                if (from.name === 'weather' && to.name ==='city' ) {
                    // 重置城市信息: 用户如果点击返回的时候，需要重置城市信息，使用全局store
                    sessionStorage.setItem('weathername', userStore.$state.weathername);
                    sessionStorage.setItem('weathervalue', userStore.$state.weathervalue);
                }else {
                    next();
                }
                next();

            }
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
            beforeEnter: (to, from, next) => {
                console.log(to, 'to-weather');
                console.log(from.name, 'from.name');
                console.log(to.name, 'to.name');
                 const userStore = useUserStore();

                if (from.name === 'home' && to.name === 'weather') {
                    // home->weather
                    // 取store配置查询一下当前的城市信息
                    console.log(userStore.$state.allCitys, 'this.allCitys');
                    userStore.$state.fromHome = true;
                    console.log(Object.values(userStore.$state.allCitys),'object.values');
                    // console.log(userStore.$state, 'userStore.$state');
                    // console.log(cityAll, 'cityAll');
                }

                if (from.name === 'city' && to.name === 'weather') {
                    // city->weather
                    // 取sessionStorage 查询一下当前的城市信息,同时
                     userStore.$state.fromHome = false;
                    //   sessionStorage.setItem('weathervalue',userStore.$state.weathervalue)
                    //   sessionStorage.setItem('weathername', userStore.$state.weathername);
                    //  userStore.$state.weathername = sessionStorage.getItem('weathername') || '';
                }

                next();
            },
        },
        {
            path: '/setting',
            name: 'setting',
            component: Setting,
        },
    ],
});



export default router;
