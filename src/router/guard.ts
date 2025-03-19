import type { Router } from "vue-router"

// import { waitForDebugger } from "inspector/promises"

// import NProgress from "nprogress"

// NProgress.configure({ showSpinner: false })

// const { setTitle } = useTitle()

const LOGIN_PATH = "/login"

export function registerNavigationGuard(router: Router) {
  // 全局前置守卫
  router.beforeEach((to, _from) => {
    // NProgress.start()
    debugger
    console.log(to.path, "to.path---beforeEach")
    // 如果已经登录，并准备进入 Login 页面，则重定向到主页
  })
  // 全局后置钩子
  router.afterEach((to) => {
    debugger
    console.log(to.path, "to.path-----afterEach")
    console.log(to)
  })
}
