/*
 * @Author: 徐海瑞
 * @Date: 2023-03-08 14:17:56
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-09-23 17:17:20
 *
 * three主文件
 *
 */
import Vue from 'vue';
import store from '@/store';

import * as THREE from 'three';
import { initOn } from './oberserve';
import * as initScene from './initScene';
import * as addGroup from './addGroup';
import * as render from './render';
import * as setGroup from './setGroup';
import * as carOperate from './carOperate';
import * as sceneEvent from './sceneEvent';
import { getTransformedVertices, getAssetsFile } from '../utils';
// import Stats from 'three/examples/jsm/libs/stats.module.js';

class Base3d {
  constructor(selector) {
    // this.stats = new Stats();
    this.container = document.querySelector(selector);
    this.camera;
    this.camera2;
    this.scene;
    this.renderer;
    this.controls;
    //this.controls2;
    this.lanes;
    this.roads;
    this.bouds;
    this.b3dCamera = false;
    this.carModel;
    this.carGroup;
    this.mapGroup;
    this.boxGroup;
    // this.deg = 0;
    this.updateNum = 0;
    this.tasktrail;
    this.heading = 0;
    this.carPosition = {};
    this.mode = 0; //区分第一/第三状态
    this.position = false; //区分是否跟随
    this.taskList = [];
    this.labelRenderer;
    this.headingObj = {};
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(0, 0);
    this.back = new THREE.TextureLoader().load(getAssetsFile('images/excavator/angleRange.png'));
    this.texture = new THREE.TextureLoader().load(getAssetsFile('images/excavator/angle.png'));
    this.textureActive = new THREE.TextureLoader().load(getAssetsFile('images/excavator/angleActive.png'));
    this.pointRed = new THREE.TextureLoader().load(getAssetsFile('images/excavator/pointRed.png'));
    this.pointGreen = new THREE.TextureLoader().load(getAssetsFile('images/excavator/pointGreen.png'));
    this.pointBlue = new THREE.TextureLoader().load(getAssetsFile('images/excavator/pointBlue.png'));
    this.pointGrey = new THREE.TextureLoader().load(getAssetsFile('images/excavator/pointGrey.png'));
    this.pointOrange = new THREE.TextureLoader().load(getAssetsFile('images/excavator/pointOrange.png'));
    this.maodian = new THREE.TextureLoader().load(getAssetsFile('images/excavator/maodian.png'));
    this.maodianRed = new THREE.TextureLoader().load(getAssetsFile('images/excavator/pointRed.png'));
    this.maodian_lock = new THREE.TextureLoader().load(getAssetsFile('images/excavator/maodian_lock.png'));
    this.maodian_unlock = new THREE.TextureLoader().load(getAssetsFile('images/excavator/maodian_unlock.png'));
    this.yutingkaowei_open = new THREE.TextureLoader().load(getAssetsFile('images/excavator/yutingkaowei_open.png'));
    this.yutingkaowei_close = new THREE.TextureLoader().load(getAssetsFile('images/excavator/yutingkaowei_close.png'));
    this.v2vRed = new THREE.TextureLoader().load(getAssetsFile('images/v2v_red.png'));
    this.v2vOrange = new THREE.TextureLoader().load(getAssetsFile('images/v2v_orange.png'));
    this.v2vGreen = new THREE.TextureLoader().load(getAssetsFile('images/v2v_green.png'));
    this.carHeading = 0;
    this.carName = '';
    this.positionZ = 0;
    this.pointName = null; //收集重新指点停靠位名字
    this.taskPath = {};
    this.workareaTaskInfo = null; // 8108路径数据
    this.init();
    this.animate();
    this.noEntryArea = false;
    this.minNoEntryHeading = null;
    this.maxNoEntryHeading = null;
    this.dis = null;
    this.oldNoEntryHeading = [];
    this.showNoEntryIndex = 0;
    this.taskAndPertaskNameList = [];
    this.aroundCarTimer = null; //周边车辆计时器
    this.aroundCarTimerObj = {};
    this.noEntryColor = '#00FF72';
    this.workAreaList = []; //封锁状态列表
    this.soilBlockIds = []; //选中的排土块id
    this.checkPointStopNum = 0; //当前选中的停靠位stop_num
    this.groupList = []; // 停靠位/预停靠位 stop_num列表
    this.selectedPointName = null; //当前点击的停靠位
    this.movePointParams = {}; // 移动停靠点的数据参数
    this.collisionDetectionList = []; //碰撞检测列表
    this.originZ = 0; //手动指点旋转原始值;

    // 单例模式
    if (Base3d.instance) {
      return Base3d.instance;
    }
    Base3d.instance = this;
  }

