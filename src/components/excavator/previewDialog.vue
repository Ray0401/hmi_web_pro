<template>
  <div class="mask-box" v-if="visible">
    <div class="upload-dialog">
      <div class="upload-dialog-title">
        <!-- <span class="upload-dialog-text">{{ message }}</span> -->
        <span>包络半径</span>
        <span class="radius">
          {{ calcRadius }}

          <span class="unit">{{ toLang('metre') }}</span>
        </span>

        <img class="add-btn" @click="setInputNum('add')" src="../../assets/images/excavator/settingReduce.png" />
        <img class="reduce-btn" @click="setInputNum('reduce')" src="../../assets/images/excavator/settingAdd.png" />
      </div>
      <div class="dialog-btn-list">
        <button-dialog type="orange" class="ok-btn" @click="confirm">确定</button-dialog>
        <button-dialog type="grey" @click="close">取消</button-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, defineProps, defineEmits, computed } from 'vue';

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
    },
  });
  const $emit = defineEmits(['close', 'confirm']);

  const radius = ref(15); //默认值
  const max = ref(30); //最大值
  const min = ref(5); //最小值
  const step = ref(1); //步长

  const calcRadius = computed(() => {
    return radius.value;
  });

  const setInputNum = type => {
    if (type === 'add') {
      if (radius.value >= max.value) return;
      radius.value += step.value;
    } else {
      if (radius.value <= min.value) return;
      radius.value -= step.value;
    }
  };

  const confirm = () => {
    $emit('confirm', radius.value);
  };
  const close = () => {
    $emit('close');
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
        // flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #f2f2f2;
        font-size: 20px;

        // .loading {
        //   width: 60px;
        //   height: 60px;
        //   margin-top: 27px;
        //   animation: uni-loading 1s steps(12) infinite;
        // }

        // .upload-dialog-text {
        //   font-size: 24px;
        //   font-family: PingFang SC Regular, PingFang SC Regular-Regular;
        //   font-weight: 400;
        //   text-align: left;
        //   color: #f2f2f2;
        // }

        .radius {
          width: 140px;
          height: 40px;
          line-height: 40px;
          padding-left: 10px;
          align-items: center;
          border: 2px solid #45556a;
          position: relative;

          .unit {
            position: absolute;
            top: 50%;
            right: 5px;
            transform: translateY(-50%);
          }
        }

        .add-btn {
          width: 42px;
          height: 44px;
        }
        .reduce-btn {
          width: 42px;
          height: 44px;
          margin-left: 7px;
        }
      }

      .dialog-btn-list {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 40px;

        .ok-btn {
          margin-right: 15px;
        }
      }
    }
  }
</style>
