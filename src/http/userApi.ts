import { request } from "@/http/axios"

/** 提交图片 */
// export function getCaptchaApi() {
//   return request<Auth.CaptchaResponseData>({
//     url: "auth/captcha",
//     method: "get"
//   })
// }

/** 登录并返回 Token */
// export function uploadImgApi(data: any) {
//   return request<Auth.LoginResponseData>({
//     url: "auth/login",
//     method: "post",
//     data
//   })
// }

export async function uploadImg(data: any) {
  return request({
    method: "post",
    url: "/im/cup/file",
    data,
    headers: { "Content-Type": "multipart/form-data" }
  })
}

export async function artifactStsToken(data: any) {
  // dev环境
  return request({
    method: "post",
    url: "/im/cup/artifact/sts/token",
    data
  })
}
