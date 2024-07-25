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
              <div class="work-list-box" v-if="item.title == toLang('c_collectionOperation')">
                <div class="work-list" v-for="iconitem in item.iconlist" @click.stop="listbtn(iconitem)">
                  <img :src="clickItemId == iconitem.id ? iconitem.iconclick : iconitem.icon" class="work-list-icon" />
                  <div class="work-list-text">{{ iconitem.text }}</div>
                </div>
              </div>
              <div v-else>
                <div class="detail-text" style="margin-top: 10px">车道偏离/逆行告警</div>
                <!-- 车道偏离/逆行告警 -->
                <div class="call-detail-box" @click.stop="() => {}">
                  <toggle-button
                    color="#FF5900"
                    :width="70"
                    :height="35"
                    :value="retrogradWarning"
                    @change="switchRetrogradWarningChange"
                  />
                </div>

                <template v-if="item.text">
                  <div class="detail-text" style="margin-top: 20px">周边矿卡语音告警</div>

                  <!-- 周边矿卡语音告警 -->
                  <div class="call-detail-box" @click.stop="() => {}">
                    <toggle-button
                      color="#FF5900"
                      :width="70"
                      :height="35"
                      :value="voiceWarning"
                      @change="switchVoiceWarningChange"
                    />
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
        <div class="content-box" v-if="clickItemId == 1">
          <div class="detail-title">{{ isEN ? 'Select the boundary type' : '请选择边界类型' }}</div>
          <div class="detail-list-btn-box">
            <radio-dialog
              :radio-list="borderList"
              :value.sync="borderValue"
              @radiochange="changeBorderValue"
            ></radio-dialog>
          </div>
          <div class="detail-title">
            {{ isEN ? 'Select which side of the car the border is on' : '选择边界在车身哪一侧' }}
          </div>
          <div class="detail-list-btn-box">
            <radio-dialog
              :radio-list="directionList"
              :value.sync="directionValue"
              @radiochange="changeDirectionValue"
            ></radio-dialog>
          </div>
          <div class="confirm-btn" @click="confirm">{{ toLang('confirm') }}</div>
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
  import { sendMsgToBackend, sendSocket, getAssetsFile } from '@/utils/utils';

  export default {
    name: 'worDialog',
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
        workItemList: [
          {
            title: this.toLang('c_collectionOperation'),
            showFlag: true,
            iconlist: [
              {
                iconclick: getAssetsFile('images/staticTestClick.png'),
                icon: getAssetsFile('images/statictest.png'),
                text: this.toLang('c_locationCollection'),
                id: 1,
              },
              {
                icon: getAssetsFile('images/dynamictest.png'),
                iconclick: getAssetsFile('images/dynamicTestClick.png'),
                text: this.toLang('c_perceptionCollection'),
                id: 2,
              },
            ],
          },
          {
            title: this.toLang('c_alarmSetting'),
            showFlag: false,
            text: this.toLang('LaneDeparture'),
            text2: this.toLang('voiceWarning'),
          },
        ],
        clickItemId: null,
        asideShowFlag: false,
        borderValue: '道路边界',
        borderList: [
          {
            label: this.toLang('c_roadBoundary'),
            value: '道路边界',
          },
          {
            label: this.toLang('c_loadingAreaBoundary'),
            value: '装载区边界',
          },
          {
            label: this.toLang('c_unloadingAreaBoundary'),
            value: '卸载区边界',
          },
          {
            label: this.toLang('c_obstaclesBoundary'),
            value: '障碍物边界',
          },
        ],
        directionValue: 'left',
        directionList: [
          {
            label: this.toLang('leftSide'),
            value: 'left',
          },
          {
            label: this.toLang('rightSide'),
            value: 'right',
          },
        ],
        voiceWarning: false,
        retrogradWarning: false,
      };
    },
    created() {
      this.voiceWarning = Boolean(Number(localStorage.getItem('switchVoiceWarning') || 0));
      this.retrogradWarning = Boolean(Number(localStorage.getItem('switchRetrogradWarning') || 0));
    },
    mounted() {
      this.$bus.$on('clearClickItemId', () => {
        this.clickItemId = null;
      });
    },

    methods: {
      getAssetsFile,
      // 车道逆行/偏离告警开关
      switchRetrogradWarningChange(e) {
        const checked = e.value;
        localStorage.setItem('switchRetrogradWarning', Number(checked));
        this.$store.commit('setMessageList', `车辆偏离/逆行告警${checked ? '开启' : '关闭'}`);
        sendMsgToBackend(`车道偏离和逆行告警${checked ? '开启' : '关闭'}`);
        // speak(`车道偏离和逆行告警${checked ? '开启' : '关闭'}`, 6);
      },
      // 周边矿卡语音告警开关
      switchVoiceWarningChange(e) {
        const checked = e.value;
        localStorage.setItem('switchVoiceWarning', Number(checked));
        this.$store.commit('setMessageList', `周边矿卡语音告警${checked ? '开启' : '关闭'}`);
        sendMsgToBackend(`周边矿卡语音告警${checked ? '开启' : '关闭'}`);
        // speak(`周边矿卡语音告警${checked ? '开启' : '关闭'}`, 6);

        sendSocket({
          type: 'closeVoice',
          status: Number(checked),
        });
      },

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

      changeBorderValue(res) {
        this.borderValue = res;
      },
      changeDirectionValue(res) {
        this.directionValue = res;
      },

      // 点击button
      listbtn(item) {
        this.clickItemId = item.id;
        if (this.clickItemId == 1) {
          this.asideShowFlag = true;
        } else {
          this.asideShowFlag = false;
          if (this.clickItemId == 2) {
            this.$emit('collectShowFlag');
          }
        }
      },
      // 展开折叠
      showUpDown(item) {
        if (item.mustOpen) return;
        item.showFlag = !item.showFlag;
      },
      // 二级侧边栏确定按钮点击事件
      confirm() {
        this.asideShowFlag = false;
        //显示当前采集边界
        this.$store.commit('setCollectArea', this.borderValue);
        this.$emit('collectShowFlag', { borderValue: this.borderValue, directionValue: this.directionValue });
        if (this.clickItemId == 1) {
          const option = {
            道路边界: 'roadBoundary',
            装载区边界: 'loadBoundary',
            卸载区边界: 'unloadBoundary',
            障碍物边界: 'obstacleBoundary',
          };
          const payload = {
            type: option[this.borderValue],
            side: this.directionValue,
          };
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
    },
  };
</script>

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
        // display: flex;
        // justify-content: space-between;
        // align-items: center;
        // align-content: flex-start;
        // flex-wrap: wrap;
        // width: 100%;
        // box-sizing: border-box;

        display: inline-block;

        .work-list {
          display: inline-block;
          margin-top: 20px;
          margin-right: 20px;

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
      }
    }
  }

  .detail-text {
    font-size: 18px;
    font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
    font-weight: 500;
    text-align: left;
    color: #f2f2f2;
    margin-bottom: 19px;
  }

  .confirm-btn {
    @include orangebtn();
    position: absolute;
    bottom: 10px;
    font-size: 19px;
    font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
    font-weight: 500;
    text-align: center;
    padding: 10px 0;
    width: 100%;
    color: #ffffff;
  }
</style>
