/*
 * @Author: 徐海瑞
 * @Date: 2023-01-31 10:39:33
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2023-08-30 14:43:56
 * 绘制推土机作业区域
 *
 */
import * as THREE from 'three';
import { MeshLineMaterial } from 'three.meshline';
import earcut from 'earcut';
import store from '../store';
import { SOIL } from '@/constant';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import variables from '../styles/variables.module.scss';
const { color_soilblock_open, color_soilblock_close } = variables;
let textCache = {}; // 缓存;

class Boundary {
  constructor() {
    this.id;
    this.name;
    this.type;
    this.polys = [];
    this.height = 0.01;
    // this.leftline = new THREE.BufferGeometry();
    // this.rightlien = new THREE.BufferGeometry();
    this.poly = new THREE.BufferGeometry();
    this.group = new THREE.Group();
    this.isSoilTerminal = store.state.vehicleData.terminalType == SOIL; // 是否是排土协同终端
  }
  init(item, material) {
    // console.log('item', item);
    const { list = [], dock_group_index, name } = item;

    // this.id = item.boundary_id;
    // this.type = item.boundary_type;
    // this.name = item.boundary_name;

    this.id = dock_group_index;
    this.name = name;

    list.forEach(item => {
      this.polys.push(...window.flatModel.convertLatLonToWorldPosArray(item[1], item[0], this.height));
    });
    let vertices = new Float32Array(this.polys);
    let posAttr = new THREE.BufferAttribute(vertices, 3);
    this.poly.attributes.position = posAttr;

    let triangleIndex = earcut(this.polys, null, 3);
    let indexes = new Uint16Array(triangleIndex);
    this.poly.index = new THREE.BufferAttribute(indexes, 1);
    this.poly.computeVertexNormals();

    const data = store.state.bulldozer['8B05Data'] || [];

    // 排土块材质颜色
    const plane = new THREE.MeshBasicMaterial({
      color: this.setColor(data, dock_group_index),
      opacity: 0.3,
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });

    const mesh = this.isSoilTerminal ? new THREE.Mesh(this.poly, plane) : new THREE.Mesh(this.poly, material);
    var edges = new THREE.EdgesGeometry(this.poly);
    let line = new THREE.LineSegments(
      edges,
      new MeshLineMaterial({
        color: this.setColor(data, dock_group_index),
        opacity: 1,
        sizeAttenuation: 0,
        lineWidth: 10,
        depthTest: false,
        depthWrite: false,
        blending: THREE.NoBlending,
        transparent: true,
        side: THREE.DoubleSide,
      })
    );
    mesh.name = this.name;

    // 为排土终端的排土块设置标签名称以及其他属性
    if (this.isSoilTerminal) {
      const soilBlockNameLabel = this.createLabel(this.polys, this.name);
      // 设置排土块状态
      const curData = data.find(item => item.group_num == dock_group_index && item.stop_type == 2) ?? {};

      Object.assign(mesh, {
        name: `soilBlock_${dock_group_index}`, // three对象的名称
        soilBlockStatus: curData.stop_group_status || '2', // 排土块状态  1开启 2关闭 3已分配
        soilBlockNum: dock_group_index, // 排土块编号
        soilBlockName: this.name, // 排土块名称
      });

      mesh.add(soilBlockNameLabel);
    }

    mesh.add(line);
    mesh.renderOrder = 1;

    this.group.add(mesh);
  }
  getGroup() {
    return this.group;
  }

  setColor(data, index) {
    // console.log('data', data, 'index', index);
    let color = '#fff';
    if (this.isSoilTerminal) {
      const curData = data.find(item => item.group_num == index && item.stop_type == 2) ?? {};
      color = curData?.stop_group_status == 1 ? color_soilblock_open : color_soilblock_close;
    }
    return new THREE.Color(color);
  }

  // 创建标签
  createLabel(data, name) {
    if (textCache[name]) {
      // 如果已经存在,直接返回缓存中的对象
      return textCache[name];
    }

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
    elementLabel.position.set(lons[0] + (lons.at(-1) - lons[0]) / 2, lats[0] + (lats.at(-1) - lats[0]) / 2, 2);
    elementLabel.layers.set(0);
    let div = elementLabel.element;
    div.innerHTML = name;
    div.style.color = 'white';
    div.style.fontSize = '.5rem';
    textCache[name] = elementLabel;
    return elementLabel;
  }
}

class Boundarys {
  constructor() {
    this.group = new THREE.Group();
    this.boudArr = [];
  }
  getGroup() {
    return this.group;
  }
  async init(boudjson) {
    //console.log(roadjson);
    this.material = await new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.7,
      alphaTest: 0.4,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
    });

    let obj = {
      transparent: true,
      // map: new THREE.CanvasTexture(this.createCanvas('作业区域名称')),
      opacity: 0,
      alphaTest: 0.4,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
    };

    textCache = {};

    if (this.group.children.length) {
      // 清空point的innerHTML
      this.group.children.forEach(item => {
        const p = item.children[0] || {};
        const c = (p.children && p.children[0]) || {};
        c.element && (c.element.innerHTML = '');
      });
    }

    this.group.remove(...this.group.children);
    boudjson?.forEach?.(item => {
      let boud = new Boundary();
      boud.init(item, new THREE.MeshBasicMaterial({ ...obj }));
      this.boudArr.push(boud);
      this.group.add(boud.getGroup());
    });
  }
}

export default Boundarys;
