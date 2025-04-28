/*
 * @Author: ningyongheng ningyongheng@jeejio.com
 * @Date: 2024-10-09 18:18:15
 * @LastEditors: ningyongheng ningyongheng@jeejio.com
 * @LastEditTime: 2025-02-20 14:43:07
 * @FilePath: /cupsystem/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * Styles
 */
import 'vant/lib/index.css';
import './main.less';
import 'virtual:uno.css'


/**
 * Components
 */
import App from './App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
/**
 * Constants
 */
import router from './router';
import vant from 'vant';

import VConsole from "vconsole"


function loadScript(src:string) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve('success'); // 已经加载过了
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

if (import.meta.env.VITE_APP_ENV === "development" || import.meta.env.VITE_APP_ENV === "qa") {
    // 在开发环境中启用 vConsole

    debugger

    // 判断一下此时是否已经有JeeWeb,如果有，证明是手机端，那么就不需要再加载了，直接使用
    if (window?.JeeWeb) {
        console.log('JeeWeb already loaded!');
        console.log(window?.JeeWeb,'window?.JeeWeb');
    }else {
        console.log('电脑端的手机模拟');
        Promise.all([
            loadScript('./../sdk0410.js'),
            loadScript('./../jeeweb.js')
        ])
            .then(() => {
                CupDevice = DeviceManager.createJeejioXie('cup');
                console.log('All dev/qa scripts loaded!');
            })
            .catch(error => {
                console.error('Failed to load dev/qa scripts:', error);
            });
    }

    new VConsole()

}


const app = createApp(App);


const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const JeeWeb = {
    Language: 'zh-CN',
}

// Modify the title based on the language environment
if (JeeWeb && JeeWeb.Language === 'zh-CN') {
    document.title = '水杯设置';
} else {
    document.title = 'Settings';
}


// app.config.globalProperties.$cityAll = allRegions;


app.use(pinia);
app.use(router);
app.use(vant);


app.mount('#app');
