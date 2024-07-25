/*
 * @Author: 徐海瑞
 * @Date: 2022-11-23 11:41:58
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-07-03 11:04:04
 * 公共常量
 *
 */
export const isWsMock = 'yes'; // yes|no 是否使用本地ws mock
export const ws_reconnet_time = 20000; //ws重连时间(毫秒)
export const ws_url = 'ws://192.168.20.20:8081/cmdstream';
export const local_ws_url = 'ws://localhost:18889'; // 本地mock ws url

// 终端类型
export const MINE_CARD = 'MineCard'; // 矿卡终端
export const ADOPT = 'Adopt'; // 采装终端
export const SOIL = 'Soil'; // 排土终端
export const MAP_COLLECT = 'MapCollect'; // 地图采集终端
export const CURRENCY = 'Currency'; // 通用终端

// websocket的type常量
export const SOCKET_TYPE = {
  '8B01': '8B01',
  '8B05': '8B05',
  8114: '8114', // 车辆后移规划结果

  MAPINFO_LANE: 'mapInfo_lane', // 全地图车道路径
  MAPINFO_ROADBOUNDARY: 'mapInfo_roadBoundary', // 全地图车道路径
  MAPINFO_ROAD_CENTERLINE: 'mapInfo_road_centerline', // 全地图道路中心线
  MAPINFO_BOUNDARY: 'BoundaryMapInfo', // 全地图边界信息
  MAPINFO_ROADTASK_DATA: 'mapInfo_roadTask_data', // 作业区内矿卡任务路径
  MAPINFO_RGN_LOAD: 'mapInfo_rgn_load', // 装载区
  MAPINFO_RGN_UNLOAD: 'mapInfo_rgn_unload', // 卸载区
  MAPINFO_JUNCTION: 'mapInfo_junction', // 路口
  MAPINFO_ROAD_ISOLATION: 'mapInfo_road_isolation', // 隔离带
  MAPINFO_RGN_AUXILIARY: 'mapInfo_rgn_auxiliary', // 辅助作业区
  MAPINFO_STRINGLINE_DATA: 'mapInfo_stringline_data', // 动态地图全量更新
  MAPINFO_ADD_STRINGLINE_DATA: 'mapInfo_add_stringline_data', // 动态地图增量更新
  MAPTASKINFO: 'MapTaskInfo', // 矿卡任务路径
  MAPINFO_STATIC_DATA_UPDATE: 'mapInfo_static_data_update', // 静态地图全量/增量更新
  SEND_MSG_TO_RCD: 'sendmsgtorcd', //同步前端消息给遥控驾舱

  SYNC_BUILD_ID: 'SyncBuildId', // buildID
  REQVERSION: 'ReqVersion', // 版本号
  VEHICLE_TYPE: 'VehicleType', // 车辆类型
  UPLOAD_URL: 'UploadUrl',
  COLLECT: 'collect',
  POSITION: 'Position',
  REGISTER_CLIENT: 'registerClient',
  VERSION: 'Version',
  WEATHER_MODE: 'WeatherMode', // 天气
  GET_VEHICLE_TYPE: 'getVehicleType', // 获取车辆类型
  SOUND_PLAY: 'SoundPlay', // 语音播报
  AROUND_WARNING: 'aroundWarning', // 周边车辆信息
  PARK_AL_LOCATION_STATUS: 'ParkAllocationStatus',
  OUTPUT: 'Output',
  MATERIAL_LIST: 'MaterialList',
  CURRENT_MATERIAL: 'CurrentMaterial',
  POPUP: 'popup',
  DRIVE_MODE: 'driveMode',
  GEAR_ACCELERATOR_BRAKE: 'gearAcceleratorBrake',
  SHOW_MESSAGE: 'showMessage',
  LOAD_MATERIAL_DEST: 'loadMaterialDest',
  RTK_5G4G: 'RTK5G4G',
  WARN_SWITCH: 'warnSwitch',
  FAULT_SWITCH: 'faultSwitch',
  FAULT_STATUS: 'faultStatus',
  FAULT_STATUS_2: 'faultStatus2',
  UPLOAD_FILE_RESULT: 'UploadFileResult',
  OFFSET: 'offset',
  AROUND_HEADING: 'AroundHeading',
  RETRO_GRADE: 'retrograde',
  OBSTRUCTION: 'obstruction',
  OPERATION_STATUS: 'OperationStatus',
  SPEED: 'speed', // 速度
  TASK_PATH_STATUS: 'taskPathStatus', // 任务路径状态

  MSG_MAP_ENGINE_WARNING: 'MsgMapEngineWarning', // 车辆预警信息，3S发送一次
  CLEAN_DUMP_TASK: 'CleanDumpTask', // 接受清理排土块任务
  CLEAN_DUMP_STATUS: 'CleanDumpStatus', //申请清理排土块
  DUMPLINE_DATA: 'DumplineData', // 获取排土块/排土点数据
  SET_DUMP_STATUS: 'SetDumpStatus', // 设置排土块的开启或者关闭状态
  SYNC_CLEAN_STATUS: 'syncCleanStatus', // 平台同步推土机排土任务进度

  WORKAREA_BLOCKED: 'workAreaBlocked', // 申请作业区解封/封锁
  WORKAREA_BLOCKED_LIST: 'workAreaBlockedList', // 反显作业区封锁状态
  GET_CURRENT_CAR_AREA_NUMBER: 'getCurrentCarAreaNumber', // 获取当前车辆作业区编号(前端->后端)
  CURRENT_CAR_AREA_NUMBER: 'CurrentCarAreaNumber', // 返回当前车辆作业区编号(后端-前端)

  SURROUNDING_VEHICLES_WARNING: 'surroundingVehiclesWarning', // 警示列表
  CLOSE_VOICE: 'closeVoice', // 暂时关闭语音播报
  MAP_TASK_INFO_LIST: 'MapTaskInfolist', // 获取/更新多车任务路径
  TASK_PATH_STATUS_LIST: 'taskPathStatusList', // 后端推送多车位置和路权终点索引
  MSG8108: 'Msg8108', // 行车许可展示
  VEHICLE_RUN_STATUS: 'vehicleRunStatus', // 车辆状态判定
  VEHICLE_RUN_STATUS_RESP: 'vehicleRunStatusResp', // 车辆状态判定确认
  VOICEPLAYVOLUME: 'VoicePlayVolume',

  // ---- 装载区预览功能 ----
  SEND_PREVIEW_DATA: 'sendPreviewData',
  GET_PREVIEW_DATA: 'getPreviewData',
  CONFIRM_USE_PREVIEW_DATA: 'confirmUsePreviewData',
};

export const COMMON_MODAL_TYPE = {
  IN_POSITION: 'in_position', // 就位
  READY_APPLY: 'ready_apply', // 就绪申请
  EXIT_COLLECT: 'exit_collect', // 退出采集
  UPLOAD_BOUNDARY: 'upload_boundary', //上传边界文件
  UPLOAD_SOIL_LINE: 'upload_soil_line', // 上传排土线文件
  UPLOAD_OBSTACLES_BOUNDARY: 'upload_obstacles_boundary', //上传障碍物边界文件
  SELECT_BERTH: 'select_berth', // 选定停靠位
  UPDATE_SOIL_LINE: 'update_soil_line', //更新排土线文件
  VEHICLE_RUN_STATUS: 'vehicle_run_status', // 车辆停车状态
};
