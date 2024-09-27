/*
 * @Author: 徐海瑞
 * @Date: 2023-01-31 10:38:01
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-09-27 14:32:57
 *
 * 绘制停靠位
 *
 */

import store from '@/store';
import * as THREE from 'three';
import earcut from 'earcut';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { SOIL } from '@/constant';
import variables from '../styles/variables.module.scss';
import { getBufferGeometryCenterPoint, destroyMesh, calVertices, groupAndModify, getAssetsFile } from '@/utils/utils';
const { color_soilblock_open, color_soilblock_close, color_soilblock_distribute } = variables;
let textCache = {}; // 缓存;

// 创建标签
const createLabel = (data, name) => {
  let lons = [];
  let lats = [];
  for (let i = 0; i < data.length / 3; i++) {
    lons.push(data[i * 3]);
    lats.push(data[i * 3 + 1]);
  }
  lons.sort((a, b) => a - b);
  lats.sort((a, b) => a - b);
  const elementDiv = document.createElement('div');
  const elementLabel = new CSS2DObject(elementDiv);
  elementLabel.position.set(Number(lons[0]), Number(lats[0]) + 1, 0);
  elementLabel.layers.set(0);
  let div = elementLabel.element;
  div.innerHTML = name;
  div.style.color = 'white';
  div.style.marginTop = '-10px';
  div.style.fontSize = '8px';
  textCache[name] = elementLabel;
  return elementLabel;
};

