<script setup lang="ts">
/**
 * Components
 */
import Lottie from "@/pages/components/lottie.vue"

/**
 * APIs
 */

import { defineEmits, reactive } from "vue"

/**
 * Resources
 */

/**
 * Types
 */
interface State {}

/**
 * ts默认setup语法题
 */
defineProps({
  msg: String,
  num: Number,
  isRecording: Boolean,
  showVoiceModal: Boolean
})

/**
 * Hooks
 */
const emit = defineEmits(["cancelRecording", "toggleRecording"])

/**
 * Constants
 */

/**
 * Params
 */

/**
 * Props
 */

/**
 * States
 */
const state: State = reactive({})

/**
 * Paginations
 */

/**
 * Payloads
 */

/**
 * Requests
 */

/**
 * Events
 */
function cancelRecording() {
  emit("cancelRecording")
}

function toggleRecording() {
  emit("toggleRecording")
}
/**
 * ChildrenProps
 */

/**
 * Effects
 */
</script>

<template>
  <!-- 录音弹窗 -->
  <div v-if="showVoiceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div />
    <div class="bg-blue-3 rounded-2xl w-4/5 px-6 py-8">
      <div class="flex flex-col items-center">
        <!-- 录音动画 -->
        <Lottie />
        <!-- <div class="relative w-32 h-32 mb-6">
          <div class="absolute inset-0 bg-blue-50 rounded-full" />
          <div :class="{ 'animate-ripple': isRecording }" class="absolute inset-2 bg-blue-100 rounded-full" />
          <div :class="{ 'animate-ripple2': isRecording }" class="absolute inset-4 bg-blue-200 rounded-full" />
          <div class="absolute inset-0 flex items-center justify-center">
            <i class="fa-solid fa-microphone text-4xl" :class="isRecording ? 'text-blue-500' : 'text-gray-400'" />
          </div>
        </div> -->

        <!-- 录音状态文字 -->
        <p class="text-gray-600">
          {{ isRecording ? '正在录音...' : '准备录音' }}
        </p>

        <!-- 操作按钮 -->
        <div class="flex gap-4 w-full">
          <button
            class="flex-1 py-3 px-4 rounded-lg border border-gray-200 text-gray-600"
            @click="cancelRecording"
          >
            取消
          </button>
          <button
            class="flex-1 py-3 px-4 rounded-lg bg-blue-500 text-white"
            @click="toggleRecording"
          >
            {{ isRecording ? '完成' : '开始录音' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-index {
  /* ... */
}
</style>
