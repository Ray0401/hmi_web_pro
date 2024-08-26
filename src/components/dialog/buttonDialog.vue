<template>
  <div
    @click.stop="handleClick"
    :class="[
      // 此步为重要的步骤，主要是控制class来控制显示不同的按钮样式
      type ? 'ice-button--' + type : '',
      disabled ? 'button_disabled' : '',
      'button_init',
    ]"
  >
    <span class="button-text-style" v-if="$slots.default">
      <slot></slot>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'buttonDialog',
    props: {
      // type来定义button的类型
      type: {
        type: String,
        default: 'orange', //有三种 orange ren grey
      },
      // 按钮是否失禁
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    computed: {},
    methods: {
      handleClick(evt) {
        this.$emit('click');
      },
    },
  };
</script>
<style lang="scss" scoped>
  /* base */
  .button_init {
    display: inline-block;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 167px;
    height: 47px;
    font-size: 12px;
    position: relative;
    cursor: pointer;
  }

  .ice-button--orange {
    background-image: url('@/assets/images/orangeButton.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .ice-button--red {
    background-image: url('@/assets/images/redButton.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .ice-button--grey {
    background-image: url('@/assets/images/greyButton.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .button-text-style {
    font-size: 19px;
    font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
    font-weight: 500;
    text-align: left;
    color: #ffffff;
  }

  .button_disabled {
    opacity: 0.3;
  }
</style>
