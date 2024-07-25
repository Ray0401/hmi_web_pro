import { sendSocket, speak, matchWorkArea, sendMsgToBackend, getAssetsFile } from '@/utils/utils';
import { collectFaultText, collectFaultVoice } from '../../components/currencyTerminal/data';
import { ADOPT } from '@/constant/index';
import { BUILD_DATE } from '../../../buildId';
let rtkTime = null;
export const PUBLIC_SOCKET_MESSAGE = that => {
  return {
    // 发送HMI版本
    ReqVersion: data => {
      sendSocket({ type: 'SyncBuildId', buildId: that.$store.state.HMI_VERSION, buildTime: BUILD_DATE });
    },
    // 接收其他模块版本
    Version: data => {
      data = Array.from(data.data);
      that.versionList = data;
    },
    //语音播报
    SoundPlay: data => {
      speak(data.data, data.level || 6);
    },
    // wifi信号
    RTK5G4G: data => {
      that.headerListData.rtkstate = data.RTK;
      that.headerListData.networkstate[0] = data.mboxNetmode;
      that.headerListData.networkstate[1] = data.tboxNetmode;
      that.headerListData.signalStatus[0] = data.mboxSignal;
      that.headerListData.signalStatus[1] = data.tboxSignal;
      clearTimeout(rtkTime);
      rtkTime = setTimeout(() => {
        rtkTime = null;
        that.headerListData.rtkstate = '';
        that.headerListData.networkstate = [];
        that.headerListData.signalStatus = [];
      }, 2000);
    },
    // 消息提醒
    showMessage: data => {
      const a = data.time.split(' ');
      if (data.debug == 'false') {
        let b = {
          time: a[1],
          text: data.message,
        };
        that.$store.commit('setMessageList', b);
        sendMsgToBackend(b);
      }
      if (data.debug == 'true') {
      }
    },
    // 通知地图绘制周边车辆信息
    aroundWarning: data => {
      const list = data.data.filter(item => item.name);
      that.$bus.$emit('aroundCarList', list);
    },
    // 运营状态
    OperationStatus: data => {
      let state = data.state;
      let options = {
        就绪: 0,
        延时: 1,
        故障: 2,
        备用: 3,
        未知: 4,
      };
      that.headerListData.state = options[data.state];
      that.headerListData.stateText = `${data.state}${data.reason || ''}`;
    },
    //接收车辆位置信息
    Position: data => {
      if (data.data?.lon == 'nan') return false;

      if (!that.positionTimer) {
        that.positionTimer = setTimeout(() => {
          clearTimeout(that.positionTimer);
          that.positionTimer = null;
          that.$bus.$emit('carPosition', data.data);
        }, 500);
      }
      // 采集路径
      if (that.collectState === 1 && !that.SensorCollect) {
        //防止同一位置多次采集
        if (that.collectList?.length) {
          let obj = that.collectList.at(-1);
          let bool = that.isObjectValueEqual(obj, data.data);
          if (!bool) {
            that.collectList.push(data.data);
            if (!that.collectFileListTimer) {
              // 保证车辆位置更新 & 采集路径更新同步
              if (!that.collectCarStopStatus) {
                clearTimeout(that.positionTimer);
                that.positionTimer = null;
                that.collectCarStopStatus = true;
              }
              // 采用抽点形式，避免采集过长卡顿问题
              that.collectFileListTimer = setTimeout(() => {
                clearTimeout(that.collectFileListTimer);
                that.collectFileListTimer = null;
                that.collectFileListPoint.push(JSON.parse(JSON.stringify(data.data)));
              }, 500);
            }
            that.collectCarStop = 1;
          } else if (that.collectCarStop == 1) {
            // 停车状态，同步最后位置，避免线跟不上车的问题
            setTimeout(() => {
              if (that.collectCarStop == 2) {
                that.collectFileListPoint.push(JSON.parse(JSON.stringify(data.data)));
              }
            }, 600);
            that.collectCarStop = 2;
          }
        } else {
          that.collectList.push(data.data);
          that.collectFileListPoint.push(data.data);
        }
      } else {
        that.collectCarStopStatus = false;
      }
    },
    //天气状态
    WeatherMode: data => {
      let index = that.preWarning.indexOf(3);
      if (data.drivingMode == '\x01' && index > -1) that.preWarning.splice(index, 1);
      if (data.drivingMode == '\x02' && index < 0) that.preWarning.push(3);
    },
    // 路权信息
    taskPathStatus: data => {
      that.$bus.$emit('taskPathStatus', data);
    },
    // 驾驶模式
    driveMode: data => {
      that.drivemode = parseInt(data.driveMode);
    },
    // 车辆油门
    gearAcceleratorBrake: data => {
      that.$bus.$emit('gearAcceleratorBrake', data);
    },
    //接收状态，作业区域等信息
    loadMaterialDest: data => {
      let options = {
        // 0: '未知',
        1: '装载',
        // 2: '满载',
        // 3: '半载',
      };
      that.headerListData.carindex = data.load;
      that.headerListData.option = options[data.load] || '卸载';
      that.headerListData.oretext = data.material;
      that.headerListData.area = data.dest;
      that.$bus.$emit('stopReason', data.stopReason?.replaceAll('|', '<br/>').trim());
      that.$bus.$emit('task', data.task);
    },
    // 告警开关
    warnSwitch: data => {
      that.warnSwitch = Boolean(data.on);
      let index = that.preWarning.indexOf(0);
      if (that.warnSwitch && index < 0) that.preWarning.push(0);
      if (!that.warnSwitch && index > -1) that.preWarning.splice(index, 1);
    },
    // 车辆信息
    UploadUrl: data => {
      that.uploadAddr = data.uploadAddr;
      that.$bus.$emit('carName', { data: data.devName });
      that.$bus.$emit('equipmentNum', data.imei);
      that.$store.commit('setCarInfo', data);
    },
    // 检测关闭信息
    faultSwitch: data => {
      let arr = [];
      data.list &&
        data.list?.forEach(item => {
          arr.push({
            icon: '/assets/images/checkMessage.png',
            text: item,
          });
        });
      if (that.messageList) {
        that.messageList[1].content = arr;
      }
    },
    // 故障信息
    faultStatus2: data => {
      let arr = [];
      data.list &&
        data.list.forEach(item => {
          if (item.maincode) {
            let icon = getAssetsFile('images/faultInformationIcon.png');
            if (item.level == 2) icon = getAssetsFile('images/faultL2.png');
            if (item.level == 3) icon = getAssetsFile('images/faultL3.png');
            arr.push({
              icon: icon,
              text: item.maincode,
            });
          }
        });
      that.messageList && (that.messageList[0].content = arr);
    },
    // 车辆速度信息
    speed: data => {
      let speed = Math.round(Number(data.speed));
      let maxspeed = Math.round(Number(data.limitSpeed));
      speed = isNaN(speed) ? 0 : speed;
      maxspeed = isNaN(maxspeed) ? 0 : maxspeed;
      that.headerListData.realspeed = speed;
      that.headerListData.maxspeed = maxspeed;
      if (that.SensorCollect && speed > (that.$store.state.carInfo?.sensorCollectSpeedLimit || 20)) {
        speak('已超速，请减速', 6);
      }
    },
    //上传文件结果
    UploadFileResult: data => {
      that.fileupload = data.data;
    },
    // 偏离告警
    offset: data => {
      that.driveData.distance = parseInt(data.distance);
      that.driveData.direction = 'left';
      if (data.direction > 0) that.driveData.direction = 'right';
      that.driveData.modeindex.push(4);
      that.setTimer(2000, 4, 'offset');
    },
    // 周边车辆预警
    AroundHeading: data => {
      that.driveData.rotatedeg = data.data;
      that.driveData.modeindex.push(3);
      that.setTimer(5000, 3, 'AroundHeading');
    },
    // 逆行预警
    retrograde: data => {
      that.driveData.modeindex.push(2);
      that.setTimer(2000, 2, 'retrograde');
    },
    //障碍物预警
    obstruction: data => {
      that.driveData.modeindex.push(5);
      that.driveData.obstaclesType = data.obstaclesType;
      that.driveData.obstructionDistance = Number(data.distance).toFixed(1);
      that.setTimer(5000, 5, 'obstruction');
    },
    //故障弹窗
    popup: data => {
      that.defaultList.defaulttitle = data.title;
      that.defaultList.defaultcontent = data.data;
      that.defaultList.blink = Boolean(data.blink);
      that.defaultList.okButton = Boolean(data.okButton);
      that.showDefalutFlag = true;
    },
    //感知采集状态
    SensorCollectStatus: data => {
      that.sensorCollectState = data.status; //保存采集状态
      if (!that.SensorCollect) return false; //不是采集页面退出函数， 是采集页面继续往下走
      clearTimeout(that.sensorCollectTimer); // 清除3s计时器
      that.setSensorCollectStatus(data.status); // 根据采集状态设置采集页面显示
    },
    // 感知故障
    SensorCollectFaults: data => {
      if (!that.SensorCollect) return false;
      let index = that.sensorCollectPreWarning.indexOf(5);
      if (data.faultList?.length && index < 0) {
        that.sensorCollectPreWarning.push(5);
        that.$refs['sensorCollect']?.showTimeOutModal('系统故障，请及时处理');
        that.sensorCollectFaultTimer = setTimeout(() => {
          that.$store.commit('setMessageList', '故障未恢复，请结束采集');
          sendMsgToBackend('故障未恢复，请结束采集');

          //语音提示
          speak('故障未恢复，请结束采集', 6);
        }, 30000);
      }
      // 计算故障新增还是删除
      let addFault = [],
        deleteFault = [];
      let oldlist = that.sensorCollectFaultList;
      let newlist = data.faultList || [];
      let list = oldlist.length > newlist.length ? oldlist : newlist;
      for (let i = 0; i < list.length; i++) {
        let oldF = oldlist.includes(list[i]);
        let newF = newlist.includes(list[i]);
        if (oldF && newF) continue;
        if (oldF && !newF) deleteFault.push(list[i]);
        if (!oldF && newF) addFault.push(list[i]);
      }
      deleteFault.map(item => {
        that.$store.commit('setMessageList', `${collectFaultText[item]}已清除`);
        sendMsgToBackend(`${collectFaultText[item]}已清除`);

        speak(collectFaultVoice[item], 6);
        //语音提示
      });
      addFault.map(item => {
        that.$store.commit('setMessageList', collectFaultText[item]);
        sendMsgToBackend(collectFaultText[item]);

        speak(collectFaultVoice[item], 6);
        //语音提示
      });
      if (!data.faultList?.length && index > -1) {
        that.sensorCollectPreWarning.splice(index, 1);
        clearTimeout(that.sensorCollectFaultTimer);
        that.$store.commit('setMessageList', '故障已全部消除，请继续采集');
        sendMsgToBackend('故障已全部消除，请继续采集');
        speak('故障已全部消除，请继续采集', 6);
        //语音提示
      }
      that.sensorCollectFaultList = data.faultList;
    },
    // 感知上传失败列表
    SensorCollectFaultFiles: data => {
      let index = that.sensorCollectPreWarning.indexOf(6);
      data.fileList = data.fileList || [];
      if (data.fileList?.length && index < 0) that.sensorCollectPreWarning.push(6);
      if (!data.fileList?.length && index > -1) that.sensorCollectPreWarning.splice(index, 1);
      let map = data.fileList.map(item => item.name);
      that.sensorCollectFileList = map;
    },
    //感知采集上传进度
    SensorCollectProgress: data => {
      that.uploadInfo = data;
    },
    MapcuReview: data => {
      that.setSensorCollectStatus(9);
    },
    // 同步音量
    VoicePlayVolume: data => {
      that.$store.commit('setVolume', data.volume);
    },
    MsgMapEngineWarning: data => {
      that.$store.commit('setCarInDumpPosition', data.data);
      // 电铲显示区域名称
      if (that.$store.state.vehicleData.terminalType == ADOPT && that.rgnLoadData.length) {
        let mapType = data.data.map_type;
        let id = data.data.object_id;
        for (let i = 0; i < that.rgnLoadData.length; i++) {
          if (that.rgnLoadData[i].type == mapType && that.rgnLoadData[i].object_id == id) {
            that.headerListData.area = that.rgnLoadData[i].name;
            break;
          }
        }
      }
      // 采集终端/通用终端显示车辆所在区域
      if (that.currencyTerminal) {
        let area = matchWorkArea(data.data.map_type) || null;
        if (area) {
          that.headerListData.area = `${area.text}${area.en}#${data.data.object_id}`;
        } else {
          that.headerListData.area = '未在地图区域';
        }
      }
    },
    PublicMessageTips(data) {
      that.showModal = true;
      that.message = data.message;
      if (data.message?.includes('当前指点停靠位')) {
        that.$bus.$emit('planningError');
      }
    },
    mapSleep: data => {
      that.mapSleep = Number(data.data);
    },
  };
};
