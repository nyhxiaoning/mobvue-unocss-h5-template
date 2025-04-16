import axios from './index';

export function gArtifactPage(token: string) {
    return axios<ResType<any>>('/im/cup/artifact/page', {
        params: {
            token
        },
        method: 'get',
    });
}

export function gFavoritePage(token:string) {
    return axios<ResType<any>>('/im/cup/favorite/page', {
        params:{
            token
        },
        method: 'get',
    });
}
