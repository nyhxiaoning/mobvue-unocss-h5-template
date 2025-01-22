<template>
    <div class="system-settings">
        <!-- 顶部状态栏 -->
        <div class="status-bar">
            <van-row justify="space-between" align="center">
                <van-row
                    type="flex"
                    justify="start"
                    align="center"
                    style="width: 58px; height: 24px; font-size: 12px"
                >
                    <!-- 第一个子 div -->
                    <van-col :span="12">
                        <div :class="batteryClass" style="width: 24px; height: 24px"></div>
                    </van-col>
                    <!-- 第二个子 div -->
                    <van-col :span="12">
                        <div
                            style="
                                line-height: 24px;
                                height: 26px;
                                text-align: center;
                                margin-right: -20px;
                            "
                        >
                            &nbsp;&nbsp;{{ states.battery }}%
                        </div>
                    </van-col>
                </van-row>

                <div style="position: relative; left: 80px">
                    <div class="green-dot"></div>
                    <div class="status-text">&nbsp;在线</div>
                </div>
                <van-row
                    type="flex"
                    justify="start"
                    align="center"
                    style="
                        width: 90px;
                        height: 24px;
                        background-color: #ffffff;
                        border-radius: 6px;
                        padding-left: 5px;
                        font-size: 12px;
                        margin-right: 20px;
                    "
                >
                    <!-- 第一个子 div -->
                    <van-col :span="4">
                        <div :class="temperatureClass" style="width: 16px; height: 16px"></div>
                    </van-col>
                    <!-- 第二个子 div -->
                    <van-col :span="18">
                        <div style="line-height: 24px; height: 26px; font-size: 12px">
                            {{ states.temperature }}
                        </div>
                    </van-col>
                </van-row>
            </van-row>
        </div>

        <!-- 亮度调节 -->
        <div class="brightness-control">
            <div style="font-size: 16px; margin: 20px">
                <div>
                    亮度&nbsp; <span style="color: #969698">|</span
                    ><span>&nbsp;{{ brightness }}%</span>
                </div>
                <div style="font-size: 12px; color: #969698; margin: 20px" @click="restartCup">
                    <van-slider
                        bar-height="6px"
                        active-color="#31ACF8"
                        v-model="brightness"
                        @change="onBrightnessChange"
                        step="10"
                    >
                        <!-- <template #button>
                        <div class="custom-button">{{ brightness }}11</div>
                    </template> -->
                    </van-slider>
                </div>
            </div>

            <!-- <van-cell-group inset>
                <van-cell center inset>
                    <van-slider v-model="brightness" @change="onBrightnessChange" step="10">
                        <template #button>
                            <div class="custom-button">{{ brightness }}11</div>
                        </template>
                    </van-slider>
                </van-cell>
            </van-cell-group> -->
        </div>

        <!-- 空白间隔 -->
        <div class="spacer"></div>
        <!-- 时钟和天气 -->
        <div class="weather-clock">
            <div class="clock">
                <div>
                    <div>
                        <div style="display: flex; font-size: 16px; margin-bottom: 5px">
                            时钟
                            <img src="@/assets/arrowtwo.png" width="20" height="20" alt="" />
                        </div>
                    </div>
                    <div style="font-size: 12px; color: #969698" @click="restartCup">
                        <span>UTC+ 08:00 <br /></span>
                        <span>北京，上海</span>
                    </div>
                </div>

                <div class="clock-appcup"></div>
            </div>

            <div class="weather">
                <div>
                    <div>
                        <div style="display: flex; font-size: 16px; margin-bottom: 5px">
                            天气
                            <img src="@/assets/arrowtwo.png" width="20" height="20" alt="" />
                        </div>
                    </div>
                    <div style="font-size: 12px; color: #969698" @click="restartCup">
                        <span><van-icon name="location-o" />北京 <br /></span>
                    </div>
                </div>

                <div class="weather-appcup"></div>
            </div>
        </div>

        <!-- 空白间隔 -->
        <div class="spacer"></div>

        <!-- 应用配置 -->
        <div class="feature-item">
            <div
                style="
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    text-align: center;
                    background-color: #ffffff;
                    border-radius: 10px;
                    align-items: center;
                "
            >
                <div>
                    <div>
                        <div
                            style="
                                display: flex;
                                font-size: 16px;
                                margin-bottom: 5px;
                                text-align: center;
                            "
                        >
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
        <div class="spacer"></div>

        <!-- 底部按钮 -->
        <div class="bottom-actions">
            <div
                style="flex: 1; text-align: center; background-color: #ffffff; border-radius: 10px"
            >
                <div class="reboot-cup"></div>
                <div @click="restartCup">重启水杯</div>
            </div>

            <div
                style="flex: 1; text-align: center; background-color: #ffffff; border-radius: 10px"
            >
                <div class="closescreen-cup"></div>
                <div @click="closeScreen">关闭屏幕</div>
            </div>
            <div
                style="flex: 1; text-align: center; background-color: #ffffff; border-radius: 10px"
            >
                <div class="go-home"></div>
                <div @click="goHome">回到主页</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';

