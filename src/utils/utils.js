import Vue from 'vue';
import store from '../store';
import { SOCKET_TYPE, isWsMock, local_ws_url, ws_url, ws_reconnet_time } from '@/constant';
import * as THREE from 'three';
import WebSocketClient from '@/utils/socket';

// 动态引入图片
export function getAssetsFile(url) {
  return new URL(`../assets/${url}`, import.meta.url).href;
}

/**
 * 解决Vue Template模板中无法使用可选链的问题
 * @param obj
 * @param rest
 * @returns {*}
 * !!! 使用
 * - test: {a:[{b:'c'}]}
 * - <div>{{ $$(test, '.a.0.b') }}</div>   // 结果为'c'
 */
export function optionalChaining(obj, keyName) {
  if (!obj) return null;
  let keys = (keyName + '').split('.');
  let tempObj = obj;
  for (let i = 0; i < keys.length; i++) {
    if (!tempObj) return;
    if (keys[i] !== '') tempObj = tempObj?.[keys[i]];
  }
  return tempObj;
}

// 判断字符串是否为JSON格式
export function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      // console.log('error：'+str+'!!!'+e);
      return false;
    }
  }
  // console.log('It is not a string!')
}
//h5 语音播报
export function speak(voice, level = 6) {
  sendSocket({ type: 'VoicePlay', voice, level });
  // //speechSynthesis.speak(new SpeechSynthesisUtterance("在做项目的过程中，经常会遇到场景是客户要求播放语音的场景，所以将JS实现文字转语音播放的各种实现方式做统一整理。"));
  // var u = new SpeechSynthesisUtterance();
  // u.text = text;
  // u.lang = 'zh';
  // u.rate = 0.7;
  // u.pitch = 1.5; // 表示说话的音高，数值，范围从0（最小）到2（最大）。默认值为1
  // speechSynthesis.speak(u);
}
function setResize() {
  let x = window.innerWidth / 512;
  let y = window.innerHeight / 384;
  let num = x > y ? y : x;
  let width = num < 1 ? 16 : 16 * num;
  document.querySelector('html').style.fontSize = width + 'px';
}
export function setHTMLFontSize() {
  setResize();
  window.addEventListener('resize', setResize);
}
// 时间戳转换格式

export function initWebSocket() {
  const { host } = window.location;
  const target_url =
    isWsMock == 'no'
      ? host.includes('dev.tage.com')
        ? ws_url
        : host.includes('127.0.0.1')
        ? local_ws_url
        : `ws://${host}:8081/cmdstream`
      : local_ws_url;
  console.log('target_url', target_url);
  let ws = new WebSocketClient(target_url, ws_reconnet_time);
  Vue.prototype.socket = ws;
}
/**
 * 封装socket调用
 * @param {*} params
 */
export function sendSocket(params) {
  try {
    // 找到vue实例上的全局变量
    const _socket = Vue.prototype.socket;
    if (!params) return;
    if (Array.isArray(params)) {
      params.map(item => {
        if (!typeOf(item, 'Object')) item = { type: item };
        _socket.send(JSON.stringify(item));
      });
    } else {
      if (!typeOf(params, 'Object')) params = { type: params };
      _socket.send(JSON.stringify(params));
    }
  } catch (error) {
    console.log(error);
  }
}
/**
 * 判断类型
 * @param {*} data 判断的值
 * @param {*} type 可选 String || Array, 传值返回boolean值
 */
export function typeOf(data, type) {
  let str = Object.prototype.toString.call(data);
  str = str.slice(8, str.length - 1);
  if (type) return type.includes(str);
  return str;
}

