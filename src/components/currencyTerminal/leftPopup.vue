<template>
  <div class="work-dialog-outer">
    <div class="work-dialog-inner">
      <div class="title">{{ titleInfo[title] || title }}</div>
      <div class="content-list">
        <div
          v-for="(item, index) in list"
          :key="index"
          @click="setIndex(index)"
          :class="`item ${isUploadFile && 'file-item'} ${isUploadFile && activeIndex == index && 'file-item-active'}`"
        >
          <img src="../../assets/images/faultInformationIcon.png" class="icon" v-if="title == 'fault'" />
          {{ item.name || collectFaultText1[item] || item }}
        </div>
      </div>
      <div class="button-box" v-if="title == 'uploadFile'">
        <buttonDialog :type="'red'" @click="deleteFile">删除文件</buttonDialog>
        <buttonDialog :type="'orange'" @click="reloadUpload">重新上传</buttonDialog>
      </div>
    </div>
    <div class="close-btn" @click="closebtn"></div>
  </div>
</template>
<script>
  import { ref, reactive, computed } from 'vue';
  import { sendSocket } from '@/utils/utils';
  import { collectFaultText } from './data';
  export default {
    props: {
      list: {
        type: Array,
        default: [],
      },
      title: {
        type: String,
        default: '',
      },
    },
    setup(props, context) {
      const activeIndex = ref(0);
      const collectFaultText1 = reactive(collectFaultText);
      const titleInfo = reactive({
        fault: '故障信息',
        uploadFile: '未上传完成文件',
      });
      const isUploadFile = computed(() => {
        return props.title == 'uploadFile';
      });
      const setIndex = index => {
        activeIndex.value = index;
      };
      const reloadUpload = () => {
        sendSocket({
          type: 'SensorCollectData',
          status: 'upload',
          name: props.list[activeIndex.value],
        });
      };
      const deleteFile = () => {
        sendSocket({
          type: 'SensorCollectData',
          status: 'delete',
          name: props.list[activeIndex.value],
        });
      };
      const closebtn = () => {
        context.emit('close');
      };
      return {
        activeIndex,
        titleInfo,
        isUploadFile,
        setIndex,
        reloadUpload,
        deleteFile,
        closebtn,
        collectFaultText1,
      };
    },
  };
</script>

<style lang="scss">
  @import '@/assets/css/common.scss';
  @keyframes leftShow {
    0% {
      transform: translateX(-100%);
    }
  }
  .work-dialog-outer {
    width: 340px;
    position: absolute;
    left: 15px;
    top: 120px;
    bottom: 130px;
    box-sizing: border-box;
    background: url('@/assets/images/popupBack.png') no-repeat;
    background-size: 100% 100%;
    animation: none;
    padding: 0;
    animation: leftShow 500ms ease;
    .close-btn {
      background-image: url('@/assets/images/closeLeft.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: 100%;
      top: 16px;
      width: 42px;
      height: 47px;
    }
    .work-dialog-inner {
      width: 100%;
      height: 100%;
      padding: 25px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .title {
        font-size: 20px;
        font-weight: 500;
        text-align: left;
        color: #70a7b3;
      }
      .content-list {
        flex: 1;
        overflow-y: scroll;
        margin-top: 6px;
        .item {
          color: #fff;
          margin-top: 10px;
          display: flex;
          align-items: center;
          font-size: 16px;
          .icon {
            width: 18px;
            height: 16px;
            margin-right: 13px;
            flex-shrink: 0;
          }
        }
        .file-item {
          height: 40px;
          background: rgba(255, 91, 0, 0);
          border: 1px solid #45556a;
          padding: 0 9px;
          word-break: break-all;
        }
        .file-item-active {
          background: rgba(255, 91, 0, 0.2);
          border: 1px solid #ff5b00;
        }
      }
      .content-list::-webkit-scrollbar {
        display: none;
      }
      .button-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        .button_init {
          &:first-child {
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>
