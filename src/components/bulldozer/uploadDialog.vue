<template>
  <div class="mask-box">
    <div class="upload-dialog">
      <div class="upload-dialog-title">
        <span class="upload-dialog-text">{{ message }}</span>
        <!-- 这里是loading图片 -->
        <img class="load-img" src="../../assets/images/excavator/countDown.png" v-if="props.status == 'upload'" />
      </div>
      <div class="dialog-btn-list" v-if="status !== 'upload'">
        <button-dialog type="orange" @click="confirm">确定</button-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, defineProps, defineEmits } from 'vue';

  const loading = ref();
  const props = defineProps({
    message: {
      type: String,
      default: '上传中',
    },
    status: {
      type: String,
      default: 'success',
    },
  });
  const $emit = defineEmits(['closeUploadDialog']);

  const confirm = () => {
    close();
  };
  const close = () => {
    $emit('closeUploadDialog', props.status);
  };
</script>

<style scoped lang="scss">
  .mask-box {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1000;
    .upload-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 450px;
      transform: translate(-50%, -50%);
      background-image: url('../../assets/images/messagebg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 0px 45px 0px 45px;
      height: 230px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .upload-dialog-title {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .loading {
          width: 60px;
          height: 60px;
          margin-top: 27px;
          animation: uni-loading 1s steps(12) infinite;
        }

        .upload-dialog-text {
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
        margin-top: 40px;
      }
    }
  }
</style>
