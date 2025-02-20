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



const app = createApp(App);


const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

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
