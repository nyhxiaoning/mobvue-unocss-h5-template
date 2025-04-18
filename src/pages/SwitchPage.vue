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
    <van-cell-group
      v-if="!CupDevice?.to?.versionType || CupDevice?.to?.versionType === 2"
      :title="language.displayApps"
      inset
    >
      <van-cell :title="language.clock" center> </van-cell>
      <van-cell :title="language.wifiApp" center> </van-cell>

      <van-cell :title="language.darkEmpire" center>
        <template #right-icon>
          <van-switch
            :disabled="!settings.isSwipe"
            v-model="settings.HomeCocos2"
            @change="handleSwitchisSwipe"
          />
        </template>
      </van-cell>
      <!-- 4 -->
      <van-cell :title="language.waterTemperature" center>
        <template #right-icon>
          <van-switch
            :disabled="!settings.isSwipe"
            v-model="settings.HomeWaterTemporatrue"
            @change="handleSwitchisSwipe"
          />
        </template>
      </van-cell>
      <!-- 5 -->
      <van-cell :title="language.weather" center>
        <template #right-icon>
          <van-switch
            :disabled="!settings.isSwipe"
            v-model="settings.HomeWeather"
            @change="handleSwitchisSwipe"
          />
        </template>
      </van-cell>
      <!-- 6 -->
      <van-cell :title="language.screensaver" center>
        <template #right-icon>
          <van-switch
            :disabled="!settings.isSwipe"
            v-model="settings.HomeScreenSaver"
            @change="handleSwitchisSwipe"
          />
        </template>
      </van-cell>
      <!-- 7 -->
      <van-cell :title="language.ballGame" center>
        <template #right-icon>
          <van-switch
            v-model="settings.HomeFreeFallIcon"
            :disabled="!settings.isSwipe"
            @change="handleSwitchisSwipe"
          />
        </template>
      </van-cell>
      <!-- 8 -->
      <van-cell :title="language.shakeEffect" center>
        <template #right-icon>
          <van-switch
            v-model="settings.HomeWaterShak"
            :disabled="!settings.isSwipe"
            @change="handleSwitchisSwipe"
          />
        </template>
      </van-cell>
      <!-- 9 -->
      <van-cell :title="language.slotGame" center>
        <template #right-icon>
          <van-switch
            v-model="settings.homeTigerGame"
            :disabled="!settings.isSwipe"
            @change="handleSwitchisSwipe"
          />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group
      v-if="CupDevice?.to?.versionType === 1"
      :title="language.displayApps"
      inset
    >
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

-------0417最新顺序：注意嵌入式返回的和页面回显的位置不一致，这里注意：
    新的页面：
    时钟：不能动
    黑客帝国：HomeCocos2
    水温：
    天气：屏保应用home
    屏保：可以开关
    落球
    水杯摇晃
    老虎机
    配网应用：不能动，并且放在第二个位置
 */
export default {
  data() {
    return {
      settings: {
        isSwipe: true,
        // 不要变：HomeClock和HomeInfo
        HomeClock: true, //（不动）1
        HomeInfo: true, // 不要了

        HomeGIF: true, //2
        HomeWeather: true, //3
        HomeFreeFallIcon: true, //4落球
        homeTigerGame: true, //5老虎机
        HomeWaterShak: true, //6水杯晃动
        HomeCocos2: true, //7黑客帝国
        HomeScreenSaver: true, //8水杯屏保
        HomeWifiApp: true, //（不动）//9配网应用
        globalSwitchLoading: true,
      },
      language: {
        enableSwitch:
          JeeWeb.Language === "zh-CN" ? "开启切换应用" : "Enable App Switching",
        displayApps: JeeWeb.Language === "zh-CN" ? "水杯显示应用" : "App Display",
        clock: JeeWeb.Language === "zh-CN" ? "时钟" : "Clock",
        deviceInfo: JeeWeb.Language === "zh-CN" ? "设备信息" : "Device Info",
        wifiApp: JeeWeb.Language === "zh-CN" ? "配网应用" : "Wi-Fi Setup App",
        waterTemperature: JeeWeb.Language === "zh-CN" ? "水杯温度" : "Cup Temperature",
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
    // 1 老款设备、2 新款设备
    const v = CupDevice?.to?.versionType || 2;
    // 初始化时获取当前系统应用显示状态
    CupDevice.setDevMessage({
      value: {
        method: v === 1 ? "getHomeAppsParams" : "talGetHomeTaskParams",
        params: {},
      },
    })
      .then((res) => {
        console.log("talGetHomeTaskParams", res, "响应结果");

        if (v === 1) {
          if (res && res.data) {
            // 更新settings中的状态： isSwipe
            this.settings.isSwipe = res.data.isSwipe;
            this.settings.HomeGIF = res.data.HomeGIF;
            this.settings.HomeWeather = res.data.HomeWeather;
            this.settings.HomeFreeFallIcon = res.data.HomeFreeFallIcon;
            this.settings.homeTigerGame = res.data.homeTigerGame;
            this.settings.HomeWaterShak = res.data.HomeWaterShak;
            this.settings.HomeCocos2 = res.data.HomeCocos2;
          }
        } else if (res && res.data) {
          let currentData = res.data.split(",");
          // 更新settings中的状态： isSwipe
          this.settings.isSwipe = currentData[0] === "1" ? true : false; //  res.data.isSwipe
          // 其他应用的显示状态
          this.settings.HomeClock = currentData[1][0] === "1" ? true : false;
          this.settings.HomeCocos2 = currentData[1][1] === "1" ? true : false;
          this.settings.HomeWaterTemporatrue = currentData[1][2] === "1" ? true : false;
          this.settings.HomeWeather = currentData[1][3] === "1" ? true : false;
          this.settings.HomeScreenSaver = currentData[1][4] === "1" ? true : false;
          this.settings.HomeFreeFallIcon = currentData[1][5] === "1" ? true : false;
          this.settings.HomeWaterShak = currentData[1][6] === "1" ? true : false;
          this.settings.homeTigerGame = currentData[1][7] === "1" ? true : false;
          this.settings.HomeWifiApp = currentData[1][8] === "1" ? true : false;
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
    // 下发数组转换，必须安装嵌入式
    convertProperties() {
      let currentData = {
        isSwipe: this.settings.isSwipe, //0
        // 默认两项
        HomeClock: true, // 1，时钟,不能关
        HomeCocos2: this.settings.HomeCocos2, // 2，黑客帝国
        HomeWaterTemporatrue: this.settings.HomeWaterTemporatrue, // 3,水杯温度
        HomeWeather: this.settings.HomeWeather, // 4, 天气
        HomeScreenSaver: this.settings.HomeScreenSaver, // 5 屏保
        HomeFreeFallIcon: this.settings.HomeFreeFallIcon, // 6，落球
        HomeWaterShak: this.settings.HomeWaterShak, // 7，水杯摇晃
        homeTigerGame: this.settings.homeTigerGame, // 8，老虎机
        HomeWifiApp: true, // 9 配网应用,不能关
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
      // 1 老款设备、2 新款设备
      const v = CupDevice?.to?.versionType || 2;

      const p1 = {
        method: "setHomeAppsParams",
        params: {
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
        },
      };

      const p2 = {
        method: "talSetHomeTaskParams",
        params: {
          value: this.convertProperties(),
        },
      };

      CupDevice.setDevMessage({
        value: v === 1 ? p1 : p2,
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
