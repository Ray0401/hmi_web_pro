import { SOCKET_TYPE as TYPE } from '@/constant/index';
import { sendMsgToBackend, speak } from '@/utils/utils';

let messageBuffer = [];
let timeoutId = null;
const mergeInterval = 2000; //2s

// 合并消息数据的函数
function mergeMessages(messages) {
  return messages.flat();
}

export const BULLDOZER_SOCKET_MESSAGE = that => {
  return {
    [TYPE['8B05']]: data => {
      // 将数据添加到缓冲区
      messageBuffer.push(data.data);
      // 如果定时器不存在，创建一个定时器
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          // 处理合并后的数据
          let mergedData = mergeMessages(messageBuffer);
          that.$store.commit('bulldozer/set8B05Data', mergedData);
          // 清空缓冲区和定时器
          messageBuffer = [];
          clearTimeout(timeoutId);
          timeoutId = null;
        }, mergeInterval);
      }
    },

    [TYPE.AROUND_WARNING]: data => {
      const list = data.data.filter(item => item.name);
      that.$bus.$emit('aroundCarList', list);
    },

    [TYPE.VERSION]: data => {
      that.versionList = data.data;
    },
    [TYPE.UPLOAD_URL]: data => {
      that.imei = data.imei;
      that.$bus.$emit('carName', { data: data.devName });
    },
    [TYPE.SOUND_PLAY]: data => {
      speak(data.data, data.level || 6);
    },

    [TYPE.SHOW_MESSAGE]: data => {
      that.headerListData.UTCtime = data.time;
      const a = data.time.split(' ');
      if (data.debug == 'false') {
        let b = {
          time: a[1],
          text: data.message,
        };
        that.$store.commit('setMessageList', b);
        sendMsgToBackend(b);
      }
    },
    [TYPE.UPLOAD_FILE_RESULT]: data => {
      that.fileupload = data.data;
    },

    [TYPE.CLEAN_DUMP_TASK]: data => {
      // 显示清理排土任务icon
      const index = that.iconList.findIndex(item => item.name == 'cleanTaskIcon');
      that.iconList[index].isShow = true;
      // 排土任务数据
      that.soilTaskData = {
        DumpGroupName: data.data.map_id,
        DumpNum: data.data.packGroupNum,
      };
      // 打开排土块任务抽屉
      that.soilBlockTaskVisible = true;
      // that.$store.commit('bulldozer/setHasTargetWork', true);
      // 状态栏显示作业区编号
      that.headerListData.area = `排土场#${data.data.map_id}`;
    },
    [TYPE.SYNC_CLEAN_STATUS]: data => {
      if (data?.data?.status == 4) {
        this.$toast('任务申请失败');
      } else {
        that.$bus.$emit('syncCleanStatus', data.data);
      }
    },
    [TYPE.VOICEPLAYVOLUME]: data => {
      that.$store.commit('setVolume', data.volume);
    },
  };
};
