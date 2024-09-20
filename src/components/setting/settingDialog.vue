<style lang="scss" scoped>
  @import '@/assets/css/common.scss';
  .version-list-outer {
    width: 310px;
    background: none;
    border-image-source: url('/src/assets/images/bulldozer/secondSlide.png');
    border-image-slice: 50 20 40 20 fill;
    border-image-width: 50px 25px;
    border-image-repeat: stretch;
  }
  .voiceWarning,
  .retrogradeWarning {
    .text {
      color: #fff;
      margin-bottom: 5px;
      font-size: 16px;
    }
    margin-bottom: 10px;
  }

  .setting-text {
    font-size: 22px;
    font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
    font-weight: 500;
    text-align: left;
    color: #70a7b3;
    padding-bottom: 15px;
    box-sizing: border-box;
  }

  .extra {
    font-size: 18px;
    font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
    font-weight: 500;
    text-align: left;
    color: #f2f2f2;
    margin-bottom: 15px;

    .extra-one {
      margin-bottom: 15px;
    }

    .extra-two {
      .switch-button {
        display: none;
        /*隐藏表单元素*/
      }

      .switch-button + label {
        /*+选择器选择紧跟“+”左边选择器的第一个元素*/
        display: inline-block;
        position: relative;
        transition: all 0.3s;
        width: 30px;
        height: 15px;
        border: 1px solid #999;
        border-radius: 8px;
        background-color: #ccc;
      }

      .switch-button:checked + label {
        /*选中表单后的样式，:checked表示checkbox被选中后的状态*/
        background-color: lightgreen;
      }

      .switch-button + label::before {
        /*使用伪元素生成一个按钮*/
        content: '';
        display: block;
        height: 25px;
        width: 25px;
        position: absolute;
        border-radius: 25px;
        left: 2px;
        top: 2px;
        background-color: #fff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        transition: all 0.3s;
      }

      .switch-button:checked + label::before {
        /*checkbox选中时按钮的样式*/
        left: 32px;
        transition: all 0.2s linear;
      }
    }
  }

  .setting-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .setting-progress-box {
      .setting-brightness {
        padding-bottom: 25px;
        box-sizing: border-box;

        .setting-brightness-text {
          font-size: 18px;
          font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
          font-weight: 500;
          text-align: left;
          color: #f2f2f2;
          margin-bottom: 15px;
        }

        .setting-brightness-progress {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .setting-progress-bar-box {
            padding: 0 15px;
            box-sizing: border-box;
            flex: 1;
          }

          .setting-dis-btn {
            width: 47px;
            height: 47px;
            color: #c2cde0;
            font-size: 30px;
            border: 3px solid #212933;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }

    .setting-btn-box {
      .setting-btn {
        cursor: pointer;
        width: 100%;
        height: 47px;
        text-align: center;
        border: 1px solid #666;
        background: #212933;
        font-size: 18px;
        font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
        font-weight: 500;
        color: #f2f2f2;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;

        .setting-btn-newicon {
          margin-left: 5px;
          font-size: 16px;
          font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
          font-weight: 500;
          text-align: center;
          border: 3px solid #ff5900;
          color: #ff5900;
          padding: 6px;
          box-sizing: border-box;
        }
      }
    }
  }

  .setting-page-open-aside-closeicon {
    width: 42px;
    height: 47px;
    position: absolute;
    right: 100%;
    top: 0;
  }

  .version-box {
    .version-title {
      font-size: 22px;
      font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
      font-weight: 500;
      text-align: left;
      color: #ffffff;
    }

    // .version-list-box1 {
    // 			padding: 40px 0;
    // 			box-sizing: border-box;
    // 			overflow:hidden;
    // 			}
    .version-list-box {
      padding: 20px 0;
      box-sizing: border-box;
      overflow-y: scroll;

      .version-list {
        padding: 8px 0;
        box-sizing: border-box;
        display: flex;
        .version-name {
          font-size: 18px;
          font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
          font-weight: 500;
          text-align: left;
          color: #ffffff;
          margin-right: 10px;
        }
        .version-num {
          flex: 1;
          font-size: 18px;
          font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
          font-weight: 500;
          text-align: left;
          color: #70a7b3;
          word-break: break-all;
        }
      }
    }
    .version-list-box::-webkit-scrollbar {
      display: none;
    }
    .version-new-btn {
      width: 202px;
      height: 47px;
      font-size: 18px;
      font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
      font-weight: 500;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f2f2f2;
      @include orangebtn();
      position: absolute;
      bottom: 20px;
      left: 51%;
      transform: translateX(-50%);
    }
  }

  //
  .new-version-box {
    .new-version-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .new-version-title-text {
        font-size: 22px;
        font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
        font-weight: 500;
        // text-align: left;
        color: #ffffff;
        margin-right: 8px;
      }

      .new-version-title-texticon {
        font-size: 15px;
        font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
        font-weight: 500;
        text-align: center;
        color: #ff5900;
        padding: 4px 5px;
        border: 2px solid #ff5900;
        box-sizing: border-box;
      }
    }

    .update-version-text {
      font-size: 18px;
      font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
      font-weight: 500;
      text-align: left;
      color: #70a7b3;
      padding: 10px 0;
      box-sizing: border-box;
    }

    .new-version-list-box {
      width: 100%;
      height: 300px;
      padding-bottom: 10px;
      box-sizing: border-box;
      overflow-y: scroll;

      .new-version-list {
        padding: 10px 0;
        box-sizing: border-box;

        .new-version-list-title {
          font-size: 18px;
          font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
          font-weight: 500;

          .new-version-list-name {
            color: #ffffff;
            margin-right: 10px;
          }

          .new-version-list-num {
            color: #6fa6b1;
          }
        }

        .new-version-list-detail {
          .new-version-list-detail-text {
            list-style-type: disc;
            font-size: 14px;
            font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
            font-weight: 400;
            text-align: left;
            color: #ffffff;
            line-height: 20px;
            padding: 4px 0;
            box-sizing: border-box;
          }
        }
      }
    }

    .new-version-list-box::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 4px;
      /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
      scrollbar-arrow-color: red;
    }

    .new-version-list-box::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      // background: rgba(0, 0, 0, 0.2);
      background-color: #70a7b3;
      scrollbar-arrow-color: red;
    }

    .new-version-list-box::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }

    .version-install-btn {
      width: 222px;
      height: 47px;
      background-image: url('@/assets/images/orangebtnclicked.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      font-size: 18px;
      font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
      font-weight: 500;
      text-align: center;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }

    .install-state-des-list-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;

      .install-state-des-list {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .install-state-des-icon {
          width: 15px;
          height: 15px;
          margin-right: 5px;
        }

        .install-state-des-text {
          font-size: 14px;
          font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
          font-weight: 500;
          text-align: left;
          color: #ffffff;
        }
      }
    }
  }
