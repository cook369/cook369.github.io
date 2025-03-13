---
layout: title
title: harbor
date: 2025-03-13 18:19:54
tags:
---
### harbar install
harboar启动失败，安装Harbor version：v2.9.0
```bash
popen failure: Cannot allocate memory
initdb: error: The program "postgres" is needed by initdb but was not found in the
```
问题原因是docker版本过低，升级docker版本大于20.10.10后即可解决。

## 参考
[1] [https://github.com/goharbor/harbor/issues/19141](https://github.com/goharbor/harbor/issues/19141)
[2] [https://github.com/timescale/timescaledb-docker-ha/issues/260](https://github.com/timescale/timescaledb-docker-ha/issues/260)
