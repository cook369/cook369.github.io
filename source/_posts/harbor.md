---
layout: title
title: Harbar 安装出错
date: 2025-03-13 18:19:54
tags:
  - docker
  - secommp
  - harbor
categories:
  - [docker]
---
## Harbar 安装出错
harboar启动失败，安装Harbor version：v2.9.0
```bash
popen failure: Cannot allocate memory
initdb: error: The program "postgres" is needed by initdb but was not found in the
```
问题原因是docker版本过低，解决办法是升级docker版本大于20.10.10后即可解决。

# 问题原因
最新的 glibc （2.33.9000，在 Fedora 35 rawhide 中）现在默认尝试使用 'clone3'。
为了实现向后兼容性，如果它看到 ENOSYS errno 将自动回退 “clone”。
任何其他 errno 都被视为致命的错误。
docker 安装的默认 seccomp 过滤器会导致 EPERM，因此这会中断 glibc 回退。因此程序无法生成线程和fork子进程。

# 根本原因
带有 libseccomp 的 Docker packages/libs 中使用的较新的 syscall 被阻止。

## Secommp
Secommp (SECure COMPuting) 是 Linux 内核 2.6.12 版本引入的安全模块，主要是用来限制某一进程可用的系统调用 (system call)。
它最初被用于 cpushare 这个项目，让人们可以出租自己空闲的 cpu cycle 来执行 untrusted code。
这个 feature 本身并不是一个沙盒 (sandbox)，它只是一种减少 Linux 内核暴露的机制，是构建一个安全的沙盒的重要组成部分。

## Docker Secommp
libseccomp 允许您为进程配置允许的系统调用。
Docker 为所有容器设置默认的 seccomp 配置文件，以便仅允许某些 syscall，而阻止其他所有内容（因此，libseccomp 或 docker 尚不知道的较新 syscall 将被阻止3）

docker每个容器默认都设置了一个seccomp profile，屏蔽掉了其中的44个系统调用。
docker会将seccomp传递给runc中的sepc.linux.seccomp。
可以通过—security-opt seccomp=xxx来设置docker的seccomp策略，xxx为json格式的文件，其中定义了seccomp规则。
也可以通过--security-opt seccomp=unconfined来关闭docker引入默认的seccomp规则的限制。

# Secommp 等导致的 operation not permitted 处理办法
1. --security-opt seccomp=unconfined来关闭docker引入默认的seccomp规则的限制
2. 切换到较旧的映像， 如果 16 在移动到 Debian Bookworm 时开始失败，那么 16-bullseye 是一个有效的解决方法，直到主机可以更新为止。
3. 更新主机docker版本



## 参考
[1] [DB init error: popen failure: Cannot allocate memory](https://github.com/goharbor/harbor/issues/19141)
[2] [Docker image fails during initdb ](https://github.com/timescale/timescaledb-docker-ha/issues/260)
[3] [seccomp: add support for "clone3" syscall in default policy](https://github.com/moby/moby/pull/42681)
[4] [seccomp filter breaks latest glibc (in fedora rawhide) by blocking clone3 with EPERM](https://github.com/moby/moby/issues/42680)
[5] [Seccomp security profiles for Docker](https://docs.docker.com/engine/security/seccomp/)
[6] ["operation not permitted", a libseccomp story ](https://github.com/docker-library/official-images/issues/16829)
[7] [runtime/cgo: pthread_create failed: Operation not permitted](https://github.com/docker-library/golang/issues/467)