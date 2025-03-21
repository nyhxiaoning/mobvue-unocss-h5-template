declare const CupDevice: any
declare const JeeWeb: any

async function resampleStaticImage(imageFile: any, targetWidth: any, targetHeight: any) {
  const response = await fetch(imageFile)
  if (!response.ok) {
    throw new Error(`请求失败，状态码: ${response.status}`)
  }
  // 将响应数据转换为 Blob 对象
  const blob = await response.blob()
  // 为 Blob 对象生成对象 URL
  const objectUrl = URL.createObjectURL(blob)
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = async () => {
      const canvas = document.createElement("canvas")
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext("2d")!

      // 使用双线性插值进行重采样
      ctx.imageSmoothingEnabled = true
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

      // 获取图像数据并转换为 RGB565 格式存储在数组中
      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight)
      const pixels = imageData.data
      const rgb565Array: any = []
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        const rgb565Value = ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3)
        // rgb565Array.push(rgb565Value);
        rgb565Array.push(`0x${rgb565Value.toString(16)}`)
      }

      // 将结果转换为 Blob，使用 png 格式
      canvas.toBlob(
        (blob) => {
          resolve({ blob, rgb565Array })
        },
        "image/png",
        0.9
      )
    }
    img.onerror = reject

    img.src = URL.createObjectURL(imageFile)
  })
}

async function resampleStaticUrlImage(imageFile: string, targetWidth: number, targetHeight: number) {
  const response = await fetch(imageFile)
  if (!response.ok) {
    throw new Error(`url transform blob failed`)
  }
  // 将响应数据转换为 Blob 对象
  const blob = await response.blob()
  // 为 Blob 对象生成对象 URL
  const objectUrl = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = async () => {
      const canvas = document.createElement("canvas")
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Canvas 2D context cannot be obtained"))
        return
      }

      // 使用双线性插值进行重采样
      ctx.imageSmoothingEnabled = true
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

      // 获取图像数据并转换为 RGB565 格式存储在数组中
      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight)
      const pixels = imageData.data
      const rgb565Array = [] as any
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        const rgb565Value = ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3)
        rgb565Array.push(`0x${rgb565Value.toString(16)}`)
      }

      // 将结果转换为 Blob，使用 png 格式
      canvas.toBlob(
        (blob) => {
          resolve({ blob, rgb565Array })
        },
        "image/png",
        0.9
      )
    }
    img.onerror = () => {
      reject(new Error("rbg565 image format conversion failed"))
    }

    img.src = objectUrl
  })
}

function requestFileUploadTokenPromise() {
  return new Promise((resolve, reject) => {
    JeeWeb && JeeWeb.requestFileUploadToken((result: any) => {
      if (result && result.result.token) {
        resolve(result.result.token)
      } else {
        reject(new Error("jeeweb token get failed"))
      }
    })
  })
}

/**
 *
 * @param imageFile 上传文件对象
 * @param targetWidth
 * @param targetHeight
 * @returns
 */
async function convertImageToRGB565Blob(imageFile: any, targetWidth = 32, targetHeight = 16) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Failed to get 2D context"))
        return
      }
      ctx.imageSmoothingEnabled = true
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight)
      const pixels = imageData.data
      const byteArray = new Uint8Array(targetWidth * targetHeight * 2)
      for (let i = 0, j = 0; i < pixels.length; i += 4, j += 2) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        const rgb565Value = ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3)

        byteArray[j] = (rgb565Value >>> 8) & 0xFF
        byteArray[j + 1] = rgb565Value & 0xFF
      }
      const blob = new Blob([byteArray], { type: "application/octet-stream" })
      resolve(blob)
    }

    img.onerror = () => reject(new Error("Image loading failed"))
    img.src = URL.createObjectURL(imageFile)
  })
}

/**
 *
 * @param url 当前的url文件对象
 * @returns 文件file对象
 */
async function urlTranfromFile(url: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`请求失败，状态码: ${response.status}`)
  }
  const blob = await response.blob()
  // 从 Blob 对象创建 File 对象
  const fileName = "downloaded_file.pdf" // 可以根据实际情况设置文件名
  const file = new File([blob], fileName, { type: blob.type })

  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("file is null"))
    }
    resolve(file)
  })
}

export {
  convertImageToRGB565Blob,
  requestFileUploadTokenPromise,
  resampleStaticImage,
  resampleStaticUrlImage,
  urlTranfromFile
}
