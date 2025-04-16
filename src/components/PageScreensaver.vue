<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 内容区域 -->
    <div class="px-4 py-4">
      <!-- 轮播速度设置 -->
      <div
        class="bg-white rounded-xl p-4 flex justify-between items-center mb-6"
        @click="showSpeedPopup = true"
      >
        <span class="text-gray-900 font-[14]">{{ language.carouselSpeed }}</span>
        <div class="flex items-center">
          <span class="text-gray-400 mr-2">{{
            resultSelected > 60
              ? `${resultSelected / 60}${language.hours}`
              : `${resultSelected} ${language.minutes}`
          }}</span>
          <van-icon class="text-gray-400" name="arrow" />
        </div>
      </div>

      <!-- 屏保图片区域 -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-900 font-[15]">
            {{ language.screensaverImages }} ( {{ currentImageNumber }} - 4 )
          </span>
          <span class="text-blue-500" @click="editing = !editing">
            {{ editing ? language.done : language.edit }}
          </span>
        </div>

        <div v-if="images.length" class="grid grid-cols-2 gap-4">
          <div
            v-for="(image, index) in images"
            :key="index"
            class="relative bg-white rounded-xl p-4 aspect-square flex items-center justify-center border-4 border-gray-900"
            @click="toggleSelect(index)"
          >
            <img
              v-if="image.url && !image?.blank"
              :src="image.url"
              class="w-20 h-20 border-radus-4 border-4 border-gray-900"
              alt=""
            />
            <div v-else class="text-center text-gray-400">
              <img :src="imgAdd" alt="" />
              <div class="text-sm mt-2">{{ language.addImagePrompt }}</div>
            </div>
            <div class="absolute top-2 right-2">
              <van-icon v-if="editing && image.selected && !image.blank" name="checked" />
              <van-icon
                v-if="editing && !image.selected && !image.blank"
                name="circle"
                color="#1989fa"
              />
              <van-icon v-if="editing && image.blank" color="#1989fa" />
              <van-icon v-if="!editing" color="#1989fa" />
            </div>
          </div>
        </div>
        <!-- 没有图片时显示添加图片提示 -->
        <div
          v-else
          class="bg-white rounded-xl p-4 flex items-center justify-center min-h-[160px]"
        >
          <div
            class="rounded-lg bg-white p-4 shadow-sm flex items-center justify-center min-h-[160px]"
          >
            <div class="text-center text-gray-400">
              <van-icon name="plus" size="20" />
              <div class="text-sm mt-2">{{ language.addImagePrompt }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部删除按钮 -->
    <div
      v-if="editing"
      class="flex flex-col justify-end items-center p-10 margin-bottom-20"
    >
      <button
        @click="deleteImages"
        class="w-full bg-white text-red-500 h-[48] font-500 py-4 shadow-lg rounded-full border-1 border-red-500"
      >
        {{ language.delete }}
      </button>
    </div>

    <!-- 速度选择弹窗 -->
    <div v-if="showSpeedPopup" class="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4" @click.stop>
        <div class="text-center text-lg font-medium mb-4 flex justify-between">
          <div class="p-3 font-[16] font-500 text-gray-400" @click="CancelSpeed">
            {{ language.cancel }}
          </div>
          <div class="p-2 font-[18] font-500">{{ language.carouselSpeed }}</div>
          <div class="p-3 font-[16] font-500 text-[#0094FF]" @click="ConfirmSpeed">
            {{ language.confirm }}
          </div>
        </div>
        <div class="space-y-4">
          <div
            v-for="speed in speeds"
            :key="speed"
            class="flex items-center p-3"
            @click="selectSpeedFn(speed)"
          >
            <div class="flex-1">
              {{ speed > 60 ? `${speed / 60}${language.hours}` : `${speed} ${language.minutes}` }}
            </div>
            <i
              :class="[selectedSpeed === speed ? ' text-blue-500' : ' text-gray-300']"
            ></i>

            <van-radio-group v-model="selectedSpeed">
              <van-cell-group inset>
                <van-cell clickable @click="selectSpeedFn(speed)">
                  <template #right-icon>
                    <van-radio :name="speed" />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </div>
        </div>
      </div>
    </div>

    <ScreenImages
      :showSpeedPopupChild="showSpeedPopupChildFlag"
      :token="currentBlank"
      @close-popup="handleClosePopup"
      @confirm-speed="handleConfirmSpeed"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from "vue";
import { showToast } from "vant";
import { requestFileUploadTokenPromise } from "@/utils/tools";

import imgAdd from "@/assets/imgAdd.png";
import ScreenImages from "./ScreenImages.vue";

const language = reactive({
  carouselSpeed: JeeWeb && JeeWeb.Language === "zh-CN" ? "轮播速度" : "Carousel Speed",
  hours: JeeWeb && JeeWeb.Language === "zh-CN" ? "小时" : "hours",
  minutes: JeeWeb && JeeWeb.Language === "zh-CN" ? "分钟" : "minutes",
  screensaverImages: JeeWeb && JeeWeb.Language === "zh-CN" ? "屏保图片" : "Screensaver Images",
  done: JeeWeb && JeeWeb.Language === "zh-CN" ? "完成" : "Done",
  edit: JeeWeb && JeeWeb.Language === "zh-CN" ? "编辑" : "Edit",
  addImagePrompt: JeeWeb && JeeWeb.Language === "zh-CN" ? "快去添加图片吧" : "Add images now",
  delete: JeeWeb && JeeWeb.Language === "zh-CN" ? "删除" : "Delete",
  cancel: JeeWeb && JeeWeb.Language === "zh-CN" ? "取消" : "Cancel",
  confirm: JeeWeb && JeeWeb.Language === "zh-CN" ? "确定" : "Confirm",
  fetchError: JeeWeb && JeeWeb.Language === "zh-CN" ? "获取失败" : "Fetch failed",
});

let currentBlank = ref<string>("");
const showSpeedPopup = ref(false);
const showSpeedPopupChildFlag = ref(false);
const selectedSpeed = ref(5);
const resultSelected = ref(5);
let editing = ref(false);
// 这里需要将分钟转成秒
// const timeResult = [60, 300, 600, 1800, 3600, 7200, 21600];
const speeds = [1, 5, 10, 30, 60, 120, 360];

// 0是静态图，1  动态图，2是落球图（0和2一样bin）
const images = ref([
  {
    url:
      "https://storage.qajeejio.com/im/artifact/gif/01JQX5ZRCCD53VGJ4F7312M5B6/jeejio.gif",
    selected: false,
    fileSize: 10470,
    type: 1,
  },
  {
    url:
      "https://storage.qajeejio.com/im/artifact/gif/01JQX5ZRD117Z2NNDGZXGQEYSH/jeejio.gif",
    selected: false,
    fileSize: 17466,
    type: 1,
  },
  {
    url: "",
    selected: false,
    blank: true,
  },
]);

const addElementBeforeLast = (arr: any, newElement: any) => {
  images.value.splice(arr.length - 1, 0, newElement);
  return images.value;
};

const toggleSelect = async (index: number) => {
  if (images.value[index].blank && !editing.value) {
    currentBlank.value = (await requestFileUploadTokenPromise()) as string;
    showSpeedPopupChildFlag.value = true;
    return;
  }
  images.value[index].selected = !images.value[index].selected;
};

const mergeObjectArray = (arr: any) => {
  let result = {};
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    for (let key in obj) {
      if (obj?.hasOwnProperty(key)) {
        result[key] = obj[key];
      }
    }
  }
  return result;
};

