/*
 * @Author: 徐海瑞
 * @Date: 2023-02-10 11:52:24
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2023-03-01 10:55:15
 *
 * // ---  推土机上传采集文件 api ---
 *
 */

import fetch from './fetch';
import url from '@/config/url';

export default {
  /**
   * 上传采集文件
   * @returns
   */
  uploadCollectFile(formdata) {
    return fetch(url.transFile, formdata, 'post');
  },
};
