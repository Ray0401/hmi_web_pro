/*
 * @Author: 徐海瑞
 * @Date: 2024-09-24 17:14:22
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-09-24 18:00:01
 */

import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

class CSS2DObjectHelper {
  constructor(camera) {
    this.cache = new Map();
    this.camera = camera;
    this.baseFontSize = 16;
    this.scaleFactor = 100;
  }

  create(labelName, textContent, cssText) {
    const cacheKey = labelName;
    if (this.cache.has(cacheKey)) {
      console.log(`复用${cacheKey}`, this.cache.get(cacheKey));
      return this.cache.get(cacheKey);
    }
    const element = document.createElement('div');
    element.textContent = textContent;
    element.style.cssText = cssText;
    const object = new CSS2DObject(element);
    this.cache.set(cacheKey, object);
    return object;
  }

  updateFontSizes() {
    this.cache.forEach(object => {
      const distance = this.camera.position.distanceTo(object.position);
      const fontSize = this.baseFontSize * (this.scaleFactor / distance);
      object.element.style.fontSize = `${fontSize}px`;
    });
  }
}

export default CSS2DObjectHelper;
