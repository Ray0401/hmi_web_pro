<style lang="scss" scoped>
  @import '@/assets/css/common.scss';
  .work-list-outer-none-events {
    opacity: 0.5;
    pointer-events: none;
  }
  .work-list-title {
    color: #70a7b3;
    font-size: 16px;
    font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
    font-weight: 500;
    text-align: left;
  }

  .work-list-detail {
    width: 100%;
    padding: 0;
    box-sizing: border-box;

    .work-list-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-content: flex-start;
      flex-wrap: wrap;
      width: 100%;
      box-sizing: border-box;

      .work-list {
        padding: 10px 0 0;

        .work-list-icon {
          width: 70px;
          height: 70px;
        }

        .work-list-text {
          font-size: 16px;
          margin-top: 5px;
          font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
          font-weight: 500;
          text-align: left;
          color: #f2f2f2;
          width: 70px;
          white-space: nowrap;
        }
        &:first-child {
          margin-top: 0;
        }
      }
      .radio-mode {
        width: 298px;
        height: 60px;
        opacity: 1;
        background: url('@/assets/images/excavator/mode-back.png');
        background-size: 100%;
        margin-left: -8px;
        margin-top: 20px;
        display: flex;
        align-items: center;
        .radio-circle {
          width: 20px;
          height: 20px;
          opacity: 1;
          box-sizing: border-box;
          border: 1px solid #00fdef;
          border-radius: 50%;
          margin-left: 19px;
        }
        .radio-circle-active {
          position: relative;
          &::before {
            content: '';
            width: 12px;
            height: 12px;
            background: #00fdef;
            border-radius: 50%;
            position: absolute;
            top: 3px;
            left: 3px;
          }
        }
        .radio-text {
          margin-left: 10px;
          font-size: 18px;
          color: #abd7e0;
        }
      }
      .radio-mode-active {
        background: url('@/assets/images/excavator/mode-active-back.png') no-repeat;
        background-size: 100%;
      }
      .pre-stop-switch {
        font-size: 22px;
        margin-top: 20px;
        display: flex;
        align-items: center;
        position: relative;
        .text {
          color: #fff;
          margin-left: 6px;
        }
        .text-open {
          color: #ff5900;
        }
        .model {
          width: 55px;
          height: 32px;
          position: absolute;
          top: 0px;
          left: 0px;
          z-index: 1;
        }
      }
    }
  }

  .detail-list-btn-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .work-radio {
    .radio-btn {
      :deep(.radio-span) {
        margin-top: 10px;
        margin-bottom: 0;
      }
    }
  }
  .work-radio-into {
    width: 220px;
  }
  .into-area {
    width: 100%;
    .text {
      font-size: 16px;
      font-weight: 500;
      text-align: left;
      color: #70a7b3;
      margin-top: 10px;
      margin-bottom: 50px;
    }
    :deep(.button_init) {
      width: 100%;
    }
  }

  .page {
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 18px;
    font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
    font-weight: 500;
    text-align: left;
    color: #f2f2f2;

    .left {
      margin-right: 5px;
    }

    .right {
      margin-left: 5px;
    }
  }

  .detail-list-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 25px 45px 0;
    box-sizing: border-box;

    .detail-list {
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .detail-image {
        width: 66px;
        height: 66px;
        margin-bottom: 10px;
      }

      .detail-textfont {
        font-size: 16px;
        font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
        font-weight: 500;
        text-align: left;
        color: #f2f2f2;
      }
    }
  }

  .radio-value {
    color: red;
    font-size: 1.2em;
  }

  .detail-text {
    font-size: 18px;
    font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
    font-weight: 500;
    text-align: left;
    color: #f2f2f2;
    margin-bottom: 19px;
  }

  .history-icon {
    width: 56px;
    height: 69px;
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 15px;
  }

  .history-list {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 27px;

    .history-name {
      font-size: 16px;
      font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
      font-weight: 500;
      text-align: left;
      color: #f2f2f2;
    }
  }

  .upload-btn-box {
    width: 100%;
    height: 50px;
    position: relative;
  }

  .delete-btn-box {
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 10px;
  }
  .material-list {
    width: 280px;
  }

  .detail-mode-btn-box {
    display: flex;
    flex-wrap: wrap;
    .model-item {
      width: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 22px;
      .icon {
        width: 46px;
        height: 50px;
      }
      .text {
        color: #fff;
        font-size: 16px;
        margin-top: 10px;
      }
    }
  }
