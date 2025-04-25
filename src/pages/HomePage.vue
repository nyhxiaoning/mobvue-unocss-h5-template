<template>
  <div class="system-settings">
    <van-loading
      v-if="states.globalLoading"
      class="global-loading"
      type="spinner"
      color="#fff"
      text="..."
    ></van-loading>

    <!-- 顶部状态栏 -->
    <div v-if="defaultVersionType !== 2" class="status-bar">
      <van-row justify="space-between" align="center">
        <van-row
          type="flex"
          justify="start"
          align="center"
          style="width: 58px; height: 24px; font-size: 12px"
        >
          <!-- 第一个子 div -->
          <van-col :span="12">
            <div :class="curBatteryClass" style="width: 24px; height: 24px"></div>
          </van-col>
          <!-- 第二个子 div -->
          <van-col :span="12">
            <div
              style="
                line-height: 24px;
                height: 26px;
                text-align: center;
                margin-right: -30px;
              "
            >
              {{ states.battery }}%
            </div>
          </van-col>
        </van-row>

        <div style="position: relative; margin-left: 10%">
          <div :class="[states.online ? 'green-dot' : 'green-dot-offline']"></div>
          <div :class="[states.online ? 'status-text' : 'status-text-offline']">
            &nbsp;{{ language.online }}
          </div>
        </div>
        <div style="margin-left: 20px">
          <van-row
            type="flex"
            justify="start"
            align="center"
            :class="[
              states.languageFlag ? 'temperature-content' : 'temperature-content-en',
            ]"
          >
            <!-- 第一个子 div -->
            <van-col :span="6">
              <div :class="curTemperatureClass" style="width: 16px; height: 16px"></div>
            </van-col>
            <!-- 第二个子 div -->
            <van-col :span="18">
              <div style="line-height: 24px; height: 26px; font-size: 12px">
                {{ language.waterTemp }}:{{ states.temperature }} F
              </div>
            </van-col>
          </van-row>
        </div>
      </van-row>
    </div>

    <!-- wifi+温度+电池 -->
    <div v-if="defaultVersionType === 2" class="wifi-clock">
      <div class="wifi-left">
        <div style="margin-bottom: 10px">
          <img src="@/assets/cupWifi.png" width="135" height="20" alt="" />
        </div>
        <div style="margin-left: -20px">
          <van-row :gutter="[40, 10]">
            <van-col span="12">
              <van-row
                type="flex"
                justify="start"
                align="center"
                style="width: 58px; height: 24px; font-size: 12px"
              >
                <!-- 第一个子 div -->
                <van-col :span="12">
                  <div :class="curBatteryClass" style="width: 24px; height: 24px"></div>
                </van-col>
                <!-- 第二个子 div -->
                <van-col :span="12">
                  <div
                    style="
                      line-height: 24px;
                      height: 26px;
                      text-align: center;
                      margin-right: -30px;
                    "
                  >
                    {{ states.battery }}%
                  </div>
                </van-col>
              </van-row>
            </van-col>
            <van-col span="12">
              <div :class="[states.online ? 'green-dot' : 'green-dot-offline']"></div>
              <div :class="[states.online ? 'status-text' : 'status-text-offline']">
                &nbsp;{{ language.online }}
              </div>
            </van-col>
          </van-row>
        </div>
        <div class="img-container">
          <img class="image" src="@/assets/wifiicon.png" width="18" height="18" alt="" />
          <p class="text">{{ states.wifiSsid }}</p>
        </div>
      </div>

      <div class="wifi-info">
        <div style="padding: 10px">
          <div style="margin-bottom: 10px; font-size: 12px">
            <van-row
              type="flex"
              justify="start"
              align="center"
              :class="[
                states.languageFlag ? 'temperature-content' : 'temperature-content-en',
              ]"
            >
              <!-- 第一个子 div -->
              <van-col :span="6">
                <div
                  :class="curTemperatureClass"
                  style="width: 16px; height: 16px; font-size: 12px"
                ></div>
              </van-col>

              <!-- 第二个子 div -->
              <van-col :span="18">
                <div style="line-height: 24px; height: 26px; font-size: 12px">
                  {{ `${language.waterTemp} | ${states.curTemperatureTransferText}` }}
                </div>
              </van-col>
            </van-row>
            <!-- 摄氏度和华氏度控制 -->
            <van-row style="border: 1px solid #eeeeee; padding: 1px; margin-top: 5px">
              <van-col
                @click="changeTempSetting('1')"
                :class="[
                  states.temperatureTab === '1' ? 'temp-active-icon' : 'temp-no-icon',
                ]"
                span="12"
              >
                {{ language.celsius }}</van-col
              >
              <van-col
                @click="changeTempSetting('2')"
                :class="[
                  states.temperatureTab === '2' ? 'temp-active-icon' : 'temp-no-icon',
                ]"
                span="12"
              >
                {{ language.fahrenheit }}</van-col
              >
            </van-row>
          </div>
        </div>
      </div>
    </div>
    <!-- 亮度调节 -->
    <div class="brightness-control">
      <div style="font-size: 16px; margin: 20px; margin-left: 15px">
        <div>
          {{ language.brightness }}&nbsp; <span style="color: #969698">|</span
          ><span>&nbsp;{{ states.brightness }}%</span>
        </div>
        <div style="font-size: 12px; color: #969698; margin: 20px; margin-left: 15px">
          <van-slider
            bar-height="6px"
            active-color="#31ACF8"
            v-model="states.brightness"
            @change="onBrightnessChange"
            step="10"
          >
          </van-slider>
        </div>
      </div>
    </div>
    <!-- 时钟和天气 -->
    <div class="weather-clock">
      <div class="clock">
        <div>
          <div>
            <div
              @click="appWeatherFn"
              style="
                display: flex;
                font-size: 16px;
                margin-bottom: 5px;
                margin-left: 10px;
              "
            >
              {{ language.clock }}
              <img src="@/assets/arrowtwo.png" width="20" height="20" alt="" />
            </div>
          </div>
          <div style="font-size: 12px; color: #969698; margin-left: 10px">
            <span>{{ userStore.$state.timezoneLabel }} <br /></span>
            <span>{{ userStore.$state.timezoneAddress }}</span>
          </div>
        </div>

        <div class="clock-appcup"></div>
      </div>

      <div class="weather">
        <div>
          <div>
            <div
              @click="appCityFn"
              style="
                display: flex;
                font-size: 16px;
                margin-bottom: 5px;
                margin-left: 10px;
              "
            >
              {{ language.weather }}
              <img src="@/assets/arrowtwo.png" width="20" height="20" alt="" />
            </div>
          </div>
          <div style="font-size: 12px; color: #969698; margin-left: 10px">
            <span><van-icon name="location-o" />{{ states.weatheraddress }} <br /></span>
          </div>
        </div>

        <div class="weather-appcup"></div>
      </div>
    </div>

    <!-- 空白间隔 -->
    <!-- <div class="spacer"></div> -->

    <!-- 应用配置 -->
    <div class="feature-item">
      <div
        @click="appConfigFn(1)"
        style="
          flex: 1;
          display: flex;
          justify-content: space-between;
          text-align: center;
          background-color: #ffffff;
          border-radius: 10px;
          align-items: center;
        "
      >
        <div>
          <div>
            <div
              style="
                display: flex;
                font-size: 16px;

                margin-bottom: 5px;
                text-align: center;
              "
            >
              {{ language.appConfig }}
              <img src="@/assets/arrowtwo.png" width="20" height="20" alt="" />
            </div>
          </div>
          <div style="font-size: 12px; color: #969698">
            {{ language.appConfigDesc }}
          </div>
        </div>

        <div class="seting-appcup"></div>
      </div>
    </div>
    <div
      v-if="defaultVersionType === 2"
      class="feature-item"
    >
      <div
        @click="appConfigFn(2)"
        style="
          flex: 1;
          display: flex;
          justify-content: space-between;
          text-align: center;
          background-color: #ffffff;
          border-radius: 10px;
          align-items: center;
        "
      >
        <div>
          <div>
            <div
              style="
                display: flex;
                font-size: 16px;

                margin-bottom: 5px;
                text-align: center;
              "
            >
              {{ language.appSaverConfig }}
              <img src="@/assets/arrowtwo.png" width="20" height="20" alt="" />
            </div>
          </div>
          <div style="font-size: 12px; color: #969698">
            {{ language.appSaverConfigDesc }}
          </div>
        </div>

        <div class="seting-appcup-screensaver"></div>
      </div>
    </div>

    <!-- 空白间隔 -->
    <div class="spacer-bottom"></div>

    <!-- 底部按钮 -->
    <div class="bottom-actions">
      <div
        @click="restartCup"
        style="
          flex: 1;
          text-align: center;
          background-color: #ffffff;
          border-radius: 10px;
        "
      >
        <div class="reboot-cup"></div>
        <div>{{ language.restartCup }}</div>
      </div>

      <div
        @click="closeScreen"
        style="
          flex: 1;
          text-align: center;
          background-color: #ffffff;
          border-radius: 10px;
        "
      >
        <div :class="[states.screenStatus ? 'closescreen-cup' : 'openscreen-cup']"></div>
        <div>{{ states.screenStatus ? language.closeScreen : language.openScreen }}</div>
      </div>
      <div
        @click="goHome"
        style="
          flex: 1;
          text-align: center;
          background-color: #ffffff;
          border-radius: 10px;
        "
      >
        <div class="go-home"></div>
        <div>{{ language.returnHome }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted, watch, ref } from "vue";

