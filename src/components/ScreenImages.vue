<template>
  <div v-if="props.showSpeedPopupChild" class="fixed inset-0 bg-black bg-opacity-50 z-50">
    <van-popup
      v-model:show="props.showSpeedPopupChild"
      position="bottom"
      :style="{ height: '80%' }"
    >
      <van-loading
        v-if="childFlagLoading"
        class="global-loading"
        type="spinner"
        color="#fff"
        text="..."
      ></van-loading>
      <div class="text-center text-lg font-medium mb-4 flex">
        <div
          :class="[
            currentTabValue === 1
              ? 'p-4 font-[16] font-500 text-gray-900'
              : 'p-4 font-[16] font-500 text-gray-400',
          ]"
          @click="switchTab(1)"
        >
          {{ language.myFavorites }}
        </div>
        <div
          :class="[
            currentTabValue === 2
              ? 'p-4 font-[16] font-500 text-gray-900'
              : 'p-4 font-[16] font-500 text-gray-400',
          ]"
          @click="switchTab(2)"
        >
          {{ language.myWorks }}
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
              @click="ConfirmWork(image, index)"
              v-if="image.url && !image?.blank"
              :src="image.url"
              class="w-40 h-20 object-cover rounded border-4 border-gray-900"
              alt=""
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col justify-end items-center p-10 margin-bottom-20">
        <button
          @click="CancelImgSelectedFn"
          class="w-full bg-white h-[48] font-500 py-4 shadow-lg rounded-full border-1 border-black"
        >
          {{ language.cancel }}
        </button>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, reactive } from "vue";
import { showToast } from "vant";
import { gArtifactPage, gFavoritePage } from "@/request/screensaver";

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

const language = reactive({
  myFavorites: JeeWeb && JeeWeb.Language === "zh-CN" ? "我的收藏" : "My Favorites",
  myWorks: JeeWeb && JeeWeb.Language === "zh-CN" ? "我的作品" : "My Works",
  cancel: JeeWeb && JeeWeb.Language === "zh-CN" ? "取消" : "Cancel",
});

const selectedSpeed = ref(5);
const childFlagLoading = ref(false);
let currentTabValue = ref<number>(1);

const switchTab = (index: number) => {
  currentTabValue.value = index;
  imagesAll.value = [];
  if (index === 1) {
    childFlagLoading.value = true;
    gFavoritePage(props.token)
      .then((res: any) => {
        if (res.data.result.list.length > 0) {
          res.data.result.list.forEach((item: any) => {
            imagesAll.value.push({
              url: item.cover,
              selected: false,
              fileType: item.type,
              fileSize: item.type === 0 || item.type === 2 ? 1024 : item.fileSize,
              binFileUrl: item.binFileUrl,
            });
          });
          childFlagLoading.value = false;
          return;
        }
        childFlagLoading.value = false;
      })
      .catch((err) => {
        childFlagLoading.value = false;
        console.log(err, "err");
      });
  } else if (index === 2) {
    childFlagLoading.value = true;
    gArtifactPage(props.token)
      .then((res: any) => {
        if (res.data.result.list.length > 0) {
          res.data.result.list.forEach((item: any) => {
            imagesAll.value.push({
              url: item.cover,
              selected: false,
              fileType: item.type,
              fileSize: item.type === 0 || item.type === 2 ? 1024 : item.fileSize,
              binFileUrl: item.binFileUrl,
            });
          });
          childFlagLoading.value = false;
          return;
        }
        childFlagLoading.value = false;
      })
      .catch((err) => {
        childFlagLoading.value = false;
        console.log(err, "err");
      });
  }
};

const CancelImgSelectedFn = () => {
  emit("close-popup", {
    cancelFlag: true,
    status: false,
  });
};

const ConfirmWork = (image: any, index: number) => {
  emit("close-popup", {
    image,
    status: false,
  });
};

const emit = defineEmits(["close-popup", "confirm-speed"]);

watch(
  () => selectedSpeed.value,
  (newValue) => {
    emit("confirm-speed", newValue);
  }
);

let imagesAll = ref<any>([]);
watch(
  () => props.showSpeedPopupChild,
  (newValue) => {
    childFlagLoading.value = true;
    if (newValue) {
      gFavoritePage(props.token)
        .then((res: any) => {
          if (res.data.result.list.length > 0) {
            res.data.result.list.forEach((item: any) => {
              imagesAll.value.push({
                url: item.cover,
                selected: false,
                type: item.type,
                fileSize: item.type === 0 || item.type === 2 ? 1024 : item.fileSize,
                binFileUrl: item.binFileUrl,
              });
            });
            childFlagLoading.value = false;
            return;
          }
          childFlagLoading.value = false;
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
