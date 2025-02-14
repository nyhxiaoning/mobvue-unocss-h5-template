<template>
    <div class="system-settings">
        <van-cell-group inset>
            <van-cell center :title="language.enableSwitch" inset>
                <template #right-icon>
                    <van-switch v-model="settings.isSwipe" />
                </template>
            </van-cell>
        </van-cell-group>
        <van-cell-group :title="language.displayApps" inset>
            <van-cell :title="language.clock" center> </van-cell>
            <van-cell :title="language.deviceInfo" center> </van-cell>
            <van-cell :title="language.screensaver" center>
                <template #right-icon>
                    <van-switch v-model="settings.HomeGIF" />
                </template>
            </van-cell>
            <van-cell :title="language.weather" center>
                <template #right-icon>
                    <van-switch v-model="settings.HomeWeather" :disabled="!settings.isSwipe" />
                </template>
            </van-cell>
            <van-cell :title="language.ballGame" center>
                <template #right-icon>
                    <van-switch
                        v-model="settings.HomeFreeFallIcon"
                        :disabled="!settings.isSwipe"
                    />
                </template>
            </van-cell>
            <van-cell :title="language.slotGame" center>
                <template #right-icon>
                    <van-switch v-model="settings.homeTigerGame" :disabled="!settings.isSwipe" />
                </template>
            </van-cell>
            <van-cell :title="language.shakeEffect" center>
                <template #right-icon>
                    <van-switch v-model="settings.HomeWaterShak" :disabled="!settings.isSwipe" />
                </template>
            </van-cell>
            <van-cell :title="language.darkEmpire" center>
                <template #right-icon>
                    <van-switch v-model="settings.HomeCocos2" :disabled="!settings.isSwipe" />
                </template>
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
import { showToast } from 'vant';
export default {
    data() {
        return {
            settings: {
                isSwipe: true,
                // 不要变：HomeClock和HomeInfo
                HomeClock: true,
                HomeInfo: true,

                HomeGIF: true,
                HomeWeather: true,
                HomeFreeFallIcon: true,
                homeTigerGame: true,
                HomeWaterShak: true,
                HomeCocos2: true,
            },
            language: {
                enableSwitch: JeeWeb.Language === 'zh-CN' ? '开启切换应用' : 'Enable App Switching',
                displayApps: JeeWeb.Language === 'zh-CN' ? '水杯显示应用' : 'Cup Display Apps',
                clock: JeeWeb.Language === 'zh-CN' ? '时钟' : 'Clock',
                deviceInfo: JeeWeb.Language === 'zh-CN' ? '设备信息' : 'Device Info',
                screensaver: JeeWeb.Language === 'zh-CN' ? '屏保' : 'Screensaver',
                weather: JeeWeb.Language === 'zh-CN' ? '天气' : 'Weather',
                ballGame: JeeWeb.Language === 'zh-CN' ? '落球游戏' : 'Ball Game',
                slotGame: JeeWeb.Language === 'zh-CN' ? '老虎机游戏' : 'Slot Machine',
                shakeEffect: JeeWeb.Language === 'zh-CN' ? '摇晃水杯动效' : 'Cup Shake Effect',
                darkEmpire: JeeWeb.Language === 'zh-CN' ? '黑幕帝国动效' : 'Dark Empire Effect'
            }
        };
    },
    created() {
        console.log('mounted---router');
        // 初始化时获取当前系统应用显示状态
        CupDevice.setDevMessage({
            value: {
                // TODO:待办，这里接口暂时不能调用：嵌入式未开发
                method: 'getHomeAppsParams',
                params: {},
            },
        })
            .then((res) => {
                if (res && res.data) {
                    // 更新settings中的状态： isSwipe
                    this.settings.isSwipe = res.data.isSwipe || false;
                    this.settings.HomeGIF = res.data.HomeGIF || false;
                    this.settings.HomeWeather = res.data.HomeWeather || false;
                    this.settings.HomeFreeFallIcon = res.data.HomeFreeFallIcon || false;
                    this.settings.homeTigerGame = res.data.homeTigerGame || false;
                    this.settings.HomeWaterShak = res.data.HomeWaterShak || false;
                    this.settings.HomeCocos2 = res.data.HomeCocos2 || false;
                }
            })
            .catch((err) => {
                console.log('获取应用显示状态失败:', err);
                this.showErrorToast();
            });
    },
    methods: {
        showErrorToast() {
            showToast(JeeWeb.Language === 'zh-CN' ?
                '获取应用显示状态失败' :
                'Failed to get app display status'
            );
        }
    },
    watch: {
        'settings.isSwipe'(newVal) {
            CupDevice.setDevMessage({
                value: {
                    method: 'setHomeAppsParams',
                    params: {
                        isSwipe: newVal,
                        // 默认两项
                        HomeInfo: true,
                        HomeClock: true,
                        // 可能废弃
                        HomeGIF: true,
                        HomeFreeFallIcon: newVal,
                        HomeWeather: newVal,
                        homeTigerGame: newVal,
                        HomeCocos2: newVal,
                        HomeWaterShak: newVal,
                    },
                },
            })
                .then((res) => {
                    console.log(res, '单个');
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        'settings.HomeGIF'(newVal) {
            // alert(`硬件本次不支持，下版本支持: ${newVal}`);
            CupDevice.setDevMessage({
                value: {
                    method: 'setHomeAppsParams',
                    params: {
                        isSwipe: this.settings.isSwipe,
                        // 默认两项
                        HomeInfo: true,
                        HomeClock: true,
                        // 可能废弃
                        HomeGIF: newVal,
                        HomeFreeFallIcon: this.settings.HomeFreeFallIcon,
                        HomeWeather: this.settings.HomeWeather,
                        homeTigerGame: this.settings.homeTigerGame,
                        HomeCocos2: this.settings.HomeCocos2,
                        HomeWaterShak: this.settings.HomeWaterShak,
                    },
                },
            })
                .then((res) => {
                    console.log(res, '单个');
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        'settings.HomeWeather'(newVal) {
            CupDevice.setDevMessage({
                value: {
                    method: 'setHomeAppsParams',
                    params: {
                         isSwipe: this.settings.isSwipe,
                        // 默认两项
                        HomeInfo: true,
                        HomeClock: true,
                        // 可能废弃
                        HomeGIF: this.settings.HomeGIF,
                        HomeFreeFallIcon: this.settings.HomeFreeFallIcon,
                        HomeWeather: newVal,
                        homeTigerGame: this.settings.homeTigerGame,
                        HomeCocos2: this.settings.HomeCocos2,
                        HomeWaterShak: this.settings.HomeWaterShak,
                    },
                },
            })
                .then((res) => {
                    console.log(res, '单个');
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        'settings.HomeFreeFallIcon'(newVal) {
            CupDevice.setDevMessage({
                value: {
                    method: 'setHomeAppsParams',
                    params: {
                         isSwipe: this.settings.isSwipe,
                        // 默认两项
                        HomeInfo: true,
                        HomeClock: true,
                        // 可能废弃
                        HomeGIF: this.settings.HomeGIF,
                        HomeFreeFallIcon: newVal,
                        HomeWeather: this.settings.HomeWeather,
                        homeTigerGame: this.settings.homeTigerGame,
                        HomeCocos2: this.settings.HomeCocos2,
                        HomeWaterShak: this.settings.HomeWaterShak,
                    },
                },
            })
                .then((res) => {
                    console.log(res, '单个');
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        'settings.homeTigerGame'(newVal) {
            // alert(`老虎机游戏: ${newVal}`);
            CupDevice.setDevMessage({
                value: {

                    method: 'setHomeAppsParams',
                    params: {
                         isSwipe: this.settings.isSwipe,
                        // 默认两项
                        HomeInfo: true,
                        HomeClock: true,
                        // 可能废弃
                        HomeGIF: this.settings.HomeGIF,
                        HomeFreeFallIcon: this.settings.HomeFreeFallIcon,
                        HomeWeather: this.settings.HomeWeather,
                        homeTigerGame: newVal,
                        HomeCocos2: this.settings.HomeCocos2,
                        HomeWaterShak: this.settings.HomeWaterShak,
                    },
                },
            })
                .then((res) => {
                    console.log(res, '单个');
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        'settings.HomeWaterShak'(newVal) {
            // alert(`摇晃水杯动效: ${newVal}`);
            CupDevice.setDevMessage({
                value: {
                    method: 'setHomeAppsParams',
                    params: {
                         isSwipe: this.settings.isSwipe,
                        // 默认两项
                        HomeInfo: true,
                        HomeClock: true,
                        // 可能废弃
                        HomeGIF: this.settings.HomeGIF,
                        HomeFreeFallIcon: this.settings.HomeFreeFallIcon,
                        HomeWeather: this.settings.HomeWeather,
                        homeTigerGame: this.settings.homeTigerGame,
                        HomeCocos2: this.settings.HomeCocos2,
                        HomeWaterShak: newVal,
                    },
                },
            })
                .then((res) => {
                    console.log(res, '单个');
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        'settings.HomeCocos2'(newVal) {
            // alert(`黑幕帝国动效: ${newVal}`);
            CupDevice.setDevMessage({
                value: {
                    method: 'setHomeAppsParams',
                    params: {
                         isSwipe: this.settings.isSwipe,
                        // 默认两项
                        HomeInfo: true,
                        HomeClock: true,
                        // 可能废弃
                        HomeGIF: this.settings.HomeGIF,
                        HomeFreeFallIcon: this.settings.HomeFreeFallIcon,
                        HomeWeather: this.settings.HomeWeather,
                        homeTigerGame: this.settings.homeTigerGame,
                        HomeCocos2: newVal,
                        HomeWaterShak: this.settings.HomeWaterShak,
                    },
                },
            })
                .then((res) => {
                    console.log(res, '单个');
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>

<style scoped>
/* 根据需求添加样式 */
.system-settings {
    padding: 16px;
    background: #f7f8fa;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180.08deg, #c5e6ff -1.16%, #ecf6ff 14.34%, #f3f4f7 50%);
}
</style>
