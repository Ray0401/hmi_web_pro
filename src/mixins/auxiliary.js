/*
 * @Author: 徐海瑞
 * @Date: 2023-02-06 14:38:12
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-07-16 17:09:25
 *
 * 辅助终端公共逻辑
 */
import { getAssetsFile, sendMsgToBackend, sendSocket, speak } from '@/utils/utils';
import uploadApi from '@/api/upload';
import { mapState } from 'vuex';
import dayjs from 'dayjs';

import { COMMON_MODAL_TYPE, SOCKET_TYPE as TYPE } from '@/constant/index';

import {
  EXIT_DELETE_COLLECT__TEXT,
  READY_APPLY_STATUS_TEXT,
  UPLOAD_BOUNDARY_TEXT,
  UPLOAD_SOIL_LINE_TEXT,
  UPLOAD_OBSTACLES_BOUNDARY_TEXT,
  UPDATE_SOIL_LINE_TEXT,
} from '@/constant/bulldozer';
import { AUXILIARY_SOCKET_MESSAGE } from '@/constant/socketMessage/auxiliarySocketMessage';
const {
  READY_APPLY,
  UPLOAD_BOUNDARY,
  UPLOAD_SOIL_LINE,
  UPLOAD_OBSTACLES_BOUNDARY,
  UPDATE_SOIL_LINE,
  EXIT_COLLECT,
  VEHICLE_RUN_STATUS,
} = COMMON_MODAL_TYPE;

