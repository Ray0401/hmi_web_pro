#!/bin/sh
# cd `dirname $0`


# 获取当前时间戳，作为新的 BUILD_ID 值
timestamp=$(date +%Y%m%d%H%M%S)
build_date=$(date +%Y-%m-%d\ %H:%M:%S)

echo export const BUILD_ID="'M2.4.3.01_$timestamp';" > buildId.js
# 追加日期以及时间
echo export const BUILD_DATE="'$build_date';" >>  buildId.js

# 打包
yarn build

# 压缩
cd ./dist/build
# 定义压缩文件夹名
zip_name=$(date +%Y%m%d)
zip  -r hmi-pro-$zip_name.zip hmi
rm -rf hmi
echo "生成 hmi-pro-$zip_name.zip"