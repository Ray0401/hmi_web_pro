/*
 * @Author: 徐海瑞
 * @Date: 2023-10-07 15:53:02
 * @Last Modified by: 杨震乾
 * @Last Modified time: 2023-10-07 15:56:18
 */

const fs = require('fs');
const archiver = require('archiver');

const homedir = __dirname + '/dist'; //这里是当前目录路径

//配置要打包的路径列表,需要打包某些目录，添加到数组里面即可 相对路径
const target = ['dist/hmi'];

// 默认在当前目录路径生成此文件 dist.zip
const output = fs.createWriteStream(homedir + '/hmi.zip');
const archive = archiver('zip', {
  zlib: { level: 9 }, // 设置压缩级别
});

archive.on('error', function (err) {
  throw err;
});

output.on('close', function () {
  console.log(
    `压缩完毕---生成文件大小${(archive.pointer() / 1024 / 1024).toFixed(1)}MB,系统路径为 ${homedir}\\hmi.zip`
  );
});

archive.pipe(output);
for (i of target) {
  archive.directory(i, i);
}
archive.finalize();
