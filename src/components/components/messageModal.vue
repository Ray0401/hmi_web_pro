<template>
  <Modal @warpClick="cancel">
    <div class="changegoodstatus">
      <div class="static-test-title" v-html="message"></div>
      <div class="loading-box" v-if="loading">
        <img class="load-img" src="../../assets/images/excavator/countDown.png" />
      </div>
      <div class="dialog-btn-list" v-else>
        <button-dialog type="orange" @click="confirm">
          {{ confirmText || toLang('confirm') }} {{ showTime ? count : '' }}
        </button-dialog>
        <button-dialog v-if="showCancel" :type="cancelType" class="bottombutton" @click="cancel(true)">
          {{ cancelText || toLang('cancel') }}
        </button-dialog>
      </div>
      <div v-if="showClose" class="close-btn" @click="cancel"></div>
    </div>
  </Modal>
</template>
<script>
  export default {
    name: 'messageModal',
    props: {
      message: {
        type: String,
        default: '',
      },
      confirmText: {
        type: String,
        default: '',
      },
      cancelText: {
        type: String,
        default: '',
      },
      cancelType: {
        //取消按键状态
        type: String,
        default: 'red',
      },
      showClose: {
        //是否需要右上角关闭
        type: Boolean,
        default: false,
      },
      showCancel: {
        //是否需要取消按钮
        type: Boolean,
        default: true,
      },
      showTime: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        count: 10,
        timer: null,
      };
    },
    mounted() {
      if (this.showTime) {
        this.countDown();
      }
    },
    methods: {
      countDown() {
        this.timer = setTimeout(() => {
          this.count--;
          if (this.count > 0) {
            this.countDown();
          } else {
            this.$emit('confirm');
          }
        }, 1000);
      },
      confirm() {
        this.$emit('confirm');
      },
      cancel(bool) {
        // bool 区分取消按键还是关闭按钮
        if (bool) this.$emit('cancel', { data: true });
        if (!bool) this.$emit('cancel');
      },
    },
    beforeDestroy() {
      clearTimeout(this.timer);
    },
  };
</script>

<style lang="scss" scoped>
  .changegoodstatus {
    background-image: url('../../assets/images/messagebg.png');
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 99;
    transform: translate(-50%, -50%);
    margin: auto;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 450px;
    // height: 232px;
    box-sizing: border-box;
    .static-test-title {
      font-size: 24px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: center;
      color: #f2f2f2;
      margin: 50px 0 35px 0;
      padding: 0 15px;
    }
  }
  .dialog-btn-list {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 43px;
    .button_init {
      width: 167px;
      height: 47px;
      font-size: 19px;
    }
    .bottombutton {
      margin-left: 20px;
    }
  }
  .loading-box {
    width: 100%;
    text-align: center;
  }
  .loading {
    width: 60px;
    height: 60px;
    animation: uni-loading 1s steps(12) infinite;
    margin-bottom: 40px;
  }
  .close-btn {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 15px;
    top: 15px;
    background: url('../../assets/images/closebtn.png') no-repeat;
    background-size: 100% 100%;
  }
</style>
