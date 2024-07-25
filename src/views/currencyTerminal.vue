<template>
  <div class="content">
    <Scene />
    <header-dialog :headerListData="headerListData" :currencyTerminal="currencyTerminal" />
    <!--报警  头部栏下方几个小按钮 -->
    <call-btn-dialog :preWarning="preWarning" @callbtnclick="callbtnclick" />
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
    <!--点击设置按钮-->
    <setting-dialog v-if="settingFlag" :versionList="versionList" :messagelist="[]" @close="closeSetting" />
    <!-- 底部栏 -->
    <footer-dialog
      :modeFlag="modeFlag"
      :rmodeFlag="rmodeFlag"
      :currencyTerminal="currencyTerminal"
      @statebtn="statebtn"
    />
    <!-- 故障弹框  按钮完成 -->
    <system-default-dialog
      v-if="showDefalutFlag"
      :level="defalutLevel"
      :defaultList="defaultList"
      @confirm="defaultConfirm"
      @close="defaultClose"
    />

    <work-area
      :visible="workAreaVisible"
      :workAreaName="workAreaName"
      :workAreaStatus="workAreaStatus"
      :zone_type="zone_type"
      :zone_id="zone_id"
      @closeDrawer="closeWorkArea"
    />
  </div>
</template>

<script>
  import headerDialog from '@/components/mineCard/headerDialog.vue';
  import systemDefaultDialog from '@/components/dialog/systemDefaultDialog.vue';
  import loginDialog from '@/components/login/loginDialog.vue';
  import settingDialog from '@/components/setting/settingDialog.vue';
  import popUpDialog from '@/components/dialog/popUpDialog.vue';
  import footerDialog from '@/components/currencyTerminal/footerDialog.vue';
  import Scene from '@/components/map/Scene.vue';
  import currencyMixin from '@/mixins/currency.js';
  import publicMixin from '@/mixins/public.js';
  import auxiliaryMixin from '@/mixins/auxiliary';
  import WarningDialog from '@/components/components/warningDialog.vue';
  import callBtnDialog from '@/components/mineCard/callBtnDialog.vue';
  import messageDialog from '@/components/mineCard/messageDialog.vue';
  import WorkArea from '@/components/components/workArea.vue';

  export default {
    mixins: [publicMixin, currencyMixin, auxiliaryMixin],
    components: {
      systemDefaultDialog,
      headerDialog,
      loginDialog,
      settingDialog,
      popUpDialog,
      footerDialog,
      Scene,
      WarningDialog,
      callBtnDialog,
      messageDialog,
      WorkArea,
    },
    data() {
      return {
        modeFlag: 3,
        rmodeFlag: true,
        currencyTerminal: true,
        settingFlag: false,
        userFlag: false,
        // 弹窗
        popUpFlag: false,
        // 报警等级
        defalutLevel: 1,
        // 驾驶模式
        messagelistFlag: false,

        showDefalutFlag: false,
      };
    },
    methods: {
      defaultConfirm() {
        console.log('系统故障请注意确认按钮');
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
      callbtnclick() {
        this.messagelistFlag = !this.messagelistFlag;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .content {
    width: 100%;
    height: 100vh;
    background-color: #000;
    position: relative;
  }
</style>
