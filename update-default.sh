#!/bin/bash

echo "开始执行更新脚本..."

# 登陆的服务器
SERVER='root@你的服务器ip地址'

# 本地项目需要上传的文件
LOCAL_DIR=`
  find $(pwd)/* \( -path $(pwd)/node_modules -prune \) -o \( -path $(pwd)/.git -prune \) -o \( -type d -maxdepth 0 -print \);
  find $(pwd)/* -type f -maxdepth 0 -print;
  find $(pwd)/.babelrc;
`

PM2_NAME="admin.xiaoduyu.com"

# 上传到服务器的目录地址
UPLOAD_TO_SERVER_DIR="/home/app/$PM2_NAME"

# 服务器运行命令
COMMAND="pm2 restart $PM2_NAME"

echo "上传项目文件中..."
scp -r ${LOCAL_DIR} ${SERVER}:${UPLOAD_TO_SERVER_DIR}

echo "重启项目中..."
ssh ${SERVER} ${COMMAND}

echo "完成"
