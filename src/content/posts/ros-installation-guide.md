---
title: "ROS Noetic 安装与配置指南"
published: 2026-07-06
description: "在 Ubuntu 20.04 上安装 ROS Noetic Desktop-Full 的完整流程，包括软件源配置、rosdep 初始化及国内网络问题的解决方案。"
tags: [ROS, Noetic, Ubuntu, rosdep, 开发环境]
category: ROS
draft: false
---


Ubuntu 系统就绪后，下一步就是安装 ROS（Robot Operating System）。本文以 ROS Noetic（对应 Ubuntu 20.04）为例，从软件源配置到环境变量设置，完整走一遍安装流程，并重点记录 rosdep 初始化时常见的网络问题及其解决办法。

## 配置 Ubuntu 软件和更新

安装 ROS 前需要确保 Ubuntu 允许从更多软件源安装软件。打开「软件和更新」对话框（在应用搜索栏中搜索即可），确认以下选项已勾选：

- `restricted`
- `universe`
- `multiverse`

![Ubuntu 软件和更新设置](https://www.autolabor.com.cn/book/ROSTutorials/assets/00ROS%E5%AE%89%E8%A3%85%E4%B9%8Bubuntu%E5%87%86%E5%A4%87.png "00ROS安装之ubuntu准备")

这些仓库包含了 ROS 依赖的部分第三方库，缺少任何一个都可能导致后续安装失败。

## 设置安装源

ROS 官方默认源在国外，国内用户建议使用镜像加速。以下三种任选其一：

**官方源：**

```bash
sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
```

**清华镜像（推荐）：**

```bash
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.tuna.tsinghua.edu.cn/ros/ubuntu/ `lsb_release -cs` main" > /etc/apt/sources.list.d/ros-latest.list'
```

**中科大镜像：**

```bash
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.ustc.edu.cn/ros/ubuntu/ `lsb_release -cs` main" > /etc/apt/sources.list.d/ros-latest.list'
```

执行后可能需要输入管理员密码。建议优先使用国内镜像，下载速度会快很多。

## 设置密钥

添加 ROS 软件源的 GPG 密钥，用于验证软件包的完整性：

```bash
sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
```

## 安装 ROS

先更新软件包索引：

```bash
sudo apt update
```

然后安装 ROS Noetic Desktop-Full 版本。这是官方推荐的完整安装，包含 ROS 核心、rqt、rviz、通用机器人库、2D/3D 仿真器、导航和感知模块：

```bash
sudo apt install ros-noetic-desktop-full
```

这一步耗时较长，取决于网络速度。如果中途因网络超时失败，可以重复执行 `apt update` 和 `apt install` 命令，已下载的包会被缓存，不会从头开始。安装异常的典型报错界面如下：

![安装异常报错界面](https://www.autolabor.com.cn/book/ROSTutorials/assets/09_%E5%AE%89%E8%A3%85%E5%BC%82%E5%B8%B8.PNG "09_安装异常")

## 配置环境变量

安装完成后，需要将 ROS 的环境变量写入 shell 配置文件，这样每次打开终端都能直接使用 ROS 命令：

```bash
echo "source /opt/ros/noetic/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

配置生效后，在任意终端中输入 `rosversion -d` 应返回 `noetic`。

## 卸载 ROS（如需）

如果需要完全移除 ROS：

```bash
sudo apt remove ros-noetic-*
```

## 安装构建依赖与初始化 rosdep

Noetic 最初发布时没有要求安装构建依赖，但后续官方补齐了这一步。先安装相关工具：

```bash
sudo apt install python3-rosdep python3-rosinstall python3-rosinstall-generator python3-wstool build-essential
```

然后初始化 rosdep。rosdep 是 ROS 的系统依赖管理工具，许多 ROS 工具在运行前都需要它：

```bash
sudo rosdep init
rosdep update
```

如果一切顺利，两条命令都会正常输出完成信息。

<!-- TODO: 图片 rosdep正常初始化.PNG 未随稿搬运，需手动补 -->
<!-- TODO: 图片 rosdep正常更新.PNG 未随稿搬运，需手动补 -->

### rosdep 初始化失败的解决

在国内网络环境下，`sudo rosdep init` 大概率会报错，原因是 rosdep 默认从 `raw.githubusercontent.com` 拉取资源，而该域名在国内经常无法访问。

<!-- TODO: 图片 noetic异常提示.PNG 未随稿搬运，需手动补 -->

解决思路是将相关资源备份到 Gitee，然后修改 rosdep 源码中的 URL 指向。具体步骤如下：

**第一步**，打开 Gitee 上的资源备份仓库（如 `https://gitee.com/zhao-xuzuo/rosdistro`），找到 `rosdep/sources.list.d/20-default.list` 文件，记下其中的 Gitee URL 格式，例如 `gitee.com/zhao-xuzuo/rosdistro/raw/master`。

<!-- TODO: 图片 gitee资源.PNG 未随稿搬运，需手动补 -->

**第二步**，查找 rosdep 安装目录中包含 `raw.githubusercontent` 的文件：

```bash
cd /usr/lib/python3/dist-packages/
find . -type f | xargs grep "raw.githubusercontent"
```

<!-- TODO: 图片 noetic_查找包含githubusercontent的文件.PNG 未随稿搬运，需手动补 -->

**第三步**，逐个修改找到的文件（通常包括 `rosdistro/__init__.py`、`rosdep2/gbpdistro_support.py`、`rosdep2/sources_list.py`、`rosdep2/rep3.py`），将其中的 `raw.githubusercontent.com/ros/rosdistro/master` 替换为 Gitee 对应的 URL。可以使用 `sudo gedit` 或其他编辑器打开修改。

**第四步**，重新执行初始化和更新：

```bash
sudo rosdep init
rosdep update
```

此时应该能正常完成。

## 小结

- 推荐使用国内镜像源（清华或中科大）加速下载
- Desktop-Full 是最完整的安装选项，适合初学者
- 环境变量必须写入 `~/.bashrc`，否则每次开终端都要手动 source
- rosdep 初始化失败是国内用户的常见问题，通过替换 Gitee 资源可解决
- 参考文档：[ROS Noetic 官方安装指南](http://wiki.ros.org/noetic/Installation/Ubuntu)
