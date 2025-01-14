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
        message.error(error.message);
        return Promise.reject(error);
    },
);

export default axios;
