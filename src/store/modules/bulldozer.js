/*
 * @Author: 徐海瑞
 * @Date: 2022-11-15 14:02:16
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-07-16 10:52:56
 *
 * 推土机相关store
 */

import eventBus from '@/utils/eventBus';

export default {
  namespaced: true,
  state: {
    collectConfig: {
      // 当前采集类型: roadBoundary道路边界 loadBoundary装载区边界 unloadBoundary卸载区边界 obstacleBoundary障碍物边界 soil排土线
      type: '',
      // 位于车身哪一侧 : left 左侧 right 右侧
      side: '',
      // 排土类型(排土采集模式下)  :   edge边缘  inside场内
      dumplineType: 'edge',
    },
    '8B05Data': [],
    // 是否存在目标作业区
    hasTargetWork: false,
    // 是否可以手动选择目标作业区
    canClickMapWorkArea: false,
    //当前选择的目标作业区信息 {workAreaName:"name", workAreaType:"3",workAreaId:'4'}
    currentTargetWorkArea: null,
    collectStartTime: '', //开始采集时间戳
    collectEndTime: '', //结束采集时间戳
  },
  mutations: {
    setCollectConfig(state, payload) {
      state.collectConfig = payload;
    },
    set8B05Data(state, payload) {
      // console.log('---- 8B05Data ----', payload);
      state['8B05Data'] = payload;

      // 非采集模式下,可以更新排土块的状态
      if (!state.collectConfig.type) {
        eventBus.$emit('updateMapSoilBlockData', payload);
      }
    },
    setHasTargetWork(state, payload) {
      state.hasTargetWork = payload;
    },
    setCanClickMapWorkArea(state, payload) {
      state.canClickMapWorkArea = payload;
    },
    selectCurrentTargetWorkArea(state, payload) {
      state.currentTargetWorkArea = payload;
    },

    setCollectTime(state, payload) {
      if (payload.type == 'start') {
        state.collectStartTime = payload.data;
      } else {
        state.collectEndTime = payload.data;
      }
    },
  },
  getters: {},
  actions: {},
};
