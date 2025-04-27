/*
 * @Author: ningyongheng ningyongheng@jeejio.com
 * @Date: 2025-01-24 11:23:53
 * @LastEditors: ningyongheng ningyongheng@jeejio.com
 * @LastEditTime: 2025-02-21 14:28:44
 * @FilePath: /cupsystem/src/store/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia';
/**
 * data：国家地区总数据
 */

import chinaData from './../utils/中国.json';
import GermanData from './../utils/德国.json';
import FrenchData from './../utils/法国.json';
import CanadaData from './../utils/加拿大.json';
import UsaData from './../utils/美国.json';
import UsData from './../utils/英国.json';
import AustraliaData from './../utils/澳大利亚.json';
const JeeWeb = {
    Language: 'zh-CN',
}

const allRegions = {
    Asia: [chinaData],
    Europe: [GermanData, FrenchData, UsData],
    'N.America': [UsaData, CanadaData],
    Oceania: [AustraliaData],
};

export const useUserStore = defineStore('userInfo', {
    // 定义 state
    state: () => ({
        allCitys: allRegions,
        // 默认当前的时区
        timezoneAddress: JeeWeb.Language === 'zh-CN' ? '北京' : 'Beijing',
        timezoneValue: 'Asia/Shanghai',
        timezoneLabel: 'UTC+08:00',
        // 默认当前的天气：显示label和value值
        // 当前的页面中间切换回显：这里如果是选中的暂存，这里使用上一个页面的sessionStorage，如果是主页过来回显的，这里查询一下name，
        // 这里需要做一个路由守卫，这里内容，如果上一个路由是：home主页，那么使用store的数据，如果是来自城市选择，那么使用sessionStorage数据
        weathername: '',
        weathervalue: '',
        brightness: 0,
        battery: undefined,
        temperature: undefined,
        fromHome:false,// 来自主页的页面标记
        // 增加屏保应用loadding
        screenSaveLoading: false,
    }),
    // 定义 getters，用于获取 state
    getters: {
        timezoneAddress: (state) => state.timezoneAddress,
        timezoneValue: (state) => state.timezoneValue,
        timezoneLabel: (state) => state.timezoneLabel,
        weathername: (state) => state.weathername,
        weathervalue: (state) => state.weathervalue,
        brightness: (state) => state.brightness,
        battery: (state) => state.battery,
        temperature: (state) => state.temperature,
        fromHome: (state)=>state.fromHome
    },
    // 定义 actions，用于修改 state,并且可以包含异步操作
    actions: {
        updateTimezoneAddress(name: string) {
            this.timezoneAddress = name;
        },
        updateTimezoneValue(value: string) {
            this.timezoneValue = value;
        },

        updateTimezoneLabel(label: string) {
            this.timezoneLabel = label;
        },
        updateWeatherName(name: string) {
            this.weathername = name;
        },
        updateWeatherValue(value: string) {
            this.weathervalue = value;
        },
        updateBrightness(value: number) {
            this.brightness = value as any;
        },
        updateBattery(value: number) {
            this.battery = value as any;
        },
        updateTemperature(value: number) {
            this.temperature = value as any;
        },
    },
});
