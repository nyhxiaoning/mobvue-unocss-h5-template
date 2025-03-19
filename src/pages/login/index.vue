<script setup lang="ts">
/**
 * Resources
 */
import imgTab from "@/assets/img.png"
import radioImg from "@/assets/radio.png"
import wordTab from "@/assets/word.png"
import recorder from "@/common/utils/asr/recorder"
import { resampleStaticUrlImage } from "@/common/utils/tools"
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

// 临时文件token获取内容
// JeeWeb.requestFileUploadToken(({ result }: { result: any }) => {
//   console.log(result.token)
//   states.fileToken = result.token
// })

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
  } else {
    stores.tabNum = 2
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
  const currentToken = ""
  // JeeWeb.requestFileUploadToken(({ result }: { result: any }) => {
  //   currentToken = result.token
  // })
  // result.token
  if (stores.tabNum === 1) {
    stores.generatedPixImgFlag = true
    states.lastStepFlag = false
    stores.resultLastImgFlag = false
  } else if (stores.tabNum === 2) {
    if (stores.tab2AiFlag) {
      stores.generatedPixImgFlag = true
      states.lastStepFlag = false
      stores.resultLastImgFlag = false
    }
  }

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
        token: tmToken || currentToken,
        imgUrl: ""
      })
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 504) {
            // 处理 504 错误
            stores.generatedPixImgFlag = false
            states.lastStepFlag = false
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
          // router.push("/finished")
        }
      })
      .catch((error: any) => {
        showToast({
          message: "请求超时，请稍后重试",
          position: "top"
        })
        stores.generatedPixImgFlag = false
        states.lastStepFlag = false

        stores.resultLastImgFlag = false
        console.log(error)
      })

    staticArr = await resampleStaticUrlImage(stores.aiGeneratedPixImg, 32, 16)
    stores.generatedPixImgFlag = false
    states.lastStepFlag = true
    stores.resultLastImgFlag = true
    debugger
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
              states.lastStepFlag = false
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

            router.push("/finished")
          }
        })
        .catch((error: any) => {
          stores.generatedPixImgFlag = false
          states.lastStepFlag = false
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
  console.log(postData, "postData----------")
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
        states.lastStepFlag = true
        stores.resultLastImgFlag = true
      }
    })
    .catch((error: any) => {
      console.log(error)
    })
}

function setStaticTalFile() {
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

function saveToGallery(params: any) {
  // 保存到图库
  console.log(params, "子组件触发")
  console.log("保存到图库")
}

function sendToWater() {
  // 发送到水杯
  setStaticTalFile()
  console.log("发送到水杯")
}

watch([activeTab, inputLength, fileList], ([newValue1, newValue2, newValue3], [oldValue1, oldValue2, oldValue3]) => {
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
    if (fileList.value.length === 0) {
      console.log("fileList.value.length === 0")
      states.genetatedImgFlag = false
      stores.enableBtnflag = false
    } else {
      console.log("fileList.value.length !== 0")
      states.genetatedImgFlag = true
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
          <img :src="wordTab" alt="文字图标" class="w-4 h-4 mr-2">
          文字生图
        </span>
      </div>
      <div :class="stores.tabNum === 2 ? 'bubble' : 'bubble-img'" class="flex-1  py-3 px-8 rounded">
        <span class="inline-flex items-center" @click="switchTab('image')">
          <img :src="imgTab" alt="图片图标" class="w-4 h-4 mr-2">
          图片生图
        </span>
      </div>
      <!-- </button> -->
    </div>
    <!-- 输入区域 -->
    <div v-if="stores.tabNum === 1" class="bg-white rounded-xl p-4  bg-white border border-gray-300 rounded p-4 w-full">
      <div class="flex justify-between items-center mb-3">
        <span class="text-gray-900 text-sm">画面关键词</span>
        <span class="text-gray-400 text-sm">{{ inputLength }}/100</span>
      </div>

      <div class="relative">
        <textarea
          v-model="states.asrText"
          class="w-full h-40 resize-none bg-gray-50 rounded-lg p-4 text-gray-800 outline-none" :maxlength="100"
          placeholder="点击输入文字"
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
        class=" border-none  rounded-full text-white  py-2 px-4 rounded w-80 h-[49px] font-size-[15px] "
      >
        生成像素图
      </button>
    </div>
  </div>
  <div v-if="stores.generatedPixImgFlag && !stores.resultLastImgFlag">
    <Loading />
  </div>
</template>
