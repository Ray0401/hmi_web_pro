<template>
  <div class="pre-warning-box">
    <div
      class="pre-warning-list"
      v-for="(item, index) in preWarning"
      :key="index"
      @click="showDetailbtn(preWarninglist[item].id)"
    >
      <img :src="preWarninglist[item].src" class="pre-warning-icon" />
    </div>
    <div class="status" v-if="SensorCollect">
      <div class="random" />
      <div class="status-text">{{ $store.state.sensorCollectState }}</div>
    </div>
  </div>
</template>

<script setup>
  import { reactive } from 'vue';
  import { preWarningList } from './data';
  let props = defineProps({
    preWarning: {
      type: Array,
      default: [],
    },
    SensorCollect: {
      type: Boolean,
      default: false,
    },
  });
  let emit = defineEmits(['callbtnclick']);
  const preWarninglist = reactive(preWarningList);
  const showDetailbtn = id => {
    if (id == 5 || id == 6) {
      emit('callbtnclick', { data: id });
    }
  };
</script>

<style lang="scss" scoped>
  .pre-warning-box {
    position: absolute;
    padding: 0px 15px;
    box-sizing: border-box;
    display: flex;
    top: 49px;
    justify-content: flex-start;
    align-items: center;
    float: left;

    .pre-warning-list {
      margin-right: 9px;

      .pre-warning-icon {
        width: 62px;
        height: 62px;
        cursor: pointer;
      }
    }
    .status {
      height: 40px;
      background: rgba(9, 74, 78, 0.6);
      display: flex;
      align-items: center;
      padding-left: 9px;
      padding-right: 22px;
      .random {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #22f2ff;
      }
      .status-text {
        margin-left: 13px;
        font-size: 24px;
        font-weight: 500;
        text-align: left;
        color: #22f2ff;
        line-height: 28px;
      }
    }
  }
</style>
