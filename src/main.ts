/* eslint-disable perfectionist/sort-imports */

// core
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import { router } from "@/router"
import { installPlugins } from "@/plugins"
import App from "@/App.vue"
// import Vue3Lottie from "vue3-lottie"

// vant
import "@vant/touch-emulator"
// css
import "normalize.css"
import "nprogress/nprogress.css"
import "@@/assets/styles/index.css"
import "virtual:uno.css"
import "vant/lib/index.css"
import "./main.css"

declare const JeeWeb: any

if (JeeWeb && JeeWeb.Language === "zh-CN") {
  document.title = "AI像素图"
} else {
  document.title = "AI pixel map"
}

// 创建应用实例
const app = createApp(App)

// 安装插件（全局组件、自定义指令等）
installPlugins()
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
// 安装 pinia 和 router and lottie
app.use(pinia).use(router)

// router 准备就绪后挂载应用
router.isReady().then(() => {
  app.mount("#app")
})