import { timezone } from "./../utils/cityzone";

import { useRouter } from "vue-router";

import { useUserStore } from "./../store/index";
import { showToast, Loading } from "vant";

export default defineComponent({
  name: "SystemSettings",

  setup() {
    CupDevice.onReceive((res: any) => {
      if (res?.CurScreenState) {
        states.screenStatus = res?.CurScreenState.value;
      }
      // if(res?.Brightness){
      //     states.brightness = res?.Brightness.value
      // }

      console.log("---------onReceive--------", res);
      // showToast({
      //     message: JSON.stringify(res),
      //     duration: 2000,
      // });
    });

    const timezones = ref([
      {
        name: "UTC-12:00",
        label:
          JeeWeb.Language === "zh-CN"
            ? "（UTC-12:00）贝克岛"
            : "(UTC-12:00) Baker Island",
        value: "Chile/EasterIsland",
      },
      {
        name: "UTC-11:00",
        label:
          JeeWeb.Language === "zh-CN" ? "（UTC-11:00）帕果帕果" : "(UTC-11:00) Pago Pago",
        value: "Pacific/Pago_Pago",
      },
      {
        name: "UTC-10:00",
        label:
          JeeWeb.Language === "zh-CN" ? "（UTC-10:00）檀香山" : "(UTC-10:00) Honolulu",
        value: "Pacific/Honolulu",
      },
      {
        name: "UTC-9:00",
        label:
          JeeWeb.Language === "zh-CN" ? "（UTC-9:00）安克雷奇" : "(UTC-9:00) Anchorage",
        value: "America/Anchorage",
      },
      {
        name: "UTC-8:00",
        label:
          JeeWeb.Language === "zh-CN" ? "（UTC-8:00）洛杉矶" : "(UTC-8:00) Los Angeles",
        value: "America/Los_Angeles",
      },
      {
        name: "UTC-7:00",
        label: JeeWeb.Language === "zh-CN" ? "（UTC-7:00）丹佛" : "(UTC-7:00) Denver",
        value: "America/Denver",
      },
      {
        name: "UTC-6:00",
        label: JeeWeb.Language === "zh-CN" ? "（UTC-6:00）芝加哥" : "(UTC-6:00) Chicago",
        value: "America/Chicago",
      },
      {
        name: "UTC-5:00",
        label: JeeWeb.Language === "zh-CN" ? "（UTC-5:00）纽约" : "(UTC-5:00) New York",
        value: "America/New_York",
      },
      {
        name: "UTC-4:00",
        label:
          JeeWeb.Language === "zh-CN" ? "（UTC-4:00）圣地亚哥" : "(UTC-4:00) Santiago",
        value: "America/Argentina/Cordoba",
      },
      {
        name: "UTC-3:00",
        label:
          JeeWeb.Language === "zh-CN"
            ? "（UTC-3:00）布宜诺斯艾利斯"
            : "(UTC-3:00) Buenos Aires",
        value: "America/Argentina/Buenos_Aires",
      },
      {
        name: "UTC-2:00",
        label:
          JeeWeb.Language === "zh-CN"
            ? "（UTC-2:00）南乔治亚岛"
            : "(UTC-2:00) South Georgia Island",
        value: "Atlantic/South_Georgia",
      },
      {
        name: "UTC-1:00",
        label:
          JeeWeb.Language === "zh-CN" ? "（UTC-1:00）亚速尔群岛" : "(UTC-1:00) Azores",
        value: "Atlantic/Azores",
      },
      {
        name: "UTC+00:00",
        label: JeeWeb.Language === "zh-CN" ? "（UTC+00:00）伦敦" : "(UTC+00:00) London",
        value: "Europe/London",
      },
      {
        name: "UTC+01:00",
        label: JeeWeb.Language === "zh-CN" ? "（UTC+01:00）巴黎" : "(UTC+01:00) Paris",
        value: "Europe/Paris",
      },
      {
        name: "UTC+02:00",
        label: JeeWeb.Language === "zh-CN" ? "（UTC+02:00）开罗" : "(UTC+02:00) Cairo",
        value: "Africa/Cairo",
      },
      {
        name: "UTC+03:00",
        label: JeeWeb.Language === "zh-CN" ? "（UTC+03:00）莫斯科" : "(UTC+03:00) Moscow",
        value: "Europe/Moscow",
      },
      {
        name: "UTC+04:00",
        label: JeeWeb.Language === "zh-CN" ? "（UTC+04:00）迪拜" : "(UTC+04:00) Dubai",
        value: "Asia/Dubai",
      },
      {
        name: "UTC+05:00",
        label:
          JeeWeb.Language === "zh-CN" ? "（UTC+05:00）卡拉奇" : "(UTC+05:00) Karachi",
        value: "Asia/Karachi",
      },
      {
        name: "UTC+06:00",
        label: JeeWeb.Language === "zh-CN" ? "（UTC+06:00）达卡" : "(UTC+06:00) Dhaka",
        value: "Asia/Dhaka",
      },
      {
        name: "UTC+07:00",
        label: JeeWeb.Language === "zh-CN" ? "（UTC+07:00）曼谷" : "(UTC+07:00) Bangkok",
        value: "Asia/Bangkok",
      },
      {
        name: "UTC+08:00",
        label: JeeWeb.Language === "zh-CN" ? "（UTC+08:00）北京" : "(UTC+08:00) Beijing",
        value: "Asia/Shanghai",
      },
      {
        name: "UTC+09:00",
        label: JeeWeb.Language === "zh-CN" ? "（UTC+09:00）东京" : "(UTC+09:00) Tokyo",
        value: "Asia/Tokyo",
      },
      {
        name: "UTC+10:00",
        label: JeeWeb.Language === "zh-CN" ? "（UTC+10:00）悉尼" : "(UTC+10:00) Sydney",
        value: "Australia/Sydney",
      },
      {
        name: "UTC+11:00",
        label:
          JeeWeb.Language === "zh-CN"
            ? "（UTC+11:00）所罗门群岛"
            : "(UTC+11:00) Solomon Islands",
        value: "Pacific/Guadalcanal",
      },
      {
        name: "UTC+12:00",
        label:
          JeeWeb.Language === "zh-CN" ? "（UTC+12:00）奥克兰" : "(UTC+12:00) Auckland",
        timezone: "Pacific/Auckland",
      },
    ]);
    const userStore = useUserStore();
    const router = useRouter(); // 获取路由实例
    // const brightness = ref(40);
    console.log(timezone, "timezone");
    const states = reactive({
      // 屏保默认隐藏
      screensaverFlag: false,
      languageFlag: JeeWeb.Language === "zh-CN" ? true : false,
      battery: userStore.$state.battery || 10,
      brightness: userStore.$state.brightness || 0,
      temperature: userStore.$state.temperature || 100,
      batteryStatus: false,
      address: "",
      weatheraddress: userStore.$state.weathername || "",
      clock: "",
      curBatteryClass: "battery-20",
      curTemperatureClass: "temperature-0",
      online: false,
      // 默认一定是开启
      screenStatus: true,
      globalLoading: true,
      wifiSsid: "",
      temperatureType: "CELSIUS",
      temperatureTab: "1", // 1表示切换当前的CELSIUS，2表示切换当前的FAHRENHEIT
      curTemperatureTransferText: "",
      // CELSIUS - 摄氏度, FAHRENHEIT - 华氏度
    });

    const language = reactive({
      celsius: JeeWeb.Language === "zh-CN" ? "摄氏度℃" : "Celsius ℃",
      fahrenheit: JeeWeb.Language === "zh-CN" ? "华氏度℉" : "Fahrenheit ℉",
      online: JeeWeb.Language === "zh-CN" ? "在线" : "Online",
      waterTemp: JeeWeb.Language === "zh-CN" ? "温度" : "Temp",
      brightness: JeeWeb.Language === "zh-CN" ? "亮度" : "Brightness",
      clock: JeeWeb.Language === "zh-CN" ? "时钟" : "Clock",
      weather: JeeWeb.Language === "zh-CN" ? "天气" : "Weather",
      appConfig: JeeWeb.Language === "zh-CN" ? "应用配置" : "App Config",
      appSaverConfig: JeeWeb.Language === "zh-CN" ? "屏保设置" : "Screensavers Config",
      appConfigDesc:
        JeeWeb.Language === "zh-CN"
          ? "可设置应用是否在水杯中展示"
          : "Configure App Display",
      appSaverConfigDesc:
        JeeWeb.Language === "zh-CN"
          ? "可设置在水杯中展示的屏保"
          : "Screensaver for water glass display",
      restartCup: JeeWeb.Language === "zh-CN" ? "重启水杯" : "Restart",
      closeScreen: JeeWeb.Language === "zh-CN" ? "关闭屏幕" : "Display Off",
      openScreen: JeeWeb.Language === "zh-CN" ? "打开屏幕" : "Display On",
      returnHome: JeeWeb.Language === "zh-CN" ? "回到主页" : "Home",
      setBrightnessError:
        JeeWeb.Language === "zh-CN" ? "设置亮度失败" : "Failed to set brightness",
      setRestartError:
        JeeWeb.Language === "zh-CN" ? "设置重启失败" : "Failed to set restart",
      getCupInfoError:
        JeeWeb.Language === "zh-CN"
          ? "获取水杯基本信息失败"
          : "Failed to get basic information about water cup",
      returnHomeError:
        JeeWeb.Language === "zh-CN" ? "回到主页下发失败" : "Failed to return home",
      screenOffError:
        JeeWeb.Language === "zh-CN" ? "关闭屏幕失败" : "Failed to turn off screen",
      screenOnError:
        JeeWeb.Language === "zh-CN" ? "开启屏幕失败" : "Failed to turn on screen",
      sendSuccess: JeeWeb.Language === "zh-CN" ? "下发成功" : "Send Success",
      sendFail: JeeWeb.Language === "zh-CN" ? "下发失败" : "Send Fail",
    });

    // const batteryClass = computed(() => {});

    // const temperatureClass = computed(() => {});

    const onBrightnessChange = (value: number) => {
      if (value === 0) {
        value = 1;
      }
      console.log("当前亮度：", value);
      states.globalLoading = true;
      // 1 老款设备、2 新款设备
      const v = CupDevice?.to?.versionType || 2;

      const p1 = {
        method: "setBrightness",
        params: {
          value: value,
        },
      };

      const p2 = {
        method: "talSetBrightness",
        params: {
          percent: value,
        },
      };

      CupDevice &&
        CupDevice.setDevMessage({
          value: v === 1 ? p1 : p2,
        })
          .then((res: any) => {
            states.globalLoading = false;
            console.log(res.data, "设置亮度.value");
            // userStore.$state.brightness = value as any;

            // store.selectedTimezone(selectedTimezone.value);
          })
          .catch((err: any) => {
            states.globalLoading = false;
            console.log(err);
            showToast({
              message: language.setBrightnessError,
              duration: 1000,
            });
          });
    };

    const closeScreen = () => {
      states.globalLoading = true;
      // 1 老款设备、2 新款设备
      const v = CupDevice?.to?.versionType || 2;

      const p1 = {
        method: "setSwitch",
        params: {
          value: states.screenStatus ? false : true,
        },
      };

      const p2 = {
        method: "talSetDisplayOnOff",
        params: {
          onoff: states.screenStatus ? false : true,
        },
      };

      CupDevice &&
        CupDevice.setDevMessage({
          value: v === 1 ? p1 : p2,
        })
          .then((res: any) => {
            console.log(res, ".value");
            states.screenStatus = !states.screenStatus;
            showToast({
              message: language.sendSuccess,
              duration: 1000,
            });
            states.globalLoading = false;
            // store.selectedTimezone(selectedTimezone.value);
          })
          .catch((err: any) => {
            console.log(err);
            showToast({
              message: states.screenStatus
                ? language.screenOffError
                : language.screenOnError,
              duration: 1000,
            });
            states.globalLoading = false;
          });
      console.log("关闭屏幕");
    };

    const restartCup = () => {
      // 1 老款设备、2 新款设备
      const v = CupDevice?.to?.versionType || 2;

      // 重启设备后，其实没有回复，所以不需要拦截
      CupDevice &&
        CupDevice.setDevMessage({
          value: {
            method: v === 1 ? "PixelCupRestart" : "talRebootDevice",
            params: {},
          },
        })
          .then((res: any) => {
            console.log(res, ".value");

            // store.selectedTimezone(selectedTimezone.value);
          })
          .catch((err: any) => {
            console.log(err);
            // 不能设置失败，因为这里设备马上离线了
            // showToast({
            //     message: language.setRestartError,
            //     duration: 1000,
            // });
          });
    };

    const goHome = () => {
      states.globalLoading = true;
      console.log("talReturn2Home");
      // 1 老款设备、2 新款设备
      const v = CupDevice?.to?.versionType || 2;
      CupDevice &&
        CupDevice.setDevMessage({
          value: {
            method: v === 1 ? "return2Home" : "talReturn2Home",
            params: {},
          },
        })
          .then((res: any) => {
            showToast({
              message: language.sendSuccess,
              duration: 1000,
            });
            states.globalLoading = false;
            console.log(res, ".value");

            // store.selectedTimezone(selectedTimezone.value);
          })
          .catch((err: any) => {
            console.log(err);
            states.globalLoading = false;
            showToast({
              message: language.returnHomeError,

              duration: 1000,
            });
          });
    };

    const appConfigFn = (num: number) => {
      const v = CupDevice?.to?.versionType || 2;
      if (v === 1) {
        if (num === 1) {
          // $route.push('/setting');
          router.push("setting"); // 跳转到设置
        }
      } else {
        if (num === 1) {
          // $route.push('/setting');
          router.push("setting"); // 跳转到设置
        } else if (num === 2) {
          router.push("screensaver"); // 跳转到屏保
        }
      }
    };

    const appWeatherFn = () => {
      // alert('应用设置');
      // $route.push('/setting');
      router.push("timezone"); // 跳转到首页
    };

    const appCityFn = () => {
      // alert('应用设置');
      // $route.push('/setting');
      router.push("weather"); // 跳转到首页
    };

    // 计算温度状态的 class
    const curTemperatureClass = computed(() => {
      // 如果这里是华氏度，需要转成摄氏度对比
      let currentTempature;
      if (states.temperatureType === "FAHRENHEIT") {
        currentTempature = fahrenheitToCelsius(states.temperature);
        if (currentTempature < 0) {
          return "temperature";
        } else if (currentTempature < 99) {
          return "temperature-0";
        } else {
          return "temperature-99";
        }
      } else {
        if (states.temperature < 0) {
          return "temperature";
        } else if (states.temperature < 99) {
          return "temperature-0";
        } else {
          return "temperature-99";
        }
      }
    });

    onMounted(() => {
      // states.curBatteryClass = 'battery-60';
      // states.online = JeeWeb && JeeWeb.deviceBind[0]?.devices[0]?.online || false;
      console.log(
        JeeWeb.deviceBind[0]?.devices[0]?.online,
        "",
        JeeWeb.deviceBind[0]?.devices
      );

      // 1 老款设备、2 新款设备
      const v = CupDevice?.to?.versionType || 2;

      CupDevice &&
        CupDevice.setDevMessage({
          value: {
            method: v === 1 ? "getCupInfo" : "talGetCupInfo",
            params: {},
          },
        })
          .then((res: any) => {
            console.log(res.data, "talGetCupInfo");
            states.brightness = res.data.brightness;

            states.battery = res.data.batteryStatus;
            states.screenStatus = res.data.switch;
            states.address = res.data.timezone;
            console.log(res.data?.wifiSsid, "wifiSsid是否有wifi信息");
            if (v === 2) {
              states.wifiSsid = res.data?.wifiSsid || "";
              states.temperatureType = res.data.waterTempUnit;

              states.temperatureTab = res.data.waterTempUnit === "CELSIUS" ? "1" : "2";
              states.temperature = res.data.waterTemperature;
              if (states.temperatureType === "CELSIUS") {
                states.curTemperatureTransferText = states.temperature + "℃";
              }

              if (states.temperatureType === "FAHRENHEIT") {
                states.curTemperatureTransferText = states.temperature + "℉";
              }
            } else {
              states.temperature = res.data.waterTemperature;
            }

            // states.weatheraddress = res.data.city;
            // 设置天气地址:线上国内仅仅支持中国
            console.log(res.data.city, "res.data.city0000");
            // TODO:特殊处理一下 北京：beijing,这个默认值：Beijing
            if (res.data.city === "beijing") {
              // 减少第一次缓存值
              userStore.$state.weathername =
                JeeWeb.Language === "zh-CN" ? "北京" : "Beijing";
              states.weatheraddress = userStore.$state.weathername;
              userStore.$state.weathervalue = "Beijing";
            } else {
              console.log(res.data.city, "res.data.city");
              let itemsAllCity = Object.values(userStore.$state.allCitys);
              for (let i = 0; i < itemsAllCity.length; i++) {
                let currentCities = itemsAllCity[i][0].cities;
                for (let j = 0; j < currentCities.length; j++) {
                  if (currentCities[j].value === res.data.city) {
                    userStore.$state.weathername =
                      JeeWeb.Language === "zh-CN"
                        ? currentCities[j].name
                        : currentCities[j].nameEn;
                    states.weatheraddress = userStore.$state.weathername;
                    userStore.$state.weathervalue = currentCities[j].value;
                  }
                }
              }
            }
            const item = timezones.value.find((item) => item.value === res.data.timezone);
            userStore.$state.timezoneValue = res.data.timezone;
            userStore.$state.timezoneLabel = item ? item.name : "";
            if (JeeWeb.Language === "zh-CN" && item) {
              userStore.$state.timezoneAddress = item.label.split("）")[1];
            }

            if (JeeWeb.Language !== "zh-CN" && item) {
              userStore.$state.timezoneAddress = item.label.split(")")[1];
            }

            // userStore.$state.brightness = res.data.brightness;

            // 如果可以获取当前TAL水杯信息，默认获取在线状态
            states.online = true;
            // 为了记录有没有获取过接口，如果获取了，那么下一次不会了。
            sessionStorage.setItem("getCupInfoFlag", "100"); // 记录1
            // store.selectedTimezone(selectedTimezone.value);
            states.globalLoading = false;
          })
          .catch((err: any) => {
            console.log(err);
            setTimeout(() => {
              states.globalLoading = false;
              showToast({
                message: language.getCupInfoError,
                duration: 1000,
              });
            }, 1000);
          });

      // 订阅在线状态
      // onDevicesOnlineChanged()
    });

    // // Watch battery changes
    watch(
      () => states.battery,
      (newValue, oldValue) => {
        console.log("Brightness changed:", oldValue, "->", newValue);
        if (newValue < 20) {
          return (states.curBatteryClass = "battery-20");
        } else if (newValue > 20 && newValue < 100) {
          return (states.curBatteryClass = "battery-40");
        } else if (newValue > 99) {
          return (states.curBatteryClass = "battery-60");
        }
        // Add your logic here for brightness changes
      }
    );

    // // Watch temperature changes
    watch(
      () => states.temperature,
      (newValue, oldValue) => {
        console.log("Temperature changed:", oldValue, "->", newValue);
        // Add your logic here for temperature changes
        if (!newValue) {
          return (states.curTemperatureClass = "temperature");
        } else if (newValue < 20) {
          return (states.curTemperatureClass = "temperature");
        } else if (newValue >= 20 && newValue < 80) {
          return (states.curTemperatureClass = "temperature-0");
        } else if (newValue >= 80) {
          return (states.curTemperatureClass = "temperature-99");
        }
      }
    );

    // watch(
    //     () => states.weatheraddress,
    //     (newValue, oldValue) => {
    //         // console.log('weatheraddress changed:', oldValue, '->', newValue)
    //         // Add your logic here for temperature changes

    //     }
    // )

    // function onDevicesOnlineChanged() {
    //     let callback = function (res:any) {
    //         console.log(res,'online信息')
    //         states.online = res.online
    //     }
    //     JeeWeb.onDevicesOnlineChanged(callback);
    // }

    function jumpNewTalFn() {
      router.push("/newTal");
    }

    const curTemperatureTransfer = () => {
      states.globalLoading = true;
      if (states.temperatureTab === "1") {
        if (states.temperatureType === "FAHRENHEIT") {
          states.curTemperatureTransferText =
            fahrenheitToCelsius(states.temperature) + "℃";
        } else {
          states.curTemperatureTransferText = states.temperature + "℃";
        }
        console.log(
          states.curTemperatureTransferText,
          "111 states.curTemperatureTransferText = "
        );
      } else {
        if (states.temperatureType === "CELSIUS") {
          states.curTemperatureTransferText =
            celsiusToFahrenheit(states.temperature) + "℉";
        } else {
          states.curTemperatureTransferText = states.temperature + "℉";
        }
        console.log(
          states.curTemperatureTransferText,
          "2222 states.curTemperatureTransferText = "
        );
      }

      // 下发一下，如果失败，那么给出报错
      CupDevice &&
        CupDevice.setDevMessage({
          value: {
            method: "talSetWaterTemperatureUnit",
            params: {
              unit: states.temperatureTab === "1" ? "CELSIUS" : "FAHRENHEIT",
            },
          },
        })
          .then((res: any) => {
            console.log(res, "setTempUnit");
            states.globalLoading = false;
            showToast({
              message: language.sendSuccess,
              duration: 1000,
            });
          })
          .catch((err: any) => {
            console.log(err);
            states.globalLoading = false;
            showToast({
              message: language.sendFail,
              duration: 1000,
            });
          });
      //   if (states.temperatureType === "CELSIUS") {
      //     return states.temperature + "℃";
      //   } else {
      //     return states.temperature + "℉";
      //   }
    };

    // 计算电池状态的 class
    const curBatteryClass = computed(() => {
      if (states.battery < 20) {
        return "battery-20";
      } else if (states.battery < 40) {
        // 省略 `> 20`，因为前面已经判断 `< 20`
        return "battery-40";
      } else {
        return "battery-60";
      }
    });

    const defaultVersionType = computed(() => {
      // 1 老款设备、2 新款设备
      const v = CupDevice?.to?.versionType || 2;
      return v;
    });

    // // Watch battery changes
    watch(
      () => states.battery,
      (newValue, oldValue) => {
        console.log("Brightness changed:", oldValue, "->", newValue);
        if (newValue < 20) {
          return (states.curBatteryClass = "battery-20");
        } else if (newValue > 20 && newValue < 100) {
          return (states.curBatteryClass = "battery-40");
        } else if (newValue > 99) {
          return (states.curBatteryClass = "battery-60");
        }
        // Add your logic here for brightness changes
      }
    );

    // // Watch temperature changes
    watch(
      () => states.temperature,
      (newValue, oldValue) => {
        console.log("Temperature changed:", oldValue, "->", newValue);
        // Add your logic here for temperature changes
        if (!newValue) {
          return (states.curTemperatureClass = "temperature");
        } else if (newValue < 20) {
          return (states.curTemperatureClass = "temperature");
        } else if (newValue >= 20 && newValue < 80) {
          return (states.curTemperatureClass = "temperature-0");
        } else if (newValue >= 80) {
          return (states.curTemperatureClass = "temperature-99");
        }
      }
    );

    const changeTempSetting = (str: string) => {
      states.temperatureTab = str;
      curTemperatureTransfer();
    };

    // 摄氏度转华氏度
    function celsiusToFahrenheit(celsius: number) {
      let currentValue = parseFloat(((celsius * 1.8 + 32) / 1).toFixed(1));
      return currentValue;
    }

    // 华氏度转摄氏度
    function fahrenheitToCelsius(fahrenheit: number) {
      let currentValue = parseFloat(((fahrenheit - 32) / 1.8).toFixed(1));
      return currentValue;
    }

    // 使用 Math.round() 方法
    function roundToOneDecimalWithMathRound(num: any) {
      return Math.round(num * 10) / 10;
    }
    return {
      jumpNewTalFn,
      onBrightnessChange,
      restartCup,
      closeScreen,
      goHome,
      appConfigFn,
      appWeatherFn,
      appCityFn,
      states,
      curBatteryClass,
      curTemperatureClass,
      userStore,
      language,
      changeTempSetting,
      celsiusToFahrenheit,
      fahrenheitToCelsius,
      curTemperatureTransfer,
      defaultVersionType,
      roundToOneDecimalWithMathRound,
      // onDevicesOnlineChanged
    };
  },
});
</script>

