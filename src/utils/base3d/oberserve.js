/*
 * @Author: 徐海瑞
 * @Date: 2023-03-08 14:19:17
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-09-26 17:38:53
 *
 * uni.on监听函数
 *
 */

import Vue from 'vue';
import store from '@/store';
import * as THREE from 'three';
import variables from '../../styles/variables.module.scss';
import { calVertices, getTransformedVertices, sendMsgToBackend } from '../utils';

const { color_workarea_unlock, color_soilblock_open, color_soilblock_close, color_soilblock_distribute } = variables;
export function initOn() {
  // 修改指点
  // Vue.prototype.$bus.$on('setPoint', data => {
  //   this.setCpointTexture(data.data);
  // });
  // 显示指点信息
  Vue.prototype.$bus.$on('showPoint', data => {
    this.pointName = data.stop_num;
    if (
      (data.stop_num == 1 && store.state.excavator.givePointInfo[0]) ||
      (data.stop_num == 0 && store.state.excavator.givePointInfo[1])
    ) {
      let info = data.stop_num == 1 ? store.state.excavator.givePointInfo[0] : store.state.excavator.givePointInfo[1];
      let heading = parseFloat(info.carHeading);
      let offsetHeading = info.offsetHeading;
      let newHeading = parseFloat(store.state.excavator.positionInfo.heading);
      let max = Math.max(heading, newHeading);
      let min = Math.min(heading, newHeading);
      let bool = Math.abs(max - min) < Math.abs(min + 360 - max); // true 顺 false 逆
      let dis = bool ? Math.abs(max - min) : Math.abs(min + 360 - max);
      if (bool) {
        offsetHeading += heading - newHeading;
      } else {
        offsetHeading += min == newHeading ? -dis : dis;
      }
      if (offsetHeading > 90) offsetHeading = 90;
      if (offsetHeading < -90) offsetHeading = -90;
      this.carHeading = offsetHeading;
      Vue.prototype.$bus.$emit('point', { data: offsetHeading });
      this.setCpointTexture(offsetHeading);
    }
    this.createPoint();
    this.setCameraStatus('start');
    this.setMaterialsStyle(`point_${data.stop_num}`, 'map', this.pointGrey);
  });
  // 删除指点信息
  Vue.prototype.$bus.$on('hidePoint', data => {
    // destroyMesh(this.mapGroup.getObjectByName('createPoint'));
    this.mapGroup.remove(this.mapGroup.getObjectByName('createPoint'));
    this.mapGroup.remove(this.mapGroup.getObjectByName('ManualPoint'));

    this.setCameraStatus('end');
    this.setMaterialsStyle(`point_${this.pointName}`, 'map', this.pointGreen);
    this.pointName = null;
  });
  // 接收车辆位置信息
  Vue.prototype.$bus.$on('carPosition', (data = {}) => {
    this.carPosition = data;
    if (this.showNoEntryIndex == 1) {
      this.showNoEntryIndex = 0;
      this.minNoEntryHeading = 0;
      this.maxNoEntryHeading = 360;
      this.NoEntryZone('noEntry');
    }
    if (this.noEntryArea) {
      let heading = parseFloat(data.heading);
      if (this.minNoEntryHeading == null) return (this.minNoEntryHeading = heading);
      if (this.maxNoEntryHeading != null) {
        if (Math.abs(this.maxNoEntryHeading - heading) < 0.6) return false;
      } else {
        if (Math.abs(this.minNoEntryHeading - heading) < 0.6) return false;
      }
      this.maxNoEntryHeading = heading;
      this.NoEntryZone('noEntry');
    }

    // v2v告警显示功能(如果开关关闭,则不显示)
    if (!store.state.v2vWarningShow) return;
    this.createV2VWarning(data);
  });
  // 接收周边车辆信息
  Vue.prototype.$bus.$on('aroundCarList', (data = []) => {
    clearTimeout(this.aroundCarTimer);
    this.setAroundCar(data);
    // 5s没收到车辆信息，清除周边车辆
    this.aroundCarTimer = setTimeout(() => {
      this.aroundCarTimer = null;
      store.commit('setMessageList', '5s未收到周边车辆');
      sendMsgToBackend('5s未收到周边车辆');
      this.setAroundCar([]);
    }, 5000);
  });
  // 接收矿卡名称
  Vue.prototype.$bus.$on('carName', (data = {}) => {
    this.carName = data.data;
    // console.log(
    //   '接收到当前设备名称: ',
    //   this.carName,
    //   'positionCarLabel: ',
    //   this.scene.getObjectByName('positionCarLabel')
    // );
    if (this.scene.getObjectByName('positionCarLabel')) {
      this.scene.getObjectByName('positionCarLabel').element.innerHTML = data.data;
    }
  });
  // 接收恢复跟随的信号
  Vue.prototype.$bus.$on('setPosition', () => {
    this.position = false;
  });
  // 修改地图显示模式
  Vue.prototype.$bus.$on('setMode', data => {
    this.mode = data.data;
    this.NoEntryZone('noEntry');
    this.heading = 0;
    if (data.data == 0) {
      this.boxGroup.rotation.z = 0;
      if (this.carGroup.getObjectByName('noEntry')) this.carGroup.getObjectByName('noEntry').rotation.z = 0;
    } else {
      this.carModel.rotation.y = 1.5707963267948966;
    }
  });
  // 更改电铲停靠位/预停靠位材质图片
  Vue.prototype.$bus.$on('pointState', data => {
    let obj = this.scene.getObjectByName(`point_${data.stop_num}`);
    if (!obj) return false;
    if (this.pointName) return false;

    // obj.rotateZ(THREE.MathUtils.degToRad(0.01));
    // console.log('obj', obj);

    let lockObj = this.scene.getObjectByName(`yutingkaowei_switch_${data.stop_num}`);
    // // 停靠位
    if (data.stop_type == 1) {
      if (data.stop_group_status == 0) {
        obj.material.map = this.pointGrey;
      } else if (data.occupy == 1) {
        obj.material.map = this.pointRed;
      } else {
        obj.material.map = this.pointGreen;
      }
      // 预停靠位
    } else if (data.stop_type == 3) {
      if (data.stop_group_status == 0) {
        obj.material.map = this.pointGrey;
        lockObj.material.map = this.yutingkaowei_close;
        lockObj.isLock = true;
        obj.isLock = true;
        lockObj.occupy = false;
      } else if (data.occupy == 1) {
        obj.material.map = this.pointRed;
        lockObj.material.map = this.yutingkaowei_close;
        lockObj.isLock = true;
        obj.isLock = true;
        lockObj.occupy = true;
      } else {
        obj.material.map = this.pointBlue;
        lockObj.material.map = this.yutingkaowei_open;
        lockObj.isLock = false;
        lockObj.occupy = false;
        obj.isLock = false;
      }
    }
  });
  // 路权
  Vue.prototype.$bus.$on('taskPathStatus', data => {
    data = data || {};
    if (data.carPosition == this.taskPath.carPosition && data.permission == this.taskPath.permission) {
      this.taskPath = data;
    } else {
      this.taskPath = data;
      this.setTaskLane();
    }
  });
  //设置不可驶入区域
  Vue.prototype.$bus.$on('NoSettingNoEntryArea', () => {
    if ('lon' in this.carPosition) {
      this.minNoEntryHeading = 0;
      this.maxNoEntryHeading = 360;
      this.NoEntryZone('noEntry');
    } else {
      this.showNoEntryIndex = 1;
    }
  });
  // 修改作业区封锁状态
  Vue.prototype.$bus.$on('updateWorkAreaStatus', data => {
    this.workAreaList = data;
    this.updateWorkAreaStatus(data);
  });

  // 恢复作业区初始背景颜色
  Vue.prototype.$bus.$on('hideWorkAreaBackground', () => {
    if (!store.state.bulldozer.currentTargetWorkArea) return;
    const target = this.scene.getObjectByName(store.state.bulldozer.currentTargetWorkArea.workAreaName);
    if (target && target.material) {
      target.material.color = new THREE.Color(color_workarea_unlock);
      target.material.opacity = 1;
    }
    store.commit('bulldozer/selectCurrentTargetWorkArea', null);
  });

  Vue.prototype.$bus.$on('noEntryAreaOuter', data => {
    this.NoEntryZone('setNoEntry');
    this.setCameraStatus('start');
  });
  //开始设置不可驶入区域
  Vue.prototype.$bus.$on('startNoEntry', () => {
    this.noEntryArea = true;
    this.minNoEntryHeading = null;
    this.maxNoEntryHeading = null;
    this.NoEntryZone('noEntry');
  });
  //停止设置不可驶入区域
  Vue.prototype.$bus.$on('stopNoEntry', () => {
    this.noEntryArea = false;
  });
  //删除不可驶入区域
  Vue.prototype.$bus.$on('deleteNoEntry', (data = {}) => {
    if (data.type == 'delete') this.oldNoEntryHeading = [];
    this.noEntryArea = false;
    this.minNoEntryHeading = null;
    this.maxNoEntryHeading = null;
    this.NoEntryZone('noEntry');
  });
  //关闭设置不可驶入区域
  Vue.prototype.$bus.$on('closeNoEntry', data => {
    // destroyMesh(this.carGroup.getObjectByName('setNoEntry'));
    this.carGroup.remove(this.carGroup.getObjectByName('setNoEntry'));
    this.noEntryArea = false;
    if (data?.type == 'delete') {
      this.minNoEntryHeading = this.oldNoEntryHeading[0] ?? null;
      this.maxNoEntryHeading = this.oldNoEntryHeading[1] || null;
      this.NoEntryZone('noEntry');
    }
    if (data.type == 'submit') {
      Vue.prototype.$bus.$emit('noEntryAreaInfo', {
        start: this.minNoEntryHeading,
        end: this.maxNoEntryHeading,
      });
      this.oldNoEntryHeading = [this.minNoEntryHeading, this.maxNoEntryHeading];
    }
    this.setCameraStatus();
  });
  Vue.prototype.$bus.$on('drawOffsetAngle', data => {
    this.NoEntryZone('drawOffsetAngle', data);
  });
  // 是否超出不可驶入区域
  Vue.prototype.$bus.$on('noEntryAreaWarning', data => {
    this.noEntryColor = '#FF1515';
    if (data.type == 1) this.noEntryColor = '#00FF72';
    this.setMaterialsStyle('noEntry', 'color', new THREE.Color(this.noEntryColor));
    this.setMaterialsStyle('noEntry-text', 'color', new THREE.Color(this.noEntryColor));
  });
  // 是否超出偏移角
  Vue.prototype.$bus.$on('offsetAngleWarning', data => {
    let color = '#FF6C00';
    if (data.type == 1) color = '#00D2FF';
    this.setMaterialsStyle('drawOffsetAngle', 'color', new THREE.Color(color));
    this.setMaterialsStyle('drawOffsetAngle-text', 'color', new THREE.Color(color));
  });
  // 更新辅助车辆同一作业区内的矿卡任务路径
  Vue.prototype.$bus.$on('updatePerTaskInfo', data => {
    // const workareaTaskInfo = JSON.parse(localStorage.getItem('workareaTaskInfo'));
    // if (!workareaTaskInfo) return;

    if (this.workareaTaskInfo == null) return;

    // 先清空所有路径路权,再画路径路权
    let deleteList = [];
    this.lanes.getGroup().traverse(item => {
      if (item) {
        if (item.name.includes('workareaTask') || item.name.includes('workareaPerTask')) {
          deleteList.push(item);
        }
      }
    });

    // destroyMesh(...deleteList);
    this.lanes.getGroup().remove(...deleteList);

    data &&
      data.forEach(item => {
        let perTaskArr = [];
        let taskArr = [];
        item.lane_list.forEach(cItem => {
          if (cItem.lane_id in this.workareaTaskInfo) {
            // 截取lane_id 的路权数据
            const perTaskTarget = this.workareaTaskInfo[cItem.lane_id].slice(
              Number(cItem.permission_start),
              Number(cItem.permission_end)
            );
            // 将数据push到路权数组
            perTaskTarget.length &&
              perTaskArr.push({
                imei: item.imei,
                lane_id: cItem.lane_id,
                lane_list: perTaskTarget,
              });

            // 截取lane_id 的路径数据
            // const taskTarget = this.workareaTaskInfo[cItem.lane_id].slice(
            //   Number(cItem.permission_end),
            //   Number(cItem.lane_end)
            // );

            // 将数据push到路径数组
            // taskTarget.length &&
            //   taskArr.push({
            //     imei: item.imei,
            //     lane_id: cItem.lane_id,
            //     lane_list: taskTarget,
            //   });
          }
        });

        // this.setLanes(taskArr, 'workareaTaskLane');
        this.setLanes(perTaskArr, 'workareaPerTaskLane');
      });
  });
  // 更新排土块/排土点数据
  Vue.prototype.$bus.$on('updateMapSoilBlockData', data => {
    data.forEach(item => {
      const { stop_type, group_num, stop_num, stop_group_status } = item;
      const colorObj = {
        1: color_soilblock_open, // 启用
        2: color_soilblock_close, // 关闭
        3: color_soilblock_distribute, // 已分配
      };
      // 排土块
      if (stop_type == 2) {
        const target = this.scene.getObjectByName(`soilBlock_${group_num}`);
        // console.log('target', target);
        if (target) {
          // 改线的颜色
          target.children.length > 1 &&
            (target.children[1].material.color = new THREE.Color(colorObj[stop_group_status]));
          // 改材质背景颜色
          target.material.color = new THREE.Color(colorObj[stop_group_status]);
          // 改属性
          target.soilBlockStatus = stop_group_status;

          Vue.prototype.$bus.$emit('updateSoilBlockDetail', group_num);
        }
      }
      // 排土点
      if (stop_type == 1) {
        const target = this.scene.getObjectByName(`soilPoint_${stop_num}`);
        if (target) {
          // 改点的颜色
          target.material.color = new THREE.Color(colorObj[stop_group_status]);
          // 增加属性
          target.soilPointStatus = stop_group_status;
        }
      }
    });
  });
  // 更新障碍物
  Vue.prototype.$bus.$on('updateObstaclesLine', (data, type) => {
    if (type == 'add') {
      data.forEach(item => {
        this.setLanes([item], 'obstaclesLine');
      });
    } else {
      // destroyMesh(this.scene.getObjectByName(`obstaclesLine_${data}`));
      this.lanes.getGroup().remove(this.scene.getObjectByName(`obstaclesLine_${data}`));
    }
  });
  // 删除单次路径以及停靠位
  Vue.prototype.$bus.$on('deleteExTaskLane', () => {
    this.setLanes([[]], 'exTaskLane');
    this.setPoints([]);
  });
  // 更改铲臂长度
  Vue.prototype.$bus.$on('setExcavatorOffsetLen', data => {
    this.createPoint();
  });

  // 清空排土块局部采集的ids
  Vue.prototype.$bus.$on('clearSoilBlockIds', () => {
    this.soilBlockIds = [];
  });
  // 根据分组数量判断是否需要请求第二条路径
  Vue.prototype.$bus.$on('setPointType', (data = []) => {
    const target = this.scene.getObjectByName(`exTaskLane`);
    const target1 = this.scene.getObjectByName(`exTaskLane1`);
    this.groupList = data;
    if (data[1] != undefined && !target1) {
      Vue.prototype.$bus.$emit('maptaskInfo1');
    } else if (data[1] == undefined && target1) {
      this.setLanes([[]], 'exTaskLane1');
    }
    if (data[0] != undefined && !target) {
      Vue.prototype.$bus.$emit('maptaskInfo');
    } else if (data[0] == undefined && target) {
      this.setLanes([[]], 'exTaskLane');
    }
  });
  Vue.prototype.$bus.$on('checkPointStopNum', data => {
    this.checkPointStopNum = data;
    let line = this.scene.getObjectByName('exTaskLane');
    let line1 = this.scene.getObjectByName('exTaskLane1');
    let point = this.scene.getObjectByName('point_0');
    let point1 = this.scene.getObjectByName('point_1');
    let bool = data == 0;
    if (line) line.material.opacity = bool ? 1 : 0.5;
    if (point) point.material.opacity = bool ? 1 : 0.5;
    if (line1) line1.material.opacity = bool ? 0.5 : 1;
    if (point1) point1.material.opacity = bool ? 0.5 : 1;
    if (this.groupList[2] && this.scene.getObjectByName(`point_${this.groupList[2]}`))
      this.scene.getObjectByName(`point_${this.groupList[2]}`).material.opacity = bool ? 1 : 0.5;
    if (this.groupList[3] && this.scene.getObjectByName(`point_${this.groupList[3]}`))
      this.scene.getObjectByName(`point_${this.groupList[3]}`).material.opacity = bool ? 0.5 : 1;
  });

  Vue.prototype.$bus.$on('updateV2VWarningShow', value => {
    if (!value) {
      // destroyMesh(this.scene.getObjectByName('createV2VWarning'));
      this.mapGroup.remove(this.scene.getObjectByName('createV2VWarning'));
    } else {
      this.createV2VWarning(this.carPosition);
    }
  });

  // 删除装载区预览数据
  Vue.prototype.$bus.$on('deletePreviewLoad', () => {
    // destroyMesh(this.scene.getObjectByName('previewLoadArea'));
    this.bouds.getGroup().remove(this.scene.getObjectByName('previewLoadArea'));
  });

  // 画一个虚拟的停靠位/预停靠位/锚点
  Vue.prototype.$bus.$on('setVirtualPoint', pointName => {
    this.mapGroup.remove(this.scene.getObjectByName(`virtual_${pointName}`));
    const originobj = this.scene.getObjectByName(pointName);
    originobj.material.opacity = 0.3;
    // 克隆几何体
    const clonedGeometry = originobj.geometry.clone(true);
    // 克隆材质
    const clonedMaterial = originobj.material.clone(true);
    clonedMaterial.map =
      originobj.pointType == 0 ? this.pointGreen : originobj.pointType == 1 ? this.pointBlue : this.maodian;
    clonedMaterial.opacity = 1;
    // 使用克隆的几何体和材质创建新的对象
    const mesh = new THREE.Mesh(clonedGeometry, clonedMaterial);
    mesh.renderOrder = 5;
    mesh.name = `virtual_${pointName}`;
    mesh.pointIndex = originobj.pointIndex;
    mesh.pointType = originobj.pointType;
    mesh.heading = originobj.heading;
    mesh.customerVertices = originobj.customerVertices;
    mesh.position.set(originobj.position.x, originobj.position.y, 0.01);
    // mesh.rotateZ(THREE.MathUtils.degToRad(-originobj.heading));
    this.mapGroup.add(mesh);
  });

  // 更新停靠位/预停靠位/锚点角度或者位置
  Vue.prototype.$bus.$on('updateTingkaoweiPosOrDeg', (type, value) => {
    // console.log(`mode:${this.mode}`, `value:${value}`);
    value = parseFloat(value);
    let obj = this.scene.getObjectByName(`virtual_${this.selectedPointName}`);
    if (!obj) return;
    // console.log(obj);

    const { x = 0, y = 0, z = 0 } = this.movePointParams;
    this.movePointParams = { ...this.movePointParams, x, y, z };
    this.movePointParams.move_type = obj.pointType;
    this.movePointParams.stop_num = obj.pointIndex;
    // 平移或者旋转
    if (this.mode == 1) {
      switch (type) {
        case 'up':
          this.movePointParams.y = parseFloat((y + value).toFixed(1));
          obj.position.setY(obj.position.y + value * 1.8);
          break;
        case 'down':
          this.movePointParams.y = parseFloat((y - value).toFixed(1));
          obj.position.setY(obj.position.y - value * 1.8);
          break;

        case 'left':
          this.movePointParams.x = parseFloat((x + value).toFixed(1));
          obj.position.setY(obj.position.y - value * 1.8);
          break;
        case 'right':
          this.movePointParams.x = parseFloat((x - value).toFixed(1));
          obj.position.setY(obj.position.y + value * 1.8);
          break;
        case 'deg':
          obj.rotateZ(THREE.MathUtils.degToRad(z - value));

          this.movePointParams.z = value;
          break;
        default:
          break;
      }
    } else {
      switch (type) {
        case 'up':
          this.movePointParams.y = parseFloat((y + value).toFixed(1));
          obj.position.setY(obj.position.y + value * 1.8);
          break;
        case 'down':
          this.movePointParams.y = parseFloat((y - value).toFixed(1));
          obj.position.setY(obj.position.y - value * 1.8);
          break;

        case 'left':
          this.movePointParams.x = parseFloat((x + value).toFixed(1));
          obj.position.setX(obj.position.x - value * 1.8);
          break;
        case 'right':
          this.movePointParams.x = parseFloat((x - value).toFixed(1));
          obj.position.setX(obj.position.x + value * 1.8);
          break;
        case 'deg':
          obj.rotateZ(THREE.MathUtils.degToRad(z - value));
          this.movePointParams.z = value;
          break;
        default:
          break;
      }
    }

    // console.log(`${this.selectedPointName}调整结果`, this.movePointParams);
    store.commit('excavator/setVirtualPointData', this.movePointParams);

    // !!! 更新世界矩阵
    obj.updateMatrixWorld();
    // const v = getTransformedVertices(obj);
    // v.forEach((item, index) => {
    //   this.mapGroup.remove(this.mapGroup.getObjectByName(`test_${index}`));
    //   let a = new THREE.PlaneGeometry(1, 1);
    //   let b = new THREE.Mesh(a, new THREE.MeshBasicMaterial({ color: 'yellow' }));
    //   b.position.set(item.x, item.y, item.z);
    //   b.name = `test_${index}`;
    //   this.mapGroup.add(b);
    // });

    this.collisionDetection(obj);
  });

  // 删除虚拟停靠位/虚拟预停靠位/虚拟锚点
  Vue.prototype.$bus.$on('deleteVitualPoint', () => {
    this.movePointParams = {};
    store.commit('excavator/setVirtualPointData', this.movePointParams);
    this.mapGroup.remove(this.scene.getObjectByName(`virtual_${this.selectedPointName}`));
    const obj = this.scene.getObjectByName(this.selectedPointName);
    if (obj) {
      obj.material.opacity = 1;
      // 锚点
      if (obj.pointType == 2) {
        const lockSwitch = this.scene.getObjectByName(`maodian_switch_${obj.pointIndex}`);
        obj.isLock = true;
        obj.material.map = this.maodianRed;
        lockSwitch.isLock = true;
        lockSwitch.material.map = this.maodian_lock;
      }
    }
  });

  // 网格线
  Vue.prototype.$bus.$on('switchGridLine', isShow => {
    this.gridHelper.visible = isShow;
    console.log('switchGridLine', isShow, this.gridHelper);
  });

  Vue.prototype.$bus.$on('changeManualPointAngle', angle => {
    // console.log('angle', angle);
    let obj = this.mapGroup.getObjectByName('ManualPoint');
    if (!obj) return;
    obj.rotation.z = obj.originZ; // 每次旋转都先回到初始位置
    obj.rotateZ(THREE.MathUtils.degToRad(-angle));
    this.collisionDetection(obj);
  });
}
