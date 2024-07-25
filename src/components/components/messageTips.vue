<template>
  <div class="message-tips">
    <div class="message-tips-list" v-for="item in tipscontentlist">
      <div class="message-tips-title">{{ item.title }}</div>
      <div class="message-tips-content" v-html="item.content"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'messageTips',
    created() {
      this.$bus.$on('stopReason', data => {
        // debugger
        // console.log(data)

        if (data == '') {
          this.tipscontentlist[0].content = '----';
        } else {
          this.tipscontentlist[0].content = data;
        }
      });
      this.$bus.$on('task', data => {
        // debugger
        if (data == '') {
          this.tipscontentlist[1].content = '----';
        } else {
          this.tipscontentlist[1].content = data;
        }
      });
    },
    data() {
      return {
        tipscontentlist: [
          {
            title: this.toLang('parkingReason'),
            content: '----',
          },
          {
            title: this.toLang('workFlow'),
            content: '----',
          },
        ],
      };
    },
    methods: {},
  };
</script>

<style lang="scss">
  .message-tips {
    position: absolute;
    top: 50px;
    right: 15px;
    display: flex;
    align-items: flex-start;

    .message-tips-list {
      background-image: url('@/assets/images/messagetipsbg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 18px 19px;
      margin-right: 12px;

      .message-tips-title {
        font-size: 16px;
        font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
        font-weight: 400;
        text-align: center;
        color: #70a7b3;
      }

      .message-tips-content {
        font-size: 20px;
        font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
        font-weight: 500;
        text-align: center;
        color: #ffffff;
        margin-top: 10px;
      }
    }

    .message-tips-list:last-child {
      margin-right: 0;
    }
  }
</style>