const selectSpeedFn = (speed: number) => {
  selectedSpeed.value = speed;
  // 切换速度，下发tal指令
  // 构造这里的content0-4数量内容对象，进行解构赋值
  let contentObj = [];
  for (let i = 0; i < images.value.length - 1; i++) {
    contentObj.push({
      [`content${i}`]: {
        size: images.value[i]?.fileSize,
        type: images.value[i]?.type === 1 ? "image/gif" : "application/octet-stream",
        url: images.value[i]?.url,
      },
      [`playTime${i}`]: resultSelected.value * 60,
    });
  }
  let output = mergeObjectArray(Object.values(contentObj));

  console.log(output, "output-----");
  //   console.log(JSON.parse(output), "JSON.parse-output");

  let currentLength:number
  let blankIndex = images.value.findIndex((image) => image.blank);
  if (blankIndex < 0) {
    currentLength = images.value.length;

  } else {
    currentLength =images.value.length - 1;

  }
  output = {
    ...output,
    isOrder: 1,
    ListLen: currentLength,
  };

  console.log(output, "output-----end");
  CupDevice &&
    CupDevice.setDevMessage({
      value: {
        method: "talSetPlayList",
        params: {
          ...output,
        },
      },
    })
      .then((res: any) => {
        console.log("", res);
      })
      .catch((err: any) => {
        console.log(" error", err);
        showToast({
          message: language.fetchError,
          duration: 1000,
        });
      });
};

