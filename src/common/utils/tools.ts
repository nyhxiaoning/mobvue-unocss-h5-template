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

export {
  requestFileUploadTokenPromise,
  resampleStaticImage,
  resampleStaticUrlImage
}
