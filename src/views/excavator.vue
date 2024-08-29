<template>
  <div class="content">
    <!-- 地图 -->
    <Scene @boudName="boudName" />
    <!--头部栏 -->
    <exheader-dialog :headerListData="headerListData" :MaterialList="MaterialList"></exheader-dialog>
    <!-- < 背板> -->
    <backboard
      v-if="hideBtn"
      :parkAllocationStatus="parkAllocationStatus"
      @errorhandle="errorhandle"
      @point="givePoint"
      :givePointflag="givePointflag"
      :showGivePointBtn="showGivePointBtn"
    ></backboard>
    <!--点击登录按钮展开 -->
    <login-dialog v-if="userFlag" @close="closeUser"></login-dialog>

    <!--点击设置按钮-->
    <setting-dialog
      v-if="settingFlag"
      @close="closeSetting()"
      :versionList="versionList"
      :messagelist="[]"
    ></setting-dialog>
    <!--点击作业按钮  按钮完成-->
    <exwork-dialog
      v-show="workFlag"
      @close="closeWork()"
      :parkAllocationStatus="parkAllocationStatus"
      :prePointStatus="prePointStatus"
      :disabledPrePointSwitch="disabledPrePointSwitch"
      :MaterialList="MaterialList"
      :noEntryAreaStatus="noEntryAreaStatus"
      :settingNoEntryAreaStatus="settingNoEntryAreaStatus"
      @settingNoEntry="settingNoEntry"
      @setNoEntryAreaStatus="setNoEntryAreaStatus"
    ></exwork-dialog>
    <!-- 底部栏 -->
    <template v-if="stepDistanceFlag">
      <step-distance @exitStepDistance="exitStepDistance" @confirmStepDistance="confirmStepDistance"></step-distance>
    </template>

    <template v-if="!stepDistanceFlag">
      <exfooter-dialog
        :givePointflag="givePointflag"
        :noEntrySetting="noEntrySetting"
        :headerListData="headerListData"
        :stepDistanceFlag="stepDistanceFlag"
        @statebtn="statebtn"
        :pointItem="pointItem"
        @setGivePointFlag="setGivePointFlag"
        @closeSettingNoEntry="closeSettingNoEntry"
        @setPointSuccess="setPointSuccess"
      ></exfooter-dialog>
    </template>

    <quickstop
      v-if="hideBtn"
      :parkAllocationStatus="parkAllocationStatus"
      :givePointflag="givePointflag"
      :pointItem="pointItem"
      :outPutList="outPutList"
      :previewVisible="previewVisible"
      :usePreviewVisible="usePreviewVisible"
      @closeUsePreviewDialog="closeUsePreviewDialog"
    ></quickstop>
    <!-- 手动指点面板 -->
    <template v-if="givePointflag">
      <givePoint :prePointStatus="prePointStatus" :visible="givePointflag"></givePoint>
    </template>
    <excepthand v-if="excepthandflag" :pointItem="pointItem" @exceptcancel="errorhandle"></excepthand>

    <!-- 作业区封闭开放抽屉 -->
    <work-area
      :visible="workAreaVisible"
      :workAreaName="workAreaName"
      :workAreaStatus="workAreaStatus"
      :zone_type="zone_type"
      :zone_id="zone_id"
      @closeDrawer="closeWorkArea"
    />
    <MessageModal v-if="showModal" :message="message" @confirm="confirm" :showCancel="false" />
    <!-- 图像告警 -->
    <!-- <warning-dialog :warningData="warningData" /> -->

    <!-- 公共弹窗 -->
    <common-modal
      v-if="commonModalFlag"
      showClose
      :message="commonModalMessage"
      :warning="commonModalTip"
      :btnList="commonModalBtnList"
      :type="commonModalType"
      @close="commonModalClose"
      @cancel="commonModalCancel"
      @confirm="commonModalConfirm"
    />

    <!-- 装载区地图预览弹窗 -->
    <preview-dialog :visible="previewVisible" @close="previewVisible = false" @confirm="previewConfirm" />
    <!-- 自动指点弹窗 -->
    <auto-give-point-dialog
      :visible="autoGivePointVisible"
      :status="autoGivePointStatus"
      :info="autoGivePointModeInfo"
      :message="autopointMessage"
      @closeDialog="closeAutoGivePointModeDialog"
      @handleAutoGivePoint="handleAutoGivePoint"
    />

    <!-- 补偿参数弹窗 -->
    <SettingExcavatorModal v-if="showSettingModal" @setShowModal="setShowSettingModal" />
  </div>
