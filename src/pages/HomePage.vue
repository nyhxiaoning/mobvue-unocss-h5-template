<template>
    <div class="system-settings">
        <!-- 顶部状态栏 -->
        <div class="status-bar">
            <van-row justify="space-between" align="center">
                <van-row type="flex" justify="start" align="center" style="width: 58px; height: 24px; font-size: 12px">
                    <!-- 第一个子 div -->
                    <van-col :span="12">
                        <div :class="curBatteryClass" style="width: 24px; height: 24px"></div>
                    </van-col>
                    <!-- 第二个子 div -->
                    <van-col :span="12">
                        <div style="
                                line-height: 24px;
                                height: 26px;
                                text-align: center;
                                margin-right: -30px;
                            ">
                             {{ states.battery }}%
                        </div>

                    </van-col>
                </van-row>

                <div style="position: relative; margin-left: 10%">
                    <div :class="[states.online ? 'green-dot' : 'green-dot-offline']"></div>
                    <div :class="[states.online ? 'status-text' : 'status-text-offline']">&nbsp;{{ language.online }}</div>
                </div>
                <div style="margin-left: 20px">
                    <van-row type="flex" justify="start" align="center"
                        :class="[states.languageFlag ? 'temperature-content' : 'temperature-content-en']">
                        <!-- 第一个子 div -->
                        <van-col :span="6">
                            <div :class="curTemperatureClass" style="width: 16px; height: 16px"></div>
                        </van-col>
                        <!-- 第二个子 div -->
                        <van-col :span="18">
                            <div style="line-height: 24px; height: 26px; font-size: 12px">
                                {{ language.waterTemp }}:{{ states.temperature }}℃
                            </div>
                        </van-col>
                    </van-row>
                </div>
            </van-row>
        </div>

        <!-- 亮度调节 -->
        <div class="brightness-control">
            <div style="font-size: 16px; margin: 20px; margin-left: 15px">
                <div>
                    {{ language.brightness }}&nbsp; <span style="color: #969698">|</span><span>&nbsp;{{ states.brightness
                    }}%</span>
                </div>
                <div style="font-size: 12px; color: #969698; margin: 20px; margin-left: 15px" @click="restartCup">
                    <van-slider bar-height="6px" active-color="#31ACF8" v-model="states.brightness"
                        @change="onBrightnessChange" step="10">
                    </van-slider>
                </div>
            </div>
        </div>
        <!-- 时钟和天气 -->
        <div class="weather-clock">
            <div class="clock">
                <div>
                    <div>
                        <div @click="appWeatherFn" style="display: flex; font-size: 16px; margin-bottom: 5px; margin-left:10px">
                            {{ language.clock }}
                            <img src="@/assets/arrowtwo.png" width="20" height="20" alt="" />
                        </div>
                    </div>
                    <div style="font-size: 12px; color: #969698; margin-left:10px">
                        <span>{{ userStore.$state.timezoneLabel }} <br /></span>
                        <span>{{ userStore.$state.timezoneAddress }}</span>
                    </div>
                </div>

                <div class="clock-appcup"></div>
            </div>

            <div class="weather">
                <div>
                    <div>
                        <div @click="appCityFn" style="display: flex; font-size: 16px; margin-bottom: 5px; margin-left:10px">
                            {{ language.weather }}
                            <img src="@/assets/arrowtwo.png" width="20" height="20" alt="" />
                        </div>
                    </div>
                    <div style="font-size: 12px; color: #969698; margin-left:10px">
                        <span><van-icon name="location-o" />{{ states.weatheraddress }} <br /></span>
                    </div>
                </div>

                <div class="weather-appcup"></div>
            </div>
        </div>

        <!-- 空白间隔 -->
        <!-- <div class="spacer"></div> -->

        <!-- 应用配置 -->
        <div class="feature-item">
            <div @click="appConfigFn" style="
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    text-align: center;
                    background-color: #ffffff;
                    border-radius: 10px;
                    align-items: center;
                ">
                <div>
                    <div>
                        <div style="
                                display: flex;
                                font-size: 16px;
                                margin-bottom: 5px;
                                text-align: center;
                            ">
                            {{ language.appConfig }}
                            <img src="@/assets/arrowtwo.png" width="20" height="20" alt="" />
                        </div>
                    </div>
                    <div style="font-size: 12px; color: #969698" @click="restartCup">
                        {{ language.appConfigDesc }}
                    </div>
                </div>

                <div class="seting-appcup"></div>
            </div>
        </div>

        <!-- 空白间隔 -->
        <div class="spacer-bottom"></div>

        <!-- 底部按钮 -->
        <div class="bottom-actions">
            <div @click="restartCup" style="flex: 1; text-align: center; background-color: #ffffff; border-radius: 10px">
                <div class="reboot-cup"></div>
                <div>{{ language.restartCup }}</div>
            </div>

            <div @click="closeScreen" style="flex: 1; text-align: center; background-color: #ffffff; border-radius: 10px">
                <div class="closescreen-cup"></div>
                <div>{{ states.screenStatus ? language.closeScreen : language.openScreen }}</div>
            </div>
            <div @click="goHome" style="flex: 1; text-align: center; background-color: #ffffff; border-radius: 10px">
                <div class="go-home"></div>
                <div>{{ language.returnHome }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted, watch, ref } from 'vue';

