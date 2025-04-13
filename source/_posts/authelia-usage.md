---
title: Authelia 使用说明
date: 2025-04-14 01:46:34
tags:
  - authelia
---


## authelia使用说明
authelia 是一个专门用于应用程序和用户安全的 2FA 和 SSO 认证服务器。可以集成到反向代理服务，为其提供身份验证。
相对其他认证服务更加轻量，高效。有扩展性，支持多因素认证，单点登录，权限管理。
Authelia 使用会话 cookie 来授权用户访问各种受保护的网站。配置会话 cookie 行为为请求的域提供授权。

## authelia官方文档配置
Host: authelia
Port: 9091
TLS: true
Domain: example.com
Subdomains: auth

## authelia安装
可以使用`docker compose`启动，配置文件如下：
```yaml
---
services:
  authelia:
    container_name: authelia
    image: authelia/authelia:latest
    restart: unless-stopped
    ports:
      - 9091:9091
    volumes:
      - './config:/config'
```
首次启动后`config`目录下会生成默认配置文件，可以进行修改。
配置文件`configuration.yml`
```yaml
---
server:
  address: 'tcp://0.0.0.0:9091/'  # 监听端口，支持 tcp://ip:port/path

log:
  level: 'info'  # debug可以用调试

identity_validation:  
  reset_password: 
    jwt_secret: 'a_very_important_secret'  # 重置密码用的加密秘钥

authentication_backend:  # 认证后端配置支持File和LDAP
  file:
    path: '/config/users_database.yml'  # 用户信息配置文件

access_control:
  default_policy: 'deny'  # 默认策略，建议 deny，支持 bypass、one_factor、two_factor、deny
  rules:
    - domain: 'public.example.com'
      policy: 'bypass'
    - domain: 'traefik.example.com'
      policy: 'one_factor'
    - domain: 'secure.example.com'
      policy: 'two_factor'
    - domain: 'private.example.com'
      domain_regex: '^(\d+\-)?priv-img\.example\.com$'
      policy: 'one_factor'
      networks:
      - 'internal'
      - '1.1.1.1'
      subject:
      - ['user:adam']
      - ['user:fred']
      - ['group:admins']
      methods:
      - 'GET'
      - 'HEAD'
      resources:
      - '^/api.*'
      query:
      - - operator: 'present'
          key: 'secure'
      - operator: 'absent'
          key: 'insecure'
      - - operator: 'pattern'
          key: 'token'
          value: '^(abc123|zyx789)$'
      - operator: 'not pattern'
          key: 'random'
          value: '^(1|2)$'

session:
  secret: 'insecure_session_secret'  # redis中session加密秘钥

  cookies:
    - name: 'authelia_session'
      domain: 'example.com'  # 配置domain
      authelia_url: 'https://authelia.example.com'
      expiration: '1 hour'
      inactivity: '5 minutes'

  # redis:  # 默认使用内存，也可以使用redis
  #   host: 'redis'
  #   port: 6379


regulation:  # 登录失败次数限制，默认禁止模式是user，支持配置ip
  max_retries: 3
  find_time: '2 minutes'  # 2分钟尝试3次
  ban_time: '5 minutes'

storage:  # 存储用户首选项、2FA 设备句柄和密钥、身份验证日志等, 支持pg，mysql，sqlite
  encryption_key: 'a_very_important_secret'  # 存储数据库加密秘钥
  local: 
    path: '/config/db.sqlite3'

notifier:  # 身份验证通知
  filesystem:
    filename: '/config/notification.txt'
  # smtp:
  #   username: 'test'
  #   password: 'password'
  #   address: 'smtp://mail.example.com:25'
  #   sender: 'admin@example.com'


identity_providers:  # OpenID 连接
  oidc:
    hmac_secret: 'this_is_a_secret_abc123abc123abc'  # 加密秘钥
    claims_policies:
      legacy_claims:  # 
        id_token:  # id_token 增加配置项
           - 'email'
           - 'email_verified'
           - 'preferred_username' # 用户名
           - 'name'  # 昵称
    jwks:
      - key_id: 'example'
        key: |
          -----BEGIN RSA PRIVATE KEY-----
          ...
          -----END RSA PRIVATE KEY-----
    clients:
      - client_id: 'unique-client-identifier' # 唯一id
        client_name: 'Alist'  # 应用名称
        client_secret: '$pbkdf2-sha512$310000$c8p78n7pUMln0jzvd4aK4Q$JNRBzwAo0ek5qKn50cFzzvE9RXV88h1wJn5KGiHrD0YKtZaR/nCb2CJPOsKaPK0hjf.9yHxzQGZziziccp6Yng'  # 加密key
        claims_policy: "legacy_claims"  # alist 解析id_token，需要增加信息
        authorization_policy: 'one_factor'
        redirect_uris:
          - 'https://alist.example.com/api/auth/sso_callback?method=get_sso_id'
          - 'https://alist.example.com/api/auth/sso_callback?method=sso_get_token'
        scopes:
          - 'openid'
          - 'profile'
          - 'email'
        token_endpoint_auth_method: 'client_secret_basic'
      - client_id: 'unique-client-identifier' # 唯一id
        client_name: 'Portainer'  # 应用名称
        client_secret: '$pbkdf2-sha512$310000$c8p78n7pUMln0jzvd4aK4Q$JNRBzwAo0ek5qKn50cFzzvE9RXV88h1wJn5KGiHrD0YKtZaR/nCb2CJPOsKaPK0hjf.9yHxzQGZziziccp6Yng'  # 加密key
        authorization_policy: 'one_factor'
        redirect_uris:
          - 'https://portainer/'
        scopes:
          - 'openid'
          - 'profile'
          - 'groups'
          - 'email'
        token_endpoint_auth_method: 'client_secret_post'
      - client_id: 'test'
        client_secret: 'test'  # 测试token
        claims_policy: "legacy_claims"
        authorization_policy: 'one_factor'
        redirect_uris:
          - 'https://psteniusubi.github.io/oidc-tester/authorization-code-flow.html'
        scopes:
          - 'openid'
          - 'profile'
          - 'email'
        token_endpoint_auth_method: 'client_secret_post'

```
## 身份验证
`users_database.yaml`内容，多个用户配置多个key。
```yaml
---
###############################################################
#                         Users Database                      #
###############################################################

# This file can be used if you do not have an LDAP set up.

# List of users
users:
  authelia:
    disabled: false
    displayname: 'Authelia User'
    # Password is authelia
    password: '$6$rounds=50000$BpLnfgDsc2WD8F2q$Zis.ixdg9s/UOJYrs56b5QEZFiZECu0qZVNsIYxBaNJ7ucIL.nlxVCT5tqh8KHG8X4tlwCFm5r6NTOZZ5qRFN/'  # yamllint disable-line rule:line-length
    email: 'authelia@authelia.com'
    groups:
      - 'admins'
      - 'dev'
```

