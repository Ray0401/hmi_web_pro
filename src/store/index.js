import Vue from 'vue';
import Vuex from 'vuex';
import { typeOf, formatTime } from '@/utils/utils';

Vue.use(Vuex);

// 自动导入文件
const files = import.meta.globEager('./modules/*.js');
const modules = {};
for (const key in files) {
  modules[key.replace(/(\.\/modules\/|\.js)/g, '')] = files[key].default;
}

const store = new Vuex.Store({
  state: {
    vehicleData: {
      vehicleType: '', // 这个字段不用了
      // 车辆类型编号
      vehicleNo: '',
      // 终端类型: MineCard:矿卡终端;  Adopt:采装终端; Soil:排土终端; MapCollect:地图采集终端 Currency:通用终端
      terminalType: '',
    },
    HMI_VERSION: 'V00.2.4.3.01',
    carInfo: {},
    messagelist: [],
    sensorCollectState: '',
    volume: 20,
    brightness: 80,
    // 当前车辆所在区域信息
    carInDumpPosition: {
      // map_type: "3",  //2装载区 3卸载区
      // object_id:"", // 所在区域编号
      // !!! 以下两个字段是推土机使用
      // packSpaceGroupNum: '97', //若在排土场，为当前所在的排土块编号
      // packSpaceGroupName:'unkown'  // 若map_type为3,unkown表示当前车辆不在排土场内
    },
    collectStartTime: '', //开始采集时间戳
    collectEndTime: '', //结束采集时间戳
    collectArea: '',

    ws_success_timestamp: null, //ws建立成功时间戳
    v2vWarningShow: false, // 协同终端v2v地图中的告警显示
  },
  mutations: {
    setHmiVersion(state, payload) {
      state.HMI_VERSION = payload;
    },
    setVehicleData(state, payload) {
      state.vehicleData = payload;
    },
    setCarInDumpPosition(state, payload) {
      state.carInDumpPosition = payload;
    },
    setCarInfo(state, payload) {
      state.carInfo = { ...state.carInfo, ...payload };
    },
    setMessageList(state, payload) {
      if (!typeOf(payload, 'Object'))
        payload = {
          time: formatTime('', 'hour'),
          text: payload,
        };
      state.messagelist = [payload, ...state.messagelist];
    },
    setSensorCollectState(state, payload) {
      state.sensorCollectState = payload;
    },
    setVolume(state, payload) {
      state.volume = payload;
    },
    setBrightness(state, payload) {
      state.brightness = payload;
    },
    setCollectTime(state, payload) {
      if (payload.type == 'start') {
        state.collectStartTime = payload.data;
      } else {
        state.collectEndTime = payload.data;
      }
    },
    setCollectArea(state, payload) {
      state.collectArea = payload;
    },

    setWsSuccessTimestamp(state, payload) {
      state.ws_success_timestamp = payload;
    },
    setV2VWarningShow(state, payload) {
      state.v2vWarningShow = payload;
    },
  },
  getters: {},
  actions: {},
  modules,
});

export default store;
