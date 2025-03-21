import type { Router } from "vue-router"
import { useUserStore } from "@/pinia/user"
// import { waitForDebugger } from "inspector/promises"

// import NProgress from "nprogress"

// NProgress.configure({ showSpinner: false })

// const { setTitle } = useTitle()

export function registerNavigationGuard(router: Router) {
  // 全局前置守卫
  router.beforeEach((to, from, next) => {
    // NProgress.start()
    const userStore = useUserStore()

    console.log(to.path, "to.path---beforeEach")
    console.log(from.path)
    // 如果已经登录，并准备进入 Login 页面，则重定向到主页

    if (from.path === "/finished" && to.path === "/" && !userStore.regenerateBtnFlag) {
      // 单纯返回
      userStore.generatedPixImgFlag = false
      userStore.resultLastImgFlag = false
      userStore.regenerateBtnFlag = false
      userStore.currentUploadImg = ""
      userStore.aiGeneratedPixImg = ""

      // 清空当前的oss的文件对象
      userStore.addImgArtifactParam = {
        type: 0
      }
    }
    if (from.path === "/finished" && to.path === "/" && userStore.regenerateBtnFlag) {
      // next({ name: 'index' })
      // 再次生成的逻辑，再次生成的标记：regenerateBtnFlag，这里生成中页面
      // 重新生成的逻辑，重新生成的标记：resultLastImgFlag，这里生成中页面
      debugger
      userStore.generatedPixImgFlag = true
      userStore.resultLastImgFlag = false
      userStore.regenerateBtnFlag = false
    }

    next()
  })
  // 全局后置钩子
  router.afterEach((to, from) => {
    const userStore = useUserStore()

    console.log(to.path, "to.path-----afterEach")
    console.log(from.path, "param")
  })
}