import { timezone } from './../utils/cityzone';

export default defineComponent({
    name: 'SystemSettings',
    setup() {
        const brightness = ref(40);
        console.log(timezone, 'timezone');
        const states = reactive({
            battery: 0,
            temperature: '水温:30℃',
            batteryStatus: false,
            address: '',
            clock: '',
        });

        const batteryClass = computed(() => {
            return 'battery-20';
            // CupDevice.setDevMessage({
            //     value: {
            //         method: 'getBatteryStatus',
            //         params: {},
            //     },
            // })
            //     .then((res: any) => {
            //         console.log(res.data.value, '单个');
            //         states.battery = res.data.value;
            //         if (states.battery < 20) {
            //             return 'battery-20';
            //         } else if (states.battery > 20 && states.battery < 40) {
            //             return 'battery-40';
            //         } else if (states.battery > 40) {
            //             return 'battery-60';
            //         }
            //         // 只有输出电量
            //         states.batteryStatus = res.data.value.batteryStatus;
            //     })
            //     .catch((err: any) => {
            //         console.log(err);
            //     });
        });

        const temperatureClass = computed(() => {
            // CupDevice.setDevMessage({
            //     value: {
            //         method: 'getTemperature',
            //         params: {},
            //     },
            // })
            //     .then((res) => {
            //         console.log(res.data.value, '单个');
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //     });

            if (states.battery < 0) {
                return 'temperature';
            } else if (states.battery >= 0 && states.battery < 99) {
                return 'temperature-0';
            } else if (states.battery >= 99) {
                return 'temperature-99';
            }
        });

        const onBrightnessChange = (value: number) => {
            console.log('当前亮度：', value);
        };

        const restartCup = () => {
            console.log('重启水杯');
        };

        const closeScreen = () => {
            console.log('关闭屏幕');
        };

        const goHome = () => {
            console.log('返回主页');
        };

        return {
            brightness,
            onBrightnessChange,
            restartCup,
            closeScreen,
            goHome,
            states,
            batteryClass,
            temperatureClass,
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
    margin-right: 20px;
    font-size: 12px;
}

.brightness-control {
    display: flex;
    /* align-items: center; */
    flex-direction: column;

    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 16px;
    background-color: #ffffff;
    height: 90px;
    border-radius: 12px;
}

.features-row {
    display: flex;
    margin-top: 16px;
    margin-left: 20px;
    margin-right: 20px;
    border-radius: 12px;
    justify-content: center;
}

.weather-clock {
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
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 16px;
    padding: 20px;
    background-color: #ffffff;
    font-size: 12px;
    border-radius: 12px;
    margin: 10px;
}

.feature-item {
    display: flex;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 16px;
    padding: 20px;
    background-color: #ffffff;
    font-size: 12px;
    border-radius: 12px;
}

.bottom-actions {
    display: flex;
    flex-direction: row;
    margin-top: 16px;
    margin-left: 20px;
    margin-right: 20px;
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

.spacer {
    height: 24px;
    /* 调整空白间隔的高度 */
}

.green-dot {
    width: 10px;
    height: 10px;
    background-color: #36c449;
    border-radius: 50%;
    display: inline-block;
}

.battery {
    width: 20px;
    height: 10px;
    background-image: url('@/assets/1.png');
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
    width: 20px;
    height: 10px;
    /* background-color: #36C449;
     */
    background-image: url('@/assets/battery40.png');
    border-radius: 50%;
    display: inline-block;
}

.battery-60 {
    margin-left: 20px;
    width: 20px;
    height: 10px;
    /* background-color: #36C449;
     */
    background-image: url('@/assets/battery60.png');
    border-radius: 50%;
    display: inline-block;
}

.battery-loading {
    margin-left: 20px;
    width: 20px;
    height: 10px;
    background-image: url('@/assets/batteryLoading.png');
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
