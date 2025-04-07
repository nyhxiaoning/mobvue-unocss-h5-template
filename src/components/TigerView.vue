<template>
    <div style="margin-top: 20px;">



        <!-- Switch2HomeIndex -->
        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary"
                    @click="talSetHomeTaskParamsFn">设置游戏界面home参数(talSetHomeTaskParams)</van-button>
            </van-col>
        </van-row>

        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary"
                    @click="talGetHomeTaskParamsFn">获取游戏界面home参数(talGetHomeTaskParams)</van-button>
            </van-col>
        </van-row>


        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary" @click="talSetSlotGameRankFn">下发老虎机排名(talSetSlotGameRank)</van-button>
            </van-col>
        </van-row>

        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary" @click="talStartSlotGameFn">老虎机开始游戏(talStartSlotGame)</van-button>
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

CupDevice.onReceive((res) => {
    console.log('onReceive---实时上报', res)
    states.show = true
    states.message = JSON.stringify(res)
})


const talSetHomeTaskParamsFn = () => {
    console.log('talSetHomeTaskParams')
    states.curInterface = 'talSetHomeTaskParams'
    // 调用CupDevice的方法
    CupDevice &&
        CupDevice.setDevMessage({
            value: {
                method: 'talSetHomeTaskParams',
                params: {
                    value:"0,1110000000"
                }
            },
        })
        .then( res  => {

            states.show = true
            states.message = JSON.stringify(res)

            console.log('talSetHomeTaskParams', res)
        }).catch( err => {

            showToast({
                message: '设置失败' + states.curInterface,
                duration: 1000,
            });
            console.log('talSetHomeTaskParams error', err)
        })
}


const talGetHomeTaskParamsFn = () => {
    console.log('talGetHomeTaskParams')
    states.curInterface = 'talGetHomeTaskParams'
    // 调用CupDevice的方法
    CupDevice &&
        CupDevice.setDevMessage({
            value: {
                method: 'talGetHomeTaskParams',
                params: {

                }
            },
        })
        .then( res  => {

            states.show = true
            states.message = JSON.stringify(res)

            console.log('talGetHomeTaskParams', res)
        }).catch( err => {

            showToast({
                message: '获取失败' + states.curInterface,
                duration: 1000,
            });
            console.log('talGetHomeTaskParams error', err)
        })
}


const talSetSlotGameRankFn = () => {
    console.log('talSetSlotGameRank')
    states.curInterface = 'talSetSlotGameRank'
    // 调用CupDevice的方法
    CupDevice &&
        CupDevice.setDevMessage({
            value: {
                method: 'talSetSlotGameRank',
                params: {
                    rank:1
                }
            },
        })
            .then(res => {
                console.log('talSetSlotGameRank', res)
                states.show = true
                states.message = JSON.stringify(res)

            }).catch(err => {
                console.log('talSetSlotGameRank error', err)
                showToast({
                    message: '设置失败' + states.curInterface,
                    duration: 1000,
                });

            })
}


const talStartSlotGameFn = () => {
    console.log('talStartSlotGame')
    states.curInterface = 'talStartSlotGame'
    // 调用CupDevice的方法
    CupDevice &&
        CupDevice.setDevMessage({
            value: {
                method: 'talStartSlotGame',
                params: {
                    "oneId": 0,
                    "twoId": 0,
                    "threeId": 0
                }
            }
        }).then(res => {
                console.log('talStartSlotGame', res)
                states.show = true
                states.message = JSON.stringify(res)
        }).catch(err => {
            console.log('talStartSlotGame error', err)
            showToast({
                message: '设置失败' + states.curInterface,
                duration: 1000,
            });
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