  // 添加网格线
  setGridLines() {
    if (this.gridHelper) return;
    // console.log('this.gridHelper', this.gridHelper);

    //网格辅助线
    this.gridHelper = new THREE.GridHelper(1000, 100, 'rgb(0,0,0)', 'rgb(0,0,0)'); // 7 网格大小 17网格数量 rgb(193,193,193) 网格颜色
    // console.log('store.state.excavator.positionInfo', store.state.excavator.positionInfo);
    // const pos = window.flatModel.convertLatLonToWorldPos(store.state.excavator.positionInfo);
    this.gridHelper.position.set(this.carGroup.position.x, this.carGroup.position.y, 0); //设置网格颜色
    this.gridHelper.rotation.x = -Math.PI / 2;
    this.gridHelper.visible = false; // 设置网格显示和隐藏
    this.scene.add(this.gridHelper);
  }

  setLanes(lanejson, type, bool) {
    this.lanes.init(lanejson, type, this.checkPointStopNum);
    if (type == 'taskLane' && !bool) {
      let list = lanejson[0];
      let newList = list.filter((item, index) => index % 10 == 0);
      this.taskList = [...newList];
    }
  }
  setRoads(roadjson, type) {
    this.roads.init(roadjson, type);
  }
  setBoudarys(boudjson, type) {
    // console.log('boudjson', boudjson, 'type', type);
    this.bouds.init(boudjson, type);

    if (['unloadArea', 'loadArea', 'previewLoadArea'].includes(type)) {
      this.updateWorkAreaStatus(this.workAreaList);
    }
  }
  setPoints(boudjson, type) {
    if (type === 'maodian') {
      // this.setMaodian(boudjson);
    } else {
      this.point.init(boudjson, this.checkPointStopNum, this.groupList);
    }
  }

