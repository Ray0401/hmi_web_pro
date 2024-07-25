/*
 * @Author: 徐海瑞
 * @Date: 2023-03-08 14:17:04
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-07-17 15:48:44
 *
 * 增加group操作
 *
 */
import * as THREE from 'three';
import { MeshLineMaterial } from 'three.meshline';
import { calc_situation, three_distance, cal_targetLatLon, rotatePointAroundCenter } from '../utils';

// 添加不可驶入区域
function NoEntryZone(type, data) {
  this.dis =
    this.dis || three_distance(this.carPosition, calc_situation(this.carPosition.lon, this.carPosition.lat, 90));
  let circle = null;
  let lineObj = {
    opacity: 1,
    sizeAttenuation: 0,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
    transparent: true,
    side: THREE.DoubleSide,
    dashArray: 0.5, // 修改
    dashRatio: 0.1,
    dashOffset: 0,
  };
  if (type == 'noEntry') {
    if (this.carGroup.getObjectByName('noEntry')) this.carGroup.remove(this.carGroup.getObjectByName('noEntry'));
    if (this.minNoEntryHeading == null) return false;
    let min = this.minNoEntryHeading;
    let max = this.maxNoEntryHeading;
    if (this.mode == 1) {
      let heading = parseFloat(this.carPosition.heading);
      max = max > heading ? max - heading : max + 360 - heading;
      min = min > heading ? min - heading : min + 360 - heading;
    }
    max = min > max ? max + 360 - min : max - min;
    const geometry = new THREE.RingGeometry(0, this.dis, 1000, 32, (Math.PI / 180) * -min, (Math.PI / 180) * -max);
    const material = new THREE.MeshBasicMaterial({
      color: this.noEntryColor,
      opacity: 0.2,
      transparent: true,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
    });
    circle = new THREE.Mesh(geometry, material);
    circle.name = 'noEntry';
    circle.position.setZ(0.7);
    let edges = new THREE.EdgesGeometry(geometry);
    let line = new THREE.LineSegments(
      edges,
      new MeshLineMaterial({
        color: new THREE.Color(this.noEntryColor),
        ...lineObj,
      })
    );
    line.name = 'noEntry-text';
    circle.add(line);
  }
  if (type == 'setNoEntry') {
    if (this.carGroup.getObjectByName('noEntry')) {
      // destroyMesh(this.carGroup.getObjectByName('noEntry'));
      this.carGroup.remove(this.carGroup.getObjectByName('noEntry'));
    }
    const geometry = new THREE.CircleGeometry(this.dis, 1000, 0, Math.PI * 2);
    const material = new THREE.MeshBasicMaterial({
      color: '#7CA6B1',
      opacity: 0.2,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    circle = new THREE.Mesh(geometry, material);
    circle.name = 'setNoEntry';
    circle.position.setZ(0.5);
    let edges = new THREE.EdgesGeometry(geometry);
    let line = new THREE.LineSegments(
      edges,
      new MeshLineMaterial({
        color: new THREE.Color('#7CA6B1'),
        ...lineObj,
      })
    );
    circle.add(line);
  }
  if (type == 'drawOffsetAngle') {
    let start = parseFloat(data.startAngle);
    let end = parseFloat(data.endAngle);
    end = start > end ? end + 360 - start : end - start;
    const geometry = new THREE.RingGeometry(
      0,
      this.dis,
      1000,
      32,
      (Math.PI / 180) * -start,
      (Math.PI / 180) * -(end - start)
    );
    const material = new THREE.MeshBasicMaterial({
      // color: '#FF1515',
      color: '#00D2FF',
      opacity: 0.3,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    circle = new THREE.Mesh(geometry, material);
    circle.name = 'drawOffsetAngle';
    circle.position.setZ(0.7);
    var edges = new THREE.EdgesGeometry(geometry);
    let line = new THREE.LineSegments(
      edges,
      new MeshLineMaterial({
        color: new THREE.Color('#00D2FF'),
        ...lineObj,
      })
    );
    line.name = 'drawOffsetAngle-text';
    circle.add(line);
  }
  circle.position.setZ(0.2);
  circle.renderOrder = 1;
  this.carGroup.add(circle);
}
// 创建指点信息
function createPoint() {
  let len = null;
  if (localStorage.getItem('parameter')) len = JSON.parse(localStorage.getItem('parameter'))[0];
  let dis = three_distance(this.carPosition, calc_situation(this.carPosition.lon, this.carPosition.lat, 90, len));

  this.mapGroup.remove(this.mapGroup.getObjectByName('ManualPoint'));
  const cpoint = window.flatModel.convertLatLonToWorldPos({ x: this.carPosition.lon, y: this.carPosition.lat });
  const rPoint = { x: cpoint.x, y: cpoint.y + dis };
  // const pos = calculateTargetPoint(cpoint.x, cpoint.y, dis, this.carPosition.heading);

  const pos = rotatePointAroundCenter(cpoint, rPoint, parseFloat(this.carPosition.heading));
  // console.log('pos', pos);

  const originobj = this.mapGroup.getObjectByName('point_0') || this.mapGroup.getObjectByName('point_1');
  // 如果originobj不存在,说明地图上没有停靠点,需要生成虚拟的指点样式
  if (!originobj) {
    const plane = new THREE.PlaneGeometry(13.75, 26.5625, 4, 4);
    const mesh = new THREE.Mesh(
      plane,
      new THREE.MeshBasicMaterial({
        map: this.pointOrange,
        opacity: 1,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    );
    mesh.name = 'ManualPoint';
    mesh.position.set(pos.x, pos.y, 0.01);
    const rZ = THREE.MathUtils.degToRad(-parseFloat(this.carPosition.heading));
    mesh.rotateZ(rZ);
    mesh.heading = this.carPosition.heading;
    mesh.originZ = rZ;
    this.mapGroup.add(mesh);
    this.collisionDetection(mesh);
  } else {
    // 克隆几何体
    const clonedGeometry = originobj.geometry.clone(true);
    // 克隆材质
    const clonedMaterial = originobj.material.clone(true);
    clonedMaterial.opacity = 1;
    clonedMaterial.map = this.pointOrange;
    // 使用克隆的几何体和材质创建新的对象
    const mesh = new THREE.Mesh(clonedGeometry, clonedMaterial);
    mesh.name = 'ManualPoint';
    mesh.position.set(pos.x, pos.y, 0.01);
    const rZ = THREE.MathUtils.degToRad(-(360 - originobj.heading + parseFloat(this.carPosition.heading)));
    mesh.rotateZ(rZ);
    mesh.heading = this.carPosition.heading;
    mesh.originZ = rZ;
    this.mapGroup.add(mesh);
    this.collisionDetection(mesh);
  }
}

// 创建v2v告警信息
function createV2VWarning(data) {
  // destroyMesh(this.mapGroup.getObjectByName('createV2VWarning'));
  this.mapGroup.remove(this.mapGroup.getObjectByName('createV2VWarning'));
  const points = window.flatModel.convertLatLonToWorldPosArray(data.lon, data.lat);
  let group = new THREE.Group();
  let maxGroup = new THREE.Group();
  let obj = {
    opacity: 1,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  };
  const radiusArr = calc_raduis(data);
  const circleArr = [this.v2vRed, this.v2vOrange, this.v2vGreen];
  const segments = 64; //
  for (let i = 0; i < 3; i++) {
    const geometry = new THREE.PlaneGeometry(radiusArr[i] * 2, radiusArr[i] * 2, segments, segments);
    const material = new THREE.MeshBasicMaterial(Object.assign({ map: circleArr[i] }, obj));
    const circle = new THREE.Mesh(geometry, material);
    group.add(circle);
  }
  group.position.set(points[0], points[1], 0.2);
  group.renderOrder = 1;
  maxGroup.add(group);
  maxGroup.name = 'createV2VWarning';
  this.mapGroup.add(maxGroup);
}

//已知自车经纬度,求指定距离后的经纬度
function calc_raduis(position) {
  const distance = [10, 60, 100];
  let radiusArr = [];
  distance.forEach(dis => {
    // 计算指定距离后的经纬度
    let res = cal_targetLatLon(position.lon, position.lat, dis);
    // 跟自车位置进行距离计算,得出的值便是半径
    let radius = three_distance(position, res);
    radiusArr.push(radius);
  });
  return radiusArr;
}

export { NoEntryZone, createPoint, createV2VWarning };