export default {
  data() {
    return {
      // 封闭解封作业区抽屉
      workAreaVisible: false,
      // 作业区名称
      workAreaName: '',
      // 作业区状态 0xAA未封锁 0x55已封锁
      workAreaStatus: '0xAA',
      // 作业区Type，2：装载区，3：卸载区/破碎站，4：停车场
      zone_type: '',
      // 作业区编号
      zone_id: '',
      // 图像警示弹窗
      warningData: {},

      // --- 公共弹窗相关 ---
      commonModalType: '', //公共弹窗类型,
      commonModalShowClose: true,
      commonModalBtnList: [
        {
          btnType: 'orange',
          text: this.toLang('confirm'),
          clickType: 'confirm',
        },
        {
          btnType: 'grey',
          text: this.toLang('cancel'),
          clickType: 'cancel',
        },
      ],
      commonModalFlag: false,
      commonModalMessage: '',
      commonModalTip: '',

      // --- 各个采集模式相关 ---
      collectFileState: 2, // 采集边界  1 开始 2结束 3暂停
      collectFileList: [], // 采集边界的数组
      // --- 上传弹窗相关 ---
      uploadFlag: false, // 上传弹窗
      uploadStatus: 'upload', // 上传文件过程   upload / success / failed
      uploadMessage: '上传中', // 上传文件时候的文案
      fileName: '', //上传文件名
      formData: null, // 上传文件formdata数据
      // --- 消息弹窗相关 ---
      messageTipsFlag: false,

      // 上传失败文件抽屉
      uploadFailedFileVisible: false,
      // 顶部icon列表
      iconList: [
        {
          isShow: false,
          name: 'uploadFileIcon',
          url: getAssetsFile('images/bulldozer/uploadFileIcon.png'),
        },
        {
          isShow: false,
          name: 'cleanTaskIcon',
          url: getAssetsFile('images/bulldozer/cleanTaskIcon.png'),
        },
      ],
      // 模式  =>  初始:initial ; 采集:collect; 选择作业区: workarea
      model: 'initial',
      positionTimer: null,
    };
  },

  computed: {
    ...mapState({
      collectConfig: state => state.bulldozer.collectConfig,
      gpsOffset: state => state.vehicleData.gpsOffset2Boundary,
    }),
  },

  created() {
    let auxiliaryMessage = AUXILIARY_SOCKET_MESSAGE(this);
    this.$bus.$on('websocketMessage', data => {
      if (auxiliaryMessage[data.type]) return auxiliaryMessage[data.type](data);
    });
    this.$bus.$on('closeSocket', () => {
      // 当网关断开时,若此时文件还在上传中,进行处理.
      if (this.uploadFlag) {
        this.onUploadFaild();
      }
    });

    // 订阅采集状态
    this.$bus.$on('startCollect', () => {
      this.model = 'collect';
    });
    // 打开作业区开放&封锁抽屉的订阅
    this.$bus.$on('openWorkAreaDrawer', ({ name, status, zone_type, zone_id }) => {
      this.$bus.$emit('resetBtnClickIndex');
      this.workFlag = false;
      this.settingFlag = false;
      this.userFlag = false;
      this.soilBlockDetailVisible = false;
      this.workAreaVisible = true; // 打开作业区弹窗
      this.workAreaName = name;
      this.workAreaStatus = status;
      this.zone_type = zone_type;
      this.zone_id = zone_id;
    });
    // 关闭作业区开放&封锁抽屉的订阅
    this.$bus.$on('closeWorkAreaDrawer', () => {
      this.closeWorkArea();
    });

    // 点击底部中间采集按钮组的订阅
    this.$bus.$on('openCommonModal', type => {
      this.commonModalFlag = true;
      this.commonModalType = type;
      switch (type) {
        // 申请就绪
        case READY_APPLY:
          this.commonModalMessage = this.toLang(READY_APPLY_STATUS_TEXT);
          break;
        // 上传边界
        case UPLOAD_BOUNDARY:
          this.commonModalMessage = this.toLang(UPLOAD_BOUNDARY_TEXT);
          this.commonModalShowClose = false;
          this.commonModalBtnList = [
            {
              btnType: 'orange',
              text: this.toLang('confirm'),
              clickType: 'confirm',
            },
            {
              btnType: 'red',
              text: this.toLang('discardFile'),
              clickType: 'cancel',
            },
          ];
          break;
        // 上传排土线
        case UPLOAD_SOIL_LINE:
          this.commonModalMessage = this.toLang(UPLOAD_SOIL_LINE_TEXT);
          this.commonModalShowClose = false;
          this.commonModalBtnList = [
            {
              btnType: 'orange',
              text: this.toLang('confirm'),
              clickType: 'confirm',
            },
            {
              btnType: 'red',
              text: this.toLang('discardFile'),
              clickType: 'cancel',
            },
          ];
          break;
        // 上传障碍物边界
        case UPLOAD_OBSTACLES_BOUNDARY:
          this.commonModalMessage = this.toLang(UPLOAD_OBSTACLES_BOUNDARY_TEXT);
          this.commonModalShowClose = false;
          this.commonModalBtnList = [
            {
              btnType: 'orange',
              text: this.toLang('confirm'),
              clickType: 'confirm',
            },
            {
              btnType: 'red',
              text: this.toLang('discardFile'),
              clickType: 'cancel',
            },
          ];
          break;

        // 更新排土线
        case UPDATE_SOIL_LINE:
          this.commonModalMessage = this.toLang(UPDATE_SOIL_LINE_TEXT);
          this.commonModalBtnList = [
            {
              btnType: 'orange',
              text: '是',
              clickType: 'confirm',
            },
            {
              btnType: 'grey',
              text: '否',
              clickType: 'cancel',
            },
          ];
          break;
        // 退出采集
        case EXIT_COLLECT:
          this.commonModalMessage = this.toLang(EXIT_DELETE_COLLECT__TEXT);
          this.commonModalBtnList = [
            {
              btnType: 'orange',
              text: this.toLang('confirm'),
              clickType: 'confirm',
            },
            {
              btnType: 'grey',
              text: this.toLang('cancel'),
              clickType: 'cancel',
            },
          ];

          break;

        case VEHICLE_RUN_STATUS:
          this.commonModalMessage = '车辆是否已停车?';
          this.commonModalShowClose = false;
          this.commonModalBtnList = [
            {
              btnType: 'orange',
              text: '是',
              clickType: 'confirm',
            },
            {
              btnType: 'grey',
              text: '否',
              clickType: 'cancel',
            },
          ];
          break;
        default:
          break;
      }
    });

    // 采集边界数据的订阅
    this.$bus.$on('changeBoundaryState', data => {
      this.collectFileState = data;
      if (data == 3) {
        let lastItem = this.collectFileList.at(-1);
        lastItem['pauseFlag'] = true; // 暂停标志位: 数组中的最后一个数据添加暂停标志位
        this.collectFileList.push({}); // 若手动暂停,push一个空对象
        this.collectFileListPoint.push({});
      }
    });
  },

  methods: {
    statebtn(index) {
      this.workFlag = false;
      this.settingFlag = false;
      this.userFlag = false;
      this.soilBlockDetailVisible = false;
      this.workAreaVisible = false;
      if (index == 1) {
        // 作业
        this.workFlag = true;
      } else if (index == 2) {
        // 用户
        this.userFlag = true;
      } else if (index == 3) {
        // 设置
        this.settingFlag = true;
      }
    },
    closeWorkArea() {
      this.workAreaVisible = false;
    },
    resetEmit() {
      this.$bus.$off('openWorkAreaDrawer');
      this.$bus.$off('closeWorkAreaDrawer');
    },

    // common-modal弹窗关闭
    commonModalClose() {
      this.commonModalFlag = false;
    },
    // !!! 点击common-modal组件中的<非确定>按钮
    commonModalCancel() {
      switch (this.commonModalType) {
        // 上传边界 - 否
        case UPLOAD_BOUNDARY:
        // 上传排土线 - 否
        case UPLOAD_SOIL_LINE:
        // 上传障碍物 - 否
        case UPLOAD_OBSTACLES_BOUNDARY:
          this.collectFileState = 2; // 将状态变更为2
          this.collectFileList = []; // 清空采集文件数据
          this.collectFileListPoint = [];
          this.$bus.$emit('resetMiddleIconList');
          this.$store.commit('bulldozer/setHasTargetWork', false);
          this.$store.commit('bulldozer/setCanClickMapWorkArea', false);
          break;

        // 更新排土线 - 否
        case UPDATE_SOIL_LINE:
          this.onCleanDumpStatus('4');
          this.soilBlockTaskVisible = false;
          const index = this.iconList.findIndex(item => item.name == 'cleanTaskIcon');
          this.iconList[index].isShow = false;
          this.$store.commit('bulldozer/setHasTargetWork', false);
          this.$store.commit('bulldozer/setCanClickMapWorkArea', false);
          break;
        default:
          break;
      }

      this.commonModalClose();
      this.$bus.$emit('clearClickItemId');
    },
    // !!! 点击common-modal组件中的<确定>按钮
    commonModalConfirm() {
      const store = this.$store.state.bulldozer;
      this.commonModalFlag = false; // 关闭弹窗

      switch (this.commonModalType) {
        // 就绪申请
        case READY_APPLY:
          sendSocket({
            type: 'OperationStatus',
            service_state_type: 1,
            service_delay_reason: 0,
            time_delay: 0,
          });
          this.workFlag = false;
          this.$bus.$emit('resetBtnClickIndex');
          break;
        // 退出采集
        case EXIT_COLLECT:
          this.resetAllStatus();
          break;
        // 更新排土线
        case UPDATE_SOIL_LINE:
          this.onCleanDumpStatus('3');
          this.soilBlockTaskVisible = false;
          const index = this.iconList.findIndex(item => item.name == 'cleanTaskIcon');
          this.iconList[index].isShow = false;

          // 打开作业抽屉
          this.workFlag = true;
          this.$bus.$emit('selectCollectType', 'soil');

          break;
        // 上传边界
        case UPLOAD_BOUNDARY:
        // 上传排土线
        case UPLOAD_SOIL_LINE:
        // 上传障碍物
        case UPLOAD_OBSTACLES_BOUNDARY:
          this.collectFileState = 2;

          // this.uploadFileFn();
          // return;

          // 若当前不存在作业目标信息且不是道路边界采集，则需要点选作业区
          if (this.collectConfig.type != 'roadBoundary' && !store.hasTargetWork) {
            this.messageVisible = true;
            this.model = 'workarea';
            this.$bus.$emit('updateStatus', 'select');
            this.$store.commit('bulldozer/setCanClickMapWorkArea', true);
          } else {
            // 上传文件
            this.uploadFileFn();
          }
          break;
        // 车辆是否已停车 - 是
        case VEHICLE_RUN_STATUS:
          sendSocket({
            type: TYPE.VEHICLE_RUN_STATUS_RESP,
          });
          break;
        default:
          break;
      }
    },

    // 关闭上传弹窗
    closeUploadDialog(status) {
      this.uploadFlag = false;
      if (status == 'failed') {
        this.handleIcon('uploadFileIcon', true);
        // 打开上传失败文件抽屉
        this.uploadFailedFileVisible = true;
        this.soilBlockTaskVisible = false;
      }
    },

    // 上传文件的方法
    uploadFileFn() {
      this.startUpload();
      // 文件名
      this.fileName = this.uploadFileName();
      // 文件数据

      // this.collectFileList = [
      //   {
      //     lat: '44.8484253',
      //     lon: '89.1395695',
      //     heading: '0',
      //     alt: '207.399994',
      //     speed: '0',
      //     ACCX: '0',
      //     ACCY: '0',
      //     ACCAng: '0',
      //     GPS: '1',
      //   },
      //   {
      //     lat: '44.8482825',
      //     lon: '89.1401501',
      //     heading: '0',
      //     alt: '207.399994',
      //     speed: '0',
      //     ACCX: '0',
      //     ACCY: '0',
      //     ACCAng: '0',
      //     GPS: '1',
      //   },
      // ];

      const strData = `${this.formatStrData(this.collectFileList)}`;
      // 文件
      const file = new File([strData], `${this.fileName}`);
      const bulldozerStore = this.$store.state.bulldozer;
      const data = {
        file,
        materialname: this.fileName,
        chuncks: 1,
        filemd5: this.md5(strData),
        chunck: 0,
        chunckmd5: this.md5(strData),
        collectstarttime: bulldozerStore.collectStartTime,
        collectendtime: bulldozerStore.collectEndTime,
        geoextent: '',
        productionmode: 'GPS',
        formatversion: 'v1.5',
      };

      if (bulldozerStore.currentTargetWorkArea) {
        data.rgntype = bulldozerStore.currentTargetWorkArea.workAreaType;
        data.rgnobjectid = bulldozerStore.currentTargetWorkArea.workAreaId;
      } else {
        data.rgntype = this.$store.state.carInDumpPosition.map_type;
        data.rgnobjectid = this.$store.state.carInDumpPosition.object_id;
      }

      if (this.collectConfig.type == 'soil') {
        let attr = {
          autoupdate: 0,
          dumplinetype: this.collectConfig.dumplineType == 'edge' ? '1' : '2',
        };
        if (bulldozerStore.currentTargetWorkArea?.soilBlockIds) {
          attr.dockgroupIndexList = bulldozerStore.currentTargetWorkArea.soilBlockIds;
        }
        data.attribute = JSON.stringify(attr);
      }

      // console.log('上传文件参数', data);

      this.formData = new FormData();
      Object.keys(data).forEach(key => {
        this.formData.append(key, data[key]);
      });

      // 将文件相关数据保存下来
      this.saveFile(data, strData);

      this.handleUpload();
    },

    // 上传文件
    handleUpload(data, name) {
      if (data && name) {
        this.formData = data;
        this.fileName = name;
      }
      uploadApi.uploadCollectFile(this.formData).then(
        res => {
          // 这里就是返回的字符串, 高精地图接口无法修改,只能这么去判断了
          if (res.includes(`\"status\":\"200\"`)) {
            this.uploadStatus = 'success';
            this.uploadMessage = '上传成功';
            sendSocket({
              type: 'UploadFile',
              fileName: this.fileName,
            });
            this.resetAllStatus();
            // 清空文件
            localStorage.removeItem('uploadFaildFile');
            this.onHideCleanTaskIcon();
          } else {
            console.log('上传接口res: ', res);
            this.onUploadFaild();
          }
        },
        error => {
          console.log('上传接口调用错误: ', error);
          this.onUploadFaild();
        }
      );
    },

    startUpload() {
      // 打开上传文件弹窗
      this.uploadFlag = true;
      //  隐藏message
      this.messageVisible = false;
      this.uploadStatus = 'upload';
      this.uploadMessage = '上传中';
      console.log('文件上传中....');
    },

    //  处理上传失败
    onUploadFaild() {
      this.uploadStatus = 'failed';
      // 上传失败
      this.uploadMessage = '上传失败';
      this.resetAllStatus();
    },

    // 上传文件数据格式组装
    formatStrData(data = []) {
      const sData = JSON.parse(JSON.stringify(data));
      const direction = this.collectConfig.side == 'left' ? '02' : '01'; //
      const offset = this.gpsOffset || ''; // 偏移量
      // 属性标识1,共两位。 第一位标识表示是否手动指定停靠位,第二位表示是否是排土线
      let flag1 = this.collectConfig.type == 'soil' ? '01' : '00';
      const strData = sData
        .filter(item => item.lon)
        .reduce((pre, cur) => {
          let { heading = '', lat = '', lon = '', GPS = '', alt = '', pauseFlag } = cur;
          if (GPS != 0) {
            // 车端跟平台 定位定义不一致，需取反
            GPS = GPS == 1 ? 2 : 1;
          }
          const str = `$,${heading},${lat},${lon},${alt},${direction},${offset},${GPS},${flag1},${
            pauseFlag ? '01' : '00'
          },`;
          let strSplit = str.split('');
          let count = strSplit[0];
          for (let i = 1; i < strSplit.length; i++) {
            count = count ^ strSplit[i];
          }
          pre += `${str}*${count.toString(16).toLocaleUpperCase().length == 1 ? '0' : ''}${count
            .toString(16)
            .toLocaleUpperCase()}\n`;
          return pre;
        }, '');

      return strData;
    },

    // 上传采集文件名
    uploadFileName() {
      const nameObj = {
        roadBoundary: 'MCB', // 道路边界
        loadBoundary: 'MCSL', // 装载区边界
        unloadBoundary: 'MCSU', //卸载区边界
        obstacleBoundary: 'OCSL', //障碍物边界
        soil: 'MCDL', //排土线
      };
      const date = dayjs(new Date()).format('YYYYMMDDHHmmss');
      const prefix = nameObj[this.collectConfig.type];
      const imei = this.imei || this.$store.state.carInfo.imei;
      return `${prefix}_${imei}_${date}.lpx`;
    },

    // 保存文件
    saveFile(params, strData) {
      let options = {};
      Object.keys(params).forEach(key => {
        if (key !== 'file') {
          options[key] = params[key];
        }
      });
      try {
        localStorage.setItem(
          'uploadFaildFile',
          JSON.stringify({
            name: this.fileName,
            strData,
            options,
          })
        );
      } catch (e) {
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          // 处理存储达到上限的情况
          this.$store.commit('setMessageList', 'LocalStorage存储采集文件达到上限');
          sendMsgToBackend('LocalStorage存储采集文件达到上限');
        } else {
          // 处理其他异常
          console.error('保存采集文件发生错误: ', e);
        }
      }
    },

    // 重置相关状态
    resetAllStatus() {
      this.messageVisible = false;
      this.collectFileState = 2;
      this.collectFileList = [];
      this.collectFileListPoint = [];
      this.model = 'initial';
      this.$store.commit('bulldozer/setCollectConfig', {});
      this.$store.commit('setCollectArea', '');
      this.$store.commit('bulldozer/setHasTargetWork', false);
      this.$store.commit('bulldozer/setCanClickMapWorkArea', false);

      this.$bus.$emit('resetMiddleIconList');
      this.$bus.$emit('hideWorkAreaBackground');
      this.$bus.$emit('clearClickItemId');
      this.$bus.$emit('clearSoilBlockIds');
    },

    // iconList 方法封装
    handleIcon(iconName, isShow) {
      const index = this.iconList.findIndex(item => item.name == iconName);
      this.iconList[index].isShow = isShow;
    },

    closeUploadFailedFile() {
      this.uploadFailedFileVisible = false;
    },

    // 未上传文件 - 重新上传
    onUploadAgain() {
      let data = JSON.parse(localStorage.getItem('uploadFaildFile'));
      if (!data) return;
      const { strData, options, name } = data;
      options.file = new File([strData], `${name}`);
      let formData = new FormData();
      Object.keys(options).forEach(key => {
        formData.append(key, options[key]);
      });
      this.closeUploadFailedFile();
      this.startUpload();
      this.handleUpload(formData, name);
    },
    // 隐藏上传文件icon
    onHideCleanTaskIcon() {
      this.handleIcon('uploadFileIcon', false);
      this.closeUploadFailedFile();
    },
  },
  watch: {
    headerListData: {
      handler: function (val) {
        if (val.rtkstate != 'RTK' && this.collectFileState == 1) {
          this.$bus.$emit('resetMiddleIconList');
          this.collectFileState = 2;
          this.$store.commit('setMessageList', '丢失差分定位,无法采集');
          sendMsgToBackend('丢失差分定位,无法采集');
          speak('丢失差分定位,无法采集', 6);
        }
      },
      deep: true,
      immediate: true,
    },
  },

  beforeDestroy() {
    this.resetEmit();
  },
};
