<script setup lang="ts">
/**
 * Resources
 */
import imgTab from "@/assets/img.png"
import radioImg from "@/assets/radio.png"
import wordTab from "@/assets/word.png"
import recorder from "@/common/utils/asr/recorder"
import { requestFileUploadTokenPromise, resampleStaticUrlImage } from "@/common/utils/tools"

import Loading from "@/pages/components/loading.vue"
/**
 * Components
 */

// import Voice from "@/pages/components/voice.vue"
import Upload from "@/pages/components/upload.vue"
import { useUserStore } from "@/pinia/user"
/**
 * Hooks
 */

import { showToast } from "vant"
/**
 * API
 *
 */
import { computed, reactive, ref, watch } from "vue"
import { useRouter } from "vue-router"
import "./index.css"

const stores = useUserStore()
const router = useRouter()
const isRecording = ref(false)
const inputLength = computed(() => {
  if (states.asrText.length > 100) {
    return
  }
  return states.asrText.length
})

interface stateType {
  activeTab: 1 | 2
  recordingTime: number
  recordingInterval: any
  genetatedImgFlag: boolean
  // ai图片回显地址
  aiReturnOriFileUrl: string
  // 图片生图片回显地址
  aiOriFileUrl: string
  // 图片生图片回显地址
  asrConfig: string
  asrText: string
  fileToken: string
  lastStepFlag: boolean
}

declare const CupDevice: any
declare const JeeWeb: any

const apiBinUrl = `${import.meta.env.VITE_API_URL}/im/cup/bin` // 替换为你的 API 地址
const asrTokenUrl = `${import.meta.env.VITE_API_URL}/llm/resource/tencent/speech/token` // 替换为你的 API 地址
const generateImageUrl = `${import.meta.env.VITE_API_URL}/llm/chat/generate/image` // 替换为你的 API 地址
const tmToken: string = "677fb12b-646d-41b2-9149-9933de02b9d7"// 临时测试token

const states = reactive<stateType>({
  activeTab: 1,
  recordingTime: 0,
  recordingInterval: null,
  genetatedImgFlag: false,
  aiReturnOriFileUrl: "",
  aiOriFileUrl: "",
  asrConfig: "",
  asrText: "",
  fileToken: "",
  lastStepFlag: false
})

const inputText = ref("")
const activeTab = ref("text")
const fileList = ref([]) // 用于存储上传的图片
const audioWave = ref(Array.from({ length: 20 }, () =>
  Math.floor(Math.random() * 16 + 8)))
const showVoiceModal = ref(false)

function switchTab(tab: string) {
  console.log(tab, "tab")
  if (tab === "text") {
    stores.tabNum = 1
    // 图片清空
    stores.enableBtnflag = false
    stores.aiGeneratedPixImg = ""
  } else {
    stores.tabNum = 2
    // 文字清空
    stores.currentText = ""
    states.asrText = ""
    stores.enableBtnflag = false
  }
  if (tab === activeTab.value) return
  activeTab.value = tab
}

function getAsrToken(token: string) {
  const url = `${asrTokenUrl}?token=${token}`
  fetch(url, {
    method: "GET",
    // 显式指定header请求头
    headers: {
      "Content-Type": "application/json", // 表示请求体是 JSON 格式数据
      "Accept": "application/json" // 表示客户端期望接收 JSON 格式的响应
    }
  })
    .then(response => response.json())
    .then((data: any) => {
      console.log(data, JSON.stringify(data))
      if (data.code === 200) {
        states.asrConfig = data.result // 开始
        // setAsrConfig(data.result); //开始
      }
    })
    .catch((error: any) => {
      console.log(error)
    })
}

function startAsr() {
  isRecording.value = true
  showVoiceModal.value = true
  recorder.startWebAsr(states.asrConfig)
  states.asrText = ""
}

function stopAsr() {
  setTimeout(() => {
    recorder.stopWebAsr()
    // 停止录音逻辑
    isRecording.value = false
    showVoiceModal.value = false
  }, 200)
}

function regenerateImage(params: any) {
  console.log("重新生成图片", params)
  generateImg(params)
}

