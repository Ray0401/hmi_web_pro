/*
 * @Author: 徐海瑞
 * @Date: 2023-01-31 10:23:32
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-05-23 20:52:45
 *
 *  绘制各种线
 *
 */
import * as THREE from 'three';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { destroyMesh } from '@/utils/utils';

class Lane {
  constructor() {
    this.laneid;
    this.lanename;
    this.loadtype;
    this.conEleid;
    this.conEletype;
    this.headings = [];
    this.xyzs = [];
    this.height = 0.02;
    this.geometry = new THREE.BufferGeometry();
  }

  initLatlons(latlons, type) {
    let types = ['mapline', 'RoadCenter', 'loadAreaLine'];
    if (types.includes(type)) {
      for (let i = 0; i < latlons.length; i += 20) {
        let item = latlons[i];
        let point = new THREE.Vector3(item[1], item[0], this.height);
        let xyz = window.flatModel.convertLatLonToWorldPos(point);
        xyz.z = this.height;
        this.xyzs.push(xyz);
      }
      let lastItem = latlons.at(-1);
      let point = new THREE.Vector3(lastItem[1], lastItem[0], 0);
      let xyz = window.flatModel.convertLatLonToWorldPos(point);
      xyz.z = this.height;
      this.xyzs.push(xyz);
    } else {
      latlons.forEach((item, index) => {
        let point = new THREE.Vector3(item[1], item[0], this.height);
        if (['taskLane', 'exTaskLane', 'exTaskLane1', 'perTaskLane'].includes(type))
          point = new THREE.Vector3(item[5], item[4], this.height);
        if (['collect', 'boundary', 'soil', 'obstacle'].includes(type)) {
          point = new THREE.Vector3(item.lon, item.lat, this.height);
        }
        if (['workareaTaskLane', 'workareaPerTaskLane'].includes(type)) {
          point = new THREE.Vector3(item[1], item[0], this.height); // todo 这里取值需要修改
        }
        var xyz = window.flatModel.convertLatLonToWorldPos(point);
        xyz.z = this.height;
        this.xyzs.push(xyz);
      });
    }
    this.geometry.setFromPoints(this.xyzs);
  }

  getGeometry() {
    return this.geometry;
  }
}
class Lanes {
  constructor() {
    this.group = new THREE.Group();
    this.laneArr = [];
  }

  getGroup() {
    return this.group;
  }
  findlane(name) {
    let item = null;
    this.laneArr.forEach(element => {
      if (element.lanename == name) {
        item = element;
      }
    });
    return item;
  }

