---
title: RPMDB 文件损坏问题分析
date: 2025-05-13 19:03:25
tags:
  - rpmdb
  - yum
categories:
  - [yum]
---
## 介绍
本文介绍RPMDB 文件损坏问题分析

# 检查使用rpm的进程
  1. 检查正在使用 /var/lib/rpm 的进程`fuser -v /var/lib/rpm`
  2. 停止任何由 fuser -v /var/lib/rpm 报告的服务或进程
  3. 删除 /var/lib/rpm/Packages 文件`rm /var/lib/rpm/__db*`

# 问题分析
1. 安装rpm-deathwatch源
```shell
# Centos7
curl https://people.redhat.com/kwalker/repos/rpm-deathwatch/rhel7/rpm-deathwatch-rhel-7.repo -o /etc/yum.repos.d/rpm-deathwatch.repo
# Centos8
curl https://people.redhat.com/kwalker/repos/rpm-deathwatch/rhel8/rpm-deathwatch-rhel-8.repo -o /etc/yum.repos.d/rpm-deathwatch.repo
```
2. 安装rpm-deathwatch
```shell
yum install -y yum-utils kernel-{devel,headers,debuginfo}-$(uname -r) systemtap && debuginfo-install -y kernel
yum install rpm-deathwatch
```
3. 启动rpm-deathwatch服务
```shell
# 开机启动
systemctl enable --now rpm-deathwatch
```
4. 检测rpm-deathwatch服务
```shell
systemctl status rpm-deathwatch
```
5. 查看rpm-deathwatch日志`/var/log/rpm-deathwatch*`
```yaml
Fri Dec  4 00:00:17 2020 EST: sig.send: SIGKILL was sent to yum (pid:31171) by uid:0 using signal_generate
Fri Dec  4 00:00:17 2020 EST: sig.send: Process tree:
 ->systemd[1] - <None found>
  ->BESClient[3563] - <None found>
Fri Dec  4 00:00:17 2020 EST: kprocess.exit: yum(pid:31171) - Code   9 - "/usr/bin/python /usr/bin/yum -y update
```
```yaml
Tue May 13 14:49:17 2025 CST: Now monitoring for process termination signals
Tue May 13 15:06:54 2025 CST: syscall.sys_group_exit: rpm(pid:13060)
Tue May 13 15:06:54 2025 CST: kprocess.exit: rpm(pid:13060) - Code 256 - "rpm -q qperf"
Tue May 13 15:06:58 2025 CST: sys.kill: kill(pid:13155) called kill(13064, SIGKILL)
Tue May 13 15:06:58 2025 CST: sig.send: SIGKILL was sent to yum (pid:13064) by uid:0 using signal_generate
Tue May 13 15:06:58 2025 CST: sig.send: Process tree:
 ->systemd[1] - <None found>
  ->sh[13149] - /bin/sh -c ps -ef | grep 'yum install' | grep -v grep | awk '{print }' | xargs kill -9
   ->xargs[13154] - xargs kill -9
    ->kill[13155] - xargs kill -9
Tue May 13 15:06:58 2025 CST: kprocess.exit: yum(pid:13064) - Code   9 - "/usr/bin/python /bin/yum install qperf -y"
Tue May 13 15:07:26 2025 CST: syscall.sys_group_exit: python(pid:14058)
Tue May 13 15:07:26 2025 CST: kprocess.exit: python(pid:14058) - Code 256 - "/usr/bin/python --"
```

# 原因分析
rpm、yum 或 dnf 没有干净地退出，在`/var/lib/rpm`留下锁文件(`__db001` –  `__db005`)。
```shell
# 查看留下锁文件的进程 pid
db_stat -C l -h /var/lib/rpm

# 检查过期锁文件
cd /var/lib/rpm
/usr/lib/rpm/rpmdb_stat -CA
```
过期的锁通常是由于进程以异常方式被终止（电源丢失、内核崩溃、“kill”命令）。
常见原因是自动化工具超时结束进程，或者yum进程被`kill -9`，没有让 rpm 清除锁文件。
此问题可以通过停止使用 `/var/lib/rpm` 目录下文件的所有进程并删除这些文件，可以通过`lsof | grep /var/lib/rpm`检查，或通过重启（重启也会删除这些文件）来解决。

# 处理办法
1. 检查正在使用 /var/lib/rpm 的进程`fuser -v /var/lib/rpm`
2. 停止任何由 fuser -v /var/lib/rpm 报告的服务或进程
3. 删除 /var/lib/rpm/Packages 文件`rm /var/lib/rpm/__db*`

# 可选处理过程
1. 检查rpm是否正常`rpm –quiet -qa` 
2. 重建索引`rpm --rebuilddb`
3. 清理缓存`yum clean all`

# 参考
1. [debug recurring rpm database corruption](https://access.redhat.com/solutions/3330211)