class Boundary {
  constructor() {
    this.id;
    this.name;
    this.type;
    this.polys = [];
    this.height = 0.01;
    this.poly = new THREE.BufferGeometry();
    this.group = new THREE.Group();
    this.index = 0;
    this.yutingkaowei_open = new THREE.TextureLoader().load(getAssetsFile('images/excavator/yutingkaowei_open.png'));
    this.yutingkaowei_close = new THREE.TextureLoader().load(getAssetsFile('images/excavator/yutingkaowei_close.png'));
    // this.orginVertices = [];
  }
  arrayNeedsUint32(array) {
    for (let i = array.length - 1; i >= 0; --i) {
      if (array[i] > 65535) return true;
    }
    return false;
  }
  init(item, material) {
    let len = Math.floor(item.list?.length / 4);
    for (let i = 0; i < 4; i++) {
      let ans = item.list[len * i];
      this.polys.push(...window.flatModel.convertLatLonToWorldPosArray(ans[1], ans[0], this.height));
    }
    // console.log('this.polys', this.polys);

    let triangleIndex = earcut(this.polys, null, 3);
    // console.log('triangleIndex', triangleIndex);
    this.poly.index = new THREE.Uint16BufferAttribute(triangleIndex, 1);
    let normals = [1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
    let uvs = [1, 0, 1, 1, 0, 1, 0, 0];
    this.poly.setAttribute('position', new THREE.Float32BufferAttribute(this.polys, 3));
    this.poly.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    this.poly.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    this.poly.computeVertexNormals();
    this.poly.computeBoundingBox();
    // this.orginVertices = groupAndModify(this.poly.attributes.position.array);

    const centerPoint = getBufferGeometryCenterPoint(this.poly);
    // console.log('中心点坐标:', centerPoint);

    const center = new THREE.Vector3();
    this.poly.boundingBox.getCenter(center);
    // 将几何体的顶点移动，使中心位于原点
    this.poly.translate(-center.x, -center.y, -center.z);

    const mesh = new THREE.Mesh(this.poly, material);
    // 创建一个虚拟的Object3D作为旋转中心
    const pivot = new THREE.Object3D();
    mesh.name = `point_${item.point_index}`;
    mesh.position.copy(center);
    mesh.position.setZ(0.01);
    mesh.pointIndex = item.point_index;
    mesh.heading = item.heading;
    // pivot.name = `point_${item.point_index}`;
    if (item.point_index < 2) {
      mesh.pointType = '0'; // 停靠位
      // mesh.customerVertices = this.orginVertices;
    } else {
      mesh.pointType = '1'; // 预停靠位
      mesh.isLock = false;
      const lockPlane = new THREE.PlaneGeometry(4, 4);
      const lockMesh = new THREE.Mesh(
        lockPlane,
        new THREE.MeshBasicMaterial({
          map: this.yutingkaowei_open,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
      );
      lockMesh.name = `yutingkaowei_switch_${item.point_index}`;
      lockMesh.lockIndex = item.point_index;
      lockMesh.isLock = false;
      lockMesh.occupy = false;
      lockMesh.position.set(centerPoint.x, centerPoint.y, 0.02);
      lockMesh.rotateZ(THREE.MathUtils.degToRad(-item.heading));
      // console.log('lockMesh', lockMesh);
      this.group.add(lockMesh);
    }

    pivot.renderOrder = 2;
    pivot.add(mesh);
    // console.log('pivot', pivot);
    this.group.add(pivot);
  }

  getGroup() {
    return this.group;
  }
}

class Boundarys {
  constructor() {
    this.group = new THREE.Group();
    this.boudArr = [];
    this.pointRed = new THREE.TextureLoader().load(getAssetsFile('images/excavator/pointRed.png'));
    this.pointGreen = new THREE.TextureLoader().load(getAssetsFile('images/excavator/pointGreen.png'));
    this.pointGrey = new THREE.TextureLoader().load(getAssetsFile('images/excavator/pointGrey.png'));
    this.pointBlue = new THREE.TextureLoader().load(getAssetsFile('images/excavator/pointBlue.png'));
  }
  getGroup() {
    return this.group;
  }
  async init(boudjson, index, list) {
    textCache = {};
    let obj = {
      map: this.pointGreen,
      // color: 'green',
      transparent: true,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    };
    // this.material = new THREE.MeshBasicMaterial(obj);

    if (this.group.children.length) {
      // 清空point的innerHTML
      this.group.children.forEach(item => {
        const p = item.children[0] || {};
        const c = (p.children && p.children[0]) || {};
        c.element && (c.element.innerHTML = '');
      });
    }

    // destroyMesh(...this.group.children);
    this.group.remove(...this.group.children);
    boudjson.forEach(item => {
      let boud;
      if (store.state.vehicleData.terminalType == SOIL) {
        boud = new CPoint();
        boud.init(item);
      } else {
        boud = new Boundary();
        if (index != item.point_index && item.point_index != list[Number(index) + 2]) {
          obj.opacity = 0.5;
        } else {
          obj.opacity = 1;
        }
        if (item.point_index > 1) {
          obj.map = this.pointBlue;
        } else {
          obj.map = this.pointGreen;
        }
        boud.init(item, new THREE.MeshBasicMaterial({ ...obj }));
      }
      this.boudArr.push(boud);
      this.group.renderOrder = 5;
      this.group.add(boud.getGroup());
    });
  }
}

class CPoint {
  constructor() {
    this.polys = [];
    this.height = 0.03;
    this.group = new THREE.Group();
    this['8B05Data'] = store.state.bulldozer['8B05Data'] || [];
  }
  getGroup() {
    return this.group;
  }
  init(item) {
    const geometry = new THREE.BufferGeometry();
    // 设置position
    this.polys.push(...window.flatModel.convertLatLonToWorldPosArray(item.lon, item.lat, this.height));
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.polys, 3));
    const material = new THREE.PointsMaterial({
      color: this.setColor(item.point_index),
      size: 10,
      transparent: true,
      depthTest: false,
      sizeAttenuation: false,
    });
    material.onBeforeCompile = shader => {
      shader.fragmentShader = shader.fragmentShader.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        `if (distance(gl_PointCoord, vec2(0.3, 0.3)) > 0.3) discard;
         vec4 diffuseColor = vec4( diffuse, opacity );`
      );
    };
    const point = new THREE.Points(geometry, material);
    const label = createLabel(this.polys, item.point_name);
    point.name = `soilPoint_${item.point_index}`;
    point.renderOrder = 2;
    point.add(label);
    this.group.add(point);
  }

  setColor(value) {
    const target = this['8B05Data'].find(i => i.stop_num == value) || {};
    const o = {
      1: color_soilblock_open,
      2: color_soilblock_close,
      3: color_soilblock_distribute,
    };
    return new THREE.Color(o[target.stop_group_status] || color_soilblock_close);
  }
}

export default Boundarys;
