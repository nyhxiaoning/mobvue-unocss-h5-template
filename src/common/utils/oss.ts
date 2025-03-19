import OSS from "ali-oss"

class OssService {
  client: OSS
  constructor(region: string, accessKeyId: string, accessKeySecret: string, bucket: string) {
    this.client = new OSS({
      region,
      accessKeyId,
      accessKeySecret,
      bucket
    })
  }

  async uploadImage(file: any) {
    try {
      const fileName = `${Date.now()}.${file.name.split(".").pop().toLowerCase()}`
      const result = await this.client.put(fileName, file)
      return result.url
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async deleteImage(url: string) {
    try {
      const fileName = url.split("/").pop() as string
      await this.client.delete(fileName)
    } catch (err) {
      console.error(err)
    }
  }

  async updateImage(url: string, newFile: any) {
    try {
      await this.deleteImage(url)
      const newUrl = await this.uploadImage(newFile)
      return newUrl
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async getImage(url: any) {
    try {
      const fileName = url.split("/").pop()
      const result = await this.client.get(fileName)
      return result.content
    } catch (err) {
      console.error(err)
      return null
    }
  }
}

export default OssService
