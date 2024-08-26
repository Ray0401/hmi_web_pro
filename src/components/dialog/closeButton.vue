<template>
  <div
    @click="handleClick"
    :class="[
      // 此步为重要的步骤，主要是控制class来控制显示不同的按钮样式
      type ? 'close-button--' + type : '',
      'close_button_init',
    ]"
  ></div>
</template>

<script>
  export default {
    name: 'buttonDialog',
    // 使用prop自定义属性
    props: {
      // type来定义button的类型
      type: {
        type: String,
        default: 'right', //有三种 orange ren grey
      },
    },
    computed: {},
    methods: {
      handleClick(evt) {
        // console.log(evt)
        this.$emit('click');
      },
    },
  };
</script>
<style lang="scss" scoped>
  /* base */
  .close_button_init {
    width: 42px;
    height: 47px;
    display: inline-block;
    position: absolute;
    top: 18px;
  }

  .close-button--right {
    background-image: url(@/assets/images/close.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    left: -42px;
  }

  .close-button--left {
    background-image: url(@/assets/images/closeLeft.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
</style>
