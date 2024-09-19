<template>
  <div class="content">
    <Scene :collectList="collectFileListPoint" :collectFileList="collectFileList" />
    <header-dialog :headerListData="headerListData" :currencyTerminal="currencyTerminal" />
    <!--报警  头部栏下方几个小按钮 -->
    <call-btn-dialog
      :preWarning="SensorCollect ? sensorCollectPreWarning : preWarning"
      @callbtnclick="callbtnclick"
      :SensorCollect="SensorCollect"
    />
    <!--驾驶模式报警 -->
    <warning-dialog :warningData="warningData" />

    <!--点击登录按钮展开 -->
    <login-dialog v-if="userFlag" @close="closeUser" />

    <!--故障检测信息-->
    <message-dialog
      v-if="messagelistFlag"
      :messageList="messageList"
      @close="messageListClose"
      @clearFault="clearFault"
    />
    <LeftPopup
      :title="sensorCollectTitle"
      :list="sensorCollectTitle == 'fault' ? sensorCollectFaultList : sensorCollectFileList"
      v-if="showLeftPopup"
      @close="showLeftPopup = false"
    />
    <!--点击设置按钮-->
    <setting-dialog v-if="settingFlag" :versionList="versionList" :messagelist="[]" @close="closeSetting" />

    <!-- 底部栏 -->
    <template v-if="SensorCollect">
      <footer-dialog
        ref="sensorCollect"
        :modeFlag="modeFlag"
        :rmodeFlag="rmodeFlag"
        :currencyTerminal="currencyTerminal"
        :SensorCollect="SensorCollect"
        :sensorCollectFileList="sensorCollectFileList"
        @statebtn="statebtn"
        @btnpopUpFlag="onOpenPopup"
        @setCollectState="setCollectState"
        @exitconfirmbtn="exitconfirmbtn"
        @stopPreview="stopPreview"
      />
    </template>

    <template v-if="!SensorCollect">
      <bullfooter-dialog :model="model" @statebtn="statebtn" @uploadFile="uploadFileFn" />
    </template>

    <!-- 故障弹框  按钮完成 -->
    <system-default-dialog
      v-if="showDefalutFlag"
      :level="defalutLevel"
      :defaultList="defaultList"
      @confirm="defaultConfirm"
      @close="defaultClose"
    />
    <!-- 确认/取消弹框  按钮完成-->
    <pop-up-dialog
      v-if="popUpFlag"
      :SensorCollect="SensorCollect"
      @confirm="popUpClick(11)"
      @cancel="popUpClick(12)"
      @preview="previewCollect"
      :confirmtext="SensorCollect ? toLang('confirm') : ''"
      :canceltext="SensorCollect ? toLang('cancel') : ''"
      :upload="upload"
      :uploadInfo="uploadInfo"
      @close="popUpClick"
    />
    <MessageModal v-if="showModal" :message="message" :loading="loading" :showCancel="false" @confirm="confirm" />

    <work-area
      :visible="workAreaVisible"
      :workAreaName="workAreaName"
      :workAreaStatus="workAreaStatus"
      :zone_type="zone_type"
      :zone_id="zone_id"
      @closeDrawer="closeWorkArea"
    />

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

    <!-- 作业弹窗 -->
    <work-dialog :visible="workFlag" @close="closeWork" @collectShowFlag="collectShowFlag" />
    <!-- 上传弹窗 -->
    <upload-dialog
      v-if="uploadFlag"
      :status="uploadStatus"
      :message="uploadMessage"
      @closeUploadDialog="closeUploadDialog"
    />
    <!-- 上传失败文件抽屉 -->
    <upload-failed-file
      :visible="uploadFailedFileVisible"
      @upload="onUploadAgain"
      @hideCleanTaskIcon="onHideCleanTaskIcon"
      @closeDrawer="closeUploadFailedFile"
    />
    <!-- 左上角icon列表 -->
    <icon-list>
      <div class="icon-button">
        <div v-for="icon in iconList" :key="icon.name">
          <img v-if="icon.isShow" class="icon-item" :src="icon.url" @click="handleClickIcon(icon.name)" />
        </div>
      </div>
    </icon-list>
  </div>
</template>

