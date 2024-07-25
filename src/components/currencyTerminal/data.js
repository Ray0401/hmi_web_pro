import { getAssetsFile } from '@/utils/utils';

export const footerrightarrdata = [
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
    leftIcon: getAssetsFile('images/startGrey.png'),
    rightIcon: getAssetsFile('images/stopCollect.png'),
  },
  // {
  //   leftIcon: getAssetsFile('images/startCollect.png'),
  //   rightIcon: getAssetsFile('images/stopCollectUnused.png'),
  // },
  // {
  //   leftIcon: '/assets/images/pauseCollect.png',
  //   rightIcon: getAssetsFile('images/stopCollect.png'),
  // },
  // {
  //   leftIcon: getAssetsFile('images/startCollect.png'),
  //   rightIcon: getAssetsFile('images/stopCollect.png'),
  // },
];
export const collectFaultText = {
  7: '建图异常',
  1: '点云数据异常',
  2: '组合导航数据异常',
  3: '差分状态异常',
  4: '相机数据异常',
  5: '点云与组合导航同步异常',
  6: '建图文件上传失败',
};
export const collectFaultVoice = {
  7: '建图异常，请停车等待',
  1: '点云数据异常，请停车等待',
  2: '组合导航数据异常，请停车等待',
  3: '差分状态异常，请停车等待',
  4: '相机数据异常，请停车等待',
  5: '点云与组合导航同步异常，请停车等待',
  6: '上传失败，请检查网络后重新上传',
};
