<template>
  <div class="contentheader">
    <div class="header">
      <div class="headerleft">
        <!-- <div class="headerleft-left">
          <img :src="stateArr[headerListData.state].icon" class="stateicon" />
          <span class="statetext">{{ toLang(stateArr[headerListData.state].text) }}</span>
        </div> -->
        <div class="headerleft-middle" v-if="headerListData.area">
          <img :src="loadingArea" class="icon" />
          <span class="text">{{ headerListData.area }}</span>
        </div>
      </div>
      <RtkState :headerListData="headerListData" />
    </div>
  </div>
</template>

<script>
  import RtkState from '../mineCard/rtkstate.vue';
  import { getAssetsFile } from '@/utils/utils';
  export default {
    name: 'bullHeaderDialog',
    props: {
      headerListData: {
        type: Object,
        default: () => {},
      },
      currencyTerminal: {
        warn: {
          type: Boolean,
          default: false,
        },
      },
      currencyTerminal: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        loadingArea: getAssetsFile('images/loadingArea.png'),
        carIconArr: [
          getAssetsFile('images/unknown.png'),
          getAssetsFile('images/emptyLoad.png'),
          getAssetsFile('images/fullLoad.png'),
          getAssetsFile('images/halfLoad.png'),
          getAssetsFile('images/collectArea.png'),
        ],
        stateArr: [
          {
            icon: getAssetsFile('images/stateicon1.png'),
            text: '就绪',
          },
          {
            icon: getAssetsFile('images/stateicon3.png'),
            text: '延时',
          },
          {
            icon: getAssetsFile('images/stateicon2.png'),
            text: '故障',
          },
          {
            icon: getAssetsFile('images/stateicon4.png'),
            text: '备用',
          },
          {
            icon: getAssetsFile('images/stateicon5.png'),
            text: '未知',
          },
        ],
        clock: Date.parse(new Date()),
      };
    },
    onLoad() {},
    components: {
      RtkState,
    },
  };
</script>

<style lang="scss">
  @import '@/assets/css/common.scss';

  .contentheader {
    width: 100%;
    height: 40px;
    // box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.5);
    @include beveled-all-corners(#5a5b60, 0, 0, 15px, 15px);
    padding: 0 4px 4px 4px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 1;

    .header {
      width: 100%;
      // padding: 5px 37.5px 5px 35px;
      @include beveled-all-corners(#20262d, 0, 0, 13px, 13px);
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;

      .headerleft {
        // padding: 5px 37.5px 5px 35px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        // @include beveled-all-corners(#20262d, 0, 15px, 0, 15px);

        .headerleft-left {
          margin-left: 22px;
          display: flex;
          height: 100%;
          align-items: center;

          .stateicon {
            width: 12px;
            height: 12px;
            // background: #00dc94;
          }

          .statetext {
            margin-left: 15px;
            font-size: 16px;
            font-family: SourceHanSansCN;
            font-weight: Medium;
            text-align: left;
            color: #ffffff;
            margin-right: 20px;
          }
        }

        .headerleft-middle {
          display: flex;
          height: 100%;
          align-items: center;
          margin-left: 20px;

          .icon {
            width: 20px;
            height: 20px;
            // background: linear-gradient(0deg,rgba(3,0,0,0.26) 0%, rgba(255,255,255,0.26) 100%);
            // box-shadow: -2px 0px 0px 2px rgba(189,219,241,0.57) inset
          }

          .text {
            margin-left: 15px;
            font-size: 16px;
            font-family: SourceHanSansCN;
            font-weight: Medium;
            text-align: left;
            // color: #ffffff;
            color: white;
            margin-right: 40px;
          }
        }

        .headerleft-right {
          display: flex;
          height: 100%;
          align-items: center;
          image {
            width: 33px;
            height: 13px;
          }

          text {
            margin-left: 15px;
            font-size: 16px;
            font-family: SourceHanSansCN;
            font-weight: Medium;
            text-align: left;
            color: #ffffff;
            // margin-right: 40px;
          }
          .number {
            margin-left: 15px;
            font-size: 16px;
            font-family: SourceHanSansCN;
            font-weight: Medium;
            text-align: left;
            color: #ffffff;
            padding-left: 40px;
          }
        }
      }

      .headerright {
        display: flex;
        align-items: center;
        height: 100%;
        padding-right: 10px;
        box-sizing: border-box;
        font-size: 16px;

        .nowtime {
          // margin-left: 70.13px;
          font-family: DIN Alternate Bold, DIN Alternate Bold-Bold;
          font-weight: 700;
          text-align: center;
          color: #d7d7d7;
          margin-right: 27.5px;
        }

        .rtkstate {
          font-family: DIN Alternate Bold, DIN Alternate Bold-Bold;
          font-weight: 700;
          text-align: center;
          color: #d7d7d7;
          margin-right: 27px;
        }
        .network {
          font-family: DIN Alternate Bold, DIN Alternate Bold-Bold;
          font-weight: 700;
          text-align: center;
          color: #d7d7d7;
          margin-right: 10px;
        }

        .wifi {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
      }
    }
  }
</style>
