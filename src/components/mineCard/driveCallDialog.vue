<template>
  <div v-if="driveData.modeindex.length" class="pre-warning-terminal-outer">
    <div class="pre-warning-terminal-inner">
      <div class="pre-warning-terminal-bg1">
        <!-- 周边车辆 -->
        <div v-if="driveData.modeindex.includes(3)">
          <div
            class="collisionScope"
            v-for="(item, index) in driveData.rotatedeg"
            :key="index"
            :style="{ transform: 'rotate(' + item + 'deg' }"
          ></div>
        </div>
        <!-- 障碍物 -->
        <div v-if="driveData.modeindex.includes(5)">
          <div
            class="collisionScope"
            :style="{ transform: 'rotate(' + (driveData.obstructionDistance > 0 ? 0 : 180) + 'deg' }"
          ></div>
        </div>

        <img
          :src="driveData.direction == 'left' ? departureLeftIco : departureRightIco"
          :class="driveData.direction == 'left' ? 'departureIco departureLeftIco ' : 'departureIco departureRightIco'"
          v-if="driveData.modeindex.includes(4)"
        />
      </div>
      <div
        :class="`collisionDistance ${driveData.obstructionDistance < 0 && 'collisionDistance-back'}`"
        v-if="driveData.modeindex.includes(5)"
      >
        {{ driveData.obstructionDistance }}m
      </div>
      <div class="skew-elm1">
        <div class="skew-elm2">
          <!-- 逆行 -->
          <div class="con">
            <div class="retrogradeWebp-skew-elm1" v-if="driveData.modeindex.includes(2)">
              <div class="retrogradeWebp-skew-elm2">
                <div class="retrogradeWebp" />
              </div>
            </div>
            <!-- 车道偏离 -->
            <div
              class="retrogradeWebp-skew-elm1-lanede-viation"
              v-if="driveData.modeindex.includes(4) && driveData.direction == 'left'"
            >
              <div class="retrogradeWebp-skew-elm2">
                <div class="retrogradeWebplanedeviation"></div>
              </div>
            </div>
            <div
              class="retrogradeWebp-skew-elm1-lanede-viation-right"
              v-if="driveData.modeindex.includes(4) && driveData.direction == 'right'"
            >
              <div class="retrogradeWebp-skew-elm2-right">
                <div class="retrogradeWebplanedeviation-right" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 路权终点 -->
      <div class="pre-warning-terminal-carIco" />
      <div class="rotateRemindImage" v-if="driveData.modeindex.includes(1)">
        <div class="forbiddenImage"></div>
      </div>

      <div :class="`pre-warning-terminal-downtext ${isEN && 'pre-warning-downtext-en'}`" v-if="downText">
        <span class="text">{{ downText }}</span>
      </div>
      <div
        :class="`pre-warning-terminal-uptext ${isEN && 'pre-warning-uptext-en'}`"
        v-if="driveData.modeindex.includes(1)"
      >
        <span class="text">
          {{ `${toLang('wayEnd')} ${driveData.distance}m` }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'driveCallDialog',
    props: {
      driveData: {
        type: Object,
        default: {
          modeindex: 0, //0：路权 1：路口 2：逆行 3：报警全开 4：车道偏离 必传
          distance: 30, //路口距离/报警全开显示的距离
          direction: 'left', //车道偏离方向
          rotatedeg: 180, //报警全开旋转角度
          departureDirection: 'left', // modelindex为5时的车道偏离方向
        },
      },
    },
    data() {
      return {
        departureRightIco: '/assets/images/departureRightIco.png',
        departureLeftIco: '/assets/images/departureLeftIco.png',
        driveDataList: {
          0: this.toLang('rearMineCard'),
          2: this.toLang('retrograde'),
          3: this.toLang('surrounding'),
          4: this.toLang('departure'),
        },
      };
    },
    computed: {
      downText() {
        if (this.driveData.modeindex.includes(3))
          return `请注意${this.driveData.obstructionDistance < 0 ? '后方' : '前方'}${this.driveData.obstaclesType}`;
        if (this.driveData.modeindex.includes(3)) return this.toLang('surrounding');
        if (this.driveData.modeindex.includes(4)) return this.toLang('departure');
        if (this.driveData.modeindex.includes(2)) return this.toLang('retrograde');
        return '';
      },
    },
    methods: {
      showDetailbtn(id) {
        this.$emit('callbtnclick', id);
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
    background-image: url('../../assets/images/alarmBackgroundFrame.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: absolute;
    left: 15px;
    bottom: 129px;

    .pre-warning-terminal-inner {
      width: 100%;
      height: 100%;
      background-image: url('../../assets/images/alarmBackground.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      position: relative;

      .pre-warning-terminal-bg1 {
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url('../../assets/images/scope.png');
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 90%;
        height: 265px;
        transform: scaleY(0.5);

        .collisionScope {
          background-image: url('../../assets/images/collisionScope.png');
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
      }
      .collisionDistance {
        padding: 12px 25px;
        box-sizing: border-box;
        position: absolute;
        background-image: url('../../assets/images/collisionDistance.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        font-size: 26px;
        font-family: Source Han Sans CN, Source Han Sans CN-Medium;
        font-weight: 500;
        text-align: center;
        color: #f2f2f2;
        top: 140px;
        left: 50%;
        transform: translate(-50%, 0);
        z-index: 9;
      }
      .collisionDistance-back {
        top: 320px;
      }
      .pre-warning-terminal-carIco {
        background-image: url('../../assets/images/carIco.png');
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
        background-image: url('../../assets/images/downAlarmWindowRed.png');
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
        background-image: url('../../assets/images/upAlarmWindowRed.png');
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
      background-image: url('../../assets/images/road.png');
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
      background-image: url('../../assets/images/retrogradeWebp.webp');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    .retrogradeWebpRotate {
      width: 100%;
      height: 100%;
      background-image: url('../../assets/images/retrogradeWebp.webp');
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
      background-image: url('../../assets/images/crossRed.png');
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
