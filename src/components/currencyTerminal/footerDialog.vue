<!-- 组件说明：
底部栏
modeFlag: 1: 预览 2：采集模式   3 空
rmodeFlag: true  设置/登录/作业  false 退出 -->
<template>
  <div class="contentfooter">
    <div class="contentfooter-inner">
      <MessagePublic />
      <div class="colectbtn" v-if="modeFlag == 1">
        <img src="../../assets/images/stopPreview.png" class="collectimage" @click="stopPreview" />
      </div>
      <div class="colectbtn" v-if="modeFlag == 2">
        <img :src="collectIconList[collectState].leftIcon" class="collectimage" @click="startcollect(true)" />
        <img :src="collectIconList[collectState].rightIcon" class="collectimage" @click="stopcollect" />
      </div>
      <div class="footer-right-box">
        <div class="footerright" v-if="rmodeFlag">
          <div class="footerrightlist" v-for="item in footerrightarrdata" @click="statebtnclick(item.index)">
            <img :src="btnclickindex == item.index ? item.iconclick : item.icon" class="footerrightbtnicon" />
          </div>
        </div>
        <img src="../../assets/images/exitCollect.png" class="exit-btn" @click="exitbtn" v-if="!rmodeFlag" />
      </div>
    </div>
    <FooterPublic />
    <MessageModal v-if="showModal" :message="message" @confirm="confirm" @cancel="cancel" :showCancel="showCancel" />
  </div>
</template>

<script>
  import FooterPublic from '@/components/components/footerPublic.vue';
  import MessagePublic from '@/components/components/messagePublic.vue';
  import { footerrightarrdata, collectIconList } from './data';
  export default {
    components: {
      FooterPublic,
      MessagePublic,
    },
    mounted() {
      this.$bus.$on('exitGather', () => {
        this.btnclickindex = null;
      });
      this.$bus.$on('resetBtnClickIndex', () => {
        this.collectState = 0;
        this.btnclickindex = null;
      });
      this.$bus.$on('sensorUploadStatus', data => {
        this.showCancel = false;
        this.showModal = true;
        this.message = data.type == 'success' ? '上传成功' : '上传失败';
      });
    },
    props: {
      SensorCollect: {
        type: Boolean,
        default: false,
      },
      modeFlag: {
        type: Number,
        default: 2,
      },
      rmodeFlag: {
        type: Boolean,
        default: false,
      },
      sensorCollectFileList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        showModal: false,
        message: '',
        showCancel: true,
        footerrightarrdata,
        btnclickindex: null,
        collectIconList,
        collectState: 0, // 采集状态 1 采集 2 停止采集
      };
    },
    watch: {
      collectState() {
        this.$emit('setCollectState', { data: this.collectState });
      },
    },
    methods: {
      showTimeOutModal(message, text) {
        this.showModal = true;
        this.showCancel = false;
        this.message = message;
        if (text != undefined) this.collectState = text;
      },
      statebtnclick(index) {
        this.btnclickindex = index;
        this.$emit('statebtn', index);
      },
      startcollect(bool) {
        if (this.collectState == 1) return false;
        if (this.collectState != 1 && !this.SensorCollect) {
          this.$store.commit('setCollectTime', {
            type: 'start',
            data: +new Date(),
          });
          this.collectState = 1;
        }
        if (!this.SensorCollect) return false;
        if (!bool) {
          this.collectState = 1;
        } else {
          if (this.sensorCollectFileList?.length) return this.$toast('请先处理未上传文件');
          // this.collectState = 1;
          this.$emit('setCollectState', { data: 10 });
        }
      },
      stopSensorCollect() {
        this.collectState = 0;
      },
      stopcollect() {
        if (this.collectState == 0 || (this.SensorCollect && this.$store.state.sensorCollectState != '采集中'))
          return false;
        if (!this.SensorCollect) this.collectState = 2;
        this.$emit('btnpopUpFlag');
      },
      stopPreview() {
        this.$emit('stopPreview');
      },
      exitbtn() {
        this.showModal = true;
        this.message = this.toLang('exitAcquisition');
      },
      cancel() {
        this.showModal = false;
        this.showCancel = true;
      },
      confirm() {
        this.showModal = false;
        this.showCancel = true;
        if (this.message == this.toLang('exitAcquisition')) this.$emit('exitconfirmbtn');
      },
    },
  };
</script>

