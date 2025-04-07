<template>
    <div style="margin-top: 20px;">

        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary"   @click="talSetCountDownConfigFn()">设置倒计时(talSetCountDownConfig：60分钟)</van-button>
            </van-col>
        </van-row>

                <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary"  @click="talGetCountDownInfoFn()">获取倒计时(talGetCountDownInfoFn：)</van-button>
            </van-col>
        </van-row>

        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary"  @click="talSetCountDownActionFn(1)">开始倒计时(talSetCountDownAction)</van-button>
            </van-col>
        </van-row>

        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary" @click="talSetCountDownActionFn(2)">暂停倒计时(talSetCountDownAction)</van-button>
            </van-col>
        </van-row>

        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary" @click="talSetCountDownActionFn(3)">继续倒计时(talSetCountDownAction)</van-button>
            </van-col>
        </van-row>

        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary" @click="talSetCountDownActionFn(4)">重置倒计时(talSetCountDownAction)</van-button>
            </van-col>
        </van-row>


        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary" @click="talSetCountDownActionFn(5)">结束倒计时(talSetCountDownAction)</van-button>
            </van-col>
        </van-row>

        <van-row justify="center" class="child">
            <van-col>
                <van-button type="primary" @click="talSetCountDownActionFn(6)">退出倒计时(talSetCountDownAction)</van-button>
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
        <div>
            <button @click="jumpNewTalFn(1)" style="display: flex; font-size: 16px; margin-bottom: 5px; margin-left:10px">
                点击跳转到其他的新的老虎机接口
            </button>
            <p> </p>
            <button @click="jumpNewTalFn(2)" style="display: flex; font-size: 16px; margin-bottom: 5px; margin-left:10px">
                点击跳转到其他的新的播放屏保接口
            </button>

        </div>

    </div>

</template>

<script setup>
import { showToast } from 'vant';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const states = reactive({
    show: false,
    message: '',
    curInterface: ''
})

const router = useRouter();


CupDevice.onReceive((res) => {
    console.log('onReceive---实时上报', res)
    states.show = true
    states.message = JSON.stringify(res)
})

const talGetCountDownInfoFn = () => {
    console.log('talGetCountDownInfo')
    states.curInterface = 'talGetCountDownInfo'
    // 调用CupDevice的方法
    CupDevice &&
        CupDevice.setDevMessage({
            value: {
                method: 'talGetCountDownInfo'
            },
        })
          .then((res) => {
                console.log('talGetCountDownInfo', res)
                states.show = true
                states.message = JSON.stringify(res)
            }).catch(err => {
                console.log('talGetCountDownInfo error', err)
                showToast({
                    message: '获取失败' + states.curInterface,
                    duration: 1000,
                });
            })

}

const talSetCountDownConfigFn = () => {
    console.log('talSetCountDownConfig')
    states.curInterface = 'talSetCountDownConfig'
    // 调用CupDevice的方法
    CupDevice &&
        CupDevice.setDevMessage({
            value: {
                method: 'talSetCountDownConfig',
                params: {
                "rolling": true,
                "sec":0,
                "hour": 1,
                "text": "JEEJIO",
                "min": 0
                },
            },
        }).then(res => {
                console.log('talSetCountDownConfig', res)
                states.show = true
                states.message = JSON.stringify(res)

            }).catch(err => {
                console.log('talSetCountDownConfig error', err)
                showToast({
                    message: '设置失败' + states.curInterface,
                    duration: 1000,
                });
            })
}


/**
 * 开始倒计时
 * @param action 1:开始 2:暂停 3继续，4重置，5结束，6退出
 */
const talSetCountDownActionFn = ( value ) => {
    console.log('talSetCountDownAction')
    states.curInterface = 'talSetCountDownAction'
    // 调用CupDevice的方法
    CupDevice &&
        CupDevice.setDevMessage({
            value: {
                method: 'talSetCountDownAction',
                params: {
                    action: value
                },
            },
        })
         .then(res => {
                console.log('talSetCountDownAction', res)
                states.show = true
                states.message = JSON.stringify(res)
         }).catch(err => {
                console.log('talSetCountDownAction error', err)

                showToast({
                    message: '倒计时' + states.curInterface,
                    duration: 1000,
                });
            })
}

        function jumpNewTalFn(value) {
            if(value == 1){
                router.push('/tigerview');
            }else if(value == 2){
                router.push('/playlist');
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
