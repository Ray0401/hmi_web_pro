import { sendSocket } from '@/utils/utils';
export const GENERAL_SOCKET_MESSAGE = that => {
  return {
    // 故障弹窗
    popup: data => {
      that.defaultList.defaulttitle = data.title;
      that.defaultList.defaultcontent = data.data;
      that.defaultList.blink = Boolean(data.blink);
      that.defaultList.okButton = Boolean(data.okButton);
    },
  };
};
