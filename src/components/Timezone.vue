<template>
    <div class="timezone-picker">
        <!-- 显示已选时区 -->
        <van-cell :title="language.timezone" :value="selectedTimezone.label" is-link @click="showPopup = true" />

        <!-- 弹窗选择器 -->
        <van-popup v-model:show="showPopup" position="bottom"
            style="padding: 10px; border-top-left-radius: 12px; border-top-right-radius: 12px">
            <div class="popup-header">
                <div type="default" plain @click="cancel">{{ language.cancel }}</div>
                <span class="popup-title">{{ language.timezone }}</span>
                <div type="primary" plain @click="confirm">{{ language.confirm }}</div>
            </div>
            <div class="popup-content">
                <van-radio-group v-model="selectedTimezone.value">
                    <van-cell-group>
                        <!-- 动态渲染每个时区选项 -->
                        <van-cell v-for="timezone in timezones" :key="timezone.value" clickable
                            @click="selectTimezone(timezone.value)">
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
import { ref, onMounted, reactive } from 'vue';
import { showToast } from 'vant';
import { useUserStore } from './../store/index';

export default {
    setup() {
        const store = useUserStore();
        const showPopup = ref(false);
        const language = reactive({
            timezone: JeeWeb.Language === 'zh-CN' ? '时区' : 'Timezone',
            cancel: JeeWeb.Language === 'zh-CN' ? '取消' : 'Cancel',
            confirm: JeeWeb.Language === 'zh-CN' ? '确定' : 'Confirm',
            confirmError: JeeWeb.Language === 'zh-CN'
                ? '时区设置失败，请重试！'
                : 'Timezone setting failed, please try again!',
            cancelMessage: JeeWeb.Language === 'zh-CN' ? '取消选择' : 'Selection cancelled',
            notFoundMessage: JeeWeb.Language === 'zh-CN' ? '未找到时区' : 'Timezone not found',
        });
        const selectedTimezone = ref({
            name: store.$state.timezoneLabel || 'UTC+08:00',
            label: store.$state.timezoneLabel
                ? `（${store.$state.timezoneLabel}）${store.$state.timezoneAddress}`
                : '（UTC+08:00）北京',
            // value: '(UTC+08:00) Beijing',
            value: store.$state.timezone || 'Asia/Shanghai',
        });
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

        const cancel = () => {
            showPopup.value = false;
            // 这里使用没有更新的回显地址：
            selectedTimezone.value.value = store.$state.timezoneValue;
            selectedTimezone.value.label = `（${store.$state.timezoneLabel}）${store.$state.timezoneAddress}`
            showToast(language.cancelMessage);
        };

        const confirm = () => {
            // const selected = timezones.value.find((zone) => zone.value === selectedTimezone.value);

            for (let i = 0; i < timezones.value.length; i++) {
                if (timezones.value[i].value === selectedTimezone.value.value) {
                    selectedTimezone.value.label = timezones.value[i].label;

                    // alert(JSON.stringify(timezones.value[i].label.split('）')[1]));
                }
            }

            // alert(JSON.stringify(selectedTimezone.value.label))
            if (selectedTimezone.value.label) {
                    CupDevice.setDevMessage({
                        value: {
                            method: 'setLoaclTimeZone',
                            params: {
                                value: selectedTimezone.value.value,
                            },
                        },
                    })
                        .then((res) => {
                            // 如果设置成功后，这里使用最新的页面的数据，否则使用store之前的存储数据
                            console.log(res, 'setLoaclTimeZone---value')
                            // showToast(language.confirm);
                            // 下发成功，同步store地址数据
                            store.$state.timezoneLabel = timezones.value[i].name;
                            store.$state.timezoneAddress = timezones.value[i].label.split('）')[1];
                            store.$state.timezoneValue = timezones.value[i].value;
                            console.log(res, '单个getLoaclTimeZone');
                            // store.selectedTimezone(selectedTimezone.value);
                            for (let i = 0; i < timezones.value.length; i++) {
                                if (timezones.value[i].value === res.data) {
                                    selectedTimezone.value.label = timezones.value[i].label;
                                }
                            }
                        })
                        .catch((err) => {
                            console.log(err,'selectedTimezone-error');
                            showToast(language.confirmError);
                            selectedTimezone.value.value = store.$state.timezoneValue;
                            selectedTimezone.value.label = `（${store.$state.timezoneLabel}）${store.$state.timezoneAddress}`
                        });
            } else {
                showToast(`${language.notFoundMessage}: ${labeled}`);
            }
            showPopup.value = false;
        };

        const selectTimezone = (value) => {
            selectedTimezone.value.value = value;
        };

        onMounted(() => {
            console.log('onMounted');
            CupDevice &&
                CupDevice.setDevMessage({
                    value: {
                        method: 'getLoaclTimeZone',
                        params: {
                            // 默认两项
                        },
                    },
                })
                    .then((res) => {
                        console.log(res, '单个getLoaclTimeZone');
                        if (res.data && res.data) {
                            selectedTimezone.value.value = res.data;
                            for (let i = 0; i < timezones.value.length; i++) {
                                if (timezones.value[i].value === res.data) {
                                    selectedTimezone.value.label = timezones.value[i].label;

                                }
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            console.log(timezones.value.value);
        });

        return {
            showPopup,
            selectedTimezone,
            timezones,
            cancel,
            confirm,
            language,
            selectTimezone,
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
    max-height: 400px;
    /* 设置最大高度 */
    overflow-y: auto;
    padding: 0 16px;
}

/* 调整滚动条样式（可选） */
.popup-content::-webkit-scrollbar {
    width: 6px;
    /* 滚动条宽度 */
}

.popup-content::-webkit-scrollbar-thumb {
    background-color: #c0c0c0;
    /* 滚动条滑块颜色 */
    border-radius: 3px;
    /* 滑块圆角 */
}

.popup-content::-webkit-scrollbar-track {
    background-color: #f5f5f5;
    /* 滚动条轨道颜色 */
}

/* Add these styles to improve click feedback */
:deep(.van-cell) {
    cursor: pointer;
}

:deep(.van-cell:active) {
    background-color: #f2f3f5;
}
</style>
