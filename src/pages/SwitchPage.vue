<template>
  <div class="system-settings">
    <van-loading
      v-if="settings.globalSwitchLoading"
      class="global-loading"
      type="spinner"
      color="#fff"
      text="..."
    ></van-loading>
    <van-cell-group inset>
      <van-cell center :title="language.enableSwitch" inset>
        <template #right-icon>
          <van-switch v-model="settings.isSwipe" @change="handleSwitchisSwipe" />
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group :title="language.displayApps" inset>
      <van-cell :title="language.clock" center> </van-cell>
      <van-cell :title="language.deviceInfo" center> </van-cell>
      <van-cell :title="language.screensaver" center>
        <!-- <template #right-icon>
                    <van-switch v-model="settings.HomeGIF"  @change="handleSwitchisSwipe"      />
                </template> -->
      </van-cell>
      <van-cell :title="language.weather" center>
        <template #right-icon>
          <van-switch
            v-model="settings.HomeWeather"
            :disabled="!settings.isSwipe"
            @change="handleSwitchisSwipe"
          />
        </template>
      </van-cell>
      <van-cell :title="language.ballGame" center>
        <template #right-icon>
          <van-switch
            v-model="settings.HomeFreeFallIcon"
            :disabled="!settings.isSwipe"
            @change="handleSwitchisSwipe"
          />
        </template>
      </van-cell>
      <van-cell :title="language.slotGame" center>
        <template #right-icon>
          <van-switch
            v-model="settings.homeTigerGame"
            :disabled="!settings.isSwipe"
            @change="handleSwitchisSwipe"
          />
        </template>
      </van-cell>
      <van-cell :title="language.shakeEffect" center>
        <template #right-icon>
          <van-switch
            v-model="settings.HomeWaterShak"
            :disabled="!settings.isSwipe"
            @change="handleSwitchisSwipe"
          />
        </template>
      </van-cell>
      <van-cell :title="language.darkEmpire" center>
        <template #right-icon>
          <van-switch
            v-model="settings.HomeCocos2"
            :disabled="!settings.isSwipe"
            @change="handleSwitchisSwipe"
          />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { showToast } from "vant";
/**
 * @description 设备相关的API
 * 说明：talSetHomeTaskParams 设置home任务列表配置参数
 * 0,1110000000
 *
 * 设置home任务列表配置参数
 * - value = "0,10101011"
 * - 0 表示是否允许切换应用
    - ，表示间隔符
    - 1 第0个任务可见
    - 0 第1个任务不可见
    - 1 第2个任务可见
    - 0 第3个任务不可见
    - 1 第4个任务可见
    - 0 第5个任务不可见
    - 1 第6个任务可见
    - 1 第7个任务可见
    应用顺序：
    时钟、设备信息、屏保三个默认常驻这个不能变化。

    其他的天气：
    - 天气
    - 落球游戏
    - 老虎机游戏
    - 摇晃水杯动效
    - 黑客帝国动效
 */
