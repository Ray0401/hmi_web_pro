<template>
  <div class="content">
    <scene :collectFileListPoint="collectFileListPoint" />
    <!-- 头部栏 -->
    <bullheader-dialog :headerListData="headerListData" />
    <!-- 底部栏 -->
    <bullfooter-dialog
      v-if="!SensorCollect"
      :rtkstate="headerListData.rtkstate"
      :model="model"
      @statebtn="statebtn"
      @uploadFile="uploadFileFn"
    />
    <footer-public />
    <!--消息提示 -->
    <message-tips v-if="messageTipsFlag" />
    <!--点击登录按钮展开 -->
    <login-dialog v-if="userFlag" @close="closeUser" />
    <!--点击设置按钮-->
    <setting-dialog v-if="settingFlag" @close="closeSetting" :versionList="versionList" :messagelist="[]" />

    <!--点击作业按钮  按钮完成-->
    <bullwork-dialog :visible="workFlag" @close="closeWork" @collectShowFlag="collectShowFlag" />

    <!-- 上传弹框 -->
    <upload-dialog
      v-if="uploadFlag"
      :status="uploadStatus"
      :message="uploadMessage"
      @closeUploadDialog="closeUploadDialog"
    />

    <!-- 公共弹窗 -->
    <common-modal
      v-if="commonModalFlag"
      :showClose="commonModalShowClose"
      :message="commonModalMessage"
      :warning="commonModalTip"
      :btnList="commonModalBtnList"
      :type="commonModalType"
      @close="commonModalClose"
      @cancel="commonModalCancel"
      @confirm="commonModalConfirm"
    />

    <!-- 消息组件 -->
    <Message :visible="messageVisible" />

    <!-- 排土块详情 -->
    <soil-block-detail
      :visible="soilBlockDetailVisible"
      :detailData="soilBlockDetailData"
      @closeDrawer="closeSoilBlockDetail"
    />
    <!-- 排土块任务 -->

    <soil-block-task :visible="soilBlockTaskVisible" :soilTaskData="soilTaskData" @closeDrawer="closeSoilBlockTask" />

    <!-- 左上角icon列表 -->
    <icon-list>
      <div class="icon-button">
        <div v-for="icon in iconList" :key="icon.name">
          <img v-if="icon.isShow" class="icon-item" :src="icon.url" @click="handleClickIcon(icon.name)" />
        </div>
      </div>
    </icon-list>

    <!-- 左上角卡车列表显示按钮 -->
    <!-- <car-list-dialog :visible="false" /> -->

    <!-- 右上角notice组件 -->
    <!-- <div v-if="showNotice">
      <Notice />
    </div> -->

    <!-- 作业区封闭开放抽屉 -->
    <work-area
      :visible="workAreaVisible"
      :workAreaName="workAreaName"
      :workAreaStatus="workAreaStatus"
      :zone_type="zone_type"
      :zone_id="zone_id"
      @closeDrawer="closeWorkArea"
    />

    <!-- 上传失败文件抽屉 -->
    <upload-failed-file
      :visible="uploadFailedFileVisible"
      @upload="onUploadAgain"
      @hideCleanTaskIcon="onHideCleanTaskIcon"
      @closeDrawer="closeUploadFailedFile"
    />

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
    <call-btn-dialog
      @callbtnclick="callbtnclick"
      :preWarning="SensorCollect ? sensorCollectPreWarning : []"
      :SensorCollect="SensorCollect"
    />

    <!-- 图像告警 -->
    <warning-dialog :warningData="warningData" />
  </div>
</template>

