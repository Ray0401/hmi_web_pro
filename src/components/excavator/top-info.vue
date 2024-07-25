<template>
  <div class="top-info-text">{{ text }}</div>
</template>
<script setup>
  import { defineProps } from 'vue';
  let props = defineProps({
    text: {
      type: String,
      default: '',
    },
  });
</script>

<style lang="scss" scoped>
  .top-info-text {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    font-size: 20px;
    font-weight: 500;
    color: #22f2ff;
    position: fixed;
    top: 50px;
    left: 50%;
    transform: translate(-50%, 0);
    background: rgba(9, 74, 78, 0.6);
  }
</style>
