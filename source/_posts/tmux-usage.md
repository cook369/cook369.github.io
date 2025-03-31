---
title: Tmux使用说明 
date: 2025-03-31 15:40:42
tags:
  - tmux
---


## 1. 简介
tmux(Terminal Multiplexer)多session管理的终端程序，保持进程在后端运行，它允许您在单个会话中创建、管理和组织多个终端窗口。

1. 会话持久化：连接断开后会话保持
2. 多任务处理：多任务系统切换
3. 分屏管理：一个终端中分隔屏幕，创建多个窗口

## 2. 安装
1. 发行版安装
```shell
# For Ubuntu/Debian-based systems
sudo apt update
sudo apt install tmux

# For CentOS/RHEL-based systems
sudo yum install tmux
sudo dnf -y install tmux

# Verify installation
tmux -V
```
2. git安装

1. 安装依赖
```shell
# install Tmux dependencies on Debian
$ apt-get install libevent ncurses libevent-dev ncurses-dev build-essential bison pkg-config
# install Tmux dependencies on RHEL/CentOS
$ yum install libevent ncurses libevent-devel ncurses-devel gcc make bison pkg-config
```
2. 编译
```shell
# clone install
git clone https://github.com/tmux/tmux.git
cd tmux
sh autogen.sh
./configure && make

# download tmux and install without git cloning
wget https://github.com/tmux/tmux/releases/download/3.3a/tmux-3.3a.tar.gz
tar xzvf tmux-3.3a.tar.gz
cd tmux-3.3a
./configure
make && sudo make install

```

## 3. 常用命令
```shell
# starting a New Session
> tmux

# detaching from a Session
Ctrl+b, then d

# reattaching to a Session
> tmux attach

# creating a New Window
Ctrl+b, then c
  
# switching Between Windows
Ctrl+b, then n (for next window)
Ctrl+b, then p (for previous window)

```
```shell
# splitting Panes Horizontally
Ctrl+b, then \"

# splitting Panes Vertically
Ctrl+b, then %

# resizing Panes
Ctrl+b, then arrow keys

# renaming a Session
> tmux rename-session -t [old-name] [new-name]
  
# list All Sessions
> tmux ls

# killing a Session
> tmux kill-session -t [session-name]
```

## 4. 快捷键

| 操作  | 描述 |
| :-----: | ----------- |
| `CTRL`+`b` `<command>` | 发送 `<command>` 到 tmux |
| | **常用命令** |
| `CTRL`+`b` + `?` | 显示帮助信息 (`q`退出) |
| `CTRL`+`b` + `:` | 输入 tmux 命令 |
| | **窗口命令** |
| `CTRL`+`b` +  `c` | 创建新窗口 |
| `CTRL`+`b` +  `,` | 重命名窗口 |
| `CTRL`+`b` +  `&` | 关闭窗口 |
| `CTRL`+`b` +  `p` | 切换上一个窗口 |
|  `CTRL`+`b` + `n` | 切换下一个窗口 |
|  `CTRL`+`b` + `w` | 显示所有窗口，方向键选择窗口 |
|  `CTRL`+`b` + | **窗格(pane)命令** |
|  `CTRL`+`b` + `%`  `tmux split-window -v`        | 垂直分隔 vertically |
|  `CTRL`+`b` + `"`  `tmux split-window -h`         | 水平分隔 horizontally |
|  `CTRL`+`b` + `z`          | 放大缩小 |
|  `CTRL`+`b` + →          | 切换到右侧 |
|  `CTRL`+`b` + ←          | 切换到左侧 |
|  `CTRL`+`b` + ↑          | 切换到上侧 |
|  `CTRL`+`b` + ↓          | 切换到下侧 |
|  `CTRL`+`b` + `!`          | 转换panel到窗口 |
|  `CTRL`+`b` + `x`          | 关闭panel |
|  `CTRL`+`b` + `[`          | 进入复制模式 |
|  `CTRL`+`b` + `:setw -g mode-keys vi` | 使用vi快捷键 |
| | **会话命令** |
| `d` | 退出会话 |
| | **其他** |
| `tmux new` | 创建新会话 |
| `tmux new -s mysession` | 创建新会话mysession |
| `tmux new-session -A -s mysession` | 创建或连接到会话 |
| `tmux kill-session -t mysession` | 终止会话 |
| `tmux kill-session -a` | 终止所有会话 |
| `tmux kill-session -a -t mysession` | 终止mysession外所有会话 |
| `tmux ls` `tmux list-sessions`  | 列出所有会话 |
| `tmux a` `tmux attach-session` | 连接到最后一个会话 |
| `tmux a -t mysession` | 连接到mysession |
| `tmux resize-pane -L 20` | 调整分隔线位置(LRDU) |



## 参考
1. [source](https://github.com/tmux/tmux)
2. [tmuxcheatsheet](https://tmuxcheatsheet.com/)