<style scoped>
.system-settings {
  padding: 16px;
  background: #f7f8fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180.08deg, #c5e6ff -1.16%, #ecf6ff 14.34%, #f3f4f7 50%);
}

.status-bar {
  margin-bottom: 16px;
}

.icon {
  margin-right: 4px;
}

.status-text {
  display: inline-block;
  line-height: 20px;
  height: 20px;
  color: green;
  /* margin-right: 30px; */
  font-size: 12px;
}

.status-text-offline {
  display: inline-block;
  line-height: 20px;
  height: 20px;
  color: #a3a3a3;
  /* margin-right: 30px; */
  font-size: 12px;
}

.brightness-control {
  display: flex;
  flex: 0.3;
  /* align-items: center; */
  flex-direction: column;

  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 16px;
  background-color: #ffffff;
  height: 90px;
  border-radius: 12px;
}

.weather-clock {
  flex: 2;
  display: flex;
  margin-left: 20px;
  margin-right: 20px;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;

  font-size: 12px;
  border-radius: 12px;
}

.wifi-clock {
  flex: 1;
  display: flex;
  align-items: center;

  margin-left: 25px;
  margin-right: 25px;
  margin-top: 10px;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;

  font-size: 12px;
  border-radius: 12px;
}

.weather {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 100px;
  background-color: #ffffff;

  border-radius: 12px;
}

