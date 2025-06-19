---
title: virsh常用命令
date: 2025-06-19 14:52:08
tags:
  - virsh
  - kvm
---
# virsh介绍
virsh是libvirt的命令行工具，用于管理kvm虚拟机。
可以用来完成创建虚拟机，查看虚拟机，动态热插拔硬盘，给虚拟机做快照，迁移、启动、停止、挂起、暂停、删除虚拟机等操作
# kvm虚拟机管理的不同方式
virt-manager图形界面，virsh是终端命令行，两者都是通过libvirt连接至libvirtd管理虚拟机；
qemu直接调用kvm内核中模块的API管理虚拟机；
# virsh常用命令
```bash
# 查看所有虚拟机
virsh list --all
# 启动虚拟机
virsh start vm-name
# 停止虚拟机
virsh shutdown vm-name
# 删除虚拟机
virsh destroy vm-name
# 创建虚拟机
virsh define vm-name.xml
# 删除虚拟机定义
virsh undefine vm-name
# 获取虚拟机状态
virsh domstate vm-name
# 获取虚拟机信息
virsh dominfo vm-name
# 获取虚拟机IP地址
virsh domifaddr vm-name
# 查看KVM虚拟机当前配置
virsh dumpxml vm-name > vm-name.xml
# 克隆虚拟机
virsh clone vm-name vm-name-clone
# 动态修改cpu，memory, --live在线生效，--config下次重启生效
virsh setvcpus <vm-name> 4 --config --live
virsh setmaxmem <vm-name> 10G --config --live
```
# 虚拟机增加磁盘
```bash
virsh shutdown <vm-name>
# 查看虚拟机磁盘路径：
virsh domblklist <vm-name>
# 扩展磁盘大小
qemu-img resize /var/lib/libvirt/images/centos7.qcow2 +10G
virsh start <vm-name>
```
# 挂载磁盘
```bash
# 创建qcow2格式磁盘
qemu-img create -f qcow2 /opt/test.qcow2 10G
# 查看磁盘信息
qemu-img info /opt/test.qcow2 

# 将磁盘挂载到虚拟机上
virsh attach-disk vm-node1 /opt/test.qcow2 vdb --persistent
# 卸载磁盘
virsh detach-device vm-node1 --persistent
```
# 其他
默认kvm上的虚拟机的配置文件都保存在/etc/libvirt/qemu/目录下，以虚拟机名称命名的配置文件；修改了虚拟机名称、磁盘镜像文件存放位置，mac地址后可以创建一个新的虚拟机