/*
time 时间戳
bool 是否需要时分秒
text 连接符号
*/
export const formatTime = (time = new Date().getTime(), timeType = 'second', text = '-') => {
  time = time || new Date().getTime();
  time = parseInt(time);
  let date = new Date(time); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let year = date.getFullYear(),
    month = ('0' + (date.getMonth() + 1)).slice(-2),
    sdate = ('0' + date.getDate()).slice(-2),
    hour = ('0' + date.getHours()).slice(-2),
    minute = ('0' + date.getMinutes()).slice(-2),
    second = ('0' + date.getSeconds()).slice(-2);
  let resStr = '';
  if (timeType === 'year') resStr = year;
  if (timeType === 'month') resStr = `${month + text + sdate}`;
  if (timeType === 'day') resStr = `${year + text + month + text + sdate}`;
  if (timeType === 'hour') resStr = `${hour + ':' + minute + ':' + second}`;
  if (timeType === 'minute') resStr = `${hour + ':' + minute}`;
  if (timeType === 'second')
    resStr = `${year + text + month + text + sdate + ' ' + hour + ':' + minute + ':' + second}`;
  if (timeType === 'dayhour') resStr = `${year + text + month + text + sdate + ' ' + hour + ':' + minute}`;
  return resStr;
};

/**
 * 保存session
 * @param {*} key
 * @param {*} value
 */
export const setSessionStorage = (key, value) => {
  sessionStorage.setItem(key, value);
};
/**
 * 获取session
 * @param {*} key
 */
export const getSessionStorage = key => {
  const data = sessionStorage.getItem(key);
  return data && JSON.parse(data);
};

export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};
export const getLocalStorage = key => {
  const data = localStorage.getItem(key);
  return data && JSON.parse(data);
};

export function getCookie() {
  const language = navigator.browserLanguage ? navigator.browserLanguage : navigator.language;
  // return 'en';
  if (language.indexOf('en') > -1) return 'en';
  if (language.indexOf('ja') > -1) return 'en';
  if (language.indexOf('zh') > -1) return 'zh';
  return 'zh';
}

export const randomPassword = size => {
  let str = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnpQrstuvwxyz23456789';
  let len = str.length; //数组长度
  var createPassword = '';
  for (i = 0; i < size; i++) {
    j = Math.floor(Math.random() * len);
    createPassword += str[j];
  }
  return createPassword;
};

/**
 * 数组对象排序
 * @param {*} key 要排序的key
 * @param {*} order 降序还是升序   asc升序 desc降序
 * @returns
 */
export const compareValue = (key, order = 'asc') => {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // 该属性在任何一个对象上都不存在
      return 0;
    }
    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === 'desc' ? comparison * -1 : comparison;
  };
};

/**
 * 匹配车辆3D模型
 * @param {number} vehiclNo  车辆编号
 * @returns
 */
export const matchVehicleModel = vehicleNo => {
  const models = {
    100: 'mineCard', // 矿卡
    101: 'mineCard', // 矿卡
    200: 'powerShovel', // 电铲
    201: 'anExcavator', // 挖机
    400: 'bullDozer', // 推土机
    401: 'wateringCar', // 洒水车
    402: 'grader', //平地机
    403: 'roller', // 压路机
    406: 'bullDozer', // 推土机
    408: 'pickUp', // 皮卡
    404: 'pickUp', // 皮卡
  };

  return models[Number(vehicleNo)];
};

/**
 * 匹配当前车辆所属终端
 * 
   矿卡终端：100、101；
   采装终端：200、201；
   排土终端：400、406；
   通用终端：401、402、403、404、405、407
   地图采集终端：408
 */
export const matchVehicleTerminal = vehicleNo => {
  vehicleNo = Number(vehicleNo);
  if ([100, 101].includes(vehicleNo)) return 'MineCard';
  if ([200, 201].includes(vehicleNo)) return 'Adopt';
  if ([400, 406].includes(vehicleNo)) return 'Soil';
  if ([401, 402, 403, 404, 405, 407].includes(vehicleNo)) return 'Currency';
  if (vehicleNo == 408) return 'MapCollect';
};
/**
 * 根据表示查询地图区域类型
 */
export const matchWorkArea = type => {
  let options = {
    0: {
      text: '路段',
      en: 'R',
    },
    1: {
      text: '交叉路口',
      en: 'C',
    },
    2: {
      text: '装载区域',
      en: 'L',
    },
    3: {
      text: '卸载区域',
      en: 'D',
    },
    4: {
      text: '停车区域',
      en: 'P',
    },
    5: {
      text: '加油区域',
      en: 'O',
    },
    6: {
      text: '维修区域',
      en: 'M',
    },
  };
  return options[type];
};
export const getQueryString = name => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
};