.wifi-left {
  flex: 1;
  display: flex;
  margin-right: 20px;
  flex-direction: column;
  justify-content: space-around;
  /* align-items: center; */
  /* height: 100px; */
  border-radius: 12px;
}

.wifi-info {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 100px;
  background-color: #ffffff;

  border-radius: 12px;
}

.img-container {
  display: flex;
  align-items: center;
  margin-top: -5px;
  .image {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }

  .text {
    font-size: 16px;
  }
}

.clock {
  flex: 1;
  display: flex;
  margin-right: 20px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 100px;
  background-color: #ffffff;

  border-radius: 12px;
}

.feature-item {
  display: flex;
  flex: 0.5;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 16px;
  padding: 10px;
  background-color: #ffffff;
  font-size: 12px;
  border-radius: 12px;
}

.bottom-actions {
  display: flex;
  flex: 0.2;
  flex-direction: row;
  margin-top: 16px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 16px;
  padding: 10px;
  background-color: #ffffff;
  font-size: 12px;
  border-radius: 12px;
  justify-content: center;

  div {
    flex: 1;
    align-content: center;
    padding: 5px;
    border-radius: 12px;
  }
}

.spacer-bottom {
  flex: 3;
  /* 调整空白间隔的高度 */
}

.green-dot {
  width: 10px;
  height: 10px;
  background-color: #36c449;
  border-radius: 50%;
  display: inline-block;
}

