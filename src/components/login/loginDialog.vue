<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .work-dialog-inner {
    flex: 1;
    position: relative;
    .logged-in-content {
      width: 100%;
      height: 100%;

      .login-title {
        font-size: 24px;
        font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
        font-weight: 400;
        text-align: left;
        color: #70a7b3;
        padding: 7px 0;
      }

      .input-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .input-name {
          font-size: 16px;
          color: #f2f2f2;
          margin-right: 10px;
        }

        .input-box {
          width: 80%;
          height: 50px;
          padding-left: 10px;
          box-sizing: border-box;
          font-size: 16px;
          font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
          font-weight: 500;
          text-align: left;
          color: #f2f2f2;
          border: 2px solid #426068;
          background: transparent;
        }
      }

      .keyboard {
        display: flex;
        flex-wrap: wrap;
        padding: 20px;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        .keyboardimage {
          width: 70px;
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0.8;
          font-size: 30px;
          font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
          font-weight: 500;
          color: #70a7b3;
          box-sizing: border-box;
          margin-bottom: 20px;
          background: url('@/assets/images/numberClick.png') 100% / cover no-repeat;
          &:not(:nth-child(3n)) {
            margin-right: 31px;
          }
          &:last-child {
            background: url('@/assets/images/loginTap.png') 100% / cover no-repeat;
            font-size: 20px;
            font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
            color: #ffffff;
          }
          &:nth-last-child(3) {
            background: url('@/assets/images/loginTap.png') 100% / cover no-repeat;
            font-size: 20px;
            font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
            box-sizing: border-box;
            color: #ffffff;
          }
        }
      }

      .login-message-list {
        font-size: 28px;
        font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
        font-weight: 400;
        text-align: left;
        padding: 7px 0;

        .login-message-list-name {
          color: #70a7b3;
          margin-right: 12px;
        }

        .login-message-list-num {
          color: #ffffff;
        }
      }
    }

    .log-btn {
      width: 280px;
      height: 47px;
      text-align: center;
      box-sizing: border-box;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 30px;

      .button_init {
        width: 100%;
        height: 100%;
      }
    }
  }

  .work-dialog-inner::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
</style>

<template>
  <div class="work-dialog-outer">
    <div class="work-dialog-inner">
      <div class="logged-in-content">
        <div class="login-title">
          <span v-if="!loggedFlag">{{ toLang('login') }}</span>
          <span v-else>{{ toLang('user') }}</span>
        </div>
        <div class="" v-if="!loggedFlag">
          <div class="input-list">
            <span class="input-name">工号</span>
            <input
              type="text"
              class="input-box"
              id="user-name"
              v-model="userInfoList.userName"
              @change="usernamechange"
              @focus="usernamefocus"
              placeholder="请输入4位工号"
            />
          </div>
          <div class="input-list">
            <span class="input-name">{{ toLang('password') }}</span>
            <input
              class="input-box"
              v-model="userInfoList.passWord"
              password
              type="text"
              @blur="passwordblur"
              @change="passwordchange"
              @focus="passwordfocus"
              placeholder="请输入6位密码"
            />
          </div>
          <div class="keyboard">
            <div class="keyboardimage" v-for="item in keyboard" @click.stop="statebtn(item)">
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
        <div class="" v-else>
          <div class="login-message-list">
            <span class="login-message-list-name">设备编号</span>
            <span class="login-message-list-num">{{ devName }}</span>
          </div>
          <div class="login-message-list">
            <span class="login-message-list-name">司机姓名</span>
            <span class="login-message-list-num">{{ userInfoList.userName }}</span>
          </div>
          <div class="login-message-list">
            <span class="login-message-list-name">司机工号</span>
            <span class="login-message-list-num">{{ userInfoList.driveNum }}</span>
          </div>
          <div class="login-message-list">
            <span class="login-message-list-name">登录时间</span>
            <span class="login-message-list-num">{{ userInfoList.loginTime }}</span>
          </div>
        </div>
      </div>

      <div class="log-btn" v-if="loggedFlag">
        <button-dialog type="red" @click="logOut">{{ toLang('signOut') }}</button-dialog>
      </div>
    </div>
    <div v-if="!asideShowFlag">
      <close-dialog type="right" @click="closebtn()"></close-dialog>
    </div>
  </div>
