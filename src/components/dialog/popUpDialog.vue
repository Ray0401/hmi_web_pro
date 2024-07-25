<!-- 组件说明：
props
confirmtext——左边按钮文字内容（默认确定） 
canceltext——右边按钮文字内容（默认取消）
closeFlag——是否显示关闭按钮，可传可不传，默认不显示

$emit:
confirm 点击左边按钮
cancel 点击右边安妮
close closeFlag为true时，关闭按钮，closeFlag为false或不传时，不传
-->
<template>
  <Modal @warpClick="maskclose">
    <div class="pop-up-dialog">
      <template v-if="!upload">
        <div class="pop-up-dialog-title">
          <img v-if="!SensorCollect" src="../../assets/images/infomationIco.png" class="pop-up-dialog-icon" />
          <span class="pop-up-dialog-text">{{ toLang('uploadCollectFile') }}</span>
        </div>
        <div :class="`dialog-btn-list ${SensorCollect && 'sensor-btn-list'}`">
          <button-dialog v-if="SensorCollect" type="grey" @click="preview">{{ this.toLang('preview') }}</button-dialog>
          <button-dialog type="orange" @click="confirmbtn">{{ confirmtext || this.toLang('upload') }}</button-dialog>
          <button-dialog :type="SensorCollect ? 'grey' : 'red'" @click="cancelbtn">
            {{ canceltext || this.toLang('deleteFile') }}
          </button-dialog>
        </div>
        <img src="../../assets/images/closebtn.png" v-if="closeFlag" class="close-btn" @click="close()" />
      </template>
      <template v-else>
        <div class="upload-box">
          <div class="upload-text">上传中</div>
          <div class="upload-current">{{ progress || 0 }}%</div>
          <div class="progress">
            <div class="progress-inset" :style="{ width: `${progress}%` }" />
          </div>
          <div class="current">{{ uploadInfo.current }}M/{{ uploadInfo.total }}M</div>
        </div>
      </template>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'popUpDialog',
    data() {
      return {};
    },
    props: {
      confirmtext: {
        type: String,
        default: '',
      },
      canceltext: {
        type: String,
        default: '',
      },
      closeFlag: {
        type: Boolean,
        default: false,
      },
      SensorCollect: {
        type: Boolean,
        default: false,
      },
      upload: {
        type: Boolean,
        default: false,
      },
      uploadInfo: {
        type: Object,
        default: () => {},
      },
    },
    onLoad() {},
    computed: {
      progress() {
        return Math.ceil((this.uploadInfo.current / this.uploadInfo.total) * 100);
      },
    },
    watch: {
      SensorCollect(val) {
        console.log(val, 1234);
      },
    },
    methods: {
      confirmbtn() {
        this.$emit('confirm');
      },
      cancelbtn() {
        this.$emit('cancel');
      },
      close() {
        this.$emit('close');
      },
      maskclose() {
        if (!this.SensorCollect) this.$emit('close');
      },
      preview() {
        this.$emit('preview');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .pop-up-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 450px;
    transform: translate(-50%, -50%);
    background-image: url('../../assets/images/messagebg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding: 64px 45px 37px 45px;
    box-sizing: border-box;
    .upload-box {
      color: #fff;
      text-align: center;
      .upload-text {
        margin-top: -11px;
        font-size: 28px;
        color: #70a7b3;
      }
      .upload-current {
        font-size: 20px;
        margin-top: 37px;
      }
      .progress {
        margin-top: 14px;
        width: 380px;
        height: 8px;
        margin-left: -10px;
        background: rgba(57, 64, 89, 0.6);
        position: relative;
        .progress-inset {
          position: absolute;
          left: 0;
          top: 0;
          height: 8px;
          background: #fe5b00;
          transition: width 0.5s linear;
        }
      }
      .current {
        font-size: 16px;
        margin-top: 14px;
        margin-bottom: 9px;
      }
    }

    .pop-up-dialog-title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;

      .pop-up-dialog-icon {
        width: 38px;
        height: 36px;
        margin-right: 15px;
      }

      .pop-up-dialog-text {
        font-size: 24px;
        font-family: PingFang SC Regular, PingFang SC Regular-Regular;
        font-weight: 400;
        text-align: left;
        color: #f2f2f2;
      }
    }

    .dialog-btn-list {
      display: flex;
      justify-content: space-around;
      align-items: center;

      // .dialog-btn {
      // 	width: 300px;
      // 	height: 90px;
      // 	font-size: 37.5px;
      // 	font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
      // 	font-weight: 500;
      // 	text-align: center;
      // 	line-height: 90px;
      // 	color: #ffffff;
      // 	margin: 0 auto;
      // }

      // .dialog-btn-confirm {
      // 	background-image: url('@/assets/images/redbtnclicked.png');
      // 	background-size: 100% 100%;
      // 	background-repeat: no-repeat;
      // 	margin-right: 40px;
      // }

      // .dialog-btn-cancel {
      // 	background-image: url('@/assets/images/orangebtnclicked.png');
      // 	background-size: 100% 100%;
      // 	background-repeat: no-repeat;
      // }
    }
    .sensor-btn-list {
      .button_init {
        &:nth-child(2) {
          margin-left: 10px;
        }
        &:nth-child(3) {
          margin-left: 10px;
        }
      }
    }
    .close-btn {
      width: 25px;
      height: 25px;
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
</style>
