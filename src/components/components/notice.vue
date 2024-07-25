<style scoped lang="scss">
  .notice-box {
    width: 189px;
    height: 80px;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5), 0px 2px 2px 0px rgba(8, 255, 252, 0.27) inset,
      0px 0px 4px 0px rgba(59, 122, 167, 0.42) inset;
    position: fixed;
    top: 49px;
    right: 9px;
    z-index: 999;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 0;
    .title {
      font-size: 16px;
      color: #70a7b3;
    }
    .content {
      color: #fff;
      font-size: 20px;
    }

    clip-path: polygon(
      0 10px,
      10px 0,
      calc(100% - 10px) 0,
      100% 10px,
      100% calc(100% - 10px),
      calc(100% - 10px) 100%,
      10px 100%,
      0 calc(100% - 10px)
    );

    background: linear-gradient(135deg, rgba(8, 255, 252, 0.27) 8px, rgba(59, 122, 167, 0.05) 0) top left,
      linear-gradient(-135deg, rgba(8, 255, 252, 0.57) 8px, rgba(59, 122, 167, 0.05) 0) top right,
      linear-gradient(45deg, rgba(8, 255, 252, 0.07) 8px, rgba(59, 122, 167, 0.05) 0) bottom left,
      linear-gradient(-45deg, rgba(8, 255, 252, 0.27) 8px, rgba(59, 122, 167, 0.05) 0) bottom right;
    background-size: 50% 50%;
    background-repeat: no-repeat;
  }
</style>

<template>
  <div class="notice-box">
    <span class="title">清理任务</span>
    <span class="content">清理排土块1</span>
  </div>
</template>

<script>
  export default {
    components: {},
    props: {},
    data() {
      return {};
    },
    mounted() {},
    methods: {},
    computed: {},
  };
</script>
