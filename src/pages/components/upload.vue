<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<script lang="ts" setup>
import { createOssClient, uploadFileToOss } from "@/common/utils/oss"
import {
  convertImageToRGB565Blob,
  requestFileUploadTokenPromise
} from "@/common/utils/tools"
// import { requestFileUploadTokenPromise } from "@/common/utils/tools"
import { useUserStore } from "@/pinia/user"
import { showToast } from "vant"
import { computed, ref, watch } from "vue"
import VuePictureCropper, { cropper } from "vue-picture-cropper"
import { getLocales } from "./live-demo"

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

const uploadInput = ref<HTMLInputElement | null>(null)
const pic = ref<string>("")

const isShowModal = ref<boolean>(false)

const result = reactive({
  dataURL: "",
  blobURL: ""
})
const locales = getLocales()
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
  return JeeWeb.Language === "zh-CN" ? zhText : enText
}

function beforeRead(file: any) {
  if (file?.type.indexOf("image") === -1) {
    showToast(getLocalizedText("请上传图片文件", "Please upload an image file"))
    return false
  }
  if (file.size > 1024 * 1024 * 10) {
    showToast(getLocalizedText("上传图片过大", "Uploaded image is too large"))
    return false
  }
  return true
}

async function handleUpload(fileObj: any) {
  const files = fileObj.file
  console.log(files, "files")
  if (!files) return
  const rbg565blob = await convertImageToRGB565Blob(files, 32, 16)
  const currentToken = (await requestFileUploadTokenPromise()) as string
  const ossObj = await createOssClient(7, currentToken) // 创建 OSS 客户端
  const ossResult = (await uploadFileToOss(ossObj, files, 7)) as any
  const ossObjBin = await createOssClient(9, currentToken) // 创建 OSS 客户端
  const ossResultBin = (await uploadFileToOss(ossObjBin, files, 9)) as any
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
    isShowModal.value = true
    // localFileList.value = [{ url: e.target?.result }]
    // emit("update:modelValue", localFileList.value) // 更新父组件的 fileList
  }

  reader.readAsDataURL(files)
}

// 删除图片
function removeImage() {
  userStore.currentUploadImg = ""
  userStore.enableBtnflag = false
}

function ready() {
  console.log("Cropper is ready.")
}

/**
 * Get cropping results
 */
async function getResult() {
  if (!cropper) return
  const base64 = cropper.getDataURL()
  const blob: Blob | null = await cropper.getBlob()
  if (!blob) return

  const file = await cropper!.getFile({
    fileName: locales.fileName
  })

  console.log({ base64, blob, file })
  result.dataURL = base64
  result.blobURL = URL.createObjectURL(blob)
  // TODO:如何将这个对象放到img标签上面
  isShowModal.value = false
}

/**
 * Clear the crop box
 */
function clear() {
  if (!cropper) return
  cropper.clear()
}

/**
 * Reset the default cropping area
 */
function reset() {
  if (!cropper) return
  cropper.reset()
}

/**
 * Select the picture to be cropped
 */
function selectFile(file: any) {
  // Reset last selection and results
  // pic.value = ""
  // result.dataURL = ""
  // result.blobURL = ""

  // // Get selected files
  // const { files } = e.target as HTMLInputElement
  // if (!files || !files.length) return

  // Convert to dataURL and pass to the cropper component
  // const file = files[0]
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    // Update the picture source of the `img` prop
    pic.value = String(reader.result)
    // localFileList.value = [{ url: pic.value }]
    userStore.currentUploadImg = pic.value
    // Show the modal
    isShowModal.value = true

    // Clear selected files of input element
    if (!uploadInput.value) return
    uploadInput.value.value = ""
  }

  return false
}

// 控制上传按钮是否显示
const isUploaderVisible = computed(() => localFileList.value.length === 0)
</script>

<template>
  <div>
    <!-- 顶部导航栏 -->
    <!-- <vuePictrueCropper /> -->
    <!-- 主要内容区域 -->
    <main>
      <!-- 图片上传区域 -->
      <div class="mb-2 pt-0">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-600 font-700">{{
            getLocalizedText("图片", "Image")
          }}</span>
          <div class="flex items-center">
            <span class="text-[13px] text-gray-600 mr-2">{{
              getLocalizedText("AI 魔法效果", "AI Magic Effect")
            }}</span>
            <van-switch v-model="checked" size="13px" />
          </div>
        </div>
        <div

          :class="isUploaderVisible ? 'p-10' : ''"
          class="border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center bg-[#D9D9D90F]"
        >
          <div class="flex items-center" v-if="!isShowModal">
            <van-uploader
              :before-read="selectFile"
              v-model="localFileList"
              :max-count="1"
              :after-read="handleUpload"
              v-show="isUploaderVisible"
            >
              <van-button
                class="p-1 bg-[#D9D9D90F] mr-2 text-black border-none"
                icon="plus"
                type="primary"
              >
                {{ getLocalizedText("添加图片", "Add Image") }}
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
              :src="localFileList[0]?.url"
              class="rounded-md shadow-md"
              :style="{ width: '300px', height: '150px' }"
              :alt="getLocalizedText('已上传图片', 'Uploaded Image')"
            >
          </div>
        </div>
      </div>

      <van-dialog v-model:show="isShowModal" title="图片裁剪" close-dialog="isShowModal = false" @confirm="getResult()">
        <!-- 图片裁剪区域 -->
        <div class="modal">
          <div class="modal-content">
            <!-- The component imported from `vue-picture-cropper` plugin -->
            <VuePictureCropper
              :box-style="{
                width: '100%',
                height: '60vh',
                backgroundColor: '#f8f8f8',
                margin: 'auto',
              }"
              :img="pic"
              :options="{
                viewMode: 1,
                dragMode: 'move',
                aspectRatio: 16 / 8,
                cropBoxResizable: false,
              }"
            />
          </div>
        </div>
      </van-dialog>
    </main>
  </div>
</template>

<style scoped>
img {
  width: 100px;
  height: 100px;
}
</style>
