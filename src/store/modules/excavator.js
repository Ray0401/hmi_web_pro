/*
 * @Author: 徐海瑞
 * @Date: 2022-11-15 14:02:16
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-05-28 15:21:32
 *
 * 挖机相关store
 */

export default {
  namespaced: true,
  state: {
    middleclickindex: [null, null],
    rgnloadMode: 0, // 0 单侧 1 双侧
    webRgnLoadMode: 0, //保存平台的装载模式
    checkRgnloadMode: false, //记录是否手动切换过装载模式
    givepointIndex: 0, //当前指点停靠位stop_num
    follow: 0, // 停靠位跟随
    planningResultList: [], // 保存指点结果
    positionInfo: {}, //车辆位置信息
    givePointInfo: localStorage.getItem('givePointInfo')
      ? JSON.parse(localStorage.getItem('givePointInfo'))
      : [null, null], //双侧指点航向角，旋转角度信息保存
    autoPointMode: true, //是否是自动指点模式
    virtualPointData: {}, //保存虚拟停靠位数据
    stepDistanceFlag: false, //调整步距模式
    pointItem: {}, //当前面板的停靠位和预停靠位信息
    showGridLine: false,
  },
  mutations: {
    setMiddleClickIndex(state, payload) {
      if (payload.index != undefined) {
        state.middleclickindex[Number(payload.index)] = payload.value;
      } else {
        state.middleclickindex = payload.value;
      }
    },
    setRgnloadMode(state, payload) {
      state.rgnloadMode = payload;
    },
    setCheckRgnloadMode(state, payload) {
      state.checkRgnloadMode = payload;
    },
    setGivepointIndex(state, payload) {
      state.givepointIndex = payload;
    },
    setFollow(state, payload) {
      state.follow = payload;
    },
    setWebRgnLoadMode(state, payload) {
      state.webRgnLoadMode = payload;
    },
    setAutoPointMode(state, payload) {
      state.autoPointMode = payload;
    },
    setPlanningResultList(state, payload) {
      state.planningResultList = payload;
    },
    setPositionInfo(state, payload) {
      state.positionInfo = payload;
    },
    setGivePointInfo(state, payload) {
      if (payload.index != undefined) {
        state.givePointInfo[payload.index] = payload.value;
      } else {
        state.givePointInfo = payload.value;
      }
      localStorage.setItem('givePointInfo', JSON.stringify(state.givePointInfo));
    },
    setVirtualPointData(state, payload) {
      state.virtualPointData = payload;
    },
    setStepDistanceFlag(state, payload) {
      state.stepDistanceFlag = payload;
    },

    setPointItem(state, payload) {
      state.pointItem = payload;
    },

    setGridLine(state, payload) {
      state.showGridLine = payload;
    },
  },
  getters: {},
  actions: {},
};
