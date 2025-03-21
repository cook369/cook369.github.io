---
title: asdf使用说明
date: 2025-03-20 12:39:31
updated: 2025-03-21 10:00:00
tags:
  - asdf
---
## 安装说明
1. 安装依赖
```bash
apt install curl git
```
2. 下载 asdf 核心
 a. [https://github.com/asdf-vm/asdf/releases](https://github.com/asdf-vm/asdf/releases)
 b. `go install github.com/asdf-vm/asdf/cmd/asdf@v0.16.0`

3. 安装 asdf
在 ~/.bashrc 文件中加入以下内容：
```bash
export PATH="${ASDF_DATA_DIR:-$HOME/.asdf}/shims:$PATH"
. <(asdf completion bash)
```

4. 为每一个你想要管理的工具/运行环境安装插件
```bash
apt-get install dirmngr gpg curl gawk
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git

```

5. 安装工具/运行环境的一个版本
```bash
asdf install nodejs latest
```

6. 通过 .tool-versions 配置文件设置全局和项目版本
```bash
asdf set nodejs latest
```

## 安装插件
```bash
# asdf plugin add <tool> <git url>

asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf plugin add python https://github.com/asdf-community/asdf-python.git
asdf plugin add java https://github.com/asdf-community/asdf-java.git
asdf plugin add golang https://github.com/asdf-community/asdf-golang.git
asdf plugin add poetry https://github.com/asdf-community/asdf-poetry.git

# asdf list all <tool>
asdf list all nodejs

# asdf install <tool> latest
asdf install nodejs latest

```

## 参考
1. [https://github.com/asdf-vm/asdf](https://github.com/asdf-vm/asdf)
2. [https://asdf-vm.com/guide/getting-started.html](https://asdf-vm.com/guide/getting-started.html)

