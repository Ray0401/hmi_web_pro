<template>
  <div class="iframe-box" @click="closebtn">
    <iframe frameborder="0" width="100%" height="100%" src="http://192.168.30.125:9999/screenMap"></iframe>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss">
  .iframe-box {
    position: absolute;
    z-index: 0;
    width: 100vw;
    height: 100vh;
    iframe {
      width: 100vw;
      height: 100vh;
      display: block;
    }
  }
</style>
