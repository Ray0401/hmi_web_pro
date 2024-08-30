import { getLocalStorage, sendMsgToBackend, sendSocket, speak } from '@/utils/utils';
import { defaultPointItem, defaultBilateralPointList } from '../../components/excavator/data';
import { SOCKET_TYPE } from '@/constant/index';
export const EXCAVATOR_SOCKET_MESSAGE = that => {
  let index = 0;
  return {
    // 车辆位置信息
    Position: data => {
      data = data.data;
      // that.$bus.$emit('carPosition', data);
      if (!that.positionTimer) {
        clearTimeout(that.positionTimer);
        that.positionTimer = setTimeout(() => {
          that.positionTimer = null;
          that.$bus.$emit('carPosition', data);
          that.$store.commit('excavator/setPositionInfo', data);
        }, 500);
      }
      if (that.noEntryAreaList) {
        let min = parseFloat(that.noEntryAreaList[0]);
        let max = parseFloat(that.noEntryAreaList[1]);
        max = min > max ? max + 360 : max;
        if (data.heading >= min && data.heading <= max) {
          if (that.noEntryAreaListState == 0 || that.noEntryAreaListState == 2) {
            that.noEntryAreaListState = 1;
            that.$bus.$emit('noEntryAreaWarning', { type: 1 });
            sendSocket({
              type: 'exceedNoEntryArea',
              status: '1',
            });
          }
        } else if (that.noEntryAreaListState == 1 || that.noEntryAreaListState == 2) {
          that.noEntryAreaListState = 0;
          that.$bus.$emit('noEntryAreaWarning', { type: 0 });
          speak('超出转动限位角度，请将铲臂移回作业回转范围', 6);
          sendSocket({
            type: 'exceedNoEntryArea',
            status: '0',
          });
        }
      }
      if (that.offsetAngleList) {
        let min = parseFloat(that.offsetAngleList[0]);
        let max = parseFloat(that.offsetAngleList[1]);
        max = min > max ? max + 360 : max;
        if (data.heading >= min && data.heading <= max) {
          if (that.offsetAngleListState == 0) {
            that.offsetAngleListState = 1;
            that.$bus.$emit('offsetAngleWarning', { type: 1 });
            sendSocket({
              type: 'exceedOffsetAngle',
              status: '1',
            });
          }
        } else if (that.offsetAngleListState == 1) {
          that.offsetAngleListState = 0;
          that.$bus.$emit('offsetAngleWarning', { type: 0 });
          sendSocket({
            type: 'exceedOffsetAngle',
            status: '0',
          });
        }
      }
    },
    '8F07': data => {
      that.$bus.$emit('planningSuccess', data);
    },
    // 手动车列表
    '8C02': data => {
      let Info = that.parkAllocationStatus[0];
      if (data.act == 1) {
        // 自动驾驶车不处理
        if (data.mode == '自动驾驶') return false;
        let index = null;
        for (let i = 0; i < that.parkAllocationStatus.length; i++) {
          let item = that.parkAllocationStatus[i];
          // 如果是自动车装载区内切自动，则不处理
          if (item.name == data.name) return false;
          if (!(item.from == '83E5' || (item.from == '8b01' && item.imei))) {
            index = i;
          }
        }
        if (index == null) return false;
        clearTimeout(that.stopPointTimer);
        data.from = '8C02';
        data.imei = data.id;
        data.is_SecondStation = 1;
        data.stop_num = index;
        that.parkAllocationStatus[index] = data;
      }
      if (data.act == 2) {
        // 车辆驶离，重置状态
        that.parkAllocationStatus.forEach((item, index) => {
          if (item.name == data.name) {
            that.parkAllocationStatus[index] = { ...defaultPointItem, stop_num: index };
            that.$bus.$emit('resetMiddleClickIndex');
          }
          if (item.stop_group_status == 2) {
            that.$bus.$emit('resetMiddleClickIndex');
          }
        });
      }
    },
    // 存疑产量
    8302: data => {
      that.outPutList = data.data || [];
      if (that.outPutList.length) {
        speak('收到存疑产量记录，请及时处理', 6);
        that.$store.commit('setMessageList', `收到${that.outPutList.length}条存疑产量记录`);
        sendMsgToBackend(`收到${that.outPutList.length}条存疑产量记录`);
      }
    },
    // 作业区
    where: data => {
      that.headerListData.area = data.name;
    },
    // 获取当前电铲产量
    Output: data => {
      if (getLocalStorage('loggedFlag')) {
        that.headerListData.number = data.loadNum;
      }
    },
    // 获取物料列表
    MaterialList: data => {
      that.MaterialList = data.data;
    },
    // 当前物料
    CurrentMaterial: data => {
      that.headerListData.oretext = data.materialNum;
    },
    // 运营状态结果
    operationStatusResult: data => {
      console.log('data', data.data);
      that.$toast(data.data);
      that.$store.commit('setMessageList', data.data);
    },
    // 获取铲窝是否自动
    ExcavatorMode: data => {},
    // 不可驶入区域配置项
    doNotIntoSwitch: data => {
      if (data.status == 0) that.$bus.$emit('NoSettingNoEntryArea');
      that.settingNoEntryAreaStatus = Number(data.status);
    },
    // 偏移角配置项
    excavatorOffsetAngle: data => {
      that.$bus.$emit('drawOffsetAngle', data);
    },
    // 停靠位信息
    '8B01': data => {
      let datas = data.data || [];
      that.$bus.$emit('quickCarList', datas);
      let groupList = [];
      // 处理停靠位预停靠位关联关系
      for (let i = 0; i < datas.length; i++) {
        that.disabledPrePointSwitch = false;

        let content = datas[i];
        // 通知电铲id修改
        if (content.stop_type == 1) groupList[Number(content.stop_num)] = content.stop_num;
        if (content.stop_type == 3) groupList[Number(content.parent_stop_num) + 2] = content.stop_num;
        if (content.stop_type == 1) {
          // 保存平台的装载模式
          that.$store.commit('excavator/setWebRgnLoadMode', content.rgnloadMode);
          // 如果手动切换过装载模式，且与当前指点的装载模式不同，则不处理8b01
          if (
            that.$store.state.excavator.checkRgnloadMode &&
            datas[i].rgnloadMode != String(that.$store.state.excavator.rgnloadMode)
          )
            return false;
          datas[i].from = '8b01';
          that.$store.commit('excavator/setRgnloadMode', content.rgnloadMode);
          // 点击电铲操作按钮，下次收到消息未变化，则重新置亮
          let middleClickIndex = that.$store.state.excavator.middleclickindex;
          if (content.stop_group_status == 2 && middleClickIndex[content.stop_num] == 1)
            that.$store.commit('excavator/setMiddleClickIndex', { value: null, index: content.stop_num });
          let bool =
            content.task == '停靠完成' ||
            content.task == '停靠不到位' ||
            (content.task == '驶入停靠' && content.stopReason?.includes('遇障停车'));
          if (bool && middleClickIndex[content.stop_num] == 2)
            that.$store.commit('excavator/setMiddleClickIndex', { value: null, index: content.stop_num });
          if (content.task == '装载中' && middleClickIndex[content.stop_num] == 3)
            that.$store.commit('excavator/setMiddleClickIndex', { value: null, index: content.stop_num });
        }
        if (!that.$store.state.excavator.stepDistanceFlag) {
          that.$bus.$emit('pointState', content);
        }
        if (content.stop_type == 3) {
          // 如果是预停靠位且当前预停靠位有车则预停靠位模式开关禁用
          if (content.imei) {
            that.disabledPrePointSwitch = true;
          }

          for (let j = 0; j < datas.length; j++) {
            if (datas[j].stop_type == 1 && datas[j].stop_num == content.parent_stop_num) {
              datas[j].child_stop_num = content.stop_num;
              if (content.stop_group_status != 0) {
                datas[j].child_stop_open = true;
                if (!('child_stop_open' in (that.parkAllocationStatus[Number(datas[j].stop_num)] || {}))) {
                  that.prePointStatus = true;
                  // localStorage.setItem('prePointStatus', true);
                }
              } else {
                if (!('child_stop_open' in (that.parkAllocationStatus[Number(datas[j].stop_num)] || {}))) {
                  that.prePointStatus = false;
                  // localStorage.setItem('prePointStatus', false);
                }
              }
              datas[j].child_point = content;
            }
          }
        }

        if (!datas.some(item => item.stop_type == 3) && localStorage.getItem('prePointStatus') === 'false') {
          that.prePointStatus = false;
        }
      }
      that.$bus.$emit('setPointType', groupList);

      // 6s未收到8b01展示默认数据
      clearTimeout(that.stopPointTimer);
      that.stopPointTimer = setTimeout(() => {
        that.stopPointTimer = null;
        if (that.$store.state.excavator.rgnloadMode == 0) that.parkAllocationStatus = [defaultPointItem];
        if (that.$store.state.excavator.rgnloadMode == 1) that.parkAllocationStatus = [...defaultBilateralPointList];
      }, 8000);

      if (that.$store.state.excavator.rgnloadMode == 1 && that.parkAllocationStatus.length < 2)
        that.parkAllocationStatus = [...defaultBilateralPointList];
      if (that.parkAllocationStatus?.length) {
        for (let i = 0; i < datas.length; i++) {
          for (let j = 0; j < that.parkAllocationStatus.length; j++) {
            // 0单侧 1双侧
            if (datas[i].rgnloadMode == 0) {
              if (datas[i].stop_type == 1) {
                if (!datas[i].imei) {
                  let info = that.parkAllocationStatus[j];
                  if (info.imei && info.from != '8b01') continue;
                }
                //通知右侧设置
                that.$set(that.parkAllocationStatus, j, datas[i]);
              }
            }
            if (datas[i].rgnloadMode == 1) {
              if (datas[i].stop_type == 1 && datas[i].stop_num == that.parkAllocationStatus[j].stop_num) {
                if (!datas[i].imei) {
                  let info = that.parkAllocationStatus[j];
                  if (info.imei && info.from != '8b01') continue;
                }
                //通知右侧设置
                that.$set(that.parkAllocationStatus, j, datas[i]);
              }
            }
          }
        }
      } else {
        //只有第一次获取数据主动push数据
        for (let i = 0; i < datas.length; i++) {
          if (datas[i].stop_type == 1) {
            that.parkAllocationStatus.push(datas[i]);
          }
        }
      }
    },
    //手动车列表
    '83E5': data => {
      let index = null;
      for (let i = 0; i < that.parkAllocationStatus.length; i++) {
        let item = that.parkAllocationStatus[i];
        if (!(item.from == '8b01' && item.imei)) {
          index = i;
          break;
        }
      }
      if (index == null) return false;
      clearTimeout(that.stopPointTimer);
      if (data.is_SecondStation == 1) data.task = '停靠完成';
      if (data.is_SecondStation == 2) {
        data.task = '待停靠';
        that.showModal = true;
        that.message = '矿卡即将进行自动驾驶停靠，请指点';
      }
      data.mode = '自动驾驶';
      data.from = '83E5';
      data.imei = data.id;
      data.stop_num = index;
      that.parkAllocationStatus[index] = data;
    },
    // 设定不可驶入区域返回结果
    settingDoNotIntoResp: data => {
      that.noEntryAreaListState = 2;
      if (data.status == 170) {
        that.showModal = true;
        that.message = '规划路径与回转作业范围相交，请重新指点';
        speak('规划路径与回转作业范围相交，请重新指点', 6);
      }
    },
    // 当前电铲所在的作业区域边界更新
    mapInfo_current_load_update: data => {
      // that.showModal = true;
      // that.message = '装载区地图更新，请重新指点';
    },
    excavatorRadius: data => {
      that.$store.commit('setCarInfo', data);
    },

    // 接收装载区预览数据
    [SOCKET_TYPE.GET_PREVIEW_DATA]: data => {
      // success :   'false' | 'true'
      if (data.success == 'false') {
        that.$store.commit('setMessageList', data.message);
        sendMsgToBackend(data.message);
      } else {
        that.$store.commit('setMessageList', '装载区边界预览中');
        sendMsgToBackend('装载区边界预览中');
        that.$bus.$emit('showPreviewData');
      }
    },

    // 车辆后移规划结果
    8114: data => {
      that.$bus.$emit('receive8114');
    },
  };
};
