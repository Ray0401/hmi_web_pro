<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .work-list-inner {
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .work-list-title {
      color: #70a7b3;
      font-size: 20px;
      font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .pagination {
        display: flex;
        align-items: center;
        .pre-page {
          width: 0;
          height: 0;
          border-top: 10px solid transparent;
          border-right: 12px solid #70a7b3;
          border-bottom: 10px solid transparent;
          cursor: pointer;
          &.disabled {
            border-right-color: #22273e;
          }
        }
        .next-page {
          width: 0;
          height: 0;
          border-top: 10px solid transparent;
          border-left: 12px solid #70a7b3;
          border-bottom: 10px solid transparent;
          cursor: pointer;
          &.disabled {
            border-left-color: #22273e;
          }
        }

        .page-num {
          font-size: 18px;
          width: 42px;
          text-align: center;
        }
      }
    }

    .work-list-detail {
      width: 100%;
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
          margin-top: 20px;
          margin-right: 0 !important;

          .stop {
            position: relative;
            width: 298px;
            height: 110px;
            background-image: url('@/assets/images/excavator/copy.png');
            background-size: 90% 100%;
            background-repeat: no-repeat;
            display: flex;

            .stopleft {
              position: absolute;
              top: 43px;
              left: 20px;

              image {
                width: 20px;
                height: 20px;
                // background-color: #fff;
              }
            }

            .stopcenter {
              position: absolute;
              top: 20px;
              left: 70px;
              margin-right: 20px;

              image {
                width: 70px;
                height: 70px;
              }
            }

            .stopright {
              position: absolute;
              top: 20px;
              right: 50px;

              .top {
                font-size: 16px;
                font-family: Source Han Sans CN VF, Source Han Sans CN VF-Regular;
                font-weight: 400;
                text-align: left;
                color: #6fa6b1;
                line-height: 20px;
                letter-spacing: 0.56px;
                margin-bottom: 10px;
              }

              .bottom {
                text {
                  margin-left: 10px;
                  font-size: 16px;
                  font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                  font-weight: 500;
                  text-align: left;
                  color: #ff9d66;
                  line-height: 20px;
                  letter-spacing: 0.24px;
                }
              }
            }
          }

          .work-list-icon {
            width: 70px;
            height: 70px;
          }

          .work-list-text {
            font-size: 15px;
            font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
            font-weight: 500;
            text-align: center;
            color: #f2f2f2;
          }
        }

        .paitu-item {
          width: 298px;
          height: 110px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          color: #6fa6b1;
          background: url('@/assets/images/bulldozer/paituBg.png') 100% / contain no-repeat;
          &:first-child {
            margin-top: 20px;
          }

          .paitu-area {
            width: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .paitu-switch {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }

        .block-item {
          display: flex;
          color: #ffffff;
          width: 100%;
          height: 56px;
          align-items: center;
          justify-content: space-between;
          position: relative;
          &:after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 2px;
            // 中间向两边渐变
            background: linear-gradient(to left, #22273e 0%, #2e7ea0 50%, #22273e 100%);
          }
          .block-area {
            font-size: 20px;
          }
          .block-pagination {
            position: absolute;
          }
        }
      }
    }
  }
</style>

