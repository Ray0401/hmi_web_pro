import Vue from 'vue';
import store from '@/store';
import * as THREE from 'three';
import variables from '../../styles/variables.module.scss';
const {
  color_workarea_select,
  color_workarea_unselect,
  color_soilblock_open,
  color_soilblock_close,
  color_soilblock_distribute,
  color_soilblock_select,
} = variables;

const showMessage = title => {
  Vue.prototype.$toast(title);
};

// 获取点击mesh
function onMouseClick(event) {
  this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  this.raycaster.setFromCamera(this.mouse, this.camera2);
  let intersects = this.raycaster.intersectObjects(this.scene.children);
  // 调整步距模式下不支持其他点击
  if (store.state.excavator.stepDistanceFlag) return false;

  for (let i = 0; i < intersects.length; i++) {
    let item = intersects[i].object;
    // console.log('地图元素 item', item);
    if (item.name.includes('cpoint_2')) {
      let deg = item.deg;
      Vue.prototype.$bus.$emit('point', { data: deg });
      this.setCpointTexture(deg);
      return;
    }

    // 指点情况下地图不支持其他点击
    if (this.pointName == null) {
      // 点击停靠位/预停靠位/锚点进行拖动以及旋转
      if (item.name.includes('yutingkaowei_switch')) {
        Vue.prototype.$bus.$emit('setYutingkaoweiStatus');
        return;
      }
      // if (item.name.includes('maodian_switch')) {
      //   Vue.prototype.$bus.$emit('setPointStatus', item.lockIndex, item.isLock);
      //   this.setPointSwitchStatus(item);
      //   return;
      // }

      // if (item.hasOwnProperty('pointType')) {
      //   if (item.isLock) return;
      //   // 本期只可以点击停靠位调整
      //   if (item.pointType != 0) return;
      //   // 如果点击的不是当前面板选择的停靠位,不支持停靠位调整
      //   if (item.pointIndex != store.state.excavator.pointItem.stop_num) return;
      //   store.commit('excavator/setStepDistanceFlag', true);
      //   this.selectedPointName = item.name;
      //   Vue.prototype.$bus.$emit('setVirtualPoint', this.selectedPointName);
      //   return;
      // }
    }
  }

  // 手动指点下,禁止其他操作
  if (this.pointName != null) return;
  // !!! 辅助车辆作业区封锁解封 start /
  // 用户点击的坐标点是否只是作业区(不包括排土块等)
  const isWorkArea = intersects.some(item => item.object.name.includes('workArea'));
  // 用户点击的坐标点是否是排土块
  const isSoilBlock = intersects.some(item => item.object.name.includes('soilBlock'));

  // 作业区target
  const workAreaTarget = intersects.find(item => item.object.name.includes('workArea'));
  // 排土块target
  const soilBlockTarget = intersects.find(item => item.object.name.includes('soilBlock'));

  // 在采集模式下的点选作业区
  const { collectConfig, hasTargetWork, currentTargetWorkArea, canClickMapWorkArea } = store.state.bulldozer;
  // console.log('currentTargetWorkArea', currentTargetWorkArea);

  if (collectConfig.type) {
    if (!hasTargetWork && canClickMapWorkArea) {
      const { map_type, object_id } = store.state.carInDumpPosition;
      // 只能点选当前辅助车辆所在作业区
      if (workAreaTarget.object.workAreaType == map_type && workAreaTarget.object.workAreaId == object_id) {
        let workAreaParams = {
          workAreaName: workAreaTarget.object.name,
          workAreaType: workAreaTarget.object.workAreaType,
          workAreaId: workAreaTarget.object.workAreaId,
        };

        if (!currentTargetWorkArea) {
          // 如果点击的是排土块,则高亮排土块
          if (soilBlockTarget) {
            soilBlockTarget.object.material.color = new THREE.Color(color_soilblock_select);
            soilBlockTarget.object.children[1].material.color = new THREE.Color(color_workarea_select);
            // soilBlockTarget.object.material.opacity = 1;
            if (!this.soilBlockIds.includes(soilBlockTarget.object.soilBlockNum)) {
              this.soilBlockIds.push(soilBlockTarget.object.soilBlockNum);
            }
            store.commit('bulldozer/selectCurrentTargetWorkArea', {
              ...workAreaParams,
              soilBlockIds: this.soilBlockIds,
              selectType: 'soil',
            });
          } else {
            workAreaTarget.object.material.color = new THREE.Color(color_workarea_select);
            workAreaTarget.object.material.opacity = 0.7;
            store.commit('bulldozer/selectCurrentTargetWorkArea', { ...workAreaParams, selectType: 'workArea' });
          }
          // 已选取目标作业区信息
          Vue.prototype.$bus.$emit('selectTargetWork', 'yes');
        } else {
          if (soilBlockTarget) {
            if (currentTargetWorkArea.selectType === 'workArea') {
              showMessage('作业区和排土块只能选择一种');
              return;
            }
            /**
             * 若当前点击的排土块在soilBlockIds中已存在,则将已选中的排土块取消选中
             * 若当前点击的排土块在soilBlockIds中不存在,则说明又选择了新的排土块
             */
            if (this.soilBlockIds.includes(soilBlockTarget.object.soilBlockNum)) {
              this.soilBlockIds.splice(
                this.soilBlockIds.findIndex(id => soilBlockTarget.object.soilBlockNum === id),
                1
              );
              soilBlockTarget.object.material.color = new THREE.Color(handleSoilStatusColor(soilBlockTarget));
              soilBlockTarget.object.children[1].material.color = new THREE.Color(
                handleSoilStatusColor(soilBlockTarget)
              );
            } else {
              soilBlockTarget.object.material.color = new THREE.Color(color_soilblock_select);
              soilBlockTarget.object.children[1].material.color = new THREE.Color(color_workarea_select);
              this.soilBlockIds.push(soilBlockTarget.object.soilBlockNum);
            }

            !this.soilBlockIds.length && Vue.prototype.$bus.$emit('selectTargetWork', 'no');
            store.commit(
              'bulldozer/selectCurrentTargetWorkArea',
              this.soilBlockIds.length
                ? {
                    ...workAreaParams,
                    soilBlockIds: this.soilBlockIds,
                    selectType: 'soil',
                  }
                : null
            );
          } else {
            if (currentTargetWorkArea.selectType === 'soil') {
              showMessage('作业区和排土块只能选择一种');
              return;
            }
            workAreaTarget.object.material.color = new THREE.Color(color_workarea_unselect);
            workAreaTarget.object.material.opacity = 1;
            // 已取消目标作业区信息
            Vue.prototype.$bus.$emit('selectTargetWork', 'no');
            store.commit('bulldozer/selectCurrentTargetWorkArea', null);
          }
        }
      } else {
        showMessage('请选择当前车辆位置所在的作业区或者排土块');
      }
    }
    console.log('soilBlockIds', this.soilBlockIds);
  } else {
    // 非采集模式下的点选作业区
    const { map_type, object_id, packSpaceGroupName } = store.state.carInDumpPosition || {};
    if (isSoilBlock) {
      if (map_type == 3 && object_id == workAreaTarget.object.workAreaId) {
        Vue.prototype.$bus.$emit('openSoilBlockDetail', soilBlockTarget); // 推土机在排土场内 打开排土块详情弹窗
      }

      // Vue.prototype.$bus.$emit('openSoilBlockDetail', soilBlockTarget); // 推土机在排土场内 打开排土块详情弹窗
    } else if (isWorkArea) {
      // 当前车辆在用户点击的作业区内
      if ((map_type == 2 || map_type == 3) && object_id == workAreaTarget.object.workAreaId) {
        // 打开作业区抽屉
        Vue.prototype.$bus.$emit('openWorkAreaDrawer', {
          name: workAreaTarget.object.workAreaName,
          status: workAreaTarget.object.workAreaStatus,
          zone_type: workAreaTarget.object.workAreaType,
          zone_id: workAreaTarget.object.workAreaId,
        });
      }
    } else {
      Vue.prototype.$bus.$emit('closeWorkAreaDrawer');
    }
  }
  // !!! 辅助车辆作业区封锁解封 end /
}

// 取消选中的排土块,将排土块的颜色重置为8b05中的状态
function handleSoilStatusColor(target) {
  const data = store.state.bulldozer['8B05Data'];
  const current = data.find(item => item.stop_type == 2 && item.group_num == target.object.soilBlockNum) || {};
  const options = {
    1: color_soilblock_open,
    2: color_soilblock_close,
    3: color_soilblock_distribute,
  };
  return options[current.stop_group_status || 1];
}

export { onMouseClick };
