<style scoped lang="scss">
  .mask-box {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1000;
    .auto-give-point-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 450px;
      min-height: 260px;
      transform: translate(-50%, -50%);
      background-image: url('../../assets/images/messagebg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 20px 45px 20px 45px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .auto-give-point-dialog-title {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .loading {
          width: 60px;
          height: 60px;
          margin-top: 27px;
        }

        .auto-give-point-dialog-text {
          font-size: 24px;
          font-family: PingFang SC Regular, PingFang SC Regular-Regular;
          font-weight: 400;
          text-align: center;
          color: #f2f2f2;
        }

        .img-example {
          width: 120px;
          height: 120px;
        }

        .example-text {
          font-size: 20px;
          color: #70a7b3;
        }
      }

      .dialog-btn-list {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 20px;
      }
    }
  }
</style>

<template>
  <div class="mask-box" v-if="visible">
    <!-- 默认状态 -->
    <div class="auto-give-point-dialog" v-if="status === 'default'">
      <div class="auto-give-point-dialog-title">
        <img class="img-example" :src="imgRef" />
        <span class="example-text">请调整挖机朝向如图所示</span>
      </div>
      <div class="dialog-btn-list" v-if="status !== 'upload'">
        <button-dialog style="margin-right: 10px" type="orange" @click="confirm">确定</button-dialog>
        <button-dialog type="grey" @click="cancel">取消</button-dialog>
      </div>
    </div>
    <!-- 自动指点请求中 -->
    <div class="auto-give-point-dialog" v-if="status === 'loading'">
      <div class="auto-give-point-dialog-title">
        <span class="auto-give-point-dialog-text">{{ message }}</span>
        <img class="load-img" src="../../assets/images/excavator/countDown.png" />
      </div>
    </div>

    <!-- 更新停靠位/预停靠位/锚点 -->
    <div class="auto-give-point-dialog" v-if="status === 'update'">
      <div class="auto-give-point-dialog-title">
        <span class="auto-give-point-dialog-text">{{ message }}</span>
        <img class="load-img" src="../../assets/images/excavator/countDown.png" />
      </div>
    </div>

    <!-- 成功 -->
    <div class="auto-give-point-dialog" v-if="status === 'success'">
      <div class="auto-give-point-dialog-title">
        <span class="auto-give-point-dialog-text">{{ message }}</span>
      </div>
      <div class="dialog-btn-list">
        <button-dialog style="margin-right: 10px" type="orange" @click="cancel">确定</button-dialog>
      </div>
    </div>
    <!-- 失败 -->
    <div class="auto-give-point-dialog" v-if="status === 'fail'">
      <div class="auto-give-point-dialog-title">
        <span class="auto-give-point-dialog-text" v-html="message"></span>
      </div>
      <div class="dialog-btn-list">
        <button-dialog style="margin-right: 10px" type="orange" @click="cancel">确定</button-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Vue, { ref, watch } from 'vue';
  import { autoGivePointModeImgs } from './data';
  import { useStore } from '@/hooks/useStore';
  // const autoGivePointModeImgsRef = ref(autoGivePointModeImgs);
  const imgRef = ref('');
  const store = useStore();

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '自动指点请求中',
    },
    status: {
      type: String,
      default: 'default',
    },
    info: {
      type: Object,
      default: () => {},
    },
  });

  watch(
    () => props.visible,
    val => {
      if (val) {
        imgRef.value = `${autoGivePointModeImgs[props.info.value]}`;
      }
    }
  );

  const $emit = defineEmits(['closeDialog', 'handleAutoGivePoint']);

  const confirm = () => {
    store.commit('excavator/setAutoPointMode', true);
    //  发起自动指点请求
    $emit('handleAutoGivePoint', props.info.value);
  };
  const cancel = () => {
    $emit('closeDialog');
    Vue.prototype.$bus.$emit('clearAutoGivePointClick', props.status);
  };
</script>
