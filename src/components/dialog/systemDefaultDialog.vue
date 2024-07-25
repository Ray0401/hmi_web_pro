<!--组件说明：
系统警告弹框组件
props:
level——故障等级 可传 1,2,3
$emit
confirm  1，2等级点击确认
close 关闭按钮
  -->
<template>
  <Modal>
    <div :class="`failure-degree ${defaultList.blink && 'failure3-degree'}`">
      <div v-if="!defaultList.defaulttitle" class="title">
        <span>{{ defaultList.defaulttitle }}</span>
      </div>
      <div class="degree-desc" v-if="!defaultList.blink">
        <img :src="degreedata1.icon" class="degree-icon" />
        <!-- <img :src="degreedata2.icon"  class="degree-icon" v-else-if="level==2" /> -->
        <!-- <span class="degree-text">{{degreedata1.text}}</span> -->
        <span class="degree-text">{{ defaultList.defaultcontent }}</span>
      </div>
      <div class="degree-desc" v-else>
        <img :src="degreedata3.icon" class="degree3-icon" />
        <!-- <div class="degree3-text">{{degreedata3.text}}</div> -->
        <div class="degree3-text">{{ defaultList.defaultcontent }}</div>
      </div>
      <div class="degree-btn">
        <button-dialog type="orange" @click="confirmbtn" v-if="defaultList.okButton">确定</button-dialog>
      </div>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'failureDegree',
    props: {
      level: {
        type: Number,
        default: 1,
      },
      defaulttitle: {
        type: String,
        default: '',
      },
      defaultList: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        degreedata1: {
          icon: '/assets/images/alarm1.png',
          text: '系统故障请注意',
        },
        degreedata2: {
          icon: '/assets/images/alarm2.png',
          text: '系统故障请注意',
        },
        degreedata3: {
          icon: '/assets/images/alarm3.png',
          text: '系统故障，请求人工接管',
        },
      };
    },
    onLoad() {},
    methods: {
      confirmbtn() {
        this.$emit('confirm');
      },
      closebtn(event) {
        let event1 = event.currentTarget.dataset;
        let event2 = event.target.dataset;
        if (JSON.stringify(event1) == JSON.stringify(event2)) {
          // this.$emit('close');
        }
      },
    },
  };
</script>

<style lang="scss">
  .mask-box {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
  }

  .title {
    font-size: 24px;
    font-family: PingFang SC Regular, PingFang SC Regular-Regular;
    font-weight: 400;
    text-align: center;
    color: #f2f2f2;
    margin-bottom: 20px;
  }

  .failure-degree {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: url('../../assets/images/messagebg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding: 37px 85px;
    box-sizing: border-box;
    text-align: center;
    .blink {
      border: 1px solid red;
    }

    .degree-desc {
      display: flex;
      align-items: center;

      .degree-icon {
        width: 42px;
        height: 38px;
        margin-right: 16px;
      }

      .degree-text {
        font-size: 24px;
        font-family: PingFang SC Regular, PingFang SC Regular-Regular;
        font-weight: 400;
        text-align: left;
        color: #f2f2f2;
      }
    }
    .degree-btn {
      margin-top: 38px;
      display: flex;
      justify-content: center;
    }
  }

  .failure3-degree {
    background-image: url('@/assets/images/alarmbg.png');
    text-align: center;
    padding: 25px 80px 55px 80px;
    .degree-desc {
      display: block;
    }
    .degree3-icon {
      width: 104px;
      height: 95px;
      margin-bottom: 18px;
    }

    .degree3-text {
      font-size: 24px;
      font-family: PingFang SC Regular, PingFang SC Regular-Regular;
      font-weight: 400;
      text-align: left;
      color: #f2f2f2;
    }
  }
</style>
