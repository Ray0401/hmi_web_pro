/*
 * @Author: 徐海瑞
 * @Date: 2023-01-31 10:39:00
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2023-02-16 10:01:30
 *
 * 绘制作业边界
 *
 */
import * as THREE from 'three';
import earcut from 'earcut';
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';

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
  }
  init(item, material) {
    const { gps_list = [] } = item;

    this.id = item.boundary_id;
    this.type = item.boundary_type;
    this.name = item.boundary_name;
    gps_list.forEach(item => {
      this.polys.push(...window.flatModel.convertLatLonToWorldPosArray(item[1], item[0], this.height));
    });
    let vertices = new Float32Array(this.polys);
    let posAttr = new THREE.BufferAttribute(vertices, 3);
    this.poly.attributes.position = posAttr;

    let triangleIndex = earcut(this.polys, null, 3);
    let indexes = new Uint16Array(triangleIndex);
    this.poly.index = new THREE.BufferAttribute(indexes, 1);
    this.poly.computeVertexNormals();
    const mesh = new THREE.Mesh(this.poly, material);

    var edges = new THREE.EdgesGeometry(this.poly);
    let line = new THREE.LineSegments(
      edges,
      new MeshLineMaterial({
        color: new THREE.Color('#fff'),
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
    mesh.add(line);

    this.group.add(mesh);
  }
  getGroup() {
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
