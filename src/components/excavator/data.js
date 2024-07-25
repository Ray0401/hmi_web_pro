import { getAssetsFile } from '@/utils/utils';

export const AllReasonList = [
  { label: 'changeShifts', value: '0x0002' },
  { label: 'workMeal', value: '0x0003' },
  { label: 'pushShovelSilver', value: '0x0004' },
  { label: 'DodgeCannon', value: '0x0005' },
  { label: 'sweepGoods', value: '0x0007' },
  { label: 'fallGoods', value: '0x0008' },
  { label: 'shift', value: '0x0009' },
  { label: 'digging', value: '0x000A' },
  { label: 'powerFailure', value: '0x000B' },
  { label: 'shortTermFault', value: '0x0006' },
  { label: 'loseCusp', value: '0x000C' },
  { label: 'digPumpPit', value: '0x000D' },
  { label: 'invertedCable', value: '0x000E' },
  { label: 'other', value: '0x0FFF' },
];
export const breakReasonList = [
  { label: '电机故障', value: '0x0001' },
  { label: '电缆断线', value: '0x0002' },
  { label: '断钢缆', value: '0x0003' },
  { label: '其他故障', value: '0x0FFF' },
];
export const materialList = [
  { name: '低磁', materialNum: '1' },
  { name: '高磁', materialNum: '2' },
  { name: '高氧', materialNum: '3' },
  { name: '低氧', materialNum: '4' },
  { name: '白云岩', materialNum: '5' },
  { name: '废岩', materialNum: '6' },
  { name: '大块', materialNum: '7' },
  { name: '土方', materialNum: '8' },
  { name: '粘性物料', materialNum: '9' },
];
// export const timeList = [
//   { label: '15分钟', value: '15' },
//   { label: '30分钟', value: '30' },
//   { label: '60分钟', value: '60' },
// ];
export const testitemlist = [
  { title: 'changeMaterial', showFlag: false },
  { title: 'compensation', showFlag: false },
  {
    title: 'rgnloadModeSetting',
    showFlag: false,
    modelist: [
      {
        label: '单侧装载',
        value: 0,
      },
      {
        label: '双侧装载',
        value: 1,
      },
    ],
  },
  {
    title: 'preStopSetting',
    showFlag: false,
  },
  {
    title: 'statusSetting',
    showFlag: false,
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
  // {
  //   title: '正向不可驶入区域设定',
  //   showFlag: false,
  //   radioList: [
  //     {
  //       label: '系统默认',
  //       value: 0,
  //     },
  //     {
  //       label: '自定义',
  //       value: 1,
  //     },
  //   ],
  // },
];
export const directionDate = [
  {
    index: 1,
    icon: getAssetsFile('images/excavator/confirm.png'),
    iconclick: getAssetsFile('images/excavator/confirmClick.png'),
    isClick: true,
  },
  {
    index: 2,
    icon: getAssetsFile('images/excavator/cancel.png'),
    iconclick: getAssetsFile('images/excavator/cancelClick.png'),
    isClick: true,
  },
];

export const stepDistanceBtnOpertaionList = [
  {
    index: 1,
    icon: getAssetsFile('images/excavator/confirm.png'),
    iconclick: getAssetsFile('images/excavator/confirmClick.png'),
    isClick: true,
  },
  {
    index: 2,
    icon: getAssetsFile('images/excavator/cancel.png'),
    iconclick: getAssetsFile('images/excavator/cancelClick.png'),
    isClick: true,
  },
];

export const footerrightarrdata = [
  {
    index: 1,

    icon: getAssetsFile('images/excavator/Operation.png'),
    iconclick: getAssetsFile('images/excavator/OperationClick.png'),
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
export const middleIconList = [
  {
    index: 1,
    icon: getAssetsFile('images/excavator/driveIn.png'),
    iconclick: getAssetsFile('images/excavator/driveIn.png'),
    text: 'driveInto',
  },
  {
    index: 2,
    icon: getAssetsFile('images/excavator/open.png'),
    iconclick: getAssetsFile('images/excavator/driveIn.png'),
    text: 'unpack',
  },
  {
    index: 3,
    icon: getAssetsFile('images/excavator/fullyLoaded.png'),
    iconclick: getAssetsFile('images/excavator/fullyLoaded.png'),
    text: 'driveAway',
  },
];
export const AreaCollect = [
  {
    index: 1,
    icon: getAssetsFile('images/excavator/boundStart.png'),
    text: '开始设定',
  },
  {
    index: 2,
    icon: getAssetsFile('images/excavator/boundStop.png'),
    text: '结束设定',
  },
  {
    index: 3,
    icon: getAssetsFile('images/excavator/reloadsetting.png'),
    text: '重置设定',
  },
];
export const reasonList = [
  { text: 'redock', value: 0x07 },
  { text: 'manualTakeover', value: 0x06 },
  // { text: 'resumeDriving', value: 0x05 },
  // { text: 'emergencyPullOver', value: 0x04 },
  { text: 'driveAwayEmpty', value: 0x01, type: 'loadStatus' },
  { text: 'driveAwayWithHalfLoad', value: 0x03, type: 'loadStatus' },
];
export const defaultPointItem = {
  stop_type: 1, //0:未知类型，1：停靠位，2：停靠位分组，3：预停靠位
  group_num: 1, //整数 ，分组编号,stop_type=2有效
  stop_num: 0, //整数，停靠位编号，stop_type=1,stop_type=3有效
  occupy: 0, //0未占用，1被占用,stop_type=1和stop_type=3时有效
  task: '', //任务状态，具体内容详见8.5“位置信息汇报”中的“任务执行状态”字段，没有被占用时本字段无效
  mode: '', //驾驶模式,具体内容详见8.5“位置信息汇报”中的“任务执行状态”字段，没有被占用时本字段无效
  imei: '', //占用车辆的imei，无占用时为空字符串
  name: '', //占用设备的名称
  stopReason: '', //停车原因列表,空字符串时UI不显示停车原因
  parent_group_num: '', //父分组编号，当stop_type=3时有效，其他为-1,暂时不用
  parent_stop_num: '', //父停靠位编号，只能时0或1，当stop_type=3时有效，其他为-1
  from: '',
};
export const defaultBilateralPointList = [{ ...defaultPointItem }, { ...defaultPointItem, stop_num: 1 }];

// 单侧装载自动指点模式list
export const singleModeList = [
  {
    label: '前向左',
    value: '2',
    icon: getAssetsFile('images/excavator/qianxiangzuo.png'),
    iconclick: getAssetsFile('images/excavator/qianxiangzuo_active.png'),
    click: false,
  },
  {
    label: '前向右',
    value: '3',
    icon: getAssetsFile('images/excavator/qianxiangyou.png'),
    iconclick: getAssetsFile('images/excavator/qianxiangyou_active.png'),
    click: false,
  },
  // {
  //   label: '侧向左',
  //   value: "4",
  //   icon: '/assets/images/excavator/cexiangzuo.png',
  //   iconclick: '/assets/images/excavator/cexiangzuo_active.png',
  //   click: false,
  // },
  // {
  //   label: '侧向右',
  //   value: "5",
  //   icon: '/assets/images/excavator/cexiangyou.png',
  //   iconclick: '/assets/images/excavator/cexiangyou_active.png',
  //   click: false,
  // },
];

// 双侧装载自动指点模式list
export const doubleModeList = [
  {
    label: '前向双',
    value: '6',
    icon: getAssetsFile('images/excavator/qianxiangshuang.png'),
    iconclick: getAssetsFile('images/excavator/qianxiangshuang_active.png'),
    click: false,
  },
  // {
  //   label: '侧向双',
  //   value: "7",
  //   icon: '/assets/images/excavator/cexiangshuang.png',
  //   iconclick: '/assets/images/excavator/cexiangshuang_active.png',
  //   click: false,
  // },
];

export const autoGivePointModeImgs = {
  2: getAssetsFile('images/excavator/qianxiangzuo_example.png'),
  3: getAssetsFile('images/excavator/qianxiangyou_example.png'),
  4: getAssetsFile('images/excavator/cexiangzuo_example.png'),
  5: getAssetsFile('images/excavator/cexiangyou_example.png'),
  6: getAssetsFile('images/excavator/qianxiangshuang_example.png'),
  7: getAssetsFile('images/excavator/cexiangshuang_example.png'),
};
