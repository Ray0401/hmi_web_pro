<template>
  <Modal @warpClick="close">
    <div class="modal">
      <div v-if="isOutFall" class="error-tips">
        提示:补偿长度L{{
          fallOutside
            ? `已小于尾部回转半径${$store.state.carInfo.tailRotationRadius || 0}`
            : `已大于最大挖掘半径${$store.state.carInfo.diggingRadius || 0}`
        }}米!
      </div>
      <div class="modal-content">
        <img class="modal-obj" src="../../assets/images/excavator/settingObj.png" />
        <div class="modal-right">
          <div v-for="(item, index) in parameter" :key="index">
            <div class="title">
              {{ index == 0 ? `${toLang('compensationLength')}L` : `${toLang('offsetWidth')}D` }}
            </div>
            <div class="modal-right-content">
              <div :class="`input-num ${index == 0 && isOutFall && 'input-error'}`">
                {{ item && Number(item).toFixed(1) }}
                <span class="unit">{{ toLang('metre') }}</span>
              </div>
              <img
                class="add-btn"
                @click="setInputNum(index, 'add')"
                src="../../assets/images/excavator/settingReduce.png"
              />
              <img
                class="reduce-btn"
                @click="setInputNum(index, 'reduce')"
                src="../../assets/images/excavator/settingAdd.png"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="btn-box">
        <button-dialog type="orange" :class="`${isOutFall && 'btn-none'}`" @click="submit">
          {{ toLang('confirm') }}
        </button-dialog>
      </div>
      <div class="close-btn" @click="close"></div>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'settingExcavatorModal',
    data() {
      return {
        parameter: [
          this.$store.state.carInfo?.excavatorOffsetLength || 0,
          this.$store.state.carInfo?.excavatorOffsetWidth || 0,
        ],
      };
    },
    mounted() {
      this.parameter = localStorage.getItem('parameter')
        ? JSON.parse(localStorage.getItem('parameter'))
        : [this.$store.state.carInfo?.excavatorOffsetLength || 0, this.$store.state.carInfo?.excavatorOffsetWidth || 0];
    },
    computed: {
      fallOutside() {
        return Number(this.parameter[0]) < Number(this.$store.state.carInfo.tailRotationRadius);
      },
      diggingRadius() {
        return Number(this.parameter[0]) > Number(this.$store.state.carInfo.diggingRadius);
      },
      isOutFall() {
        return this.fallOutside || this.diggingRadius;
      },
    },
    methods: {
      setInputNum(index, type) {
        if (type === 'add') this.parameter[index] = (parseFloat(this.parameter[index]) + 0.2).toFixed(1);
        if (type === 'reduce') {
          if (index == 1) {
            this.$set(this.parameter, index, (parseFloat(this.parameter[index]) - 0.2).toFixed(1));
          } else if (this.parameter[index] > 0) {
            this.$set(this.parameter, index, (parseFloat(this.parameter[index]) - 0.2).toFixed(1));
          }
        }
      },
      submit() {
        localStorage.setItem('parameter', JSON.stringify(this.parameter));
        this.$emit('setShowModal');
        // this.$bus.$emit('setExcavatorOffsetLen');
      },
      close() {
        this.$emit('setShowModal');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .modal {
    width: 480px;
    height: 340px;
    position: fixed;
    top: 50%;
    background: url('../../assets/images/messagebg.png') no-repeat;
    background-size: 100% 100%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    .error-tips {
      color: red;
      position: absolute;
      left: 25px;
      top: 20px;
      letter-spacing: 5px;
      font-size: 14px;
      font-weight: bold;
    }
    .modal-content {
      display: flex;
      padding: 49px 35px 0 35px;
      .modal-obj {
        width: 102px;
        height: 188px;
        flex-shrink: 0;
      }
      .modal-right {
        margin-left: 38px;
        .title {
          width: 130px;
          text-align: center;
          color: #fff;
          font-size: 20px;
          white-space: nowrap;
        }
        &-content {
          margin-top: 10px;
          display: flex;
          align-items: center;
          font-size: 20px;
          .input-num {
            width: 130px;
            border: 2px solid #45556a;
            height: 50px;
            line-height: 50px;
            color: #fff;
            padding: 0 12px;
            box-sizing: border-box;
            .unit {
              float: right;
            }
          }
          .input-error {
            border-color: red;
            color: red;
          }
          .add-btn {
            width: 42px;
            height: 44px;
            margin-left: 13px;
          }
          .reduce-btn {
            width: 42px;
            height: 44px;
            margin-left: 7px;
          }
        }
      }
    }
    .btn-box {
      display: flex;
      margin-top: 28px;
      justify-content: center;
    }
    .btn-none {
      pointer-events: none;
      opacity: 0.5;
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
  }
</style>
