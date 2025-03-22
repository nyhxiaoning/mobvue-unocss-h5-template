<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<script lang="ts" setup>
import loadingImg from "@/assets/loading.png"
import { useUserStore } from "@/pinia/user"

import { watch } from "vue"

import { useRouter } from "vue-router"

const stores = useUserStore()
const router = useRouter()

declare const JeeWeb: any

function getLocalizedText(zhText: string, enText: string) {
  return JeeWeb.Language === "zh-CN" ? zhText : enText
}

watch(() => stores.generatedPixImgFlag, (newValue) => {
  if (newValue) {
    // 显示加载动画
    // 跳转到新页面
    router.push("/finished")
  } else {
    // 隐藏加载动画
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#1C1C1E] text-white">
    <!-- 主要内容区 -->
    <main class="pt-16 px-4">
      <!-- 生成进度区域 -->
      <div class="flex flex-col items-center justify-center mt-20">
        <div class="relative w-24 h-24 mb-6">
          <div class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-xl" />
          <div class="relative w-full h-full rounded-full border-4 border-[#2C2C2E] flex items-center justify-center">
            <div
              class="absolute w-full h-full rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"
            />
          </div>
        </div>
        <div>
          <img :src="loadingImg" alt="">
        </div>
        <p class="text-white font-size-[16px] font-400">
          {{ getLocalizedText('AI中生图中...', 'AI generating image...') }}
        </p>
        <p class="text-gray-500 font-size-[13px] font-400">
          {{ getLocalizedText('正在生成图片效果', 'Picture effect being generated') }}
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
