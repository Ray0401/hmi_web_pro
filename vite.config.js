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
        preventAssignment: true, // 添加这个选项
      }),
    ],
    assetsInclude: ['**/*.obj', '**/*.mtl'],
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
          // additionalData: `@import "./src/assets/css/variables.scss";`,
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
    build: {
      cssCodeSplit: true, // 启用 CSS 分割
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
        },
      },
    },
  };
});
