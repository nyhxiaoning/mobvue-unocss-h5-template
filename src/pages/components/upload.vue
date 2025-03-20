<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<script lang="ts" setup>
import { requestFileUploadTokenPromise } from "@/common/utils/tools"
import { uploadImg } from "@/http/userApi.ts"
import { useUserStore } from "@/pinia/user"
import { showToast } from "vant"
import { computed, ref, watch } from "vue"

// Props
const props = defineProps({
  modelValue: Array, // 用于 v-model 绑定 fileList
  customSize: {
    type: Object,
    default: () => ({ width: 150, height: 150 })
  }
})
const emit = defineEmits(["update:modelValue"])

declare const JeeWeb: any

const userStore = useUserStore()
// 用于 v-model 事件

const checked = ref(false)
const localFileList = ref(props.modelValue || []) as any // 维护本地 fileList
const tmToken: string = "677fb12b-646d-41b2-9149-9933de02b9d7"

// 监听外部传入的 fileList 变化
watch(
  () => props.modelValue,
  (newVal) => {
    localFileList.value = newVal
  }
)

watch(checked, (newVal) => {
  if (newVal) {
    console.log(checked.value)
    userStore.tab2AiFlag = true
  } else {
    console.log(checked.value)
    userStore.tab2AiFlag = false
  }
})

// 上传前检查文件
// 添加获取本地化文本的函数
function getLocalizedText(zhText: string, enText: string) {
  return JeeWeb.Language === "zh-CN" ? zhText : enText
}

function beforeRead(file: any) {
  if (file?.type.indexOf("image") === -1) {
    showToast(getLocalizedText("请上传图片文件", "Please upload an image file"))
    return false
  }
  if (file.size > 1024 * 1024 * 2) {
    showToast(getLocalizedText("上传图片过大", "Uploaded image is too large"))
    return false
  }
  return true
}

// 处理上传
async function handleUpload(fileObj: any) {
  const file = fileObj.file
  console.log(file, "file")

  if (!file) return
  const formData = new FormData()
  const currentToken = await requestFileUploadTokenPromise() as string
  console.log(currentToken, "currentToken---handleUpload")
  formData.append("file", fileObj.file as any)
  formData.append("token", currentToken)
  // 发起请求
  /** 登录并返回 Token */
  await uploadImg(formData).then((res: any) => {
    if (res.code === 200) {
      userStore.currentUploadImg = res.result?.oriFileUrl
      userStore.enableBtnflag = true
    }
  }).catch((err) => {
    console.log(err)
    showToast(getLocalizedText("上传失败", "Upload failed"))
  })

  const reader = new FileReader()
  reader.onload = (e) => {
    localFileList.value = [{ url: e.target?.result }]
    emit("update:modelValue", localFileList.value) // 更新父组件的 fileList
  }
  reader.readAsDataURL(file)
}

// 删除图片
function removeImage() {
  localFileList.value = []
  userStore.currentUploadImg = ""
  userStore.enableBtnflag = false
  emit("update:modelValue", []) // 同步更新父组件
};

// 控制上传按钮是否显示
const isUploaderVisible = computed(() => localFileList.value.length === 0)
</script>

<template>
  <div>
    <!-- 主要内容区域 -->
    <main>
      <!-- 图片上传区域 -->
      <div class="mb-2 pt-0">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-600 font-700">{{ getLocalizedText('图片', 'Image') }}</span>
          <div class="flex items-center">
            <span class="text-[13px] text-gray-600 mr-2">{{ getLocalizedText('AI 魔法效果', 'AI Magic Effect') }}</span>
            <van-switch v-model="checked" size="13px" />
          </div>
        </div>
        <div
          :class="isUploaderVisible ? 'p-10' : ''"
          class="border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center bg-[#D9D9D90F]"
        >
          <div class="flex items-center">
            <van-uploader
              :before-read="beforeRead" v-model="localFileList" :max-count="1" :after-read="handleUpload"
              v-show="isUploaderVisible"
            >
              <van-button class="p-1 bg-[#D9D9D90F] mr-2 text-black border-none" icon="plus" type="primary">
                {{ getLocalizedText('添加图片', 'Add Image') }}
              </van-button>
            </van-uploader>
          </div>
          <div v-if="localFileList.length > 0" class="image-preview relative">
            <button
              @click="removeImage"
              class="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-80 transition"
            >
              ✕
            </button>
            <img
              :src="localFileList[0].url" class="rounded-md shadow-md" :style="{ width: '300px', height: '150px' }"
              :alt="getLocalizedText('已上传图片', 'Uploaded Image')"
            >
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
img {
  width: 100px;
  height: 100px;
}
</style>
