<template>
  <div class="icon-list-wrap">
    <slot></slot>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';
</script>

<style scoped lang="scss">
  @keyframes LEFT {
    from {
      transform: translateX(-100%);
    }
  }
  .icon-list-wrap {
    position: fixed;
    top: 50px;
    left: 15px;
    z-index: 100;
    animation: LEFT 300ms;

    .icon-item {
      width: 60px;
      height: 60px;
    }
  }
</style>
