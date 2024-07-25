/*
 * @Author: 徐海瑞
 * @Date: 2022-11-04 11:34:40
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-07-15 10:27:58
 * 地图采集车
 */
import { MAPCOLLECT_SOCKET_MESSAGE } from '@/constant/socketMessage/mapCollectSocketMessage';
import { PUBLIC_SOCKET_MESSAGE } from '@/constant/socketMessage/publicSocketMessage';
export default {
  data() {
    return {
      showNum: 0,
      messageList: [
        {
          title: '故障信息',
          showFlag: true,
          content: [],
        },
        {
          title: '检测关闭信息',
          showFlag: false,
          content: [],
        },
      ],
      // 报警等级
      defaultList: {
        defaulttitle: '',
        defaultcontent: '',
        blink: false,
        okButton: false,
      },
      warnSwitch: false,
      // 头部数据
      headerListData: {
        carindex: 4, //
        area: '',
        option: '',
        materialicon: '',
        oretext: '',
        state: 1,
        signalStatus: [],
        realspeed: '0',
        maxspeed: '0',
        rtkstate: 'GPS',
        networkstate: [],
        UTCtime: '',
      },
    };
  },
  created() {
    this.socketMessage();
    // 重新建立链接，需要重新监听消息
    this.$bus.$on('openSocket', () => {
      this.socketMessage();
    });
  },
  methods: {
    socketMessage() {
      let mapcollectMessage = MAPCOLLECT_SOCKET_MESSAGE(this);
      let publicMessage = PUBLIC_SOCKET_MESSAGE(this);
      this.socket.socketTask.onmessage(data => {
        data = JSON.parse(data.data.replaceAll('\n', ''));
        if (mapcollectMessage[data.type]) return mapcollectMessage[data.type](data);
        if (publicMessage[data.type]) return publicMessage[data.type](data);
      });
    },
    //清除故障
    clearFault() {
      this.messagelistFlag = false;
      this.preWarning.splice(this.preWarning.indexOf(5), 1);
      this.messageList[0].content = [];
    },
  },
};
