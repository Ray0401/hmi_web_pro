import * as THREE from 'three';
class FlatModel {
  constructor() {
    this.minlat = 41.799;
    this.maxlat = 41.804;
    this.minlon = 109.988;
    this.maxlon = 109.998;
    this.screenHeight = 1080 || window.innerHeight;
    this.sceenWidth = 1920 || window.innerWidth;
    this.scaleX = ((this.maxlon - this.minlon) * 3600) / this.sceenWidth;
    this.scaleY = ((this.maxlat - this.minlat) * 3600) / this.screenHeight;

    // window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  convertLatLonToWorldPos(latlon) {
    var xyz = new THREE.Vector3();
    xyz.x = ((parseFloat(latlon.x || latlon.lon) - this.minlon) * 3600) / this.scaleX;
    xyz.y = ((parseFloat(latlon.y || latlon.lat) - this.minlat) * 3600) / this.scaleY;
    xyz.z = latlon.z - 1500;
    return xyz;
  }

  convertLatLonToWorldPosArray(lon, lat, height) {
    let pos = [];
    let x = ((lon - this.minlon) * 3600) / this.scaleX;
    let y = ((lat - this.minlat) * 3600) / this.scaleY;
    pos.push(x);
    pos.push(y);
    pos.push(height);
    return pos;
  }

  onWindowResize() {
    this.screenHeight = window.innerHeight;
    this.sceenWidth = window.innerWidth;
    this.scaleX = ((this.maxlon - this.minlon) * 3600) / this.sceenWidth;
    this.scaleY = ((this.maxlat - this.minlat) * 3600) / this.screenHeight;
  }
}
let flatModel = new FlatModel();
window.flatModel = flatModel;
export default FlatModel;
