<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<script lang="ts" setup>
import againImg from "@/assets/againImg.png"
import { createOssClient, uploadFileToOss } from "@/common/utils/oss"
import { convertImageToRGB565Blob, requestFileUploadTokenPromise, resampleStaticUrlImage, urlTranfromFile } from "@/common/utils/tools"
import { addArtifact } from "@/http/userApi.ts"
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

function getLocalizedText(zhText: string, enText: string) {
  return JeeWeb.Language === "zh-CN" ? zhText : enText
}

async function regenerateImage() {
  let currentToken = ""
  let staticArr = null as any

  console.log(currentToken, "currentToken")
  // 如果是重新生成非ai的图片，不用调到loading页面
  if (!stores.tab2AiFlag && stores.tabNum === 2) {
    // 可以什么都不做，直接调接口，当前页面生成图片
    // stores.generatedPixImgFlag = true
    // stores.resultLastImgFlag = false
    // stores.regenerateBtnFlag = false
  } else {
    stores.regenerateBtnFlag = true
    stores.generatedPixImgFlag = true
    stores.resultLastImgFlag = false
    router.push("/")
    // 因为这里有一个路由，所以下面需要成功或失败后，有路由跳转
  }

  currentToken = await requestFileUploadTokenPromise() as string
  if (stores.tabNum === 1) {
    await fetch(generateImageUrl, {
      method: "POST",
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
            // console.error("请求超时，状态码: 504")
            showToast(getLocalizedText("请求超时，请稍后重试", "Request timeout, please try again later"))
            // throw new Error("请求超时，请稍后重试")
          }
          throw new Error(`请求失败，状态码: ${response.status}`)
        }
        return response.json()
      }
      )
      .then((data: any) => {
        if (data.code === 200) {
          try {
            stores.aiGeneratedPixImg = encodeURI(JSON.parse(data.result).image_url)
            currentImg.value = stores.aiGeneratedPixImg
            console.log(stores.aiGeneratedPixImg, "stores.aiGeneratedPixImg")
          } catch (error) {
            stores.generatedPixImgFlag = false
            stores.resultLastImgFlag = false
            router.push("/finished")
          }
        }
      })
      .catch((error: any) => {
        showToast(getLocalizedText("请求超时，请稍后重试", "Request timeout, please try again later"))
        stores.generatedPixImgFlag = false
        stores.resultLastImgFlag = true
        console.log(error)
      })

    try {
      /**
       * 7 静态图oss上传流程：
       * 转换图片
       * 第一步：ossclient客户端
       * 第二步：上传文件、bin到oss
       * 第三步：存储oss数据到全局
       */
      // TODO: stores.aiGeneratedPixImg
      staticArr = await resampleStaticUrlImage(stores.aiGeneratedPixImg, 32, 16)
      const files = await urlTranfromFile(stores.aiGeneratedPixImg) as any

      const rbg565blob = await convertImageToRGB565Blob(files, 32, 16)
      const ossObj = await createOssClient(7, currentToken)// 创建 OSS 客户端
      const ossResult = await uploadFileToOss(ossObj, files, 7) as any
      const ossObjBin = await createOssClient(9, currentToken)// 创建 OSS 客户端
      const ossResultBin = await uploadFileToOss(ossObjBin, files, 9) as any
      stores.pixImgBin = ossResultBin.fileUrl
      stores.addImgArtifactParam = {
        cover: ossResult.fileUrl,
        fileUrl: ossResult.fileUrl,
        fileSize: ossResult.fileSize,
        binFileUrl: ossResultBin.fileUrl,
        binSize: ossResultBin.fileSize,
        type: 0
      }
      router.push("/finished")
    } catch (error) {
      router.push("/finished")
      showToast({
        message: "regenerate text to img  error4",
        position: "top"
      })
    }
  } else {
    if (!stores.tab2AiFlag) {
      // no code 不需要处理了
    } else {
      // ai图生成图
      await fetch(generateImageUrl, {
        method: "POST",
        // 显式指定header请求头
        headers: {
          "Content-Type": "application/json", // 表示请求体是 JSON 格式数据
          "Accept": "application/json" // 表示客户端期望接收 JSON 格式的响应
        },
        body: JSON.stringify({
          prompt: "",
          token: currentToken || tmToken,
          imgUrl: stores.currentUploadImg
        })
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 504) {
              // 处理 504 错误
              stores.generatedPixImgFlag = false
              stores.resultLastImgFlag = false
              console.error(`${getLocalizedText("请求超时，状态码: ", "Request timeout, status code: ")}504`)
              throw new Error(getLocalizedText("请求超时，请稍后重试", "Request timeout, please try again later"))
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
          }
        })
        .catch((error: any) => {
          stores.generatedPixImgFlag = false
          stores.resultLastImgFlag = true
          console.log(error)
        })

      try {
        /**
         * 7 静态图oss上传流程：
         * 转换图片
         * 第一步：ossclient客户端
         * 第二步：上传文件、bin到oss
         * 第三步：存储oss数据到全局
         */
        // TODO: stores.aiGeneratedPixImg
        staticArr = await resampleStaticUrlImage(stores.aiGeneratedPixImg, 32, 16)
        const files = await urlTranfromFile(stores.aiGeneratedPixImg) as any
        const rbg565blob = await convertImageToRGB565Blob(files, 32, 16)
        const ossObj = await createOssClient(7, currentToken)// 创建 OSS 客户端
        const ossResult = await uploadFileToOss(ossObj, files, 7) as any
        const ossObjBin = await createOssClient(9, currentToken)
        const ossResultBin = await uploadFileToOss(ossObjBin, files, 9) as any
        stores.pixImgBin = ossResultBin.fileUrl
        stores.addImgArtifactParam = {
          cover: ossResult.fileUrl,
          fileUrl: ossResult.fileUrl,
          fileSize: ossResult.fileSize,
          binFileUrl: ossResultBin.fileUrl,
          binSize: ossResultBin.fileSize,
          type: 0
        }
        router.push("/finished")
      } catch (error) {
        router.push("/finished")
        showToast({
          message: "regenerate img tranfrom error3",
          position: "top"
        })
      }
    }
  }
}

