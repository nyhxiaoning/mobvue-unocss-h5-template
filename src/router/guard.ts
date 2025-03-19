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
    debugger
    if (from.path === "/finished" && to.path === "/" && !userStore.generateBtnFlag) {
      // next({ name: 'index' })
      userStore.generatedPixImgFlag = false
      userStore.resultLastImgFlag = false
      userStore.generateBtnFlag = false
    }
    if (from.path === "/finished" && to.path === "/" && userStore.generateBtnFlag) {
      // next({ name: 'index' })
      userStore.generatedPixImgFlag = true
      userStore.resultLastImgFlag = false
      userStore.generateBtnFlag = false
    }

    debugger
    next()
  })
  // 全局后置钩子
  router.afterEach((to, from) => {
    const userStore = useUserStore()

    console.log(to.path, "to.path-----afterEach")
    console.log(from.path, "param")
  })
}
