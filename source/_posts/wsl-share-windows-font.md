---
title: WSL共享Windows字体
date: 2025-04-05 12:53:34
tags:
  - wsl
---

# 说明
wsl是没有中文字体的，所以在安装使用Firefox等软件时，无法正常显示中文字体，所以我们可以通过使用Windows自带字体的方式，来实现快速安装中文字体（以Ubuntu为例）。

```shell
# 增加字体查找路径
sudo vim /etc/fonts/local.conf
```
```xml
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
    <dir>/mnt/c/Windows/Fonts</dir>
</fontconfig>
```

```shell
sudo apt install fontconfig

# 强制重建所有字体缓存文件
fc-cache -fv

# 查看安装字体
fc-list
```

# 参考
1. [Sharing Windows fonts with WSL](https://x410.dev/cookbook/wsl/sharing-windows-fonts-with-wsl/)