  init(lanejson, type, index) {
    const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    let obj = {
      color: new THREE.Color('#606C85'),
      opacity: 1,
      resolution: resolution,
      sizeAttenuation: 0,
      lineWidth: 3,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending,
      transparent: true,
      side: THREE.DoubleSide,
      repeat: new THREE.Vector2(10.0, 10.0),
    };
    let dashObj = {
      color: new THREE.Color('#fff'),
      // scale: 1,
      // dashSize: 2,
      // gapSize: 1.5,
      opacity: 1,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      transparent: true,
    };
    switch (type) {
      // 采集路径
      case 'collect':
        obj.color = 'red';
        obj.lineWidth = 10;
        break;
      // 任务路径
      case 'taskLane':
        obj.color = 'green';
        obj.lineWidth = 10;
        break;
      case 'perTaskLane':
        obj.color = 'blue';
        obj.lineWidth = 10;
        break;

      // 车道线 车道中心线
      case 'mapline':
      case 'RoadCenter':
      case 'loadAreaLine':
        let list = [];
        this.group?.traverse(item => {
          if (item.name == type) {
            list.push(item);
          }
        });
        // destroyMesh(...list);
        this.group.remove(...list);
        break;

      // 推土机采集边界
      case 'boundary':
        obj.color = '#526AFF';
        obj.lineWidth = 10;
        break;
      // 推土机采集排土线
      case 'soil':
        obj.color = '#00FBEC';
        obj.lineWidth = 10;
        break;
      // 推土机采集障碍物
      case 'obstacle':
        obj.color = '#FF00E0';
        obj.lineWidth = 10;
        break;
      // 感知采集预览
      case 'preViewCollect':
        obj.color = '#FF5900';
        obj.lineWidth = 10;
        break;
      // 障碍物
      case 'obstaclesLine':
        obj.color = '#FF00E0';
        obj.lineWidth = 4;
        break;
      // 作业区内的矿卡任务路径
      case 'workareaTaskLane':
        obj = { ...dashObj };
        break;
      case 'exTaskLane':
        obj = { ...dashObj, opacity: index == 0 ? 1 : 0.5 };
        break;
      case 'exTaskLane1':
        obj = { ...dashObj, opacity: index == 1 ? 1 : 0.5 };
        break;
      // 作业区内的矿卡任务路权
      case 'workareaPerTaskLane':
        obj.color = '#00FBEC';
        obj.lineWidth = 10;
        break;
      // 建图预览左侧路径
      case 'reviewSensorCollectLeft':
        obj.color = '#FF5900';
        obj.lineWidth = 10;
        break;
      // 建图预览右侧路径
      case 'reviewSensorCollectRight':
        obj.color = '#FF5900';
        obj.lineWidth = 10;
        break;
      default:
        break;
    }

    if (['workareaTaskLane', 'workareaPerTaskLane'].includes(type)) {
      if (type == 'workareaTaskLane') {
        // 路径
        lanejson?.forEach?.(item => {
          const { lane_list, imei, lane_id } = item;
          const material = new THREE.LineDashedMaterial(obj);
          let lane = new Lane();
          lane.initLatlons(lane_list, type);
          //虚线
          const line = new THREE.LineSegments(lane.getGeometry(), material);
          // 计算LineDashedMaterial所需的距离的值的数组。
          line.computeLineDistances();
          line.name = `${type}_${imei}_${lane_id}`;
          // this.group.remove(this.group.getObjectByName(line.name));
          this.group.add(line);
        });
      } else {
        // 路权
        lanejson?.forEach?.(item => {
          const { lane_list, imei, lane_id } = item;
          const material = new MeshLineMaterial(obj);
          let lane = new Lane();
          lane.initLatlons(lane_list, type);
          let line = new MeshLine();
          line.setGeometry(lane.getGeometry());
          const mesh = new THREE.Mesh(line, material);
          mesh.name = `${type}_${imei}_${lane_id}`;
          // this.group.remove(this.group.getObjectByName(line.name));
          this.group.add(mesh);
        });
      }
    } else {
      let material = new MeshLineMaterial(obj);
      if (type.includes('exTaskLane')) material = new THREE.LineDashedMaterial(obj);
      if (!lanejson?.length) {
        // destroyMesh(this.group.getObjectByName(type));
        this.group.remove(this.group.getObjectByName(type));
        return;
      }
      lanejson?.forEach?.(item => {
        let lane = new Lane();
        if (['taskLane', 'perTaskLane'].includes(type)) {
          lane.lanename = type;
        } else {
          lane.lanename = item.name;
        }
        lane.initLatlons(item.trail_list || item.gps_list || item.rci_list || item.list || item.data || item, type);
        this.laneArr.push(lane);
        let mesh = '';

        if (type.includes('exTaskLane')) {
          mesh = new THREE.Line(lane.getGeometry(), material);
          mesh.computeLineDistances();
        } else {
          let line = new MeshLine();
          line.setGeometry(lane.getGeometry());
          mesh = new THREE.Mesh(line, material);
        }
        mesh.name = type;

        if (type == 'loadAreaLine') {
          mesh.name = `load_line_${item.object_id}`;
        }

        // 障碍物的要素id
        if (item.objectId) {
          mesh.objectId = item.objectId;
          mesh.name = `${type}_${item.objectId}`;
        }

        if (type == 'obstacle' && item.lane_name) {
          mesh.name = item.lane_name;
        }

        let typeList = [
          'collect',
          'boundary',
          'soil',
          'obstacle',
          'taskLane',
          'perTaskLane',
          'obstaclesLine',
          'bulldozerCollect',
          'exTaskLane',
          'exTaskLane1',
          'reviewSensorCollectLeft',
          'reviewSensorCollectRight',
        ];
        if (typeList.includes(type)) {
          if (type == 'obstaclesLine') {
            // destroyMesh(this.group.getObjectByName(mesh.name));
            this.group.remove(this.group.getObjectByName(mesh.name));
          } else if (type == 'bulldozerCollect') {
            const option = ['boundary', 'soil', 'obstacle'];
            let list = [];
            option.forEach(item => {
              if (item == 'obstacle') {
                this.group.traverse(line => {
                  // console.log('line', line.name);
                  if (!line.name.includes('obstaclesLine') && line.name.includes('obstacle')) {
                    !list.includes(line.name) && list.push(line);
                  }
                });
                // destroyMesh(...list);
                this.group.remove(...list);
              } else {
                // destroyMesh(this.group.getObjectByName(item));
                this.group.remove(this.group.getObjectByName(item));
              }
            });
          } else {
            // destroyMesh(this.group.getObjectByName(type));
            this.group.remove(this.group.getObjectByName(type));
          }
        }
        mesh.renderOrder = 2;
        if (type.includes('exTaskLane')) mesh.renderOrder = 1;
        if (type == 'taskLane' || type == 'perTaskLane') mesh.renderOrder = 3;
        if (type == 'collect' || type.includes('reviewSensorCollect')) mesh.renderOrder = 5;
        this.group.add(mesh);
      });
    }
  }
}

export default Lanes;