// 世界坐标点到点
export const caculateLL = (lat1, lng1, lat2, lng2) => {
  var radLat1 = (lat1 * Math.PI) / 180.0;
  var radLat2 = (lat2 * Math.PI) / 180.0;
  var a = radLat1 - radLat2;
  var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
  var s =
    2 *
    Math.asin(
      Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2))
    );
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10;
  return s;
};
// 世界坐标点+距离求另一个点
export const calc_situation = (long1, lati1, deg, dis) => {
  dis = dis || store.state.carInfo.excavatorOffsetLength;
  let arc = 6371.393 * 1000;
  let long2 = parseFloat(long1) + (dis * Math.sin(deg)) / ((arc * Math.cos(lati1) * 2 * Math.PI) / 360);
  let lati2 = parseFloat(lati1) + (dis * Math.cos(deg)) / ((arc * 2 * Math.PI) / 360);
  return { x: long2, y: lati2 };
};
// three内部点到点距离
export const three_distance = (point1, point2) => {
  let pos1 = window.flatModel.convertLatLonToWorldPos(point1);
  let pos2 = window.flatModel.convertLatLonToWorldPos(point2);
  pos1 = new THREE.Vector3(pos1.x, pos1.y, 0);
  pos2 = new THREE.Vector3(pos2.x, pos2.y, 0);
  let distance = pos1.distanceTo(pos2);
  return distance;
};

// 已知一个点的经纬度,求指定距离后的经纬度
export const cal_targetLatLon = (lon, lat, distance) => {
  var earthRadius = 6371000;
  lon = Number(lon);
  lat = Number(lat);
  var angularDistance = distance / earthRadius;
  var lat1 = toRadians(lat);
  var lon1 = toRadians(lon);
  var newLat = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance) + Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(0)
  );
  var newLon =
    lon1 +
    Math.atan2(
      Math.sin(0) * Math.sin(angularDistance) * Math.cos(lat1),
      Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(newLat)
    );
  newLon = ((newLon + 3 * Math.PI) % (2 * Math.PI)) - Math.PI; // 调整范围为 -180 to +180
  return {
    lat: toDegrees(newLat),
    lon: toDegrees(newLon),
  };
};

// 弧度转换为角度
function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

// 角度转换为弧度
function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

// 将经纬度转换为3D坐标 radius为地球半径
export function latLongToVector3(lon, lat, radius = 6371000) {
  var phi = (lat * Math.PI) / 180;
  var theta = ((lon - 180) * Math.PI) / 180;
  var x = -radius * Math.cos(phi) * Math.cos(theta);
  var y = radius * Math.sin(phi);
  var z = radius * Math.cos(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

// 获取几何体的中心
export function getCenterPoint(mesh) {
  var middle = new THREE.Vector3();
  var geometry = mesh.geometry;
  geometry.computeBoundingBox();
  middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
  middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
  middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;
  mesh.localToWorld(middle);
  return middle;
}

// 手动设置几何体的中心
export function setCenterGeometry(geometry) {
  // 计算几何体的包围盒
  geometry.computeBoundingBox();
  var boundingBox = geometry.boundingBox;
  var center = new THREE.Vector3();
  boundingBox.getCenter(center);
  // 将几何体的中心移动到原点
  geometry.translate(-center.x, -center.y, -center.z);
}

// 获取threejs对象的大小;
export function getTargetSize(target) {
  const size = {
    width: 27.35,
    height: 15.375,
    depth: 0,
  };
  if (target && target.geometry) {
    target.geometry.computeBoundingBox(); // 计算边界框，确保正确的尺寸
    let boundingBox = target.geometry.boundingBox; // 获取边界框对象
    size.width = boundingBox.max.x - boundingBox.min.x; // 计算宽度
    size.height = boundingBox.max.y - boundingBox.min.y; // 计算高度
    size.depth = boundingBox.max.z - boundingBox.min.z; // 计算深度（如果是三维对象）
  }
  return size;
}

export function getBufferGeometryCenterPoint(bufferGeometry) {
  const positions = bufferGeometry.getAttribute('position').array;
  let vertices = [];
  for (let i = 0; i < positions.length; i += 3) {
    vertices.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
  }
  // console.log('vertices', vertices);
  // 初始化中心点的坐标
  let centerX = 0,
    centerY = 0,
    centerZ = 0;
  // 计算顶点坐标的平均值
  for (let i = 0; i < positions.length; i += 3) {
    centerX += positions[i];
    centerY += positions[i + 1];
    centerZ += positions[i + 2];
  }
  const numVertices = positions.length / 3;
  centerX /= numVertices;
  centerY /= numVertices;
  centerZ /= numVertices;
  // 创建中心点的 Vector3 对象
  const centerPoint = new THREE.Vector3(centerX, centerY, centerZ);
  return centerPoint;
}
export function destroyMesh(mesh) {
  if (!mesh) return;
  if (mesh.geometry) {
    mesh.geometry.dispose();
  }
  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(material => material.dispose());
    } else {
      mesh.material.dispose();
    }
  }
  mesh = null;
}

