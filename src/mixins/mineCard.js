import { MINECARD_SOCKET_MESSAGE } from '@/constant/socketMessage/mineCardSocketMessage';
import { PUBLIC_SOCKET_MESSAGE } from '@/constant/socketMessage/publicSocketMessage';
export default {
  data() {
    return {
      showNum: 0,
      messageList: [
        {
          title: this.toLang('faultInfo'),
          showFlag: true,
          content: [],
        },
        {
          title: this.toLang('detectOffInfo'),
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
    };
  },
  created() {
    let minecardMessage = MINECARD_SOCKET_MESSAGE(this);
    let publicMessage = PUBLIC_SOCKET_MESSAGE(this);
    this.$bus.$on('websocketMessage', data => {
      if (minecardMessage[data.type]) return minecardMessage[data.type](data);
      if (publicMessage[data.type]) return publicMessage[data.type](data);
    });
  },
  methods: {
    //清除故障
    clearFault() {
      // this.messagelistFlag = false;
      // this.messageList[0].content = [];
    },
    popUpFlag1() {
      this.popUpFlag = true;
      this.$store.commit('setCollectTime', {
        type: 'end',
        data: +new Date(),
      });
    },
  },
};
