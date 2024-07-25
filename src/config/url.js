/*
 * @Author: 徐海瑞
 * @Date: 2023-02-10 13:31:31
 * @Last Modified by: 杨震乾
 * @Last Modified time: 2023-08-31 13:37:39
 *
 *  // --- http请求url ---
 */

// url: 'http://127.0.0.1:7001/api',
// url: 'http://192.168.21.10:7001/api',
// url: 'http://192.168.20.20/api',
export const baseUrl = '/api';

export default {
  MapLaneListInfo: '/MapLaneListInfo',
  MapBoundaryListInfo: '/MapBoundaryListInfo',
  MapRoadCenterListInfo: '/MapRoadCenterListInfo',
  MapTaskInfo: '/MapTaskInfo',
  MapTaskInfo1: '/MapTaskInfo_1',
  BoundaryMapInfo: '/BoundaryMapInfo',
  MapRoadBoundaryListInfo: '/MapRoadBoundaryListInfo',
  getElectricFence: '/ElectronicFenceList',
  getMapcuReview: '/MapcuReview',
  MapTaskInfoList: '/MapTaskInfoList',

  mapInfo_lane: '/mapInfo_lane',
  mapInfo_roadBoundary: '/mapInfo_roadBoundary',
  mapInfo_road_centerline: '/mapInfo_road_centerline',
  mapInfo_roadTask_data: '/mapInfo_roadTask_data',
  mapInfo_road_isolation: '/mapInfo_road_isolation',
  mapInfo_junction: '/mapInfo_junction',
  mapInfo_rgn_load: '/mapInfo_rgn_load',
  mapInfo_rgn_unload: '/mapInfo_rgn_unload',
  mapInfo_rgn_auxiliary: '/mapInfo_rgn_auxiliary',
  mapInfo_stringline_data: '/mapInfo_stringline_data',
  mapInfo_add_stringline_data: '/mapInfo_add_stringline_data',
  getPreviewData: '/getPreviewData',

  transFile: '/TransFile',
};
