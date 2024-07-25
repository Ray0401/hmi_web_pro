<style scoped lang="scss">
  .use-preview-dialog {
    width: 240px;
    height: 200px;
    background-image: url('@/assets/images/excavator/preview_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;

    .btn-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-left: 30px;
      box-sizing: border-box;
      .cancel {
        margin-bottom: 10px;
      }
    }
  }
</style>

<template>
  <div class="use-preview-dialog" v-if="visible">
    <div class="btn-list">
      <button-dialog type="grey" class="cancel" @click="handleClick('cancel')">取消更新</button-dialog>
      <button-dialog type="orange" class="confirm" @click="handleClick('confirm')">确定更新</button-dialog>
    </div>
  </div>
</template>

<script>
  import { SOCKET_TYPE } from '@/constant';
  import { sendMsgToBackend, sendSocket } from '@/utils/utils';

  export default {
    mixins: [],
    components: {},
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {};
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {
      handleClick(type) {
        if (type === 'cancel') {
          this.$bus.$emit('deletePreviewLoad');
          this.$store.commit('setMessageList', '删除装载区边界预览数据');
          sendMsgToBackend('删除装载区边界预览数据');
        } else {
          sendSocket(SOCKET_TYPE.CONFIRM_USE_PREVIEW_DATA);
          this.$store.commit('setMessageList', '装载区边界数据更新中');
          sendMsgToBackend('装载区边界数据更新中');
        }
        this.$emit('closeUsePreviewDialog');
      },
    },
  };
</script>