export default {
  data() {
    return {
      settings: {
        isSwipe: true,
        // 不要变：HomeClock和HomeInfo
        HomeClock: true,
        HomeInfo: true,

        HomeGIF: true,
        HomeWeather: true,
        HomeFreeFallIcon: true,
        homeTigerGame: true,
        HomeWaterShak: true,
        HomeCocos2: true,
        globalSwitchLoading: true,
      },
      language: {
        enableSwitch:
          JeeWeb.Language === "zh-CN" ? "开启切换应用" : "Enable App Switching",
        displayApps: JeeWeb.Language === "zh-CN" ? "水杯显示应用" : "App Display",
        clock: JeeWeb.Language === "zh-CN" ? "时钟" : "Clock",
        deviceInfo: JeeWeb.Language === "zh-CN" ? "设备信息" : "Device Info",
        screensaver: JeeWeb.Language === "zh-CN" ? "屏保" : "Screensaver",
        weather: JeeWeb.Language === "zh-CN" ? "天气" : "Weather",
        ballGame: JeeWeb.Language === "zh-CN" ? "落球游戏" : "Gravity",
        slotGame: JeeWeb.Language === "zh-CN" ? "老虎机游戏" : "Slot Machine",
        shakeEffect: JeeWeb.Language === "zh-CN" ? "摇晃水杯动效" : "Shake the cup",
        darkEmpire: JeeWeb.Language === "zh-CN" ? "黑幕帝国动效" : "Matrix",
      },
    };
  },
  created() {
    console.log("mounted---router");
    // 初始化时获取当前系统应用显示状态
    CupDevice.setDevMessage({
      value: {
        method: "talGetHomeTaskParams",
        params: {},
      },
    })
      .then((res) => {
        console.log("talGetHomeTaskParams", res, "响应结果");
        if (res && res.data) {
          let currentData = res.data.split(",");
          // 更新settings中的状态： isSwipe
          this.settings.isSwipe = currentData[0] === "1" ? true : false; //  res.data.isSwipe
          this.settings.HomeGIF = currentData[1][2] === "1" ? true : false;
          this.settings.HomeWeather = currentData[1][3] === "1" ? true : false;
          this.settings.HomeFreeFallIcon = currentData[1][4] === "1" ? true : false;
          this.settings.homeTigerGame = currentData[1][5] === "1" ? true : false;
          this.settings.HomeWaterShak = currentData[1][6] === "1" ? true : false;
          this.settings.HomeCocos2 = currentData[1][7] === "1" ? true : false;
        }
        this.settings.globalSwitchLoading = false;
      })
      .catch((err) => {
        console.log("获取应用显示状态失败:", err);
        setTimeout(() => {
          this.settings.globalSwitchLoading = false;
          this.showErrorToast();
        }, 1000);
      });
  },
  methods: {
    showErrorToast() {
      showToast(
        JeeWeb.Language === "zh-CN"
          ? "获取应用显示状态失败"
          : "Failed to get app display status"
      );
    },
    setShowErrorToast() {
      showToast(JeeWeb.Language === "zh-CN" ? "设置应用失败" : "Failed to set app error");
    },
    convertProperties() {
      let currentData = {
        isSwipe: this.settings.isSwipe,
        // 默认两项
        HomeInfo: true,
        HomeClock: true,
        // 可能废弃
        HomeGIF: true,
        HomeFreeFallIcon: this.settings.HomeFreeFallIcon,
        HomeWeather: this.settings.HomeWeather,
        homeTigerGame: this.settings.homeTigerGame,
        HomeCocos2: this.settings.HomeCocos2,
        HomeWaterShak: this.settings.HomeWaterShak,
      };
      console.log("当前数据:", currentData);
      let str = "";
      for (const key in currentData) {
        str += currentData[key] ? "1" : "0";
      }
      console.log("转换后的字符串:", str);
      let currentTempArr = str.split("");
      console.log("转换后的数组:", currentTempArr);
      currentTempArr[0] = currentTempArr[0] + ",";
      let resultTempArr = currentTempArr.join("");
      return resultTempArr;
    },

    handleSwitchisSwipe() {
      CupDevice.setDevMessage({
        value: {
          method: "talSetHomeTaskParams",
          params: {
            value: this.convertProperties(),
            // isSwipe: this.settings.isSwipe,
            // // 默认两项
            // HomeInfo: true,
            // HomeClock: true,
            // // 可能废弃
            // HomeGIF: true,
            // HomeFreeFallIcon: this.settings.HomeFreeFallIcon,
            // HomeWeather: this.settings.HomeWeather,
            // homeTigerGame: this.settings.homeTigerGame,
            // HomeCocos2: this.settings.HomeCocos2,
            // HomeWaterShak: this.settings.HomeWaterShak,
          },
        },
      })
        .then((res) => {
          console.log(res, "单个");
        })
        .catch((err) => {
          console.log(err);
          this.setShowErrorToast();
        });
    },
  },

  // watch: {
  //     'settings.isSwipe'(newVal) {
  //         if( this.settings.isSwipe ){
  //             CupDevice.setDevMessage({
  //                 value: {
  //                     method: 'setHomeAppsParams',
  //                     params: {
  //                         isSwipe: newVal,
  //                         // 默认两项
  //                         HomeInfo: true,
  //                         HomeClock: true,
  //                         // 可能废弃
  //                         HomeGIF: true,
  //                         HomeFreeFallIcon: newVal,
  //                         HomeWeather: newVal,
  //                         homeTigerGame: newVal,
  //                         HomeCocos2: newVal,
  //                         HomeWaterShak: newVal,
  //                     },
  //                 },
  //             })
  //                 .then((res) => {
  //                     console.log(res, '单个');
  //                 })
  //                 .catch((err) => {
  //                     console.log(err);
  //                     this.setShowErrorToast();
  //                 });
  //         }

  //     },
  //     'settings.HomeGIF'(newVal) {
  //         if (this.settings.isSwipe) {
  //             CupDevice.setDevMessage({
  //                 value: {
  //                     method: 'setHomeAppsParams',
  //                     params: {
  //                         isSwipe: this.settings.isSwipe,
  //                         // 默认两项
  //                         HomeInfo: true,
  //                         HomeClock: true,
  //                         // 可能废弃
  //                         HomeGIF: newVal,
  //                         HomeFreeFallIcon: this.settings.HomeFreeFallIcon,
  //                         HomeWeather: this.settings.HomeWeather,
  //                         homeTigerGame: this.settings.homeTigerGame,
  //                         HomeCocos2: this.settings.HomeCocos2,
  //                         HomeWaterShak: this.settings.HomeWaterShak,
  //                     },
  //                 },
  //             })
  //                 .then((res) => {
  //                     console.log(res, '单个');
  //                 })
  //                 .catch((err) => {
  //                     this.setShowErrorToast();
  //                 });
  //         }

  //     },
  //     'settings.HomeWeather'(newVal) {
  //         if (this.settings.isSwipe) {
  //             CupDevice.setDevMessage({
  //                 value: {
  //                     method: 'setHomeAppsParams',
  //                     params: {
  //                         isSwipe: this.settings.isSwipe,
  //                         // 默认两项
  //                         HomeInfo: true,
  //                         HomeClock: true,
  //                         // 可能废弃
  //                         HomeGIF: this.settings.HomeGIF,
  //                         HomeFreeFallIcon: this.settings.HomeFreeFallIcon,
  //                         HomeWeather: newVal,
  //                         homeTigerGame: this.settings.homeTigerGame,
  //                         HomeCocos2: this.settings.HomeCocos2,
  //                         HomeWaterShak: this.settings.HomeWaterShak,
  //                     },
  //                 },
  //             })
  //                 .then((res) => {
  //                     console.log(res, '单个');
  //                 })
  //                 .catch((err) => {

  //                     this.setShowErrorToast();
  //                 });
  //         }

  //     },
  //     'settings.HomeFreeFallIcon'(newVal) {
  //         CupDevice.setDevMessage({
  //             value: {
  //                 method: 'setHomeAppsParams',
  //                 params: {
  //                      isSwipe: this.settings.isSwipe,
  //                     // 默认两项
  //                     HomeInfo: true,
  //                     HomeClock: true,
  //                     // 可能废弃
  //                     HomeGIF: this.settings.HomeGIF,
  //                     HomeFreeFallIcon: newVal,
  //                     HomeWeather: this.settings.HomeWeather,
  //                     homeTigerGame: this.settings.homeTigerGame,
  //                     HomeCocos2: this.settings.HomeCocos2,
  //                     HomeWaterShak: this.settings.HomeWaterShak,
  //                 },
  //             },
  //         })
  //             .then((res) => {
  //                 console.log(res, '单个');
  //             })
  //             .catch((err) => {
  //                 console.log(err);
  //             });
  //     },
  //     'settings.homeTigerGame'(newVal) {
  //         // alert(`老虎机游戏: ${newVal}`);
  //         CupDevice.setDevMessage({
  //             value: {

  //                 method: 'setHomeAppsParams',
  //                 params: {
  //                      isSwipe: this.settings.isSwipe,
  //                     // 默认两项
  //                     HomeInfo: true,
  //                     HomeClock: true,
  //                     // 可能废弃
  //                     HomeGIF: this.settings.HomeGIF,
  //                     HomeFreeFallIcon: this.settings.HomeFreeFallIcon,
  //                     HomeWeather: this.settings.HomeWeather,
  //                     homeTigerGame: newVal,
  //                     HomeCocos2: this.settings.HomeCocos2,
  //                     HomeWaterShak: this.settings.HomeWaterShak,
  //                 },
  //             },
  //         })
  //             .then((res) => {
  //                 console.log(res, '单个');
  //             })
  //             .catch((err) => {
  //                 this.setShowErrorToast();
  //             });
  //     },
  //     'settings.HomeWaterShak'(newVal) {
  //         // alert(`摇晃水杯动效: ${newVal}`);
  //         CupDevice.setDevMessage({
  //             value: {
  //                 method: 'setHomeAppsParams',
  //                 params: {
  //                      isSwipe: this.settings.isSwipe,
  //                     // 默认两项
  //                     HomeInfo: true,
  //                     HomeClock: true,
  //                     // 可能废弃
  //                     HomeGIF: this.settings.HomeGIF,
  //                     HomeFreeFallIcon: this.settings.HomeFreeFallIcon,
  //                     HomeWeather: this.settings.HomeWeather,
  //                     homeTigerGame: this.settings.homeTigerGame,
  //                     HomeCocos2: this.settings.HomeCocos2,
  //                     HomeWaterShak: newVal,
  //                 },
  //             },
  //         })
  //             .then((res) => {
  //                 console.log(res, '单个');
  //             })
  //             .catch((err) => {
  //                 console.log(err);
  //                    this.setShowErrorToast();
  //             });
  //     },
  //     'settings.HomeCocos2'(newVal) {
  //         // alert(`黑幕帝国动效: ${newVal}`);
  //         CupDevice.setDevMessage({
  //             value: {
  //                 method: 'setHomeAppsParams',
  //                 params: {
  //                      isSwipe: this.settings.isSwipe,
  //                     // 默认两项
  //                     HomeInfo: true,
  //                     HomeClock: true,
  //                     // 可能废弃
  //                     HomeGIF: this.settings.HomeGIF,
  //                     HomeFreeFallIcon: this.settings.HomeFreeFallIcon,
  //                     HomeWeather: this.settings.HomeWeather,
  //                     homeTigerGame: this.settings.homeTigerGame,
  //                     HomeCocos2: newVal,
  //                     HomeWaterShak: this.settings.HomeWaterShak,
  //                 },
  //             },
  //         })
  //             .then((res) => {
  //                 console.log(res, '单个');
  //             })
  //             .catch((err) => {
  //                 console.log(err);
  //                 this.setShowErrorToast();
  //             });
  //     },
  // },
};
</script>

<style scoped>
/* 根据需求添加样式 */
.system-settings {
  padding: 16px;
  background: #f7f8fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180.08deg, #c5e6ff -1.16%, #ecf6ff 14.34%, #f3f4f7 50%);
}

.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
</style>
