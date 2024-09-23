<template>
  <div :class="`scroll-box ${'scroll-box-' + random}`">
    <div class="text">{{ text }}</div>
    <div :class="`scroll-content ${'scroll-content-' + random}`">{{ text }}</div>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted, nextTick } from 'vue';
  let props = defineProps({
    text: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '100px',
    },
  });

  const left = ref('0px');
  const time = ref(2);
  function randomPassword(size) {
    let str = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnpQrstuvwxyz23456789'; //数组
    let len = str.length; //数组长度
    let createPassword = '';
    for (let i = 0; i < size; i++) {
      let j = Math.floor(Math.random() * len);
      createPassword += str[j];
    }
    return createPassword;
  }
  const random = ref(randomPassword(5));

  onMounted(() => {
    scroll();
  });
  watch(
    () => props.text,
    () => {
      scroll();
    },
    { deep: true }
  );
  function scroll() {
    nextTick(() => {
      let swidth = document.querySelector(`.scroll-content-${random.value}`)?.offsetWidth;
      let pwidth = document.querySelector(`.scroll-box-${random.value}`)?.offsetWidth;
      if (swidth > pwidth) {
        let w = swidth - pwidth;
        left.value = -w + 'px';
        time.value = Math.ceil(w / 50) + 1 + 's';
      } else {
        left.value = '0px';
        time.value = '0s';
      }
      // left.value = swidth > pwidth ? `${-(swidth - pwidth)}px` : '0px';
    });
  }
</script>

<style lang="scss" scoped>
  @keyframes scroll {
    0% {
      left: 0px;
    }
    75% {
      left: v-bind(left);
    }
    100% {
      left: v-bind(left);
    }
  }
  .scroll-box {
    width: 100%;
    overflow: hidden;
    display: flex;
    position: relative;
    align-items: center;
    height: 100%;
    font-size: 20px;
    .text {
      visibility: hidden;
      height: 1px;
    }
    .scroll-content {
      color: #fff;
      white-space: nowrap;
      position: absolute;
      left: 0;
      // animation: scroll 3s linear infinite;
      animation-duration: v-bind(time);
      animation-timing-function: linear;
      animation-delay: 0s;
      animation-iteration-count: infinite;
      animation-direction: normal;
      animation-fill-mode: none;
      animation-play-state: running;
      animation-name: scroll;
    }
  }
</style>
