<style lang="scss" scoped>
  .box {
    display: flex;
    height: 460px;
    position: absolute;
    right: 0;
    z-index: 2;
    top: 47%;
    transform: translateY(-50%);

    .angle-box {
      width: 80px;
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

    .picker-box {
      width: 129px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: url('@/assets/images/anglePanel.png') left center / cover no-repeat;
      padding: 30px 0;

      .add {
        width: 60px;
        height: 60px;
        margin-left: 40px;
      }
      .reduce {
        width: 60px;
        height: 60px;
        margin-left: 40px;
      }
    }
  }
</style>
<template>
  <div class="box">
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
    <div class="picker-box">
      <img src="../../assets/images/excavator/add.png" class="add" @click="pickerClick('add')" />
      <scroll-picker :options="pickerList" v-model="pickerAngle"></scroll-picker>
      <img src="../../assets/images/excavator/zoomOut.png" class="reduce" @click="pickerClick('sub')" />
    </div>
  </div>
</template>

<script>
  import { ScrollPicker } from 'vue-scroll-picker';
  import 'vue-scroll-picker/dist/style.css';

  export default {
    name: 'givePoint',
    components: {
      ScrollPicker,
    },
    data() {
      return {
        item: null,
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
    props: ['prePointStatus', 'visible'],
    computed: {
      pointItem() {
        return this.$store.state.excavator.pointItem;
      },
    },
    created() {
      this.$bus.$on('clickPoint', data => {
        this.item = data;
      });

      // 接收底部确定按钮
      this.$bus.$on('sendPoint', this.sendPointHandler);
    },
    methods: {
      sendPointHandler() {
        let offset = localStorage.getItem('parameter')
          ? JSON.parse(localStorage.getItem('parameter'))
          : [
              this.$store.state.carInfo?.excavatorOffsetLength || 0,
              this.$store.state.carInfo?.excavatorOffsetWidth || 0,
            ];
        this.$store.commit('excavator/setGivepointIndex', this.pointItem.stop_num);
        if (this.$store.state.excavator.rgnloadMode == 0)
          this.$store.commit('excavator/setGivePointInfo', { value: [null, null] });
        // 双侧指点保存指点信息
        if (this.$store.state.excavator.rgnloadMode == 1) {
          let pointObj = {
            offsetHeading: this.pickerAngle,
            carHeading: this.$store.state.excavator.positionInfo.heading || 0,
          };
          this.$store.commit('excavator/setGivePointInfo', { index: this.pointItem.stop_num, value: pointObj });
        }
        this.socket.send(
          JSON.stringify({
            type: 'givePoint',
            imei: this.pointItem?.imei || '',
            stop_num: this.pointItem.stop_num ?? -1,
            offsetHeading: this.pickerAngle,
            offsetLen_L: offset[0],
            offsetWidth_D: offset[1],
            preStopFlag: this.prePointStatus ? '1' : '0',
            rgnloadMode: this.$store.state.excavator.rgnloadMode,
          })
        );
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
      visible(val) {
        if (val) {
          this.angleActiveIndex = 2;
          this.pickerAngle = 0;
        }
      },
      pickerAngle(val) {
        this.angleActiveIndex = this.angleList.findIndex(angle => angle == +val);
        typeof val === 'number' && this.$bus.$emit('changeManualPointAngle', +val);
      },
    },
    beforeDestroy() {
      this.$bus.$off('sendPoint', this.sendPointHandler);
    },
  };
</script>
