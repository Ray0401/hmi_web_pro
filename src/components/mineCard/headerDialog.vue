<template>
  <div class="contentheader">
    <div class="headerleft">
      <template v-if="!currencyTerminal">
        <div class="headerleft-left">
          <img :src="carIconArr[headerListData.carindex]" mode="heightFix" class="caricon" />
          <div class="loadtextbox" v-if="headerListData.option != ''">{{ headerListData.option }}</div>
          <span class="loadareatext" v-if="headerListData.area != ''">{{ headerListData.area }}</span>
          <div class="collectArea" v-if="collectArea">
            <img src="../../assets/images/collectMode.png" class="collect-mode" />
            <span class="collectAreaText">{{ collectArea }}</span>
          </div>
        </div>
        <div class="headerleft-right" v-if="headerListData.oretext != ''">
          <img :src="headerListData.materialicon" alt="" class="oreicon" v-if="headerListData.oreicon != ''" />
          <span class="oretext">{{ headerListData.oretext }}</span>
        </div>
      </template>
    </div>
    <!-- 预警终端的tage的logo -->
    <!-- <div class="tagelogo" v-else>
      <img :src="tagelogo" mode="heightFix" class="tagelogo" />
    </div> -->

    <div class="headermiddle">
      <img
        src="../../assets/images/speedLimitLuminous.png"
        v-if="Number(headerListData.realspeed) > Number(limitSpeed)"
        class="overspeedIcon"
      />
      <div class="speedtext" :class="Number(headerListData.realspeed) > Number(limitSpeed) ? 'speedcolor1' : ''">
        {{ headerListData.realspeed }}
      </div>
      <div class="speedcircle">{{ limitSpeed }}</div>
    </div>
    <div :class="`headerright ${currencyTerminal && 'header-right'}`">
      <div class="headerright-left" v-if="!currencyTerminal">
        <img :src="stateArr[headerListData.state].icon" class="stateicon" />
        <div class="text"><ScrollText :text="headerListData.stateText" /></div>
      </div>
      <RtkState :headerListData="headerListData" />
    </div>
  </div>
</template>

<script>
  import { carIconArr, stateArr } from './data';
  import RtkState from '../mineCard/rtkstate.vue';
  import ScrollText from '../excavator/scroll-text.vue';
  import Iframe from '../components/iframe.vue';
  export default {
    name: 'headerDialog',
    props: {
      headerListData: {
        type: Object,
        default: () => {},
      },
      currencyTerminal: {
        type: Boolean,
        default: false,
      },
    },
    components: {
      ScrollText,
      RtkState,
      Iframe,
    },
    computed: {
      limitSpeed() {
        return this.$store.state.sensorCollectState == '采集中'
          ? this.$store.state.carInfo?.sensorCollectSpeedLimit || 20
          : this.headerListData.maxspeed;
      },
      collectArea() {
        return this.$store.state.collectArea;
      },
    },
    data() {
      return {
        carIconArr,
        tagelogo: '/assets/images/preWarningTernimal/logo.png',
        stateArr,
      };
    },
    onLoad() {},

    mounted() {},
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .contentheader {
    position: absolute;
    width: 100%;
    height: 40px;
    @include beveled-all-corners(#5a5b60, 0, 0, 15px, 15px);
    padding: 0 6px 6px 6px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;

    .headerleft {
      padding: 5px 15px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      flex: 1;
      @include beveled-all-corners(#14171f, 0, 15px, 0, 15px);

      .headerleft-left {
        display: flex;
        height: 100%;
        align-items: center;

        .caricon {
          width: 36px;
          height: 24px;
        }

        .loadtextbox {
          background-image: url('@/assets/images/arrowicon.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          width: 66px;
          height: 24px;
          text-align: center;
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .loadareatext {
          margin-left: 8px;
          font-size: 16px;
          font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
          font-weight: 500;
          text-align: center;
          color: #ffffff;
        }
      }
      .collectArea {
        margin-left: 40px;
        display: flex;
        align-items: center;
        .collect-mode {
          width: 16px;
          height: 16px;
          margin-right: 5px;
        }
        .collectAreaText {
          font-size: 16px;
          font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
          font-weight: 500;
          text-align: left;
          color: #ffffff;
        }
      }
      .headerleft-right {
        display: flex;
        align-items: center;
        .oreicon {
          width: 31px;
          height: 13px;
          margin-right: 8px;
        }

        .oretext {
          font-size: 16px;
          font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
          font-weight: 500;
          text-align: left;
          color: #ffffff;
        }
      }
    }

    .tagelogo {
      width: 40%;
      height: 29px;
      margin-left: 8px;
      margin-top: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .headermiddle {
      background-image: url('@/assets/images/carspeedbackg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 248px;
      height: 75px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      .speedtext {
        font-size: 42px;
        font-family: Helvetica Neue Medium, Helvetica Neue Medium-Medium;
        font-weight: 500;
        text-align: center;
        color: #ffffff;
        line-height: 50px;
      }

      .speedcolor1 {
        color: #ff1a1a;
      }

      .speedcircle {
        width: 30px;
        height: 30px;
        background: #ffffff;
        border: 3px solid #ff2f2f;
        border-radius: 100%;
        box-sizing: border-box;
        text-align: center;
        line-height: 24px;
        font-size: 12px;
        font-family: DIN Alternate Bold, DIN Alternate Bold-Bold;
        font-weight: 700;
        color: #131519;
        margin-top: 10px;
      }

      .overspeedIcon {
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 100px;
        height: 60px;
      }
    }

    .headerright {
      @include beveled-all-corners(#20262d, 15px, 0, 15px, 0);
      padding: 0 0px 0 15px;
      display: flex;
      align-items: center;
      flex: 1;
      box-sizing: border-box;
      height: 100%;
      justify-content: space-between;

      .headerright-left {
        display: flex;
        align-items: center;
        .stateicon {
          width: 12px;
          height: 12px;
          margin-right: 6px;
        }

        .statetext {
          font-size: 16px;
          font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
          font-weight: 500;
          text-align: center;
          color: #ffffff;
        }
        .text {
          max-width: 80px;
          height: 30px;
          ::v-deep .scroll-content {
            font-size: 16px;
          }
        }
      }
    }
    .header-right {
      justify-content: flex-end;
    }
  }
</style>
