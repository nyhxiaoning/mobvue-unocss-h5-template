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
                                margin-right: -20px;
                            ">
                            &nbsp;&nbsp;{{ states.battery }}%
                        </div>
                    </van-col>
                </van-row>

                <div style="position: relative; margin-left: 30%">
                    <div :class="[states.online ? 'green-dot' : 'green-dot-offline']"></div>
                    <div :class="[states.online ? 'status-text' : 'status-text-offline']">&nbsp;在线</div>
                </div>
                <div style="margin-left: 20px">
                    <van-row type="flex" justify="start" align="center" style="
                            width: 90px;
                            height: 24px;
                            background-color: #ffffff;
                            border-radius: 6px;
                            padding-left: 5px;
                            font-size: 12px;
                            margin-right: 20px;
                        ">
                        <!-- 第一个子 div -->
                        <van-col :span="6">
                            <div :class="curTemperatureClass"  style="width: 16px; height: 16px"></div>
                        </van-col>
                        <!-- 第二个子 div -->
                        <van-col :span="18">
                            <div style="line-height: 24px; height: 26px; font-size: 12px">
                                水温:{{ states.temperature }}℃
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
                    亮度&nbsp; <span style="color: #969698">|</span><span>&nbsp;{{ states.brightness }}%</span>
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
                        <div @click="appWeatherFn" style="display: flex; font-size: 16px; margin-bottom: 5px">
                            时钟
                            <img src="@/assets/arrowtwo.png" width="20" height="20" alt="" />
                        </div>
                    </div>
                    <div style="font-size: 12px; color: #969698">
                        <span>{{ userStore.$state.timezoneLabel }} <br /></span>
                        <span>{{ userStore.$state.timezoneAddress }}</span>
                    </div>
                </div>

                <div class="clock-appcup"></div>
            </div>

            <div class="weather">
                <div>
                    <div>
                        <div @click="appCityFn" style="display: flex; font-size: 16px; margin-bottom: 5px">
                            天气
                            <img src="@/assets/arrowtwo.png" width="20" height="20" alt="" />
                        </div>
                    </div>
                    <div style="font-size: 12px; color: #969698">
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
                            应用配置
                            <img src="@/assets/arrowtwo.png" width="20" height="20" alt="" />
                        </div>
                    </div>
                    <div style="font-size: 12px; color: #969698" @click="restartCup">
                        可设置应用是否在水杯中展示
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
                <div>重启水杯</div>
            </div>

            <div @click="closeScreen" style="flex: 1; text-align: center; background-color: #ffffff; border-radius: 10px">
                <div class="closescreen-cup"></div>
                <div>关闭屏幕</div>
            </div>
            <div @click="goHome" style="flex: 1; text-align: center; background-color: #ffffff; border-radius: 10px">
                <div class="go-home"></div>
                <div>回到主页</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted, watch } from 'vue';

import { timezone } from './../utils/cityzone';

import { useRouter } from 'vue-router';

import { useUserStore } from './../store/index';
import { showToast } from 'vant';

