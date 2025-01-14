/// <reference types="vite/client" />

declare global {
    interface Window {
        DeviceManager: any;

        JeeWeb: any;
    }
}

declare const DeviceManager: any;

declare const JeeWeb: any;

// 请求
declare type UrlType = {
    id: number | string;
    pid?: number | string;
};

// 响应
declare type ResType<T = unknown> = {
    code: number;
    message: string;
    result?: T;
};

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_WSS_URL: string;

    readonly VITE_CDN_URL: string;
    readonly VITE_SSO_URL: string;

    readonly VITE_CONSOLE: string;
    readonly VITE_DEVELOPER: string;
    readonly VITE_PMP: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
