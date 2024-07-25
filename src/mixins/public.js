import { sendMsgToBackend, sendSocket } from '@/utils/utils';
import uploadApi from '@/api/upload';
import dayjs from 'dayjs';
import { MINE_CARD, ADOPT, SOIL, MAP_COLLECT, CURRENCY } from '@/constant/index';

export default {
  created() {
    this.$bus.$on('closeSocket', () => {
      this.showNum = 0;
      if (this.$store.state.messagelist[0]?.text != '网关已断开') {
        this.$store.commit('setMessageList', '网关已断开');
        sendMsgToBackend('网关已断开');
      }
    });
    this.$bus.$on('openSocket', () => {
      if (this.$store.state.messagelist[0]?.text != '网关已恢复') {
        this.$store.commit('setMessageList', '网关已恢复');
        sendMsgToBackend('网关已恢复');
      }
    });
    this.$bus.$on('websocketMessage', data => {
      if (this.showNum == 0) {
        this.showNum = 1;
        this.init();
      }
    });
  },
  data() {
    return {
      // 车辆类型对应表
      boudType: {
        车道线: 'MCP',
        道路边界: 'MCB',
        工作区边界: 'MCS',
        装载区边界: 'MCSL',
        卸载区边界: 'MCSU',
        障碍物边界: 'OCSL',
        排土线: 'MCDL',
        可停区: 'MCPARK',
        未知: 'UNKOWN',
      },
      upload: false,
      // 上传进度信息
      uploadInfo: {
        total: 0,
        current: 0,
      },
      //警示图标列表
      preWarning: [5],
      // 是否感知采集
      SensorCollect: false,
      showLeftPopup: false,
      popUpFlag: false,
      // 感知采集header头
      sensorCollectTitle: 'fault',
      // 感知采集状态
      sensorCollectState: '',
      // 感知故障列表
      sensorCollectFaultList: [],
      // 感知上传失败文件列表
      sensorCollectFileList: [],
      // 感知采集警示图标
      sensorCollectPreWarning: [],
      // 暂存服务器同步的感知状态
      saveSensorCollectState: '',
      showModal: false,
      message: '',
      loading: false,
      collectState: 0, //储存采集状态
      collectList: [], //采集的数据
      sensorCollectTimer: null, // 响应时间
      sensorCollectFaultTimer: null, //采集故障时间
      positionTimer: null, //车辆位置更新频率
      collectCarStop: 1, //采集停车
      versionList: [], //版本号
      collectFileListPoint: [], // 优化性能，需绘制的采集边界数组
      collectFileListTimer: null, // 绘制边界间隔时间
      collectCarStopStatus: false,
    };
  },
  watch: {
    SensorCollect(val) {
      if (val) {
        this.setSensorCollectStatus(this.sensorCollectState || -1);
      }
    },
  },
  methods: {
    confirm() {
      this.showModal = false;
    },
    // 公共注册方法
    init() {
      let type = this.$store.state.vehicleData.terminalType;
      sendSocket({
        type: 'Version',
        data: [{ type: 'HMI', version: this.$store.state.HMI_VERSION }],
      });
      if (type == ADOPT) {
        sendSocket(['MaterialList']);
        sendSocket({
          type: 'warnSwitch',
          on: false,
        });
      }
      if ([MINE_CARD, MAP_COLLECT, CURRENCY].includes(type)) {
        if (type == MINE_CARD) {
          sendSocket(['loadMaterialDest']);
        }
        sendSocket(['RTK5G4G', 'faultSwitch', 'faultStatus', 'WeatherMode']);
      }
    },
    // 更新采集页面状态
    setSensorCollectStatus(type) {
      let statusList = {
        0: '未开始采集',
        1: '采集任务响应',
        2: '采集准备就绪',
        3: '采集中',
        4: '结束采集响应中',
        5: '建图文件上传中',
        6: '建图文件上传成功',
        7: '建图文件上传失败',
        8: '待响应',
        9: '预览中',
        10: '等待预览文件处理',
      };
      this.$store.commit('setSensorCollectState', statusList[type] || '');
      // 采集中状态处理
      if (type == 3) {
        this.$nextTick(() => {
          this.$refs['sensorCollect'].startcollect();
        });
      }
      // 结束采集响应处理
      if (type == 4) {
        if (this.saveSensorCollectState == '预览') {
          this.saveSensorCollectState = '';
          this.modeFlag = 1;
          this.setSensorCollectStatus(10);
        }
        this.$nextTick(() => {
          this.$refs['sensorCollect'].stopSensorCollect();
        });
      }
      // 建图文件上传中处理
      if (type == 5) {
        this.$nextTick(() => {
          this.$refs['sensorCollect'].stopSensorCollect();
        });
        this.upload = true;
        this.popUpFlag = true;
        this.collectState = 0;
      }
      // 建图上传成功/失败处理
      if (type == 6 || type == 7) {
        this.upload = false;
        this.popUpFlag = false;
        this.uploadInfo = Object.assign(this.uploadInfo, { total: 0, current: 0 });
        this.$nextTick(() => {
          this.$bus.$emit('sensorUploadStatus', { type: type == 6 ? 'success' : 'error' });
        });
      }
    },
    // 创建定位采集文件名称
    createFileName(type, imei) {
      type = this.boudType[type] || type;
      let time = dayjs(new Date()).format('YYYYMMDDHHmmss');
      // time = time.replaceAll('-', '').replaceAll(':', '').replaceAll(' ', '');
      return `${type}_${imei}_${time}.lpx`;
    },
    collectShowFlag(item) {
      if (item) {
        this.SensorCollect = false;
        this.collectInfo = item;
      } else {
        this.SensorCollect = true;
        this.collectInfo = null;
      }
      this.modeFlag = 2;
      this.rmodeFlag = false;
      this.workFlag = false;
    },
    // 左上角故障/未上传文件点击事件
    callbtnclick(data) {
      if (data.data == 5) {
        if (this.SensorCollect) {
          this.sensorCollectTitle = 'fault';
          this.showLeftPopup = !this.showLeftPopup;
        } else {
          this.messagelistFlag = !this.messagelistFlag;
        }
      }
      if (data.data == 6) {
        this.sensorCollectTitle = 'uploadFile';
        this.showLeftPopup = !this.showLeftPopup;
      }
    },
    // 开始采集
    setCollectState(data) {
      if (this.SensorCollect) {
        if (
          data.data == 10 &&
          !['待响应', '采集任务响应', '采集准备就绪', '采集中'].includes(this.$store.state.sensorCollectState)
        ) {
          sendSocket({
            type: 'SensorCollect',
            process: 'start',
          });
          this.setSensorCollectStatus(8);
          this.sensorCollectTimer = setTimeout(() => {
            this.$refs['sensorCollect'].showTimeOutModal('响应超时，请重试', 0);
          }, 3000);
        }
      } else {
        this.collectState = data?.data;
        if (this.collectState == 1) this.clearCollectList();
      }
    },
    // 退出采集
    exitconfirmbtn() {
      if (this.SensorCollect && this.$store.state.sensorCollectState != '未开始采集') {
        sendSocket([
          {
            type: 'SensorCollect',
            process: 'end',
          },
          {
            type: 'SensorCollectData',
            status: 'delete',
            name: '',
          },
        ]);
      }
      this.modeFlag = 1;
      this.rmodeFlag = true;
      this.clearCollectList();
      this.SensorCollect = false;
      this.$bus.$emit('resetBtnClickIndex');
    },
    // 点击预览采集文件
    previewCollect() {
      this.popUpFlag = false;
      this.$refs['sensorCollect'].stopSensorCollect();
      if (this.$store.state.sensorCollectState == '采集中') {
        sendSocket([
          {
            type: 'SensorCollect',
            process: 'end',
          },
          {
            type: 'SensorCollectData',
            status: 'preview',
            name: '',
          },
        ]);
        this.setSensorCollectStatus(8);
        this.saveSensorCollectState = '预览';
        this.sensorCollectTimer = setTimeout(() => {
          this.$refs['sensorCollect'].showTimeOutModal('响应超时，请重试', 1);
        }, 3000);
      } else {
        this.modeFlag = 1;
        this.setSensorCollectStatus(9);
        this.$bus.$emit('MapcuReview');
      }
    },
    onOpenPopup() {
      this.popUpFlag = true;
    },
    // 退出预览
    stopPreview() {
      this.modeFlag = 2;
      this.popUpFlag = true;
      this.$bus.$emit('deleteSensorCollect');
      this.setSensorCollectStatus(4);
    },
    clearCollectList() {
      this.collectList = [];
      this.collectFileListPoint = [];
    },
    //上传文件
    popUpClick(e) {
      this.popUpFlag = false;
      if (!this.SensorCollect) {
        if (e == 12) this.clearCollectList();
        if (e == 11) {
          let strData = '';
          let gpsoffset = this.$store.state.vehicleData.gpsOffset2Boundary;
          let fileName = this.createFileName(this.collectInfo?.borderValue || 'MCP', this.$store.state.carInfo.imei);
          for (let item of this.collectList) {
            let string = '';
            if (item.GPS != 0) {
              // 车端跟平台 定位定义不一致，需取反
              item.GPS = item.GPS == 1 ? 2 : 1;
            }
            if (!this.currencyTerminal)
              string = `$,${item.heading},${item.lat},${item.lon},${item.alt},${item.speed},${item.ACCY},${item.ACCX},${item.ACCAng},${item.GPS},00,00,`;
            if (this.currencyTerminal) {
              string = `$,${item.heading},${item.lat},${item.lon},${item.alt},${
                this.collectInfo.directionValue == 1 ? 2 : 1
              },${gpsoffset},${item.GPS},00,00,`;
            }
            let strSplit = string.split('');
            let count = strSplit[0];
            for (let i = 1; i < strSplit.length; i++) {
              count = count ^ strSplit[i];
            }
            let str = count.toString(16).toLocaleUpperCase();
            string = `${string}*${str.length == 1 ? '0' : ''}${str}\n`;
            strData += string;
          }
          let formData = new FormData();
          let file = new File([strData], fileName);
          let data = {
            file,
            materialname: fileName,
            chuncks: 1,
            filemd5: this.md5(strData),
            chunck: 0,
            chunckmd5: this.md5(strData),
            collectstarttime: this.$store.state.collectStartTime,
            collectendtime: this.$store.state.collectEndTime,
            geoextent: '',
            productionmode: 'GPS',
            formatversion: 'v1.5',
          };
          data.rgntype = this.$store.state.carInDumpPosition.map_type || -1;
          data.rgnobjectid = this.$store.state.carInDumpPosition.object_id || -1;
          Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
          });
          this.showModal = true;
          this.message = '上传中';
          this.loading = true;
          uploadApi.uploadCollectFile(formData).then(
            res => {
              // 这里就是返回的字符串, 高精地图接口无法修改,只能这么去判断了
              if (res.includes(`\"status\":\"200\"`)) {
                this.clearCollectList();
                sendSocket({
                  type: 'UploadFile',
                  fileName: fileName,
                });
                this.showModal = true;
                this.message = '上传成功';
                this.loading = false;
                this.modeFlag = this.currencyTerminal ? 3 : 1;
                this.rmodeFlag = true;
                this.$bus.$emit('resetBtnClickIndex');
                this.$store.commit('setMessageList', '路径数据上传成功');
                sendMsgToBackend('路径数据上传成功');
              }
            },
            error => {
              this.showModal = true;
              this.message = '上传失败';
              this.loading = false;
              this.$store.commit('setMessageList', '路径数据上传失败');
              sendMsgToBackend('路径数据上传失败');
            }
          );
        }
      } else {
        if (e == 11) {
          this.$refs['sensorCollect'].stopSensorCollect();
          sendSocket([
            {
              type: 'SensorCollect',
              process: 'end',
            },
            {
              type: 'SensorCollectData',
              status: 'upload',
              name: '',
            },
          ]);
          this.sensorCollectTimer = setTimeout(() => {
            this.$refs['sensorCollect'].showTimeOutModal('响应超时，请重试', 1);
          }, 3000);
        }
      }
    },
    // 判断两个对象的所有的key/value 都相同
    isObjectValueEqual(a, b) {
      const aProps = Object.keys(a);
      const bProps = Object.keys(b);
      // length不同,说明两个对象肯定不同
      if (aProps.length != bProps.length) return false;
      // 循环,若有一个不同,两个对象肯定不同
      for (let i = 0; i < aProps.length; i++) {
        let propName = aProps[i];

        if (propName == 'lon' || propName == 'lat') {
          if (Number(a[propName]).toFixed(6) != Number(b[propName]).toFixed(6)) return false;
        }

        // if (a[propName] !== b[propName]) {
        //   return false;
        // }
      }
      // 否则 两个对象相同
      return true;
    },
  },
  beforeDestroy() {
    // this.$bus.$off('websocketMessage');
  },
};
