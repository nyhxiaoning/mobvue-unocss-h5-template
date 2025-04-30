<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

/**
 * Props
 */
const props = defineProps<{
  showSpeedPopup: boolean;  // 控制弹窗显示
  selectedSpeed: number;    // 当前选中的速度值
  speeds: number[];        // 速度选项列表
  language: {             // 语言包
    cancel: string;
    confirm: string;
    carouselSpeed: string;
    hours: string;
    minutes: string;
  };
}>();

/**
 * Emits
 */
const emit = defineEmits<[
  'update:showSpeedPopup',   // 更新弹窗显示状态
  'update:selectedSpeed',    // 更新选中的速度值
  'cancelSpeed',            // 取消选择
  'confirmSpeed'            // 确认选择
]>();

/**
 * Functions
 */
const selectSpeedFn = (speed: number) => {
  emit('update:selectedSpeed', speed);
};

const CancelSpeed = () => {
  emit('cancelSpeed');
};

const ConfirmSpeed = () => {
  emit('confirmSpeed');
};
</script>

<template>
  <van-popup
    class="content-popup"
    v-model:show="showSpeedPopup"
    position="bottom"
    :style="{
      borderTopLeftRadius: '15px',
      borderTopRightRadius: '15px',
      border: '0px solid #ffffff'
    }"
  >
    <div class="popup-header">
      <div
        class="text-base font-medium cursor-pointer"
        @click="CancelSpeed"
      >
        {{ language.cancel }}
      </div>
      <span class="popup-title">{{ language.carouselSpeed }}</span>
      <div
        class="text-base font-medium text-[#0094ff] cursor-pointer"
        @click="ConfirmSpeed"
      >
        {{ language.confirm }}
      </div>
    </div>
    <div class="popup-content">
      <van-radio-group v-model="selectedSpeed">
        <van-cell-group>
          <van-cell
            v-for="speed in speeds"
            :key="speed"
            @click="selectSpeedFn(speed)"
          >
            <template #title>
              {{ speed > 60
                ? `${speed / 60}${language.hours}`
                : `${speed} ${language.minutes}`
              }}
            </template>
            <template #right-icon>
              <van-radio :name="speed" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
  </van-popup>
</template>

<style scoped>
.content-popup {
  /* 弹窗样式 */
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.popup-title {
  font-size: 16px;
  font-weight: 500;
}

.popup-content {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
