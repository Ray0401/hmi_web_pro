/*
 * @Author: 徐海瑞
 * @Date: 2024-09-24 17:14:22
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-09-26 15:49:40
 */

import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

class CSS2DObjectHelper {
  constructor() {
    this.cache = new Map();
    this.currentScale = 1;
    this.baseFontSize = 12;
    this.minScale = 0.5;
    this.maxScale = 2;
    this.scaleSensitivity = 0.001; // 控制缩放速度
  }

  create(labelName, element) {
    const cacheKey = labelName;
    if (this.cache.has(cacheKey)) {
      // console.log(`复用${cacheKey}`, this.cache.get(cacheKey));
      return this.cache.get(cacheKey).clone();
    }
    element.style.fontSize = `${this.baseFontSize}px`;
    const object = new CSS2DObject(element);
    this.cache.set(cacheKey, object);
    return object;
  }

  handleMouseWheel(event, value = 0) {
    const deltaY = (event && event.deltaY) || value;
    this.currentScale -= deltaY * this.scaleSensitivity;
    this.currentScale = Math.max(this.minScale, Math.min(this.currentScale, this.maxScale));
    this.updateFontSizes();
  }

  updateFontSizes() {
    const fontSize = this.baseFontSize * this.currentScale > 18 ? 18 : this.baseFontSize * this.currentScale;
    this.cache.forEach(object => {
      object.element.style.fontSize = `${fontSize}px`;
    });
  }

  setScalingParameters(baseFontSize, minScale, maxScale, sensitivity) {
    this.baseFontSize = baseFontSize;
    this.minScale = minScale;
    this.maxScale = maxScale;
    this.scaleSensitivity = sensitivity;
  }
}

export default CSS2DObjectHelper;