import { timezone } from './../utils/cityzone';

import { useRouter, onBeforeRouteUpdate } from 'vue-router';

import { useUserStore } from './../store/index';
import { showToast } from 'vant';

import chinaData from './../utils/中国.json';
import { useStore } from 'vuex';

export default defineComponent({
    name: 'SystemSettings',

    setup() {

        console.log(chinaData,'chinaData',chinaData.cities);


        const timezones = ref([
            {
                name: 'UTC-12:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC-12:00）贝克岛'
                    : '(UTC-12:00) Baker Island',
                value: 'Chile/EasterIsland',
            },
            {
                name: 'UTC-11:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC-11:00）帕果帕果'
                    : '(UTC-11:00) Pago Pago',
                value: 'Pacific/Pago_Pago',
            },
            {
                name: 'UTC-10:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC-10:00）檀香山'
                    : '(UTC-10:00) Honolulu',
                value: 'Pacific/Honolulu',
            },
            {
                name: 'UTC-9:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC-9:00）安克雷奇'
                    : '(UTC-9:00) Anchorage',
                value: 'America/Anchorage',
            },
            {
                name: 'UTC-8:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC-8:00）洛杉矶'
                    : '(UTC-8:00) Los Angeles',
                value: 'America/Los_Angeles',
            },
            {
                name: 'UTC-7:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC-7:00）丹佛'
                    : '(UTC-7:00) Denver',
                value: 'America/Denver',
            },
            {
                name: 'UTC-6:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC-6:00）芝加哥'
                    : '(UTC-6:00) Chicago',
                value: 'America/Chicago',
            },
            {
                name: 'UTC-5:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC-5:00）纽约'
                    : '(UTC-5:00) New York',
                value: 'America/New_York',
            },
            {
                name: 'UTC-4:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC-4:00）圣地亚哥'
                    : '(UTC-4:00) Santiago',
                value: 'America/Argentina/Cordoba',
            },
            {
                name: 'UTC-3:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC-3:00）布宜诺斯艾利斯'
                    : '(UTC-3:00) Buenos Aires',
                value: 'America/Argentina/Buenos_Aires',
            },
            {
                name: 'UTC-2:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC-2:00）南乔治亚岛'
                    : '(UTC-2:00) South Georgia Island',
                value: 'Atlantic/South_Georgia',
            },
            {
                name: 'UTC-1:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC-1:00）亚速尔群岛'
                    : '(UTC-1:00) Azores',
                value: 'Atlantic/Azores',
            },
            {
                name: 'UTC+00:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC+00:00）伦敦'
                    : '(UTC+00:00) London',
                value: 'Europe/London',
            },
            {
                name: 'UTC+01:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC+01:00）巴黎'
                    : '(UTC+01:00) Paris',
                value: 'Europe/Paris',
            },
            {
                name: 'UTC+02:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC+02:00）开罗'
                    : '(UTC+02:00) Cairo',
                value: 'Africa/Cairo',
            },
            {
                name: 'UTC+03:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC+03:00）莫斯科'
                    : '(UTC+03:00) Moscow',
                value: 'Europe/Moscow',
            },
            {
                name: 'UTC+04:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC+04:00）迪拜'
                    : '(UTC+04:00) Dubai',
                value: 'Asia/Dubai',
            },
            {
                name: 'UTC+05:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC+05:00）卡拉奇'
                    : '(UTC+05:00) Karachi',
                value: 'Asia/Karachi',
            },
            {
                name: 'UTC+06:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC+06:00）达卡'
                    : '(UTC+06:00) Dhaka',
                value: 'Asia/Dhaka',
            },
            {
                name: 'UTC+07:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC+07:00）曼谷'
                    : '(UTC+07:00) Bangkok',
                value: 'Asia/Bangkok',
            },
            {
                name: 'UTC+08:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC+08:00）北京'
                    : '(UTC+08:00) Beijing',
                value: 'Asia/Shanghai',
            },
            {
                name: 'UTC+09:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC+09:00）东京'
                    : '(UTC+09:00) Tokyo',
                value: 'Asia/Tokyo',
            },
            {
                name: 'UTC+10:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC+10:00）悉尼'
                    : '(UTC+10:00) Sydney',
                value: 'Australia/Sydney',
            },
            {
                name: 'UTC+11:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC+11:00）所罗门群岛'
                    : '(UTC+11:00) Solomon Islands',
                value: 'Pacific/Guadalcanal',
            },
            {
                name: 'UTC+12:00',
                label: JeeWeb.Language === 'zh-CN'
                    ? '（UTC+12:00）奥克兰'
                    : '(UTC+12:00) Auckland',
                timezone: 'Pacific/Auckland',
            },
        ]);
        const userStore = useUserStore();
        const router = useRouter(); // 获取路由实例
        // const brightness = ref(40);
        console.log(timezone, 'timezone');
        const states = reactive({
            languageFlag: JeeWeb.Language === 'zh-CN' ? true : false,
            battery: userStore.$state.battery || 0,
            brightness: userStore.$state.brightness || 0,
            temperature: userStore.$state.temperature || 0,
            batteryStatus: false,
            address: '',
            weatheraddress: userStore.$state.weathername || '',
            clock: '',
            curBatteryClass: 'battery-20',
            curTemperatureClass: 'temperature-0',
            online: false,
            // 默认一定是开启
            screenStatus: true,

        });

        const language = reactive({
            online: JeeWeb.Language === 'zh-CN' ? '在线' : 'Online',
            waterTemp: JeeWeb.Language === 'zh-CN' ? '水温' : 'Water Temp',
            brightness: JeeWeb.Language === 'zh-CN' ? '亮度' : 'Brightness',
            clock: JeeWeb.Language === 'zh-CN' ? '时钟' : 'Clock',
            weather: JeeWeb.Language === 'zh-CN' ? '天气' : 'Weather',
            appConfig: JeeWeb.Language === 'zh-CN' ? '应用配置' : 'App Config',
            appConfigDesc: JeeWeb.Language === 'zh-CN' ? '可设置应用是否在水杯中展示' : 'Configure app display settings on cup',
            restartCup: JeeWeb.Language === 'zh-CN' ? '重启水杯' : 'Restart Cup',
            closeScreen: JeeWeb.Language === 'zh-CN' ? '关闭屏幕' : 'Turn Off Screen',
            openScreen: JeeWeb.Language === 'zh-CN' ? '打开屏幕' : 'Turn On Screen',
            returnHome: JeeWeb.Language === 'zh-CN' ? '回到主页' : 'Return Home',
            setBrightnessError: JeeWeb.Language === 'zh-CN' ? '设置亮度失败' : 'Failed to set brightness',
            setRestartError: JeeWeb.Language === 'zh-CN' ? '设置重启失败' : 'Failed to set restart',
            getCupInfoError: JeeWeb.Language === 'zh-CN' ? '获取水杯基本信息失败' : 'Failed to get basic information about water cup',
            returnHomeError: JeeWeb.Language === 'zh-CN' ? '回到主页下发失败' : 'Failed to return home',
            screenOffError: JeeWeb.Language === 'zh-CN' ? '关闭屏幕失败' : 'Failed to turn off screen',
            screenOnError: JeeWeb.Language === 'zh-CN' ? '开启屏幕失败' : 'Failed to turn on screen'
        });

        // const batteryClass = computed(() => {});

        // const temperatureClass = computed(() => {});

        const onBrightnessChange = (value: number) => {
            if (value === 0) {
                value = 1;
            }
            console.log('当前亮度：', value);
            CupDevice &&
                CupDevice.setDevMessage({
                    value: {
                        method: 'setBrightness',
                        params: {
                            value: value,
                        },
                    },
                })
                    .then((res: any) => {
                        console.log(res.data, '设置亮度.value');
                        // userStore.$state.brightness = value as any;

                        // store.selectedTimezone(selectedTimezone.value);
                    })
                    .catch((err: any) => {
                        console.log(err);
                        showToast({
                            message: language.setBrightnessError,
                            duration: 1000,
                        });
                    });
        };

        const restartCup = () => {
            // 重启设备后，其实没有回复，所以不需要拦截
            CupDevice &&
                CupDevice.setDevMessage({
                    value: {
                        method: 'PixelCupRestart',
                        params: {},
                    },
                })
                    .then((res: any) => {
                        console.log(res, '.value');

                        // store.selectedTimezone(selectedTimezone.value);
                    })
                    .catch((err: any) => {
                        console.log(err);
                        // 不能设置失败，因为这里设备马上离线了
                        // showToast({
                        //     message: language.setRestartError,
                        //     duration: 1000,
                        // });
                    });
        };

        const closeScreen = () => {

            CupDevice &&
                CupDevice.setDevMessage({
                    value: {
                        method: 'setSwitch',
                        params: {
                            value: states.screenStatus ? false : true,
                        },
                    },
                })
                    .then((res: any) => {
                        console.log(res, '.value');
                        states.screenStatus = !states.screenStatus;
                        // store.selectedTimezone(selectedTimezone.value);
                    })
                    .catch((err: any) => {
                        console.log(err);
                        showToast({
                            message: states.screenStatus ? language.screenOffError : language.screenOnError,
                            duration: 1000,
                        });
                    });
            console.log('关闭屏幕');
        };

        const goHome = () => {
            console.log('return2Home');
            CupDevice &&
                CupDevice.setDevMessage({
                    value: {
                        method: 'return2Home',
                        params: {},
                    },
                })
                    .then((res: any) => {
                        console.log(res, '.value');

                        // store.selectedTimezone(selectedTimezone.value);
                    })
                    .catch((err: any) => {
                        console.log(err);
                        showToast({
                            message: language.returnHomeError,

                            duration: 1000,
                        });
                    });
        };

        const appConfigFn = () => {
            // alert('应用设置');
            // $route.push('/setting');
            router.push('setting'); // 跳转到首页

            console.log('应用设置');
        };

        const appWeatherFn = () => {
            // alert('应用设置');
            // $route.push('/setting');
            router.push('timezone'); // 跳转到首页
        };

        const appCityFn = () => {
            // alert('应用设置');
            // $route.push('/setting');
            router.push('weather'); // 跳转到首页
        };

        // 计算温度状态的 class
        const curTemperatureClass = computed(() => {
            if (states.temperature < 0) {
                return 'temperature';
            } else if (states.temperature < 99) {
                return 'temperature-0';
            } else {
                return 'temperature-99';
            }
        });

        // 计算电池状态的 class
        const curBatteryClass = computed(() => {
            if (states.battery < 20) {
                return 'battery-20';
            } else if (states.battery < 40) { // 省略 `> 20`，因为前面已经判断 `< 20`
                return 'battery-40';
            } else {
                return 'battery-60';
            }
        });

        onMounted(() => {
            console.log(Object.values(userStore.$state.allCitys), 'object.values')

            // states.curBatteryClass = 'battery-60';
            // states.online = JeeWeb && JeeWeb.deviceBind[0]?.devices[0]?.online || false;
            console.log(JeeWeb.deviceBind[0]?.devices[0]?.online, '', JeeWeb.deviceBind[0]?.devices)
            CupDevice &&
                CupDevice.setDevMessage({
                    value: {
                        method: 'getCupInfo',
                        params: {},
                    },
                })
                    .then((res: any) => {
                        console.log(res.data, 'getCupInfo');
                        states.brightness = res.data.brightness;
                        states.temperature = res.data.waterTemperature;
                        states.battery = res.data.batteryStatus;
                        states.screenStatus = res.data.switch;
                        states.address = res.data.timezone;
                        // states.weatheraddress = res.data.city;
                        // 设置天气地址:线上国内仅仅支持中国
                        if(res.data.city){
                            // 循环四个数组

                            // console.log(Object.values(userStore.$state.allCitys),'object.values')
                            // for(let i =0;i< Object.values(userStore.$state.allCitys).length;i++){
                            //     if(res.data.city === chinaData.cities[i].value){
                            //         states.weatheraddress = chinaData.cities[i].name;
                            //         sessionStorage.setItem('weathervalue', res.data.city);
                            //         sessionStorage.setItem('weatheroldvalue', res.data.city);
                            //         sessionStorage.setItem('weatheroldname', chinaData.cities[i].name);
                            //         sessionStorage.setItem('weathername', chinaData.cities[i].name);
                            //     }
                            // }

                            let itemsAllCity = Object.values(userStore.$state.allCitys);
                            for (let i = 0; i < itemsAllCity.length; i++) {
                                console.log(itemsAllCity[i], 'itemsAllCity')
                                console.log(itemsAllCity[i][0], 'cities')
                                console.log(itemsAllCity[i][0].cities, 'cities')
                                let currentCities = itemsAllCity[i][0].cities;
                                for (let j = 0; j < currentCities.length; j++) {
                                    if (currentCities[j].value === res.data.city) {
                                        userStore.$state.weathername = JeeWeb.Language === 'zh-CN'? currentCities[j].name: currentCities[j].nameEn;
                                        states.weatheraddress =  userStore.$state.weathername;
                                        userStore.$state.weathervalue = currentCities[j].value;
                                    }

                                }
                            }
                        }
                        // 如果国外的环境，不用找了，默认两个值相同
                        // if(JeeWeb.Language !== 'zh-CN'){
                        //     states.weatheraddress = res.data.city;
                        //     sessionStorage.setItem('weathervalue', res.data.city);
                        //     sessionStorage.setItem('weatheroldvalue', res.data.city);
                        // }
                        // userStore.$state.weathervalue = res.data.city;
                        const item = timezones.value.find(item => item.value === res.data.timezone);

                        userStore.$state.timezoneLabel = item ? item.name : '';
                        if (JeeWeb.Language === 'zh-CN' && item) {
                            userStore.$state.timezoneAddress = item.label.split("）")[1]
                        }

                        if (JeeWeb.Language !== 'zh-CN' && item) {
                            userStore.$state.timezoneAddress = item.label.split(")")[1]
                        }

                        // userStore.$state.brightness = res.data.brightness;


                        // 如果可以获取当前TAL水杯信息，默认获取在线状态
                        states.online = true;
                        // 为了记录有没有获取过接口，如果获取了，那么下一次不会了。
                        sessionStorage.setItem('getCupInfoFlag', '100');// 记录1
                        // store.selectedTimezone(selectedTimezone.value);
                    })
                    .catch((err: any) => {
                        console.log(err);
                        showToast({
                            message: language.getCupInfoError,
                            duration: 1000,
                        });
                    });

        });


        // // Watch battery changes
        watch(
            () => states.battery,
            (newValue, oldValue) => {
                console.log('Brightness changed:', oldValue, '->', newValue)
                if (newValue < 20) {
                    return (states.curBatteryClass = 'battery-20');
                } else if (newValue > 20 && newValue < 100) {
                    return (states.curBatteryClass = 'battery-40');
                } else if (newValue > 99) {
                    return (states.curBatteryClass = 'battery-60');
                }
                // Add your logic here for brightness changes
            }
        )

        // // Watch temperature changes
        watch(
            () => states.temperature,
            (newValue, oldValue) => {
                console.log('Temperature changed:', oldValue, '->', newValue)
                // Add your logic here for temperature changes
                if (!newValue) {
                    return (states.curTemperatureClass = 'temperature');
                } else if (newValue < 20) {
                    return (states.curTemperatureClass = 'temperature');
                } else if (newValue >= 20 && newValue < 80 ) {
                    return (states.curTemperatureClass = 'temperature-0');
                } else if (newValue >= 80) {
                    return (states.curTemperatureClass = 'temperature-99');
                }
            }
        )

        return {
            onBrightnessChange,
            restartCup,
            closeScreen,
            goHome,
            appConfigFn,
            appWeatherFn,
            appCityFn,
            states,
            curBatteryClass,
            curTemperatureClass,
            userStore,
            language,
        };
    },
});
</script>

