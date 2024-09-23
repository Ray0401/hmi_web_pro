/*
 * @Author: 徐海瑞
 * @Date: 2023-03-08 14:17:33
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-09-23 17:20:29
 *
 * 车辆模型相关操作
 *
 */
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import variables from '../../styles/variables.module.scss';
import { getAssetsFile, matchVehicleModel } from '../utils';
const { color_aroundcar_safe, color_aroundcar_warning } = variables;

function matchModel(name, ext) {
  const url = new URL(`../../assets/models/${name}.${ext}`, import.meta.url);
  return url.href;
}

function processLoadedObject(_this, obj, type, model, data, resolve) {
  // console.log('obj instanceof THREE.Group', obj, obj instanceof THREE.Group);
  if (!obj || !(obj instanceof THREE.Group)) return;
  obj.traverse(item => {
    if (item.material && Array.isArray(item.material)) {
      item.material.forEach(item1 => {
        item1.transparent = true;
      });
      item.renderOrder = 2;
    }
  });
  if (type != 'mineCard') obj.scale.set(1.5, 1.5, 1.5);
  obj.renderOrder = 2;
  const earthDiv = document.createElement('div');
  earthDiv.style.color = '#ffffff';
  earthDiv.style.fontSize = '18px';
  earthDiv.style.position = 'absolute';
  earthDiv.style.top = '-20px';
  earthDiv.textContent = _this.carName ?? model;
  const earthLabel = new CSS2DObject(earthDiv);
  earthLabel.layers.set(0);
  obj.add(earthLabel);
  obj.rotateZ(THREE.MathUtils.degToRad(90));
  obj.rotateX(THREE.MathUtils.degToRad(90));
  if (data) {
    const { name, lon, lat, heading, distance, showDistance } = data;
    let group = new THREE.Group();
    group.name = name;
    obj.name = name + '_obj';
    if (showDistance == '1') {
      const distanceColor = `color:${distance < 60 ? color_aroundcar_warning : color_aroundcar_safe}`;
      const _distance = parseInt(distance);
      earthDiv.innerHTML = `
         <span>${name}</span>
         <span style=${distanceColor}>${_distance}m</span>
        `;
    } else {
      earthDiv.textContent = name;
    }
    data.x = parseFloat(lon);
    data.y = parseFloat(lat);
    let pos = window.flatModel.convertLatLonToWorldPos(data);
    group.position.set(pos.x, pos.y, 1.01);
    obj.rotateY(THREE.MathUtils.degToRad(parseFloat(-heading)));
    _this.headingObj[name] = parseFloat(heading);
    group.rotateZ(THREE.MathUtils.degToRad(90));
    group.add(obj);
    _this.mapGroup.add(group);
  }
  if (!data) {
    _this.carModel && _this.carModel.removeFromParent();
    _this.carModel = obj;
    _this.carGroup.add(_this.carModel);
    _this.carGroup.rotateZ(THREE.MathUtils.degToRad(90));
    _this.carGroup.renderOrder = 1;
    earthLabel.name = 'positionCarName';
  }
  resolve('加载模型成功');
}

// 加载车辆

