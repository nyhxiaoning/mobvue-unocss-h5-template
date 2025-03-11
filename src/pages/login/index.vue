<script setup lang="ts">
import imgTab from "./../../assets/img.png"
import wordTab from "./../../assets/word.png"
</script>

<template>
  <div class="container mx-auto   items-center flex flex-col h-screen bg-gray-200 p-4">
    <div class="flex space-x-4 mb-4 w-full">
      <!-- <button className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 rounded-xl py-2 px-4 rounded button-with-triangle"> -->
      <div class="flex-1 bubble py-3 px-8 rounded">
        <span class="inline-flex items-center">
          <img :src="wordTab" alt="文字图标" class="w-4 h-4 mr-2">
          文字生图
        </span>
      </div>
      <div class="flex-1 bubble py-3 px-8 rounded">
        <span class="inline-flex items-center">
          <img :src="imgTab" alt="图片图标" class="w-4 h-4 mr-2">
          图片生图
        </span>
      </div>
      <!-- </button> -->
    </div>

    <div class="bg-white border border-gray-300 rounded p-4 w-full ">
      <div class="flex justify-between items-center mb-2">
        <span class="text-gray-800">画面关键词</span>
        <span class="text-gray-600">0/100</span>
      </div>
      <textarea
        placeholder="点击输入文字"
        className="w-full  h-[100px] focus:outline-none resize-none p-2"
      />
      <div class="flex justify-end mt-2 position-relative">
        <button class="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex justify-center items-center">
          <img src="https://via.placeholder.com/12x12" alt="麦克风图标" class="w-4 h-4">
        </button>
      </div>
    </div>

    <div class="text-center fixed bottom-10">
      <button class="bg-[#D7D7D7]  rounded-full text-white  py-2 px-4 rounded w-80 disabled:opacity-50">
        生成像素图
      </button>
    </div>
  </div>
</template>

<style scoped>
.bubble {
  padding: 20px 20px;
  border-radius: 20px;
  position: relative;
  box-sizing: border-box;
  flex-shrink: 0;
  font-size: 15px;
  background: #ffffff;
  border: 1px solid #ffffff;
  color: #725e47;
  font-weight: 600;
}

.bubble:after,
.bubble:before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-top-color: #ffffff;
  left: 45%;
  margin-left: 0px;
  bottom: -20px;
}

.bubble:after {
  border-top-color: #ffffff;
  bottom: -20px;
}
</style>
