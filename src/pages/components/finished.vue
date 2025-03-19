<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<script lang="ts" setup>
import againImg from "@/assets/againImg.png"

// import OssService from "@/common/utils/oss"
// import { artifactStsToken } from "@/http/userApi"
import { useUserStore } from "@/pinia/user"

import { defineEmits } from "vue"

const emit = defineEmits(["regenerateImage"])

const tmToken: string = "677fb12b-646d-41b2-9149-9933de02b9d7"// 临时测试token

const stores = useUserStore()
console.log(stores, "stores")
console.log(stores.tabNum, "stores.tabNum")
// const currentImage = stores.currentUploadImg;

// 获取当前的token配置：
// const stsTokenObj = {
//   type: 7,
//   token: tmToken
// }

// const stsTokenResult = await artifactStsToken(JSON.stringify(stsTokenObj))
// console.log(stsTokenResult, "stsTokenResultstsTokenResult")

// 创建 OssService 实例
// const ossService = new OssService("your-region", "your-accessKeyId", "your-accessKeySecret", "your-bucket")

function regenerateImage() {
  // 重新生成图片
  console.log("重新生成图片")
  emit("regenerateImage", {
    // 是否重新生成
    regenerateFlag: 1,
    // 当前tab，1为文字，2为图片
    tabNum: stores.tabNum,
    url: stores.currentUploadImg
  })
}

function saveToGallery() {
  // 保存到图库
  console.log("保存到图库")
}

function sendToWater() {
  // 发送到水杯
  console.log("发送到水杯")
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 px-4">
    <!-- 主要内容区 -->
    <main class="pt-4 px-4 pb-4 mt-4 bg-white">
      <div class="mt-4 h-[150px] rounded-lg overflow-hidden">
        <img :src="stores.currentUploadImg" alt="AI generated pixel art" class="w-full h-full object-cover">
      </div>

      <!-- 重新生成按钮 -->
      <div class="w-full mt-4 flex justify-center text-sm font-500">
        <button
          @click="regenerateImage"
          class="w-full  flex items-center justify-center gap-2 px-6 py-2.5 bg-[#F3F3F3] border-none border-gray-200 rounded-full"
        >
          <img :src="againImg" alt="">
          <span class="text-[#636363]">重新生图</span>
        </button>
      </div>
    </main>

    <!-- 底部操作栏 -->
    <div class="fixed bottom-10 left-0 w-full px-4 py-3   flex gap-4 text-sm ">
      <button @click="saveToGallery" class="flex-1 py-3 rounded-full bg-white border-white border-none">
        收藏到"我的图库"
      </button>
      <button @click="sendToWater" class="flex-1 py-3 bg-[#0088ff] rounded-full border-[#0088ff] border-none">
        发送到水杯
      </button>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  position: relative;
  min-height: 100vh;
  /* background-color: #f8f8f8; */
}

.nav-title {
  font-weight: 400;
  color: #333333;
}

button {
  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.98);
}
</style>
