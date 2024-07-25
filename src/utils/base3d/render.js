/*
 * @Author: 徐海瑞
 * @Date: 2023-03-08 14:18:35
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-05-22 11:17:37
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

  //重新绘制，因为一直在绘制所以不需要更改
  // this.render();
}
//动画
function render() {
  this.updateCar();
  if (this.b3dCamera) {
    this.renderer.render(this.scene, this.camera2);
    this.labelRenderer.render(this.scene, this.camera2);
  } else {
    this.renderer.render(this.scene, this.camera);
  }
}
// 开始动画
function animate() {
  this.renderer.setAnimationLoop(this.render.bind(this));
}
export { animate, render, onWindowResize };