// 获取平面几何体的顶点
export function getPlaneVertices(planeMesh) {
  const positionAttribute = planeMesh.geometry.attributes.position;
  const vertices = [];
  for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(positionAttribute, i);
    vertices.push(vertex);
  }
  return vertices;
}

// 已知plane中心点,长度和宽度求四个顶点值
export function calVertices(planeMesh, targetPoint) {
  let centerPoint;
  if (targetPoint) {
    console.log('targetPoint', targetPoint);
    centerPoint = window.flatModel.convertLatLonToWorldPos(targetPoint);
  }

  console.log('centerPoint', centerPoint);
  const width = planeMesh.geometry.parameters.height;
  const length = planeMesh.geometry.parameters.width;
  const centerX = centerPoint ? centerPoint.x : planeMesh.position.x;
  const centerY = centerPoint ? centerPoint.y : planeMesh.position.y;
  const centerZ = centerPoint ? 0.01 : planeMesh.position.z;
  // 计算左上角顶点坐标
  const topLeftX = centerX - length / 2;
  const topLeftY = centerY + width / 2;
  const topLeftZ = centerZ;
  // 计算右上角顶点坐标
  const topRightX = centerX + length / 2;
  const topRightY = centerY + width / 2;
  const topRightZ = centerZ;
  // 计算左下角顶点坐标
  const bottomLeftX = centerX - length / 2;
  const bottomLeftY = centerY - width / 2;
  const bottomLeftZ = centerZ;
  // 计算右下角顶点坐标
  const bottomRightX = centerX + length / 2;
  const bottomRightY = centerY - width / 2;
  const bottomRightZ = centerZ;

  // 输出四个顶点的坐标
  // console.log('左上角顶点坐标:', topLeftX, topLeftY, topLeftZ);
  // console.log('右上角顶点坐标:', topRightX, topRightY, topRightZ);
  // console.log('左下角顶点坐标:', bottomLeftX, bottomLeftY, bottomLeftZ);
  // console.log('右下角顶点坐标:', bottomRightX, bottomRightY, bottomRightZ);

  return [
    new THREE.Vector3(topLeftX, topLeftY, topLeftZ),
    new THREE.Vector3(topRightX, topRightY, topRightZ),
    new THREE.Vector3(bottomLeftX, bottomLeftY, bottomLeftZ),
    new THREE.Vector3(bottomRightX, bottomRightY, bottomRightZ),
  ];
}

