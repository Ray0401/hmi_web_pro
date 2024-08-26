<template>
  <div class="content-footer">
    <!-- 左侧消息框 -->
    <messagePublic />

    <!-- 中间操作框 -->
    <!-- 采集模式 -->
    <div class="footer-center" v-if="model == 'collect'">
      <img :src="currentGroup['startIcon']" class="collect-image" @click="handleCollectBtn('startIcon')" />
      <img :src="currentGroup['stopIcon']" class="collect-image" @click="handleCollectBtn('stopIcon')" />
    </div>

    <!-- 选取作业区模式  -->
    <div class="footer-center" v-if="model == 'workarea'">
      <img :src="currentGroup['unselect']" class="collect-image" v-if="!isSelectWorkArea" />
      <img :src="currentGroup['select']" class="collect-image" v-else @click="handleCollectBtn('select')" />
    </div>

    <!-- 作业 登录 设置按钮 -->
    <div class="footer-right" v-if="model == 'initial'">
      <div class="footer-right-list" v-for="item in footerRightArrData" @click="stateBtnClick(item.index)">
        <img :src="btnClickIndex == item.index ? item.iconclick : item.icon" class="footer-right-btn-icon" />
      </div>
    </div>
    <img :src="exitIcon" class="exit-btn" @click="exitBtn" v-if="['collect', 'workarea'].includes(model)" />
  </div>
</template>

