<template>
  <div class="message-public">
    <div :class="`footermessagebox ${messagebox && 'footermessagebig'}`" @click="clickmessage">
      <div class="footer-message-list">
        <div class="footermessagelist" v-for="(item, index) in messagelist" :key="index">
          <span class="messagelisttime">{{ item.time }}</span>
          <span class="messagelisttext">{{ item.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'messagePublic',
    data() {
      return {
        messagebox: false,
      };
    },
    computed: {
      messagelist() {
        return this.$store.state.messagelist;
      },
    },
    methods: {
      clickmessage() {
        this.messagebox = !this.messagebox;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .message-public {
    .footermessagebox {
      width: 320px;
      min-width: 300px;
      height: 100px;
      overflow: hidden;
      margin-bottom: 20px;
      box-sizing: border-box;
      // background-image: url('~../../assets/images/messagebg.png');
      // background-repeat: no-repeat;
      // background-size: 100% 100%;
      border: 10px solid;
      border-image-source: url('../../assets/images/messagebg.png');
      border-image-slice: 50 10 95 20 fill;
      border-image-width: 20px 10px 30px;
      border-image-repeat: stretch;

      padding: 15px;
      box-sizing: border-box;
      flex-shrink: 0;
      .footer-message-list {
        overflow: hidden;
        height: 100%;
      }
      .footermessagelist {
        width: 100%;
        font-family: PingFang SC Regular, PingFang SC Regular-Regular;
        text-align: left;
        color: #f2f2f2;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        .messagelisttime {
          color: #70a7b3;
          margin-right: 10px;
          width: 62px;
        }
        .messagelisttext {
          flex: 1;
          color: #f2f2f2;
          padding-right: 10px;
          box-sizing: border-box;
        }
      }
    }
    .footermessagebig {
      height: 400px;
      .footer-message-list {
        overflow-y: scroll;
      }
    }
    .footer-message-list::-webkit-scrollbar {
      width: 10px;
    }
  }
</style>
