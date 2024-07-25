/*
 * @Author: 徐海瑞
 * @Date: 2022-10-10 16:59:34
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-07-15 17:49:11
 * 推土车相关常量
 */

import { getAssetsFile } from '@/utils/utils';

export const REACH_SAFE_AERA_TEXT = 't_confirmSecureArea';
export const TASK_TITLE_TEXT = 't_confirmSecureArea';
export const TASK_DETAIL_TEXT = '任务详情';
export const ON_CASTING_TEXT = '确认开放此排土区域?';
export const OFF_CASTING_TEXT = '确认关闭此排土区域?';
export const CASTING_TIPS_WARNING = '调度目标为该/区域的卡车将立即停车';
export const EXIT_DELETE_COLLECT__TEXT = 't_confirmExitAndDeleteCollectionData';
export const READY_APPLY_STATUS_TEXT = 't_confirmApplyReadyStatus';
export const UPLOAD_BOUNDARY_TEXT = 't_confirmUploadBoudary';
export const UPLOAD_SOIL_LINE_TEXT = 't_confirmUploadSoilLine';
export const UPLOAD_OBSTACLES_BOUNDARY_TEXT = 't_confirmUploadObstaclesBoundary';
export const SELECT_BERTH_TEXT = 't_confirmSelectBerth';
export const UPDATE_SOIL_LINE_TEXT = 't_confirmUpdateSoilLine';

export const MESSAGE_LIST = [];

export const HEADER_LIST = {
  area: '',
  materialicon: '/assets/images/excavator/mine.png',
  oretext: '低磁矿',
  number: 16,
  state: 0,
  signalStatus: [4, 5],
  rtkstate: 'RTK',
  networkstate: ['4G', '5G'],
  UTCtime: '',
};

export const FOOTER_RIGHT_ARR_DATA = [
  {
    index: 1,
    icon: getAssetsFile('images/digger/diggerWork.png'),
    iconclick: getAssetsFile('images/digger/diggerWorkClick.png'),
  },
  {
    index: 2,
    icon: getAssetsFile('images/logIn.png'),
    iconclick: getAssetsFile('images/logInClick.png'),
  },
  {
    index: 3,
    icon: getAssetsFile('images/setting.png'),
    iconclick: getAssetsFile('images/settingClick.png'),
  },
];

export const MIDDLE_ICON_LIST = {
  // 开始采集
  start: {
    startIcon: getAssetsFile('images/bulldozer/startEnabled.png'),
    stopIcon: getAssetsFile('images/bulldozer/stopDisabled.png'),
  },
  // 结束采集
  stop: {
    startIcon: getAssetsFile('images/bulldozer/startDisabled.png'),
    stopIcon: getAssetsFile('images/bulldozer/stopEnabled.png'),
  },
  // 障碍物采集下支持暂停采集
  pause: {
    startIcon: getAssetsFile('images/bulldozer/pauseEnabled.png'),
    stopIcon: getAssetsFile('images/bulldozer/stopEnabled.png'),
  },
  continue: {
    startIcon: getAssetsFile('images/bulldozer/startEnabled.png'),
    stopIcon: getAssetsFile('images/bulldozer/stopEnabled.png'),
  },
  // 选取作业区
  select: {
    select: getAssetsFile('images/bulldozer/select.png'),
    unselect: getAssetsFile('images/bulldozer/unselect.png'),
  },
};
export const WORK_ITEM_LIST = [
  {
    title: 't_collectionOperation',
    showFlag: false,
    iconlist: [
      {
        icon: getAssetsFile('images/digger/allDistrict.png'),
        iconclick: getAssetsFile('images/digger/allDistrictClick.png'),
        text: 't_boundaryCollect',
        id: 1,
      },
      {
        icon: getAssetsFile('images/digger/displacement.png'),
        iconclick: getAssetsFile('images/digger/displacementClick.png'),
        text: 't_soilCollect',
        id: 2,
      },
      {
        icon: getAssetsFile('images/digger/obstacles.png'),
        iconclick: getAssetsFile('images/digger/obstaclesClick.png'),
        text: 't_obstacleCollect',
        id: 3,
      },
      {
        icon: getAssetsFile('images/dynamictest.png'),
        iconclick: getAssetsFile('images/dynamicTestClick.png'),
        text: 'c_perceptionCollection',
        id: 4,
      },
    ],
    mustOpen: false,
  },
  // {
  //   title: 't_statusSetting',
  //   showFlag: true,
  //   mustOpen: true, // 必须展开,不能折叠
  //   iconlist: [
  //     {
  //       icon: '/assets/images/readyApply.png',
  //       iconclick: '/assets/images/readyApplyClick.png',
  //       text: 't_readyToApply',
  //       id: 7,
  //     },
  //     {
  //       icon: '/assets/images/delayApply.png',
  //       iconclick: '/assets/images/delayApplyClick.png',
  //       text: 't_delayToApply',
  //       id: 8,
  //     },
  //     {
  //       icon: '/assets/images/faultApply.png',
  //       iconclick: '/assets/images/faultApplyClick.png',
  //       text: 't_faultToApply',
  //       id: 9,
  //     },
  //   ],
  // },
];

export const DIRECTION_LIST = [
  {
    label: 'leftSide',
    value: 'left',
  },
  {
    label: 'rightSide',
    value: 'right',
  },
];
export const SOIL_TYPE_LIST = [
  {
    label: '边缘排土',
    value: 'edge',
  },
  {
    label: '场内排土',
    value: 'inside',
  },
];

export const REASON_LIST = [
  {
    label: 'changeShifts',
    value: '0x0002',
  },
  {
    label: 'workMeal',
    value: '0x0003',
  },
  {
    label: 'DodgeCannon',
    value: '0x0005',
  },
  {
    label: 'shortTermFault',
    value: '0x0006',
  },
  {
    label: 'fallGoods',
    value: '0x0008',
  },
  {
    label: 'other',
    value: '0x0FFF',
  },
];

export const BREAK_REASON_LIST = [
  {
    label: 't_equipmentFault',
    value: '0x0001',
  },
  {
    label: 't_fuselageOffline',
    value: '0x0002',
  },
  {
    label: 'other',
    value: '0x0FFF',
  },
];

export const TIME_LIST = [
  {
    label: 'minute15',
    value: '15',
  },
  {
    label: 'minute30',
    value: '30',
  },
  {
    label: 'minute60',
    value: '60',
  },
];