<style lang="scss" scoped>
  @keyframes BToU {
    0% {
      bottom: -100px;
    }

    100% {
      bottom: 0;
    }
  }
  .contentfooter {
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 15px;
    display: flex;
    height: 1px;
    justify-content: space-between;
    align-items: flex-end;
    .contentfooter-inner {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      z-index: 100;
      height: 1px;
    }
    .footermiddlebox {
      background-image: url('@/assets/images/panelicon.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 415px;
      height: 120px;
      position: relative;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      z-index: 1;
      flex-shrink: 0;
      .left-ene {
        width: 10px;
        height: 50px;
        background: #3c2219;
        border: 1px solid #211c1a;
        border-right: 0;
        box-sizing: border-box;
        position: absolute;
        left: 60px;
        bottom: 30px;
        transform-origin: bottom;
        transform: skewX(-45deg);
        display: flex;
        justify-content: space-between;
        align-content: flex-end;
        align-items: center;
        flex-direction: column-reverse;
      }
      .left-ene-list {
        width: 100%;
        height: 20%;
        box-sizing: border-box;
        background: #4d1f1f;
        border-bottom: 1px solid #211c1a;
      }
      .left-ene-list:first-child {
        border-bottom: 0;
      }
      .left-ene-list-active {
        background: #ed1414;
      }
      .left-ene-list-actives {
        background: #f46c00;
      }
      .right-ene {
        width: 10px;
        height: 50px;
        background: #3c2219;
        border: 1px solid #211c1a;
        border-right: 0;
        box-sizing: border-box;
        position: absolute;
        right: 60px;
        bottom: 30px;
        transform-origin: bottom;
        transform: skewX(45deg);
        display: flex;
        justify-content: space-between;
        align-content: flex-end;
        align-items: center;
        flex-direction: column-reverse;
      }
      .centerstate {
        font-size: 20px;
        font-family: Helvetica Neue, Helvetica Neue-Bold;
        font-weight: 700;
        text-align: center;
        color: #ffffff;
        line-height: 28px;
        letter-spacing: 2.4px;
        position: absolute;
        top: 10px;
        margin-left: 5px;
      }

      .centerbtnbox {
        width: 50%;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 10px 10px;
        box-sizing: border-box;

        .centerbtnlist {
          width: 44px;
          .centerbtntext {
            font-size: 18px;
            font-family: Source Han Sans CN, Source Han Sans CN-Medium;
            font-weight: 500;
            text-align: justifyLeft;
            color: #f2f2f2;
            line-height: 28px;
            display: flex;
            justify-content: center;
            letter-spacing: 1.8px;
          }
          .centerbtntext-en {
            letter-spacing: normal;
            font-size: 17px;
          }
          .centerbtnicon {
            margin-top: 7px;
            width: 44px;
            height: 12px;
            background: linear-gradient(rgba(3, 0, 0, 0.14) 0%, rgba(255, 255, 255, 0.14) 100%);
            box-shadow: 0px 1px 2px 0px rgba(226, 226, 226, 0.4), 0px 2px 2px 0px rgba(71, 72, 80, 0.78) inset;
            display: flex;
            align-items: center;
            justify-content: center;
            .inset {
              width: 40px;
              height: 8px;
              background: linear-gradient(rgba(3, 0, 0, 0.14) 0%, rgba(255, 255, 255, 0.14) 100%);
              box-shadow: 0px 1px 2px 0px rgba(255, 255, 255, 0.45) inset;
            }
          }
          .btngreen {
            .inset {
              background: rgba(255, 120, 0, 1);
              box-shadow: 0px 1px 2px 0px #ffffff inset;
            }
          }
        }
      }
    }
    .colectbtn {
      background-image: url('@/assets/images/collectPathPanel.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 415px;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      // animation: BToU .5s;
      position: relative;
      z-index: 1;
      flex-shrink: 0;

      .collectimage {
        width: 76px;
        height: 76px;
        margin-right: 25px;
      }

      .collectimage:nth-child(2) {
        margin-right: 0;
      }
    }

    @keyframes RToI {
      from {
        width: 0px;
      }
    }
    .footer-right-box {
      width: 30vw;
      display: flex;
      justify-content: flex-end;
    }

    .footerright {
      width: 100%;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      animation: RToI 300ms;
      max-width: 250px;

      .footerrightlist {
        .footerrightbtnicon {
          width: 90px;
          height: 90px;
        }
        // &:not(:last-child) {
        //   margin-right: 5px;
        // }
      }
    }

    .exit-btn {
      width: 90px;
      height: 90px;
      margin-left: 100px;
      margin-bottom: 20px;
    }
  }
</style>
