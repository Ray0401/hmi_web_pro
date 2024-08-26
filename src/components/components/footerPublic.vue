<template>
  <div class="footer-public-content">
    <img src="../../assets/images/leftBelowLine.png" class="left-below-line" />
    <img src="../../assets/images/leftCorner.png" class="left-below-line left-corner" />
    <img src="../../assets/images/leftBelowLine.png" class="right-below-line" />
    <img src="../../assets/images/leftCorner.png" class="right-below-line right-corner" />
  </div>
</template>
<script>
  export default {
    name: 'footerPublic',
    props: {},
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .footer-public-content {
    .left-below-line {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 50%;
      height: 20px;
    }
    .left-corner {
      width: 60px;
      height: 40px;
    }
    .right-below-line {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 70%;
      height: 20px;
    }
    .right-corner {
      width: 60px;
      height: 40px;
      transform: rotateY(180deg);
    }
  }
</style>
