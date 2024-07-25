<template>
  <work-drawer direction="left" :visible="visible" @closeDrawer="closeDrawer">
    <div class="wrapper">
      <div class="title">清理排土块任务</div>
      <div class="info">
        <div class="row">
          <span class="label">作业区域</span>
          <span class="value">{{ soilTaskData?.DumpGroupName ?? '-' }}</span>
        </div>
        <div class="row">
          <span class="label">待清理排土块</span>
          <span class="value">{{ soilTaskData?.DumpNum ?? '-' }}</span>
        </div>
        <div class="row">
          <span class="label">任务状态</span>
          <span class="value status">{{ statusText }}</span>
        </div>
      </div>
      <div class="button">
        <m-button @click="handleClickButton" :disabled="state.disabled">
          {{ btnText }}
        </m-button>
      </div>
    </div>
  </work-drawer>
</template>

<script setup>
  import WorkDrawer from '@/components/components/workDrawer.vue';
  import Vue, { reactive, computed, onMounted } from 'vue';
  import { sendSocket } from '@/utils/utils';
  import { SOCKET_TYPE } from '@/constant';
  const props = defineProps({
    visible: {
      type: Boolean,
      default: true,
    },
    soilTaskData: {
      type: Object,
      default: () => {},
    },
  });

  const state = reactive({
    status: 1, //   1未开始  2进行中  3已结束  4任务申请失败
    disabled: false,
  });

  // 状态更换颜色对应改变
  const statusColor = computed(() => {
    return state.status == 2 ? '#00ff48' : '#FF7800';
  });

  // 当前状态文案信息
  const statusText = computed(() => {
    const o = {
      1: '未开始',
      2: '进行中',
      3: '已结束',
    };
    return o[state.status];
  });

  // 按钮文案信息
  const btnText = computed(() => {
    const o = {
      1: '开始任务',
      2: '结束任务',
    };
    return o[state.status];
  });

  const handleClickButton = () => {
    console.log('123');
    // 当前任务状态是未开始,则申请开始任务
    if (state.status == '1') {
      sendSocket({
        type: SOCKET_TYPE.CLEAN_DUMP_STATUS,
        map_id: props.soilTaskData.DumpGroupName,
        packGroupNum: props.soilTaskData.DumpNum,
        status: 2, //2申请开始任务
      });

      state.disabled = true;

      return;
    }
    // 当前任务状态是进行中,则申请结束任务
    if (state.status == '2') {
      // 显示是否更新排土线弹窗
      Vue.prototype.$bus.$emit('openCommonModal', 'update_soil_line');
    }
  };

  const $emit = defineEmits(['closeDrawer']);
  const closeDrawer = () => {
    $emit('closeDrawer');
  };

  onMounted(() => {
    Vue.prototype.$bus.$on('syncCleanStatus', data => {
      console.log('syncCleanStatus', data);
      const { status } = data || {};
      state.status = status;
      state.disabled = false;
    });
  });
</script>

<style scoped lang="scss">
  @import '@/assets/css/common.scss';

  .wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    .title {
      font-size: 24px;
      color: #70a7b3;
    }

    .info {
      flex: 1;
      .row {
        display: flex;
        justify-content: space-between;
        font-size: 20px;
        height: 60px;
        line-height: 60px;
        position: relative;
        &:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          // 中间向两边渐变
          background: linear-gradient(to left, #22273e 0%, #2e7ea0 50%, #22273e 100%);
        }
        .value {
          color: #fff;
        }

        .status {
          color: v-bind('statusColor');
        }
      }
    }

    .button {
      margin-bottom: 10px;
      .button_init {
        width: 100%;
      }
    }
  }
</style>