<style scoped>
.system-settings {
    padding: 16px;
    background: #f7f8fa;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180.08deg, #c5e6ff -1.16%, #ecf6ff 14.34%, #f3f4f7 50%);
}

.status-bar {
    margin-bottom: 16px;
}

.icon {
    margin-right: 4px;
}

.status-text {
    display: inline-block;
    line-height: 20px;
    height: 20px;
    color: green;
    /* margin-right: 30px; */
    font-size: 12px;
}

.status-text-offline {
    display: inline-block;
    line-height: 20px;
    height: 20px;
    color: #A3A3A3;
    /* margin-right: 30px; */
    font-size: 12px;
}

.brightness-control {
    display: flex;
    flex: 0.3;
    /* align-items: center; */
    flex-direction: column;

    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 16px;
    background-color: #ffffff;
    height: 90px;
    border-radius: 12px;
}

.weather-clock {
    flex: 2;
    display: flex;
    margin-left: 20px;
    margin-right: 20px;
    /* flex-direction: column; */
    justify-content: center;
    align-items: center;

    font-size: 12px;
    border-radius: 12px;
}

.weather {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 100px;
    background-color: #ffffff;

    border-radius: 12px;
}

.clock {
    flex: 1;
    display: flex;
    margin-right: 20px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 100px;
    background-color: #ffffff;

    border-radius: 12px;
}

