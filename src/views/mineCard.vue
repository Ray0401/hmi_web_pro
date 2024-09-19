<template>
  <div class="content">
    <Scene v-if="mapSleep == 0" :collectList="collectFileListPoint"></Scene>
    <sleep v-else></sleep>
    <!-- <Iframe /> -->
    <!--头部栏 -->
    <header-dialog :headerListData="headerListData"></header-dialog>
    <!--报警  头部栏下方几个小按钮 -->
    <call-btn-dialog
      @callbtnclick="callbtnclick"
      :preWarning="SensorCollect ? sensorCollectPreWarning : preWarning"
      :SensorCollect="SensorCollect"
    ></call-btn-dialog>
    <!--驾驶模式报警 -->
    <drive-call-dialog :driveData="driveData"></drive-call-dialog>
    <!--消息提示 -->
    <message-tips></message-tips>
    <!--点击登录按钮展开 -->
    <login-dialog v-if="userFlag" @close="closeUser"></login-dialog>

    <!--故障检测信息-->
    <message-dialog
      v-if="messagelistFlag"
      @clearFault="clearFault"
      @close="messageListClose"
      :messageList="messageList"
    ></message-dialog>
    <!--点击设置按钮-->
    <setting-dialog
      v-if="settingFlag"
      @close="closeSetting()"
      :versionList="versionList"
      :messagelist="[]"
    ></setting-dialog>
    <!--点击作业按钮  按钮完成-->
    <work-dialog
      v-if="workFlag"
      @close="closeWork()"
      @rmodeFlag="changermodeFlag"
      @collectShowFlag="collectShowFlag"
      :warnSwitch="warnSwitch"
      :drivemode="drivemode"
    ></work-dialog>
    <!-- 底部栏 -->
    <footer-dialog
      v-if="!SensorCollect"
      @statebtn="statebtn"
      :modeFlag="modeFlag"
      :rmodeFlag="rmodeFlag"
      :drivemode="drivemode"
      @btnpopUpFlag="popUpFlag1"
      @setCollectState="setCollectState"
      @exitconfirmbtn="exitconfirmbtn"
    ></footer-dialog>
    <!-- 故障弹框  按钮完成 -->
    <system-default-dialog
      :level="defalutLevel"
      v-if="showDefalutFlag"
      @confirm="defaultConfirm"
      @close="defaultClose"
      :defaultList="defaultList"
    ></system-default-dialog>
    <!-- 确认/取消弹框  按钮完成-->
    <pop-up-dialog
      @confirm="popUpClick(11)"
      @cancel="popUpClick(12)"
      :SensorCollect="SensorCollect"
      @preview="previewCollect"
      :confirmtext="SensorCollect ? toLang('confirm') : ''"
      :canceltext="SensorCollect ? toLang('cancel') : ''"
      :upload="upload"
      :uploadInfo="uploadInfo"
      v-if="popUpFlag"
    ></pop-up-dialog>
    <ContinueDialog v-if="workArea && drivemode == 1" :workArea="workArea" @close="closeContinueDialog" />
    <SensorFooterDialog
      ref="sensorCollect"
      v-if="SensorCollect"
      :modeFlag="modeFlag"
      :rmodeFlag="rmodeFlag"
      :SensorCollect="SensorCollect"
      :sensorCollectFileList="sensorCollectFileList"
      @statebtn="statebtn"
      @btnpopUpFlag="onOpenPopup"
      @setCollectState="setCollectState"
      @exitconfirmbtn="exitconfirmbtn"
      @stopPreview="stopPreview"
    />
    <LeftPopup
      :title="sensorCollectTitle"
      :list="sensorCollectTitle == 'fault' ? sensorCollectFaultList : sensorCollectFileList"
      v-if="showLeftPopup"
      @close="showLeftPopup = false"
    />
    <MessageModal v-if="showModal" :message="message" :loading="loading" @confirm="confirm" :showCancel="false" />
  </div>
</template>

