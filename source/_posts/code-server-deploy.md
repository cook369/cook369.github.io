---
layout: title
title: 通过 docker-compose 部署 code-server
date: 2025-03-14 10:20:00
tags:
  - code-server
---
code-server 是社区创作的 Web 版 VS Code，后端运行在服务器中，开发者基于浏览器运行 IDE。
## 部署配置
docker-compose 
```yaml
services:
  code-server:
    image: codercom/code-server:latest
    container_name: code-server
    environment:
      - TZ=Asia/Shanghai #时区
      - PASSWORD=PASSWORD #可选，改成你自己的密码 PASSWORD/HASHED_PASSWORD 至少要配置一个
        #- HASHED_PASSWORD= #可选，非明文保存的密码，因为上面 Password 的密码会以配置文件形式保存在服务器内，所以 code-server 提供了一个非明文形式的密码。具体可以通过 echo -n "password" | npx argon2-cli -e 这个命令生成，这里就不细讲了
        #- SUDO_PASSWORD=password #可选，如果用这里的密码会以 sudo 的方式登陆
        #- SUDO_PASSWORD_HASH= #可选，同上
        #- PROXY_DOMAIN=code-server.my.domain #可选，服务器绑定的域名
        #- DEFAULT_WORKSPACE=/home/coder/project #可选，默认工作区
    user: 1000:1000
    volumes:
      - ./config:/config
      - ./code-server:/home/coder/project
    ports:
      - 8080:8080
    restart: unless-stopped
```
启动命令 `docker-compose up -d`

## 安装 python3
```bash
sudo apt update
sudo apt install python3 python3-dev

```

## 安装 nodejs
``` bash
curl -o- https://raw.kkgithub.com/nvm-sh/nvm/v0.40.2/install.sh | bash
source ~/.bashrc
nvm -v
nvm install --lts
```

## 安装 extension
``` bash
code-server --install-extension ms-python.python
code-server --install-extension mhutchie.git-graph
```


## 参考
[1] [通过docker-compose配置code-server](https://blog.csdn.net/kirigirihitomi/article/details/132859159)
[2] [code-server配置参考](https://docs.linuxserver.io/images/docker-code-server/#docker-compose-recommended-click-here-for-more-info)
