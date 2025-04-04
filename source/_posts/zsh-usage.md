---
title: zsh使用说明
date: 2025-04-05 03:28:57
tags:
  - zsh
---

# 安装zsh
```shell
sudo apt install zsh
zsh --version
sudo chsh -s $(which zsh)
```
`zsh`首次进入后，选择`1`初始化配置文件,安装oh-my-zsh会覆盖此配置。

# 安装oh-my-zsh
```shell
sh -c "$(curl -fsSL https://install.ohmyz.sh)"
sh -c "$(wget -O- https://install.ohmyz.sh)"
sh -c "$(fetch -o - https://install.ohmyz.sh)"
```

# 安装powerlevel10k主题
```shell
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"

sed -i 's/^ZSH_THEME=.*/ZSH_THEME="powerlevel10k\/powerlevel10k"/' ~/.zshrc
```
修改zshrc,配置主题`ZSH_THEME="powerlevel10k/powerlevel10k"`

重新配置主题`p10k configure`

# 安装其他工具
```shell
# powerlevel10k主题
git clone https://github.com/romkatv/powerlevel10k.git $ZSH_CUSTOM/themes/powerlevel10k
# zsh-autosuggestions自动提示插件
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# zsh-syntax-highlighting语法高亮插件
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# 下载失败可以尝试以下命令
git clone https://ghproxy.net/https://github.com/romkatv/powerlevel10k.git $ZSH_CUSTOM/themes/powerlevel10k
git clone https://ghproxy.net/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://ghproxy.net/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

# 安装字体
```shell
# 下载字体
wget https://ghfast.top/https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Regular.ttf &&
wget https://ghfast.top/https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold.ttf  &&
wget https://ghfast.top/https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Italic.ttf  &&
wget https://ghfast.top/https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold%20Italic.ttf


# 安装字体
sudo mkdir /usr/share/fonts/truetype/MesloLGS
sudo mv *.ttf /usr/share/fonts/truetype/MesloLGS

# 安装fontconfig工具
sudo apt install fontconfig

# 刷新字体缓存
fc-cache -fv

# 测试字体显示
echo $'\uf115'  # 能打印出文件夹图标则成功
```

# 应用主题和插件
```shell
# 编辑配置文件，修改主题和插件
vim ~/.zshrc

# 修改主题
ZSH_THEME="powerlevel10k/powerlevel10k"

# 启用插件
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
)
```

## 参考
1. [linux 终端美化](https://blog.lololowe.com/posts/dd02/)







