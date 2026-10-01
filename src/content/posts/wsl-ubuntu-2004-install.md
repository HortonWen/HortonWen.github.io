---
title: "WSL 安装 Ubuntu 20.04 LTS 完整指南"
published: 2026-07-06
description: "在 Windows 上通过 WSL 安装 Ubuntu 20.04 LTS 的三种方案及常见问题解决，涵盖一键命令、微软商店和手动分步安装。"
tags: [WSL, Ubuntu, Windows, 开发环境, Linux]
category: ROS
draft: false
---


搭建 ROS 开发环境的第一步，是在 Windows 上获得一个可用的 Ubuntu 系统。WSL（Windows Subsystem for Linux）让你无需双启动或虚拟机就能直接使用 Linux 命令行工具。本文整理了三种安装 Ubuntu 20.04 LTS 的方案，并附上安装后的基础配置和常见报错解决方法。

## 方案一：一键命令安装（推荐）

适用于 Windows 10 2004 及以上版本和 Windows 11，是最省心的方式。

以管理员身份打开 Windows 终端或 PowerShell，执行：

```powershell
wsl --install -d Ubuntu-20.04
```

这条命令会自动完成以下操作：启用 WSL 功能、启用虚拟机平台、安装 WSL2 内核、下载 Ubuntu 20.04 镜像，并默认以 WSL2 模式运行。

执行完毕后系统会提示重启，**务必重启**。重启后会自动弹出 Ubuntu 初始化窗口，按提示设置用户名和密码即可（密码输入时不会显示字符，属正常现象）。

验证安装是否成功：

```cmd
wsl -l -v
```

列表中应出现 `Ubuntu-20.04`，且 VERSION 列为 `2`，表示运行在 WSL2 模式下。

### 下载慢或卡在 0% 的备用方案

如果默认下载通道速度过慢，可以切换到独立下载通道：

```powershell
wsl --install --web-download -d Ubuntu-20.04
```

### 查看所有可安装的 Linux 发行版

```powershell
wsl --list --online
```

## 方案二：微软商店图形化安装

如果不习惯命令行，也可以通过 Microsoft Store 完成：

1. 打开 Microsoft Store，搜索 `Ubuntu 20.04 LTS`
2. 点击「获取 / 安装」
3. 安装完成后从开始菜单打开「Ubuntu 20.04」，按提示初始化账号密码

这种方式本质上与命令安装效果相同，只是下载过程有图形进度条。

## 方案三：手动分步安装（旧版 Windows 10 兼容）

如果你的 Windows 10 版本较旧，一键命令不可用，可以手动逐步开启所需功能。

以管理员身份打开 PowerShell，依次执行：

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

重启电脑后，设置默认 WSL 版本为 2：

```powershell
wsl --set-default-version 2
```

最后安装 Ubuntu 20.04：

```powershell
wsl --install -d Ubuntu-20.04
```

## 安装完成后的基础配置

进入 Ubuntu 终端，先更新软件源和已安装的包：

```bash
sudo apt update && sudo apt upgrade -y
```

这一步能确保系统拿到最新的安全补丁和软件版本，建议每次新装系统后都执行一次。

## 常用启动与管理命令

日常使用中，以下命令会频繁用到：

```cmd
# 直接启动 Ubuntu 20.04
wsl -d Ubuntu-20.04

# 将 Ubuntu 20.04 设为默认 WSL 发行版
wsl --set-default Ubuntu-20.04
```

设为默认后，直接输入 `wsl` 即可进入 Ubuntu，无需每次指定发行版名称。

## 常见报错与解决

**报错：`wsl: 请求的分发版不存在`**

发行版名称严格区分大小写，必须写 `Ubuntu-20.04`，不能简写为 `ubuntu` 或 `Ubuntu20.04`。

**报错：虚拟化相关错误**

需要重启进入 BIOS，开启 Intel VT-x 或 AMD SVM 虚拟化支持。不同主板进入 BIOS 的方式不同，一般在开机时按 F2、Del 或 F10。

**代理配置**

如果 Windows 端使用了代理软件，WSL 内的网络请求默认不走代理。需要在 Ubuntu 内手动配置：

```bash
echo 'export HTTP_PROXY=http://host.docker.internal:7890' >> ~/.bashrc
echo 'export HTTPS_PROXY=http://host.docker.internal:7890' >> ~/.bashrc
source ~/.bashrc
```

其中端口号 `7890` 需替换为你实际使用的代理软件端口。`host.docker.internal` 是 WSL2 访问宿主机服务的特殊域名。

## 确认 Ubuntu 版本

安装完成后可以验证版本是否正确：

```bash
lsb_release -d
```

预期输出类似：`Description: Ubuntu 20.04.6 LTS`。

## 小结

- 推荐使用 `wsl --install -d Ubuntu-20.04` 一键安装，简单高效
- 安装后务必执行 `apt update && apt upgrade` 更新系统
- 遇到下载慢可用 `--web-download` 切换下载通道
- 虚拟化报错需检查 BIOS 设置
- 代理配置通过 `host.docker.internal` 桥接宿主机
