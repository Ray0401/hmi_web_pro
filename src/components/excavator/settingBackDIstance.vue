<template>
  <Modal @warpClick="close">
    <div class="modal">
      <div class="back-distance">车辆后移</div>
      <div class="content">
        <div class="input-num">
          {{ count.toFixed(1) }}
          <span class="unit">{{ toLang('metre') }}</span>
        </div>
        <img
          :class="`add-btn ${count == max && 'btn-none'}`"
          @click="setInputNum('add')"
          src="../../assets/images/excavator/settingReduce.png"
        />
        <img
          :class="`reduce-btn ${count == min && 'btn-none'}`"
          @click="setInputNum('reduce')"
          src="../../assets/images/excavator/settingAdd.png"
        />
      </div>
      <div class="btn-box">
        <button-dialog type="orange" @click="submit">
          {{ toLang('confirm') }}
        </button-dialog>
      </div>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'settingBackDIstance',
    data() {
      return {
        count: 1.6,
        max: 10,
        min: 0.5,
      };
    },
    props: {
      pointItem: {
        type: Object,
        default: () => {},
      },
    },
    methods: {
      setInputNum(type) {
        if (type == 'add') {
          this.count = (this.count * 10 + 2) / 10;
          if (this.count >= this.max) this.count = this.max;
        } else {
          this.count = (this.count * 10 - 2) / 10;
          if (this.count < this.min) this.count = this.min;
        }
      },
      submit() {
        this.socket.send(
          JSON.stringify({
            type: 'vehicleBackDistance',
            imei: this.pointItem.imei,
            num: -this.count,
          })
        );
        // 开始倒计时
        this.$emit('startTimeout');
        this.$emit('close');
      },
      close() {
        this.$emit('close');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .modal {
    width: 480px;
    height: 280px;
    position: absolute;
    top: 50%;
    background: url('../../assets/images/messagebg.png') no-repeat;
    background-size: 100% 100%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: relative;
    overflow: hidden;
    .back-distance {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 25px;
      margin-top: 50px;
    }
    .content {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-top: 10px;
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
      .btn-none {
        opacity: 0.5;
        pointer-events: none;
      }
    }
    .btn-box {
      display: flex;
      margin-top: 28px;
      justify-content: center;
    }
  }
</style>
