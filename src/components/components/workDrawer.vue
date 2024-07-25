<style scoped lang="scss">
  @keyframes RIGHT {
    from {
      transform: translateX(100%);
    }
  }
  @keyframes LEFT {
    from {
      transform: translateX(-100%);
    }
  }
  .m-drawer {
    position: fixed;
    top: 50px;
    bottom: 130px;
    z-index: 999;
    display: flex;

    .close-img {
      width: 45px;
      height: 50px;
      margin-top: 14px;
      cursor: pointer;
    }

    .content {
      height: 100%;
      color: #70a7b3;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    &.left {
      animation: LEFT 300ms;
      &.mt {
        top: 120px;
      }

      left: 15px;
      flex-direction: row-reverse;

      .close-img {
        transform: rotate(180deg);
      }
      .content {
        width: 340px;
        height: 518px;
        padding: 29px 33px 22px 31px;
        background: url('../../assets/images/bulldozer/mainSlideLeft.png') 100% / cover no-repeat;
      }
    }

    &.right {
      right: 0;
      animation: RIGHT 300ms;
      .content {
        width: 352px;
        padding: 20px 10px 22px 20px;
        background: url('../../assets/images/bulldozer/mainSlideRight.png') top left / cover no-repeat;
      }
    }
  }
</style>

<template>
  <div :class="`m-drawer ${direction} ${isIcon && 'mt'}`" v-if="visible">
    <!-- 关闭按钮 -->
    <img src="../../assets/images/close.png" class="close-img" @click="handleClose" />
    <!-- 内容 -->
    <div class="content">
      <!-- 插槽 -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
  const $emits = defineEmits(['closeDrawer']);
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      default: 'right',
    },
    isIcon: {
      type: Boolean,
      default: true,
    },
  });
  const handleClose = () => {
    $emits('closeDrawer');
  };
</script>
