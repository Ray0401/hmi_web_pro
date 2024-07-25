/*
 * @Author: 徐海瑞
 * @Date: 2024-07-02 14:31:01
 * @Last Modified by: 徐海瑞
 * @Last Modified time: 2024-07-02 15:52:38
 * 升级vue2.7辅助函数
 */

import { getCurrentInstance } from 'vue';
export function useStore() {
  const { proxy } = getCurrentInstance();
  const store = proxy.$store;
  return store;
}