function loadCar(type = 100, data) {
  console.log('loadCar ', type);
  let _this = this;
  const model = matchVehicleModel(type);
  if (!model) return;

  // 检查是否已经加载过材质
  if (!window.materialsCache) {
    window.materialsCache = {};
  }
  if (!window.objectsCache) {
    window.objectsCache = {};
  }
  const materialKey = `${model}_mtl`;
  const objKey = `${model}_obj`;

  return new Promise((resolve, reject) => {
    if (window.materialsCache[materialKey] && window.objectsCache[objKey]) {
      // console.log(`复用${model}材质和对象`);
      // 使用缓存的材质和对象
      const materials = window.materialsCache[materialKey];
      const obj = window.objectsCache[objKey].clone();
      // console.log('obj-1111111', obj);
      processLoadedObject(_this, obj, type, model, data, resolve);
    } else {
      let mtlLoader = new MTLLoader();
      mtlLoader.load(matchModel(model, 'mtl'), materials => {
        materials.preload();
        window.materialsCache[materialKey] = materials;

        let loader = new OBJLoader();
        loader.setMaterials(materials);

        loader.load(
          matchModel(model, 'obj'),
          obj => {
            window.objectsCache[objKey] = obj.clone();
            processLoadedObject(_this, obj, type, model, data, resolve);
          },
          e => {},
          err => {
            reject(err.message);
          }
        );
      });
    }
  });
}
// 加载周边车辆
function setAroundCar(data = []) {
  let arr = [];
  for (let i = 0; i < data.length; i++) {
    let group = this.scene.getObjectByName(data[i].name);
    let group_obj = this.scene.getObjectByName(`${data[i].name}_obj`);
    // console.log('group', group, 'group_obj', group_obj);
    arr.push(data[i].name);
    // clearTimeout(this.aroundCarTimerObj[data[i].name]);
    // this.aroundCarTimerObj[data[i].name] = null;
    if (group) {
      data[i].x = parseFloat(data[i].lon);
      data[i].y = parseFloat(data[i].lat);
      let pos = window.flatModel.convertLatLonToWorldPos(data[i]);
      group.position.set(pos.x, pos.y, 1.01);
      group_obj.rotateY(THREE.MathUtils.degToRad(-(parseFloat(data[i].heading) - this.headingObj[data[i].name])));
      // 卡车离辅助车辆的距离相关逻辑
      if (data[i].showDistance == '1') {
        const distanceColor = `color:${data[i].distance < 60 ? color_aroundcar_warning : color_aroundcar_safe}`;
        const _distance = parseInt(data[i].distance);
        group_obj?.children?.[1] &&
          (group_obj.children[1].element.innerHTML = `
             <span>${data[i].name}</span>
             <span style=${distanceColor}>${_distance}m</span>
            `);
      } else {
        group_obj?.children?.[1] && (group_obj.children[1].element.innerHTML = `${data[i].name}`);
      }
    } else if (!(data[i].name in this.headingObj)) {
      this.loadCar(data[i].vehicleType, data[i]);
    }
    this.headingObj[data[i].name] = parseFloat(data[i].heading);
  }
  // 删除无推送的车辆
  for (let a in this.headingObj) {
    if (arr.indexOf(a) < 0) {
      let oldCar = this.scene.getObjectByName(a);
      let oldCarModel = this.mapGroup.getObjectByName(`${a}_obj`);
      if (!oldCar) return;
      delete this.headingObj[a];
      oldCarModel.remove(oldCarModel.children?.at(-1));
      disposeGroup(oldCar);
    }
  }
}
//更新车辆信息
function updateCar() {
  if (!this.carModel) return;
  this.updateNum++;
  if (this.updateNum <= 5) return;
  if ('lon' in this.carPosition) {
    this.carPosition.x = parseFloat(this.carPosition.lon);
    this.carPosition.y = parseFloat(this.carPosition.lat);
    let pos = window.flatModel.convertLatLonToWorldPos(this.carPosition);
    if (!this.position) {
      this.controls2.object.position.set(pos.x, pos.y - 50, 70);
      this.controls2.update(new THREE.Vector3(pos.x, pos.y, 0));
    }
    let heading = parseFloat(this.carPosition.heading) - this.heading;
    this.heading = parseFloat(this.carPosition.heading);
    this.mapGroup.position.set(-pos.x, -pos.y, 0);
    this.boxGroup.position.set(pos.x, pos.y, 0);
    if (this.mode == 0) {
      if (heading != 0) this.carModel.rotateY(THREE.MathUtils.degToRad(-heading));
    } else {
      if (heading != 0) {
        if (this.carGroup.getObjectByName('noEntry')) {
          this.carGroup.getObjectByName('noEntry').rotateZ(THREE.MathUtils.degToRad(heading));
          this.NoEntryZone('noEntry');
        }
        this.boxGroup.rotateZ(THREE.MathUtils.degToRad(heading));
      }
    }
    this.carGroup.position.set(pos.x, pos.y, 0);
    this.setGridLines();
  }
  this.updateNum = 0;
}

// 清理并释放组及其子对象所占用的资源
function disposeGroup(group) {
  if (group.parent) {
    group.parent.remove(group);
  }
  group.traverse(function (object) {
    if (object.geometry) {
      object.geometry.dispose();
    }
    if (object.material) {
      // 如果材质是数组
      if (Array.isArray(object.material)) {
        object.material.forEach(material => material.dispose());
      } else {
        object.material.dispose();
      }
    }
    if (object.texture) {
      object.texture.dispose();
    }
  });
  group.clear();
}

export { loadCar, setAroundCar, updateCar };
