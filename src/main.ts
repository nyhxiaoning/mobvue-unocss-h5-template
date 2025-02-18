/*
 * @Author: ningyongheng ningyongheng@jeejio.com
 * @Date: 2024-10-09 18:18:15
 * @LastEditors: ningyongheng ningyongheng@jeejio.com
 * @LastEditTime: 2025-02-18 16:05:03
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

/**
 * data：国家地区总数据
 */

// import chinaData from './utils/中国.json';
// import GermanData from './utils/德国.json';
// import FrenchData from './utils/法国.json';
// import CanadaData from './utils/加拿大.json';
// import UsaData from './utils/美国.json';
// import UsData from './utils/英国.json';
// import AustraliaData from './utils/澳大利亚.json';


// const allRegions = {
//     Asia: [chinaData],
//     Europe: [GermanData, FrenchData, UsData],
//     Namerica: [UsaData, CanadaData],
//     Oceania: [AustraliaData],
// };

const app = createApp(App);


const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Modify the title based on the language environment
if (JeeWeb && JeeWeb.Language === 'zh-CN') {
    document.title = '水杯设置';
} else {
    document.title = 'cup setting';
}


// app.config.globalProperties.$cityAll = allRegions;


app.use(pinia);
app.use(router);
app.use(vant);


app.mount('#app');