</template>

<script>
  import Scene from '@/components/map/Scene.vue';
  import SettingExcavatorModal from '@/components/excavator/settingExcavatorModal.vue';
  import excepthand from '@/components/excavator/excepthand.vue';
  import givePoint from '@/components/excavator/givePoint.vue';
  import exheaderDialog from '@/components/excavator/exheaderDialog.vue';
  import loginDialog from '@/components/login/loginDialog.vue';
  import settingDialog from '@/components/setting/settingDialog.vue';
  import exworkDialog from '@/components/excavator/exworkDialog.vue';
  import exfooterDialog from '@/components/excavator/exfooterDialog.vue';
  import backboard from '@/components/excavator/backboard.vue';
  import quickstop from '@/components/excavator/quickstop.vue';
  import excavatorMixin from '@/mixins/excavator.js';
  import publicMixin from '@/mixins/public.js';

  import { sendSocket } from '@/utils/utils';
  import WorkArea from '@/components/components/workArea';
  import { defaultPointItem, defaultBilateralPointList, testitemlist } from '../components/excavator/data';
  import auxiliaryMixin from '@/mixins/auxiliary';
  import WarningDialog from '@/components/components/warningDialog';
  import previewDialog from '@/components/excavator/previewDialog.vue';
  import { SOCKET_TYPE } from '@/constant/index';
  import AutoGivePointDialog from '@/components/excavator/autoGivePointDialog';
  import { speak, sendMsgToBackend, getAssetsFile } from '@/utils/utils';
  import StepDistance from '@/components/excavator/stepDistance.vue';

  export default {
    components: {
      Scene,
      SettingExcavatorModal,
      excepthand,
      exheaderDialog,
      loginDialog,
      exworkDialog,
      settingDialog,
      exfooterDialog,
      backboard,
      quickstop,
      givePoint,
      WorkArea,
      WarningDialog,
      previewDialog,
      AutoGivePointDialog,
      StepDistance,
    },
    mixins: [publicMixin, excavatorMixin, auxiliaryMixin],
    data() {
      return {
        showSettingModal: false,
        excepthandflag: false,
        givePointflag: false,
        showGivePointBtn: false, // 面板是否显示指点按钮
        btnType: 'orange',
        // 头部数据
        headerListData: {
          area: '',
          materialicon: getAssetsFile('images/excavator/mine.png'),
          oretext: '',
          number: 0,
          state: 0,
          stateText: '',
          signalStatus: [],
          rtkstate: '',
          networkstate: [],
          UTCtime: '',
        },
        // 作业
        workFlag: false,
        // 设置
        settingFlag: false,
        versionList: [],
        // 用户
        userFlag: false,
        parkAllocationStatus: [{ ...defaultPointItem }],
        showIndex: false,
        pointItem: {}, //当前选中点位的信息
        showNum: 0,
        noEntrySetting: false,
        noEntryAreaStatus: 0,
        noEntryAreaList: null, // 不可驶入角度
        settingNoEntryAreaStatus: 1, // 不可驶入自定义配置项
        offsetAngleList: [],
        noEntryAreaListState: 0, //不可驶入配置项
        offsetAngleListState: 0,
        stopPointTimer: null,
        outPutList: [], //存疑产量列表
        MaterialList: [], //物料列表
        rgnLoadData: [], //装载区点集合
        prePointStatus: false, // 预停靠位模式开关(后续需求:修改为默认关闭状态)
        activeIndex: 0, //当前选中的作业面板
        disabledPrePointSwitch: false, // 预停靠位开关是否禁用
        previewVisible: false,
        usePreviewVisible: false, //边界预览弹窗
        autoGivePointVisible: false, // 自动指点弹窗
        autoGivePointStatus: 'default', // 自动指点状态   default:默认  loading:请求中  error:自动指点失败  success:自动指点成功
        autoGivePointModeInfo: {},
        autopointMessage: '',
        autoPointTimer: null,
      };
    },
    created() {
      this.$bus.$on('setShowModal', () => {
        this.setShowSettingModal();
      });

      this.$bus.$on('showStepDistanceFlag', () => {
        this.stepDistanceFlag = true;
      });

      // 预停靠位模式开关初始值
      this.prePointStatus = localStorage.getItem('prePointStatus') === 'true';

      this.$bus.$on('addPositionStop', data => {
        this.parkAllocationStatus.push(data);
      });
      this.$bus.$on('setPointItem', (data, index) => {
        this.activeIndex = index;
        this.pointItem = data;
        this.$store.commit('excavator/setPointItem', this.pointItem);
      });
      this.$bus.$on('setBeforePoint', data => {
        this.prePointStatus = data != undefined ? true : !this.prePointStatus;
        // this.prePointStatus = localStorage.getItem('prePointStatus') === 'true';

        if (data == 0) this.parkAllocationStatus = [{ ...defaultPointItem }];
        if (data == 1) this.parkAllocationStatus = [...defaultBilateralPointList];
      });
      this.$bus.$on('rgnLoadData', data => {
        this.rgnLoadData = data || [];
      });
      this.$bus.$on('deletePositionStop', data => {
        let list = this.parkAllocationStatus;
        for (let i = 0; i < list.length; i++) {
          if (list[i].stop_num == data.stop_num) this.parkAllocationStatus.splice(i, 1);
        }
      });
      this.$bus.$on('Headerstate', data => {
        this.headerListData.state = data;
      });
      this.$bus.$on('noEntryAreaInfo', data => {
        this.noEntryAreaList = [data.start, data.end];
        sendSocket({
          type: 'settingDoNotInto',
          status: '1', //0 不设定  1设定
          startAngle: data.start,
          endAngle: data.end,
          direction: '1',
        });
      });

      this.$bus.$on('showPreviewDialog', () => {
        this.previewVisible = true;
      });
      this.$bus.$on('showPreviewData', () => {
        this.usePreviewVisible = true;
      });
      // 自动调整选择
      this.$bus.$on('selectAutoPointMode', data => {
        this.autoGivePointStatus = 'default';
        this.autoGivePointModeInfo = data;
        this.autoGivePointVisible = true;
      });

      // 手动调整选择
      this.$bus.$on('selectManualPointMode', data => {
        this.autoGivePointVisible = false;
        this.closeWork();
        // this.showGivePointBtn = true;
      });

      // 自动指点结果应答
      this.$bus.$on('planningSuccess', data => {
        clearTimeout(this.autoPointTimer);
        this.autoPointTimer = null;
        // console.log(33333, this.$store.state.excavator.autoPointMode, data);
        if (this.$store.state.excavator.autoPointMode) {
          // this.autoGivePointVisible = true;

          if (data.data[0]?.result == '指点成功') {
            // console.log(121121212122);
            this.autopointMessage = this.toLang('planningSucceeded');
            this.autoGivePointStatus = 'success';
            this.$store.commit('excavator/setMiddleClickIndex', { value: [null, null] });
            this.$emit('setPointSuccess');
            this.exitStepDistance();
            speak('路径规划成功', 6);
          } else if (data.data[0]?.result == '中断成功') {
            speak('路径规划中断', 6);
          } else {
            this.autopointMessage = `${this.toLang('planningFailed')}<br/>${data.data[0]?.failReason}`;
            this.autoGivePointStatus = 'fail';
            speak('路径规划失败，请重新指点', 6);
          }
        }
      });

      this.$bus.$on('clearAutoGivePointClick', status => {
        if (status === 'success') {
          this.closeWork(); // 关闭右侧作业抽屉框
        }
        this.autoGivePointStatus = 'default'; // 重置为初始化状态
      });

      // 停靠位/预停靠位/锚点状态同步至后端
      this.$bus.$on('setPointStatus', (index, lock) => {
        sendSocket({
          type: 'setPointStatus',
          stop_num: index,
          status: lock ? '1' : '0',
        });
      });
    },
    watch: {
      parkAllocationStatus: {
        handler() {
          // console.log(123);
          this.pointItem = this.parkAllocationStatus[this.activeIndex];
          if (this.parkAllocationStatus.length && Object.keys(this.pointItem || {}).length == 0)
            this.pointItem = this.parkAllocationStatus[0];
          if (this.parkAllocationStatus.length == 1) this.pointItem = this.parkAllocationStatus[0];
          if (!this.parkAllocationStatus.length) this.pointItem = {};
          this.$store.commit('excavator/setPointItem', this.pointItem);
        },
        immediate: true,
        deep: true,
      },
      pointItem: {
        handler() {
          if (this.$store.state.excavator.stepDistanceFlag) return;
          this.$bus.$emit('checkPointStopNum', this.pointItem.stop_num);
        },
        deep: true,
      },

      isAutoPointMode(val) {
        this.showGivePointBtn = !val;
      },
    },
    computed: {
      hideBtn() {
        return !this.noEntrySetting;
      },
      isAutoPointMode() {
        return this.$store.state.excavator.autoPointMode;
      },
      stepDistanceFlag() {
        return this.$store.state.excavator.stepDistanceFlag;
      },
    },
    methods: {
      getAssetsFile,
      setShowSettingModal() {
        this.showSettingModal = !this.showSettingModal;
      },

      setPointSuccess() {
        if (this.pointItem.from == '83E5') {
          this.$set(this.parkAllocationStatus[this.$store.state.excavator.givepointInde], 'is_SecondStation', 1);
        }
      },
      setNoEntryAreaStatus(data) {
        if (data.data == 0) this.noEntryAreaList = null;
        this.noEntryAreaStatus = Number(data.data);
      },
      settingNoEntry() {
        this.workFlag = false;
        this.noEntrySetting = true;
        this.$bus.$emit('noEntryAreaOuter');
        this.$bus.$emit('exitGather');
      },
      closeSettingNoEntry() {
        this.noEntrySetting = false;
      },
      boudName(data) {
        this.headerListData.area = data;
        sendSocket({
          type: 'where',
          name: data,
        });
      },
      setGivePointFlag() {
        this.givePointflag = false;
      },
      errorhandle() {
        this.excepthandflag = !this.excepthandflag;
      },
      statebtn(index) {
        this.closeAllWorkModal();
        if (index == 1) {
          // 作业
          this.workFlag = true;
        } else if (index == 2) {
          // 用户
          this.userFlag = true;
        } else if (index == 3) {
          this.settingFlag = true;
        }
      },
      givePoint() {
        this.closeAllWorkModal();
        this.givePointflag = true;
        this.workAreaVisible = false;
        this.$bus.$emit('exitGather');
      },
      closeAllWorkModal() {
        this.workFlag = false;
        this.settingFlag = false;
        this.userFlag = false;
      },
      closeWork() {
        this.workFlag = false;
        testitemlist
          .filter(item => item.title !== 'statusSetting')
          .forEach(item => {
            item.showFlag = false;
          });
        this.$bus.$emit('exitGather');
      },
      closeUser() {
        this.userFlag = false;
      },
      closeSetting() {
        this.settingFlag = false;
      },

      previewConfirm(value) {
        this.$store.commit('setMessageList', '装载区请求更新');
        sendMsgToBackend('装载区请求更新');
        sendSocket({
          type: SOCKET_TYPE.SEND_PREVIEW_DATA,
          radius: value,
        });
        this.previewVisible = false;
      },
      closeUsePreviewDialog() {
        this.usePreviewVisible = false;
      },

      closeAutoGivePointModeDialog() {
        this.autoGivePointVisible = false;
      },

      // 自动化指点请求发起
      handleAutoGivePoint(mode) {
        let offset = localStorage.getItem('parameter')
          ? JSON.parse(localStorage.getItem('parameter'))
          : [
              this.$store.state.carInfo?.excavatorOffsetLength || 0,
              this.$store.state.carInfo?.excavatorOffsetWidth || 0,
            ];
        this.autoGivePointStatus = 'loading';
        this.autopointMessage = '自动指点请求中';

        this.socket.send(
          JSON.stringify({
            type: 'givePoint',
            imei: '',
            stop_num: '0',
            offsetHeading: 0,
            offsetLen_L: offset[0],
            offsetWidth_D: offset[1],
            preStopFlag: this.prePointStatus ? '1' : '0',
            rgnloadMode: mode,
          })
        );

        let _this = this;
        this.autoPointTimer = setTimeout(() => {
          _this.autopointMessage = `指点超时`;
          _this.autoGivePointStatus = 'fail';
          speak('指点超时,请重新指点', 6);
          clearTimeout(_this.autoPointTimer);
          _this.autoPointTimer = null;
        }, 60 * 1000);
      },

      // 退出停靠位编辑模式
      exitStepDistance() {
        this.$store.commit('excavator/setStepDistanceFlag', false);
        this.$bus.$emit('deleteVitualPoint');
      },

      // 停靠位预停靠位
      confirmStepDistance() {
        this.autoGivePointVisible = true;
        this.autoGivePointStatus = 'update';
        this.autopointMessage = '路径规划中';
        const { move_type = 0, stop_num = 0, x = 0, y = 0, z = 0 } = this.$store.state.excavator.virtualPointData;
        this.socket.send(
          JSON.stringify({
            type: 'movePoint',
            stop_num,
            move_type,
            stop_num,
            x,
            y,
            z,
            advancedStop: this.prePointStatus ? '1' : '0',
          })
        );
      },
    },
  };
</script>

<style lang="scss" scoped>
  .content {
    width: 100%;
    height: 100%;
    background-color: #000;
  }
</style>