async function saveToGallery() {
  // 保存到图库
  const currentToken = await requestFileUploadTokenPromise() as string
  // 等待接入oss

  addArtifact({
    cover: stores.addImgArtifactParam.fileUrl,
    fileUrl: stores.addImgArtifactParam.fileUrl,
    fileSize: stores.addImgArtifactParam.fileSize,
    binFileUrl: stores.addImgArtifactParam.binFileUrl,
    binSize: 1024,
    type: 0,
    token: currentToken || tmToken
  }).then((res) => {
    console.log(res, "res")
    showToast(getLocalizedText("保存成功", "Save successfully"))
  }).catch((err) => {
    console.log(err, "err")
    showToast(getLocalizedText("保存失败", "Save error"))
  })
}

function sendToWater() {
  setStaticTalFile()
  // 发送到水杯
  console.log(getLocalizedText("发送到水杯---setStaticTalFile", "Send to cup---setStaticTalFile"))
}

watch(() => stores.tabNum, (newVal) => {
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
      showToast(getLocalizedText("静态图已推送至水杯", "Static image has been sent to the cup"))
    })
    .catch((err: any) => {
      console.log(err)
      showToast(getLocalizedText("静态图推送失败", "Static image push failed"))
      // message.success(getLocalizedText('静态图推送失败', 'Static image push failed'));
    })
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 px-4">
    <main class="pt-4 px-4 pb-4 mt-4 bg-white">
      <div class="mt-4 h-[150px] rounded-lg overflow-hidden">
        <img
          :src="currentImg" :alt="getLocalizedText('AI生成的像素图', 'AI generated pixel art')"
          class="w-full h-full object-cover"
        >
      </div>

      <div v-if="stores.tabNum === 1 || stores.tab2AiFlag" class="w-full mt-4 flex justify-center text-sm font-500">
        <button
          @click="regenerateImage"
          class="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-[#F3F3F3] border-none border-gray-200 rounded-full"
        >
          <img :src="againImg" :alt="getLocalizedText('重新生成', 'Regenerate')">
          <span class="text-[#636363]">{{ getLocalizedText('重新生图', 'Regenerate Image') }}</span>
        </button>
      </div>
    </main>

    <div class="fixed bottom-10 left-0 w-full px-4 py-3 flex gap-4 text-sm">
      <button @click="saveToGallery" class="flex-1 py-3 rounded-full bg-white border-white border-none">
        {{ getLocalizedText('保存到"我的图库"', 'Save to "My Gallery"') }}
      </button>
      <button
        @click="sendToWater"
        class="flex-1 py-3 bg-[#0088ff] rounded-full border-[#0088ff] border-none text-white font-400"
      >
        {{ getLocalizedText('发送到水杯', 'Send to Cup') }}
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
