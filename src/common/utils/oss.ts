import { getOssToken } from "@/http/userApi"
import OSS from "ali-oss"

/**
 *
 * @param type 7: 静态图，9: bin文件，这里不同的type，oss的path地址不一样
 * @param token 临时的token权限
 * @returns ossClient
 */
export async function createOssClient(type: number, token: string) {
  try {
    const datas = {
      type,
      token
    }

    const response = await getOssToken(datas) as any

    return new Promise((resolve, reject) => {
      if (response) {
        resolve({
          client: new OSS({
            region: "oss-cn-beijing", // TODO: 硬编码，这个地方到海外需要做调整，或者服务端添加参数
            accessKeyId: response.result.accessKeyId,
            accessKeySecret: response.result.accessKeySecret,
            stsToken: response.result.token,
            bucket: response.result.bucketName
          }),
          path: response.result.path,
          fullPath: response.result.fullPath
        })
      } else {
        reject("oss response error")
      }
    })
  } catch (err: any) {
    console.error("get oss error", err)
    throw new Error(err)
  }
}

/**
 * 上传文件到oss
 * @param ossConfig oss配置
 * @param file 文件对象
 * @param type 7: 静态图，9: bin文件
 * @returns Promise
 */
export function uploadFileToOss(ossConfig: any, file: any) {
  return new Promise((resolve, reject) => {
    try {
      const ossFileName = `${ossConfig.path}/${file.name}`
      // TODO:这里的oss的文件对象
      ossConfig.client
        .put(ossFileName, file, {})
        .then((uploadResponse: any) => {
          debugger
          console.log(uploadResponse, "createOssClient---uploadResponse")
          resolve({
            fileUrl: `${ossConfig.fullPath}/${file.name}`,
            fileSize: file.size
          })
        })
        .catch((err: any) => {
          reject(("uploadService.uploadError2"))
        })
    } catch (err) {
      console.error("上传失败:", err)
      throw new Error(("uploadService.uploadError4"))
    }
  })
}
