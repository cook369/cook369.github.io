---
title: nmcli-usage
date: 2025-04-06 14:09:51
tags:
  - nmcli
---

# 使用nmcli连接wifi
1. 启用并查看可用wifi访问点
```bash
# 启用wifi
nmcli radio wifi on
# 查看wifi
nmcli dev wifi list
```
2. 连接wifi
```bash
nmcli dev wifi connect xxx password xxxxxx
```
3. 配置静态ip
```bash
# ipv4
nmcli con modify xxx ipv4.method manual ipv4.addresses 192.0.2.1/24 ipv4.gateway 192.0.2.254 ipv4.dns 192.0.2.200 ipv4.dns-search example.com
# ipv6
nmcli con modify xxx ipv6.method manual ipv6.addresses 2001:db8:1::1/64 ipv6.gateway 2001:db8:1::fffe ipv6.dns 2001:db8:1::ffbb ipv6.dns-search example.com

# 修改配置后需要重新激活连接
nmcli con up xxx
```
4. 查看所有连接
```bash
nmcli con show
```
5. 修改连接状态
```bash
nmcli con up xxxx 
nmcli con down
nmcli con del xxxx
```
6. 配置自动连接
```bash
nmcli con modify xxx con.autoconnect yes
```
7. 创建热点
```bash
# MyHostspot 连接名，  MyHostspotSSID  热点名，   12345678 热点密码
nmcli device wifi hotspot ifname wlan0 con-name MyHostspot ssid MyHostspotSSID password 12345678
```
8. 图形化工具
```bash
nmtui
```
9. 显示连接
```bash
nmcli dev wifi show-password
```
10. 密码保存路径
```
/etc/sysconfig/network-scripts/*.nmconnections
/etc/netplan/*.yaml
```

# 参考
1. [使用 nmcli 连接到 wifi 网络](https://docs.redhat.com/zh-cn/documentation/red_hat_enterprise_linux/9/html/configuring_and_managing_networking/proc_connecting-to-a-wifi-network-by-using-nmcli_assembly_managing-wifi-cons)
