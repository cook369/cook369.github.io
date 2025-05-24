---
title: Docker Buildx 配置
date: 2025-05-24 23:44:34
tags:
  - docker
  - buildx
---

# gitlab ci 中使用 buildx

1. 生成 buildx 的私有仓库配置文件

```shell
cat << EOF > buildkitd.toml
[registry."registry.xxx.com:5000"]
http = false
insecure = false
ca=["/etc/docker/certs.d/registry.xxx.com/ca.cert"]
EOF
```

2. 创建 buildx 容器

```shell
docker buildx create --name builder --use --config buildkitd.toml --driver-opt image=docker-0.unsee.tech/moby/buildkit:v0.22.0
docker buildx inspect --bootstrap
```

3. 将证书文件加入系统信任(解决"x509: certificate signed by unknown authority")

```shell
# Debian / Ubuntu
sudo cp ca.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates

# Red Hat / CentOS / Fedora / Rocky / AlmaLinux
sudo cp ca.crt /etc/pki/ca-trust/source/anchors/
sudo update-ca-trust extract

# Arch Linux
sudo cp ca.crt /etc/ca-certificates/trust-source/anchors/
sudo trust extract-compat

```

4. 检测 ca 证书是否生效

```shell
# Debian / Ubuntu
openssl verify -CAfile /etc/ssl/certs/ca-certificates.crt ca.crt
# Red Hat / CentOS
openssl verify -CAfile /etc/pki/tls/certs/ca-bundle.crt my-root-ca.crt

# 测试https是否可用
curl https://xxxxx.com
```

5. dockerfile 增加 cache

```dockerfile
# apt cache
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked,id=test-apt-cache \
    --mount=type=cache,target=/var/lib/apt,sharing=locked,id=test-apt-lib \
    sed -i s@/deb.debian.org/@/mirrors.aliyun.com/@g /etc/apt/sources.list && \
    sed -i s@/security.debian.org/@/mirrors.aliyun.com/@g /etc/apt/sources.list && \
    apt-get update && \
    apt-get -y --no-install-recommends install \
        wget ca-certificates curl procps

# pip cache
RUN --mount=type=cache,target=/root/.cache,id=test-poetry-cache \
    pip config set global.index-url https://mirrors.aliyun.com/pypi/simple && \
    pip install poetry

# poetry cache
RUN --mount=type=cache,target=/root/.cache,id=test-poetry-cache \
    --mount=type=bind,source=./app/poetry.lock,target=poetry.lock \
    --mount=type=bind,source=./app/pyproject.toml,target=pyproject.toml \
    poetry install --no-root --only main

```

6. buildx 配置指定 cache

```shell
docker buildx build \
    --target dockerfile-target \
    --push \
    -t xxxx.com:5000/xxx:latest \
    --build-arg "VERSION=1.0.0" \
    --cache-to type=registry,ref=xxxx.com:5000/cache:latest \
    --cache-from type=registry,ref=xxxx.com:5000/cache:latest \
    -f Dockerfile .
```

# 参考

1. [Configure BuildKit](https://docs.docker.com/build/buildkit/configure/)
2. [docker buildx build](https://docs.docker.com/reference/cli/docker/buildx/build/)
