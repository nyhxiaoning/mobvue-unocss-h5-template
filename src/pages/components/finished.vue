<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<script lang="ts" setup>
import againImg from "@/assets/againImg.png"
import { requestFileUploadTokenPromise, resampleStaticUrlImage } from "@/common/utils/tools"

import { useUserStore } from "@/pinia/user"
import { showToast } from "vant"

import { ref, watch } from "vue"

import { useRouter } from "vue-router"

// const emit = defineEmits(["regenerateImage"])
declare const CupDevice: any
declare const JeeWeb: any

const router = useRouter()
const tmToken: string = "677fb12b-646d-41b2-9149-9933de02b9d7"// 临时测试token
const apiBinUrl = `${import.meta.env.VITE_API_URL}/im/cup/bin` // 替换为你的 API 地址
const generateImageUrl = `${import.meta.env.VITE_API_URL}/llm/chat/generate/image` // 替换为你的 API 地址

const currentImg = ref("")

const stores = useUserStore()

async function regenerateImage() {
  let currentToken = ""
  let staticArr = null as any
  stores.generatedPixImgFlag = true
  stores.resultLastImgFlag = false
  stores.generateBtnFlag = true
  currentToken = await requestFileUploadTokenPromise() as string
  console.log(currentToken, "currentToken")
  router.push("/")
  if (stores.tabNum === 1) {
    await fetch(generateImageUrl, {
      method: "POST",
      // 显式指定header请求头
      headers: {
        "Content-Type": "application/json", // 表示请求体是 JSON 格式数据
        "Accept": "application/json" // 表示客户端期望接收 JSON 格式的响应
      },
      body: JSON.stringify({
        prompt: stores.currentText,
        token: tmToken || currentToken,
        imgUrl: ""
      })
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 504) {
            // 处理 504 错误
            stores.generatedPixImgFlag = false
            stores.resultLastImgFlag = false
            console.error("请求超时，状态码: 504")
            throw new Error("请求超时，请稍后重试")
          }
          throw new Error(`请求失败，状态码: ${response.status}`)
        }
        return response.json()
      }
      )
      .then((data: any) => {
        if (data.code === 200) {
          stores.aiGeneratedPixImg = encodeURI(JSON.parse(data.result).image_url)
          currentImg.value = stores.aiGeneratedPixImg
          console.log(stores.aiGeneratedPixImg, "stores.aiGeneratedPixImg")
        }
      })
      .catch((error: any) => {
        showToast("请求超时，请稍后重试")
        stores.generatedPixImgFlag = false
        stores.resultLastImgFlag = false
        console.log(error)
      })

    staticArr = resampleStaticUrlImage(stores.aiGeneratedPixImg, 32, 16)

    router.push("/finished")
  } else {
    if (!stores.tab2AiFlag) {
      // 传统的图片下发给服务端，生成bin图
      console.log("传统png-转化成bin文件路径，参考之前实现")
      staticArr = await resampleStaticUrlImage(stores.currentUploadImg, 32, 16)
    } else {
      // ai图生成图
      fetch(generateImageUrl, {
        method: "POST",
        // 显式指定header请求头
        headers: {
          "Content-Type": "application/json", // 表示请求体是 JSON 格式数据
          "Accept": "application/json" // 表示客户端期望接收 JSON 格式的响应
        },
        body: JSON.stringify({
          prompt: "",
          token: tmToken || currentToken,
          imgUrl: stores.currentUploadImg
        })
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 504) {
              // 处理 504 错误
              stores.generatedPixImgFlag = false
              stores.resultLastImgFlag = false
              console.error("请求超时，状态码: 504")
              throw new Error("请求超时，请稍后重试")
            }
            // 处理其他错误
            throw new Error(`请求失败，状态码: ${response.status}`)
          }
          return response.json()
        }
        )
        .then((data: any) => {
          if (data.code === 200) {
            stores.aiGeneratedPixImg = encodeURI(JSON.parse(data.result).image_url)
            console.log(stores.aiGeneratedPixImg, "stores.aiGeneratedPixImg")
            currentImg.value = stores.aiGeneratedPixImg
            router.push("/finished")
          }
        })
        .catch((error: any) => {
          stores.generatedPixImgFlag = false
          stores.resultLastImgFlag = true
          console.log(error)
        })

      staticArr = await resampleStaticUrlImage(stores.aiGeneratedPixImg, 32, 16)
    }
  }

  const postData = {
    data: staticArr.rgb565Array as any,
    // TODO:待修改吧
    token: tmToken || currentToken
  }
  await fetch(apiBinUrl, {
    method: "POST",
    // 显式指定header请求头
    headers: {
      "Content-Type": "application/json", // 表示请求体是 JSON 格式数据
      "Accept": "application/json" // 表示客户端期望接收 JSON 格式的响应
    },
    body: JSON.stringify(postData)
  })
    .then(response => response.json())
    .then((data: any) => {
      console.log(data, JSON.stringify(data))
      if (data.code === 200) {
        stores.pixImgBin = data.result?.binFileUrl
        // 1024 静态图，默认都是，除非后面拓展
        stores.generatedPixImgFlag = false
        stores.resultLastImgFlag = true
      }
    })
    .catch((error: any) => {
      console.log(error)
    })
}