.feature-item {
    display: flex;
    flex: 0.5;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 16px;
    padding: 10px;
    background-color: #ffffff;
    font-size: 12px;
    border-radius: 12px;
}

.bottom-actions {
    display: flex;
    flex: 0.2;
    flex-direction: row;
    margin-top: 16px;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 16px;
    padding: 10px;
    background-color: #ffffff;
    font-size: 12px;
    border-radius: 12px;
    justify-content: center;

    div {
        flex: 1;
        align-content: center;
        padding: 5px;
        border-radius: 12px;
    }
}

.spacer-bottom {
    flex: 3;
    /* 调整空白间隔的高度 */
}

.green-dot {
    width: 10px;
    height: 10px;
    background-color: #36c449;
    border-radius: 50%;
    display: inline-block;
}


.green-dot-offline {
    width: 10px;
    height: 10px;
    background-color: #A3A3A3;
    border-radius: 50%;
    display: inline-block;
}

.black-dot {
    width: 10px;
    height: 10px;
    background-color: #f3f4f7;
    border-radius: 50%;
    display: inline-block;
}

.battery-20 {
    margin-left: 20px;
    width: 24px;
    height: 24px;
    /* background-image: url('@/assets/battery20.png'); */
    background: url('@/assets/battery20.png') center / contain no-repeat;

    border-radius: 50%;
    display: inline-block;
}

