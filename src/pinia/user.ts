import { defineStore } from "pinia"

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
    regenerateBtnFlag: false

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
