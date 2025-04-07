<template>
  <div style="margin-top: 20px">
    <!-- 获取播放列表 -->
    <van-row justify="center" class="child">
      <van-col>
        <van-button type="primary" @click="talGetPlayListLenFn"
          >获取播放列表(talGetPlayListLen)</van-button
        >
      </van-col>
    </van-row>

    <van-row justify="center" class="child">
      <van-col>
        <van-button type="primary" @click="talSetPlayListFn(1)"
          >设置一张静态图片(talSetPlayList)</van-button
        >
      </van-col>
    </van-row>

    <van-row justify="center" class="child">
      <van-col>
        <van-button type="primary" @click="talSetPlayListFn(5)"
          >设置一张静态和动图图片(talSetPlayList完整测试:两张动图+一张静态图)</van-button
        >
      </van-col>
    </van-row>

    <van-dialog v-model:show="states.show" title="标题" show-cancel-button>
      <p>当前的接口：{{ states.curInterface }}</p>
      <p>返回值信息：{{ states.message }}</p>
    </van-dialog>
  </div>
</template>

<script setup>
import { showToast } from 'vant';
import {  reactive } from 'vue';


const states = reactive({
    show: false,
    message: '',
    curInterface: ''
})


const talGetPlayListLenFn = () => {
    console.log('talGetPlayListLen')
    states.curInterface = 'talGetPlayListLen'
    // 调用CupDevice的方法
    CupDevice &&
        CupDevice.setDevMessage({
            value: {
                method: 'talGetPlayListLen',
                params: {

                }
            },
        })
        .then( res  => {

            states.show = true
            states.message = JSON.stringify(res)

            console.log('talGetPlayListLen', res)
        }).catch( err => {

            showToast({
                message: '获取失败' + states.curInterface,
                duration: 1000,
            });
            console.log('talGetPlayListLen error', err)
        })
}


const talSetPlayListFn = (value) => {
    console.log('talSetPlayList')
    states.curInterface = 'talSetPlayList'
    if (value == 1) {
        // 调用CupDevice的方法
        CupDevice &&
        CupDevice.setDevMessage({
            value: {
                method: 'talSetPlayList',
                params: {
                    ListLen: 1,
                    isOrder: 1,   // 0: 乱序 1: 顺序
                    playTime0: 10,
                    content0: {
                        name: "cup_file.bin",
                        size: 1024,
                        type: "application/octet-stream",
                        url: "https://devstorage.jeejio.com/jeejio-debug/cup/6a821bb2-dbc2-46bc-ab11-79e4d458dd81_cup_file.bin"
                    }
                }
            }
        }).then(res => {
            states.show = true
            states.message = JSON.stringify(res)
        }).catch(err => {
            showToast({
                message: '设置失败' + states.curInterface,
                duration: 1000,
            });
            console.log('talSetPlayList error', err)
     })
    }else if (value == 5) {
        // 调用CupDevice的方法
        CupDevice &&
        CupDevice.setDevMessage({
            value: {
                method: 'talSetPlayList',
                params: {
                    ListLen: 3,
                    isOrder: 1,   // 0: 乱序 1: 顺序
                    playTime0: 10,
                    content0: {
                        size: 48855,
                        type: "image/gif",
                        url: "https://devstorage.jeejio.com/jeejio-debug/cup/gif/5.gif"
                    },
                    playTime1: 10,
                    content1: {
                        size: 41664,
                        type: "image/gif",
                        url: "https://devstorage.jeejio.com/jeejio-debug/cup/gif/6.gif"
                    },
                    playTime2: 10,
                    content2: {
                        name: "cup_file.bin",
                        size: 1024,
                        type: "application/octet-stream",
                        url: "https://devstorage.jeejio.com/jeejio-debug/cup/6a821bb2-dbc2-46bc-ab11-79e4d458dd81_cup_file.bin"
                    }
                }
            }
        }).then(res => {
            states.show = true
            states.message = JSON.stringify(res)
        }).catch(err => {
            showToast({
                message: '设置失败' + states.curInterface,
                duration: 1000,
            });
            console.log('talSetPlayList error', err)
     })
    }


}
</script>

<style scoped>
.child {
  background-color: lightblue;
  margin-bottom: 30px;
}

.child:last-child {
  margin-bottom: 0;
}
</style>
