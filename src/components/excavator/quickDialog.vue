<style scoped lang="scss">
  .car-box {
    // position: absolute;
    // top: 0px;
    // right: 0px;
    width: 368px;
    height: 194px;
    background-image: url('@/assets/images/excavator/quick-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;

    &-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-content: center;
      box-sizing: border-box;
      overflow-y: auto;
      padding: 32px 20px 0 44px;
      .car-item {
        color: #fff;
        display: flex;
        // justify-content: space-between;
        align-items: center;
        &:not(:nth-last-of-type(1)) {
          margin-bottom: 10px;
        }
        box-sizing: border-box;
        .car-name {
          font-size: 18px;
          width: 171px;
          height: 55px;
          background: url('@/assets/images/excavator/quick-car-bg.png') no-repeat center;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-box {
          flex: 1;
          display: flex;
          justify-content: right;
          align-items: center;
          .icon-item {
            width: 58px;
            height: 58px;
          }
        }
      }
    }
  }
</style>
<template>
  <div class="car-box" v-if="visible">
    <div class="car-box-content">
      <div class="car-item" v-for="car in carList" :key="car.imei">
        <div class="car-name">
          {{ car.name }}
        </div>
        <div class="icon-box">
          <img
            v-if="car.startIcon"
            @click="handleClick(car, 'start')"
            class="icon-item"
            src="../../assets/images/excavator/resumeDriving.png"
          />
          <img
            v-if="car.stopIcon"
            @click="handleClick(car, 'stop')"
            class="icon-item"
            src="../../assets/images/excavator/emergency.png"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, watch } from 'vue';
  import { sendMsgToBackend, sendSocket } from '@/utils/utils';
  import { useStore } from '@/hooks/useStore';

  const store = useStore();
  const props = defineProps({
    carList: {
      type: Array,
      default: () => [
        // { iemi: '1', name: '卡车1' },
        // { iemi: '2', name: '卡车2' },
        // { iemi: '3', name: '卡车3' },
      ],
    },
    parkAllocationStatus: {
      type: Array,
      default: () => [],
    },
  });

  const $emit = defineEmits(['closeUploadDialog']);

  const visible = computed(() => {
    return props.carList.length;
  });

  watch(
    () => props.parkAllocationStatus,
    (newVal, oldVal) => {
      newVal.forEach(item => {
        const targetIndex = props.carList.findIndex(car => car.imei === item.imei);
        if (targetIndex > -1) {
        }
      });
    }
  );

  const handleClick = (car, type) => {
    // 发送指令
    sendSocket({
      type: 'ExcavatorCmd',
      truckName: car.name,
      truckImei: car.imei,
      task: 0x01,
      cmd: type == 'start' ? 0x05 : 0x04, // 指令类型 : 0x04停车,0x05启动
      loadStatus: 0x01,
      index: 0x01,
    });

    store.commit('setMessageList', `${car.name}${type == 'start' ? '恢复行车' : '紧急停车'}已发送`);
    sendMsgToBackend(`${car.name}${type == 'start' ? '恢复行车' : '紧急停车'}已发送`);
  };
</script>
