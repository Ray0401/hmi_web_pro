<template>
  <div class="m-switch-wrap">
    <div
      @click.stop="disabled ? e => e.preventDefault() : onSwitch()"
      :class="['m-switch', { 'switch-checked': checked, disabled: disabled }]"
    >
      <div :class="['u-switch-inner', checked ? 'inner-checked' : 'inner-unchecked']">
        {{ checked ? checkedInfo : uncheckedInfo }}
      </div>
      <div :class="['u-node', { 'node-checked': checked }]"></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Switcher',
    props: {
      defaultChecked: {
        // 初始是否选中
        type: Boolean,
        default: false,
      },
      checkedInfo: {
        // 选中时的内容
        type: [Number, String],
        default: null,
      },
      uncheckedInfo: {
        // 未选中时的内容
        type: [Number, String],
        default: null,
      },
      disabled: {
        // 是否禁用
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        checked: this.defaultChecked,
      };
    },
    methods: {
      onSwitch() {
        console.log('当前状态:', this.checked);
        this.$bus.$emit('switchChange', !this.checked);
      },
    },
  };
</script>
<style lang="scss" scoped>
  $themeColor: #ff5900;
  .m-switch-wrap {
    height: 36px;
    max-width: 70px;
    display: inline-block;
    .m-switch {
      position: relative;
      height: 36px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      // background: rgba(0, 0, 0, 0.25);
      background: #49585c;
      border-radius: 100px;
      cursor: pointer;
      transition: background 0.36s;
      .u-switch-inner {
        display: inline-block;
        color: #fff;
        font-size: 16px;
        line-height: 36px;
        padding: 0 8px;
        transition: all 0.36s;
      }
      .inner-checked {
        // margin-right: 18px;
        margin-left: 76px;
      }
      .inner-unchecked {
        margin-left: 76px;
      }
      .u-node {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 32px;
        height: 32px;
        background: #fff;
        border-radius: 100%;
        cursor: pointer;
        transition: all 0.36s;
      }
      .node-checked {
        // 结果等价于right: 2px; 为了滑动效果都以左边为基准进行偏移
        left: 100%;
        margin-left: -2px;
        transform: translateX(-100%);
      }
    }
    .switch-checked {
      background: $themeColor;
    }
    .disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }
  }
</style>