export default defineComponent({
    name: 'SystemSettings',

    setup() {
        const userStore = useUserStore();
        const router = useRouter(); // 获取路由实例
        // const brightness = ref(40);
        console.log(timezone, 'timezone');
        const states = reactive({
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
        });

        // const batteryClass = computed(() => {});

        // const temperatureClass = computed(() => {});

        const onBrightnessChange = (value: number) => {
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
                            message: '设置亮度失败',
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
                    });
        };

        const closeScreen = () => {
            CupDevice &&
                CupDevice.setDevMessage({
                    value: {
                        method: 'setSwitch',
                        params: {
                            value: false,
                        },
                    },
                })
                    .then((res: any) => {
                        console.log(res, '.value');

                        // store.selectedTimezone(selectedTimezone.value);
                    })
                    .catch((err: any) => {
                        console.log(err);
                        showToast({
                            message: '关闭屏幕失败',
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
                            message: '下发命令失败',

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
            // states.curBatteryClass = 'battery-60';
            states.online = JeeWeb && JeeWeb.deviceBind[0]?.devices[0]?.online || false;
            console.log(JeeWeb.deviceBind[0]?.devices[0]?.online, '', JeeWeb.deviceBind[0]?.devices)
            !sessionStorage.getItem('brightnessFlag') && CupDevice &&
                CupDevice.setDevMessage({
                    value: {
                        method: 'getBrightness',
                        params: {},
                    },
                })
                    .then((res: any) => {
                        console.log(res.data, '亮度获取zhi');
                        states.brightness = res.data;
                        userStore.$state.brightness = res.data;
                        sessionStorage.setItem('brightnessFlag', '100');// 记录1
                        // store.selectedTimezone(selectedTimezone.value);
                    })
                    .catch((err: any) => {
                        console.log(err);
                    });

            !sessionStorage.getItem('temperatureFlag') && CupDevice.setDevMessage({
                value: {
                    method: 'getTemperature',
                    params: {},
                },
            })
                .then((res: any) => {
                    console.log(res.data, '单个温度获取');
                    userStore.$state.temperature = res.data;
                    sessionStorage.setItem('temperatureFlag', '100');// 记录1
                    if (res.data) states.temperature = res.data;
                    // if (states.temperature < 0) {
                    //     return (states.curTemperatureClass = 'temperature');
                    // } else if (states.temperature >= 0 && states.temperature < 99) {
                    //     return (states.curTemperatureClass = 'temperature-0');
                    // } else if (states.temperature >= 99) {
                    //     return (states.curTemperatureClass = 'temperature-99');
                    // }
                })
                .catch((err: any) => {
                    console.log(err);
                    // if (states.temperature < 0) {
                    //     return (states.curTemperatureClass = 'temperature');
                    // } else if (states.temperature >= 0 && states.temperature < 99) {
                    //     return (states.curTemperatureClass = 'temperature-0');
                    // } else if (states.temperature >= 99) {
                    //     return (states.curTemperatureClass = 'temperature-99');
                    // }
                    // showToast({
                    //     message: '获取温度失败',
                    //     duration: 1000,
                    // });
                });

            !sessionStorage.getItem('batteryFlag') && CupDevice.setDevMessage({
                value: {
                    method: 'getBatteryStatus',
                    params: {},
                },
            })
                .then((res: any) => {
                    console.log(res.data, '单个电池');
                    states.battery = res.data;
                    userStore.$state.battery = res.data;
                    sessionStorage.setItem('batteryFlag', '100');// 记录1
                    // if (states.battery < 20) {
                    //     return (states.curBatteryClass = 'battery-20');
                    // } else if (states.battery > 20 && states.battery < 40) {
                    //     return (states.curBatteryClass = 'battery-40');
                    // } else if (states.battery > 40) {
                    //     return (states.curBatteryClass = 'battery-60');
                    // }
                    // 只有输出电量
                    // states.batteryStatus = res.data.value?true:false;
                })
                .catch((err: any) => {
                    console.log(err);
                    // if (states.battery < 20) {
                    //     return (states.curBatteryClass = 'battery-20');
                    // } else if (states.battery > 20 && states.battery < 40) {
                    //     return (states.curBatteryClass = 'battery-40');
                    // } else if (states.battery > 40) {
                    //     return (states.curBatteryClass = 'battery-60');
                    // }
                });
        });


        // // Watch battery changes
        // watch(
        //     () => userStore.$state.battery,
        //     (newValue, oldValue) => {
        //         console.log('Brightness changed:', oldValue, '->', newValue)
        //         if (!newValue) {
        //             return states.curBatteryClass = 'battery-20'
        //         } else if (newValue < 20) {
        //             return (states.curBatteryClass = 'battery-20');
        //         } else if (newValue > 20 && newValue < 40) {
        //             return (states.curBatteryClass = 'battery-40');
        //         } else if (newValue > 40) {
        //             return (states.curBatteryClass = 'battery-60');
        //         }
        //         // Add your logic here for brightness changes
        //     }
        // )

        // // Watch temperature changes
        // watch(
        //     () => userStore.$state.temperature,
        //     (newValue, oldValue) => {
        //         console.log('Temperature changed:', oldValue, '->', newValue)
        //         // Add your logic here for temperature changes
        //         if (!newValue) {
        //             return (states.curTemperatureClass = 'temperature');
        //         } else if (newValue < 0) {
        //             return (states.curTemperatureClass = 'temperature');
        //         } else if (newValue >= 0 && newValue < 99) {
        //             return (states.curTemperatureClass = 'temperature-0');
        //         } else if (newValue >= 99) {
        //             return (states.curTemperatureClass = 'temperature-99');
        //         }
        //     }
        // )

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
