import axios from './index';

export function gArtifactPage() {
    return axios<ResType<any>>('/im/cup/artifact/page', {
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
