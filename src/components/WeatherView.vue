<template>
  <div class="weather-view">
    <van-nav-bar
      title="天气"
      left-arrow
      @click-left="goBack"
      class="custom-nav"
    />

    <div class="main-content">
      <div class="city-card" @click="goToCity">
        <div class="city-row">
          <span class="city-label">城市</span>
          <div class="city-value">
            <span class="city-name">{{ currentCity }}</span>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-button">
      <van-button block type="primary" @click="confirmCity">确认</van-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const currentCity = computed(() => store?.state?.currentCity || '')

const goToCity = () => {
  router.push('/city')
}

const goBack = () => {
  router.back()
}

const confirmCity = () => {
  // TODO: 实现确认逻辑
}
</script>

<style scoped>
.weather-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180.08deg, #C5E6FF -1.16%, #ECF6FF 14.34%, #F3F4F7 50%);
}

.custom-nav {
  background: transparent;
}

:deep(.van-nav-bar) {
  background-color: transparent;
}

:deep(.van-nav-bar .van-icon) {
  color: #2E2F33;
}

:deep(.van-nav-bar__title) {
  color: #2E2F33;
  font-weight: 500;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.city-card {
  background: #FFFFFF;
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
  color: #2E2F33;
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
  color: #2E2F33;
}

.city-value .van-icon {
  color: #909295;
  font-size: 14px;
}

.bottom-button {
  padding: 16px;
  display: flex;
  justify-content: center;
}

:deep(.van-button--primary) {
  background-color: #0094FF;
  border-color: #0094FF;
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
  color: #2E2F33 !important;
}
</style>
