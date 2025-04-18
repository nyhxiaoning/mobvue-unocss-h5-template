<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<script lang="ts" setup>
import { createOssClient, uploadFileToOss } from "@/common/utils/oss"
import { convertImageToRGB565Blob, requestFileUploadTokenPromise } from "@/common/utils/tools"
// import { requestFileUploadTokenPromise } from "@/common/utils/tools"
import { useUserStore } from "@/pinia/user"
import { showToast } from "vant"
import { computed, ref, watch } from "vue"

// Props
const props = defineProps({
  // modelValue: Array, // 用于 v-model 绑定 fileList
  checkAiFlag: Boolean,
  customSize: {
    type: Object,
    default: () => ({ width: 150, height: 150 })
  }
})
declare const JeeWeb: any
const userStore = useUserStore()
const checked = ref(props.checkAiFlag)
// const localFileList = ref([userStore.currentUploadImg] || []) as any // 维护本地 fileList
const tmToken: string = "677fb12b-646d-41b2-9149-9933de02b9d7"

const localFileList = computed(() => {
  if (userStore.currentUploadImg) {
    return [{ url: userStore.currentUploadImg }]
  } else {
    return []
  }
})
// 监听外部传入的 fileList 变化
// watch(
//   () => props.modelValue,
//   (newVal) => {
//     localFileList.value = newVal
//   }
// )

watch(checked, (newVal) => {
  console.log(newVal, "checked------")
  if (newVal) {
    console.log(checked.value, "tab2AiFlag")
    userStore.tab2AiFlag = true
  } else {
    console.log(checked.value, "tab2AiFlag")
    userStore.tab2AiFlag = false
  }
})

// 上传前检查文件
// 添加获取本地化文本的函数
function getLocalizedText(zhText: string, enText: string) {
  return JeeWeb?.Language === "zh-CN" ? zhText : enText
}

function beforeRead(file: any) {
  if (file?.type.indexOf("image") === -1) {
    showToast(getLocalizedText("请上传图片文件", "Please upload an image file"))
    return false
  }
  if (file.size > 1024 * 1024 * 10) {
    showToast(getLocalizedText("图片太大，请重新上传", "The picture is too big, please upload it again"))
    return false
  }
  return true
}

async function handleUpload(fileObj: any) {
  const files = fileObj.file
  console.log(files, "files")
  if (!files) return
  const rbg565blob = await convertImageToRGB565Blob(files, 32, 16)
  const currentToken = await requestFileUploadTokenPromise() as string
  const ossObj = await createOssClient(7, currentToken)// 创建 OSS 客户端
  const ossResult = await uploadFileToOss(ossObj, files, 7) as any
  const ossObjBin = await createOssClient(9, currentToken)// 创建 OSS 客户端
  const ossResultBin = await uploadFileToOss(ossObjBin, files, 9) as any
  userStore.currentUploadImg = ossResult.fileUrl
  userStore.enableBtnflag = true

  userStore.addImgArtifactParam = {
    cover: ossResult.fileUrl,
    fileUrl: ossResult.fileUrl,
    fileSize: ossResult.fileSize,
    binFileUrl: ossResultBin.fileUrl,
    binSize: ossResultBin.fileSize,
    type: 0
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    userStore.currentUploadImg = e.target?.result as string
    // localFileList.value = [{ url: e.target?.result }]
    // emit("update:modelValue", localFileList.value) // 更新父组件的 fileList
  }
  reader.readAsDataURL(files)
}

// 删除图片
function removeImage() {
  userStore.currentUploadImg = ""
  userStore.enableBtnflag = false
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
            <!-- <span class="text-[13px] text-gray-600 mr-2">{{ getLocalizedText('AI 魔法效果', 'AI Magic Effect') }}</span>
            <van-switch v-model="checked" size="13px" /> -->
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
