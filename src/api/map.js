/*
 * @Author: 徐海瑞
 * @Date: 2023-02-10 11:52:24
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-05-31 18:10:01
 *
 * // --- 地图相关 api ---
 *
 */

import fetch from './fetch';
import url from '@/config/url';

export default {
  /**
   * 获取全地图车道线
   * @returns
   */
  getMapInfoLane() {
    return fetch(url.mapInfo_lane, {}, 'get');
  },
  /**
   * 获取全地图道路边界
   * @returns
   */
  getMapInfoRoadBoundary() {
    return fetch(url.mapInfo_roadBoundary, {}, 'get');
  },
  /**
   * 获取全地图道路中心线
   * @returns
   */
  getMapInfoRoadCenterline() {
    return fetch(url.mapInfo_road_centerline, {}, 'get');
  },
  /**
   * 获取隔离带信息
   * @returns
   */
  getMapInfoRoadIsolation() {
    return fetch(url.mapInfo_road_isolation, {}, 'get');
  },
  /**
   * 获取路口信息
   * @returns
   */
  getMapInfoJunction() {
    return fetch(url.mapInfo_junction, {}, 'get');
  },
  /**
   * 获取装载区信息
   * @returns
   */
  getMapInfoRgnLoad() {
    return fetch(url.mapInfo_rgn_load, {}, 'get');
  },
  /**
   * 获取卸载区信息
   * @returns
   */
  getMapInfoRgnUnload() {
    return fetch(url.mapInfo_rgn_unload, {}, 'get');
  },
  /**
   * 获取辅助作业区信息
   * @returns
   */
  getMapInfoRgnAuxiliary() {
    return fetch(url.mapInfo_rgn_auxiliary, {}, 'get');
  },
  // 获取全地图道路封闭区域
  getMapBoundaryListInfo() {
    return fetch(url.MapBoundaryListInfo, {}, 'get');
  },
  // 获取作业区内的矿卡任务路径
  getMapInfoTaskData() {
    return fetch(url.mapInfo_roadTask_data, {}, 'get');
  },
  // 获取全地图边界数据
  getBoundaryMapInfo() {
    return fetch(url.BoundaryMapInfo, {}, 'get');
  },

  // 获取动态地图全量更新
  getMapInfoStringlineData() {
    return fetch(url.mapInfo_stringline_data, {}, 'get');
  },
  // 获取动态地图增量更新
  getMapInfoAddStringlineData() {
    return fetch(url.mapInfo_add_stringline_data, {}, 'get');
  },
  // 矿卡任务路径
  getMapTaskInfo() {
    return fetch(url.MapTaskInfo, {}, 'get');
  },
  // 双侧停靠位第二条任务路径
  getMapTaskInfo1() {
    return fetch(url.MapTaskInfo1, {}, 'get');
  },
  getMapcuReview() {
    return fetch(url.getMapcuReview, {}, 'get');
  },
  getElectricFence() {
    return fetch(url.getElectricFence, {}, 'get');
  },
  // 获取装载区预览数据
  getPreviewData() {
    return fetch(url.getPreviewData, {}, 'get');
  },
};
