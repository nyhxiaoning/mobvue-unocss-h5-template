import axios from './index';

// 登录
// export function login(data: LoginData) {
//     return axios<Required<ResType<User>>>('/user/admin/login', {
//         data,
//         method: 'post',
//     });
// }

export function rHome() {
    return axios<ResType<HomeData>>('/operate/home', {
        method: 'get',
    });
}

/**
 * Types
 */

export type HomeData = {
    productVO: {
        purchased: number;
        classification: number;
        validationNumber: number;
    };
    recommendRank: [
        {
            imgUrl?: string;
            name: string;
            categoryName: string;
        },
    ];
    recommendServe: {
        count: number;
        classification: number;
    };
};