<script>
  // 组件
  import footerPublic from '@/components/components/footerPublic';
  import bullheaderDialog from '@/components/bulldozer/bullheaderDialog';
  import systemDefaultDialog from '@/components/dialog/systemDefaultDialog';
  import messageTips from '@/components/components/messageTips';
  import loginDialog from '@/components/login/loginDialog';
  import settingDialog from '@/components/setting/settingDialog';
  import bullworkDialog from '@/components/bulldozer/bullworkDialog';
  import uploadDialog from '@/components/bulldozer/uploadDialog';
  import bullfooterDialog from '@/components/bulldozer/bullfooterDialog';
  import Scene from '@/components/map/Scene';
  import Notice from '@/components/components/notice';
  import carListDialog from '@/components/bulldozer/carListDialog';
  import Message from '@/components/bulldozer/message';
  import SoilBlockDetail from '@/components/bulldozer/soilBlockDetail';
  import SoilBlockTask from '@/components/bulldozer/soilBlockTask';
  import IconList from '@/components/bulldozer/iconList';
  import ContinueDialog from '@/components/mineCard/continueDialog';
  import WorkArea from '@/components/components/workArea';
  import UploadFailedFile from '@/components/bulldozer/uploadFailedFile';
  import SensorFooterDialog from '@/components/currencyTerminal/footerDialog';
  import LeftPopup from '@/components/currencyTerminal/leftPopup';
  import popUpDialog from '@/components/dialog/popUpDialog';
  import CallBtnDialog from '@/components/mineCard/callBtnDialog';
  import WarningDialog from '@/components/components/warningDialog';

  // mixins
  import publicMixin from '@/mixins/public.js';
  import bulldozerMixin from '@/mixins/bulldozer';
  import auxiliaryMixin from '@/mixins/auxiliary';

  // 常量
  import * as constantObj from '@/constant/bulldozer';

  export default {
    components: {
      footerPublic,
      systemDefaultDialog,
      messageTips,
      bullheaderDialog,
      loginDialog,
      bullworkDialog,
      settingDialog,
      bullfooterDialog,
      Scene,
      Notice,
      carListDialog,
      uploadDialog,
      Message,
      SoilBlockDetail,
      SoilBlockTask,
      IconList,
      ContinueDialog,
      WorkArea,
      UploadFailedFile,
      SensorFooterDialog,
      LeftPopup,
      popUpDialog,
      CallBtnDialog,
      WarningDialog,
    },
    mixins: [publicMixin, bulldozerMixin, auxiliaryMixin],
    data() {
      return {
        constantObj,
        messageTipsFlag: false,
        // 作业
        workFlag: false,
        // 设置
        settingFlag: false,
        // 用户
        userFlag: false,
        // 消息提示
        messageVisible: false,
        // 排土块详情抽屉
        soilBlockDetailVisible: false,
        // 排土块详情抽屉数据
        soilBlockDetailData: {
          basicInfo: {
            name: '',
            status: '1', // 1开启 2关闭 3已分配
            soilBlockNum: '', //排土块编号
          },
          pointInfo: [
            // { name: '3-1', status: '1', total: '3', num: '1' },
            // { name: '3-2', status: '2', total: '3', num: '2' },
            // { name: '3-3', status: '3', total: '3', num: '3' },
          ],
        },
        // 排土任务抽屉
        soilBlockTaskVisible: false,
      };
    },
    methods: {
      list(list) {
        this.goodstatus = list;
      },

      closeWork() {
        this.workFlag = false;
        this.$bus.$emit('resetBtnClickIndex');
      },
      closeUser() {
        this.userFlag = false;
        this.$bus.$emit('resetBtnClickIndex');
      },
      closeSetting() {
        this.settingFlag = false;
        this.$bus.$emit('resetBtnClickIndex');
      },
      // 点击顶部icon按钮
      handleClickIcon(name) {
        const options = {
          uploadFileIcon: 'uploadFailedFileVisible',
          cleanTaskIcon: 'soilBlockTaskVisible',
        };
        Object.keys(options).map(key => {
          if (key !== name) {
            this[options[key]] = false;
          } else {
            this[options[key]] = true;
          }
        });
      },

      closeSoilBlockTask() {
        console.log('关闭排土块任务抽屉');
        this.soilBlockTaskVisible = false;
      },
      closeSoilBlockDetail() {
        console.log('关闭排土块详情抽屉');
        this.soilBlockDetailVisible = false;
      },
      closeContinueDialog() {
        this.continueVisible = false;
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
