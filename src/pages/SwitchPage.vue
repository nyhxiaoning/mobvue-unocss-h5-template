<template>
    <div class="system-settings">
        <van-cell-group inset>
            <van-cell center title="开启切换应用" inset>
                <template #right-icon>
                    <van-switch v-model="settings.enableApp" />
                </template>
            </van-cell>
        </van-cell-group>
        <van-cell-group title="水杯显示应用" inset>
            <!-- 功能开关 -->
            <van-cell title="时钟" center> </van-cell>
            <van-cell title="设备信息" center> </van-cell>
            <van-cell title="屏保" center>
                <template #right-icon>
                    <van-switch v-model="settings.HomeGIF" />
                </template>
            </van-cell>
            <van-cell title="天气" center>
                <template #right-icon>
                    <van-switch v-model="settings.HomeWeather" :disabled="!settings.enableApp" />
                </template>
            </van-cell>
            <van-cell title="落球游戏" center>
                <template #right-icon>
                    <van-switch
                        v-model="settings.HomeFreeFallIcon"
                        :disabled="!settings.enableApp"
                    />
                </template>
            </van-cell>
            <van-cell title="老虎机游戏" center>
                <template #right-icon>
                    <van-switch v-model="settings.homeTigerGame" :disabled="!settings.enableApp" />
                </template>
            </van-cell>
            <van-cell title="摇晃水杯动效" center>
                <template #right-icon>
                    <van-switch v-model="settings.HomeWaterShak" :disabled="!settings.enableApp" />
                </template>
            </van-cell>
            <van-cell title="黑幕帝国动效" center>
                <template #right-icon>
                    <van-switch v-model="settings.HomeCocos2" :disabled="!settings.enableApp" />
                </template>
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
export default {
    data() {
        return {
            settings: {
                enableApp: true,
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
        };
    },
    created() {
        console.log('mounted---router');
        // 初始化时获取当前系统应用显示状态
        CupDevice.setDevMessage({
            value: {
                method: 'getHomeAppsVisable',
                params: {},
            },
        })
            .then((res) => {
                if (res && res.data) {
                    // 更新settings中的状态
                    this.settings.enableApp = res.data.enableApp || false;
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
            });
    },
    watch: {
        'settings.enableApp'(newVal) {
            CupDevice.setDevMessage({
                value: {
                    method: 'setHomeAppsVisable',
                    params: {
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
                    method: 'setHomeAppsVisable',
                    params: {
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
                    method: 'setHomeAppsVisable',
                    params: {
                        // 默认两项
                        HomeInfo: true,
                        HomeClock: true,
                        // 可能废弃
                        HomeGIF: true,
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
                    method: 'setHomeAppsVisable',
                    params: {
                        // 默认两项
                        HomeInfo: true,
                        HomeClock: true,
                        // 可能废弃
                        HomeGIF: true,
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
                    method: 'setHomeAppsVisable',
                    params: {
                        // 默认两项
                        HomeInfo: true,
                        HomeClock: true,
                        // 可能废弃
                        HomeGIF: true,
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
                    method: 'setHomeAppsVisable',
                    params: {
                        // 默认两项
                        HomeInfo: true,
                        HomeClock: true,
                        // 可能废弃
                        HomeGIF: true,
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
                    method: 'setHomeAppsVisable',
                    params: {
                        // 默认两项
                        HomeInfo: true,
                        HomeClock: true,
                        // 可能废弃
                        HomeGIF: true,
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
