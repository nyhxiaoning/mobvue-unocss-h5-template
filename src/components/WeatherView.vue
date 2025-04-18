<template>
    <div class="weather-view">
        <van-loading v-if="language.globalWeatherLoading" class="global-loading" type="spinner" color="#fff"
            text="..."></van-loading>

        <div class="main-content">
            <div class="city-card" @click="goToCity">
                <div class="city-row">
                    <span class="city-label">{{ language.city }}</span>
                    <div class="city-value">
                        <span class="city-name">{{ currentCity }}</span>
                        <van-icon name="arrow" />
                    </div>
                </div>
            </div>
        </div>

        <div class="bottom-button">
            <van-button block type="primary" @click="confirmCity">{{ language.confirm }}</van-button>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue';
import { useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useUserStore } from './../store/index';
import { showToast } from 'vant';

const router = useRouter();
const store = useUserStore();

const language = reactive({
    city: JeeWeb.Language === 'zh-CN' ? '城市' : 'City',
    confirm: JeeWeb.Language === 'zh-CN' ? '确认' : 'Confirm',
    setCityError: JeeWeb.Language === 'zh-CN' ? '设置城市失败' : 'Failed to set city',
    globalWeatherLoading: false
});

// store.$state.weathername = JeeWeb.Language === 'zh-CN' ? city.name : city.nameEn;
// store.$state.weathervalue = city.value;



//

/**
 * current City
 */
const currentCity = computed(() => {
    if (store.$state.fromHome && store.$state.weathervalue) {
        return store.$state.weathername;
    } else {
        return sessionStorage.getItem('weathername') || ''
    }
});
console.log(store?.$state, '当前的下发')
const goToCity = () => {
    router.push('city');
};

const goBack = () => {

    router.back();
};

const confirmCity = () => {
    console.log(sessionStorage.getItem('weathervalue'))
    console.log(sessionStorage.getItem("weathername"))
    console.log('confirmCity')
    language.globalWeatherLoading = true

    // 1 老款设备、2 新款设备
    const v = CupDevice?.to?.versionType || 2;

    const p1 = {
        method: 'setCity',
        params: {
            value: sessionStorage.getItem('weathervalue')
        },
    }

    const p2 = {
        method: 'talSetCity',
        params: {
            city: sessionStorage.getItem('weathervalue')
        },
    }

    CupDevice &&
        CupDevice.setDevMessage({
            value: v === 1 ? p1 : p2,
        })
            .then((res) => {
                console.log(res, 'setCity');
                // 新旧数据保存一致，
                store.$state.weathername = sessionStorage.getItem("weathername");
                store.$state.weathervalue = sessionStorage.getItem('weathervalue');
                sessionStorage.setItem('weatheroldname', sessionStorage.getItem("weathername"));
                sessionStorage.setItem('weatheroldvalue', sessionStorage.getItem('weathervalue'));
                console.log(res, 'city.value');
                language.globalWeatherLoading = false
                router.push('/');
            })
            .catch((err) => {
                console.log(err);
                // 如果失败了，则不更新，使用老的数据
                // store.$state.weathername = '';
                sessionStorage.setItem('weathername',sessionStorage.getItem("weatheroldname"))
                sessionStorage.setItem('weathervalue', sessionStorage.getItem("weatheroldvalue"))
                // store.$state.weathervalue = '';
                setTimeout(() => {
                    language.globalWeatherLoading = false
                    showToast({
                        message: language.setCityError,
                        duration: 1000,
                    });
                }, 1000)

            });
};
</script>

<style scoped>
.weather-view {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180.08deg, #c5e6ff -1.16%, #ecf6ff 14.34%, #f3f4f7 50%);
}

.custom-nav {
    background: transparent;
}

:deep(.van-nav-bar) {
    background-color: transparent;
}

:deep(.van-nav-bar .van-icon) {
    color: #2e2f33;
}

:deep(.van-nav-bar__title) {
    color: #2e2f33;
    font-weight: 500;
}

.main-content {
    flex: 1;
    padding: 20px;
}

.city-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    cursor: pointer;
}

.city-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.city-label {
    font-family: 'PingFang SC', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 19.6px;
    color: #2e2f33;
    text-align: left;
}

.city-value {
    display: flex;
    align-items: center;
    gap: 4px;
}

.city-name {
    font-family: 'PingFang SC', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 19.6px;
    text-align: right;
    color: #2e2f33;
}

.city-value .van-icon {
    color: #909295;
    font-size: 14px;
}

.bottom-button {
    padding: 16px;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
}

:deep(.van-button--primary) {
    background-color: #0094ff;
    border-color: #0094ff;
    width: 315px !important;
    height: 48px !important;
    font-size: 16px;
    font-weight: 500;
    border-radius: 24px;
}

:deep(.van-button--primary.van-button--disabled) {
    opacity: 0.6;
}

:deep(.van-nav-bar__arrow) {
    color: #2e2f33 !important;
}

.global-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}
</style>
