export const MINECARD_SOCKET_MESSAGE = that => {
  return {
    //故障弹窗
    // popup: data => {
    //   if (that.popupShow) {
    //     that.popupShow = false;
    //     that.defaultList.defaulttitle = data.title;
    //     that.defaultList.defaultcontent = data.data;
    //     that.defaultList.blink = Boolean(data.blink);
    //     that.defaultList.okButton = Boolean(data.okButton);
    //     that.showDefalutFlag = true;
    //     that.popupTimer = setTimeout(() => {
    //       that.popupShow = true;
    //     }, 60000);
    //   }
    // },
    // 接管接续弹窗
    showContinueDialog: data => {
      that.workArea = data.data;
    },
    // 返回接续结果
    confirmContinueResp: data => {
      that.workArea = '';
      if (data.reason) {
        that.message = data.reason;
        that.showModal = true;
      }
    },
    msg0501: data => {
      that.driveData.distance = parseInt(data.distance);
      that.driveData.modeindex.push(1);
      that.setTimer(500, 1, 'msg0501');
    },
  };
};