</template>

<script>
  import { formatTime } from '@/utils/format.js';
  import closeDialog from '@/components/dialog/closeButton.vue';
  import { setLocalStorage, getLocalStorage } from '@/utils/utils';

  export default {
    name: 'loginDialog',
    components: {
      closeDialog,
    },
    data() {
      return {
        userInfoList: {
          equipmentNum: '',
          userName: '',
          driveNum: '',
          loginTime: '',
          passWord: '',
        },
        userflag: false,
        passflag: false,
        keyboardimage: '/static/images/numberClick.png',
        keyboard: ['1', '2', '3', '4', '5', '6', '7', '8', '9', this.toLang('delete'), '0', this.toLang('login')],
        loggedFlag: getLocalStorage('loggedFlag'),
        asideShowFlag: false,
      };
    },
    computed: {
      devName() {
        return this.$store.state.carInfo.devName;
      },
    },
    mounted() {
      if (getLocalStorage('userInfo')) {
        this.userInfoList = { ...this.userInfoList, ...getLocalStorage('userInfo') };
      }
      setTimeout(() => {
        const ele = document.querySelector('#user-name');
        ele && ele.focus();
      }, 700);

      this.$bus.$on('websocketMessage', data => {
        // 登录响应
        if (data.type === '8B10') {
          if (data.result == 1) {
            this.userInfoList.userName = data.name;
            this.userInfoList.loginTime = formatTime(null, 'minute');
            this.loggedFlag = true;
            setLocalStorage('loggedFlag', true);
            setLocalStorage('userInfo', JSON.stringify(this.userInfoList));
            this.$toast(this.toLang('loginSucceeded'));
          } else {
            this.$toast(this.toLang('loginFailed'));
          }
        }
        // 登出响应
        if (data.type == '8B11') {
          if (data.result == '1') {
            setLocalStorage('loggedFlag', false);
            setLocalStorage('userInfo', null);
            this.loggedFlag = false;
            this.userInfoList.userName = '';
            this.userInfoList.passWord = '';
            this.userInfoList.driveNum = '';
            this.$bus.$emit('resetLoadNum');
            this.$toast('已退出');
          } else {
            this.$toast('退出失败');
          }
        }
      });
    },
    methods: {
      logOut() {
        this.socket.send(
          JSON.stringify({
            type: '0F11',
          })
        );
      },
      closebtn() {
        this.$emit('close');
        this.$bus.$emit('exitGather');
        this.$bus.$emit('resetBtnClickIndex');
      },
      usernamefocus() {
        this.userflag = true;
        this.passflag = false;
      },
      passwordfocus() {
        this.passflag = true;
        this.userflag = false;
      },
      usernamechange() {
        this.statebtn();
      },
      passwordchange() {
        this.statebtn();
      },
      passwordblur() {
        this.passflag = false;
      },
      statebtn(item) {
        if (item == null) return;

        if (item !== this.toLang('delete') && item !== this.toLang('login')) {
          if (this.userflag && !this.passflag) {
            this.userInfoList.userName += item + '';
          } else {
            this.userInfoList.passWord += item + '';
          }
        }
        if (item == this.toLang('delete')) {
          if (this.userflag && !this.passflag) {
            this.userInfoList.userName = this.userInfoList.userName.substring(0, this.userInfoList.userName.length - 1);
          } else {
            this.userInfoList.passWord = this.userInfoList.passWord.substring(0, this.userInfoList.passWord.length - 1);
          }
        }

        if (item == this.toLang('login')) {
          if (this.userInfoList.userName.length !== 4) {
            this.$toast(this.toLang('ruleUserName'));
          } else if (this.userInfoList.passWord.length !== 6) {
            this.$toast(this.toLang('rulePassword'));
          } else if (this.userInfoList.userName !== '' && this.userInfoList.passWord !== '') {
            this.userInfoList.driveNum = this.userInfoList.userName;
            this.socket.send(
              JSON.stringify({
                type: '0F10',
                id: Number(this.userInfoList.driveNum),
                password: this.userInfoList.passWord,
              })
            );
          }
        }
      },
    },

    beforeDestroy() {
      // this.$bus.$off('websocketMessage');
    },
  };
</script>
