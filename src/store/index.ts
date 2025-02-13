/*
 * @Author: ningyongheng ningyongheng@jeejio.com
 * @Date: 2025-01-24 11:23:53
 * @LastEditors: ningyongheng ningyongheng@jeejio.com
 * @LastEditTime: 2025-02-13 15:17:28
 * @FilePath: /cupsystem/src/store/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia';

export const useUserStore = defineStore('userInfo', {
    // 定义 state
    state: () => ({
        timezoneAddress: '北京',
        timezoneValue: 'Asia/Shanghai',
        timezoneLabel: 'UTC+08:00',
        weathername: '',
        weathervalue: '',
        brightness: 1,
        battery: undefined,
        temperature: undefined,

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
        }
    }

});
