<script setup lang="ts">
/**
 * Resources
 */
import imgTab from "@/assets/img.png"
import radioImg from "@/assets/radio.png"
import wordTab from "@/assets/word.png"
import recorder from "@/common/utils/asr/recorder"

/**
 * Components
 */

import Finished from "@/pages/components/finished.vue"
import Loading from "@/pages/components/loading.vue"
// import Voice from "@/pages/components/voice.vue"
import Upload from "@/pages/components/upload.vue"
/**
 * Hooks
 */

import { useUserStore } from "@/pinia/user"
/**
 * API
 *
 */
import { computed, reactive, ref, watch } from "vue"
import { useRouter } from "vue-router"

const stores = useUserStore()
const router = useRouter()
const isRecording = ref(false)
const inputLength = computed(() => {
  return inputText.value.length
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

const showVoiceModal = ref(false)

function switchTab(tab: string) {
  console.log(tab, "tab")
  if (tab === "text") {
    stores.tab = 1
  } else {
    stores.tab = 2
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
  if (params?.type !== 1) {
    stores.generatedPixImgFlag = false
    states.lastStepFlag = true
  }

  if (activeTab.value === "text") {
    await fetch(generateImageUrl, {
      method: "POST",
      // 显式指定header请求头
      headers: {
        "Content-Type": "application/json", // 表示请求体是 JSON 格式数据
        "Accept": "application/json" // 表示客户端期望接收 JSON 格式的响应
      },
      body: JSON.stringify({
        prompt: params?.type === 1 ? "" : inputText.value,
        token: tmToken,
        imgUrl: params?.type === 1 ? params?.url : ""
      })
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 504) {
            // 处理 504 错误
            stores.generatedPixImgFlag = false
            states.lastStepFlag = false

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
          stores.currentUploadImg = encodeURI(JSON.parse(data.result).image_url)
          console.log(stores.currentUploadImg, "stores.currentUploadImg")
          if (params?.type !== 1) {
            stores.generatedPixImgFlag = false
            states.lastStepFlag = true
          }

          // router.push("/finished")
        }
      })
      .catch((error: any) => {
        stores.generatedPixImgFlag = false
        states.lastStepFlag = false
        console.log(error)
      })
  } else {
    if (!stores.tab2AiFlag) {
      // 传统的图片下发给服务端，生成bin图
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
          token: tmToken,
          imgUrl: stores.currentUploadImg
        })
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 504) {
            // 处理 504 错误
              stores.generatedPixImgFlag = false
              states.lastStepFlag = false

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
            stores.currentUploadImg = encodeURI(JSON.parse(data.result).image_url)
            console.log(stores.currentUploadImg, "stores.currentUploadImg")
            if (params?.type !== 1) {
              stores.generatedPixImgFlag = false
              states.lastStepFlag = true
            }

          // router.push("/finished")
          }
        })
        .catch((error: any) => {
          stores.generatedPixImgFlag = false
          states.lastStepFlag = false
          console.log(error)
        })
    }
  }
}

