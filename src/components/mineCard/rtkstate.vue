<template>
  <div class="headerright-rtk">
    <span class="nowtime">{{ clock }}</span>
    <span :class="`rtkstate ${!headerListData.rtkstate && 'rtkstate-nogps'}`">
      {{ headerListData.rtkstate || 'GPS' }}
    </span>
    <template v-if="!headerListData.networkstate[0] && !headerListData.networkstate[1]">
      <img class="noPosition wifi" :src="getAssetsFile('images/wifi0.png')" />
    </template>
    <template v-if="headerListData.networkstate[0]">
      <span class="network">{{ headerListData.networkstate[0] }}</span>
      <img :src="getAssetsFile(signalStatusarr[headerListData.signalStatus[0]])" alt="" class="wifi" />
    </template>
    <template v-if="headerListData.networkstate[1]">
      <span class="network">{{ headerListData.networkstate[1] }}</span>
      <img :src="getAssetsFile(signalStatusarr[headerListData.signalStatus[1]])" alt="" class="wifi" />
    </template>
  </div>
</template>

<script>
  import { signalStatusarr } from './data';
  import { formatTime } from '@/utils/format.js';
  import { getAssetsFile } from '@/utils/utils';
  export default {
    name: 'rtkstate',
    props: {
      headerListData: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        signalStatusarr,
        clock: formatTime(Date.parse(new Date()), 'second', '/'),
        timer: null,
      };
    },
    mounted() {
      this.countDown();
    },
    methods: {
      getAssetsFile,
      countDown() {
        this.clock = formatTime(Date.parse(new Date()), 'second', '/');
        requestAnimationFrame(this.countDown);
      },
    },
  };
</script>

<style lang="scss">
  @import '@/assets/css/common.scss';
  .headerright-rtk {
    padding: 0 10px 0 14px;
    display: flex;
    align-items: center;
    // width: 30%;
    height: 100%;
    // justify-content: space-between;
    box-sizing: border-box;
    // margin-right

    .nowtime {
      font-size: 16px;
      font-family: DIN Alternate Bold, DIN Alternate Bold-Bold;
      font-weight: 700;
      text-align: center;
      color: #d7d7d7;
      margin-right: 25px;
    }

    .rtkstate {
      font-size: 16px;
      font-family: DIN Alternate Bold, DIN Alternate Bold-Bold;
      font-weight: 700;
      text-align: center;
      color: #d7d7d7;
      margin-right: 10px;
    }
    .rtkstate-nogps {
      position: relative;
      &::before {
        content: '';
        width: 32px;
        height: 20px;
        background: url('../../assets/images/noPositioning.png') no-repeat;
        transform: rotateY(180deg);
        background-size: 100% 100%;
        position: absolute;
        top: 2px;
        left: 0px;
      }
    }
    .network {
      font-size: 16px;
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
    .noPosition {
      position: relative;
      &::before {
        content: '';
        width: 32px;
        height: 20px;
        background: url('../../assets/images/noPositioning.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 4px;
        left: -5px;
      }
      &::after {
        content: '';
        width: 32px;
        height: 20px;
        background: url('../../assets/images/noPositioning.png') no-repeat;
        transform: rotateY(180deg);
        background-size: 100% 100%;
        position: absolute;
        top: 3px;
        left: -5px;
      }
    }
  }
</style>