<template>
  <div>
    <div class="work-dialog-outer" v-if="visible">
      <div class="work-dialog-inner">
        <!-- 外面三个可折叠的框 -->
        <div class="work-list-outer" @click="showUpDown(item)" v-for="(item, index) in workItemList" :key="index">
          <div class="work-list-inner">
            <div class="work-list-title">
              {{ toLang(item.title) }}
            </div>
            <div class="work-list-detail" v-if="item.showFlag">
              <div class="work-list-box">
                <template v-if="item.iconlist">
                  <div
                    class="work-list"
                    v-for="(iconitem, index) in item.iconlist"
                    :key="index"
                    @click.stop="listBtn(iconitem)"
                  >
                    <img
                      :src="clickItemId == iconitem.id ? iconitem.iconclick : iconitem.icon"
                      class="work-list-icon"
                    />
                    <div class="work-list-text">{{ toLang(iconitem.text) }}</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <close-dialog v-if="!asideShowFlag" type="right" @click="closebtn"></close-dialog>
    </div>

    <div class="work-dialog-aside-outer" v-show="asideShowFlag">
      <div class="work-dialog-aside-inner">
        <!-- 边界采集 -->
        <div class="content-box" v-if="clickItemId == 1">
          <div class="detail-title">{{ toLang('t_selectSide') }}</div>
          <div class="detail-list-btn-box">
            <radio-dialog
              :radio-list="directionList"
              :value.sync="directionValue"
              @radiochange="changeDirectionValue"
            />
          </div>
          <button-dialog class="select-btn" type="orange" @click="collectConfirm">
            {{ toLang('confirm') }}
          </button-dialog>
        </div>
        <!-- 排土采集 -->
        <div class="content-box" v-if="clickItemId == 2">
          <div class="detail-title">{{ toLang('t_selectSoilSide') }}</div>
          <div class="detail-list-btn-box">
            <radio-dialog
              :radio-list="directionList"
              :value.sync="directionValue"
              @radiochange="changeDirectionValue"
            />
          </div>

          <div class="detail-title">{{ toLang('t_selectSoilType') }}</div>
          <div class="detail-list-btn-box">
            <radio-dialog :radio-list="soilTypeList" :value.sync="soilTypeValue" @radiochange="changeSoilTypeValue" />
          </div>

          <button-dialog class="select-btn" type="orange" @click="collectConfirm">
            {{ toLang('confirm') }}
          </button-dialog>
        </div>
        <!-- 障碍物采集 -->
        <div class="content-box" v-if="clickItemId == 3">
          <div class="detail-title">{{ toLang('t_selectSide') }}</div>
          <div class="detail-list-btn-box">
            <radio-dialog
              :radio-list="directionList"
              :value.sync="directionValue"
              @radiochange="changeDirectionValue"
              class="mode"
            />
          </div>
          <button-dialog class="select-btn" type="orange" @click="collectConfirm">
            {{ toLang('confirm') }}
          </button-dialog>
        </div>

        <!-- 延时申请 -->
        <div class="content-box" v-if="clickItemId == 8">
          <div class="detail-title">{{ toLang('t_delayReason') }}</div>
          <div class="detail-list-btn-box">
            <radio-dialog :radio-list="reasonList" :value.sync="reasonValue" @radiochange="changeReasonValue" />
          </div>
          <div class="detail-title">{{ toLang('t_delayTime') }}</div>
          <div class="detail-list-btn-box">
            <radio-dialog :radio-list="timeList" :value.sync="timeValue" @radiochange="changeTimeValue" />
          </div>
          <button-dialog class="select-btn" type="orange" @click="delayconfirm">{{ toLang('confirm') }}</button-dialog>
        </div>
        <!-- 故障申请 -->
        <div class="content-box" v-if="clickItemId == 9">
          <div class="detail-title">{{ toLang('t_faultReason') }}</div>
          <div class="detail-list-btn-box">
            <radio-dialog
              :radio-list="breakReasonList"
              :value.sync="breakReasonValue"
              @radiochange="changebreakvalue"
            />
          </div>
          <button-dialog class="select-btn" type="orange" @click="defaultconfirm">
            {{ toLang('confirm') }}
          </button-dialog>
        </div>
      </div>
      <close-dialog class="aside-close-btn" type="right" @click="closeAsidebtn"></close-dialog>
    </div>
    <MessageModal v-if="showModal" :message="message" @confirm="messageModalConfirm" @cancel="messageModalCancel" />
  </div>