.battery-40 {
    margin-left: 20px;
    width: 24px;
    height: 24px;
    /* background-color: #36C449;
     */
    background: url('@/assets/battery40.png') center / contain no-repeat;
    border-radius: 50%;
    display: inline-block;
}

.battery-60 {
    margin-left: 20px;
    width: 24px;
    height: 24px;
    /* background-color: #36C449;
     */
    background: url('@/assets/battery60.png') center / contain no-repeat;
    border-radius: 50%;
    display: inline-block;
}

.battery-loading {
    margin-left: 20px;
    width: 24px;
    height: 24px;
    background: url('@/assets/batteryLoading.png') center / contain no-repeat;
    border-radius: 50%;
    display: inline-block;
}

.custom-button {
    width: 26px;
    color: #fff;
    font-size: 10px;
    line-height: 18px;
    text-align: center;
    background-color: var(--van-primary-color);
    border-radius: 60px;
}

.temperature {
    width: 16px;
    height: 16px;
    /* background-image: url('@/assets/battery20.png'); */
    background: url('@/assets/temp.png') center / contain no-repeat;

    border-radius: 50%;
    display: inline-block;
}

.temperature-content-en {
    width: 150px;
    height: 24px;
    background-color: #ffffff;
    border-radius: 6px;
    padding-left: 5px;
    font-size: 12px;
    margin-right: 20px;
}

