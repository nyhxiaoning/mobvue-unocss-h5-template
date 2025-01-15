<template>
    <div class="system-settings">
        <!-- 顶部状态栏 -->
        <div class="status-bar">
            <van-row justify="space-between" align="center">
                  <van-row type="flex" justify="start" align="center" style="width: 58px; height: 24px;;font-size: 12px;">
                    <!-- 第一个子 div -->
                    <van-col :span="12">
                    <div :class="batteryClass" style="width: 24px; height: 24px;"></div>
                    </van-col>
                    <!-- 第二个子 div -->
                    <van-col :span="12">
                    <div
                        style="
                    line-height: 24px;
                    height: 26px;
                    text-align: center;
                    margin-right: 24px;
                    "
                    >
                        {{ states.battery }}
                    </div>
                    </van-col>
                </van-row>

                <div >
                      <div class="green-dot"></div>
                    <span class="status-text">&nbsp;在线</span>

                </div>
                      <van-row type="flex" justify="start" align="center" style="width: 58px; height: 24px;background-color: #FFFFFF;border-radius: 6px;padding-left: 5px;font-size: 12px;">
                        <!-- 第一个子 div -->
                        <van-col :span="12">
                        <div :class="batteryClass" style="width: 24px; height: 24px;"></div>
                        </van-col>
                        <!-- 第二个子 div -->
                        <van-col :span="12">
                        <div
                            style="
                                line-height: 24px;
                                height: 26px;
                                text-align: center;
                                margin-right: 24px;
                            "
                        >
                            {{ states.battery }}
                        </div>
                        </van-col>
                    </van-row>
            </van-row>
        </div>

        <!-- 亮度调节 -->
        <div class="brightness-control">
            <van-row justify="space-between" align="center">
                <span>亮度</span>
                <span>40%</span>
            </van-row>
            <van-slider v-model="brightness" @change="onBrightnessChange" step="10">
                <template #button>
                    <div class="custom-button">{{ brightness }}</div>
                </template>
            </van-slider>
        </div>

        <!-- 空白间隔 -->
        <div class="spacer"></div>

        <!-- 时钟和天气 -->
        <div class="features-row">
            <van-row justify="space-between">
                <van-col span="11">
                    <van-cell center title="时钟" icon="clock-o" value="UTC+08:00\n北京，上海" is-link />
                </van-col>
                <van-col span="11">
                    <van-cell center title="天气" icon="cloud-o" value="北京" is-link />
                </van-col>
            </van-row>
        </div>

        <!-- 空白间隔 -->
        <div class="spacer"></div>

        <!-- 应用配置 -->
        <div class="feature-item">
            <van-cell center title="应用配置" icon="apps-o" value="可设置应用是否在水杯中展示" is-link />
        </div>

        <!-- 空白间隔 -->
        <div class="spacer"></div>

        <!-- 底部按钮 -->
        <div class="bottom-actions">
            <van-row justify="space-around">
                <van-button icon="replay" @click="restartCup">重启水杯</van-button>
                <van-button icon="close" @click="closeScreen">关闭屏幕</van-button>
                <van-button icon="arrow-left" @click="goHome">回到主页</van-button>
            </van-row>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive,computed } from 'vue';

export default defineComponent({
    name: "SystemSettings",
    setup() {
        const brightness = ref(40);

        const states = reactive({
            battery:0,
            batteryStatus:false,
            address:'',
            clock:'',
        })

        const batteryClass = computed(() => {
            if (states.battery  < 20) {
                return 'battery-20';
            } else if (states.battery > 20 && states.battery < 40) {
                return 'battery-20';
            } else {
                return 'battery-20';
            }
        })

        const onBrightnessChange = (value: number) => {
            console.log("当前亮度：", value);
        };

        const restartCup = () => {
            console.log("重启水杯");
        };

        const closeScreen = () => {
            console.log("关闭屏幕");
        };

        const goHome = () => {
            console.log("返回主页");
        };

        return {
            brightness,
            onBrightnessChange,
            restartCup,
            closeScreen,
            goHome,
            states,
            batteryClass
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
    background: linear-gradient(180.08deg, #C5E6FF -1.16%, #ECF6FF 14.34%, #F3F4F7 50%);
}

.status-bar {
    margin-bottom: 16px;
}

.icon {
    margin-right: 4px;
}

.status-text {
    color: green;
    margin-right: 4px;
    font-size: 12px;
}

.brightness-control {
    margin-bottom: 16px;
    background-color: #FFFFFF;
    height: 90px;
    border-radius: 12px;

}

.features-row {
    margin-bottom: 16px;
    height: 90px;
    border-radius: 12px;
}

.feature-item {
    margin-bottom: 16px;
    height: 90px;
    border-radius: 12px;
}

.bottom-actions {
    margin-top: 16px;
        border-radius: 12px;
}

.spacer {
    height: 24px;
    /* 调整空白间隔的高度 */
}

.green-dot {
    width: 10px;
    height: 10px;
    background-color: #36C449;
    border-radius: 50%;
    display: inline-block;
}

.battery{
    width: 20px;
    height: 10px;
    background-image: url('@/assets/1.png');
    border-radius: 50%;
    display: inline-block;
}


.battery-20{
    width: 24px;
    height: 24px;
    /* background-image: url('@/assets/battery20.png'); */
                background: url('@/assets/battery20.png') center / contain no-repeat;

    border-radius: 50%;
    display: inline-block;
}


.battery-40{
        width: 20px;
    height: 10px;
    /* background-color: #36C449;
     */
     background-image: url('@/assets/battery40.png');
    border-radius: 50%;
    display: inline-block;
}


.battery-60{
        width: 20px;
    height: 10px;
    /* background-color: #36C449;
     */
     background-image: url('@/assets/battery60.png');
    border-radius: 50%;
    display: inline-block;
}


.battery-loading{
    width: 20px;
    height: 10px;
     background-image: url('@/assets/batteryLoading.png') ;
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
</style>
