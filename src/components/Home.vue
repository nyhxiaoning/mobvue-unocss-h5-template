<template>
    <div class="system-settings">
        <!-- 顶部状态栏 -->
        <div class="status-bar">
            <van-row justify="space-between" align="center">
                <div>
                    <van-icon name="battery-o" class="icon" />
                    <span>59%</span>
                </div>
                <div>
                    <span class="status-text">在线</span>
                    <van-dot />
                </div>
                <div>
                    <van-icon name="fire-o" class="icon" />
                    <span>水温27℃</span>
                </div>
            </van-row>
        </div>

        <!-- 亮度调节 -->
        <div class="brightness-control">
            <van-row justify="space-between" align="center">
                <span>亮度</span>
                <span>40%</span>
            </van-row>
            <van-slider v-model="brightness" @change="onBrightnessChange" />
        </div>

        <!-- 功能项 -->
        <div class="features">
            <van-row gutter="20">
                <van-col span="8">
                    <van-cell
                        center
                        title="时钟"
                        icon="clock-o"
                        value="UTC+08:00\n北京，上海"
                        is-link
                    />
                </van-col>
                <van-col span="8">
                    <van-cell center title="天气" icon="cloud-o" value="北京" is-link />
                </van-col>
                <van-col span="8">
                    <van-cell
                        center
                        title="应用配置"
                        icon="apps-o"
                        value="可设置是否在水杯中展示"
                        is-link
                    />
                </van-col>
            </van-row>
        </div>

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
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'SystemSettings',
    setup() {
        const brightness = ref(40);

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
        };
    },
});
</script>

<style scoped>
.system-settings {
    padding: 16px;
    background: #f7f8fa;
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
}

.brightness-control {
    margin-bottom: 16px;
}

.features {
    margin-bottom: 16px;
}

.bottom-actions {
    margin-top: 16px;
}
</style>
