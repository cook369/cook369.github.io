---
title: Git配置代理
date: 2025-04-15 15:16:46
description: "Git 代理的相关配置"
tags:
  - git
  - proxy
---
# 配置git使用代理克隆代码

# 问题来源
git clone代码时，遇到`unable to access '...'`,`Couldn't resolve host '...'`, 可以配置代理解决。
遇到`unable to access 'https://...': Unknown SSL protocol error in connection to ...:443`, 可以关闭`sslVerify`解决


# 命令行配置
## 1. 配置git的http代理
查看代理
```bash
git config --global --get http.proxy
git config --global --get https.proxy
```
配置代理
```bash
# 格式 http://proxyUsername:proxyPassword@proxy.server.com:port
# 全局代理
git config --global http.proxy http://127.0.0.1:7890
# 域名代理
git config --global http.https://github.com.proxy http://http://127.0.0.1:7890
git config --global http.https://github.com.sslVerify false
```
取消配置
```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```
## 2. 使用`GIT_SSH_COMMAND` 环境变量配置git的ssh代理
```bash
# 临时配置代理
export GIT_SSH_COMMAND='ssh -o ProxyCommand="connect -S 127.0.0.1:7890 %h %p"'
# 配置全局
git config --global core.sshCommand 'ssh -o ProxyCommand="connect -S 127.0.0.1:7890 %h %p"'
# 配置本次命令
git clone -c=core.sshCommand 'ssh -o ProxyCommand="connect -S 127.0.0.1:7890 %h %p"' git@github.com:user/repo.git
# 配置本地仓库
git config core.sshCommand 'ssh -o ProxyCommand="connect -S 127.0.0.1:7890 %h %p"'
# 配置全局仓库
git config --global core.sshCommand 'ssh -o ProxyCommand="connect -S 127.0.0.1:7890 %h %p"'
```

# 配置文件

## 1. http克隆
修改`~/.ssh/config`配置文件
windows：`C:\Users\用户名\.gitconfig`
linux：`~/.gitconfig`

```bash
[http]
[http "https://github.com"]
	proxy = http://127.0.0.1:7890
```

## 2. ssh代理
修改`~/.ssh/config`配置文件
windows
<details>
<summary>windows下创建配置文件</summary>
<pre><code class="language-powershell">
$sshDir = "$env:USERPROFILE\.ssh"
$configFile = Join-Path $sshDir "config"

\# Create .ssh directory if it doesn't exist
if (-not (Test-Path $sshDir)) {
    New-Item -Path $sshDir -ItemType Directory | Out-Null
}

\# Create config file if it doesn't exist
if (-not (Test-Path $configFile)) {
    New-Item -Path $configFile -ItemType File | Out-Null
}
</code></pre>
</details>

`notepad $env:USERPROFILE\.ssh\config`
```bash
Host github.com
    Hostname github.com
    ServerAliveInterval 55
    ForwardAgent yes
    ProxyCommand connect -H 127.0.0.1:7890 %h %p
```
linux：
`mkdir ~/.ssh && vim ~/.ssh/config`
```bash
Host github.com
    Hostname github.com
    ServerAliveInterval 55
    ForwardAgent yes
    ProxyCommand nc -x 127.0.0.1:7890 %h %p
```

# 其他

1. linux下也可以通过`export ALL_PROXY=127.0.0.1:7890`，配置全局代理。
2. `connect`命令来自git,位置在`C:\Program Files\Git\mingw64\bin\connect.exe`。
   ubuntu下可以通过`sudo apt install connect-proxy`安装。
3.  `connect`命令参考
```bash
#  connect.exe [-dnhst45] [-p local-port]
#           [-H proxy-server[:port]] [-S [user@]socks-server[:port]]
#           [-T proxy-server[:port]]
#           [-c telnet-proxy-command]
#           host port
# -H 指定http代理服务
connect -H 127.0.0.1:10808 github.com 443
# -S 指定SOCKS 代理服务器
connect -S 127.0.0.1:10808 github.com 443
```

# 参考
1. https://github.com/larryhou/connect-proxy
2. https://git-scm.com/docs/git-config/2.16.6
3. https://gist.github.com/alphamarket/e0ed48f8755bebdc7451b758bc6828fa
4. https://gist.github.com/ozbillwang/005bd1dfc597a2f3a00148834ad3e551