</template>
<script>
  import closeDialog from '@/components/dialog/closeButton.vue';
  import Switcher from '../components/switcher.vue';
  import CommonModal from '../components/commonModal.vue';
  import { COMMON_MODAL_TYPE } from '@/constant';
  import {
    DIRECTION_LIST,
    REASON_LIST,
    BREAK_REASON_LIST,
    TIME_LIST,
    WORK_ITEM_LIST,
    SOIL_TYPE_LIST,
  } from '@/constant/bulldozer';
  import { sendSocket } from '@/utils/utils';

  export default {
    name: 'bullWorkDialog',
    components: {
      closeDialog,
      Switcher,
      CommonModal,
    },
    props: {
      warnSwitch: {
        type: Boolean,
        default: false,
      },
      visible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        message: '',
        showModal: false,
        directionValue: 'left',
        directionList: DIRECTION_LIST,
        soilTypeList: SOIL_TYPE_LIST,
        soilTypeValue: 'edge',
        timeValue: '15',
        timeList: TIME_LIST,
        workItemList: WORK_ITEM_LIST,
        reasonValue: '0x0002',
        reasonList: REASON_LIST,
        breakReasonValue: '0x0001',
        breakReasonList: BREAK_REASON_LIST,
        clickItemId: null,
        asideShowFlag: false,
        isNeedSelectWorkArea: true, // 上传文件的时候是否需要点选作业区
      };
    },
    mounted() {
      this.$bus.$on('clearClickItemId', () => {
        this.clickItemId = null;
        this.isNeedSelectWorkArea = true;
      });

      // 主动打开抽屉
      this.$bus.$on('selectCollectType', value => {
        if (value == 'soil') {
          this.workItemList[0].showFlag = true;
          this.clickItemId = 2;
          this.asideShowFlag = true;
          this.isNeedSelectWorkArea = false;
        }
      });
    },
    methods: {
      messageModalConfirm() {
        this.showModal = false;
        // 发送就绪申请协议
        sendSocket({
          type: 'OperationStatus',
          service_state_type: 1,
        });
      },
      messageModalCancel() {
        this.showModal = false;
      },

      // 点击button
      listBtn(item) {
        this.clickItemId = item.id;
        let idList = [1, 2, 3, 8, 9];
        if (idList.includes(this.clickItemId)) {
          this.asideShowFlag = true;
        } else if (item.id == 4) {
          this.$emit('collectShowFlag');
        } else {
          this.asideShowFlag = false;
          if (this.clickItemId == 7) {
            this.$bus.$emit('openCommonModal', COMMON_MODAL_TYPE.READY_APPLY);
          }
        }
      },
      // 原因选项变更
      changeReasonValue(res) {
        this.reasonValue = res;
      },
      // 时间选项变更
      changeTimeValue(res) {
        console.log(res);
        this.timeValue = res;
      },
      // 故障选项变更
      changebreakvalue(res) {
        console.log(res);
        this.breakReasonValue = res;
      },
      // 展开折叠
      showUpDown(item) {
        if (item.mustOpen) return;
        item.showFlag = !item.showFlag;
      },
      changeDirectionValue(res) {
        this.directionValue = res;
      },
      changeSoilTypeValue(value) {
        this.soilTypeValue = value;
      },
      // 二级侧边栏确定按钮点击事件
      collectConfirm() {
        this.asideShowFlag = false;
        if (this.clickItemId <= 3) {
          const payload = {
            type: this.clickItemId == 1 ? 'unloadBoundary' : this.clickItemId == 2 ? 'soil' : 'obstacleBoundary',
            side: this.directionValue,
          };
          if (this.clickItemId == 2) {
            payload.dumplineType = this.soilTypeValue;
            if (!this.isNeedSelectWorkArea) this.$store.commit('bulldozer/setHasTargetWork', true);
          }
          this.$store.commit('bulldozer/setCollectConfig', payload);
          this.$emit('close');
          this.$bus.$emit('startCollect');
        }
      },
      closebtn() {
        this.$emit('close');
      },
      closeAsidebtn() {
        this.asideShowFlag = false;
        this.clickItemId = null;
      },
      delayconfirm() {
        this.asideShowFlag = false;
        this.socket.send(
          JSON.stringify({
            type: 'OperationStatus',
            service_state_type: 2, // 1: 就绪运行 2: 延时停运 3: 故障停运 4: 备用停运
            service_delay_reason: parseInt(this.reasonValue), //只有在延时申请/故障申请下有效，否则全零。详细定义参见第9节“设备故障/延时原因对照表”
            time_delay: parseInt(this.timeValue) * 60, //单位为秒(s)，只有在延时申请下有效，否则全零。
          })
        );
      },
      defaultconfirm() {
        this.asideShowFlag = false;
        this.socket.send(
          JSON.stringify({
            type: 'OperationStatus',
            service_state_type: 3, // 1: 就绪运行 2: 延时停运 3: 故障停运 4: 备用停运
            service_delay_reason: parseInt(this.breakReasonValue), //只有在延时申请/故障申请下有效，否则全零。详细定义参见第9节“设备故障/延时原因对照表”
            time_delay: 0, //单位为秒(s)，只有在延时申请下有效，否则全零。
          })
        );
      },
    },
    watch: {
      visible: function (val) {
        if (!val) {
          this.clickItemId = null;
          this.asideShowFlag = false;
        }
      },
    },
  };
</script>
