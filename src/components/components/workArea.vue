<template>
  <work-drawer direction="right" :visible="visible" @closeDrawer="closeDrawer">
    <div class="work-area">
      <div class="wrapper m-border">
        <div class="name">
          <span class="label">作业区名称</span>
          <span class="value">{{ props.workAreaName }}</span>
        </div>
        <div class="status">
          <span class="label">作业区状态</span>
          <span class="value">{{ props.workAreaStatus == '0xAA' ? '未封锁' : '已封锁' }}</span>
        </div>

        <m-button class="btn" type="orange" :disabled="disabled" @click="handleClickBtn">
          申请{{ props.workAreaStatus == '0xAA' ? '封锁' : '解封' }}作业区
        </m-button>
      </div>
    </div>
  </work-drawer>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { sendSocket } from '@/utils/utils';
  import { SOCKET_TYPE } from '@/constant/index';
  import { useStore } from '@/hooks/useStore';
  import WorkDrawer from './workDrawer.vue';

  const store = useStore();

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    workAreaName: {
      type: String,
      default: '',
    },
    // 作业区状态 0xAA未封锁 0x55已封锁
    workAreaStatus: {
      type: String,
      default: '0xAA',
    },
    // 作业区类型
    zone_type: {
      type: String,
    },
    // 作业区编号
    zone_id: {
      type: String,
    },
  });

  // 按钮是否失禁 默认禁用
  const disabled = ref(false);
  watch(
    () => props.workAreaStatus,
    () => {
      disabled.value = false;
    }
  );

  // 颜色
  const color = computed(() => {
    return props.workAreaStatus == '0xAA' ? '#00FF72' : '#ff3000';
  });

  const handleClickBtn = () => {
    disabled.value = true;
    // 发送协议
    sendSocket({
      type: SOCKET_TYPE.WORKAREA_BLOCKED,
      area_type: props.workAreaStatus == '0xAA' ? '0x55' : '0xAA', //0x55：申请封锁作业区，0xAA：申请解锁作业区
      zone_type: props.zone_type,
      zone_id: props.zone_id,
    });
  };

  const $emit = defineEmits(['closeDrawer']);
  const closeDrawer = () => {
    $emit('closeDrawer');
  };

  onMounted(() => {});
</script>

<style scoped lang="scss">
  @import '@/assets/css/common.scss';
  .work-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    .wrapper {
      flex: 1;
      position: relative;

      .label {
        font-size: 20px;
        font-family: Source Han Sans CN, Source Han Sans CN-Medium;
        font-weight: 500;
        color: #70a7b3;
        margin-right: 14px;
      }

      .value {
        font-size: 20px;
        font-family: Source Han Sans CN, Source Han Sans CN-Medium;
        font-weight: 500;
        text-align: left;
        color: #ffffff;
      }

      .name {
        margin-bottom: 20px;
      }
      .status {
        .value {
          color: v-bind('color');
        }
      }

      .btn {
        position: absolute;
        left: 20px;
        right: 20px;
        bottom: 20px;
        width: auto;
        cursor: pointer;
      }
    }
  }
</style>
