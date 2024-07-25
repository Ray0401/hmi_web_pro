<!-- 组件说明：
底部栏
modeFlag:1:人工自动模式    2：采集模式   3 空
rmodeFlag: true  设置/登录/作业  false 退出 -->
<template>
  <div>
    <div class="contentfooter">
      <MessagePublic />
      <div class="footermiddlebox" v-if="!givePointflag">
        <template v-if="!noEntrySetting">
          <div :class="`middleIconList ${(ispointEmpty || isIntoWork) && 'middleIcon-click'}`" @click="middleclick(1)">
            <img :src="middleIconList[0].icon" class="icon" />
            <span class="text">{{ toLang(middleIconList[0].text) }}</span>
          </div>
          <div
            :class="`middleIconList ${(ispointEmpty || isunPack) && canClickKaiZhuangBtn && 'middleIcon-click'}`"
            @click="middleclick(2)"
          >
            <img :src="middleIconList[1].icon" class="icon" />
            <span class="text">{{ toLang(middleIconList[1].text) }}</span>
          </div>
          <div :class="`middleIconList ${(ispointEmpty || isDriveAway) && 'middleIcon-click'}`" @click="middleclick(3)">
            <img :src="middleIconList[2].icon" class="icon" />
            <span class="text">{{ toLang(middleIconList[2].text) }}</span>
          </div>
          <div class="top">
            <img
              class="img"
              :src="
                getAssetsFile(`images/excavator/${pointItem.stop_num == 1 ? 'rhombus-active' : 'triangle-active'}.png`)
              "
            />
          </div>
        </template>
        <template v-else>
          <div
            v-for="(item, index) in AreaCollect"
            :key="index"
            :class="`middleIconList ${
              (index == noEntryState || (index == 2 && noEntryState != 0)) && 'middleIcon-click'
            }`"
            @click.stop="setNoEnteryClick(index)"
          >
            <img :src="item.icon" class="icon" />
            <span class="text">{{ item.text }}</span>
          </div>
        </template>
      </div>
      <div class="footer-right-box" v-if="!(givePointflag || noEntrySetting)">
        <div class="footerright">
          <div
            class="footerrightlist"
            :key="item.index"
            v-for="item in footerrightarrdata"
            @click="statebtnclick(item.index)"
          >
            <img :src="btnclickindex == item.index ? item.iconclick : item.icon" class="footerrightbtnicon" />
          </div>
        </div>
      </div>
      <div class="directions" v-if="givePointflag || noEntrySetting">
        <div
          :class="`footerrightlist ${
            noEntrySetting && item.index == 1 && noEntryState != 2 && 'footerrightlist-none'
          } ${!item.isClick && 'disable'}`"
          :key="item.index"
          v-for="item in directionDate"
          @click="directionsClick(item.index)"
        >
          <img :src="item.icon" class="footerrightbtnicon" />
        </div>
      </div>
      <MessageModal
        :message="message"
        :showCancel="showCancel"
        v-if="showModal"
        @confirm="confirm"
        @cancel="cancel"
        :confirmText="confirmText"
      />
      <GiveModal v-if="showGiveModal" @hideShowModel="hideShowModel" />
      <TopInfo :text="'请顺时针转动铲臂，设定回转范围的起点和终点'" v-if="noEntrySetting" />
    </div>
    <FooterPublic />
  </div>
</template>

<script>
  import { directionDate, footerrightarrdata, middleIconList, AreaCollect } from './data.js';
  import FooterPublic from '../components/footerPublic.vue';
  import MessagePublic from '../components/messagePublic.vue';
  import MessageModal from '../components/messageModal.vue';
  import TopInfo from './top-info.vue';
  import GiveModal from './giveModal.vue';
  import { sendMsgToBackend, speak, getAssetsFile } from '@/utils/utils';
  export default {
    props: {
      givePointflag: {
        type: Boolean,
        default: false,
      },
      pointItem: {
        type: Object,
        default: () => {},
      },
      noEntrySetting: {
        type: Boolean,
        default: false,
      },
      headerListData: {
        type: Object,
        default: () => {},
      },
    },

    components: {
      FooterPublic,
      MessagePublic,
      MessageModal,
      GiveModal,
      TopInfo,
    },
    computed: {
      // 判断来源不是8b01但是有车信息
      ispointEmpty() {
        // console.log('this.pointItem 1', this.pointItem);
        return Object.keys(this.pointItem).length != 0 && this.pointItem.imei && this.pointItem.from != '8b01';
      },
      //8b01 允许驶入
      isIntoWork() {
        // console.log('this.pointItem 2', this.pointItem);
        // console.log(this.$store.state.excavator.middleclickindex);
        // console.log(this.pointItem);
        // console.log(this.$store.state.excavator.middleclickindex[Number(this.pointItem.stop_num)]);

        return (
          this.pointItem.stop_group_status == 2 &&
          this.$store.state.excavator.middleclickindex[Number(this.pointItem.stop_num)] != 1
        );
      },
      //8b01 开装
      isunPack() {
        return (
          (this.pointItem.task == '停靠完成' ||
            this.pointItem.task == '停靠不到位' ||
            (this.pointItem.task == '驶入停靠' &&
              (this.pointItem.stopReason?.includes('遇障停车') || this.pointItem.stopReason?.includes('故障停车')))) &&
          this.$store.state.excavator.middleclickindex[Number(this.pointItem.stop_num)] != 2
        );
      },
      //8b01 满载驶离
      isDriveAway() {
        return (
          this.pointItem.task == '装载中' &&
          this.$store.state.excavator.middleclickindex[Number(this.pointItem.stop_num)] != 3
        );
      },
      follow() {
        return this.$store.state.excavator.follow;
      },
    },
    // test测试使用
    watch: {
      isIntoWork(val) {
        if (val && this.$store.state.carInfo.autotest != 0) this.middleclick(1);
      },
      isunPack(val) {
        if (val && this.$store.state.carInfo.autotest != 0) this.middleclick(2);
      },
      isDriveAway(val) {
        if (val && this.$store.state.carInfo.autotest != 0) {
          setTimeout(() => {
            this.middleclick(3);
          }, 31000);
        }
      },
    },
    data() {
      return {
        directionDate,
        footerrightarrdata,
        btnclickindex: null,
        middleIconList,
        message: '',
        showModal: false,
        showGiveModal: false,
        showCancel: false,
        typeInfo: '停靠不到位，是否确认开装？',
        stopReasonTips: '卡车当前为遇障停车状态，确认开装吗？',
        AreaCollect,
        noEntryState: 0,
        confirmText: '',
        entrySubmit: '是否提交设定的区域？',
        entryExit: '是否退出区域设定？',
        autoTestTime: null, //自动化测试使用
        canClickKaiZhuangBtn: true, //默认为true (司机点击车辆后移后, 在没有接收到后移结果前,不允许点击可开装)
      };
    },
    mounted() {
      this.$bus.$on('exitGather', () => {
        this.btnclickindex = null;
      });
      this.$bus.$on('planningSuccess', data => {
        // 如果是自动指点,则不处理后续逻辑
        if (this.$store.state.excavator.autoPointMode) return;

        if (this.follow == 0) {
          this.showGiveModal = false;
          this.showModal = true;
        }
        let list = this.$store.state.excavator.planningResultList;
        if (data.data[0]?.result == '指点成功') {
          this.message = this.toLang('planningSucceeded');
          this.$store.commit('excavator/setMiddleClickIndex', { value: [null, null] });
          this.$emit('setPointSuccess');

          if (this.follow == 0) this.$store.commit('setCarInfo', { sendLastPointInfo: 1 });
          speak('路径规划成功', 6);
          if (this.follow != 0) list[this.follow - 1] = this.message;
        } else if (data.data[0]?.result == '中断成功') {
          this.message = '路径规划已中断，请重新指点';
          speak('路径规划中断', 6);
          if (!list[0] && !list[1]) {
            this.showGiveModal = false;
            this.showModal = true;
          } else {
            if (this.follow != 0) list[this.follow - 1] = '路径规划中断';
          }
        } else {
          this.message = `${this.toLang('planningFailed')}<br/>${data.data[0]?.failReason}`;
          speak('路径规划失败，请重新指点', 6);
          if (this.follow != 0) list[this.follow - 1] = '路径规划失败';
        }
        // this.$store.commit('excavator/setPlanningResultList', [...list]);
        // 双侧跟随发送第二个点
        // if (this.follow == 1) {
        //   this.socket.send(
        //     JSON.stringify({
        //       type: 'sendLastPointInfo1',
        //     })
        //   );
        //   this.$store.commit('excavator/setFollow', 2);
        // }
      });
      this.$bus.$on('planningError', data => {
        this.showGiveModal = false;
      });
      this.$bus.$on('resetMiddleClickIndex', () => {
        this.$store.commit('excavator/setMiddleClickIndex', { value: [null, null] });
      });
      this.$bus.$on('showGiveModel', () => {
        this.showGiveModal = true;
      });
      this.$bus.$on('stopSendPoint', bool => {
        this.directionDate[0].isClick = !bool;
      });
      this.$bus.$on('receive8114', () => {
        this.canClickKaiZhuangBtn = true;
      });
      this.$bus.$on('canClickKaizhuangBtn', value => {
        this.canClickKaiZhuangBtn = value;
      });
    },
    methods: {
      getAssetsFile,
      hideShowModel() {
        this.showGiveModal = false;
        this.$store.commit('excavator/setPlanningResultList', []);
        this.$store.commit('excavator/setFollow', 0);
      },
      // 设定按钮点击
      setNoEnteryClick(index) {
        if (index == 0) {
          this.noEntryState = 1;
          this.$bus.$emit('startNoEntry');
        }
        if (index == 2) {
          this.noEntryState = 0;
          this.$bus.$emit('deleteNoEntry');
        }
        if (index == 1) {
          this.noEntryState = 2;
          this.$bus.$emit('stopNoEntry');
        }
      },
      confirm() {
        this.showModal = false;
        this.showCancel = false;
        this.confirmText = '';
        this.noEntryState = 0;
        if (this.message == this.typeInfo || this.message == this.stopReasonTips) {
          this.middleclick(2, true);
        }
        if (this.message == this.toLang('planningSucceeded')) {
          this.$bus.$emit('hidePoint');
          this.$emit('setGivePointFlag');
        }
        if (this.message == this.entrySubmit) {
          this.$emit('closeSettingNoEntry');
          this.$bus.$emit('closeNoEntry', { type: 'submit' });
        }
        if (this.message == this.entryExit) {
          this.$emit('closeSettingNoEntry');
          this.$bus.$emit('closeNoEntry', { type: 'delete' });
        }
      },
      cancel() {
        this.confirmText = '';
        this.showModal = false;
        this.showCancel = false;
      },
      statebtnclick(index) {
        this.btnclickindex = index;
        this.$emit('statebtn', index);
        // this.$bus.$emit('updateNum', index)
      },
      // 退出按钮点击
      directionsClick(index) {
        if (index == 1) {
          console.log('this.givePointflag', this.givePointflag);
          if (this.givePointflag) {
            // 实车测试,车辆定位不为RTK，GPS则不可进行指点操作
            if (
              this.$store.state.carInfo.autotest == 0 &&
              !(this.headerListData.rtkstate == 'RTK' || this.headerListData.rtkstate == 'GPS')
            ) {
              this.message = '定位数据异常，无法指点';
              this.showModal = true;
              this.showCancel = false;
              return false;
            }
            //通知givePoint发送数据
            this.showGiveModal = true;
            this.$store.commit('excavator/setFollow', 0);
            this.$store.commit('excavator/setPlanningResultList', []);
            this.$bus.$emit('sendPoint');
          }
          if (this.noEntrySetting) {
            this.message = this.entrySubmit;
            this.showModal = true;
            this.showCancel = true;
            this.confirmText = '提交';
          }
        } else {
          if (this.givePointflag) {
            // 通知地图删除指点信息
            this.$bus.$emit('hidePoint');
            this.$emit('setGivePointFlag');
          }
          if (this.noEntrySetting) {
            this.message = this.entryExit;
            this.showModal = true;
            this.showCancel = true;
            this.confirmText = '退出';
          }
        }
      },
      middleclick(index, bool) {
        if (
          index == 2 &&
          (this.pointItem.task == '停靠不到位' || this.pointItem.stopReason.includes('遇障停车')) &&
          !bool
        ) {
          this.showModal = true;
          this.message = this.pointItem.task == '停靠不到位' ? this.typeInfo : this.stopReasonTips;
          this.showCancel = true;
          return false;
        }
        // 自动化测试需求，点击驶离1min后停靠位没有车辆信息自动发送指点消息
        if (index == 3 && this.$store.state.carInfo.autotest != 0) {
          clearTimeout(this.autoTestTime);
          this.autoTestTime = setTimeout(() => {
            if (!this.pointItem.imei) {
              this.showGiveModal = true;
              this.$bus.$emit('sendPoint');
            }
          }, 60000);
        }
        this.$store.commit('excavator/setMiddleClickIndex', { value: index, index: this.pointItem.stop_num });
        let cmd = null;
        switch (index) {
          case 1:
            cmd = 0x0b;
            break;
          case 2:
            cmd = 0x0a;
            break;
          case 3:
            cmd = 0x01;
        }
        this.$store.commit('setMessageList', `${this.toLang(this.middleIconList[index - 1].text)}已发送`);
        sendMsgToBackend(`${this.toLang(this.middleIconList[index - 1].text)}已发送`);
        this.socket.send(
          JSON.stringify({
            type: 'ExcavatorCmd',
            truckName: this.pointItem.name || this.pointItem?.child_point?.name || '',
            truckImei: this.pointItem.imei || this.pointItem?.child_point?.imei || '',
            task: 0x01, //0x00：未知作业,0x01：装载作业,0x02卸载作业
            cmd: cmd,
            loadStatus: index == 3 ? 0x02 : 0x01,
            index: this.pointItem.stop_num,
          })
        );
        if (index == 1) {
          this.socket.send(
            JSON.stringify({
              type: 'setPointState',
              stop_num: this.pointItem.stop_num,
              state: 1,
            })
          );
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @keyframes BToU {
    0% {
      bottom: -100vh;
    }

    100% {
      bottom: 0;
    }
  }

  .contentfooter {
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
      padding: 0px 60px 5px 60px;
      background-image: url('../../assets/images/excavator/control.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 415px;
      height: 160px;
      position: relative;
      text-align: center;
      display: flex;
      justify-content: space-evenly;
      align-items: flex-end;
      z-index: 1;
      box-sizing: border-box;
      flex-shrink: 0;

      .middleIconList {
        display: flex;
        flex-direction: column;
        color: #ffffff;
        pointer-events: none;
        opacity: 0.3;
        .icon {
          width: 70px;
          height: 70px;
        }
        .text {
          font-family: PingFang SC Regular, PingFang SC Regular-Regular;
          text-align: center;
          color: #ffffff;
          font-size: 16px;
          font-weight: 400;
          line-height: 32px;
        }
      }
      .middleIcon-click {
        pointer-events: inherit;
        opacity: 1;
        .icon {
        }
      }
      .top {
        position: absolute;
        width: 44px;
        height: 44px;
        top: 34px;
        left: 58px;
        transform: translate(-50%, -50%);
        .img {
          width: 44px;
          height: 44px;
        }
      }
    }

    @keyframes RToI {
      from {
        width: 0px;
      }
    }
    .footer-right-box {
      width: 30vw;
      display: flex;
      justify-content: flex-end;
    }
    .footerright {
      width: 100%;
      max-width: 350px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      animation: RToI 300ms;
      .footerrightlist {
        .footerrightbtnicon {
          width: 90px;
          height: 90px;
        }
      }
    }
    .directions {
      display: flex;
      margin-bottom: 20px;
      animation: RToI 300ms;
      justify-content: flex-end;
      .footerrightlist {
        &:first-child {
          margin-right: 30px;
        }
        .footerrightbtnicon {
          width: 90px;
          height: 90px;
        }

        &.disable {
          opacity: 0.3;
          pointer-events: none;
        }
      }
      .footerrightlist-none {
        pointer-events: none;
        opacity: 0.5;
      }
    }
    .exit-btn {
      margin-left: 100px;
      margin-bottom: 20px;
    }
  }
</style>
