/*
 * @Author: ningyongheng ningyongheng@jeejio.com
 * @Date: 2024-10-09 18:18:15
 * @LastEditors: ningyongheng ningyongheng@jeejio.com
 * @LastEditTime: 2025-02-17 13:09:03
 * @FilePath: /cupsystem/src/request/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * Types
 */
import type { AxiosError } from 'axios';
import axios from 'axios';
import { showToast } from 'vant';
import store from 'store2';

/**
 * Axios
 */
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use((config) => {
    if (store.has('token')) {
        config.headers.Token = store.get('token');
    }

    return config;
});

axios.interceptors.response.use(
    (response) => {
        // 用户未登录
        if (response.data.code === 11101) {
            store.remove('token');
        }

        // 11429, "上传授权已过期，请点击进入小应用以继续"
        if ([11429].includes(response.data.code)) {
            showToast(response.data.message);
        }

        return response;
    },
    (error: AxiosError) => {
        // message.error(error.message);
        return Promise.reject(error);
    },
);

export default axios;
