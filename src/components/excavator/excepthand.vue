<template>
  <Modal @warpClick="cancelchangebtn">
    <div class="box">
      <div class="title">
        <span>{{ title }}</span>
      </div>
      <div class="content">
        <div
          v-for="item in reasonList"
          :class="`reasonList ${item.value == reasonListValue.value && 'radio-span-active'} ${
            isEN && 'reasonList-en'
          } ${item.value == 3 && !(isDriveAway || ispointEmpty) && 'radio-span-none'}`"
          @click="changebreakvalue(item)"
          :key="item.value"
        >
          <span class="text">{{ toLang(item.text) }}</span>
        </div>
      </div>
      <div class="btn">
        <button-dialog type="orange" @click="confirmchangebtn" class="bottombutton">{{ confirmtext }}</button-dialog>
        <button-dialog type="red" @click="cancelchangebtn">{{ canceltext }}</button-dialog>
      </div>
    </div>
  </Modal>
</template>

<script>
  import { sendMsgToBackend } from '@/utils/utils';
  import { reasonList } from './data.js';
  export default {
    name: 'excepthand',
    data() {
      return {
        confirmtext: this.toLang('confirm'),
        canceltext: this.toLang('cancel'),
        title: this.toLang('exceptionHandling'),
        reasonListValue: {},
        reasonList,
      };
    },
    props: {
      pointItem: {
        type: Object,
        default: () => {},
      },
    },
    computed: {
      ispointEmpty() {
        return Object.keys(this.pointItem).length != 0 && this.pointItem.imei && this.pointItem.from != '8b01';
      },
      isDriveAway() {
        return (
          this.pointItem.task == '装载中' &&
          this.$store.state.excavator.middleclickindex[Number(this.pointItem.stop_num)] != 3
        );
      },
    },
    methods: {
      changebreakvalue(res) {
        this.reasonListValue = res;
      },
      confirmchangebtn() {
        if (!this.reasonListValue.text) return this.$toast.warning('请选择');
        let obj = {
          type: 'ExcavatorCmd',
          truckName: this.pointItem.name || this.pointItem?.child_point?.name || '',
          truckImei: this.pointItem.imei || this.pointItem?.child_point?.imei || '',
          task: 0x01, //0x00：未知作业,0x01：装载作业,0x02卸载作业
          cmd: this.reasonListValue.type ? 0x01 : this.reasonListValue.value,
          loadStatus: this.reasonListValue.type ? this.reasonListValue.value : 0x01,
          index: 0x01,
        };
        if ([1, 3].includes(this.reasonListValue.value))
          this.$store.commit('excavator/setMiddleClickIndex', {
            value: this.reasonListValue.value == 1 ? null : 3,
            index: this.pointItem.stop_num,
          });
        this.$store.commit('setMessageList', `${this.toLang(this.reasonListValue.text)}已发送`);
        sendMsgToBackend(`${this.toLang(this.reasonListValue.text)}已发送`);
        this.socket.send(JSON.stringify(obj));
        this.cancelchangebtn();
      },
      cancelchangebtn() {
        this.$emit('exceptcancel');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .box {
    width: 480px;
    height: 330px;
    background-image: url('../../assets/images/messagebg.png');
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .title {
      display: flex;
      justify-content: center;
      font-size: 28px;
      font-family: PingFang SC Regular, PingFang SC Regular-Regular;
      font-weight: 400;
      text-align: center;
      color: #70a7b3;
      margin-top: 30px;
      margin-bottom: 20px;
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;
      padding: 0 80px;
      margin-bottom: 20px;
      .reasonList {
        width: 130px;
        height: 30px;
        background: rgba(255, 91, 0, 0.2);
        text-align: center;
        margin-bottom: 8px;
        color: rgba(242, 242, 242, 1);
        border: rgba(69, 85, 106, 1) solid 2px;
        padding: 8px 0;
        background-color: rgba(0, 0, 0, 0);
        margin-right: 50px;
        margin-bottom: 20px;
        font-size: 20px;
        font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
        font-weight: 500;
        color: #f2f2f2;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        pointer-events: inherit;
        opacity: 1;
        &:nth-child(2n) {
          margin-right: 0px;
        }
      }
      .reasonList-en {
        .text {
          font-size: 16px;
        }
      }
      .radio-span-none {
        pointer-events: none;
        opacity: 0.3;
      }
      /*按钮选中样式*/
      .radio-span-active {
        cursor: pointer;
        color: #f2f2f2;
        background-color: rgba(255, 91, 0, 0.2);
        border: 2px solid rgba(255, 91, 0, 0.2);
      }
    }
    .btn {
      display: flex;
      justify-content: center;
      .bottombutton {
        margin-right: 20px;
      }
    }
  }
</style>
