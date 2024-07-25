<template>
  <div class="work-dialog-outer">
    <div class="work-dialog-inner">
      <div
        class="work-list-outer"
        :class="item.showFlag == false ? 'corners1' : 'corners2'"
        @click="updownopt(item)"
        v-for="(item, index) in messageList"
        :key="index"
      >
        <div class="work-list-title">
          {{ item.title }}
        </div>
        <div class="fault-information-box" v-if="item.showFlag">
          <div class="fault-information-list" v-for="(list, inde) in item.content" :key="inde">
            <img :src="list.icon" class="fault-information-icon" />

            <span class="fault-information-text">{{ list.text }}</span>
          </div>
        </div>
        <button-dialog class="btn-box" @click="clearfault()" v-if="index == 0 && item.showFlag">
          {{ toLang('deleteFault') }}
        </button-dialog>
      </div>
    </div>
    <div class="close-btn" @click="closebtn"></div>
  </div>
</template>

<script>
  export default {
    name: 'messageDialog',
    props: {
      messageList: {
        type: Array,
        default: [],
      },
    },
    data() {
      return {};
    },
    methods: {
      // 故障清除
      clearfault() {
        this.$emit('clearFault');
        this.socket.send(
          JSON.stringify({
            type: 'ClearFault',
          })
        );
      },
      updownopt(item) {
        if (item.showFlag == false) {
          for (let i = 0; i < this.messageList.length; i++) {
            this.messageList[i].showFlag = false;
          }
          item.showFlag = true;
        }
      },
      closebtn() {
        this.$emit('close');
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';
  @keyframes leftShow {
    0% {
      transform: translateX(-100%);
    }
  }
  .work-dialog-outer {
    width: 340px;
    position: absolute;
    left: 15px;
    top: 120px;
    bottom: 130px;
    box-sizing: border-box;
    background: url('@/assets/images/popupBack.png') no-repeat;
    background-size: 100% 100%;
    padding: 0;
    animation: leftShow 500ms ease;
    .close-btn {
      background-image: url('@/assets/images/closeLeft.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: 100%;
      top: 20px;
      width: 42px;
      height: 47px;
    }
    .work-dialog-inner {
      width: 100%;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;

      .work-list-outer {
        margin-bottom: 10px;
        padding: 18px 15px;
        clip-path: polygon(
          0 9px,
          9px 0,
          calc(100% - 9px) 0,
          100% 9px,
          100% calc(100% - 9px),
          calc(100% - 9px) 100%,
          9px 100%,
          0 calc(100% - 9px)
        );
        background: linear-gradient(-45deg, #4c737c 6px, transparent 0) bottom right,
          linear-gradient(45deg, #4c737c 6px, transparent 0) bottom left,
          linear-gradient(135deg, #4c737c 6px, transparent 0) top left,
          linear-gradient(-135deg, #4c737c 6px, transparent 0) top right;
        box-shadow: 0px 2px 2px 0px rgba(8, 255, 252, 0.1) inset, 0px 0px 4px 0px rgba(60, 123, 167, 0.82) inset;
        background-repeat: no-repeat;
        border: solid 1px #4c737c;
        box-sizing: border-box;

        .work-list-title {
          color: #70a7b3;
          font-size: 16px;
          font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
          font-weight: 500;
          text-align: left;
        }

        .work-list-detail {
          width: 100%;
          padding: 15px 0;
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
              .work-list-icon {
                width: 70px;
                height: 70px;
              }
              .work-list-text {
                font-size: 16px;
                margin-top: 10px;
                font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
                font-weight: 500;
                text-align: left;
                color: #f2f2f2;
              }
            }
          }
        }
      }
      .corners1 {
        flex-shrink: 0;
      }
      .corners2 {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 0;
      }
    }

    .fault-information-box {
      flex: 1;
      overflow-y: scroll;
      .fault-information-list {
        display: flex;
        padding: 10px;
        box-sizing: border-box;
        .fault-information-icon {
          width: 18px;
          height: 16px;
          margin-right: 13px;
          flex-shrink: 0;
        }
        .fault-information-text {
          font-size: 16px;
          font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
          font-weight: 500;
          text-align: left;
          color: #ffffff;
          word-break: break-all;
        }
      }
    }
    .fault-information-box::-webkit-scrollbar {
      display: none;
    }
    .btn-box {
      width: 100%;
      margin-top: 45px;
      .btntext {
        font-size: 18px;
        font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }
</style>