const CancelSpeed = () => {
  selectedSpeed.value = resultSelected.value;
  showSpeedPopup.value = false;
};

const ConfirmSpeed = () => {
  resultSelected.value = selectedSpeed.value;
  showSpeedPopup.value = false;
};

const deleteImages = () => {
  let currentSelected: any = images.value.filter((image) => image.selected);
  let noDeleteSelected: any = images.value.filter((image) => !image.selected);
  // 当前images中是否有blank属性的空图
  let blankIndex = images.value.findIndex((image) => image.blank);
  let DeleteIndex = images.value.findIndex((image) => image.selected);

  if (DeleteIndex === blankIndex) {
    return false;
  }

  if (currentSelected.length >= 2) {
    showToast({
      message: JeeWeb && JeeWeb.Language === "zh-CN" ? "最多删除一张图片" : "Delete up to one image",
      duration: 2000,
    });
    return;
  }

  if (noDeleteSelected.length < 2) {
    console.log("noDeleteSelected", noDeleteSelected);
    showToast({
      message: JeeWeb && JeeWeb.Language === "zh-CN" ? "请至少保留一张图片" : "Keep at least one image",
      duration: 2000,
    });
    return;
  }
  images.value = noDeleteSelected;

  // 如果当前没有空图片，那么就添加一个空图片
  if (blankIndex < 0) {
    images.value.push({
      url: "",
      selected: false,
      blank: true,
    });
  }
  editing.value = false;
};

const handleClosePopup = (value: any) => {
  console.log(value, "value---------");
  // 更新当前的屏保图片列表
  if (value?.image) {
    // 优化一下这里的逻辑，如果现在图片=3张，那么将最后一张图替换了
    // 如果是小于3张，那么直接添加到最后一张图前面
    // 先判断一下，现在是否有blank的空图片，如果有，那么将blank的图片替换掉，否则直接添加到最后一张图前面
    let blankIndex = images.value.findIndex((image) => image.blank);
    if (images.value.length === 4) {
      // 替换最后一张图
      images.value[blankIndex] = {
        url: value.image.url,
        selected: value.image.selected,
      };
    } else {
      const newArr = addElementBeforeLast(images.value, { ...value.image });

      images.value = newArr;
    }
  }
  showSpeedPopupChildFlag.value = value.status;
};

const handleConfirmSpeed = (value: boolean) => {
  //   resultSelected.value = speed;
  console.log(value, "value---------");
  //   showSpeedPopupChildFlag.value = false;
};

const currentImageNumber = computed(() => {
  let blankIndex = images.value.findIndex((image) => image.blank);
  if (blankIndex < 0) {
    return images.value.length;
  } else {
    return images.value.length - 1;
  }
});
</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1/1;
}
</style>
