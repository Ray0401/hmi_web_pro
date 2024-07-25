<style scoped lang="scss">
  .step-distance-box {
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 15px;
    display: flex;
    height: 1px;
    justify-content: space-between;
    align-items: flex-end;
    .footermiddlebox {
      padding: 40px 60px 5px 60px;
      background-image: url('../../assets/images/excavator/control.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 415px;
      height: 160px;
      position: relative;
      display: flex;
      z-index: 1;
      box-sizing: border-box;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;

      .middle-left {
        display: flex;
        flex-direction: column;
        .title {
          color: #6ea6b0;
          padding-left: 6px;
        }

        .input-num {
          display: flex;
          height: 40px;
          line-height: 40px;
          color: #fff;
          box-sizing: border-box;
          padding-left: 6px;
          .distance {
            width: 70px;
            padding-left: 10px;
            align-items: center;
            border: 2px solid #45556a;
          }
          .unit {
            float: right;
          }
        }

        .num-btn {
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
      }

      .middle-right {
        margin-left: 20px;
        width: 110px;
        height: 110px;
        position: relative;
        .up,
        .down {
          position: absolute;
          width: 70px;
          height: 33px;
        }
        .left,
        .right {
          position: absolute;
          width: 33px;
          height: 70px;
        }

        .up {
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        .down {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        .left {
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }

        .right {
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
    .directions {
      display: flex;
      margin-bottom: 20px;
      // animation: RToI 300ms;
      justify-content: flex-end;
      .footerrightlist {
        &:first-child {
          margin-right: 30px;
        }
        .footerrightbtnicon {
          width: 90px;
          height: 90px;
        }

        .disable {
          opacity: 0.3;
          pointer-events: none;
        }
      }
      .footerrightlist-none {
        pointer-events: none;
        opacity: 0.5;
      }
    }

    .box {
      width: 129px;
      height: 460px;
      position: fixed;
      right: 0;
      z-index: 2;
      top: 181px;
      background-image: url('../../assets/images/anglePanel.png');
      background-size: 100% 100%;

      .angle-box {
        position: absolute;
        top: 0;
        width: 80px;
        right: 129px;
        height: 460px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .angle {
          width: 80px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 26px;
          color: #fff;
          background: url('../../assets/images/excavator/angle.png') center/cover no-repeat;
          &.active {
            background: url('../../assets/images/excavator/angleActive.png') center/cover no-repeat;
          }
        }
      }

      .add {
        width: 60px;
        height: 60px;
        margin-top: 30px;
        margin-left: 40px;
      }
      .reduce {
        margin-top: 0;
      }
    }
  }
</style>

<template>
  <div class="step-distance-box">
    <MessagePublic />

    <div class="footermiddlebox">
      <div class="middle-left">
        <span class="title">调整步距</span>
        <div class="input-num">
          <span class="distance">{{ calcDistance }}</span>
          <span class="unit">{{ toLang('metre') }}</span>
        </div>
        <div class="num-btn">
          <img class="add-btn" @click="setInputNum('add')" src="../../assets/images/excavator/settingReduce.png" />
          <img class="reduce-btn" @click="setInputNum('reduce')" src="../../assets/images/excavator/settingAdd.png" />
        </div>
      </div>
      <div class="middle-right">
        <img
          src="../../assets/images/excavator/up.png"
          mode="scaleToFill"
          class="imgBtn up"
          @click="handleClickDirection('up')"
        />
        <img
          src="../../assets/images/excavator/left1.png"
          mode="scaleToFill"
          class="imgBtn left"
          @click="handleClickDirection('left')"
        />
        <img
          src="../../assets/images/excavator/right1.png"
          mode="scaleToFill"
          class="imgBtn right"
          @click="handleClickDirection('right')"
        />
        <img
          src="../../assets/images/excavator/down.png"
          mode="scaleToFill"
          class="imgBtn down"
          @click="handleClickDirection('down')"
        />
      </div>
    </div>
    <div class="directions">
      <div
        class="footerrightlist"
        :key="item.index"
        v-for="item in stepDistanceBtnOpertaionList"
        @click="directionsClick(item.index)"
      >
        <img :src="item.icon" class="footerrightbtnicon" :class="{ disable: !item.isClick }" />
      </div>
    </div>

    <!-- 右侧旋转 -->
    <div class="box">
      <img src="../../assets/images/excavator/add.png" class="add" @click="pickerClick('add')" />
      <scroll-picker :options="pickerList" v-model="pickerAngle"></scroll-picker>
      <img src="../../assets/images/excavator/zoomOut.png" class="add reduce" @click="pickerClick('sub')" />
      <div class="angle-box">
        <span
          :class="{ angle: true, active: index == angleActiveIndex }"
          v-for="(angle, index) in angleList"
          :key="index"
          @click="angleClick(index)"
        >
          {{ angle }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import MessagePublic from '../components/messagePublic.vue';
  import { stepDistanceBtnOpertaionList } from './data.js';
  import { ScrollPicker } from 'vue-scroll-picker';
  import 'vue-scroll-picker/dist/style.css';

  export default {
    components: { MessagePublic, ScrollPicker },
    props: {},
    data() {
      return {
        stepDistanceBtnOpertaionList,
        distance: 0.2,
        angleList: [-90, -45, 0, 45, 90],
        angleActiveIndex: 2,
        pickerList: [
          ...Array(181)
            .keys()
            .map(item => {
              return {
                name: item - 90,
                value: item - 90,
              };
            }),
        ],
        pickerAngle: 0,
      };
    },
    computed: {
      calcDistance() {
        return this.distance.toFixed(1);
      },
    },
    created() {
      this.$bus.$on('stopSendPoint', bool => {
        this.stepDistanceBtnOpertaionList[0].isClick = !bool;
      });
    },
    methods: {
      directionsClick(index) {
        if (index === 1) {
          this.$emit('confirmStepDistance');
        } else {
          this.$emit('exitStepDistance');
          this.stepDistanceBtnOpertaionList[0].isClick = true;
        }
      },
      setInputNum(type) {
        if (type === 'add') {
          if (this.distance.toFixed(1) >= 0.5) return;
          this.distance += 0.1;
        } else {
          if (this.distance.toFixed(1) <= 0.1) return;
          this.distance -= 0.1;
        }
      },

      handleClickDirection(type) {
        this.$bus.$emit('updateTingkaoweiPosOrDeg', type, this.calcDistance);
      },

      pickerClick(type) {
        if (type == 'add') {
          if (this.pickerAngle == 90) return;
          this.pickerAngle += 1;
        } else {
          if (this.pickerAngle == -90) return;
          this.pickerAngle -= 1;
        }
      },
      angleClick(index) {
        this.pickerAngle = this.angleList[index];
      },
    },
    watch: {
      pickerAngle(val) {
        this.angleActiveIndex = this.angleList.findIndex(angle => angle == +val);
        typeof val === 'number' && this.$bus.$emit('updateTingkaoweiPosOrDeg', 'deg', +val);
      },
    },

    beforeDestroy() {
      this.$bus.$off('stopSendPoint');
    },
  };
</script>
