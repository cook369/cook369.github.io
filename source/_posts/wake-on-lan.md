---
title: Wake-On-Lan
date: 2025-04-05 16:46:31
tags:
  - WoL
---

# 简介
Wake-On-Lan（WoL）是一种网络唤醒电脑主机。

原理是向电脑发送一个魔术数据包(magic packet)，网卡收到数据包后，电脑就会自动开机，用来远程控制linux开机。

# 前置条件
1. BIOS支持远程开机
2. 使用有线网卡，连接到网络
3. 保持通电状态
4. 同一个网络下有其他设备可以发送魔术数据包(Windowsh或Linux电脑，路由器、树莓派、手机)

# BIOS开启网络唤醒
BIOS中查找`PCI Power up, Allow PCI wake up event，Boot from PCI/PCI-E`选项并启用.
DELL的BIOS设置`BIOS > Power Management > Wake On LAN/WLAN`

# 检查网卡是否支持
```bash
sudo apt install ethtool
sudo ethtool eth0 | grep Wake-on
---

Supports Wake-on: pumbg
Wake-on: d
```
d（禁用）、p（PHY 活动）、u（单播活动）、m（多播活动）、b（广播活动）、a（ARP 活动）和 g（魔术数据包活动）
WoL 需要值 g 才能工作。

# Linux中启用WoL
1. 确认连接有线网络
2. 使用`ip link`，查看有线网卡MAC地址
3. 使用NetworkManager启用网卡Wake-On-Lan功能
a. 查找有线连接的名称
```bash
nmcli c show
---

NAME    UUID                                  TYPE            DEVICE
eth0    612e300a-c047-4adb-91e2-12ea7bfe214e  802-3-ethernet  enp0s25
```
b. 查看连接对应的状态
```bash
nmcli c show "eth0" | grep 802-3-ethernet.wake-on-lan
---

802-3-ethernet.wake-on-lan:             default
802-3-ethernet.wake-on-lan-password:    --
```
显示为`default`或`-`，未启用
c. 配置Wake-On-Lan
```bash
# 启用
nmcli c modify "eth0" 802-3-ethernet.wake-on-lan magic
nmcli c modify "eth0" 802-3-ethernet.auto-negotiate yes
# 禁用
nmcli c modify "eth0" 802-3-ethernet.wake-on-lan ignore
```
d. 检查是否生效为magic
```bash
reboot
nmcli c show "eth0" | grep 802-3-ethernet.wake-on-lan
```

# Window启用WoL
1. 开始菜单查找电源管理，关闭快速启动。
2. 设备管理器找到有线网卡，属性电源管理选中：允许此设备唤醒计算机、仅允许魔术包唤醒计算机。
   高级选项打开`wake on lan`,`wake on magic packet`


# 测试WoL
1. 关机
```bash
sudo shutdown now

sudo systemctl suspend

sudo systemctl hibernate
```
2. 安装远程唤醒工具
windows:
```bash
https://github.com/basildane/WakeOnLAN/releases/download/2.12.4/WakeOnLAN_2.12.4.0.exe
```
linux:
```bash
sudo apt install wakeonlan
```
1. 指定MAC地址，发送魔术数据包
```bash
wakeonlan "e3:e3:1b:41:f5:fa"

wakeonlan -i hostname 38:d5:47:79:ab:0b

wakeonlan -i 192.168.86.255 38:d5:47:79:ab:0b
```
python:
```python
import socket

def wol(mac_address: str):
    # mac_address = mac_address.replace(':', '').replace('-', '').lower()
    # mac_address_bytes = b''.join(bytes([int(mac_address[i:i+2], 16)]) for i in range(0, 12, 2))
    mac_address_bytes = bytes.fromhex(mac_address.replace(':', '').replace('-', '').lower())
    magic_packet = b'\xFF' * 6 + mac_address_bytes * 16
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    sock.sendto(magic_packet, ('255.255.255.255', 7))
    sock.close()

wol('00:11:22:33:44:55')
```

# 检查魔术数据包的接收情况
为了确保 WoL 数据包到达目标计算机，可以监听 UDP 端口（通常是端口 9）以获取魔术数据包。预期的魔术数据包帧包含 6 字节的 FF，后跟目标计算机的 MAC 的 16 次重复（每次 6 字节），总共 102 字节。
```bash
sudo nc -u -l 9 | xxd

sudo tcpdump -i enp4s0 '(udp and port 7) or (udp and port 9)'
```

# 问题解决办法
1. 如果无法开机检查BIOS中电源选项，DELL的BIOS中`BIOS > Power Management > Deep Sleep Control`需要禁用
2. 笔记本出现电池耗电过快能是由启用的 WOL 引起，`ethtool -s net0 wol d`关闭

# 关机信息扩展
ACPI(Advanced Configuration and Power Interface)，即高级配置与电源接口。这种新的能源管理可以通过诸如软件控制"开关"系统，亦可以用Modem信号唤醒和关闭系统。
　　ACPI在运行中有以下几种模式：
　　S0 正常。
　　S1 CPU停止工作。唤醒时间：0秒。
　　S2 CPU关闭。唤醒时间：0.1秒。
　　S3 除了内存外的部件都停止工作。唤醒时间：0.5秒。
　　S4 内存信息写入硬盘，所有部件停止工作。唤醒时间：30秒。（休眠状态）
　　S5 关闭(Shutdown)。


# 参考
1. [Wake-on-LAN](https://wiki.archlinux.org/title/Wake-on-LAN)
1. [遠端開機：Ubuntu如何啟用Wake-On-Lan，透過NetworkManager設定](https://ivonblog.com/posts/linux-enable-wake-on-lan/)
2. [电源选项中S1，S2，S3，S4，S5的含义](https://blog.csdn.net/wh_19910525/article/details/51168488)
3. [系统睡眠状态](https://learn.microsoft.com/zh-cn/windows-hardware/drivers/kernel/system-sleeping-states)
4. [DELL BIOS电源管理](https://www.dell.com/support/manuals/zh-hk/vostro-3670-desktop/vostro_3670_setup_and_specs/power-management-%E9%9B%BB%E6%BA%90%E7%AE%A1%E7%90%86-%E7%95%AB%E9%9D%A2%E9%81%B8%E9%A0%85?guid=guid-9cf1d258-4847-4c38-ae0b-9306bad21d7f&lang=zh-hk)
5. [LAN 唤醒：故障处理指南和最佳实践](https://www.dell.com/support/kbdoc/zh-cn/000129137/%E4%BB%80%E4%B9%88%E6%98%AF-lan-%E5%94%A4%E9%86%92-%E6%95%85%E9%9A%9C%E5%A4%84%E7%90%86%E6%8C%87%E5%8D%97%E5%92%8C%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5)

