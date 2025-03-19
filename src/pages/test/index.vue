<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<script lang="ts" setup>
import { computed, ref } from "vue"

const activeTab = ref("text")
const prompt = ref("老鹰在天上飞，")
const isRecording = ref(false)
const recordingTime = ref("0:02")
const promptLength = computed(() => prompt.value.length)
const audioWave = ref(Array.from({ length: 20 }, () =>
  Math.floor(Math.random() * 16 + 8)))
function toggleRecording() {
  isRecording.value = !isRecording.value
}
function confirmRecording() {
  isRecording.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="fixed top-0 left-0 right-0 bg-white z-50 border-b">
      <div class="flex items-center justify-between px-4 h-12">
        <h1 class="text-lg font-medium">
          AI 像素图
        </h1>
        <div class="flex items-center space-x-3">
          <button class="text-gray-600">
            <i class="fas fa-ellipsis-h" />
          </button>
          <button class="text-gray-600">
            <i class="fas fa-question-circle" />
          </button>
        </div>
      </div>
    </div>
    <div class="pt-14 px-4">
      <div class="flex gap-4 mb-6">
        <button
          :class="{ 'bg-blue-500 text-white': activeTab === 'text', 'bg-gray-100 text-gray-600': activeTab !== 'text' }"
          class="flex-1 h-10 !rounded-button flex items-center justify-center gap-2" @click="activeTab = 'text'"
        >
          <i class="fas fa-font" />
          <span>文字生图</span>
        </button>
        <button
          :class="{ 'bg-blue-500 text-white': activeTab === 'image', 'bg-gray-100 text-gray-600': activeTab !== 'image' }"
          class="flex-1 h-10 !rounded-button flex items-center justify-center gap-2" @click="activeTab = 'image'"
        >
          <i class="far fa-image" />
          <span>图片生图</span>
        </button>
      </div>
      <div class="mb-4">
        <div class="flex justify-between text-sm mb-2">
          <span>画面关键词</span>
          <span class="text-gray-400">{{ promptLength }}/100</span>
        </div>
        <textarea
          v-model="prompt"
          class="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入画面关键词描述..." maxlength="100"
        />
      </div>
      <div class="bg-white fixed bottom-80 left-0 right-0 p-4  border-t">
        <div class="relative flex items-center  rounded-lg px-4 py-2 mb-4">
          <button class="bg-white border-none flex items-center justify-center" @click="toggleRecording">
            <van-icon v-if="isRecording" name="pause-circle-o" size="40" color="#3b82f6" />
            <van-icon v-if="!isRecording " name="play-circle-o " size="40" color="#3b82f6" />
          </button>
          <div class="flex-1 mx-2">
            <div v-if="isRecording" class="h-6 flex items-center justify-center">
              <div
                v-for="(bar, index) in audioWave" :key="index"
                :style="{ height: `${bar}px`, animationDelay: `${index * 0.05}s` }"
                class="w-1 mx-0.5 bg-blue-500 rounded-full audio-wave-animation"
              />
            </div>
            <div v-else class="h-6 flex items-center">
              <div class="text-gray-400 text-sm">
                点击开始录音...
              </div>
            </div>
          </div>
          <!-- <span class="text-sm text-gray-400 w-12 text-right">{{ recordingTime }}</span> -->
          <button
            v-if="isRecording" class="bg-white border-none items-center justify-center"
            @click="confirmRecording"
          >
            <van-icon name="passed" size="40" color="#3b82f6" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.audio-wave-animation {
  animation: wave 1.2s infinite ease-in-out;
  transform-origin: center;
}

@keyframes wave {
  0% {
    transform: scaleY(0.3);
  }

  50% {
    transform: scaleY(1);
  }

  100% {
    transform: scaleY(0.3);
  }
}
</style>