watch([activeTab, inputLength, fileList], ([newValue1, newValue2, newValue3], [oldValue1, oldValue2, oldValue3]) => {
  if (activeTab.value === "text") {
    if (inputLength.value === 0) {
      console.log("inputLength.value === 0")
      states.genetatedImgFlag = false
    } else {
      console.log("inputLength.value !== 0")
      states.genetatedImgFlag = true
    }
  } else if (activeTab.value === "image") {
    if (fileList.value.length === 0) {
      console.log("fileList.value.length === 0")
      states.genetatedImgFlag = false
    } else {
      console.log("fileList.value.length !== 0")
      states.genetatedImgFlag = true
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
      states.asrText = text
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
</script>

<template>
  <div v-if="!stores.generatedPixImgFlag && !states.lastStepFlag" class="container mx-auto   items-center flex flex-col h-screen bg-[#F5F4F7] p-4 bg-image">
    <div class="flex space-x-4 mb-4 w-full">
      <!-- <button className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 rounded-xl py-2 px-4 rounded button-with-triangle"> -->
      <div :class="activeTab === 'text' ? 'bubble' : 'bubble-img'" class="flex-1 py-3 px-8 rounded">
        <span class="inline-flex items-center" @click="switchTab('text')">
          <img :src="wordTab" alt="文字图标" class="w-4 h-4 mr-2">
          文字生图
        </span>
      </div>
      <div :class="activeTab === 'image' ? 'bubble' : 'bubble-img'" class="flex-1  py-3 px-8 rounded">
        <span class="inline-flex items-center" @click="switchTab('image')">
          <img :src="imgTab" alt="图片图标" class="w-4 h-4 mr-2">
          图片生图
        </span>
      </div>
      <!-- </button> -->
    </div>
    <!-- 输入区域 -->
    <div v-if="activeTab === 'text'" class="bg-white rounded-xl p-4  bg-white border border-gray-300 rounded p-4 w-full">
      <div class="flex justify-between items-center mb-3">
        <span class="text-gray-900 text-sm">画面关键词</span>
        <span class="text-gray-400 text-sm">{{ inputLength }}/100</span>
      </div>

      <div class="relative">
        <textarea
          v-model="inputText" class="w-full h-40 resize-none bg-gray-50 rounded-lg p-4 text-gray-800 outline-none"
          :maxlength="100" placeholder="点击输入文字"
        />
        <button
          v-if="!isRecording"
          class="absolute right-4 bottom-4 w-12 h-12  bg-gray-50 rounded-none border-none  flex items-center justify-center"
          @click="startAsr"
        >
          <img :src="radioImg" alt="">
          <!-- <i class="fa-solid fa-microphone text-xl" /> -->
        </button>
        <div class="absolute blue-gray-400 mt-3  p-4 flex items-center gap-4 rounded-lg" v-if="isRecording">
          <div class="flex-1">
            <p class="text-sm text-gray-500 mt-1">
              正在录音...
            </p>
          </div>
          <button
            class="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shadow-sm"
            @click="stopAsr"
          >
            <img :src="radioImg" alt="">
          </button>
        </div>
      </div>
    </div>
    <!-- 图片区域 -->
    <div
      v-if="activeTab === 'image'" :class="activeTab === 'image' ? 'bg-white' : 'bg-[#DFEFFC]'"
      class="rounded-xl p-4 border border-gray-300 rounded p-4 w-full bg-[#DFEFFC]"
    >
      <Upload v-model="fileList" :custom-size="{ width: 300, height: 150 }" />
    </div>

    <div class="text-center fixed bottom-10 ">
      <button
        @click="generateImg" :class="states.genetatedImgFlag ? 'bg-[#0094FF]' : 'bg-[#D7D7D7]'"
        class=" border-none  rounded-full text-white  py-2 px-4 rounded w-80 h-[49px] font-size-[15px] "
      >
        生成像素图
      </button>
    </div>

    <!-- 录音弹窗 -->
    <!-- <Radio :show-voice-modal="showVoiceModal" :is-recording="isRecording" /> -->
    <!-- <Voice @toggle-recording="toggleRecording" @cancel-recording="cancelRecording" :show-voice-modal="showVoiceModal" :is-recording="isRecording" /> -->
  </div>
  <div v-if="stores.generatedPixImgFlag && !states.lastStepFlag">
    <Loading />
  </div>
  <div v-if="states.lastStepFlag && !stores.generatedPixImgFlag">
    <Finished @regenerate-image="regenerateImage" />
  </div>
</template>

<style scoped>
.bg-image {
  background-image: url("./../../assets/bg-image.png");
  background-repeat: no-repeat;
  background-position: top center;
}

.bubble {
  padding: 20px 20px;
  border-radius: 20px;
  position: relative;
  box-sizing: border-box;
  flex-shrink: 0;
  font-size: 15px;
  background: #ffffff;
  border: 1px solid #ffffff;
  color: #725e47;
  font-weight: 600;
}

.bubble:after,
.bubble:before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-top-color: #ffffff;
  left: 45%;
  margin-left: 0px;
  bottom: -20px;
}

.bubble:after {
  border-top-color: #ffffff;
  bottom: -20px;
}

.bubble-img {
  padding: 20px 20px;
  border-radius: 20px;
  position: relative;
  box-sizing: border-box;
  flex-shrink: 0;
  font-size: 15px;
  border: 1px solid #dfeffc;
  color: #725e47;
  background: #dfeffc;
  font-weight: 600;
}

.bubble-img:after,
.bubble-img:before {
  /* content: "";
  position: absolute;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-top-color: #ffffff;
  left: 45%;
  margin-left: 0px; */
  /* bottom: -20px; */
}

/* .bubble-img:after {
  border-top-color: #ffffff;
  bottom: -20px;
} */

button {
  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.98);
}
</style>
