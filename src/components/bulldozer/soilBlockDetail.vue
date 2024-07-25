<style scoped lang="scss">
  @import '@/assets/css/common.scss';

  .pr {
    padding-right: 20px;
  }

  .basic-info {
    margin-bottom: 10px;
    height: 147px;
    font-size: 20px;
    .row {
      display: flex;
      align-items: center;
      &:not(:last-child) {
        margin-bottom: 10px;
      }
      .label {
        margin-right: 14px;
      }

      .name {
        color: #fff;
      }
      .status {
        color: v-bind('statusColor');
      }

      .warning {
        font-size: 14px;
        color: #ff3000;
        margin-left: 6px;
      }
    }
  }
  .point-info {
    flex: 1;
    font-size: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    &.m-border {
      padding-right: 0;
    }

    .title,
    .row {
      display: flex;
      justify-content: space-between;
    }

    .row {
      position: relative;
      height: 50px;
      line-height: 50px;
      align-items: center;

      &::before {
        content: '';
        width: 10px;
        height: 10px;
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }

      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        // 中间向两边渐变
        background: linear-gradient(to left, #22273e 0%, #2e7ea0 50%, #22273e 100%);
      }
      &.open {
        &::before {
          background: #00ff48;
        }
      }
      &.close {
        &::before {
          background: #ff3000;
        }
      }
      &.distribution {
        &::before {
          background: #ffed3a;
        }
      }

      .name {
        margin-left: 26px;
        color: #fefefe;
      }
    }

    .paitu-box {
      flex: 1;
      overflow-y: overlay;
      // padding-bottom: 20px;
    }

    .button {
      height: 40px;
      padding-top: 10px;

      .button_init {
        width: 100%;
      }
    }
  }
</style>

<template>
  <work-drawer direction="right" :visible="visible">
    <div class="basic-info m-border">
      <div class="row">
        <span class="label">排土块名称</span>
        <span class="name">{{ detailData.basicInfo.name }}</span>
      </div>
      <div class="row">
        <span class="label">排土块状态</span>
        <span class="status">{{ statusText }}</span>
      </div>
      <div class="row">
        <span class="label">排土块控制</span>
        <!-- <toggle-button
          style="width: 70px; height: 36px"
          color="#FF5900"
          :value="detailData.basicInfo.status != 2"
          @change="switchChange"
          :disabled="switchDisabled"
        /> -->
        <span class="warning" v-if="switchDisabled">无法开启排土块</span>
      </div>
    </div>
    <div class="point-info m-border">
      <div class="title pr">
        <span>排土点</span>
        <span>排弃次数</span>
      </div>
      <div class="paitu-box pr">
        <div
          :class="`row ${item.status == '1' ? 'open' : item.status == '2' ? 'close' : 'distribution'}`"
          v-for="(item, index) in detailData.pointInfo"
          :key="index"
        >
          <div class="name">
            {{ item.name }}
          </div>
          <div class="num">
            <span :style="{ color: item.num == item.total ? '#FF3000' : '#fff' }">{{ item.num }}</span>
            <span>/{{ item.total }}</span>
          </div>
        </div>
      </div>

      <div class="button pr">
        <m-button @click="handleClickButton" :disabled="detailData.basicInfo.status != 2">申请清理排土块</m-button>
      </div>
    </div>
  </work-drawer>
</template>

<script setup>
  import WorkDrawer from '@/components/components/workDrawer.vue';
  import { sendSocket } from '@/utils/utils';
  import { computed } from 'vue';
  import { SOCKET_TYPE } from '@/constant/index';
  import { useStore } from '@/hooks/useStore';
  const store = useStore();
  const $emit = defineEmits(['updateSoilBlockData']);
  const props = defineProps({
    visible: {
      type: Boolean,
      default: true,
    },
    detailData: {
      type: Object,
      default: () => {},
    },
  });
  const statusColor = computed(() => {
    const status = props?.detailData?.basicInfo?.status ?? '2';
    return status == '1' ? '#00ff48' : status == '2' ? '#FF3000' : '#ffed3a';
  });

  const statusText = computed(() => {
    const status = props?.detailData?.basicInfo?.status ?? '2';
    return status == '1' ? '开启' : status == '2' ? '关闭' : '已分配';
  });
  const switchDisabled = computed(() => {
    // 排土块关闭且排土块内所有排土点都是关闭的状态,排土块则无法开启
    const { basicInfo = {}, pointInfo = {} } = props?.detailData;
    return (basicInfo.status == '2' && pointInfo.every(item => item.status == '2')) ?? false;
  });

  // 申请清理排土块任务
  const handleClickButton = () => {
    const { object_id } = store.state.carInDumpPosition;
    sendSocket({
      type: SOCKET_TYPE.CLEAN_DUMP_STATUS,
      map_id: object_id, //区域编号
      packGroupNum: props.detailData.basicInfo.soilBlockNum, // 排土块编号
      status: '5', //1：申请结束任务；2：申请开始任务；3：需要采集；4：不需要采集；5：申请清理排土块
    });
    $emit('closeDrawer');
  };

  const switchChange = data => {
    const { value } = data?.detail || {};
    const { object_id, packSpaceGroupNum, packSpaceGroupName } = store.state.carInDumpPosition;
    sendSocket({
      type: SOCKET_TYPE.SET_DUMP_STATUS,
      map_id: object_id,
      dumpNum: props.detailData.basicInfo.soilBlockNum,
      status: value ? '1' : '2', // 1开 2关
    });
  };
</script>