.green-dot-offline {
  width: 10px;
  height: 10px;
  background-color: #a3a3a3;
  border-radius: 50%;
  display: inline-block;
}

.black-dot {
  width: 10px;
  height: 10px;
  background-color: #f3f4f7;
  border-radius: 50%;
  display: inline-block;
}

.battery-20 {
  margin-left: 20px;
  width: 24px;
  height: 24px;
  /* background-image: url('@/assets/battery20.png'); */
  background: url("@/assets/battery20.png") center / contain no-repeat;

  border-radius: 50%;
  display: inline-block;
}

.battery-40 {
  margin-left: 20px;
  width: 24px;
  height: 24px;
  /* background-color: #36C449;
     */
  background: url("@/assets/battery40.png") center / contain no-repeat;
  border-radius: 50%;
  display: inline-block;
}

.battery-60 {
  margin-left: 20px;
  width: 24px;
  height: 24px;
  /* background-color: #36C449;
     */
  background: url("@/assets/battery60.png") center / contain no-repeat;
  border-radius: 50%;
  display: inline-block;
}

.battery-loading {
  margin-left: 20px;
  width: 24px;
  height: 24px;
  background: url("@/assets/batteryLoading.png") center / contain no-repeat;
  border-radius: 50%;
  display: inline-block;
}

