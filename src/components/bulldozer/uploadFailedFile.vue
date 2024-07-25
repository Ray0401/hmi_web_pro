<style scoped lang="scss">
  .failed-file-drawer {
    flex: 1;
    display: flex;
    flex-direction: column;
    .wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      .title {
        font-size: 24px;
        font-family: Source Han Sans CN, Source Han Sans CN-Medium;
        font-weight: 500;
        color: #70a7b3;
        margin-bottom: 16px;
      }
      .file-list {
        flex: 1;

        .file-item {
          width: 100%;
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          font-family: Source Han Sans CN, Source Han Sans CN-Medium;
          font-weight: 500;
          color: #ffffff;
          padding-left: 9px;
          border: 1px solid #45556a;
          box-sizing: border-box;
          margin-bottom: 10px;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &.active {
            border: 1px solid #ff5b00;
            background: rgba(255, 91, 0, 0.2);
          }
        }
      }
    }
    .footer {
      display: flex;

      ::v-deep .button_init {
        width: 140px;
      }

      .delete {
        margin-right: 10px;
      }
    }
  }
</style>

<template>
  <work-drawer direction="left" :visible="visible" @closeDrawer="closeDrawer">
    <div class="failed-file-drawer">
      <div class="wrapper">
        <span class="title">未上传完成文件</span>
        <div class="file-list">
          <div
            v-for="(item, index) in state.list"
            :key="index"
            :class="{ 'file-item': true, active: state.currentFileIndex == index }"
            @click="handleClickItem(index)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="footer">
        <button-dialog type="red" class="delete" :disabled="!state.list.length" @click="handleDelete">
          删除文件
        </button-dialog>
        <button-dialog type="orange" :disabled="!state.list.length" @click="handleUpload">重新上传</button-dialog>
      </div>
    </div>
  </work-drawer>
</template>

<script setup>
  import { sendMsgToBackend } from '@/utils/utils';
  import WorkDrawer from '../components/workDrawer.vue';
  import { reactive, watch } from 'vue';
  import { useStore } from '@/hooks/useStore';

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
  });

  const state = reactive({
    list: [],
    currentFileIndex: 0,
  });

  const store = useStore();

  const $emit = defineEmits(['upload', 'hideCleanTaskIcon']);

  watch(
    () => props.visible,
    () => {
      const file = JSON.parse(localStorage.getItem('uploadFaildFile'));
      state.list = file ? [file] : [];
      if (!state.list.length && props.visible) {
        store.commit('setMessageList', '获取未上传完成文件失败');
        sendMsgToBackend('获取未上传完成文件失败');
      }
    }
  );

  // 选择文件
  const handleClickItem = index => {
    state.currentFileIndex = index;
  };

  // 删除
  const handleDelete = () => {
    state.list.splice(state.currentFileIndex, 1);
    // 清空失败文件
    localStorage.removeItem('uploadFaildFile');
    if (!state.list.length) {
      $emit('hideCleanTaskIcon');
    }
  };
  // 重新上传
  const handleUpload = () => {
    $emit('upload');
  };

  const closeDrawer = () => {
    $emit('closeDrawer');
  };
</script>
