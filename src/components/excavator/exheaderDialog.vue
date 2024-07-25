<template>
  <div class="contentheader">
    <div class="header">
      <div class="headerleft">
        <div class="headerleft-left">
          <img :src="stateArr[headerListData.state].icon" class="img" />
          <div class="text"><ScrollText :text="headerListData.stateText" /></div>
        </div>
        <div class="headerleft-middle">
          <img :src="loadingArea" class="img" />
          <span class="text">{{ headerListData.area }}</span>
        </div>
        <div class="headerleft-right">
          <img :src="headerListData.materialicon" class="img" />
          <span class="text">{{ materialObj[headerListData.oretext] }}</span>
          <span class="number">{{ this.toLang('yield') }}: {{ headerListData.number }} {{ this.toLang('car') }}</span>
        </div>
      </div>
      <RtkState :headerListData="headerListData" />
    </div>
  </div>
</template>

<script>
  import RtkState from '../mineCard/rtkstate.vue';
  import { stateArr } from '../mineCard/data';
  import ScrollText from './scroll-text.vue';
  import { getAssetsFile } from '@/utils/utils';
  export default {
    name: 'exheaderDialog',
    components: {
      ScrollText,
      RtkState,
    },
    props: {
      headerListData: {
        type: Object,
        default: () => {},
      },
      MaterialList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        materialObj: {},
        loadingArea: getAssetsFile('images/loadingArea.png'),
        stateArr,
      };
    },
    methods: {
      getAssetsFile,
    },
    watch: {
      MaterialList: {
        handler(data) {
          if (data?.length) {
            data.forEach(item => {
              this.materialObj[item.materialNum] = item.name;
            });
          }
        },
        immediate: true,
      },
    },
    mounted() {},
  };
</script>

<style lang="scss">
  @import '@/assets/css/common.scss';

  .contentheader {
    width: 100%;
    height: 40px;
    position: relative;
    @include beveled-all-corners(#5a5b60, 0, 0, 15px, 15px);
    padding: 0 6px 6px 6px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .header {
      width: 100%;
      @include beveled-all-corners(#20262d, 0, 0, 15px, 15px);
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;

      .headerleft {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;

        .headerleft-left {
          margin-left: 22px;
          display: flex;
          height: 100%;
          align-items: center;

          .img {
            width: 12px;
            height: 12px;
          }

          .text {
            margin-left: 6px;
            max-width: 100px;
            margin-right: 20px;
            height: 30px;
            ::v-deep .scroll-content {
              font-size: 16px;
            }
          }
        }

        .headerleft-middle {
          display: flex;
          height: 100%;
          align-items: center;

          .img {
            width: 20px;
            height: 20px;
          }

          .text {
            margin-left: 9px;
            font-size: 16px;
            font-family: SourceHanSansCN;
            font-weight: Medium;
            text-align: left;
            // color: #ffffff;
            color: white;
            margin-right: 37px;
          }
        }

        .headerleft-right {
          display: flex;
          height: 100%;
          align-items: center;
          font-size: 16px;
          .img {
            width: 31px;
            height: 20px;
          }

          .text {
            margin-left: 9px;
            font-family: SourceHanSansCN;
            font-weight: Medium;
            text-align: left;
            color: #ffffff;
            // margin-right: 40px;
          }
          .number {
            font-family: SourceHanSansCN;
            font-weight: Medium;
            text-align: left;
            color: #ffffff;
            padding-left: 40px;
          }
        }
      }
    }
  }
</style>