.custom-button {
  width: 26px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  background-color: var(--van-primary-color);
  border-radius: 60px;
}

.temperature {
  width: 16px;
  height: 16px;
  /* background-image: url('@/assets/battery20.png'); */
  background: url("@/assets/temp.png") center / contain no-repeat;

  border-radius: 50%;
  display: inline-block;
}

.temperature-content-en {
  width: 140px;
  height: 24px;
  background-color: #ffffff;
  border-radius: 6px;
  padding-left: 5px;
  font-size: 12px;
  margin-right: 20px;
}

.temperature-content {
  width: 140px;
  height: 24px;
  background-color: #ffffff;
  border-radius: 6px;
  padding-left: 5px;
  font-size: 12px;
  margin-right: 20px;
}

.temperature-0 {
  width: 16px;
  height: 16px;
  /* background-image: url('@/assets/battery20.png'); */
  background: url("@/assets/temp0.png") center / contain no-repeat;

  border-radius: 50%;
  display: inline-block;
}

.temperature-99 {
  width: 16px;
  height: 16px;
  /* background-image: url('@/assets/battery20.png'); */
  background: url("@/assets/temp99.png") center / contain no-repeat;

  border-radius: 50%;
  display: inline-block;
}

.go-home {
  background: url("@/assets/goHome.png") center / contain no-repeat;
  width: 16px;
  height: 16px;

  display: inline-block;
}

