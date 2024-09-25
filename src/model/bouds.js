/*
 * @Author: 徐海瑞
 * @Date: 2023-01-31 10:24:49
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-09-25 15:45:05
 *
 * 绘制作业区域边界
 *
 */
import * as THREE from 'three';
import earcut from 'earcut';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import polylabel from 'polylabel';
let boundaryInfo = {
  workArea: {
    materialStyle: {
      // 材质样式
      color: new THREE.Color('#2D3C4D'),
    },
    edgesStyle: {
      // 边框样式
      color: new THREE.Color('#606C85'),
    },
    showEdges: false, //是否显示边框
    delete: 'workArea', //重绘要删除的group name
    addName: true,
  },
  loadArea: {
    materialStyle: {
      // 材质样式
      color: new THREE.Color('#2D3C4D'),
    },
    edgesStyle: {
      // 边框样式
      color: new THREE.Color('#606C85'),
    },
    showEdges: false, //是否显示边框
    delete: 'loadArea', //重绘要删除的group name
    addName: true,
  },
  unloadArea: {
    materialStyle: {
      // 材质样式
      color: new THREE.Color('#2D3C4D'),
    },
    edgesStyle: {
      // 边框样式
      color: new THREE.Color('#606C85'),
    },
    showEdges: true, //是否显示边框
    delete: 'unloadArea', //重绘要删除的group name
    addName: true,
  },

  previewLoadArea: {
    materialStyle: {
      color: new THREE.Color('#00FFAC'),
      opacity: 0.3,
      depthTest: false,
      depthWrite: false,
    },
    edgesStyle: {
      color: new THREE.Color('#00FFAC'),
      // lineWidth: 10,
    },
    showEdges: false,
    delete: 'previewLoadArea',
    addName: true,
  },

  electricFence: {
    materialStyle: {
      color: new THREE.Color('#00EAFF'),
      opacity: 0.3,
      depthTest: false,
      depthWrite: false,
    },
    edgesStyle: {
      color: new THREE.Color('#00EAFF'),
      lineWidth: 10,
    },
    showEdges: true,
    delete: 'electricFence',
    addName: true,
  },
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
  }
  init(item, material, boudType) {
    // this.id = item.boundary_id;
    // this.type = item.boundary_type;
    // this.name = item.boundary_name;
    // console.log('boudType', boudType, item);

    const { name, type, object_id, gps_list = [], id } = item;

    this.id = object_id || id;
    this.type = type;
    this.name = name;
    for (let i = 0; i < gps_list.length; i += 1) {
      let item = gps_list[i];
      this.polys.push(...window.flatModel.convertLatLonToWorldPosArray(item[1], item[0], this.height));
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
    const mesh = new THREE.Mesh(this.poly, material);
    if (boundaryInfo[boudType]?.showEdges) {
      let edges = new THREE.EdgesGeometry(this.poly);
      let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial(boundaryInfo[boudType]?.edgesStyle));
      mesh.add(line);
    }
    if (boudType != 1) {
      let list = [];
      for (let i = 0; i < this.polys.length / 3; i++) {
        list.push([this.polys[i * 3], this.polys[i * 3 + 1]]);
      }
      let poly = polylabel([list], 1.0);
      const earthDiv = document.createElement('div');
      earthDiv.style.color = '#ffffff';
      earthDiv.style.fontSize = '16px';
      earthDiv.textContent = this.name || this.id;
      const earthLabel = new CSS2DObject(earthDiv);
      earthLabel.position.set(poly[0], poly[1], 2);
      earthLabel.name = 'label';
      mesh.add(earthLabel);
      earthLabel.layers.set(0);
      // // sprite.position.set(lons[0] + ((lons.at(-1) - lons[0]) / 2) - 20, lats[0] + ((lats.at(-1) - lats[0]) / 2),2);
      // mesh.add(sprite);
      // const mesh = new THREE.Mesh(this.poly, spriteMaterial);
      // mesh.add(sprite);
    }

    // 增加作业区相关属性
    if (this.type == 2 || this.type == 3) {
      Object.assign(mesh, {
        name: `workArea_${this.type}_${this.id}`, // 作业区标识
        workAreaName: this.name, // 作业区名称
        workAreaId: this.id, // 作业区编号
        workAreaType: this.type, // 作业区类型
        workAreaStatus: '0xAA', // 作业区当前状态
      });
    }
    if (['electricFence', 'previewLoadArea'].includes(boudType)) this.group.renderOrder = 2;
    this.group.add(mesh);
  }
  createCanvas(text) {
    let canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    let context = canvas.getContext('2d');
    context.imageSmoothingQuality = 'high';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.lineWidth = 4;
    let halfWidth = canvas.width / 2;
    let halfHeight = canvas.height / 2;
    // 画描边
    context.font = `16px "Microsoft YaHei"`;
    context.strokeStyle = '#000';
    context.strokeText(text, halfWidth, halfHeight);

    // 画文字
    context.fillStyle = '#fff';
    context.fillText(text, halfWidth, halfHeight);
    return canvas;
  }
  getGroup(type) {
    this.group.name = type;
    return this.group;
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
  async init(boudjson, type = 'workArea') {
    let material = {
      color: new THREE.Color('#212d40'),
      transparent: true,
      opacity: 0.8,
      alphaTest: 0,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
    };

    if (boundaryInfo[type]?.delete) {
      let groupList = this.group.children;
      let list = [];
      for (let i = 0; i < groupList.length; i++) {
        if (groupList[i].name == boundaryInfo[type]?.delete) {
          let label = groupList[i].getObjectByName('label');
          if (label) label.parent.remove(label);
          list.push(groupList[i]);
        }
      }
      // destroyMesh(...list);
      this.group.remove(...list);
    }
    if (boundaryInfo[type]?.materialStyle) material = { ...material, ...boundaryInfo[type].materialStyle };
    boudjson?.forEach?.(item => {
      let boud = new Boundary();
      boud.init(item, new THREE.MeshBasicMaterial(material), type);
      this.boudArr.push(boud);
      if (['electricFence', 'previewLoadArea'].includes(type)) this.group.renderOrder = 2;
      this.group.add(boud.getGroup(type));
    });
  }
}

export default Boundarys;
