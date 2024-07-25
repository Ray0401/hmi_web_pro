<template>
  <div class="quick-stop">
    <!-- <div class="stop" v-if="!givePointflag">
      <div v-for="item in stopcar" :key="item.index">
        <img
          @click="btnclick(item)"
          class="stopCar"
          v-if="item.index != 1 || (pointItem.stopReason && pointItem.stopReason.includes('电铲快速停车'))"
          :src="btnclickindex == item.index ? item.iconclick : item.icon"
          
         />
      </div>     
    </div> -->

    <!-- 快速停车或者启动选择卡车列表 -->
    <div class="stop-box" v-if="!givePointflag">
      <QuickDialog :instructionType="'stop'" :carList="quickCarList" :parkAllocationStatus="parkAllocationStatus" />
    </div>

    <div class="output-btn" v-if="!givePointflag">
      <div class="preview-load-map">
        <img
          class="preview"
          v-if="!isClickPreview"
          @click="previewLoadMap"
          :src="getAssetsFile('images/excavator/preview.png')"
        />
        <img class="preview" v-else :src="getAssetsFile('images/excavator/preview_click.png')" />
      </div>

      <div class="chanliangtongji">
        <div class="tips" v-if="showTips"></div>
        <img class="output" @click="setOutPutModal" :src="getAssetsFile('images/excavator/output.png')" />
      </div>

      <img
        class="follow"
        @click="setSettingBackDistance"
        :src="getAssetsFile(`images/excavator/${isTaskLoad ? 'backDistance' : 'backDistanceGray'}.png`)"
      />
    </div>

    <div class="usepreview-box" v-if="!givePointflag">
      <UsePreviewDialog :visible="usePreviewVisible" @closeUsePreviewDialog="closeUsePreviewDialog" />
    </div>

    <!-- <div class="setting-btn" v-if="givePointflag">
      <img class="settingBtn" @click="setShowModal" :src="`/assets/images/excavator/settingBtn.png`" />
    </div> -->
    <OutputTable v-if="showOutputModal" :outPutList="outPutList" @setOutPutModal="setOutPutModal" />
    <SettingBackDIstanceVue
      :pointItem="pointItem"
      v-if="showSettingBackDistance"
      @close="close"
      @startTimeout="startTimeout"
    />
  </div>
</template>

