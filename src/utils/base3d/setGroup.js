/*
 * @Author: 徐海瑞
 * @Date: 2023-03-08 14:18:50
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-07-03 10:30:21
 *
 * 修改group操作
 *
 */
import * as THREE from 'three';
import variables from '../../styles/variables.module.scss';
const { color_workarea_lock, color_workarea_unlock } = variables;
// 修改透视相机参数
function setPerspectiveCamera() {
  this.b3dCamera = true;
  this.controls2.maxPolarAngle = Math.PI - Math.PI / 12;
  this.controls2.minPolarAngle = Math.PI / 2;
  this.controls2.maxAzimuthAngle = 0;
  this.controls2.minAzimuthAngle = 0;
  this.controls2.maxDistance = 7000;
  this.controls2.minDistance = 20;
  // this.controls2.panSpeed = 1;
  this.controls2.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE,
  };
  this.controls2.addEventListener('change', res => {
    if (res.bool) this.position = true;
  });
}
//右下角 + - 按钮
function setCamera2Y(index) {
  this.controls2.handleMouseWheel({ deltaY: index });
}
// 修改正交相机
function setOrthoCamera() {
  this.b3dCamera = false;
  this.controls.enabled = true;
}
// 修改指点样式
function setCpointTexture(deg) {
  let group = this.scene.getObjectByName('createPoint');
  group?.traverse(obj => {
    if (obj.name == 'cpoint_2') {
      obj.material.map = this.texture;
      if (obj.deg == deg) obj.material.map = this.textureActive;
    }
    if (obj.name == 'groupcar') {
      let heading = this.carHeading - deg;
      this.carHeading = deg;
      obj.rotateZ(THREE.MathUtils.degToRad(heading));

      // this.collisionDetection(obj);
    }
  });
}
// 特定状态（指点，设定区域）下相机改变视角变化
function setCameraStatus(type) {
  if (type == 'start') {
    this.position = true;
    let pos = window.flatModel.convertLatLonToWorldPos(this.carPosition);
    this.controls2.object.position.set(pos.x + 100, pos.y, 200);
    this.controls2.update(new THREE.Vector3(pos.x, pos.y, 0), true);
  } else {
    this.position = false;
  }
}
// 设置样式
function setMaterialsStyle(name, type, attr) {
  let group = this.scene.getObjectByName(name);
  if (group) group.material[type] = attr;
}

// 设置锚点开关样式
function setPointSwitchStatus(item) {
  let obj1 = this.scene.getObjectByName(`maodian_${item.lockIndex}`);
  obj1.material.map = item.isLock ? this.maodian : this.maodianRed;
  obj1.isLock = !item.isLock;
  let obj2 = this.scene.getObjectByName(item.name);
  obj2.material.map = item.isLock ? this.maodian_unlock : this.maodian_lock;
  obj2.isLock = !item.isLock;
}

// 路权
function setTaskLane() {
  let min = parseInt(this.taskPath.carPosition);
  let bool = this.taskPath.permission == 0;
  let max = bool ? this.taskList.length : this.taskPath.permission;
  let list = this.taskList.slice(Math.floor(min / 10), Math.floor(bool ? max : max / 10)) || [];
  this.setLanes([list], 'taskLane', true);
  if (this.taskPath.permission != 0) {
    max = this.taskPath.carPosition > this.taskPath.permission ? this.taskPath.carPosition : this.taskPath.permission;
    let perList = this.taskList.slice(Math.floor(max / 10), this.taskList.length) || [];
    this.setLanes([perList], 'perTaskLane');
  } else {
    this.setLanes([], 'perTaskLane');
  }
}
// 作业区封锁解封
function updateWorkAreaStatus(data) {
  data
    ?.filter(item => item.zone_type == 2 || item.zone_type == 3)
    ?.forEach(item => {
      const { zone_type, zone_id, zone_status } = item;
      let currentWorkArea = this.scene.getObjectByName(`workArea_${zone_type}_${zone_id}`);
      if (!currentWorkArea) return;
      currentWorkArea.workAreaStatus = zone_status; // 0x55封锁 0xAA未封锁
      currentWorkArea.material.color = new THREE.Color(
        `${zone_status == '0x55' ? color_workarea_lock : color_workarea_unlock}`
      );
      currentWorkArea.children[0].material &&
        (currentWorkArea.children[0].material.color = new THREE.Color(
          `${zone_status == '0x55' ? color_workarea_lock : color_workarea_unlock}`
        ));
      zone_status == '0x55' && (currentWorkArea.material.opacity = 0.5);
    });
}
export {
  setTaskLane,
  setMaterialsStyle,
  setCameraStatus,
  setCpointTexture,
  setOrthoCamera,
  setCamera2Y,
  setPerspectiveCamera,
  updateWorkAreaStatus,
  setPointSwitchStatus,
};
