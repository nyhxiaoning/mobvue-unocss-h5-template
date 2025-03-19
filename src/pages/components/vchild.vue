<script setup lang="ts">
import { defineEmits, defineProps } from "vue"

/**
 * Props
 */
const props = defineProps<{
  title: string
  count: number
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
  <div class="child-component">
    <h3>{{ props.title }}</h3>
    <p>当前计数: {{ props.count }}</p>
    <button @click="toggleRecording">
      开始/停止录制
    </button>
    <button @click="cancelRecording">
      取消录制
    </button>
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