.reboot-cup {
  background: url("@/assets/reboot.png") center / contain no-repeat;
  width: 16px;
  height: 16px;

  display: inline-block;
}

.clock-appcup {
  background: url("@/assets/clock.png") center / contain no-repeat;
  width: 40px;
  height: 47px;

  display: inline-block;
}

.weather-appcup {
  background: url("@/assets/weather.png") center / contain no-repeat;
  width: 40px;
  height: 47px;

  display: inline-block;
}

.seting-appcup {
  background: url("@/assets/appseting.png") center / contain no-repeat;
  width: 40px;
  height: 47px;

  display: inline-block;
}

.seting-appcup-screensaver {
  background: url("@/assets/screensaver.png") center / contain no-repeat;
  width: 40px;
  height: 47px;

  display: inline-block;
}

.closescreen-cup {
  background: url("@/assets/closescreen.png") center / contain no-repeat;
  width: 16px;
  height: 16px;
  display: inline-block;
}

.openscreen-cup {
  background: url("@/assets/openscreen.png") center / contain no-repeat;
  width: 16px;
  height: 16px;
  display: inline-block;
}

.close-screen {
  background: url("@/assets/closeScreen.png") center / contain no-repeat;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-block;
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

.temp-active-icon {
  text-align: center;
  background-color: #eeeeee;
  color: #31acf8;
  padding: 1px;
}

.temp-no-icon {
  text-align: center;
  background-color: #ffffff;
  padding: 1px;
}
</style>
