---
title: windows下nodejs安装
date: 2025-03-19 22:45:56
tags:
  - nodejs
  - nvm
categories:
  - [nodejs]
  - [nvm]
---
## 介绍
本文介绍windows下使用nvm安装nodejs

## nvm安装
1. 安装nvm，使用nvm安装稳定版的nodejs
进入[nvm-windows发布页面](https://github.com/coreybutler/nvm-windows/releases)，选择nvm-setup.exe安装。
![](img/nodejs-install/nvm-windows-下载.png)
安装完成后在终端输入nvm version，能查到版本号说明安装成功了
![](img/nodejs-install/nvm-version.png)

常用命令
```shell
# 显示已经安装的列表，list 可简化为 ls
nvm list
# 显示远程可安装的列表，list 也可简化为 ls
nvm list available
# 卸载指定版本 node
nvm uninstall [version]
# 使用指定版本 node
nvm use [version]
```
2. 配置nvm下载镜像
在 nvm 的安装路径下，找到 settings.txt，在后面加上这两行，设置国内淘宝镜像源：

```shell
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

命令行版
```shell
#阿里云云镜像
nvm npm_mirror https://npmmirror.com/mirrors/npm/
nvm node_mirror https://npmmirror.com/mirrors/node/

#腾讯云镜像
nvm npm_mirror http://mirrors.cloud.tencent.com/npm/
nvm node_mirror http://mirrors.cloud.tencent.com/nodejs-release/
```

![](img/nodejs-install/nvm-settings.png)

## nodejs安装
3. nodejs安装
使用`nvm install xxx`安装lts版本的noejs
```
nvm install 22
nvm list
nvm use 22
```
![](img/nodejs-install/node-version.png)

4. 修改 npm 默认镜像源
```shell
npm config set registry http://registry.npmmirror.com
# 检查
npm config get registry
```

5. 其他
```shell
# npm config set cache "%NVM_SYMLINK%\node_cache"
npm config set cache "D:\nvm\nodejs\node_cache"

# npm config set prefix "%NVM_SYMLINK%\node_global"
npm config set prefix "D:\nvm\nodejs\node_global"

# 可编辑 .npmrc 配置文件
npm config edit

# 查看部分 .npmrc 配置信息
npm config ls
```