</style>

<template>
  <div>
    <div class="work-dialog-outer">
      <div class="work-dialog-inner">
        <div class="setting-text">{{ toLang('settings') }}</div>
        <div class="extra" v-if="warn && currencyTerminal">
          <div class="extra-one">
            <span>车道偏离/逆行报警</span>
          </div>
          <div class="extra-two">
            <toggle-button @change="switchChange" color="#3EC3E1" :value="checkoutInfo.checked" />
          </div>
        </div>

        <div class="setting-content">
          <!-- <div class="setting-progress-box">
            <div class="setting-brightness" v-for="(list, index) in progressList">
              <div class="setting-brightness-text">
                {{ list.text }}
              </div>
              <div class="setting-brightness-progress">
                <div class="setting-dis-btn" @click="decrease(list, index)">-</div>
                <div class="setting-progress-bar-box">
                  <progress
                    :percent="index == 0 ? $store.state.brightness : $store.state.volume"
                    stroke-width="10"
                    backgroundColor="#394059"
                    activeColor="#fe5b00"
                  />
                </div>

                <div class="setting-dis-btn" @click="increase(list, index)">+</div>
              </div>
            </div>
          </div> -->

          <!-- 车辆偏离/逆行告警 -->
          <div class="retrogradeWarning" v-if="[ADOPT, SOIL, CURRENCY].includes($store.state.vehicleData.terminalType)">
            <div class="text">车辆偏离/逆行告警</div>
            <toggle-button
              color="#FF5900"
              :width="70"
              :height="35"
              :value="retrogradWarning"
              @change="switchRetrogradWarningChange"
            />
          </div>
          <!-- 周边矿卡语音告警 -->
          <div class="voiceWarning" v-if="[ADOPT, SOIL, CURRENCY].includes($store.state.vehicleData.terminalType)">
            <div class="text">周边矿卡语音告警</div>
            <toggle-button
              color="#FF5900"
              :width="70"
              :height="35"
              :value="voiceWarning"
              @change="switchVoiceWarningChange"
            />
          </div>

          <div class="voiceWarning" v-if="[ADOPT, SOIL, CURRENCY].includes($store.state.vehicleData.terminalType)">
            <div class="text">网格辅助线</div>
            <toggle-button color="#FF5900" :width="70" :height="35" :value="gridLine" @change="switchGridLine" />
          </div>

          <div class="setting-btn-box">
            <div class="setting-btn" @click="debugging()">
              <span>{{ toLang('systemDebugging') }}</span>
            </div>
            <div class="setting-btn" @click="currentVersion()">
              <span>{{ toLang('view') + toLang('currentVersion') }}</span>
              <div class="setting-btn-newicon" v-if="hasNewVersion">{{ toLang('updateAvailable') }}</div>
            </div>
            <div class="setting-btn" @click="reloadFn">
              <span>刷新</span>
            </div>
            <div class="setting-btn" @click="setFullScreen">
              <span>{{ fullscreenText }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->
      <close-dialog v-if="!checkVersionFlag && !systemdebugFlag" type="right" @click="closebtn()"></close-dialog>
    </div>

    <div class="work-dialog-aside-outer version-list-outer" v-if="checkVersionFlag">
      <div class="work-dialog-aside-inner">
        <div class="" style="color: #fff" v-if="!newVersionFlag">
          <div class="version-box">
            <div class="version-title">{{ toLang('currentVersion') }}</div>
            <div class="version-list-box">
              <div class="version-list" v-for="(item, index) in versionList">
                <div class="version-name">{{ item.type }}</div>
                <div class="version-num">{{ item.version }}</div>
              </div>
            </div>
            <div class="version-new-btn" @click="newversion()" v-if="hasNewVersion">
              {{ toLang('view') + toLang('newVersion') }}
            </div>
          </div>
        </div>
        <div class="new-version-box" v-if="newVersionFlag">
          <div class="new-version-title">
            <span class="new-version-title-text">{{ toLang('newVersion') }}</span>
            <div class="new-version-title-texticon">40M</div>
          </div>
          <div class="update-version-text">{{ toLang('updateLog') }}</div>
          <div class="new-version-list-box">
            <div class="new-version-list" v-for="item in newVersionList">
              <div class="new-version-list-title">
                <span class="new-version-list-name">{{ item.name }}</span>
                <span class="new-version-list-num">{{ item.num }}</span>
              </div>
              <div class="new-version-list-detail" v-for="detail in item.context">
                <div class="new-version-list-detail-text">{{ detail }}</div>
              </div>
            </div>
          </div>
          <div class="version-install-btn" @click.stop="installbtn()">
            {{ toLang('experience') + toLang('newVersion') }}
          </div>
          <div class="install-state-des-list-box">
            <div class="install-state-des-list" v-for="list in statedeslist">
              <img :src="list.icon" class="install-state-des-icon" />
              <div class="install-state-des-text">
                {{ list.text }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <close-dialog type="right" class="aside-close-btn" @click="closeMainAsideBtn()"></close-dialog>
    </div>

    <div class="work-dialog-aside-outer" v-if="systemdebugFlag">
      <div class="work-dialog-aside-inner">
        <div class="" style="color: #fff">
          <div class="version-box">
            <div class="version-title">{{ toLang('systemDebugging') }}</div>
            <div class="version-title">{{ toLang('noteWarning') }}</div>
            <button-dialog @click="clearLocalStrage">清除缓存</button-dialog>
          </div>
        </div>
      </div>
      <div class="aside-close-btn" @click="closeSecondAsideBtn()"></div>
      <close-dialog type="right" class="aside-close-btn" @click="closeSecondAsideBtn()"></close-dialog>
    </div>
  </div>
</template>

<script>
  import closeDialog from '@/components/dialog/closeButton.vue';
  import axios from 'axios';
  import { sendMsgToBackend, sendSocket, speak } from '@/utils/utils';
  import { ADOPT, SOIL, CURRENCY } from '@/constant/index';

  export default {
    name: 'settingPage',
    components: {
      closeDialog,
    },
    props: {
      warn: {
        type: Boolean,
        default: false,
      },
      currencyTerminal: {
        type: Boolean,
        default: false,
      },
      versionList: {
        type: Array,
        default: [],
      },
      messagelist: {
        type: Array,
        default: [],
      },
    },
    data() {
      return {
        ADOPT,
        SOIL,
        CURRENCY,
        retrogradWarning: false,
        voiceWarning: false,
        systemdebugFlag: false,
        asideCloseicon: '/assets/images/closeicon.png',
        progressList: [
          {
            text: this.toLang('brightness'),
            percent: this.$store.state.brightness,
          },
          {
            text: this.toLang('volume'),
            percent: this.$store.state.volume,
          },
        ],
        checkoutInfo: {
          isShowEle: true,
          checked: false,
        },
        newVersionList: [
          {
            name: 'ICU',
            num: 'V02.02.00.01',
            context: ['增加文案增加文案增加文案增加文案增加文案', '优化文案修复文案', '修复文案修复文案'],
          },
          {
            name: 'CGU',
            num: 'V02.02.00.01',
            context: ['增加文案增加文案增加文案增加文案增加文案', '优化文案修复文案', '修复文案修复文案'],
          },
          {
            name: 'CGU',
            num: 'V02.02.00.01',
            context: ['增加文案增加文案增加文案增加文案增加文案', '优化文案修复文案', '修复文案修复文案'],
          },
          {
            name: 'CGU',
            num: 'V02.02.00.01',
            context: ['增加文案增加文案增加文案增加文案增加文案', '优化文案修复文案', '修复文案修复文案'],
          },
          {
            name: 'CGU',
            num: 'V02.02.00.01',
            context: ['增加文案增加文案增加文案增加文案增加文案', '优化文案修复文案', '修复文案修复文案'],
          },
        ],
        statedeslist: [
          {
            icon: '/assets/images/assetsSuccess.png',
            text: '档位为P档',
          },
          {
            icon: '/assets/images/assetsFault.png',
            text: '无调度任务',
          },
        ],
        hasNewVersion: false,
        newVersionFlag: false,
        checkVersionFlag: false,
        gridLine: false,
        fullscreenText: '全屏',
      };
    },
    computed: {},

    created() {
      this.gridLine = this.$store.state.excavator.showGridLine;

      // uni.getScreenBrightness({
      //   success: function (res) {
      //     console.log('屏幕亮度值：' + res.value);
      //   },
      // });

      this.voiceWarning = Boolean(Number(localStorage.getItem('switchVoiceWarning') || 0));
      this.retrogradWarning = Boolean(Number(localStorage.getItem('switchRetrogradWarning') || 0));
    },

    methods: {
      setFullScreen() {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          this.fullscreenText = '全屏';
        } else {
          document.documentElement.requestFullscreen();
          this.fullscreenText = '退出全屏';
        }

        // 退出全屏
      },
      reloadFn() {
        window.location.reload();
      },
      clearLocalStrage() {
        localStorage.clear();
      },
      debugging() {
        this.systemdebugFlag = true;
        this.checkVersionFlag = false;
        this.newVersionFlag = false;
      },
      //change方法
      switchChange(e) {
        this.checkoutInfo.checked = !this.checkoutInfo.checked;
      },
      handleClick(e) {
        console.log(e.checked);
      },
      currentVersion() {
        // console.log('当前版本');
        this.checkVersionFlag = true;
        this.systemdebugFlag = false;
        // this.socket.send(JSON.stringify({
        // 	"type": "registerClient",
        // 	"name": "hmi"
        // }))
        this.socket.send(
          JSON.stringify({
            type: 'ReqVersion',
          })
        );
      },
      newversion() {
        this.newVersionFlag = true;
      },
      closebtn() {
        this.$emit('close');
        this.$bus.$emit('exitGather');
        this.$bus.$emit('resetBtnClickIndex');
      },
      closeMainAsideBtn() {
        this.checkVersionFlag = false;
        this.newVersionFlag = false;
      },
      closeSecondAsideBtn() {
        console.log(11111);
        this.systemdebugFlag = false;
      },

      decrease(list, index) {
        if (list.percent >= 10) {
          list.percent -= 10;
          if (index == 0) {
            if (list.percent < 10) {
              list.percent = 10;
              return this.$toast('亮度已降到最低');
            }
            this.$store.commit('setBrightness', list.percent);
            axios.get(`http://127.0.0.1:3333?val=${list.percent / 100}`).then(res => {});
          }
          if (index == 1) {
            this.$store.commit('setVolume', list.percent);
            sendSocket({
              type: 'VoicePlayVolume',
              volume: list.percent,
            });
          }
        } else {
          list.percent = 0;
          this.$toast(list.text + '已降到最低');
        }
      },
      increase(list, index) {
        if (list.percent <= 90) {
          list.percent += 10;
          if (index == 0) {
            this.$store.commit('setBrightness', list.percent);
            axios.get(`http://127.0.0.1:3333?val=${list.percent / 100}`);
          }
          if (index == 1) {
            this.$store.commit('setVolume', list.percent);
            sendSocket({
              type: 'VoicePlayVolume',
              volume: list.percent,
            });
          }
        } else {
          list.percent = 100;
          this.$toast(list.text + '已调到最高');
        }
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
      // 车道偏离
      switchRetrogradWarningChange(e) {
        const checked = e.value;
        localStorage.setItem('switchRetrogradWarning', Number(checked));
        this.$store.commit('setMessageList', `车辆偏离和逆行告警${checked ? '开启' : '关闭'}`);
        sendMsgToBackend(`车辆偏离和逆行告警${checked ? '开启' : '关闭'}`);

        // speak(`车道偏离和逆行告警${checked ? '开启' : '关闭'}`, 6);
      },

      // 网格线
      switchGridLine(val) {
        this.$store.commit('excavator/setGridLine', val.value);
        this.$bus.$emit('switchGridLine', val.value);
      },
    },
  };
</script>
