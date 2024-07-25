/*
 * @Author: 徐海瑞
 * @Date: 2023-01-31 10:38:21
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2023-02-17 11:24:21
 *
 * 绘制车道边界
 *
 */
import * as THREE from 'three';
import FlatModel from '../utils/FlatModel';
import earcut from 'earcut';
let roadInfo = {
  road_boundry: {
    materialStyle: {
      // 材质样式
      color: new THREE.Color('#2D3C4D'),
    },
    edgesStyle: {
      // 边框样式
      color: new THREE.Color('#606C85'),
    },
    showEdges: false, //是否显示边框
    delete: 'road_boundry', //重绘要删除的group name
  },
  reviewSensorCollect: {
    materialStyle: {
      color: new THREE.Color('#FF5900'),
      opacity: 1,
    },
    showEdges: false,
    delete: 'reviewSensorCollect',
  },
};
class Road {
  constructor() {
    this.id;
    this.name;
    this.type;
    // this.lefts;
    // this.rights;
    this.polys = [];
    this.height = 0.01;
    // this.leftline = new THREE.BufferGeometry();
    // this.rightlien = new THREE.BufferGeometry();
    this.poly = new THREE.BufferGeometry();
    this.group = new THREE.Group();
  }
  init(item, material, type) {
    const { name, object_id, gps_list = [] } = item;

    this.id = object_id;
    this.name = name;
    // this.type = item.type;

    for (let i = 0; i < gps_list.length; i += 20) {
      let item = gps_list[i];
      this.polys.push(...(window.flatModel.convertLatLonToWorldPosArray(item[1], item[0], this.height) || []));
    }
    let lastItem = gps_list.at(-1);
    this.polys.push(...window.flatModel.convertLatLonToWorldPosArray(lastItem[1], lastItem[0], this.height));
    let vertices = new Float32Array(this.polys);
    let posAttr = new THREE.BufferAttribute(vertices, 3);
    this.poly.attributes.position = posAttr;
    let triangleIndex = earcut(this.polys, null, 3);
    let indexes = new Uint16Array(triangleIndex);
    this.poly.index = new THREE.BufferAttribute(indexes, 1);
    this.poly.computeVertexNormals();
    let mesh = new THREE.Mesh(this.poly, material);
    mesh.name = type;
    if (roadInfo[type].showEdges) {
      let edges = new THREE.EdgesGeometry(this.poly, 1);
      let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial(roadInfo[type].edgesStyle));
      mesh.add(line);
    }
    this.group.add(mesh);
  }
  getGroup(type) {
    this.group.name = type;
    return this.group;
  }
}

class Roads {
  constructor() {
    this.group = new THREE.Group();
  }
  getGroup() {
    return this.group;
  }
  async init(roadjson, type = 'road_boundry') {
    this.material = await new THREE.MeshBasicMaterial({
      // color: new THREE.Color('#ffffff'),
      transparent: true,
      opacity: 0.7,
      alphaTest: 0.4,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
    });
    if (roadInfo[type]?.delete) {
      let groupList = this.group.children;
      let list = [];
      for (let i = 0; i < groupList.length; i++) {
        if (groupList[i].name == roadInfo[type]?.delete) {
          list.push(groupList[i]);
        }
      }
      this.group.remove(...list);
    }
    if (roadInfo[type]?.materialStyle) Object.assign(this.material, roadInfo[type].materialStyle);
    roadjson?.forEach?.(item => {
      let road = new Road();
      road.init(item, this.material, type);
      this.group.add(road.getGroup(type));
    });
  }
}

export default Roads;