<script>
  import headerDialog from '@/components/mineCard/headerDialog.vue';
  import systemDefaultDialog from '@/components/dialog/systemDefaultDialog.vue';
  import loginDialog from '@/components/login/loginDialog.vue';
  import settingDialog from '@/components/setting/settingDialog.vue';
  import messageDialog from '@/components/mineCard/messageDialog.vue';
  import LeftPopup from '@/components/currencyTerminal/leftPopup.vue';
  import popUpDialog from '@/components/dialog/popUpDialog.vue';
  import footerDialog from '@/components/currencyTerminal/footerDialog.vue';
  import callBtnDialog from '@/components/mineCard/callBtnDialog.vue';
  import Scene from '@/components/map/Scene.vue';
  import WorkArea from '@/components/components/workArea.vue';
  import WarningDialog from '@/components/components/warningDialog.vue';
  import WorkDialog from '@/components/currencyTerminal/workDialog.vue';
  import bullfooterDialog from '@/components/bulldozer/bullfooterDialog';
  import uploadDialog from '@/components/bulldozer/uploadDialog';
  import UploadFailedFile from '@/components/bulldozer/uploadFailedFile';
  import IconList from '@/components/bulldozer/iconList';

  // mixins
  import collectorMixin from '@/mixins/collector.js';
  import publicMixin from '@/mixins/public.js';
  import auxiliaryMixin from '@/mixins/auxiliary';

  export default {
    mixins: [publicMixin, collectorMixin, auxiliaryMixin],
    components: {
      systemDefaultDialog,
      headerDialog,
      loginDialog,
      settingDialog,
      messageDialog,
      popUpDialog,
      footerDialog,
      callBtnDialog,
      Scene,
      LeftPopup,
      WorkArea,
      WarningDialog,
      WorkDialog,
      bullfooterDialog,
      uploadDialog,
      UploadFailedFile,
      IconList,
    },
    data() {
      return {
        message: '上传成功',
        showModal: false,
        modeFlag: 3,
        rmodeFlag: true,
        currencyTerminal: true,
        // 作业
        workFlag: false,
        // 弹窗
        popUpFlag: false,
        // 报警等级
        defalutLevel: 1,
        // 驾驶模式
        driveFlag: true,
        messagelistFlag: false,
        socketTask: null,
        settingFlag: false,
        userFlag: false,
        showDefalutFlag: false,
        collectInfo: null,
      };
    },
    methods: {
      defaultConfirm() {
        console.log('系统故障请注意确认按钮');
        // this.showDefalutFlag = false
      },
      defaultClose() {
        this.showDefalutFlag = false;
      },
      closeWork() {
        this.$bus.$emit('resetBtnClickIndex');
        this.workFlag = false;
      },
      closeUser() {
        this.userFlag = false;
      },
      closeSetting() {
        this.settingFlag = false;
        console.log(this.settingFlag);
      },
      staticTestClose() {
        this.staticFlag = false;
      },
      messageListClose() {
        this.messagelistFlag = false;
      },
    },

    watch: {
      preWarning: {
        handler(val) {
          this.$nextTick(() => {
            const isShowIcon = this.iconList.some(item => item.isShow);
            const isPrewarning = Boolean(val.length);
            const ele1 = document.getElementsByClassName('icon-list-wrap')[0];
            const ele2 = document.getElementsByClassName('pre-warning-list')[0];
            if (isPrewarning && isShowIcon) {
              ele1.style.left = ele2.clientWidth + 25 + 'px';
            } else {
              ele1.style.left = '15px';
            }
          });
        },
        deep: true,
        immediate: true,
      },
      iconList: {
        handler(val) {
          this.$nextTick(() => {
            const isShowIcon = val.some(item => item.isShow);
            const isPrewarning = Boolean(this.preWarning.length);
            const ele1 = document.getElementsByClassName('icon-list-wrap')[0];
            const ele2 = document.getElementsByClassName('pre-warning-list')[0];
            if (isPrewarning && isShowIcon) {
              ele1.style.left = ele2.clientWidth + 25 + 'px';
            } else {
              ele1.style.left = '15px';
            }
          });
        },
        deep: true,
        immediate: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .icon-button {
    display: flex;
    img {
      width: 60px;
      height: 60px;
      margin-right: 10px;
      cursor: pointer;
    }
  }
</style>
