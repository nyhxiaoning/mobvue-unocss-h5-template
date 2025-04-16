<template>
  <div v-if="props.showSpeedPopupChild" class="fixed inset-0 bg-black bg-opacity-50 z-50">
    <van-loading
      v-if="childFlagLoading"
      class="global-loading"
      type="spinner"
      color="#fff"
      text="..."
    ></van-loading>
    <!-- <div class="bg-white rounded-t-xl flex flex-col" @click.stop> -->

    <van-popup
      v-model:show="props.showSpeedPopupChild"
      position="bottom"
      :style="{ height: '80%' }"
    >
      <div class="text-center text-lg font-medium mb-4 flex">
        <div :class="[currentTabValue === 1?'p-4 font-[16] font-500 text-gray-900':'p-4 font-[16] font-500 text-gray-400']" @click="switchTab(1)">
          我的收藏
        </div>
        <div  :class="[currentTabValue === 2?'p-4 font-[16] font-500 text-gray-900':'p-4 font-[16] font-500 text-gray-400']" @click="switchTab(2)">
          我的作品
        </div>
      </div>
      <div class="flex-1 p-4 h-[400px] overflow-scroll">
        <div v-if="imagesAll.length" class="grid grid-cols-2 gap-4 h-[300px]">
          <div
            v-for="(image, index) in imagesAll"
            :key="index"
            class="relative bg-white rounded-xl p-4 flex items-center justify-center border-4 border-gray-900 aspect-w-2 aspect-h-1 border-4 border-gray-900"
          >
            <img
              v-if="image.url && !image?.blank"
              :src="image.url"
              class="w-40 h-20 object-cover rounded border-4 border-gray-900"
              alt=""
            />
            <!-- 状态图标 -->
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
      </div>
      <div class="flex flex-col justify-end items-center p-10 margin-bottom-20">
        <button
          @click="CancelImgSelectedFn"
          class="w-full bg-white h-[48] font-500 py-4 shadow-lg rounded-full border-1 border-black"
        >
          取消
        </button>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { showToast } from "vant";
import { requestFileUploadTokenPromise } from "@/utils/tools";
import { gArtifactPage, gFavoritePage } from "@/request/screensaver";
// 定义 props
const props = defineProps({
  token: {
    type: String,
    default: "",
  },
  showSpeedPopupChild: {
    type: Boolean,
    default: false,
  },
});

const selectedSpeed = ref(5);

const childFlagLoading = ref(false);

let currentTabValue = ref<number>(1);

const switchTab = (index: number) => {
  //   selectedSpeed.value = resultSelected.value;
  // 这里不应该修改 props 的值，而是通过事件通知父组件关闭弹窗
  currentTabValue.value = index;
  imagesAll.value = [];
  if (index === 1) {
    childFlagLoading.value = true;
    // 切换到我的收藏
    gFavoritePage(props.token)
      .then((res: any) => {
        console.log(res.data.result.list, "res");
        if (res.data.result.list.length > 0) {
          res.data.result.list.forEach((item: any) => {
            imagesAll.value.push({ url: item.fileUrl, selected: false });
          });
          childFlagLoading.value = false;
          return;
        }
        childFlagLoading.value = false;
        return;
      })
      .catch((err) => {
        childFlagLoading.value = false;
        console.log(err, "err");
      });
  } else if (index === 2) {
    childFlagLoading.value = true;
    // 切换到我的作品
    gArtifactPage(props.token)
      .then((res: any) => {
        console.log(res.data.result.list, "res");
        if (res.data.result.list.length > 0) {
          res.data.result.list.forEach((item: any) => {
            imagesAll.value.push({ url: item.fileUrl, selected: false });
          });
          childFlagLoading.value = false;
          return;
        }
        childFlagLoading.value = false;
        return;
      })
      .catch((err) => {
        childFlagLoading.value = false;
        console.log(err, "err");
      });
  }
};

const CancelImgSelectedFn = () => {
  emit("close-popup", false);
};

const ConfirmSpeed = () => {
  //   resultSelected.value = selectedSpeed.value;
  // 同样，通过事件通知父组件关闭弹窗
  // showSpeedPopup.value = false;
  emit("close-popup", true);
};

// const toggleSelect = (index: number) => {
//   imagesAll.value[index].selected = !imagesAll.value[index].selected;
// };

// 定义 emits 来通知父组件事件
const emit = defineEmits(["close-popup", "confirm-speed"]);

watch(
  () => selectedSpeed.value,
  (newValue) => {
    emit("confirm-speed", newValue);
  }
);

// 获取收藏和作品数据
// gArtifactPage().then((res:any)=>{
//   console.log(res,'res')
// })
//

let imagesAll = ref<any>([]);
let editing = ref(false);

watch(
  () => props.showSpeedPopupChild,
  (newValue) => {
    childFlagLoading.value = true;
    console.log(props.token, "props.token");
    console.log(props.showSpeedPopupChild, "props.showSpeedPopupChild");
    if (newValue) {
      gFavoritePage(props.token)
        .then((res: any) => {
          console.log(res.data.result.list, "res");
          if (res.data.result.list.length > 0) {
            res.data.result.list.forEach((item: any) => {
              imagesAll.value.push({ url: item.fileUrl, selected: false });
            });
            childFlagLoading.value = false;
            return;
          }
          childFlagLoading.value = false;
          return;
        })
        .catch((err) => {
          childFlagLoading.value = false;
          console.log(err, "err");
        });
    }
  }
);
</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1/1;
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
