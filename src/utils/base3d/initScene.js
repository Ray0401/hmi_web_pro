/*
 * @Author: 徐海瑞
 * @Date: 2023-03-08 14:18:19
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-09-26 10:40:09
 *
 * 初始化场景文件
 *
 */
import * as THREE from 'three';
//导入控制器 轨道控制器
import { OrbitControls } from './OrbitControls';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import Boundarys from '@/model/bouds';
import Lanes from '@/model/lanes';
import Roads from '@/model/roads';
import Point from '@/model/point';
import WorkBouds from '@/model/workBouds';
import workGroups from '@/model/workGroups';

//初始化场景
function initScene() {
  this.scene = new THREE.Scene();
  this.lanes = new Lanes();
  this.roads = new Roads();
  this.bouds = new Boundarys();
  this.point = new Point();
  this.workGroups = new workGroups();
  this.workBouds = new WorkBouds();
  this.carGroup = new THREE.Group();
  this.mapGroup = new THREE.Group();

  this.boxGroup = new THREE.Group();
  this.mapGroup.add(this.lanes.getGroup());
  this.mapGroup.add(this.roads.getGroup());
  this.mapGroup.add(this.bouds.getGroup());
  this.mapGroup.add(this.point.getGroup());
  this.mapGroup.add(this.workBouds.getGroup());
  this.mapGroup.add(this.workGroups.getGroup());
  this.scene.add(this.carGroup);
  this.boxGroup.add(this.mapGroup);
  this.scene.add(this.boxGroup);
  this.scene.background = new THREE.Color('#1C1C28');
  // this.scene.background = new THREE.Color('#ffffff');

  let ambientLight = new THREE.AmbientLight('#ffffff');
  this.scene.add(ambientLight);
}
// 初始化
function init() {
  this.initScene();
  this.initCamera();
  this.initRender();
  this.initControls(); //控制器
  this.initOn();

  //添加物体
  //this.addMesh();
  // 监听场景大小改变，调整渲染尺寸
  window.addEventListener('resize', this.onWindowResize.bind(this));
  //window.addEventListener('mousewheel', this.onWindowMouseWheel.bind(this));
}
//初始化相机
function initCamera() {
  this.camera = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -10000.0, 10000.0);
  this.camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 10000.0);
}
// 初始化渲染器
function initRender() {
  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  //设置屏幕像素比
  this.renderer.setPixelRatio(window.devicePixelRatio);
  //渲染的尺寸大小
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  // //色调映射
  // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // this.renderer.toneMappingExposure = 3;

  this.container.appendChild(this.renderer.domElement);
  // 渲染html标签
  this.labelRenderer = new CSS2DRenderer();
  this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
  this.labelRenderer.domElement.style.position = 'absolute';
  this.labelRenderer.domElement.style.top = '0px';
  document.querySelector('#map-scene').appendChild(this.labelRenderer.domElement);
  document.querySelector('#map-scene').addEventListener('click', this.onMouseClick.bind(this), false);
  // document.body.appendChild(this.stats.dom);
}
// 初始化相机组件
function initControls() {
  // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  this.controls2 = new OrbitControls(this.camera2, this.labelRenderer.domElement);
}
export { initScene, init, initCamera, initRender, initControls };
