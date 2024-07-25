<template>
  <Modal>
    <div class="c-wrapper">
      <div class="c-content">
        <div class="c-content-title">{{ message }}</div>
        <div class="c-content-tips" v-if="tips">{{ tips }}</div>
        <div class="c-content-warning" v-if="warning">{{ warning }}</div>
      </div>
      <div class="c-btn-list">
        <button-dialog
          v-for="(btn, index) in btnList"
          :key="index"
          :type="btn.btnType"
          :class="{ mr: btnList.length > 1 && index == 0 }"
          @click="btnClick(btn.clickType)"
        >
          {{ btn.text }}
        </button-dialog>
      </div>
      <div v-if="showClose" class="close-btn" @click="close"></div>
    </div>
  </Modal>
</template>
<script>
  export default {
    props: {
      type: {
        type: String,
        default: '',
      },
      btnList: {
        type: Array,
        default: () => [
          {
            btnType: 'orange',
            text: '确定',
            clickType: 'confirm',
          },
          {
            btnType: 'grey',
            text: '取消',
            clickType: 'cancel',
          },
        ],
      },
      message: {
        type: String,
        default: '',
      },
      tips: {
        type: String,
        default: '',
      },
      warning: {
        type: String,
        default: '',
      },
      confirmText: {
        type: String,
        default: '确定',
      },
      cancelText: {
        type: String,
        default: '取消',
      },
      cancelType: {
        type: String,
        default: 'grey',
      },
      showClose: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        // btnList: [
        //   {
        //     btnType: 'grey',
        //     text: '取消',
        //     clickType: 'cancel',
        //   },
        //   {
        //     btnType: 'orange',
        //     text: '确定',
        //     clickType: 'confirm',
        //   },
        // ],
      };
    },
    methods: {
      // 按钮点击
      btnClick(value) {
        this.$emit(value);
      },
      // 点击'X'按钮
      close() {
        this.$emit('close');
      },
    },
  };
</script>

<style lang="scss">
  .c-wrapper {
    background-image: url('../../assets/images/messagebg.png');
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1000;
    transform: translate(-50%, -50%);
    margin: auto;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 480px;
    height: 230px;

    padding-bottom: 40px;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;

    .c-content {
      flex: 1;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      color: #f2f2f2;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;

      &-title {
        font-size: 24px;
      }
      &-tips {
        font-size: 20px;
        margin: 20px 0;
      }
      &-warning {
        font-size: 16px;
        color: #e60008;
        margin-top: 19px;
      }
    }

    .c-btn-list {
      display: flex;
      justify-content: center;
      align-items: center;
      .button_init {
        width: 180px;
        height: 50px;
        font-size: 20px;
      }
      .mr {
        margin-right: 20px;
      }
    }
    .close-btn {
      width: 30px;
      height: 30px;
      position: absolute;
      right: 15px;
      top: 15px;
      background: url('../../assets/images/closebtn.png') no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }
  }
</style>
