<template>
    <div style="margin-top: 20px;">



        <!-- Switch2HomeIndex -->
        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary"
                    @click="Switch2HomeIndex">切换当前的Home页面小应用展示1-5随机(talSwitch2HomeIndex)</van-button>
            </van-col>
        </van-row>

        <!-- getWifiInfo -->
        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary" @click="talGetWifiInfoFn">获取WIFI信息(talGetWifiInfo)</van-button>
            </van-col>
        </van-row>

        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary" @click="talGetSwitchFn">获取屏幕开关状态(talGetSwitch)</van-button>
            </van-col>
        </van-row>

        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary" @click="talGetCupTemperatureFn">获取水杯温度(talGetCupTemperature)</van-button>
            </van-col>
        </van-row>

        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary" @click="talGetBatteryLevelFn">获取电池电量(talGetBatteryLevel)</van-button>
            </van-col>
        </van-row>

        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary" @click="talGetBrightnessFn">获取屏幕亮度(talGetBrightness)</van-button>
            </van-col>
        </van-row>


        <van-dialog v-model:show="states.show" title="标题" show-cancel-button>
            <p>
                当前的接口：{{ states.curInterface }}
            </p>
            <p>
                返回值信息：{{ states.message }}
            </p>

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


const Switch2HomeIndex = () => {
    console.log('Switch2HomeIndex')
    states.curInterface = 'talSwitch2HomeIndex'
    // 调用CupDevice的方法
    CupDevice &&
        CupDevice.setDevMessage({
            value: {
                method: 'talSwitch2HomeIndex',
                params: {
                    // 传递参数
                    index: Math.ceil(Math.random() * 5)
                }
            },
        })
        .then( res  => {

            states.show = true
            states.message = JSON.stringify(res)

            console.log('Switch2HomeIndex', res)
        }).catch( err => {

            showToast({
                message: '获取失败' + states.curInterface,
                duration: 1000,
            });
            console.log('Switch2HomeIndex error', err)
        })
}


const talGetWifiInfoFn = () => {
    console.log('talGetWifiInfo')
    states.curInterface = 'talGetWifiInfo'
    // 调用CupDevice的方法
    CupDevice &&
        CupDevice.setDevMessage({
            value: {
                method: 'talGetWifiInfo'
            },
        })
            .then(res => {
                console.log('talGetWifiInfo', res)
                states.show = true
                states.message = JSON.stringify(res)

            }).catch(err => {
                console.log('talGetWifiInfo error', err)
                showToast({
                    message: '获取失败' + states.curInterface,
                    duration: 1000,
                });
            })
}

const talGetSwitchFn = () => {
    console.log('talGetSwitch')
    states.curInterface = 'talGetSwitch'
    // 调用CupDevice的方法
    CupDevice &&
        CupDevice.setDevMessage({
            value: {
                method: 'talGetSwitch'
            },
        })
            .then(res => {
                console.log('talGetSwitch', res)
                states.show = true
                states.message = JSON.stringify(res)

            }).catch(err => {
                console.log('talGetSwitch error', err)
                showToast({
                    message: '获取失败' + states.curInterface,
                    duration: 1000,
                })
            })
}

const talGetCupTemperatureFn = () => {
    console.log('talGetCupTemperature')
    states.curInterface = 'talGetCupTemperature'
    // 调用CupDevice的方法
    CupDevice &&
        CupDevice.setDevMessage({
            value: {
                method: 'talGetCupTemperature'
            },
        })
           .then(res => {
               console.log('talGetCupTemperature', res)
               states.show = true
               states.message = JSON.stringify(res)
           }).catch(err => {
               console.log('talGetCupTemperature error', err)
               showToast({
                   message: '获取失败' + states.curInterface,
                   duration: 1000,
               })
           })
}

const talGetBatteryLevelFn = () => {
    console.log('talGetBatteryLevel')
    states.curInterface = 'talGetBatteryLevel'
    // 调用CupDevice的方法
    CupDevice &&
        CupDevice.setDevMessage({
            value: {
                method: 'talGetBatteryLevel'
            },
        })
            .then(res => {
                console.log('talGetBatteryLevel', res)
                states.show = true
                states.message = JSON.stringify(res)
            }).catch(err => {
                console.log('talGetBatteryLevel error', err)
                showToast({
                    message: '获取失败' + states.curInterface,
                    duration: 1000,
                })
            })
}

const talGetBrightnessFn = () => {
    console.log('talGetBrightness')
    states.curInterface = 'talGetBrightness'
    // 调用CupDevice的方法
    CupDevice &&
        CupDevice.setDevMessage({
            value: {
                method: 'talGetBrightness'
            },
        })
           .then(res => {
               console.log('talGetBrightness', res)
                states.show = true
                states.message = JSON.stringify(res)
              }).catch(err => {
                console.log('talGetBrightness error', err)
                showToast({
                     message: '获取失败' + states.curInterface,
                     duration: 1000,
                })
           })
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
