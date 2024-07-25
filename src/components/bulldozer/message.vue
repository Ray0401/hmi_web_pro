<style scoped lang="scss">
.message-box {
  position: fixed;
  top: 50px;
  left: 50%;
  z-index: 9999;
  transform: translateX(-50%);
  height: 40px;
  background: rgba($color: #094a4e, $alpha: 0.6);
  line-height: 40px;
  text-align: center;
  padding: 0 16px;
  box-sizing: border-box;
  color: #22f2ff;
  font-size: 20px;
  white-space: nowrap;
}
</style>

<template>
  <div class="message-box" v-if="visible">{{ text }}</div>
</template>

<script setup>
import { onMounted } from 'vue';
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: '未确定目标区域，请从地图中点选当前采集所属作业区或排土块',
  },
});

const $myemit = defineEmits(['test']);

onMounted(() => {
  $myemit('test', '我是测试消息');
});
</script>
