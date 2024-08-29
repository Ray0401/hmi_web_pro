<script setup>
  import { setHTMLFontSize } from './utils/utils';
  setHTMLFontSize(); // 设置根元素字体大小
</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss">
  html {
    background: url('./assets/images/loadlogo.png') 100% 100% / cover no-repeat;
  }

  .work-dialog-outer {
    width: 350px;
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: 99;
    left: inherit;
    right: 0;
    top: 50px;
    bottom: 130px;
    background: url('./assets/images/mainSlideRight.png') left top / cover no-repeat;
    padding: 10px 0 10px 10px;
    box-sizing: border-box;
    animation: RToI 300ms;
    background-size: 100% 100%;

    .close-btn {
      position: absolute;
      right: 100%;
      top: 17px;
    }
    .work-dialog-inner {
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      overflow-y: overlay;
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }

      .work-list-outer {
        margin-bottom: 10px;
        padding: 18px 20px;
        clip-path: polygon(
          0 9px,
          9px 0,
          calc(100% - 9px) 0,
          100% 9px,
          100% calc(100% - 9px),
          calc(100% - 9px) 100%,
          9px 100%,
          0 calc(100% - 9px)
        );
        background: linear-gradient(-45deg, #4c737c 6px, transparent 0) bottom right,
          linear-gradient(45deg, #4c737c 6px, transparent 0) bottom left,
          linear-gradient(135deg, #4c737c 6px, transparent 0) top left,
          linear-gradient(-135deg, #4c737c 6px, transparent 0) top right;

        box-shadow: 0px 2px 2px 0px rgba(8, 255, 252, 0.1) inset, 0px 0px 4px 0px rgba(60, 123, 167, 0.82) inset;
        background-repeat: no-repeat;
        border: solid 1px #4c737c;
        box-sizing: border-box;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    // 开
    .active {
      animation: opendoor 0.3s normal forwards;
    }

    @keyframes opendoor {
      from {
        width: 0;
      }

      to {
        //打开的抽屉宽度
        width: 500px;
      }
    }

    // 关
    .close {
      animation: close 0.3s normal backwards;
    }

    // close对应上方close类中animation属性的 close
    @keyframes close {
      0% {
        width: 500px;
      }

      100% {
        width: 0;
        opacity: 0;
      }
    }
  }

  // 点击右下角按钮,右侧弹窗公共样式
  .work-dialog-aside-outer {
    position: absolute;
    top: 64px;
    width: 260px;
    right: 350px;
    bottom: 144px;
    background: url('./assets/images/secondSlide.png') top left / cover no-repeat;
    box-sizing: border-box;
    animation: RToI 300ms;

    .aside-close-btn {
      position: absolute;
      right: 100%;
      top: 0;
    }

    .work-dialog-aside-inner {
      padding: 20px 18px 25px 20px;
      box-sizing: border-box;
      height: 100%;
      .content-box {
        width: 100%;
        height: 100%;
        position: relative;

        .select-btn {
          width: 100%;
          position: absolute;
          bottom: 0px;
        }

        .detail-title {
          font-size: 20px;
          font-family: Source Han Sans CN Medium, Source Han Sans CN Medium-Medium;
          font-weight: 500;
          text-align: left;
          color: #70a7b3;
          margin-bottom: 20px;
          box-sizing: border-box;
        }
      }
    }
  }

  .m-border {
    padding: 19px 20px;
    clip-path: polygon(
      0 9px,
      9px 0,
      calc(100% - 9px) 0,
      100% 9px,
      100% calc(100% - 9px),
      calc(100% - 9px) 100%,
      9px 100%,
      0 calc(100% - 9px)
    );
    background: linear-gradient(-45deg, #4c737c 6px, transparent 0) bottom right,
      linear-gradient(45deg, #4c737c 6px, transparent 0) bottom left,
      linear-gradient(135deg, #4c737c 6px, transparent 0) top left,
      linear-gradient(-135deg, #4c737c 6px, transparent 0) top right;
    box-shadow: 0px 2px 2px 0px rgba(8, 255, 252, 0.1) inset, 0px 0px 4px 0px rgba(60, 123, 167, 0.82) inset;
    background-repeat: no-repeat;
    border: solid 1px #4c737c;
    box-sizing: border-box;
  }

  @keyframes ROTATEY {
    0% {
      transform: rotateZ(360deg);
    }
    100% {
      transform: rotateZ(0deg);
    }
  }

  .load-img {
    width: 60px;
    height: 60px;
    margin-top: 30px;
    animation: ROTATEY 1s linear infinite;
  }

  .vue-scroll-picker {
    // width: 110px;
    flex: 1;
    margin-left: 21px;
    color: #fff;

    .vue-scroll-picker-list {
      left: 12px;
      top: 26px;
    }

    .vue-scroll-picker-item {
      opacity: 0.5;
      height: 80px;
      // line-height: 60px;
      font-size: 32px;
    }

    .vue-scroll-picker-layer {
      .top,
      .bottom {
        background: none;
        border-top: none;
        border-bottom: none;
      }
    }
  }
</style>
