<template>
  <div class="ex-header">
    <div v-for="(item, index) in parkAllocationStatus" :key="index" @click="activeItem(index, item)" class="ex-content">
      <div :class="`ex_content ${index == clickIndex && 'content-active'}`">
        <div class="header">
          <div class="headerleft">
            <img :src="getAssetsFile('images/excavator/carIcon.png')" class="car" />
            <div class="text"><ScrollText :text="item.name" /></div>
          </div>
          <div class="headerright">
            <img class="icon" :src="getAssetsFile('images/excavator/modal.png')" />
            <span class="text">{{ item.mode }}</span>
          </div>
        </div>
        <div class="center">
          <template v-if="item.from == '8b01'">
            <div :class="`centerleft ${item.occupy == 0 && 'center-left-open'}`">
              <span class="text">{{ item.occupy == 0 ? toLang('open') : toLang('occupy') }}</span>
            </div>
            <div class="centerleft-right"></div>
          </template>
          <div
            :class="`centerright ${item.task && item.task.length > 5 && 'centerright-small'} ${
              item.from != '8b01' && 'centerright-auto'
            }`"
          >
            <span>{{ item.task }}</span>
          </div>
          <template v-if="item.from == '8b01'">
            <div class="centerright-right"></div>
            <div class="prestop">
              <span>{{ toLang('preStop') }}</span>
            </div>
            <div :class="`close ${item.child_stop_open && 'close-open'}`">
              <span class="text">{{ item.child_stop_open ? toLang('on') : toLang('off') }}</span>
            </div>
          </template>
        </div>
        <div class="footer">
          <button-dialog
            type="red"
            :class="`red ${!(item.imei || (item.child_point && item.child_point.imei)) && 'orange-none'}`"
            @click="errorhandle1(item, index)"
          >
            {{ toLang('exception') }}
          </button-dialog>
          <button-dialog
            type="orange"
            :class="`orange ${item.from == '8b01' && item.imei && 'orange-none'}`"
            @click="point1(item, index)"
            v-if="showGivePointBtn"
          >
            {{ toLang('givePoint') }}
          </button-dialog>
        </div>
        <div></div>
        <div class="top">
          <img
            v-if="item.stop_num == 0"
            class="icon"
            :src="getAssetsFile(`images/excavator/${index == clickIndex ? 'triangle-active' : 'triangle'}.png`)"
          />
          <img
            v-else
            class="icon"
            :src="getAssetsFile(`images/excavator/${index == clickIndex ? 'rhombus-active' : 'rhombus'}.png`)"
          />
        </div>
      </div>
      <div class="stopReason" v-if="item.stopReason">
        <div class="top">
          <span>{{ toLang('parkingReason') }}</span>
        </div>
        <div class="bottom">
          <div v-for="(value, inde) in item.stopReason.split(',')" :key="inde">{{ value }}</div>
        </div>
      </div>
      <MessageModal v-if="showModal" :message="message" @confirm="confirm" @cancel="cancel" />
    </div>
  </div>
</template>

<script>
  import ScrollText from './scroll-text.vue';
  import MessageModal from '../components/messageModal.vue';
  import StepDistance from './stepDistance.vue';
  import { getAssetsFile } from '@/utils/utils';

  export default {
    name: 'backboard',
    props: {
      parkAllocationStatus: {
        type: Array,
        default: () => [],
      },
      givePointflag: {
        type: Boolean,
        default: false,
      },
      showGivePointBtn: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      stepDistanceMode() {
        return this.$store.state.excavator.stepDistanceFlag;
      },
    },
    components: {
      ScrollText,
      MessageModal,
    },
    watch: {
      parkAllocationStatus: {
        handler() {
          if (this.parkAllocationStatus.length == 1) this.clickIndex = 0;
        },
        deep: true,
      },
    },
    data() {
      return {
        clickIndex: 0,
        pointTask: ['道路预告', '排队等待', '驶入停靠', '停靠完成', '装载中'],
        message: '',
        showModal: false,
        activePointItem: {},
      };
    },
    methods: {
      getAssetsFile,
      activeItem(index, item) {
        if (this.givePointflag || this.stepDistanceMode) return false;
        this.clickIndex = index;
        this.$bus.$emit('setPointItem', item, index);
      },
      errorhandle1(item, index) {
        if (this.givePointflag) return false;
        if (this.clickIndex != index) {
          this.clickIndex = index;
          return this.$bus.$emit('setPointItem', this.parkAllocationStatus[index], index);
        }
        this.$emit('errorhandle');
      },
      confirm() {
        this.cancel();
        this.$bus.$emit('clickPoint', this.activePointItem);
        this.$bus.$emit('showPoint', this.activePointItem);
        this.$emit('point');
      },
      cancel() {
        this.showModal = false;
      },
      point1(item, index) {
        if (this.givePointflag || this.stepDistanceMode) return false;
        this.$store.commit('excavator/setAutoPointMode', false);

        if (this.clickIndex != index) {
          this.clickIndex = index;
          return this.$bus.$emit('setPointItem', this.parkAllocationStatus[index], index);
        }
        this.activePointItem = item;
        if (
          this.$store.state.excavator.checkRgnloadMode &&
          this.parkAllocationStatus[0].rgnloadMode != this.$store.state.excavator.rgnloadMode
        ) {
          this.showModal = true;
          this.message = '指点成功后将删除已有的停靠位信息，确认指点吗?';
          return;
        }
        this.confirm();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .ex-header {
    position: absolute;
    top: 46px;
  }
  .ex-content {
    position: relative;
  }

  .ex_content {
    width: 378px;
    height: 267px;
    background-image: url('@/assets/images/excavator/back.png');
    background-size: 100% 101%;
    background-repeat: no-repeat;
    position: relative;

    .header {
      position: absolute;
      top: 50px;
      left: 50px;
      display: flex;
      justify-content: space-between;
      padding: 0 31px 18px 3px;
      flex-wrap: nowrap;

      .headerleft {
        display: flex;
        justify-content: space-between;
        .car {
          width: 45px;
          height: 30px;
        }
        .text {
          width: 100px;
        }
      }
      .headerright {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        .icon {
          width: 30px;
          height: 30px;
        }
        .text {
          font-size: 20px;
          font-family: SourceHanSansCN, SourceHanSansCN-Regular;
          font-weight: 400;
          text-align: left;
          color: #ffffff;
        }
      }
    }

    .center {
      display: flex;
      justify-content: space-around;
      position: absolute;
      top: 103px;
      left: 54px;
      .centerleft {
        width: 70px;
        height: 34px;
        background: rgba(247, 22, 22, 0.2);
        border: 2px solid #f71616;
        // padding:31px 31px 18px 23px;

        text-align: center;
        line-height: 34px;
        margin-right: 5px;
        .text {
          font-size: 16px;
          font-family: SourceHanSansCN, SourceHanSansCN-Regular;
          font-weight: 400;
          text-align: left;
          color: #ff3030;
        }
      }
      .center-left-open {
        background: rgba(34, 208, 112, 0.2);
        border: 2px solid rgb(34, 208, 112);
        .text {
          color: #22d070;
        }
      }
      .centerleft-right {
        margin-top: 4px;
        margin-left: 5px;
        box-sizing: border-box;
        width: 2px;
        height: 28px;
        border-left: 2px solid #00fff0;
        background: linear-gradient(-90deg, #2e7ea0 0%);
        margin-right: 10px;
      }
      .centerright {
        font-size: 24px;
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: left;
        color: #00fff0;
        margin-right: 5px;
        min-width: 80px;
      }
      .centerright-auto {
        width: 282px;
        text-align: center;
      }
      .centerright-small {
        font-size: 16px;
        margin-top: 5px;
      }
      .centerright-right {
        margin-top: 4px;
        margin-right: 10px;
        box-sizing: border-box;
        width: 1px;
        height: 28px;
        border-left: 2px solid #00fff0;
        background: linear-gradient(-90deg, #2e7ea0 0%);
      }
      .prestop {
        margin-top: 5px;
        font-size: 16px;
        font-family: Source Han Sans CN, Source Han Sans CN-Regular;
        font-weight: 400;
        text-align: center;
        color: #70a7b3;
      }
      .close {
        width: 21px;
        height: 34px;
        border: 2px solid rgb(236, 40, 40);
        background: rgba(236, 40, 40, 0.2);
        margin-left: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        .text {
          font-size: 16px;
          font-family: Source Han Sans CN, Source Han Sans CN-Regular;
          font-weight: 400;
          color: #ec2828;
        }
      }
      .close-open {
        border: 2px solid rgb(34, 208, 112);
        background: rgba(34, 208, 112, 0.2);
        .text {
          color: rgb(34, 208, 112);
        }
      }
    }
    .footer {
      height: 61px;
      display: flex;
      justify-content: space-between;
      position: absolute;
      top: 170px;
      left: 55px;
      .red {
        width: 116px;
        height: 49px;
        margin-right: 25px;
      }
      .orange {
        width: 116px;
        height: 49px;
      }
      .orange-none {
        pointer-events: none;
        opacity: 0.3;
      }
    }
    .top {
      position: absolute;
      width: 44px;
      height: 44px;
      top: 30px;
      left: 30px;
      transform: translate(-50%, -50%);
      .icon {
        width: 100%;
        height: 100%;
      }
    }
  }
  .content-active {
    background-image: url('@/assets/images/excavator/backActive.png');
  }
  .stopReason {
    width: 132px;
    height: 200px;
    position: absolute;
    top: 35px;
    left: 360px;
    background-image: url('@/assets/images/excavator/stopCarBack.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .top {
      width: 110px;
      height: 20px;
      font-size: 20px;
      font-family: Source Han Sans CN, Source Han Sans CN-Regular;
      font-weight: 400;
      padding-left: 30px;
      box-sizing: border-box;
      // text-align: left;
      color: #ec2828;
      // text{
      // 	width: 100%;
      // }
    }
    .bottom {
      margin-top: 60px;
      width: 110px;
      height: 20px;
      font-size: 16px;
      font-family: Source Han Sans CN, Source Han Sans CN-Regular;
      font-weight: 400;
      // text-align: left;
      padding-left: 8px;
      box-sizing: border-box;
      color: #ffffff;
      // display: flex;
      text {
        display: block;
        margin-bottom: 10px;
      }
    }
  }
</style>