  // 生成锚点
  setMaodian(data) {
    let group = new THREE.Group();
    this.mapGroup.remove(this.scene.getObjectByName(`group_maodian_${data.index}`));
    const material = new THREE.MeshBasicMaterial({
      map: this.maodianRed,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const lockMaterial = new THREE.MeshBasicMaterial({
      map: this.maodian_lock,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const pos = window.flatModel.convertLatLonToWorldPosArray(data.lon, data.lat, 0.01);

    // const targetPos = [
    //   pos[0] + 4 * Math.sin(THREE.MathUtils.degToRad(data.heading)),
    //   pos[1] + 4 * Math.cos(THREE.MathUtils.degToRad(data.heading)),
    //   pos[2],
    // ];

    // 锚点
    const plane = new THREE.PlaneGeometry(13.75, 26.5625, 4, 4);
    const mesh = new THREE.Mesh(plane, material);
    mesh.renderOrder = 5;
    mesh.name = `maodian_${data.index}`;
    mesh.isLock = true; // 锚点默认锁定状态
    mesh.pointType = '2'; // 停靠位0 预停靠位1 锚点值为2
    mesh.pointIndex = data.index;
    mesh.heading = data.heading;
    mesh.position.set(pos[0], pos[1]);
    mesh.rotateZ(THREE.MathUtils.degToRad(-data.heading));

    // 锚点开关状态
    const lockPlane = new THREE.PlaneGeometry(4, 4);
    const lockMesh = new THREE.Mesh(lockPlane, lockMaterial);
    lockMesh.name = `maodian_switch_${data.index}`;
    lockMesh.lockIndex = data.index;
    lockMesh.isLock = true;
    lockMesh.position.set(pos[0], pos[1], 0.01);
    lockMesh.rotateZ(THREE.MathUtils.degToRad(-data.heading));
    group.add(mesh);
    group.add(lockMesh);
    group.name = `group_maodian_${data.index}`;
    this.mapGroup.add(group);
  }

  setWorkBouds(data) {
    this.workBouds.init(data);
  }
  setWorkGroups(data) {
    this.workGroups.init(data);
  }

  // 碰撞检测
  collisionDetection(origin) {
    let bool = false;
    let type = 'point'; //停靠点与边界的枚举
    if (!origin) return false;

    // origin.material.map = origin.name === 'ManualPoint' ? this.pointOrange : this.pointGreen;

    const currentWorkarea = this.scene.getObjectByName(
      `workArea_${store.state.carInDumpPosition.map_type}_${store.state.carInDumpPosition.object_id}`
    );
    // console.log('currentWorkarea', currentWorkarea);

    if (currentWorkarea && this.checkBoundaryIntersection(origin, currentWorkarea)) {
      type = 'boundary';
      bool = true;
    } else {
      // for (let i = 0; i < this.collisionDetectionList.length; i++) {
      //   let targetName = this.collisionDetectionList[i];
      //   if (this.selectedPointName !== targetName) {
      //     let target = this.scene.getObjectByName(targetName);
      //     if (!target) {
      //       break;
      //     }
      //     // console.log('targetName', targetName);
      //     if (this.checkMeshIntersection(origin, target)) {
      //       type = 'point';
      //       bool = true;
      //       break;
      //     }
      //   }
      // }
    }
    if (bool) {
      Vue.prototype.$toast(type == 'point' ? '指点位置重叠,请重新指点' : '指点位置与边界冲突,请重新指点');
      origin.material.map = this.pointRed;
      // console.log('origin.material.map', origin.material.map);
      Vue.prototype.$bus.$emit('stopSendPoint', true);
    } else {
      origin.material.map = origin.name === 'ManualPoint' ? this.pointOrange : this.pointGreen;
      Vue.prototype.$bus.$emit('stopSendPoint', false);
    }

    // return bool;
  }

  // 两个mesh碰撞检测
  checkMeshIntersection(mesh1, mesh2) {
    // const box1 = new THREE.Box3().setFromObject(mesh1);
    // const box2 = new THREE.Box3().setFromObject(mesh2);
    // return box1.intersectsBox(box2);

    let bool = false;
    const vertices = getTransformedVertices(mesh1);
    // vertices.forEach((item, index) => {
    //   this.mapGroup.remove(this.mapGroup.getObjectByName(`test_${index}`));
    //   let a = new THREE.PlaneGeometry(1, 1);
    //   let b = new THREE.Mesh(a, new THREE.MeshBasicMaterial({ color: 'pink' }));
    //   b.position.set(item.x, item.y, item.z);
    //   b.name = `test_${index}`;
    //   this.mapGroup.add(b);
    // });
    for (let vertex of vertices) {
      let raycaster = new THREE.Raycaster();
      raycaster.set(vertex, new THREE.Vector3(0, 0, -1)); // 检测 z 轴负方向的射线
      let intersects = raycaster.intersectObject(mesh2);
      if (intersects.length > 0) {
        bool = true;
        break;
      }
    }
    // console.log('停靠位之间的检测:', bool);

    return bool;
  }

  // 边界检查函数
  checkBoundaryIntersection(mesh1, mesh2) {
    // 创建 Box3 来包围 BufferGeometry
    let box1 = new THREE.Box3().setFromObject(mesh1);
    let box2 = new THREE.Box3().setFromObject(mesh2);

    // 先检查包围盒是否相交,如果不相交再进行精细检查
    if (box1.intersectsBox(box2)) {
      return true;
    }

    let num = 0;
    let vertices = [];
    let geometry1 = mesh1.geometry;

    // 获取 mesh1 的顶点并转换为世界坐标系
    let positionAttribute = geometry1.getAttribute('position');
    for (let i = 0; i < positionAttribute.count; i++) {
      let vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(positionAttribute, i);
      vertex.applyMatrix4(mesh1.matrixWorld);
      vertices.push(vertex);
    }

    // 增加检测密度，通过检测几何中心、边和面
    geometry1.computeBoundingBox();
    let boundingBox1 = geometry1.boundingBox.clone();
    boundingBox1.applyMatrix4(mesh1.matrixWorld);
    let center1 = new THREE.Vector3();
    boundingBox1.getCenter(center1);
    vertices.push(center1);

    // 检测所有顶点
    for (let vertex of vertices) {
      let raycaster = new THREE.Raycaster();
      raycaster.set(vertex, new THREE.Vector3(0, 0, -1)); // 检测 z 轴负方向的射线
      let intersects = raycaster.intersectObject(mesh2);
      if (intersects.length > 0) num++;
    }

    // console.log('num', num);
    // num 为 0 表示 mesh1 与 mesh2 完全不相交
    // num 为顶点数 + 1 表示 mesh1 完全被包含于 mesh2 中
    // num 为 1 到顶点数表示 mesh1 与 mesh2 相交
    return num > 0 && num < positionAttribute.count + 1;
  }
}
Object.assign(Base3d.prototype, {
  initOn,
  ...initScene,
  ...addGroup,
  ...render,
  ...sceneEvent,
  ...carOperate,
  ...setGroup,
});
export default Base3d;