## 配置双因子认证
账号密码首次登录后，页面提示使用配置新的认证方式，支持duo、totp、webauthn。

## argon2id格式密码
```bash
docker run --rm -it authelia/authelia:latest authelia crypto hash generate argon2
```

## hash格式密码
```bash
docker run --rm authelia/authelia:latest authelia crypto hash generate argon2 --random --random.length 64 --random.charset alphanumeric
```

## 64位随机密码生成
1: Authelia
```bash
docker run --rm authelia/authelia:latest authelia crypto rand --length 64 --charset alphanumeric
```
2: Openssl
```bash
openssl rand -hex 64
```
3. Linux
```bash
LENGTH=64
tr -cd '[:alnum:]' < /dev/urandom | fold -w "${LENGTH}" | head -n 1 | tr -d '\n' ; echo
```

## RSA秘钥生成
1. Authelia
```bash
docker run --rm -u "$(id -u):$(id -g)" -v "$(pwd)":/keys authelia/authelia:latest authelia crypto certificate rsa generate --common-name example.com --directory /keys
```
2. Openssl
```bash
openssl req -x509 -nodes -newkey rsa:2048 -keyout private.pem -out public.crt -sha256 -days 365 -subj '/CN=example.com'
```

## Alist SSO 配置
1. 管理页面开启SSO
2. 配置SSO：
单点登录平台: OIDC
单点登录客户端ID: client-id
单点登录客户端机密: client-secret
Sso oidc 用户名键: preferred_username
单点登录组织名称: Authelia
单点登录应用名称: Alist
单点登录端点名称: https://authelia.example.com
3. 个人资料绑定单点登录


## portainer SSO 配置
1. Settings -> Authentication -> OAuth -> Custom
2. 配置SSO
Client ID: portainer
Client Secret: insecure_secret
Authorization URL: https://auth.example.com/api/oidc/authorization
Access Token URL: https://auth.example.com/api/oidc/token
Resource URL: https://auth.example.com/api/oidc/userinfo
Redirect URL: https://portainer.example.com
User Identifier: preferred_username
Scopes: openid profile groups email
Auth Style: In Params

## nginx配置方法
https://www.authelia.com/integration/proxies/nginx/

## 参考文档
1. [Authelia configuration](https://www.authelia.com/configuration/prologue/introduction/)
2. [Authelia openid-connect](https://www.authelia.com/integration/openid-connect/introduction/)




