<template>
  <Modal>
    <div class="give-modal">
      <template v-if="follow == 0">
        <div class="title">路径规划中</div>
        <div class="but">
          <div class="count-down">
            <div class="background"></div>
          </div>
        </div>
      </template>
      <template v-if="follow != 0">
        <div class="follow-model">
          <div class="give-first">
            <img class="load-img" v-if="!planningResultList[0]" src="../../assets/images/excavator/countDown.png" />
            <img
              class="result-img"
              v-else
              :src="`../../assets/images/excavator/${
                planningResultList[0].includes('规划成功') ? 'success' : 'error'
              }.png`"
            />
            <div class="text">{{ planningResultList[0] || '路径规划中' }}(1/2)</div>
          </div>
          <div class="give-first">
            <img class="load-img" v-if="!planningResultList[1]" src="../../assets/images/excavator/countDown.png" />
            <img
              class="result-img"
              v-else
              :src="`../../assets/images/excavator/${
                planningResultList[1].includes('规划成功') ? 'success' : 'error'
              }.png`"
            />
            <div class="text">{{ planningResultList[1] || '路径规划中' }}(2/2)</div>
          </div>
        </div>
      </template>
      <div v-if="showButton" class="btn-box">
        <button-dialog type="orange" class="confirm" @click="confirm">确定</button-dialog>
      </div>
      <div v-else class="move-box" @touchmove="touchmove">
        <div class="move-btn" @touchstart="touchstart" @touchend="touchend"></div>
        <div class="move-text">滑动中断规划</div>
        <div class="move-back"></div>
      </div>
    </div>
  </Modal>
</template>
<script>
  import { sendSocket } from '@/utils/utils';
  export default {
    name: 'giveModal',
    data() {
      return {
        left: 0,
        move: false,
        clientX: 0,
      };
    },
    computed: {
      follow() {
        return this.$store.state.excavator.follow;
      },
      planningResultList() {
        return this.$store.state.excavator.planningResultList;
      },
      showButton() {
        return this.planningResultList[0] && this.planningResultList[1];
      },
    },
    methods: {
      confirm() {
        this.$emit('hideShowModel');
      },
      // 移动
      touchmove(event) {
        if (this.move) {
          let max = document.querySelector('.move-box').offsetWidth - document.querySelector('.move-btn').offsetWidth;
          let x = event.touches[0].clientX - this.clientX;
          this.left = `${x > 0 ? (x > max ? max : x) : 0}px`;
        }
      },
      // 手指摁下
      touchstart(e) {
        this.clientX = e.touches[0].clientX;
        this.move = true;
      },
      // 手指松开
      touchend(e) {
        if (!document.querySelector('.move-box')) return false;
        let max = document.querySelector('.move-box').offsetWidth - document.querySelector('.move-btn').offsetWidth;
        if (max - parseInt(this.left) < 20) {
          this.left = `${max}px`;
          // this.$toast({ title: '中断成功', icon: 'none' });
          sendSocket({
            type: 'breakoffPlanning',
          });
        } else {
          this.left = 0;
        }
        this.move = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  // @keyframes ROTATEY {
  //   0% {
  //     transform: rotateZ(360deg);
  //   }
  //   100% {
  //     transform: rotateZ(0deg);
  //   }
  // }
  .give-modal {
    width: 480px;
    height: 280px;
    background-image: url('../../assets/images/messagebg.png');
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .follow-model {
      margin-top: 50px;
      margin-bottom: 50px;
      .give-first {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        // .load-img {
        //   width: 30px;
        //   height: 30px;
        //   animation: ROTATEY 1s linear infinite;
        // }
        .result-img {
          width: 30px;
          height: 30px;
        }
        .text {
          color: #fff;
          margin-left: 10px;
          font-size: 25px;
        }
      }
    }
    .title {
      // display: flex;
      display: flex;
      justify-content: center;
      // justify-content: center;
      // align-items: center;
      font-size: 28px;
      font-family: PingFang SC Regular, PingFang SC Regular-Regular;
      font-weight: 400;
      text-align: center;
      color: #f2f2f2;
      padding-bottom: 24px;
      padding-top: 39px;
      box-sizing: border-box;
    }
    .but {
      display: flex;
      justify-content: center;
    }
    .count-down {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .background {
        width: 100%;
        height: 100%;
        background: url('@/assets/images/excavator/countDown.png') no-repeat;
        background-size: 100% 100%;
        animation: ROTATEY 1s linear infinite;
        position: absolute;
        left: 0;
        top: 0;
      }
      .time {
        position: relative;
        z-index: 1;
        font-size: 24px;
        color: #70a7b3;
      }
    }
    .move-box {
      width: 320px;
      height: 50px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid #ea1414;
      margin-top: 20px;
      margin-left: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ff2323;
      font-size: 20px;
      position: relative;
      .move-btn {
        width: 60px;
        height: 50px;
        background: url('@/assets/images/excavator/slider.png');
        background-size: 100%;
        position: absolute;
        left: v-bind(left);
        top: 0;
      }
      .move-back {
        width: v-bind(left);
        height: 50px;
        background: rgba(234, 20, 20, 0.5);
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    .btn-box {
      display: flex;
      justify-content: center;
    }
  }
</style>