.temperature-content {
    width: 90px;
    height: 24px;
    background-color: #ffffff;
    border-radius: 6px;
    padding-left: 5px;
    font-size: 12px;
    margin-right: 20px;
}

.temperature-0 {
    width: 16px;
    height: 16px;
    /* background-image: url('@/assets/battery20.png'); */
    background: url('@/assets/temp0.png') center / contain no-repeat;

    border-radius: 50%;
    display: inline-block;
}

.temperature-99 {
    width: 16px;
    height: 16px;
    /* background-image: url('@/assets/battery20.png'); */
    background: url('@/assets/temp99.png') center / contain no-repeat;

    border-radius: 50%;
    display: inline-block;
}

.go-home {
    background: url('@/assets/goHome.png') center / contain no-repeat;
    width: 16px;
    height: 16px;

    display: inline-block;
}

.reboot-cup {
    background: url('@/assets/reboot.png') center / contain no-repeat;
    width: 16px;
    height: 16px;

    display: inline-block;
}

.clock-appcup {
    background: url('@/assets/clock.png') center / contain no-repeat;
    width: 40px;
    height: 47px;

    display: inline-block;
}

.weather-appcup {
    background: url('@/assets/weather.png') center / contain no-repeat;
    width: 40px;
    height: 47px;

    display: inline-block;
}

.seting-appcup {
    background: url('@/assets/appseting.png') center / contain no-repeat;
    width: 40px;
    height: 47px;

    display: inline-block;
}

.closescreen-cup {
    background: url('@/assets/closescreen.png') center / contain no-repeat;
    width: 16px;
    height: 16px;
    display: inline-block;
}

.close-screen {
    background: url('@/assets/closeScreen.png') center / contain no-repeat;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: inline-block;
}
</style>
