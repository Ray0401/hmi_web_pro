/*
 * @Author: 徐海瑞
 * @Date: 2022-10-31 17:43:49
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-09-27 14:03:29
 *
 * 推土机mixin
 */

import { SOCKET_TYPE as TYPE } from '@/constant/index';
import { HEADER_LIST, ON_CASTING_TEXT, OFF_CASTING_TEXT, CASTING_TIPS_WARNING } from '@/constant/bulldozer';

import { sendSocket } from '@/utils/utils';
import { BULLDOZER_SOCKET_MESSAGE } from '@/constant/socketMessage/bulldozerSocketMessage';

export default {
  data() {
    return {
      headerListData: HEADER_LIST,

      // 右上角通知组件弹窗相关
      showNotice: false,

      // 排土块任务数据
      soilTaskData: {
        // DumpGroupName: '#1排土场', //排土场名称
        // DumpNum: 0, //当前所在的排土块编号
      },

      imei: null,
      comparisonTable: {},
    };
  },

  created() {
    // --- 以下都是相关事件的订阅 ---
    let bulldozerMessage = BULLDOZER_SOCKET_MESSAGE(this);
    this.$bus.$on('websocketMessage', data => {
      if (bulldozerMessage[data.type]) return bulldozerMessage[data.type](data);
    });

    this.$bus.$on('clicklist', data => {
      console.log(data);
      this.goodstatus = data;
      console.log(this.goodstatus);
    });
    this.$bus.$on('clickItemId', data => {
      console.log(data);
      this.clickItemId = data;
    });
    this.$bus.$on('Headerstate', data => {
      this.headerListData.state = data;
    });
    this.$bus.$on('ComparisonTable', data => {
      this.comparisonTable = data;
    });
    // 排土区域设置内的开关状态变更时的订阅
    this.$bus.$on('switchChange', value => {
      console.log('switchChange', value);
      this.commonModalFlag = true;
      this.commonModalMessage = value ? ON_CASTING_TEXT : OFF_CASTING_TEXT;
      this.commonModalTip = !value && CASTING_TIPS_WARNING;
    });

    // 打开上传弹窗
    this.$bus.$on('openUploadDialog', () => {
      this.uploadFlag = true;
      this.uploadStatus = 'normal';
    });

    // 打开排土块详情弹窗
    this.$bus.$on('openSoilBlockDetail', target => {
      // console.log('SoilBlockDetail', target);

      this.workFlag = false;
      this.settingFlag = false;
      this.userFlag = false;
      this.$bus.$emit('resetBtnClickIndex');

      const { soilBlockStatus, soilBlockNum, soilBlockName } = target?.object ?? {};
      const basicInfo = {
        name: soilBlockName,
        status: soilBlockStatus,
        soilBlockNum,
      };
      const pointInfo = this.$store.state.bulldozer['8B05Data']
        .filter(item => item.stop_type == '1' && item.group_num == soilBlockNum)
        .map(item => {
          return {
            name: this.comparisonTable[item.stop_num] || item.stop_num,
            status: item.stop_group_status,
            total: item.maxDisplacementNum,
            num: item.displacementNum,
          };
        });

      this.soilBlockDetailData = {
        basicInfo,
        pointInfo,
      };
      this.workAreaVisible = false; // 关闭作业区抽屉
      this.soilBlockDetailVisible = true;
    });

    // 更新排土块详情弹窗数据
    this.$bus.$on('updateSoilBlockDetail', num => {
      if (this.soilBlockDetailVisible) {
        const isCurrentBlock = this.soilBlockDetailData?.basicInfo?.name?.includes(num);
        const target = this.$store.state.bulldozer['8B05Data'].find(
          item => item.stop_type == '2' && item.group_num == num && isCurrentBlock
        );
        if (target) {
          this.soilBlockDetailData.basicInfo.status = target.stop_group_status;
        }
      }
    });

    this.$bus.$on('selectTargetWork', value => {
      this.messageVisible = value == 'yes' ? false : true;
    });

    // 排土块增量更新中，禁止打开排土块
    this.$bus.$on('openDumpStatusResp', () => {
      this.soilBlockDetailVisible = false;
    });
  },

  methods: {
    /**
     * 清理排土块任务方法封装
     * @param {*} status 1申请结束任务；2申请开始任务；3需要采集；4不需要采集；5申请清理排土块
     */
    onCleanDumpStatus(status) {
      const { object_id } = this.$store.state.carInDumpPosition;
      sendSocket({
        type: TYPE.CLEAN_DUMP_STATUS,
        map_id: object_id, //区域编号
        packGroupNum: this.soilTaskData.DumpNum, //排土块编号
        status,
      });
      this.headerListData.area = '';
    },
  },
};
