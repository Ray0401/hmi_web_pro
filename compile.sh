#!/bin/sh
cd `dirname $0`

# 获取buildId
if [ -n $1 ]; then
  echo export const BUILD_ID="'$1';" > buildId.js
else
  echo export const BUILD_ID="'V260C01P02_01';" > buildId.js
fi


# 追加日期以及时间
echo export const BUILD_DATE="'$(date +%Y-%m-%d\ %H:%M:%S)';" >>  buildId.js

# 设置镜像源
npm config set registry https://registry.npmmirror.com/
yarn config set registry https://registry.npmmirror.com/

# 打包
rm -rf dist
rm -rf package-lock.json yarn.lock
rm -rf node_modules
yarn install || exit 1
yarn build


# 压缩文件夹
cd ./dist/build
zip  -r hmi.zip hmi
echo '生成 hmi.zip'