</style>

<template>
  <div>
    <div class="work-dialog-outer">
      <div class="work-dialog-inner">
        <!-- 外面三个可折叠的框 -->
        <div
          :class="`work-list-outer ${
            item.title == '正向不可驶入区域设定' && settingNoEntryAreaStatus == 0 && 'work-list-outer-none-events'
          }`"
          @click="showUpDown(item)"
          :key="item.title"
          v-for="item in testitemlist"
        >
          <div class="work-list-inner">
            <div class="work-list-title">
              {{ toLang(item.title) }}
            </div>
            <div class="work-list-detail" v-if="item.showFlag == true">
              <div class="work-list-box">
                <template v-if="item.iconlist">
                  <div
                    class="work-list"
                    v-for="(iconitem, index) in item.iconlist"
                    :key="index"
                    @click.stop="listbtn(iconitem)"
                  >
                    <img
                      :src="clickItemId == iconitem.id ? iconitem.iconclick : iconitem.icon"
                      class="work-list-icon"
                    />
                    <div class="work-list-text">{{ toLang(iconitem.text) }}</div>
                  </div>
                </template>

                <!-- 装载模式 -->
                <div v-if="item.title == 'rgnloadModeSetting'">
                  <div
                    v-for="(cont, inde) in item.modelist"
                    :key="inde"
                    :class="`radio-mode ${inde == rgnloadMode && 'radio-mode-active'}`"
                    @click.stop="checkLoadMode(inde)"
                  >
                    <div :class="`radio-circle ${inde == rgnloadMode && 'radio-circle-active'}`"></div>
                    <div class="radio-text">{{ cont.label }}</div>
                  </div>
                </div>
                <!-- 预停靠位模式 -->
                <div v-if="item.title == 'preStopSetting'" class="pre-stop-switch" @click.stop="() => {}">
                  <toggle-button
                    color="#FF5900"
                    :width="70"
                    :height="35"
                    :disabled="disabledPrePointSwitch"
                    :value="prePointStatus"
                    @change="switch1Change"
                  />
                  <div :class="`text ${prePointStatus && 'text-open'}`">{{ prePointStatus ? '开' : '关' }}</div>
                </div>
                <div
                  class="detail-list-btn-box work-radio"
                  v-if="item.title == 'changeMaterial'"
                  @click.stop="() => {}"
                >
                  <radio-dialog
                    :radio-list="MaterialList"
                    :label="'name'"
                    :values="'materialNum'"
                    :value.sync="materialvalue"
                    @radiochange="changeMaterialValue"
                    class="material-list"
                  ></radio-dialog>
                </div>
                <!-- <div class="work-radio into-area" v-if="item.title == '正向不可驶入区域设定'" @click.stop="() => {}">
                  <div class="work-radio-into">
                    <radio-dialog
                      :radio-list="item.radioList"
                      :value.sync="noEntryAreaStatus"
                      @radiochange="changeintoAreaMode"
                    ></radio-dialog>
                  </div>
                  <div class="text">
                    {{ noEntryAreaStatus == 0 ? '当前不设定正向不可驶入区域' : '点击“自定义设定”进入设定流程' }}
                  </div>
                  <button-dialog
                    v-if="noEntryAreaStatus == 1"
                    class="select-btn"
                    type="orange"
                    @click="settingNoEntry"
                  >
                    自定义设定
                  </button-dialog>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <close-dialog v-if="!asideShowFlag" type="right" @click="closebtn()"></close-dialog>
    </div>
    <div class="work-dialog-aside-outer" v-show="asideShowFlag">
      <div class="work-dialog-aside-inner">
        <div class="content-box" v-if="clickItemId == 8">
          <div class="detail-title">{{ toLang('delayReason') }}</div>
          <div class="detail-list-btn-box">
            <radio-dialog
              :radio-list="reasonList"
              :value.sync="reasonValue"
              @radiochange="changeReasonValue"
            ></radio-dialog>
          </div>
          <div class="page">
            <div class="left" @click="btnleft">{{ leftpage }}</div>
            <div class="center">{{ currentpage }}</div>
            <div class="right" @click="btnright">{{ rightpage }}</div>
          </div>
          <div class="detail-title">{{ toLang('delayTime') }}</div>
          <div class="detail-list-btn-box">
            <radio-dialog :radio-list="timeList" :value.sync="timeValue" @radiochange="changeTimeValue"></radio-dialog>
          </div>
          <button-dialog class="select-btn" type="orange" @click="delayconfirm">{{ toLang('confirm') }}</button-dialog>
        </div>

        <div class="content-box" v-if="clickItemId == 9">
          <div class="detail-title">{{ toLang('faultReason') }}</div>
          <div class="detail-list-btn-box">
            <radio-dialog
              :radio-list="breakReasonList"
              :value.sync="breakReasonValue"
              @radiochange="changebreakvalue"
            ></radio-dialog>
          </div>
          <button-dialog class="select-btn" type="orange" @click="defaultconfirm">
            {{ toLang('confirm') }}
          </button-dialog>
        </div>

        <!-- 装载模式自动指点和手动指点 -->
        <div class="content-box" v-if="clickItemId!==8 && clickItemId!==9">
          <div class="detail-title">自动调整</div>
          <div class="detail-mode-btn-box">
            <!-- 单侧装载自动指点 -->
            <template v-if="rgnloadMode == 0">
              <div class="model-item" v-for="(item, index) in singleModeList" @click="handlegivePointMode(item)">
                <img class="icon" :src="item.isClick ? item.iconclick : item.icon" />
                <span class="text">{{ item.label }}</span>
              </div>
            </template>
            <!-- 双侧装载自动指点 -->
            <template v-else>
              <div class="model-item" v-for="(item, index) in doubleModeList" @click="handlegivePointMode(item)">
                <img class="icon" :src="item.isClick ? item.iconclick : item.icon" />
                <span class="text">{{ item.label }}</span>
              </div>
            </template>
          </div>
          <!-- 手动指点 -->
          <div class="detail-title">手动调整</div>
          <div class="detail-mode-btn-box">
            <div class="model-item" @click="handleManual">
              <img
                class="icon"
                :src="getAssetsFile(`images/excavator/shoudongtiaozheng_${rgnloadMode == 0 ? 'dan' : 'shuang'}.png`)"
              />
              <span class="text">手动调整</span>
            </div>
          </div>
        </div>
      </div>
      <close-dialog class="aside-close-btn" type="right" @click="closeAsidebtn()"></close-dialog>
    </div>
    <MessageModal v-if="showModal" :message="message" @confirm="confirm" @cancel="cancel" />
  </div>
</template>
<script>
  import closeDialog from '@/components/dialog/closeButton.vue';
  import {
    AllReasonList,
    testitemlist,
    defaultPointItem,
    breakReasonList,
    singleModeList,
    doubleModeList,
  } from './data.js';
  import { timeList } from '../mineCard/data';
  import { sendMsgToBackend, sendSocket, getAssetsFile } from '@/utils/utils';
  export default {
    name: 'worDialog',
    components: {
      closeDialog,
    },
    props: {
      parkAllocationStatus: {
        type: Array,
        default: () => [],
      },
      noEntryAreaStatus: {
        type: Number,
        default: 0,
      },
      settingNoEntryAreaStatus: {
        type: Number,
        default: 0,
      },
      MaterialList: {
        type: Array,
        default: () => [],
      },
      prePointStatus: {
        type: Boolean,
        default: false,
      },

      disabledPrePointSwitch: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        showModal: false,
        message: '',
        leftpage: '<<',
        rightpage: '>>',
        currentpage: 1,
        activeMaterialvalue: null,
        materialvalue: null,
        onStopPositionList: [],
        testitemlist,
        reasonValue: '0x0002',
        AllReasonList,
        reasonList: [],
        timeValue: '15',
        timeList,
        breakReasonValue: '0x0001',
        breakReasonList,
        clickItemId: null,
        asideShowFlag: false,
        messageType: null,
        singleModeList,
        doubleModeList,
      };
    },
    watch: {
      currentpage(val) {
        this.reasonList = this.AllReasonList.slice((val - 1) * 6, val * 6);
      },
      rgnloadMode(val) {
        this.asideShowFlag = this.testitemlist.find(item => item.title === 'rgnloadModeSetting').showFlag;
      },
    },
    computed: {
      rgnloadMode() {
        return this.$store.state.excavator.rgnloadMode;
      },
    },
    mounted() {
      this.reasonList = this.AllReasonList.slice(0, 6);

      this.$bus.$on('clearAutoGivePointClick', () => {
        if (this.rgnloadMode == 0) {
          this.singleModeList.forEach((v, index) => {
            this.$set(this.singleModeList[index], 'isClick', false);
          });
        } else {
          this.doubleModeList.forEach((v, index) => {
            this.$set(this.doubleModeList[index], 'isClick', false);
          });
        }
      });

      this.$bus.$on('setYutingkaoweiStatus', () => {
        this.switch1Change();
      });
    },

    methods: {
      getAssetsFile,
      // 点击自动指点模式按钮
      handlegivePointMode(item) {
        if (this.rgnloadMode == 0) {
          this.singleModeList.forEach((v, index) => {
            this.$set(this.singleModeList[index], 'isClick', v.value === item.value);
          });

          // const targetIndex = this.singleModeList.findIndex(v => item.label === v.label);
          // this.$set(this.singleModeList[targetIndex], 'isClick', true);
        } else {
          // const targetIndex = this.doubleModeList.findIndex(v => item.label === v.label);
          // this.$set(this.doubleModeList[targetIndex], 'isClick', true);

          this.doubleModeList.forEach((v, index) => {
            this.$set(this.doubleModeList[index], 'isClick', v.value === item.value);
          });
        }

        // 打开自动指点弹窗
        this.$bus.$emit('selectAutoPointMode', item);
      },

      // 点击手动调整按钮
      handleManual() {
        this.$store.commit('excavator/setAutoPointMode', false);
        this.$bus.$emit('selectManualPointMode');
      },
      checkLoadMode(inde) {
        let data = this.parkAllocationStatus;
        for (let i = 0; i < data.length; i++) {
          if (data[i].child_point && data[i].child_point.stop_group_status != 0)
            return this.showToast('预停靠位模式未关闭，不允许切换装载模式');
          if (data[i].imei) return this.showToast('停靠位已分配，不允许切换装载模式');
        }
        // 切换装载模式，预停靠位打开
        this.$bus.$emit('setBeforePoint', inde);
        // 记录手动切换过装载模式
        this.$store.commit('excavator/setRgnloadMode', inde);
        this.$store.commit('excavator/setCheckRgnloadMode', true);
      },
      settingNoEntry() {
        this.$emit('settingNoEntry');
      },
      switch1Change(e) {
        if (this.disabledPrePointSwitch) return false;
        let value = !this.prePointStatus;
        localStorage.setItem('prePointStatus', value); // 保存司机操作
        // 如果有推送预停靠位就发消息
        let stop_num_list = [];
        for (let i = 0; i < this.parkAllocationStatus.length; i++) {
          let data = this.parkAllocationStatus[i].child_stop_num;
          let point = this.parkAllocationStatus[i].child_point;
          if (point && point.imei) {
            this.$store.commit('setMessageList', `预停靠位已分配，不允许更改`);
            sendMsgToBackend(`预停靠位已分配，不允许更改`);
            return;
          }
          if (data) stop_num_list.push(data);
        }
        this.$bus.$emit('setBeforePoint');
        if (stop_num_list.length) {
          stop_num_list.forEach(item => {
            sendSocket({
              type: 'setPointState',
              stop_num: item,
              state: value ? 1 : 0,
            });
          });
          this.$store.commit('setMessageList', `动态待装${value ? '开启' : '关闭'}已发送`);
          sendMsgToBackend(`动态待装${value ? '开启' : '关闭'}已发送`);
          if (value) {
            this.$store.commit('setMessageList', `预停靠位将在下一次指点后自动启用`);
            sendMsgToBackend(`预停靠位将在下一次指点后自动启用`);
            this.$toast('预停靠位将在下一次指点后自动启用');
          }
        }
      },
      changeintoAreaMode(data) {
        // this.setIntoArea = data;
        if (data == 0) {
          this.$bus.$emit('deleteNoEntry', { type: 'delete' });
          sendSocket({
            type: 'settingDoNotInto',
            status: '0', //0 不设定  1设定
            startAngle: '0',
            endAngle: '0',
            direction: '1', //0逆时针 1顺时针
          });
        }
        this.$emit('setNoEntryAreaStatus', { data: data });
      },
      confirm() {
        this.showModal = false;
        // 就绪
        if (this.messageType == 7) {
          sendSocket({
            type: 'OperationStatus',
            service_state_type: 1,
            service_delay_reason: 0,
            time_delay: 0,
          });
        }
        // 切换物料
        if (this.messageType == 1) {
          this.materialvalue = this.activeMaterialvalue;
          sendSocket({
            type: 'ChangeMaterial',
            materialNum: this.materialvalue,
          });
          this.$emit('close');
        }
      },
      cancel() {
        this.showModal = false;
      },
      listbtn(item) {
        this.clickItemId = item.id;
        if (this.clickItemId == 8 || this.clickItemId == 9) {
          this.asideShowFlag = true;
        } else if (this.clickItemId == 7) {
          this.asideShowFlag = false;
          this.showModal = true;
          this.messageType = this.clickItemId;
          if (this.clickItemId == 7) this.message = this.toLang('startReadiness');
        }
      },
      btnleft() {
        if (this.currentpage > 1) this.currentpage--;
      },
      btnright() {
        if (this.currentpage < Math.ceil(this.AllReasonList.length / 6)) this.currentpage++;
      },
      changeReasonValue(res) {
        this.reasonValue = res;
      },
      changeTimeValue(res) {
        this.timeValue = res;
      },
      changebreakvalue(res) {
        this.breakReasonValue = res;
      },
      changeMaterialValue(res) {
        this.activeMaterialvalue = res;
        this.message = this.toLang('confirmChangeMaterial');
        this.showModal = true;
        this.messageType = 1;
      },
      showUpDown(item) {
        // 点击挖机补偿值,展示挖机补偿值弹窗
        if (item.title === 'compensation') {
          this.$bus.$emit('setShowModal');
        }
        // 点击装载模式,展开二级侧边栏
        if (item.title === 'rgnloadModeSetting') {
          this.asideShowFlag = true;
        }

        if (item.title == 'statusSetting') return (item.showFlag = true);
        if (item.showFlag == false) {
          for (let i = 0; i < this.testitemlist.length; i++) {
            if (this.testitemlist[i].title != 'statusSetting') this.testitemlist[i].showFlag = false;
          }
          item.showFlag = true;
        } else {
          item.showFlag = false;
        }
      },
      closebtn() {
        this.$emit('close');
      },
      closeAsidebtn() {
        this.asideShowFlag = false;
        this.clickItemId = null;
      },
      //延时上报
      delayconfirm() {
        this.asideShowFlag = false;
        sendSocket({
          type: 'OperationStatus',
          service_state_type: 2,
          service_delay_reason: parseInt(this.reasonValue),
          time_delay: parseInt(this.timeValue) * 60,
        });
      },
      // 故障上报
      defaultconfirm() {
        this.asideShowFlag = false;
        sendSocket({
          type: 'OperationStatus',
          service_state_type: 3,
          service_delay_reason: parseInt(this.breakReasonValue),
          time_delay: 0,
        });
      },
    },
  };
</script>
