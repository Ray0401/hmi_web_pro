import { COMMON_MODAL_TYPE, SOCKET_TYPE as TYPE, ADOPT, SOIL, MAP_COLLECT, CURRENCY } from '@/constant/index';
import { speak } from '@/utils/utils';
export const AUXILIARY_SOCKET_MESSAGE = that => {
  return {
    [TYPE.RTK_5G4G]: data => {
      that.headerListData.rtkstate = data.RTK;
      that.headerListData.networkstate[0] = data.mboxNetmode;
      that.headerListData.networkstate[1] = data.tboxNetmode;
      that.headerListData.signalStatus[0] = data.mboxSignal;
      that.headerListData.signalStatus[1] = data.tboxSignal;
    },
    [TYPE.POSITION]: data => {
      // 500ms 更新车辆位置，防止长距离采集出现延迟问题
      if (!that.positionTimer) {
        that.positionTimer = setTimeout(() => {
          clearTimeout(that.positionTimer);
          that.positionTimer = null;
          that.$bus.$emit('carPosition', data.data);
        }, 500);
      }
      // 采集数据
      if (that.collectFileState == 1) {
        //防止同一位置多次采集
        if (that.collectFileList?.length) {
          let obj = that.collectFileList.at(-1);
          if (!that.isObjectValueEqual(obj, data.data)) {
            that.collectFileList.push(JSON.parse(JSON.stringify(data.data)));
            if (!that.collectFileListTimer) {
              // 保证车辆位置更新 & 采集路径更新同步
              if (!that.collectCarStopStatus) {
                clearTimeout(that.positionTimer);
                that.positionTimer = null;
                that.collectCarStopStatus = true;
              }
              that.collectFileListTimer = setTimeout(() => {
                clearTimeout(that.collectFileListTimer);
                that.collectFileListTimer = null;
                that.collectFileListPoint.push(JSON.parse(JSON.stringify(data.data)));
              }, 500);
            }
            that.collectCarStop = 1;
          } else if (that.collectCarStop == 1) {
            setTimeout(() => {
              if (that.collectCarStop == 2) {
                that.collectFileListPoint.push(JSON.parse(JSON.stringify(data.data)));
              }
            }, 600);
            that.collectCarStop = 2;
          }
        } else {
          that.collectFileList.push(JSON.parse(JSON.stringify(data.data)));
          that.collectFileListPoint.push(JSON.parse(JSON.stringify(data.data)));
        }
      } else {
        that.collectCarStopStatus = false;
      }
    },

    [TYPE.WORKAREA_BLOCKED_LIST]: data => {
      // 初始状态/更新作业区相关数据
      if (that.workAreaVisible) {
        const current = data?.data?.find?.(item => item.zone_id == that.zone_id && item.zone_type == that.zone_type);
        current && (that.workAreaStatus = current.zone_status);
      }

      that.$bus.$emit('updateWorkAreaStatus', data?.data || []);
    },
    [TYPE.MSG_MAP_ENGINE_WARNING]: data => {
      that.$store.commit('setCarInDumpPosition', data.data);
      const flag = Boolean(Number(localStorage.getItem('switchRetrogradWarning') || 0));
      if ([SOIL, ADOPT, MAP_COLLECT, CURRENCY].includes(that.$store.state.vehicleData.terminalType)) {
        if (flag) {
          const obj = {
            retrograde: Number(data.data.retrograde),
            departureDirection: 0,
          };

          if (obj.retrograde != 1) {
            obj.departureDirection = data.data.departure > 0 ? 'right' : data.data.departure < 0 ? 'left' : 0;
            if (obj.departureDirection) {
              speak('已偏离车道', 6);
            }
          } else {
            speak('已违规驶入对向车道', 6);
          }

          Object.assign(that.warningData, obj);
        } else {
          Object.assign(that.warningData, {
            retrograde: 0,
            departureDirection: 0,
          });
        }
      }
    },

    [TYPE.SURROUNDING_VEHICLES_WARNING]: data => {
      if ([SOIL, MAP_COLLECT, CURRENCY].includes(that.$store.state.vehicleData.terminalType)) {
        if (data.data[0].showNearestMine == '0') {
          that.warningData.surroundCar = null;
        } else {
          const list = data.data;
          const obj = {
            distance: parseInt(Number(list[0].distance)),
            rotatedeg: [Number(list[0].direction)],
          };
          that.warningData.surroundCar = obj;
        }
      }
    },
    // [TYPE.MSG8108]: data => {
    //   that.$bus.$emit('updatePerTaskInfo', data.data || []);
    // },

    [TYPE.VEHICLE_RUN_STATUS]: data => {
      if (data?.status == 1) {
        that.$bus.$emit('openCommonModal', COMMON_MODAL_TYPE.VEHICLE_RUN_STATUS);
      }
    },
  };
};
