---
title: harbor-proxy
date: 2025-07-30 18:17:35
tags:
  - docker
  - harbor
---
## docekr buildx push 出现错误
1. ERROR: failed to solve: failed to push registry.xxxx.com/xxx: unauthorized: unauthorized to access repository: xxxx, action: push: unauthorized to access repository: xxx, action: push
2. ERROR: failed to solve: failed to fetch oauth token: unexpected status from GET request to https://registry.xxxxx.com/service/token: 400 Bad Request

## 原因分析
1. `$HOME/.docker/config.json`,这个文件提供镜像仓库认证信息，可以使用`docker login xxxx`生成，可以解决unauthorized问题.
2. harbor 获取token失败，问题原因是请求harbor后返回的认证头是http，但请求的地址是https的，协议不一致，获取token时候丢掉了部分参数，导致参数错误

## Harbar 配置为http，nginx提供ssl代理

### 请求路径
`https -> nginx -> http -> Harbor Nginx -> Harbor 核心`

### 外层nginx配置
```shell
server {
    listen 80;
    server_name xxx;
    return 301 https://$host$request_uri;
}


server {
  listen 443 ssl;

  ssl_certificate /etc/nginx/certs/xxx.crt;
  ssl_certificate_key /etc/nginx/certs/xxx.key;

  client_max_body_size 0;
  server_name xxx;
  server_tokens off;
  add_header X-Frame-Options SAMEORIGIN;


  location  / {
        proxy_pass http://127.0.0.1:8099/;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_http_version 1.1;

        proxy_buffering off;
        proxy_request_buffering off;
  }

}
```

### harbor.yml 配置
1. 更新主机名
2. 关闭https
3. 配置数据卷
4. 配置external_url
5. `./install.sh --with-trivy`
6. 执行 `docker-compose up -d`

```yaml
hostname: registry.mydomaine.com

# http related config
http:
  # port for http, default is 80. If https enabled, this port will redirect to https port
  port: 8099

# https related config
# https:
  # port: 443
  # certificate: /your/certificate/path
  # private_key: /your/private/key/path
  # strong_ssl_ciphers: false

external_url: https://registry.mydomaine.com
data_volume: /data1/harbor
```

## external_url作用
转换到认证头上
### 测试认证头
```shell
curl -X GET -I "https://registry.xxxx.com/v2/"
HTTP/1.1 401 Unauthorized
Server: nginx
Date: Wed, 30 Jul 2025 10:49:22 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 76
Connection: keep-alive
Docker-Distribution-Api-Version: registry/2.0
Set-Cookie: sid=3ed976b856e69dbd238f61663679801d; Path=/; HttpOnly
Www-Authenticate: Bearer realm="https://registry.xxxx.com/service/token",service="harbor-registry"
X-Request-Id: 4dc241ea-d97f-4832-87a6-e19e0c241d68
```

### 测试buildx推送问题
```shell
docker buildx build --builder test-builder --push --tag registry.xxxx.com/build/buildx-test:v1 --platform linux/amd64 - <<'EOF'
FROM scratch
LABEL test="buildx-auth"
EOF
```

### 可选配置
修改`/common/config/nginx/nginx.conf`, 注释`proxy_set_header X-Forwarded-Proto $scheme;`


## 信任证书
Ubuntu:
```shell
cp yourdomain.com.crt /usr/local/share/ca-certificates/yourdomain.com.crt 
update-ca-certificates
```
Red Hat (CentOS etc):
Red Hat (CentOS 等):
```shell
cp yourdomain.com.crt /etc/pki/ca-trust/source/anchors/yourdomain.com.crt
update-ca-trust
```

## 参考
[1] [Harbor 2.0 与 Traefik 2.0 反向代理](https://medium.com/@jodywan/cloud-native-devops-08-harbor-2-0-with-traefik-2-0-reverse-proxy-5acbba95534a)
[2] [In Harbor 2.0.2 cannot configure redirection from http to https in config.yml file ](https://github.com/goharbor/harbor/issues/12959)
[3] [解决 Harbor 安装问题](https://goharbor.io/docs/2.13.0/install-config/troubleshoot-installation/)
