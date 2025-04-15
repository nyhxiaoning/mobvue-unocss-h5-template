<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 内容区域 -->
    <div class="px-4 py-4">
      <!-- 轮播速度设置 -->
      <div
        class="bg-white rounded-xl p-4 flex justify-between items-center mb-6"
        @click="showSpeedPopup = true"
      >
        <span class="text-gray-900 font-[14]">轮播速度</span>
        <div class="flex items-center">
          <span class="text-gray-400 mr-2">{{
            resultSelected > 60 ? `${resultSelected / 60}小时` : `${resultSelected}分钟`
          }}</span>

          <van-icon class="text-gray-400" name="arrow" />
        </div>
      </div>

      <!-- 屏保图片区域 -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-900 font-[15]"
            >屏保图片 ( {{ images.length-1 }} - 4 )</span
          >
          <span class="text-blue-500" @click="editing = !editing"
            >{{ editing ? "完成" : "编辑" }}
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
              <div class="text-sm mt-2">快去添加图片吧</div>
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
            <div class="text-center text-gray-400" >
              <van-icon name="plus" size="20" />
              <div class="text-sm mt-2">快去添加图片吧</div>
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
        删除
      </button>
    </div>

    <!-- 速度选择弹窗 -->
    <div v-if="showSpeedPopup" class="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4" @click.stop>
        <div class="text-center text-lg font-medium mb-4 flex justify-between">
          <div class="p-3 font-[16] font-500 text-gray-400" @click="CancelSpeed">
            取消
          </div>
          <div class="p-2 font-[18] font-500">轮播速度</div>
          <div class="p-3 font-[16] font-500 text-[#0094FF]" @click="ConfirmSpeed">
            确定
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
              {{ speed > 60 ? `${speed / 60}小时` : `${speed}分钟` }}
            </div>
            <i
              :class="[
                selectedSpeed === speed
                  ? ' text-blue-500'
                  : ' text-gray-300',
              ]"
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

   <ScreenImages :showSpeedPopupChild="showSpeedPopupChildFlag" :token="currentBlank"  @close-popup="handleClosePopup" @confirm-speed="handleConfirmSpeed"  />

  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { showToast } from "vant";
import {requestFileUploadTokenPromise} from "@/utils/tools"

import imgAdd from "@/assets/imgAdd.png";
import ScreenImages from "./ScreenImages.vue";

let currentBlank= ref<string>("")
const showSpeedPopup = ref(false);
const showSpeedPopupChildFlag = ref(false);
const selectedSpeed = ref(5);
const resultSelected = ref(5);
let editing = ref(false);
// 这里需要将分钟转成秒
// const timeResult = [60, 300, 600, 1800, 3600, 7200, 21600];
const speeds = [1, 5, 10, 30, 60, 120, 360];

const images = ref([
  {
    url: "https://ai-public.mastergo.com/ai/img_res/268e57cf1cfd8989a07eaf036b41231a.jpg",
    selected: false,
  },
  {
    url: "https://ai-public.mastergo.com/ai/img_res/7d29b12525a39b3bc40d16115adaaf0f.jpg",
    selected: false,
  },
  {
    url: "",
    selected: false,
    blank: true,
  },
]);

const toggleSelect = async (index: number) => {
    if(images.value[index].blank){
        currentBlank.value = await requestFileUploadTokenPromise() as string;
        showSpeedPopupChildFlag.value = true;
        return;
    }
  images.value[index].selected = !images.value[index].selected;
};

const selectSpeedFn = (speed: number) => {
  selectedSpeed.value = speed;
};

const CancelSpeed = () => {
  selectedSpeed.value = resultSelected.value
  showSpeedPopup.value = false;

};

const ConfirmSpeed = () => {
  resultSelected.value = selectedSpeed.value;
  showSpeedPopup.value = false;
};

const deleteImages = () => {

  let currentSelected: any = images.value.filter((image) => image.selected);
  let noDeleteSelected: any = images.value.filter((image) => !image.selected);

  if (currentSelected.length >= 2) {
    showToast({
      message: "最多删除一张图片",

      duration: 2000,
    });
    return;
  }

  if (noDeleteSelected.length < 2) {
    console.log("noDeleteSelected", noDeleteSelected)
    showToast({
      message: "请至少保留一张图片",
      duration: 2000,
    });
    return;
  }
  images.value = noDeleteSelected;

  editing.value = false;
};


const handleClosePopup = (value:boolean) => {
    console.log(value,'value---------')
//   showSpeedPopupChildFlag.value = false;
}

const handleConfirmSpeed = (value:boolean)=> {
//   resultSelected.value = speed;
    console.log(value,'value---------')
//   showSpeedPopupChildFlag.value = false;
}

</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1/1;
}
</style>
