<template>
  <div class="load-content">
    <img class="imgs" src="@/assets/images/loadlogo.png" />
  </div>
</template>
<script>
  export default {
    name: 'load',
    props: {},
    methods: {},
  };
</script>

<style lang="scss">
  .load-content {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #141a29;
    .imgs {
      width: 517px;
      height: 153px;
    }
  }
</style>
