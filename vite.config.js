import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import path from 'path';
import replace from '@rollup/plugin-replace'; // 替换字符串
import postCssPxToRem from 'postcss-pxtorem';
import { isWsMock } from './src/constant';

export default defineConfig(({ mode }) => {
  const isDev = mode == 'development';
  return {
    plugins: [
      vue(),
      replace({
        [isWsMock]: isDev ? isWsMock : 'no',
      }),
    ],
    base: isDev ? '/' : './',
    outDir: 'dist',
    resolve: {
      extensions: ['.js', '.vue', '.json', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, '.', 'src'),
        'three/examples': path.resolve(__dirname, 'node_modules/three/examples/'),
        three: path.resolve(__dirname, 'node_modules/three/build/three.module.js'),
      },
    },
    css: {
      postcss: {
        plugins: [
          postCssPxToRem({
            rootValue: 32, // 1rem的大小
            propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
          }),
        ],
      },
      // css预处理器
      preprocessorOptions: {
        scss: {
          // 引入 variables.scss 这样就可以在全局中使用 variables.scss中预定义的变量了
          // 给导入的路径最后加上 ;
          additionalData: `@import "./src/assets/css/variables.scss";`,
        },
      },
    },
    server: {
      port: 3001,
      open: true,
      host: '0.0.0.0',
      https: false,
      hmr: {
        overlay: false,
      },
    },
  };
});