<script>
  import messagePublic from '../components/messagePublic.vue';
  import { COMMON_MODAL_TYPE } from '@/constant';
  import { FOOTER_RIGHT_ARR_DATA, MIDDLE_ICON_LIST } from '@/constant/bulldozer';
  import { MAP_COLLECT, SOIL } from '@/constant/index';
  import { sendMsgToBackend, speak, getAssetsFile } from '@/utils/utils';
  export default {
    components: {
      messagePublic,
    },
    props: {
      model: {
        type: String,
        default: 'initial',
      },
      rtkstate: {
        type: String,
        default: 'RTK',
      },
      collectFileState: {
        type: Number,
        default: 2,
      },
    },

    data() {
      return {
        footerRightArrData: FOOTER_RIGHT_ARR_DATA,
        middleIconList: JSON.parse(JSON.stringify(MIDDLE_ICON_LIST)),
        readyclick: getAssetsFile('images/inPlace.png'),
        exitIcon: getAssetsFile('images/exitCollect.png'),
        btnClickIndex: null,
        collectStatus: 'start', // 'start|stop|pause|continue|select'    开始|结束|暂停|继续|选择作业区
        isSelectWorkArea: false,
      };
    },
    computed: {
      // 当前采集类型
      collectType() {
        return this.$store.state.bulldozer.collectConfig.type;
      },
      currentGroup() {
        return this.middleIconList[this.collectStatus];
      },
      terminalType() {
        return this.$store.state.vehicleData.terminalType;
      },
    },

    created() {
      const obj = {
        [MAP_COLLECT]: {
          icon: getAssetsFile('images/collectWork.png'),
          iconclick: getAssetsFile('images/collectWorkClick.png'),
        },
        [SOIL]: {
          icon: getAssetsFile('images/digger/diggerWork.png'),
          iconclick: getAssetsFile('images/digger/diggerWorkClick.png'),
        },
      };
      this.footerRightArrData[0] = Object.assign(this.footerRightArrData[0], obj[this.terminalType]);
    },

    mounted() {
      this.$bus.$on('resetBtnClickIndex', () => {
        this.btnClickIndex = null;
      });
      this.$bus.$on('exitGather', () => {
        this.btnclickindex = null;
      });
      this.$bus.$on('resetMiddleIconList', () => {
        this.btnClickIndex = null;
        this.collectStatus = 'start';
        this.isSelectWorkArea = false;
      });

      // 更新采集状态下的按钮状态
      this.$bus.$on('updateStatus', value => {
        this.collectStatus = value;
      });

      this.$bus.$on('selectTargetWork', value => {
        this.isSelectWorkArea = value == 'yes' ? true : false;
      });
    },

    methods: {
      btnReady() {
        this.$bus.$emit('openCommonModal', COMMON_MODAL_TYPE.IN_POSITION); // 打开公共弹窗
        this.readyclick = '/assets/images/inPlaceClick.png';
      },
      stateBtnClick(index) {
        this.btnClickIndex = index;
        this.$emit('statebtn', index);
      },

      // 退出采集
      exitBtn() {
        this.$bus.$emit('openCommonModal', COMMON_MODAL_TYPE.EXIT_COLLECT);
      },
      // 点击采集按钮
      handleCollectBtn(btnName) {
        if (this.rtkstate != 'RTK') {
          this.$store.commit('setMessageList', '丢失差分定位,无法采集');
          sendMsgToBackend('丢失差分定位,无法采集');
          speak('丢失差分定位,无法采集', 6);
          return false;
        }

        console.log('btnname', btnName);

        const typeObj = {
          roadBoundary: COMMON_MODAL_TYPE.UPLOAD_BOUNDARY,
          loadBoundary: COMMON_MODAL_TYPE.UPLOAD_BOUNDARY,
          unloadBoundary: COMMON_MODAL_TYPE.UPLOAD_BOUNDARY,
          soil: COMMON_MODAL_TYPE.UPLOAD_SOIL_LINE,
          obstacleBoundary: COMMON_MODAL_TYPE.UPLOAD_OBSTACLES_BOUNDARY,
        };

        const name = this.currentGroup[btnName] || '';
        if (name.indexOf('Disabled') > -1) return; // 按钮失能状态点击无效
        if (btnName === 'startIcon') {
          this.$store.commit('bulldozer/setCollectTime', {
            type: 'start',
            data: +new Date(),
          });
          if (this.collectType === 'obstacleBoundary') {
            this.collectStatus = ['start', 'continue'].includes(this.collectStatus) ? 'pause' : 'continue';
            this.$bus.$emit('changeBoundaryState', this.collectStatus == 'pause' ? 1 : 3);
            return;
          }
          this.$bus.$emit('changeBoundaryState', 1);
          this.collectStatus = 'stop';
        }
        // 结束采集
        if (btnName == 'stopIcon') {
          this.$store.commit('bulldozer/setCollectTime', {
            type: 'end',
            data: +new Date(),
          });
          this.$bus.$emit('changeBoundaryState', 2);

          this.$bus.$emit('openCommonModal', typeObj[this.$store.state.bulldozer.collectConfig.type]);
        }

        // 选取作业区按钮
        if (btnName == 'select') {
          // this.$store.commit('bulldozer/setSelectWorkArea', true);

          // this.$bus.$emit('openCommonModal', typeObj[this.$store.state.bulldozer.collectConfig.type]);

          this.$emit('uploadFile');
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @keyframes BToU {
    0% {
      bottom: -100vh;
    }

    100% {
      bottom: 0;
    }
  }

  .content-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 2%;
    display: flex;
    height: 1px;
    justify-content: space-between;
    align-items: flex-end;
    z-index: 100;

    .footer-center {
      background-image: url('@/assets/images/collectPathPanel.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 415px;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: BToU 0.5s;
      position: relative;
      z-index: 1;
      flex-shrink: 0;

      .collect-image {
        width: 76px;
        height: 76px;
        cursor: pointer;
        margin-top: 15px;

        &:nth-child(2) {
          margin-left: 25px;
        }
      }
    }

    @keyframes RToI {
      from {
        width: 0px;
      }
    }

    .footer-right {
      width: 30%;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      animation: RToI 300ms;

      .footer-right-list {
        .footer-right-btn-icon {
          width: 90px;
          height: 90px;
        }
      }
    }

    .exit-btn {
      width: 90px;
      height: 90px;
      // margin-left: auto;
      margin-bottom: 20px;
    }
  }
</style>