async function generateImg(params: any) {
  if (stores.tabNum === 1) {
    stores.generatedPixImgFlag = true
    stores.resultLastImgFlag = false
  } else if (stores.tabNum === 2) {
    if (stores.tab2AiFlag) {
      stores.generatedPixImgFlag = true
      stores.resultLastImgFlag = false
    }
  }
  let currentToken = ""
  try {
    currentToken = await requestFileUploadTokenPromise() as string
    console.log(currentToken, "currentToken-----generateImg")
  } catch (error) {
    stores.generatedPixImgFlag = false
    stores.resultLastImgFlag = false
  }

  // result.token

  // 文字生成的图片：stores.aiGeneratedPixImg
  // ai开启，图片生成的图片：stores.aiGeneratedPixImg
  // 自定义上传生成的图片：stores.currentUploadImg
  let staticArr = null as any

  if (activeTab.value === "text" || stores.tabNum === 1) {
    // 如果此时是tab= 1文字
    stores.currentText = states.asrText
    await fetch(generateImageUrl, {
      method: "POST",
      // 显式指定header请求头
      headers: {
        "Content-Type": "application/json", // 表示请求体是 JSON 格式数据
        "Accept": "application/json" // 表示客户端期望接收 JSON 格式的响应
      },
      body: JSON.stringify({
        prompt: states.asrText,
        token: currentToken || tmToken,
        imgUrl: ""
      })
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 504) {
            // 处理 504 错误
            stores.generatedPixImgFlag = false

            stores.resultLastImgFlag = false

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
          states.aiOriFileUrl = encodeURI(JSON.parse(data.result).image_url)
          console.log(states.aiOriFileUrl, "states.aiOriFileUrl")
          stores.aiGeneratedPixImg = encodeURI(JSON.parse(data.result).image_url)
          console.log(stores.aiGeneratedPixImg, "stores.aiGeneratedPixImg")
          // router.push("/finished")
        }
      })
      .catch((error: any) => {
        showToast({
          message: getLocalizedText("请求超时，请稍后重试", "Request timeout, please try again later"),
          position: "top"
        })
        stores.generatedPixImgFlag = false

        stores.resultLastImgFlag = false
        console.log(error)
      })

    staticArr = await resampleStaticUrlImage(stores.aiGeneratedPixImg, 32, 16)
    stores.generatedPixImgFlag = true

    stores.resultLastImgFlag = false
    router.push("/finished")
  } else {
    if (!stores.tab2AiFlag) {
      // 传统的图片下发给服务端，生成bin图
      console.log("传统png-转化成bin文件路径，参考之前实现")

      try {
        staticArr = await resampleStaticUrlImage(stores.currentUploadImg, 32, 16)
      } catch (error) {
        showToast({
          message: "rbg565 tranfrom error",
          position: "top"

        })
        stores.generatedPixImgFlag = false
        stores.resultLastImgFlag = false
      }
      stores.generatedPixImgFlag = false
      stores.resultLastImgFlag = true
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
            states.aiOriFileUrl = encodeURI(JSON.parse(data.result).image_url)
            console.log(states.aiOriFileUrl, "states.aiOriFileUrl")
            stores.aiGeneratedPixImg = encodeURI(JSON.parse(data.result).image_url)
            console.log(stores.aiGeneratedPixImg, "stores.aiGeneratedPixImg")
          }
        })
        .catch((error: any) => {
          stores.generatedPixImgFlag = false
          stores.resultLastImgFlag = true
          console.log(error)
        })

      try {
        staticArr = await resampleStaticUrlImage(stores.aiGeneratedPixImg, 32, 16)
      } catch (error) {
        showToast({
          message: "rbg565 tranfrom error",
          position: "top"

        })
        stores.generatedPixImgFlag = false
        stores.resultLastImgFlag = true
      }
    }
  }

  const postData = {
    data: staticArr.rgb565Array as any,
    token: currentToken || tmToken
  }

  try {
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
          router.push("/finished")
        }
      })
      .catch((error: any) => {
        console.log(error)
      })
  } catch (error) {
    console.log(error)
    showToast({
      message: "img图片报错",
      position: "top"
    })
  }
}

watch([activeTab, inputLength], ([newValue1, newValue2], [oldValue1, oldValue2]) => {
  if (activeTab.value === "text") {
    if (inputLength.value === 0) {
      console.log("inputLength.value === 0")
      states.genetatedImgFlag = false
      stores.enableBtnflag = false
    } else {
      console.log("inputLength.value !== 0")
      states.genetatedImgFlag = true
      stores.enableBtnflag = true
    }
  } else if (activeTab.value === "image") {
    if (!stores.currentUploadImg) {
      stores.enableBtnflag = false
    } else {
      stores.enableBtnflag = true
    }
  }
}, {
  immediate: true
})

// 监听录音状态变化
getAsrToken(tmToken)
// 获取token
recorder.setAudioInputCallback((data: any) => {
  const { sliceType, voiceText } = data
  if (!voiceText) return
  switch (sliceType) {
    // 1 开始
    case 1:
      break
    // 2 停止
    case 2:
      // const text = asrText + voiceText;
      const text = states.asrText + voiceText
      inputText.value = text
      // setAsrText(text);
      if (inputText.value.length > 100) {
        showToast({
          message: "输入内容已超过100个字符",
          position: "top"
        })
        states.asrText = text
      } else {
        states.asrText = text
      }

      break
    default:
      break
  }
})
/* 语音识别结束 */
recorder.setAudioDoneCallback(() => { })

