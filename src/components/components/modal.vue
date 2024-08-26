<template>
  <div class="modal-warp" id="warp-modal" @click.stop="warpClick">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'modal',
    props: {},
    methods: {
      warpClick(event) {
        if (event.target.id != 'warp-modal') return;
        this.$emit('warpClick');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .modal-warp {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 10000;
  }
</style>
