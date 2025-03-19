<script setup lang="ts">
import { defineEmits, defineProps } from "vue"

/**
 * Props
 */
const props = defineProps<{
  title: string
  count: number
  isRecording: boolean
  audioWave: number[]
  recordingTime: string
  showVoiceModal: boolean
  confirmRecording: () => void
}>()

/**
 * Emits
 */
const emit = defineEmits<[
  "cancelRecording",
  "toggleRecording"
]>()

/**
 * Functions
 */
function cancelRecording() {
  emit("cancelRecording")
}

function toggleRecording() {
  emit("toggleRecording")
}
</script>

<template>
  <div v-if="showVoiceModal" class="bg-white fixed bottom-80 left-0 right-0 p-4  border-t">
    <div class="relative flex items-center  rounded-lg px-4 py-2 mb-4">
      <button class="bg-white border-none flex items-center justify-center" @click="toggleRecording">
        <van-icon v-if="isRecording" name="pause-circle-o" size="40" color="#3b82f6" />
      </button>
      <div class="flex-1 mx-2">
        <div v-if="isRecording" class="h-6 flex items-center justify-center">
          <div
            v-for="(bar, index) in audioWave" :key="index"
            :style="{ height: `${bar}px`, animationDelay: `${index * 0.05}s` }"
            class="w-1 mx-0.5 bg-blue-500 rounded-full audio-wave-animation"
          />
        </div>
      </div>
      <button
        v-if="isRecording" class="bg-white border-none items-center justify-center"
        @click="confirmRecording"
      >
        <van-icon name="passed" size="40" color="#3b82f6" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="less">
.child-component {
  text-align: center;
  button {
    margin: 5px;
  }
}
</style>
