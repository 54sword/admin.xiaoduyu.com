#!/bin/bash

echo "开始执行安装脚本..."

# 登陆的服务器
SERVER='root@你的服务器ip地址'

# 本地项目需要上传的文件
LOCAL_DIR=`
  find $(pwd)/* \( -path $(pwd)/node_modules -prune \) -o \( -path $(pwd)/.git -prune \) -o \( -type d -maxdepth 0 -print \);
  find $(pwd)/* -type f -maxdepth 0 -print;
  find $(pwd)/.babelrc;
`
# 项目端口号
PM2_NAME="admin.xiaoduyu.com"

# 上传到服务器的目录地址
UPLOAD_TO_SERVER_DIR="/home/app/$PM2_NAME"

# 服务器运行命令
COMMAND="
  cd $UPLOAD_TO_SERVER_DIR && npm install && NODE_ENV=production __NODE__=true BABEL_ENV=server pm2 start src/server --name '$PM2_NAME' --max-memory-restart 400M;
"

####################

echo "打包项目"
npm run dist
echo "打包项目完成"

echo "创建项目文件夹"
ssh ${SERVER} "mkdir $UPLOAD_TO_SERVER_DIR"

echo "脚本开始执行，上传项目文件中..."
scp -r ${LOCAL_DIR} ${SERVER}:${UPLOAD_TO_SERVER_DIR}

echo "安装依赖，并启动项目中..."
ssh ${SERVER} ${COMMAND}

echo "完成"