function saveToGallery() {
  // 保存到图库
  console.log("保存到图库")
  // 等待接入oss
}

function sendToWater() {
  setStaticTalFile()
  // 发送到水杯
  console.log("发送到水杯---setStaticTalFile")
}

watch(() => stores.tabNum, (newVal) => {
  debugger
  if (newVal === 2) {
    currentImg.value = stores.aiGeneratedPixImg
    console.log("tabNum为2", "stores.aiGeneratedPixImg", stores.aiGeneratedPixImg)
  } else if (newVal === 1) {
    console.log("tabNum为1", "stores.currentUploadImg", stores.currentUploadImg)
    currentImg.value = stores.currentUploadImg
  }
})

console.log(currentImg.value, "currentImg.value")
if (stores.tabNum === 2) {
  if (stores.tab2AiFlag) {
    currentImg.value = stores.aiGeneratedPixImg
  } else {
    currentImg.value = stores.currentUploadImg
  }

  console.log("tabNum为2--------", "stores.aiGeneratedPixImg", stores.aiGeneratedPixImg)
} else if (stores.tabNum === 1) {
  debugger
  console.log("tabNum为1", "stores.currentUploadImg", stores.currentUploadImg)
  currentImg.value = stores.aiGeneratedPixImg
}

function setStaticTalFile() {
  // let staticArr = null as any
  // if(stores.tabNum === 1){
  //     staticArr = resampleStaticUrlImage(stores.aiGeneratedPixImg, 32, 16)
  // }else if(stores.tabNum === 2){
  //   if(!stores.tab2AiFlag){
  //     staticArr = resampleStaticUrlImage(stores.aiGeneratedPixImg, 32, 16)
  //   }else{
  //     staticArr =  resampleStaticUrlImage(stores.currentUploadImg, 32, 16)
  //   }
  // }
  CupDevice.setDevMessage({
    value: {
      method: "showRGBBitmap",
      params: {
        imageContent: {
          url: stores.pixImgBin,
          size: 1024,
          type: "application/bin" //  type:image/gif
        }
      }
    }
  })
    .then((res: any) => {
      // message.success(getLocalizedText('静态图已推送至水杯', 'Static image has been sent to the cup'));
      console.log(res, "单个")
    })
    .catch((err: any) => {
      console.log(err)
      // message.success(getLocalizedText('静态图推送失败', 'Static image push failed'));
    })
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 px-4">
    <!-- 主要内容区 -->
    <main class="pt-4 px-4 pb-4 mt-4 bg-white">
      <div class="mt-4 h-[150px] rounded-lg overflow-hidden">
        <img :src="currentImg" alt="AI generated pixel art" class="w-full h-full object-cover">
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
      <button
        @click="sendToWater"
        class="flex-1 py-3 bg-[#0088ff] rounded-full border-[#0088ff] border-none text-white font-400"
      >
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
