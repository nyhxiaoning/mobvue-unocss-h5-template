import axios from './index';

// 标记加载引导页
export function upAppFile(data: { token: string; file: any }) {
    return axios<ResType>('/im/apps/file', {
        data,
        headers: {
            'content-type': 'multipart/form-data',
        },
        method: 'post',
    });
}