<script>
  import Scene from '@/components/map/Scene.vue';
  import Sleep from '@/components/mineCard/sleep.vue';
  import headerDialog from '@/components/mineCard/headerDialog.vue';
  import systemDefaultDialog from '@/components/dialog/systemDefaultDialog.vue';
  import messageTips from '@/components/components/messageTips.vue';
  import loginDialog from '@/components/login/loginDialog.vue';
  import settingDialog from '@/components/setting/settingDialog.vue';
  import workDialog from '@/components/mineCard/workDialog.vue';
  import popUpDialog from '@/components/dialog/popUpDialog.vue';
  import footerDialog from '@/components/mineCard/footerDialog.vue';
  import callBtnDialog from '@/components/mineCard/callBtnDialog.vue';
  import driveCallDialog from '@/components/mineCard/driveCallDialog.vue';
  import Iframe from '@/components/components/iframe.vue';
  import messageDialog from '@/components/mineCard/messageDialog.vue';
  import publicMixin from '@/mixins/public.js';
  import mineCardMixin from '@/mixins/mineCard.js';
  import ContinueDialog from '@/components/mineCard/continueDialog.vue';
  import SensorFooterDialog from '@/components/currencyTerminal/footerDialog.vue';
  import LeftPopup from '@/components/currencyTerminal/leftPopup.vue';
  import { getAssetsFile } from '@/utils/utils';
  export default {
    components: {
      Scene,
      Sleep,
      systemDefaultDialog,
      messageTips,
      headerDialog,
      loginDialog,
      workDialog,
      settingDialog,
      popUpDialog,
      footerDialog,
      callBtnDialog,
      messageDialog,
      driveCallDialog,
      Iframe,
      ContinueDialog,
      SensorFooterDialog,
      LeftPopup,
    },
    mixins: [publicMixin, mineCardMixin],
    data() {
      return {
        drivemode: 0,
        timer: {},
        VehicleType: 'Mine',
        workArea: '',
        modeFlag: 1,
        rmodeFlag: true,
        // 驾驶模式数据
        driveData: {
          modeindex: [], //1 路权终点 2 逆行 3 周边车辆 4 车道偏离 5 障碍物预警
          distance: 0, //距离
          obstructionDistance: 0, //障碍物距离
          obstaclesType: '', //障碍物类型
          direction: '', //车道偏离
          rotatedeg: [], //周边车辆角度
        },
        // 头部数据
        headerListData: {
          carindex: 0, //
          area: '',
          option: '装载',
          materialicon: getAssetsFile('images/material.png'),
          oretext: '',
          state: 4,
          stateText: '',
          signalStatus: [],
          realspeed: '0',
          maxspeed: '0',
          rtkstate: '',
          networkstate: [],
          UTCtime: '',
        },
        // 作业
        workFlag: false,
        // 设置
        settingFlag: false,
        // 用户
        userFlag: false,
        popUpFlag: false,
        fileupload: '',
        defalutLevel: 2,
        showDefalutFlag: false,
        messagelistFlag: false,
        uploadAddr: '',
        mapSleep: 0,
      };
    },
    created() {
      this.$bus.$on('Headerstate', data => {
        this.headerListData.state = data;
      });
    },
    methods: {
      // startContinueTimer() {
      //   this.continueTimer = setTimeout(() => {
      //     speak('等待调度平台接续任务，若无反应可再次切换模式尝试接续', 6);
      //   }, 3000);
      // },
      // clearFault() {
      //   this.messagelistFlag = false;
      //   this.preWarning.splice(this.preWarning.indexOf(5), 1);
      //   this.messageList[0].content = [];
      // },
      setTimer(time = 2000, index, type) {
        clearTimeout(this.timer[type]);
        this.timer[type] = setTimeout(() => {
          let curr = this.driveData.modeindex;
          if (curr.includes(index)) {
            // 多次push问题
            this.driveData.modeindex = curr.join('').replaceAll(index, '').split('');
          }
        }, time);
      },
      closeContinueDialog() {
        this.workArea = '';
      },
      statebtn(index) {
        this.workFlag = false;
        this.settingFlag = false;
        this.userFlag = false;
        if (index == 1) {
          // 作业
          this.workFlag = true;
        } else if (index == 2) {
          // 用户
          this.userFlag = true;
        } else if (index == 3) {
          // 设置
          // debugger
          this.settingFlag = true;
        }
      },
      defaultConfirm() {
        this.showDefalutFlag = false;
      },
      defaultClose() {
        this.showDefalutFlag = false;
      },
      closeWork() {
        this.workFlag = false;
        this.$bus.$emit('exitGather');
      },
      closeUser() {
        this.userFlag = false;
      },
      closeSetting() {
        this.settingFlag = false;
      },
      changermodeFlag() {
        this.rmodeFlag = false;
        this.modeFlag = 2;
        this.workFlag = false;
      },
      messageListClose() {
        this.messagelistFlag = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .content {
    position: relative;
    width: 100%;
    height: 100vh;
    background-color: #000;
  }
</style>
