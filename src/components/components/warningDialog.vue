<template>
  <div class="pre-warning-terminal-outer" v-if="visibleFlag">
    <div class="pre-warning-terminal-inner">
      <div class="pre-warning-terminal-bg1">
        <div v-if="warningData.surroundCar">
          <div
            class="collisionScope"
            v-for="(item, index) in warningData.surroundCar.rotatedeg"
            :key="index"
            :style="{ transform: 'rotate(' + item + 'deg' }"
          ></div>
        </div>
        <div :class="`collisionDistance ${distancePosition}`" v-if="warningData.surroundCar">
          {{ warningData.surroundCar.distance }}m
        </div>
        <img
          :src="warningData.departureDirection == 'left' ? departureLeftIco : departureRightIco"
          :class="
            warningData.departureDirection == 'left'
              ? 'departureIco departureLeftIco'
              : 'departureIco departureRightIco'
          "
          v-if="warningData.retrograde == 0 && warningData.departureDirection"
        />
      </div>

      <div class="skew-elm1">
        <div class="skew-elm2">
          <div class="con">
            <div class="retrogradeWebp-skew-elm1" v-if="warningData.retrograde">
              <div class="retrogradeWebp-skew-elm2">
                <div class="retrogradeWebp" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pre-warning-terminal-carIco" />
      <div :class="`pre-warning-terminal-downtext ${isEN && 'pre-warning-downtext-en'}`" v-if="downText">
        <span class="text">{{ downText }}</span>
      </div>

      <div :class="`pre-warning-terminal-uptext ${isEN && 'pre-warning-uptext-en'}`" v-if="upText">
        <span class="text">
          {{ upText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['warningData'],
    data() {
      return {
        departureRightIco: '/assets/images/departureRightIco.png',
        departureLeftIco: '/assets/images/departureLeftIco.png',
      };
    },
    methods: {
      showDetailbtn(id) {
        this.$emit('callbtnclick', id);
      },
    },
    computed: {
      visibleFlag() {
        const { surroundCar, retrograde, departureDirection } = this.warningData;
        if (surroundCar || retrograde || departureDirection) return true;
        return false;
      },

      downText() {
        if (this.warningData.surroundCar) {
          return this.toLang('surrounding');
        } else {
          if (this.warningData.retrograde == 1) {
            return this.toLang('retrograde');
          } else {
            if (this.warningData.departureDirection) {
              return this.toLang('departure');
            }
          }
        }
      },

      upText() {
        if (this.warningData.surroundCar) {
          if (this.warningData.retrograde == 1) {
            return this.toLang('retrograde');
          } else {
            if (this.warningData.departureDirection) {
              return this.toLang('departure');
            }
          }
        } else {
          return '';
        }
      },

      distancePosition() {
        if (this.warningData.surroundCar) {
          const rotatedeg = this.warningData.surroundCar.rotatedeg;
          if (rotatedeg == 0) return 'topCenter';
          if (rotatedeg == 180) return 'bottomCenter';
          if (rotatedeg > 0 && rotatedeg <= 90) return 'topRight';
          if (rotatedeg > 90 && rotatedeg < 180) return 'bottomRight';
          if (rotatedeg > 180 && rotatedeg <= 270) return 'bottomLeft';
          if (rotatedeg > 270 && rotatedeg < 360) return 'topLeft';
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @keyframes fadeIn {
    from {
      opacity: 0.3;
    }
    to {
      opacity: 1;
    }
  }
  .pre-warning-terminal-outer {
    width: 342px;
    height: 518px;
    background-image: url('@/assets/images/alarmBackgroundFrame.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: absolute;
    left: 15px;
    bottom: 129px;

    .pre-warning-terminal-inner {
      width: 100%;
      height: 100%;
      background-image: url('@/assets/images/alarmBackground.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      position: relative;

      .pre-warning-terminal-bg1 {
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url('@/assets/images/scope.png');
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 90%;
        height: 265px;
        transform: scaleY(0.5);
        z-index: 100;

        .collisionScope {
          background-image: url('@/assets/images/collisionScope.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          animation: fadeIn 0.7s linear infinite alternate;
        }

        .collisionDistance {
          padding: 12px 25px;
          box-sizing: border-box;
          position: absolute;

          background-image: url('@/assets/images/collisionDistance.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;
          font-size: 26px;
          font-family: Source Han Sans CN, Source Han Sans CN-Medium;
          font-weight: 500;
          text-align: center;
          color: #f2f2f2;
          transform: scaleY(2);
          &.topCenter {
            top: -30%;
            left: 50%;
            transform: translateX(-50%) scaleY(2);
          }
          &.bottomCenter {
            bottom: -30%;
            left: 50%;
            transform: translateX(-50%) scaleY(2);
          }

          &.topLeft {
            top: -30%;
            left: 0;
          }
          &.topRight {
            top: -30%;
            right: 0;
          }
          &.bottomLeft {
            bottom: -30%;
            left: 0;
          }
          &.bottomRight {
            bottom: -30%;
            right: 0;
          }
        }
      }

      .pre-warning-terminal-carIco {
        background-image: url('@/assets/images/carIco.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 215px;
        height: 68px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }

      .pre-warning-terminal-downtext {
        background-image: url('@/assets/images/downAlarmWindowRed.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 90%;
        height: 66px;
        position: absolute;
        bottom: 24px;
        left: 0;
        right: 0;
        margin: auto;
        font-size: 24px;
        font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
        font-weight: 500;
        text-align: center;
        color: #f2f2f2;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .pre-warning-downtext-en {
        height: 80px;
        line-height: 1.2;
        .text {
          width: 80%;
        }
      }
      .pre-warning-terminal-uptext {
        width: 100%;
        height: 66px;
        background-image: url('@/assets/images/upAlarmWindowRed.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: absolute;
        top: 10px;
        left: 0;
        right: 0;
        margin: auto;
        font-size: 24px;
        font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
        font-weight: 500;
        text-align: center;
        color: #f2f2f2;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .pre-warning-uptext-en {
        height: 90px;
        line-height: 1.2;
        .text {
          width: 80%;
        }
      }
    }

    .skew-elm1 {
      width: 60%;
      height: 80%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      transform-origin: bottom;
      transform: skew(8deg, 0deg);
      -ms-transform: skew(8deg, 0deg);
      -moz-transform: skew(8deg, 0deg);
      -webkit-transform: skew(8deg, 0deg);
      -o-transform: skew(9deg, 0deg);
      overflow: hidden;
      // border-radius: 0px 10px 20px 0px;
      margin: 0 auto;
    }

    .skew-elm2 {
      width: 100%;
      height: 100%;
      transform-origin: bottom;
      transform: skew(-16deg, 0deg);

      -ms-transform: skew(-16deg, 0deg);
      -moz-transform: skew(-16deg, 0deg);
      -webkit-transform: skew(-16deg, 0deg);
      -o-transform: skew(-16deg, 0deg);
      overflow: hidden;
      // border-radius: 10px 0px 0px 20px;
    }

    .con {
      width: 100%;
      height: 100%;
      background-image: url(@/assets/images/road.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      opacity: 0.5;
      transform-origin: bottom;
      transform: skew(8deg, 0deg);
      -ms-transform: skew(8deg, 0deg);
      -moz-transform: skew(8deg, 0deg);
      -webkit-transform: skew(8deg, 0deg);
      -o-transform: skew(8deg, 0deg);
      box-sizing: border-box;
    }

    .retrogradeWebp-skew-elm1 {
      width: 80%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      transform-origin: bottom;
      transform: skew(8deg, 0deg);
      -ms-transform: skew(8deg, 0deg);
      -moz-transform: skew(8deg, 0deg);
      -webkit-transform: skew(8deg, 0deg);
      -o-transform: skew(9deg, 0deg);
      overflow: hidden;
      margin: 0 auto;
    }

    .retrogradeWebp-skew-elm2 {
      width: 100%;
      height: 100%;
      transform-origin: bottom;
      transform: skew(-16deg, 0deg);
      -ms-transform: skew(-16deg, 0deg);
      -moz-transform: skew(-16deg, 0deg);
      -webkit-transform: skew(-16deg, 0deg);
      -o-transform: skew(-16deg, 0deg);
      overflow: hidden;
    }

    .retrogradeWebp-skew-elm2-right {
      width: 100%;
      height: 100%;
      transform-origin: bottom;
      transform: skew(16deg, 0deg);
      -ms-transform: skew(16deg, 0deg);
      -moz-transform: skew(16deg, 0deg);
      -webkit-transform: skew(16deg, 0deg);
      -o-transform: skew(16deg, 0deg);
      overflow: hidden;
    }

    .retrogradeWebp {
      width: 100%;
      height: 100%;
      background-image: url('@/assets/images/retrogradeWebp.webp');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    .retrogradeWebpRotate {
      width: 100%;
      height: 100%;
      background-image: url('@/assets/images/retrogradeWebp.webp');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      transform: rotate(180deg);
    }

    .retrogradeWebp-skew-elm1-lanede-viation-right {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      transform-origin: bottom;
      transform: skew(-8deg, 0deg);
      -ms-transform: skew(-8deg, 0deg);
      -moz-transform: skew(-8deg, 0deg);
      -webkit-transform: skew(-8deg, 0deg);
      -o-transform: skew(-9deg, 0deg);
      overflow: hidden;
      margin: 0 auto;
    }

    .retrogradeWebp-skew-elm1-lanede-viation {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      transform-origin: bottom;
      transform: skew(8deg, 0deg);
      -ms-transform: skew(8deg, 0deg);
      -moz-transform: skew(8deg, 0deg);
      -webkit-transform: skew(8deg, 0deg);
      -o-transform: skew(9deg, 0deg);
      overflow: hidden;
      margin: 0 auto;
    }

    .retrogradeWebplanedeviation {
      width: 132px;
      height: 100%;
      background-image: url('@/assets/images/departureLeft.png');
      background-repeat: no-repeat;
      position: absolute;
      // transform: skew(8deg, 0deg);
      // -ms-transform: skew(8deg, 0deg);
      // -moz-transform: skew(8deg, 0deg);
      // -webkit-transform: skew(8deg, 0deg);
      // -o-transform: skew(9deg, 0deg);
      background-size: 100% 100%;
    }

    .retrogradeWebplanedeviation-right {
      width: 132px;
      height: 100%;
      background-image: url('@/assets/images/departureRight.png');
      background-repeat: no-repeat;
      position: absolute;
      background-size: 100% 100%;
      right: 0;
    }

    .rotateRemindImage {
      background-image: url('@/assets/images/crossRed.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 66%;
      height: 115px;
      position: absolute;
      top: 50px;
      left: 0;
      right: 0;
      margin: 0 auto;

      .forbiddenImage {
        background-image: url('@/assets/images/forbidden.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 43px;
        height: 43px;
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        margin: 0 auto;
      }
    }

    .departureIco {
      width: 50px;
      height: 100px;
    }

    .departureRightIco {
      position: absolute;
      top: -50%;
      right: 10%;
    }

    .departureLeftIco {
      position: absolute;
      top: -50%;
      left: 10%;
    }
  }
</style>
