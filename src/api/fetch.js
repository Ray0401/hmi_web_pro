/*
 * @Author: 徐海瑞
 * @Date: 2023-02-10 11:43:54
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-07-24 11:12:12
 *
 * // --- axios的二次封装 ---
 */

import axios from 'axios';
import _cancel from '@/utils/axiosPromiseCancel';
import { baseUrl } from '@/config/url';

// 创建axios实例
const service = axios.create({
  baseURL: baseUrl,
  timeout: 60 * 1000 * 5, //请求时间
  withCredentials: false, //跨域请求时,是否允许保存cookie
});

service.interceptors.request.use(config => {
  // 在请求之前要做的事,如设置headers
  //   if (store.getters.token) {
  //     config.headers['Authorization'] = `Bearer ${store.getters.token}`;
  //   }
  // 取消请求
  const Cancel = axios.CancelToken;
  config.cancelToken = new Cancel(c => {
    _cancel._axiosPromiseCancel.push(c);
  });
  return config;
});

service.interceptors.response.use(
  res => {
    return res;
  },
  error => {
    if (axios.isCancel(error)) {
      // 为了终结promise链 就是实际请求 不会走到.catch(rej=>{});这样就不会触发错误提示之类了。
      return new Promise(() => {});
    } else {
      return Promise.reject(error);
    }
  }
);

export default function fetch(url, params, method = 'get') {
  // 无网络
  if (!navigator.onLine) {
    // toast 提示
    return;
  }
  method = method.toLowerCase(); //统一转换小写
  if (method === 'get') {
    params = { params };
  }
  return new Promise((resolve, reject) => {
    service[method](url, params).then(
      response => {
        // 统一处理返回报文
        let code = response.status;

        if ([200].includes(Number(code))) {
          resolve(response.data);
        } else {
          reject(res);
        }
      },
      error => {
        console.log('error', error);
        reject(error.response.data);
      }
    );
  });
}
