<style scoped lang="scss">
  .sleep-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-weight: bold;
    background: url('../../static/images/sleep_bg.png') center/cover no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    .sleep-tips {
      line-height: 1;
      .tip-1 {
        font-size: 60px;
        color: #26738f;
        text-align: center;
        margin-bottom: 34px;
      }
      .tip-2 {
        text-align: center;
        font-size: 20px;
        color: #26738f;
      }
    }
  }
</style>

<template>
  <div class="sleep-box">
    <div class="sleep-tips">
      <div class="tip-1">地图休眠中</div>
      <div class="tip-2">切人工后恢复</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sleep',
    props: {},
    data() {
      return {};
    },
    created() {},
  };
</script>
