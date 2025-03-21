import { request } from "@/http/axios"

interface AddArtifactParam {
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

/**
 * oss上传功能api接口相关
 */
export function addArtifact<T>(data: AddArtifactParam): Promise<T> {
  return request({
    method: "post",
    url: "/im/cup/artifact",
    data
  })
}

// /im/cup/artifact/sts/token

export function getOssToken<T>(data: any): Promise<T> {
  return request({
    method: "post",
    url: "/im/cup/artifact/sts/token",
    data
  })
}
