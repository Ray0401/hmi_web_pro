import { SOCKET_TYPE } from '@/constant/index';
import dayjs from 'dayjs';
const {
  MAPINFO_LANE,
  MAPINFO_ROADBOUNDARY,
  MAPINFO_ROAD_CENTERLINE,
  MAPINFO_BOUNDARY,
  MAPINFO_ROADTASK_DATA,
  MAPINFO_JUNCTION,
  MAPINFO_RGN_UNLOAD,
  MAPINFO_RGN_LOAD,
  MAPINFO_RGN_AUXILIARY,
  MAPINFO_ROAD_ISOLATION,
  MAPINFO_STRINGLINE_DATA,
  MAPINFO_ADD_STRINGLINE_DATA,
  MAPTASKINFO,
  MAPINFO_STATIC_DATA_UPDATE,
} = SOCKET_TYPE;
export const SCENE_SOCKET_MESSAGE = that => {
  return {
    // 故障弹窗
    [MAPINFO_LANE]: data => {
      // that.$store.commit(
      //   'setMessageList',
      //   `接受ws=>MAPINFO_LANE消息时间已过去${
      //     dayjs().diff(that.$store.state.ws_success_timestamp, 'millisecond') / 1000
      //   }s`
      // );

      that.roadLane();
    },
    [MAPINFO_ROADBOUNDARY]: data => {
      // that.$store.commit(
      //   'setMessageList',
      //   `接受ws=>MAPINFO_ROADBOUNDARY消息时间已过去${
      //     dayjs().diff(that.$store.state.ws_success_timestamp, 'millisecond') / 1000
      //   }s`
      // );

      that.roadBoundary();
    },
    [MAPINFO_ROAD_CENTERLINE]: data => {
      // that.$store.commit(
      //   'setMessageList',
      //   `接受ws=>MAPINFO_ROAD_CENTERLINE消息时间已过去${
      //     dayjs().diff(that.$store.state.ws_success_timestamp, 'millisecond') / 1000
      //   }s`
      // );

      that.roadCenter();
    },
    [MAPINFO_JUNCTION]: data => {
      // that.$store.commit(
      //   'setMessageList',
      //   `接受ws=>MAPINFO_JUNCTION消息时间已过去${
      //     dayjs().diff(that.$store.state.ws_success_timestamp, 'millisecond') / 1000
      //   }s`
      // );

      that.rgnJunction();
    },
    [MAPINFO_RGN_UNLOAD]: data => {
      // that.$store.commit(
      //   'setMessageList',
      //   `接受ws=>MAPINFO_RGN_UNLOAD消息时间已过去${
      //     dayjs().diff(that.$store.state.ws_success_timestamp, 'millisecond') / 1000
      //   }s`
      // );

      that.rgnUnload();
    },
    [MAPINFO_RGN_LOAD]: data => {
      // that.$store.commit(
      //   'setMessageList',
      //   `接受ws=>MAPINFO_RGN_LOAD消息时间已过去${
      //     dayjs().diff(that.$store.state.ws_success_timestamp, 'millisecond') / 1000
      //   }s`
      // );

      that.rgnLoad();
    },
    [MAPINFO_RGN_AUXILIARY]: data => {
      // that.$store.commit(
      //   'setMessageList',
      //   `接受ws=>MAPINFO_RGN_AUXILIARY消息时间已过去${
      //     dayjs().diff(that.$store.state.ws_success_timestamp, 'millisecond') / 1000
      //   }s`
      // );

      that.rgnAuxiliary();
    },

    [MAPINFO_ROAD_ISOLATION]: data => {
      // that.$store.commit(
      //   'setMessageList',
      //   `接受ws=>MAPINFO_ROAD_ISOLATION消息时间已过去${
      //     dayjs().diff(that.$store.state.ws_success_timestamp, 'millisecond') / 1000
      //   }s`
      // );

      that.roadIsolation();
    },
    [MAPINFO_ROADTASK_DATA]: data => {
      // that.roadTask();
    },
    [MAPINFO_BOUNDARY]: data => {
      // that.$store.commit(
      //   'setMessageList',
      //   `接受ws=>MAPINFO_BOUNDARY消息时间已过去${
      //     dayjs().diff(that.$store.state.ws_success_timestamp, 'millisecond') / 1000
      //   }s`
      // );

      that.boundary(true);
    },
    [MAPINFO_STRINGLINE_DATA]: data => {
      that.stringline();
    },
    [MAPINFO_ADD_STRINGLINE_DATA]: data => {
      // that.$store.commit(
      //   'setMessageList',
      //   `接受ws=>MAPINFO_ADD_STRINGLINE消息时间已过去${
      //     dayjs().diff(that.$store.state.ws_success_timestamp, 'millisecond') / 1000
      //   }s`
      // );

      if (data.operation == 1) {
        // 增
        that.addStringline();
      } else {
        // 删
        that.$bus.$emit('updateObstaclesLine', data.objectId, 'delete');
      }
    },
    [MAPTASKINFO]: data => {
      that.mapTaskInfo();
    },
    MapcuReview: data => {
      that.getMapcuReview();
    },
    electricFence: data => {
      that.getElectricFence();
    },
    MapTaskInfo_1: data => {
      that.mapTaskInfo('ADOPT');
    },
    [MAPINFO_STATIC_DATA_UPDATE]: () => {
      // that.$store.commit('setMessageList', `接收全量更新地图消息`);
      that.getStaticMapData();
    },
  };
};