/* 语音识别失败 */
recorder.setAudioErrorCallback(() => { })

// 获取零时asr零时token

console.log(import.meta.env.MODE, "import.meta.env.MODE")

// 定义响应式数据

function toggleRecording() {
  console.log("toggleRecording-----")
}

function cancelRecording() {
  console.log("cancelRecording-----")
}
// 添加获取本地化文本的函数
function getLocalizedText(zhText: string, enText: string) {
  return JeeWeb.Language === "zh-CN" ? zhText : enText
}
</script>

<template>
  <div
    v-if="!stores.generatedPixImgFlag && !stores.resultLastImgFlag"
    class="container mx-auto   items-center flex flex-col h-screen bg-[#F5F4F7] p-4 bg-image"
  >
    <div class="flex space-x-4 mb-4 w-full">
      <!-- <button className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 rounded-xl py-2 px-4 rounded button-with-triangle"> -->
      <div :class="stores.tabNum === 1 ? 'bubble' : 'bubble-img'" class="flex-1 py-3 px-8 rounded">
        <span class="inline-flex items-center" @click="switchTab('text')">
          <img :src="wordTab" :alt="getLocalizedText('文字图标', 'Text Icon')" class="w-4 h-4 mr-2">
          {{ getLocalizedText('文字生图', 'Text to Image') }}
        </span>
      </div>
      <div :class="stores.tabNum === 2 ? 'bubble' : 'bubble-img'" class="flex-1  py-3 px-8 rounded">
        <span class="inline-flex items-center" @click="switchTab('image')">
          <img :src="imgTab" :alt="getLocalizedText('图片图标', 'Image Icon')" class="w-4 h-4 mr-2">
          {{ getLocalizedText('图片生图', 'Image to Image') }}
        </span>
      </div>
      <!-- </button> -->
    </div>
    <!-- 输入区域 -->
    <div v-if="stores.tabNum === 1" class="bg-white rounded-xl p-4  bg-white border border-gray-300 rounded p-4 w-full ">
      <div class="flex justify-between items-center mb-3">
        <span class="text-gray-900 text-sm font-700">{{ getLocalizedText('画面关键词', 'Scene Keywords') }}</span>
        <span class="text-gray-400 text-sm">
          <span :class="inputLength === 0 ? 'text-gray-400' : 'text-black'">{{ inputLength }}</span>
          /100</span>
      </div>

      <div class="relative">
        <textarea
          v-model="states.asrText"
          class="w-full h-40 resize-none bg-gray-50 rounded-lg p-4 text-gray-800 outline-none border-none" :maxlength="100"
          :placeholder="getLocalizedText('点击输入文字', 'Click to input text')"
        />
        <button
          v-if="!isRecording"
          class="absolute right-4 bottom-4 w-12 h-12  bg-gray-50 rounded-none border-none  flex items-center justify-center"
          @click="startAsr"
        >
          <img :src="radioImg" alt="">
        </button>
        <div v-if="showVoiceModal" class="bg-white absolute bottom-0   border-t">
          <div class="relative flex items-center  rounded-lg  py-0 mb-0">
            <button class="bg-white border-none flex items-center justify-center">
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
            <button @click="stopAsr" v-if="isRecording" class="bg-white border-none items-center justify-center">
              <van-icon name="passed" size="40" color="#3b82f6" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 图片区域 -->
    <div
      v-if="stores.tabNum === 2" :class="stores.tabNum === 2 ? 'bg-white' : 'bg-[#DFEFFC]'"
      class="rounded-xl p-4 border border-gray-300 rounded p-4 w-full bg-[#DFEFFC]"
    >
      <Upload :custom-size="{ width: 300, height: 150 }" />
    </div>

    <div class="text-center fixed bottom-10 ">
      <button
        :disabled="!stores.enableBtnflag" @click="generateImg"
        :class="stores.enableBtnflag ? 'bg-[#0094FF]' : 'bg-[#D7D7D7]'"
        class="border-none rounded-full text-white py-2 px-4 w-80 h-[49px] font-size-[15px]"
      >
        {{ getLocalizedText('生成像素图', 'Generate Pixel Image') }}
      </button>
    </div>
  </div>
  <div v-if="stores.generatedPixImgFlag && !stores.resultLastImgFlag">
    <Loading />
  </div>
</template>
