import { defineStore } from "pinia"

interface AddImgArtifactParam {
  fileUrl?: string
  // 源文件大小
  fileSize?: number
  // 二进制文件地址
  binFileUrl?: string
  // 二进制文件大小1024
  binSize?: number
  // 作品类型 0:静态图 1:动图 2:涂鸦
  type: number
  // 封面
  cover?: string
  token?: string
}

export const useUserStore = defineStore("user", {
  state: () => ({
    tabNum: 1, // 1: 文字生成 2: 图片生成
    tab2AiFlag: false,
    count: 0,
    message: "Hello, Pinia!",
    currentText: "",
    localImg: "",
    currentUploadImg: "",
    aiGeneratedPixImg: "",
    pixImgBin: "",
    generatedPixImgFlag: false,
    // 最后一个页面标记
    resultLastImgFlag: false,
    enableBtnflag: false,
    regenerateBtnFlag: false,
    // 全局使用：最后保存到 水杯图库
    addImgArtifactParam: {
      type: 0
    } as AddImgArtifactParam

  }),
  getters: {
    doubleCount: state => state.count * 2
  },
  actions: {
    increment() {
      this.count = this.count + 10
    },
    decrement() {
      this.count = this.count - 10
    },
    setCurrentUploadImg(param: any) {
      this.currentUploadImg = param
    },
    setGeneratedPixImgFlag(param: boolean) {
      this.generatedPixImgFlag = param
    }
  },
  // 配置持久化
  persist: [
    {
      key: "user-store",
      storage: sessionStorage
    }
  ]
})