export function calculateNewLatLon(lon, lat, heading, distance) {
  lon = parseFloat(lon);
  lat = parseFloat(lat);
  heading = parseFloat(heading);
  distance = parseFloat(distance);
  const earthRadius = 6371.393; // 地球半径，单位为公里

  // 将纬度和经度从度转换为弧度
  const latInRadians = THREE.MathUtils.degToRad(lat);
  const lonInRadians = THREE.MathUtils.degToRad(lon);

  // 将航向从度转换为弧度
  const headingInRadians = THREE.MathUtils.degToRad(heading);

  // 计算新的纬度
  const newLatInRadians = Math.asin(
    Math.sin(latInRadians) * Math.cos(distance / earthRadius) +
      Math.cos(latInRadians) * Math.sin(distance / earthRadius) * Math.cos(headingInRadians)
  );

  // 计算新的经度
  const newLonInRadians =
    lonInRadians +
    Math.atan2(
      Math.sin(headingInRadians) * Math.sin(distance / earthRadius) * Math.cos(latInRadians),
      Math.cos(distance / earthRadius) - Math.sin(latInRadians) * Math.sin(newLatInRadians)
    );

  // 将新的纬度和经度从弧度转换为度
  const newLat = THREE.MathUtils.radToDeg(newLatInRadians);
  const newLon = THREE.MathUtils.radToDeg(newLonInRadians);

  console.log('计算新的经度', { x: newLon, y: newLat });

  return { x: newLon, y: newLat };
}

// 根据中心点、半径和旋转角度计算新的点
export function calculateRotatedPoint(cx, cy, distance, angle) {
  (cx -= 0), (cy -= 0), (distance -= 0), (angle -= 0);
  console.log(cx, cy, distance, angle);
  const angleInRadians = THREE.MathUtils.degToRad(angle);
  // const xPrime = cx + distance * Math.cos(angleInRadians);
  let xPrime;
  let yPrime;

  if (angle == 0 || angle == 360) {
    xPrime = cx;
    yPrime = cy + distance;
  } else if (angle == 90) {
    xPrime = cx + distance;
    yPrime = cy;
  } else if (angle == 180) {
    xPrime = cx - distance;
    yPrime = cy;
  } else {
    xPrime = cx + distance * Math.cos(angleInRadians);
    yPrime = cy + distance * Math.sin(angleInRadians);
  }

  console.log('计算结果', { x: xPrime, y: yPrime });
  return { x: xPrime, y: yPrime };
}

export function calculateTargetPoint(x1, y1, distance, angleDegrees) {
  // 将角度转换为弧度
  const angleRadians = parseFloat(angleDegrees) * (Math.PI / 360);
  // 计算目标点的坐标
  const x2 = x1 + distance * Math.cos(angleRadians);
  const y2 = y1 + distance * Math.sin(angleRadians);
  return { x: x2, y: y2 };
}

export function rotatePointAroundCenter(center, point, angle) {
  let theta = THREE.MathUtils.degToRad(-angle);

  // 将第二个点相对于第一个点的坐标转换为极坐标
  let dx = point.x - center.x;
  let dy = point.y - center.y;
  let radius = Math.sqrt(dx * dx + dy * dy);
  let currentAngle = Math.atan2(dy, dx);

  // 根据旋转角度调整极坐标的角度
  let newAngle = currentAngle + theta;

  // 将调整后的极坐标转换回笛卡尔坐标系
  let newX = center.x + radius * Math.cos(newAngle);
  let newY = center.y + radius * Math.sin(newAngle);

  return { x: newX, y: newY };
}

export function groupAndModify(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i += 3) {
    let group = arr.slice(i, i + 3);
    // 确保组的长度为 3，如果不够，填充0
    while (group.length < 3) {
      group.push(0.01);
    }
    // 将最后一个值设置为 1
    group[2] = 0.01;

    result.push(new THREE.Vector3(group[0], group[1], 0.01));
  }
  return result;
}

// 获取变换后的顶点数据
export function getTransformedVertices(mesh) {
  const vertices = [];
  const positionAttribute = mesh.geometry.attributes.position;

  for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(positionAttribute, i);
    vertex.applyMatrix4(mesh.matrixWorld);
    vertices.push(vertex);
  }

  return vertices;
}

// 前端消息同步后端,后端同步至遥控驾舱
export function sendMsgToBackend(msg) {
  sendSocket({
    type: SOCKET_TYPE.SEND_MSG_TO_RCD,
    msg,
  });
}
