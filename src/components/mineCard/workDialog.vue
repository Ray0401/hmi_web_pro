<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .work-list-title {
    color: #70a7b3;
    font-size: 20px;
    font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
    font-weight: 500;
    text-align: left;
  }
  .work-list-detail {
    width: 100%;
    box-sizing: border-box;

    .work-list-box {
      display: flex;
      // justify-content: space-between;
      align-items: center;
      align-content: flex-start;
      flex-wrap: wrap;
      width: 100%;
      box-sizing: border-box;

      .work-list {
        padding: 10px 0 0;
        margin-left: 33px;
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
        }
        .work-list-text-warp {
          white-space: nowrap;
        }
        &:nth-child(3n + 1) {
          margin-left: 0;
        }
      }
    }
  }

  .detail-list-btn-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .detail-list-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 25px 20px 0;
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
</style>

<template>
  <div class="work-dialog-box">
    <div class="work-dialog-outer">
      <div class="work-dialog-inner">
        <!-- 外面三个可折叠的框 -->
        <div
          class="work-list-outer"
          :class="item.showFlag == false ? 'corners1' : 'corners2'"
          @click="showUpDown(item)"
          v-for="item in testitemlist"
        >
          <div class="work-list-inner">
            <div class="work-list-title">
              {{ toLang(item.title) }}
            </div>
            <div class="work-list-detail" v-if="item.showFlag == true">
              <div class="work-list-box">
                <div class="work-list" v-for="iconitem in item.iconlist" @click.stop="listbtn(iconitem)">
                  <img :src="clickItemId == iconitem.id ? iconitem.iconclick : iconitem.icon" class="work-list-icon" />
                  <div :class="`work-list-text ${item.title == 'statusSetting' && 'work-list-text-warp'}`">
                    {{ toLang(iconitem.text) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <close-dialog v-if="!asideShowFlag" type="right" @click="closebtn()"></close-dialog>
    </div>
    <div class="work-dialog-aside-outer" v-show="asideShowFlag">
      <div class="work-dialog-aside-inner">
        <div class="content-box" v-if="clickItemId == 3">
          <div class="" v-for="item in unloadingConditionList">
            <div class="detail-title">
              {{ toLang(item.title) }}
            </div>
            <div class="detail-list-box">
              <div class="detail-list" v-for="list in item.iconList" @click="itemopt(list)">
                <img :src="list.clickFlag ? list.iconclick : list.icon" class="detail-image" />
                <span class="detail-textfont">{{ toLang(list.text) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="content-box" v-if="clickItemId == 4">
          <div class="detail-title">历史文件</div>
          <div class="history-list">
            <img :src="historyFileIco" class="history-icon" />
            <div class="history-name-list" v-for="item in historyList">
              <span class="history-name">{{ item.name }}</span>
            </div>
          </div>
          <button-dialog class="upload-btn-box" type="orange" @click="uploadfile">
            {{ toLang('upload') }}
          </button-dialog>
          <button-dialog class="delete-btn-box" type="red" @click="deletebtn">删除并重新采集</button-dialog>
        </div>
        <div class="content-box" v-if="clickItemId == 5">
          <div class="detail-title">{{ toLang('AlarmSettings') }}</div>
          <div class="detail-text">{{ toLang('LaneDeparture') }}</div>
          <div class="" @click.stop.prevent>
            <toggle-button color="#FF5900" :width="70" :height="35" :value="warnSwitch" @change="switch1Change" />
          </div>
        </div>
        <div class="content-box" v-if="clickItemId == 8">
          <div class="detail-title">{{ toLang('delayReason') }}</div>
          <div class="detail-list-btn-box">
            <radio-dialog
              :radio-list="reasonList"
              :value.sync="reasonValue"
              @radiochange="changeReasonValue"
            ></radio-dialog>
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
      </div>
      <close-dialog class="aside-close-btn" type="right" @click="closeAsidebtn()"></close-dialog>
    </div>
    <MessageModal v-if="showModal" :message="message" @confirm="confirm" @cancel="cancel" />
  </div>
</template>
<script>
  import closeDialog from '@/components/dialog/closeButton.vue';
  import { unloadingConditionList, testitemlist, reasonList, timeList, breakReasonList } from './data';
  export default {
    name: 'worDialog',
    components: {
      closeDialog,
    },
    props: {
      warnSwitch: {
        type: Boolean,
        default: false,
      },
      currencyTerminal: {
        type: Boolean,
        default: false,
      },
      drivemode: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        switchchecked: false,
        goodstatus: {},
        message: '', //提示信息
        messageType: null, //消息类型
        showModal: false,
        historyFileIco: '/assets/images/historyFileIco.png',
        historyList: [
          {
            name: '09/36/20210412.xxx',
          },
        ],
        readystateflag: false,
        reasonValue: '0x0001',
        timeValue: '15',
        breakReasonValue: '0x0001',
        clickItemId: null,
        asideShowFlag: false,
        reasonList,
        timeList,
        testitemlist,
        unloadingConditionList,
        breakReasonList,
      };
    },
    methods: {
      listbtn(item) {
        // if (!item.id || [7, 8, 9].includes(item.id)) this.$toast({ title: `itemid${item.id}`, icon: 'none' });
        if (!item.id) return;
        // if (this.drivemode == 1 && item.id == 10) {
        //   // 自动驾驶情况下不能感知采集
        //   this.$toast({
        //     title: '自动驾驶中，不能感知采集',
        //     mask: true,
        //     icon: 'none',
        //   });
        //   return false;
        // }
        this.clickItemId = item.id;
        let ids = [3, 4, 5, 8, 9];
        if (ids.includes(this.clickItemId)) {
          this.asideShowFlag = true;
          if (this.clickItemId == 4) {
            this.asideShowFlag = false;
            this.$emit('rmodeFlag');
            this.$bus.$emit('exitGather');
          }
        } else if (item.id == 10) {
          this.$emit('collectShowFlag');
        } else {
          this.asideShowFlag = false;
          this.showModal = true;
          this.messageType = this.clickItemId;
          if (this.clickItemId == 1) this.message = this.toLang('startStaticTest');
          if (this.clickItemId == 2) this.message = this.toLang('startDynamicTest');
          if (this.clickItemId == 6) this.message = this.toLang('startDailyLog');
          if (this.clickItemId == 7) this.message = this.toLang('startReadiness');
        }
      },
      changeReasonValue(val) {
        // debugger
        console.log(val);
        this.reasonValue = val;
      },
      changeTimeValue(res) {
        // debugger
        this.timeValue = res;
      },
      changebreakvalue(val) {
        this.breakReasonValue = val;
      },
      switch1Change(e) {
        this.socket.send(
          JSON.stringify({
            type: 'warnSwitch',
            on: e.detail.value,
          })
        );
      },
      showUpDown(item) {
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
        this.$bus.$emit('exitGather');
      },
      closeAsidebtn() {
        this.asideShowFlag = false;
        this.clickItemId = null;
      },
      uploadfile() {
        // uni.chooseFile({
        //   count: 6, //默认100
        //   // extension: ['.zip', '.doc'],
        //   success: function (res) {
        //     console.log(JSON.stringify(res.tempFilePaths));
        //   },
        // });
      },
      //延迟申请
      delayconfirm() {
        this.socket.send(
          JSON.stringify({
            type: 'OperationStatus',
            service_state_type: 2, // 1: 就绪运行 2: 延时停运 3: 故障停运 4: 备用停运
            service_delay_reason: parseInt(this.reasonValue), //只有在延时申请/故障申请下有效，否则全零。详细定义参见第9节“设备故障/延时原因对照表”
            time_delay: parseInt(this.timeValue) * 60, //单位为秒(s)，只有在延时申请下有效，否则全零。
          })
        );
        this.closeWorkModal();
      },
      //故障申请
      defaultconfirm() {
        this.socket.send(
          JSON.stringify({
            type: 'OperationStatus',
            service_state_type: 3, // 1: 就绪运行 2: 延时停运 3: 故障停运 4: 备用停运
            service_delay_reason: parseInt(this.breakReasonValue), //只有在延时申请/故障申请下有效，否则全零。详细定义参见第9节“设备故障/延时原因对照表”
            time_delay: 0, //单位为秒(s)，只有在延时申请下有效，否则全零。
          })
        );
        this.closeWorkModal();
      },
      closeWorkModal() {
        this.asideShowFlag = false;
        this.clickItemId = null;
      },
      deletebtn() {
        console.log('删除文件并重新上传');
      },
      itemopt(list) {
        for (let i = 0; i < this.unloadingConditionList.length; i++) {
          for (let m = 0; m < this.unloadingConditionList[i].iconList.length; m++) {
            this.unloadingConditionList[i].iconList[m].clickFlag = false;
          }
        }
        if (list) {
          list.clickFlag = true;
          this.showModal = true;
          this.goodstatus = list;
          this.message = `${this.toLang('switchTo') + this.toLang(this.goodstatus.text)}?`;
          this.messageType = 3;
        }
      },
      confirm() {
        this.showModal = false;
        // 更改载货状态
        if (this.messageType === 3) {
          this.socket.send(
            JSON.stringify({
              type: 'LoadStatus',
              load_status: this.goodstatus.id, //十进制字串，0x01：空载装载状态0x02：满载卸载状态0x03：半载卸载状态0x04：空载卸载状态
            })
          );
          this.itemopt();
        }
        //上传文件
        if (this.messageType === 6) {
          this.socket.send(
            JSON.stringify({
              type: 'uploadLog',
            })
          );
        }
        //开启静态测试
        if (this.messageType === 1) {
          this.socket.send(
            JSON.stringify({
              type: 'check',
              checkType: '2',
            })
          );
        }
        //开启动态测试
        if (this.messageType === 2) {
          this.socket.send(
            JSON.stringify({
              type: 'check',
              checkType: '1',
            })
          );
        }
        //就绪状态
        if (this.messageType === 7) {
          this.socket.send(
            JSON.stringify({
              type: 'OperationStatus',
              service_state_type: 1, // 1: 就绪运行 2: 延时停运 3: 故障停运 4: 备用停运
              service_delay_reason: 0, //只有在延时申请/故障申请下有效，否则全零。详细定义参见第9节“设备故障/延时原因对照表”
              time_delay: 0, //单位为秒(s)，只有在延时申请下有效，否则全零。
            })
          );
        }
        if (this.messageType != 3) {
          this.$emit('close');
        }
        this.closeWorkModal();
      },
      cancel() {
        this.showModal = false;
      },
    },
  };
</script>
