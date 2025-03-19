import WebAudioSpeechRecognizer from "./webaudiospeechrecognizer"
/**
 * 语音录入识别客户端
 */
class Recorder {
  /**
   * 初始化语音采集和识别
   */
  initWebAsr(config) {
    console.log("初始化语音采集和识别", config)
    // 实例化配置
    const params = {
      secretkey: config.tmpSecretKey,
      secretid: config.tmpSecretId,
      token: config.token,
      appid: config.appId,
      // 引擎模型类型。 6k_zh：16k 中文普通话通用；
      engine_model_type: "16k_zh",
      // 语音编码方式，可选，默认值为4。1：pcm；4：speex(sp)；6：silk；8：mp3；10：opus（opus 格式音频流封装说明）；12：wav；14：m4a（每个分片须是一个完整的 m4a 音频）；16：aac。
      voice_format: 1,
      // 热词 id。用于调用对应的热词表，如果在调用语音识别服务时，不进行单独的热词 id 设置，自动生效默认热词；如果进行了单独的热词 id 设置，那么将生效单独设置的热词 id。
      // hotword_id: '5cc8bf3eacbe11ecb074446a2eb5fd98',
      // 自学习模型 id。用于调用对应的自学习模型
      // customization_id: 'c12f7760acc411ecb074446a2eb5fd98',
      // 0：关闭 vad，1：开启 vad。如果语音分片长度超过60秒，用户需开启 vad（人声检测切分功能）
      needvad: 1,
      // 是否过滤脏词（目前支持中文普通话引擎）。默认为0。0：不过滤脏词；1：过滤脏词；2：将脏词替换为 * 。
      filter_dirty: 1,
      // 是否过语气词（目前支持中文普通话引擎）。默认为0。0：不过滤语气词；1：部分过滤；2：严格过滤 。
      filter_modal: 1,
      // 是否过滤句末的句号（目前支持中文普通话引擎）。默认为0。0：不过滤句末的句号；1：过滤句末的句号。
      filter_punc: 1,
      // 是否进行阿拉伯数字智能转换（目前支持中文普通话引擎）。0：不转换，直接输出中文数字，1：根据场景智能转换为阿拉伯数字，3: 打开数学相关数字转换。默认值为1。
      convert_num_mode: 1,
      // 是否显示词级别时间戳。0：不显示；1：显示，不包含标点时间戳，2：显示，包含标点时间戳
      word_info: 2
    }
    const webAudioSpeechRecognizer = new WebAudioSpeechRecognizer(params)
    console.log("初始化", webAudioSpeechRecognizer)
    // 开始识别(此时连接已经建立)
    webAudioSpeechRecognizer.OnRecognitionStart = (res) => {
      console.log("开始识别", res)
      if (this.audioAnalyserCallback) {
        const analyser = webAudioSpeechRecognizer.getAnalyser()
        this.audioAnalyserCallback({ analyser })
      }
    }
    // 一句话开始
    webAudioSpeechRecognizer.OnSentenceBegin = (res) => {
      console.log("一句话开始", res)
      // 开始说话就先中断语音播报
      // this.sendStopInstruct()
      if (this.audioInputCallback) {
        // sliceType 0：一段话开始识别；1：一段话识别中; 2：一段话识别结束
        this.audioInputCallback({ sliceType: 0, voiceText: "" })
      }
    }
    // 识别变化时
    webAudioSpeechRecognizer.OnRecognitionResultChange = (res) => {
      console.log("识别变化时", res)
      const { slice_type: sliceType, voice_text_str: voiceText } = res
      if (this.audioInputCallback) {
        // sliceType 0：一段话开始识别；1：一段话识别中; 2：一段话识别结束
        this.audioInputCallback({ sliceType, voiceText })
      }
    }
    // 一句话结束
    webAudioSpeechRecognizer.OnSentenceEnd = (res) => {
      console.log("一句话结束", res)
      const { slice_type: sliceType, voice_text_str: voiceText } = res
      // 识别结果类型，0：一段话开始识别；1：一段话识别中，voice_text_str 为非稳态结果(该段识别结果还可能变化) ；2：一段话识别结束，voice_text_str 为稳态结果(该段识别结果不再变化)。
      if (sliceType === 2 && voiceText) {
        if (this.audioInputCallback) {
          // sliceType 0：一段话开始识别；1：一段话识别中; 2：一段话识别结束
          this.audioInputCallback({ sliceType: 2, voiceText })
        }
        // if (!this.tcgClient) {
        //   console.error('init TcgClient first:>> ')
        // }
        // this.tcgClient.sendVoiceTextInstruct(voiceText, '', this.voiceTextInstructCb)
      }
    }
    // 识别结束
    webAudioSpeechRecognizer.OnRecognitionComplete = (res) => {
      if (this.audioDoneCallback) {
        this.audioDoneCallback()
      }
      console.log("识别结束", res)
    }
    // 识别错误
    webAudioSpeechRecognizer.OnError = (res) => {
      // if (this.audioDoneCallback) {
      //   this.audioDoneCallback()
      // }
      console.log("识别失败", res)
    }

    this.webAudioSpeechRecognizer = webAudioSpeechRecognizer
  }

  /**
   * 开始语音采集和识别
   */
  startWebAsr(config) {
    this.initWebAsr(config)
    // 建立录音同时建立websocket连接
    if (this.webAudioSpeechRecognizer) {
      this.webAudioSpeechRecognizer.start()
    } else {
      console.error("do not init WebAsr")
    }
  }

  /**
   * 停止语音采集和识别
   */
  stopWebAsr() {
    if (this.webAudioSpeechRecognizer) {
      this.webAudioSpeechRecognizer.stop()
    } else {
      // console.error('do not init WebAsr')
    }
  }

  /**
   * 设置语音输入监听回调
   */
  setAudioInputCallback(audioInputCallback) {
    this.audioInputCallback = audioInputCallback
  }

  /**
   * 设置语音识别结束回调
   */
  setAudioDoneCallback(audioDoneCallback) {
    this.audioDoneCallback = audioDoneCallback
  }

  /**
   * 设置语音识别失败
   */
  setAudioErrorCallback(audioErrorCallback) {
    this.audioErrorCallback = audioErrorCallback
  }

  /**
   * 设置预料接口返回数据
   */
  // setVoiceTextInstructCb(cd) {
  //   this.voiceTextInstructCb = cd
  // }

  /**
   * 设置获取频谱分析器回调
   */
  setAudioAnalyserCallback(audioAnalyserCallback) {
    this.audioAnalyserCallback = audioAnalyserCallback
  }

  /**
   * 获取分析器节点
   */
  getAnalyser() {
    return this.webAudioSpeechRecognizer.getAnalyser()
  }
}
const recorder = new Recorder()
export default recorder