<script>
  import SettingExcavatorModal from './settingExcavatorModal.vue';
  import OutputTable from './outputTable.vue';
  import SettingBackDIstanceVue from './settingBackDIstance.vue';
  import QuickDialog from './quickDialog.vue';
  import UsePreviewDialog from './usePreviewDialog.vue';
  import { sendMsgToBackend, getAssetsFile } from '@/utils/utils';

  export default {
    name: 'quickstop',
    components: {
      SettingExcavatorModal,
      OutputTable,
      SettingBackDIstanceVue,
      QuickDialog,
      UsePreviewDialog,
    },
    props: {
      pointItem: {
        type: Object,
        default: () => {},
      },
      outPutList: {
        type: Array,
        default: () => [],
      },
      givePointflag: {
        type: Boolean,
        default: false,
      },
      parkAllocationStatus: {
        type: Array,
        default: () => [],
      },
      previewVisible: {
        type: Boolean,
        default: false,
      },
      usePreviewVisible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        btnclickindex: null,
        stopcar: [
          {
            index: 1,
            icon: getAssetsFile('images/excavator/resumeDriving.png'),
            iconclick: getAssetsFile('images/excavator/resumeDrivingClick.png'),
          },
          {
            index: 2,
            icon: getAssetsFile('images/excavator/emergency.png'),
            iconclick: getAssetsFile('images/excavator/emergencyClick.png'),
          },
        ],
        showModal: false,
        showOutputModal: false,
        showTips: true,
        showSettingBackDistance: false,
        quickCarList: [
          // { iemi: '1', name: '测试车辆1', stopIcon: true, startIcon: false },
          // { iemi: '2', name: '测试车辆2', stopIcon: true, startIcon: false },
        ],
        isClickPreview: false,
        canClickBackDistanceBtn: true, //车辆后移按钮是否可以点击
      };
    },
    watch: {
      outPutList(val, oldval) {
        if (!this.showOutputModal && val.length) this.showTips = true;
      },
      carImei(val) {
        this.btnclickindex = null;
      },
      previewVisible(val) {
        if (!val) this.isClickPreview = false;
      },
    },
    computed: {
      carImei() {
        return this.pointItem.imei;
      },
      sendLastPointInfo() {
        return this.$store.state.carInfo?.sendLastPointInfo;
      },
      isTaskLoad() {
        const { task = '', stopReason = '' } = this.pointItem;
        const taskArr = ['停靠完成', '停靠不到位'];
        return (taskArr.includes(task) || stopReason.includes('遇障停车')) && this.canClickBackDistanceBtn;
      },
    },

    created() {
      this.$bus.$on('quickCarList', data => {
        this.quickCarList = data
          .filter(item => (item.stop_type == 1 || item.stop_type == 3) && item.imei)
          .map(item => {
            // let target = this.parkAllocationStatus.find(v => v.imei === item.imei);
            let bool = item.stopReason && item.stopReason.includes('电铲快速停车');
            return {
              ...item,
              startIcon: bool,
              stopIcon: true,
            };
          });
      });
      // 接收到车辆后移规划结果
      this.$bus.$on('receive8114', () => {
        this.canClickBackDistanceBtn = true;
        clearTimeout(this.startTimeoutTimer);
        this.startTimeoutTimer = null;
      });
    },

    methods: {
      getAssetsFile,
      previewLoadMap() {
        if (this.usePreviewVisible) return this.$toast('当前装载区存在预览数据');
        this.isClickPreview = true;
        this.$bus.$emit('showPreviewDialog');
      },
      closeUsePreviewDialog() {
        this.$emit('closeUsePreviewDialog');
      },
      setOutPutModal() {
        this.showOutputModal = !this.showOutputModal;
        if (this.showOutputModal) this.showTips = false;
      },

      // 发送上次指点信息
      sendPointInfo() {
        if (this.sendLastPointInfo != 1) return false;
        if (this.pointItem.stop_num == 0) this.socket.send(JSON.stringify({ type: 'sendLastPointInfo' }));
        if (this.pointItem.stop_num == 1) this.socket.send(JSON.stringify({ type: 'sendLastPointInfo1' }));
        // let list = this.parkAllocationStatus;
        // let stopNumList = [];
        // for (let i = 0; i < list.length; i++) {
        //   if (list[i].from == '8b01') {
        //     stopNumList.push(list[i].stop_num);
        //   }
        // }
        // let bool = this.$store.state.excavator.webRgnLoadMode == 1 && stopNumList.length == 1;
        // if (bool && stopNumList[0] == 1) {
        //   this.socket.send(JSON.stringify({ type: 'sendLastPointInfo1' }));
        // } else {
        //   this.socket.send(JSON.stringify({ type: 'sendLastPointInfo' }));
        // }
        this.$bus.$emit('showGiveModel');
        // this.$store.commit('excavator/setFollow', bool ? 0 : this.$store.state.excavator.webRgnLoadMode);
        // this.$store.commit('excavator/setPlanningResultList', []);
      },
      btnclick(item) {
        if (!this.carImei) return this.$toast('暂无车辆信息');
        if (this.btnclickindex == item.index) return false;
        this.btnclickindex = item.index;
        let obj = {
          type: 'ExcavatorCmd',
          truckName: this.pointItem.name || this.pointItem?.child_point?.name || '',
          truckImei: this.pointItem.imei || this.pointItem?.child_point?.imei || '',
          task: 0x01, //0x00：未知作业,0x01：装载作业,0x02卸载作业
          cmd: item.index == 1 ? 0x05 : 0x04,
          loadStatus: 0x01,
          index: 0x01,
        };
        this.socket.send(JSON.stringify(obj));
        this.$store.commit(
          'setMessageList',
          `${this.toLang(item.index == 1 ? 'resumeDriving' : 'emergencyPullOver')}已发送`
        );
        sendMsgToBackend(`${this.toLang(item.index == 1 ? 'resumeDriving' : 'emergencyPullOver')}已发送`);
      },
      setSettingBackDistance() {
        if (!this.canClickBackDistanceBtn) return this.$toast('请等待车辆后移规划结果');
        if (!this.isTaskLoad) return false;
        this.showSettingBackDistance = true;
      },
      close() {
        this.showSettingBackDistance = false;
      },

      // 异常清况处理:倒计时内未接收到车辆后移规划结果,车辆后移按钮可以再次点击
      startTimeout() {
        this.$bus.$emit('canClickKaizhuangBtn', false);
        this.canClickBackDistanceBtn = false;
        this.startTimeoutTimer = setTimeout(() => {
          this.canClickBackDistanceBtn = true;
          clearTimeout(this.startTimeoutTimer);
          this.startTimeoutTimer = null;
          this.$store.commit('setMessageList', '40s内未接收到车辆后移规划结果,请再次申请车辆后移');
          this.$bus.$emit('canClickKaizhuangBtn', true);
        }, 1000 * 40);
      },
    },
    beforeDestroy() {
      this.$bus.$off('quickCarList');
    },
  };
</script>

<style lang="scss" scoped>
  .quick-stop {
    // position: absolute;
    // top: 55px;
    // right: 20px;
    position: fixed;
    top: 55px;
    right: 0px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .output-btn {
    display: flex;
    .chanliangtongji {
      position: relative;
      .tips {
        width: 15px;
        height: 15px;
        background: #d91a1a;
        border-radius: 50%;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;
      }
    }
  }
  .stopCar-event {
    opacity: 0.7;
    pointer-events: none;
  }
  .stopCar,
  .output,
  .settingBtn {
    width: 90px;
    height: 90px;
  }
  .follow {
    width: 80px;
    height: 80px;
    margin-left: 15px;
  }

  .preview {
    width: 80px;
    height: 80px;
    margin-right: 15px;
  }
</style>
