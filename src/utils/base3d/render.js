/*
 * @Author: 徐海瑞
 * @Date: 2023-03-08 14:18:35
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-09-24 10:48:53
 *
 * render动画操作
 *
 */

// 监听窗口变化
function onWindowResize() {
  this.camera.right = window.innerWidth;
  this.camera.top = window.innerHeight;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.camera2.aspect = window.innerWidth / window.innerHeight;
  this.camera2.updateProjectionMatrix();
}
//动画
function render() {
  // this.stats.begin();
  if (this.b3dCamera) {
    this.renderer.render(this.scene, this.camera2);
    this.labelRenderer.render(this.scene, this.camera2);
  } else {
    this.renderer.render(this.scene, this.camera);
  }
  this.updateCar();

  // this.stats.end();
}
// 开始动画
function animate() {
  // this.renderer.setAnimationLoop(this.render.bind(this));  ar/vr 适用，3d应用应避免过度渲染

  // 采用如下方式
  requestAnimationFrame(this.animate.bind(this));
  this.render();
}
export { animate, render, onWindowResize };
