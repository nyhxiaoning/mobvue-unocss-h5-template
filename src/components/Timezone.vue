<template>
    <div class="timezone-picker">
        <!-- 显示已选时区 -->
        <van-cell title="时区" :value="selectedTimezone.label" is-link @click="showPopup = true" />

        <!-- 弹窗选择器 -->
        <van-popup
            v-model:show="showPopup"
            position="bottom"
            style="padding: 10px; border-top-left-radius: 12px; border-top-right-radius: 12px"
        >
            <div class="popup-header">
                <div type="default" plain @click="cancel">取消</div>
                <span class="popup-title">时区</span>
                <div type="primary" plain @click="confirm">确定</div>
            </div>
            <div class="popup-content">
                <van-radio-group v-model="selectedTimezone.value">
                    <van-cell-group>
                        <!-- 动态渲染每个时区选项 -->
                        <van-cell v-for="timezone in timezones" :key="timezone.value" clickable>
                            <template #title>
                                {{ timezone.label }}
                            </template>

                            <template #right-icon>
                                <van-radio :name="timezone.value" />
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { ref } from 'vue';
import { showToast } from 'vant';

export default {
    setup() {
        const showPopup = ref(false);
        const selectedTimezone = ref({ value: 'UTC+08:00', label: '北京，上海' });
        const timezones = ref([
            {
                name: 'UTC-12:00',
                label: '（UTC-12:00）贝克岛',
                // value: '(UTC-12:00) Baker Island',
                value: 'Chile/EasterIsland',
            },
            {
                name: 'UTC-11:00',
                label: '（UTC-11:00）帕果帕果',
                // value: '(UTC-11:00) Pago Pago',
                value: 'Pacific/Pago_Pago',
            },
            {
                name: 'UTC-10:00',
                label: '（UTC-10:00）檀香山',
                // value: '(UTC-10:00) Honolulu',
                value: 'Pacific/Honolulu',
            },
            {
                name: 'UTC-9:00',
                label: '（UTC-9:00）安克雷奇',
                // value: '(UTC-9:00) Anchorage',
                value: 'America/Anchorage',
            },
            {
                name: 'UTC-8:00',
                label: '（UTC-8:00）洛杉矶',
                // value: '(UTC-8:00) Los Angeles',
                value: 'America/Los_Angeles',
            },
            {
                name: 'UTC-7:00',
                label: '（UTC-7:00）丹佛',
                // value: '(UTC-7:00) Denver',
                value: 'America/Denver',
            },
            {
                name: 'UTC-6:00',
                label: '（UTC-6:00）芝加哥',
                // value: '(UTC-6:00) Chicago',
                value: 'America/Chicago',
            },
            {
                name: 'UTC-5:00',
                label: '（UTC-5:00）纽约',
                // value: '(UTC-5:00) New York',
                value: 'America/New_York',
            },
            {
                name: 'UTC-4:00',
                label: '（UTC-4:00）圣地亚哥',
                // value: '(UTC-4:00) Santiago',
                value: 'America/Argentina/Cordoba',
            },
            {
                name: 'UTC-3:00',
                label: '（UTC-3:00）布宜诺斯艾利斯',
                // value: '(UTC-3:00) Buenos Aires',
                value: 'America/Argentina/Buenos_Aires',
            },
            {
                name: 'UTC-2:00',
                label: '（UTC-2:00）南乔治亚岛',
                // value: '(UTC-2:00) South Georgia Island',
                value: 'Atlantic/South_Georgia',
            },
            {
                name: 'UTC-1:00',
                label: '（UTC-1:00）亚速尔群岛',
                // value: '(UTC-1:00) Azores',
                value: 'Atlantic/Azores',
            },
            {
                name: 'UTC+00:00',
                label: '（UTC+00:00）伦敦',
                // value: '(UTC+00:00) London',
                value: 'Europe/London',
            },
            {
                name: 'UTC+01:00',
                label: '（UTC+01:00）巴黎',
                // value: '(UTC+01:00) Paris',
                value: 'Europe/Paris',
            },
            {
                name: 'UTC+02:00',
                label: '（UTC+02:00）开罗',
                // value: '(UTC+02:00) Cairo',
                value: 'Africa/Cairo',
            },
            {
                name: 'UTC+03:00',
                label: '（UTC+03:00）莫斯科',
                // value: '(UTC+03:00) Moscow',
                value: 'Europe/Moscow',
            },
            {
                name: 'UTC+04:00',
                label: '（UTC+04:00）迪拜',
                // value: '(UTC+04:00) Dubai',
                value: 'Asia/Dubai',
            },
            {
                name: 'UTC+05:00',
                label: '（UTC+05:00）卡拉奇',
                // value: '(UTC+05:00) Karachi',
                value: 'Asia/Karachi',
            },
            {
                name: 'UTC+06:00',
                label: '（UTC+06:00）达卡',
                // value: '(UTC+06:00) Dhaka',
                value: 'Asia/Dhaka',
            },
            {
                name: 'UTC+07:00',
                label: '（UTC+07:00）曼谷',
                // value: '(UTC+07:00) Bangkok',
                value: 'Asia/Bangkok',
            },
            {
                name: 'UTC+08:00',
                label: '（UTC+08:00）北京',
                // value: '(UTC+08:00) Beijing',
                value: 'Asia/Shanghai',
            },
            {
                name: 'UTC+09:00',
                label: '（UTC+09:00）东京',
                // value: '(UTC+09:00) Tokyo',
                value: 'Asia/Tokyo',
            },
            {
                name: 'UTC+10:00',
                label: '（UTC+10:00）悉尼',
                // value: '(UTC+10:00) Sydney',
                value: 'Australia/Sydney',
            },
            {
                name: 'UTC+11:00',
                label: '（UTC+11:00）所罗门群岛',
                // value: '(UTC+11:00) Solomon Islands',
                value: 'Pacific/Guadalcanal',
            },
            {
                name: 'UTC+12:00',
                label: '（UTC+12:00）奥克兰',
                // value: '(UTC+12:00) Auckland',
                timezone: 'Pacific/Auckland',
            },
        ]);

        const cancel = () => {
            showPopup.value = false;
            showToast('取消选择');
        };

        const confirm = () => {
            const selected = timezones.value.find((zone) => zone.value === selectedTimezone.value);
            if (selected) {
                selectedTimezone.value = selected;
                showToast(`已选择时区: ${selected.label}`);
            }
            showPopup.value = false;
        };

        return {
            showPopup,
            selectedTimezone,
            timezones,
            cancel,
            confirm,
        };
    },
};
</script>

<style scoped>
.timezone-picker {
    padding: 16px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180.08deg, #c5e6ff -1.16%, #ecf6ff 14.34%, #f3f4f7 50%);
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #e8e8e8;
}

.popup-title {
    font-size: 16px;
    font-weight: bold;
}

.popup-content {
    max-height: 400px; /* 设置最大高度 */
    overflow-y: auto;
    padding: 0 16px;
}

/* 调整滚动条样式（可选） */
.popup-content::-webkit-scrollbar {
    width: 6px; /* 滚动条宽度 */
}

.popup-content::-webkit-scrollbar-thumb {
    background-color: #c0c0c0; /* 滚动条滑块颜色 */
    border-radius: 3px; /* 滑块圆角 */
}

.popup-content::-webkit-scrollbar-track {
    background-color: #f5f5f5; /* 滚动条轨道颜色 */
}
</style>
