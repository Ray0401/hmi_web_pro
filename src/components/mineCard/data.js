/*
 * @Author: 徐海瑞
 * @Date: 2022-12-26 13:25:22
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-07-16 17:35:01
 */

import { getAssetsFile } from '@/utils/utils';

export const preWarningList = {
  0: {
    id: 0,
    src: getAssetsFile('images/preWarningTernimal/offset.png'),
  },
  1: {
    id: 1,
    src: getAssetsFile('images/preWarningTernimal/rain.png'),
  },
  2: {
    id: 2,
    src: getAssetsFile('images/preWarningTernimal/boom.png'),
  },
  3: {
    id: 3,
    src: getAssetsFile('images/preWarningTernimal/snow.png'),
  },
  4: {
    id: 4,
    src: getAssetsFile('images/perceptionClose.png'),
  },
  6: {
    id: 6,
    src: getAssetsFile('images/fileList.png'),
  },
  5: {
    id: 5,
    src: getAssetsFile('images/alarmMessage.png'),
  },
};
export const footerrightarrdata = [
  {
    index: 1,
    icon: getAssetsFile('images/work.png'),
    iconclick: getAssetsFile('images/workClick.png'),
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
export const collectIconList = [
  {
    leftIcon: getAssetsFile('images/startCollect.png'),
    rightIcon: getAssetsFile('images/stopCollectUnused.png'),
  },
  {
    leftIcon: getAssetsFile('images/pauseCollect.png'),
    rightIcon: getAssetsFile('images/stopCollect.png'),
  },
  {
    leftIcon: getAssetsFile('images/startCollect.png'),
    rightIcon: getAssetsFile('images/stopCollect.png'),
  },
];
export const carIconArr = [
  getAssetsFile('images/unknown.png'),
  getAssetsFile('images/emptyLoad.png'),
  getAssetsFile('images/fullLoad.png'),
  getAssetsFile('images/halfLoad.png'),
  getAssetsFile('images/collectArea.png'),
];
export const signalStatusarr = [
  'images/wifi0.png',
  'images/wifi1.png',
  'images/wifi2.png',
  'images/wifi3.png',
  'images/wifi4.png',
  'images/wifi5.png',
];
export const stateArr = [
  {
    icon: getAssetsFile('images/stateicon1.png'),
    text: 'ready',
  },
  {
    icon: getAssetsFile('images/stateicon2.png'),
    text: 'delay',
  },
  {
    icon: getAssetsFile('images/stateicon3.png'),
    text: 'fault',
  },
  {
    icon: getAssetsFile('images/stateicon4.png'),
    text: 'spare',
  },
  {
    icon: getAssetsFile('images/stateicon5.png'),
    text: 'unknown',
  },
  {
    icon: '',
    text: '',
  },
];
//workDialog
export const unloadingConditionList = [
  {
    title: 'unloadingStatus',
    iconList: [
      {
        icon: getAssetsFile('images/emptyLoading.png'),
        iconclick: getAssetsFile('images/emptyLoadingClick.png'),
        text: 'emptyLoading',
        clickFlag: false,
        id: 0x01,
      },
      {
        icon: getAssetsFile('images/fullUnloading.png'),
        iconclick: getAssetsFile('images/fullUnloadingClick.png'),
        text: 'fullLoadUnloading',
        clickFlag: false,
        id: 0x02,
      },
    ],
  },
  {
    title: 'exceptionHandling',
    iconList: [
      {
        icon: getAssetsFile('images/emptyUnloading.png'),
        iconclick: getAssetsFile('images/emptyUnloadingClick.png'),
        text: 'emptyUnloading',
        clickFlag: false,
        id: 0x04,
      },
      {
        icon: getAssetsFile('images/halfUnloading.png'),
        iconclick: getAssetsFile('images/halfUnloadingClick.png'),
        text: 'halfLoadUnloading',
        clickFlag: false,
        id: 0x03,
      },
    ],
  },
];
export const testitemlist = [
  {
    title: 'test',
    showFlag: false,
    iconlist: [
      {
        icon: getAssetsFile('images/statictest.png'),
        iconclick: getAssetsFile('images/staticTestClick.png'),
        text: 'staticTest',
        id: 1,
      },
      {
        icon: getAssetsFile('images/dynamictest.png'),
        iconclick: getAssetsFile('images/dynamicTestClick.png'),
        text: 'dynamicsTest',
        id: 2,
      },
    ],
  },
  {
    title: 'jobOperation',
    showFlag: false,
    iconlist: [
      {
        icon: getAssetsFile('images/cargoState.png'),
        iconclick: getAssetsFile('images/cargoStateClick.png'),
        text: 'unloadingStatus',
        id: 3,
      },
      {
        icon: getAssetsFile('images/collectPath.png'),
        iconclick: getAssetsFile('images/collectPathClick.png'),
        text: 'collectionPath',
        id: 4,
      },
      {
        icon: getAssetsFile('images/dynamictest.png'),
        iconclick: getAssetsFile('images/dynamicTestClick.png'),
        text: 'c_perceptionCollection',
        id: 10,
      },
      {
        icon: getAssetsFile('images/uploadLog.png'),
        iconclick: getAssetsFile('images/uploadLogClick.png'),
        text: 'uploadLog',
        id: 6,
      },
      {
        icon: getAssetsFile('images/alarmSet.png'),
        iconclick: getAssetsFile('images/alarmSetClick.png'),
        text: 'AlarmSettings',
        id: 5,
      },
    ],
  },
  {
    title: 'statusSetting',
    showFlag: true,
    iconlist: [
      {
        icon: getAssetsFile('images/readyApply.png'),
        iconclick: getAssetsFile('images/readyApplyClick.png'),
        text: 'readyToApply',
        id: 7,
      },
      {
        icon: getAssetsFile('images/delayApply.png'),
        iconclick: getAssetsFile('images/delayApplyClick.png'),
        text: 'delayToApply',
        id: 8,
      },
      {
        icon: getAssetsFile('images/faultApply.png'),
        iconclick: getAssetsFile('images/faultApplyClick.png'),
        text: 'faultToApply',
        id: 9,
      },
    ],
  },
];
export const reasonList = [
  {
    label: 'check',
    value: '0x0001',
  },
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
    label: 'other',
    value: '6',
  },
];
export const timeList = [
  {
    label: `minute15`,
    value: '15',
  },
  {
    label: `minute30`,
    value: '30',
  },
  {
    label: `minute60`,
    value: '60',
  },
];
export const breakReasonList = [
  {
    label: 'motorFault',
    value: '0x0001',
  },
  {
    label: 'brakeFault',
    value: '0x0002',
  },
  {
    label: 'engineFault',
    value: '0x0003',
  },
  {
    label: 'otherFault',
    value: '0x0FFF',
  },
];
export const modeList = [
  {
    type: 'auto',
    modeIndex: 1,
  },
  {
    type: 'manual',
    modeIndex: 0,
  },
  {
    type: 'control',
    modeIndex: 2,
  },
];
