---
title: "YOLOv8 在 Windows 下的 Conda 完整安装教程"
published: 2026-07-06
description: "从零搭建 YOLOv8 Windows 开发环境：涵盖 Conda 虚拟环境创建、PyTorch GPU/CPU 安装、Ultralytics 包部署及常见报错修复，三种安装方式任选。"
tags: [YOLOv8, Ultralytics, Conda, PyTorch, Windows, 环境配置]
category: 机甲大师
draft: false
---


YOLOv8 是目前目标检测领域最常用的框架之一，但在 Windows 上安装时，Python 版本不匹配、镜像源 SSL 报错、命令行找不到等问题经常让新手卡住。本文整理了三种经过验证的安装方式（pip 一键安装、本地源码安装、Git 在线拉取），并附上实际遇到的报错解决方案，帮你一次性把环境搭好。

## 前置环境要求

在开始安装之前，请确认以下三点：

1. **Python 版本**：推荐 **3.9 ~ 3.11**。Python 3.14 兼容性差，极易出现依赖报错，不建议使用。
2. **显卡**：NVIDIA 显卡支持 GPU 加速；无 N 卡则仅能 CPU 推理，功能不受影响。
3. **路径规范**：所有相关文件夹的路径全程**无中文、无空格**，不要放在中文目录下，否则后续编译和运行都可能出错。

## 方式一：Pip 一键安装（新手首选）

如果不需要修改 YOLO 源码，直接用 pip 安装是最省心的方式。整个过程分四步走。

### 步骤 1：创建独立虚拟环境

隔离依赖是避免版本冲突的关键。打开 Anaconda Prompt 执行：

```bash
# 创建名为 yolov8、Python 3.10 的环境
conda create -n yolov8 python=3.10 -y
# 激活环境
conda activate yolov8
```

### 步骤 2：安装 PyTorch

根据你的硬件选择对应命令。**有 NVIDIA 显卡**（RTX30/40/50 系，CUDA 11.8 通用）：

```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

**无独立显卡，仅 CPU 运行**：

```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

### 步骤 3：安装 Ultralytics 核心包

这一步安装的是 YOLOv8 / YOLO11 的统一框架。如果使用清华镜像源曾遇到 SSL 报错，建议直接使用官方 PyPI 源：

```bash
pip install ultralytics -i https://pypi.org/simple --trusted-host pypi.org --trusted-host files.pythonhosted.org
```

### 步骤 4：验证安装

```bash
# 查看版本，出现版本号即安装成功
yolo version
# 一键运行官方测试图（自动下载 yolov8n.pt）
yolo predict model=yolov8n.pt source=bus.jpg
```

> **提示**：此方式安装后，`yolo` 命令全局可用，不会出现 `'yolo' is not recognized` 的报错。

## 方式二：本地源码安装（适合二次开发）

如果你已经下载了 Ultralytics 源码并需要修改代码，可以用本地安装。这里分两种模式。

### 标准安装

将源码打包安装到环境中，修改源码后需要重新安装：

```bash
# 进入源码根目录（替换为你的实际路径）
cd <你的ultralytics源码路径>
# 使用官方源安装，规避 SSL 报错
pip install . -i https://pypi.org/simple --trusted-host pypi.org
```

### 可编辑开发模式（推荐）

带 `-e` 参数以软链接方式安装，修改代码后实时生效，无需反复重装：

```bash
cd <你的ultralytics源码路径>
pip install -e . -i https://pypi.org/simple --trusted-host pypi.org
```

安装完成后，退出当前目录，在任意位置验证：

```bash
cd ..
yolo predict model=yolov8n.pt source="./ultralytics/assets/bus.jpg"
```

## 方式三：Git 在线拉取最新源码

如果本地没有源码文件夹，可以直接从 GitHub 拉取最新的开发版。确保已安装 Git 工具后执行：

```bash
conda activate yolov8
pip install git+https://github.com/ultralytics/ultralytics.git@main -i https://pypi.org/simple --trusted-host pypi.org
```

这种方式获取的是 main 分支的最新代码，可能包含尚未正式发布的功能和修复。

## 常见报错修复

安装过程中难免遇到问题，以下是几种高频报错及对应的解决办法。

### `'yolo' is not recognized as an internal or external command`

原因是当前虚拟环境中未安装 ultralytics，系统找不到 `yolo` 脚本。执行上述任意一种安装命令，安装完成后**重启终端**即可。

### 清华源 SSL 连接中断 / SSLEOFError

直接放弃清华镜像源，全程使用官方 PyPI 源。在所有 pip 命令后追加参数：

```bash
-i https://pypi.org/simple --trusted-host pypi.org --trusted-host files.pythonhosted.org
```

### 本地源码安装提示找不到 setuptools

先手动安装指定版本的 setuptools，再执行源码安装：

```bash
pip install "setuptools>=70.0.0,<=82.0.1" -i https://pypi.org/simple --trusted-host pypi.org
pip install -e .
```

### Python 3.14 版本依赖不兼容

新建一个 Python 3.10 的虚拟环境来运行 YOLO，不要在 base 环境的高版本 Python 下强行安装。

## 安装完成后的标准推理命令

环境搭好后，用以下命令即可运行目标检测推理：

```bash
yolo task=detect mode=predict model=yolov8n.pt source="./ultralytics/assets/bus.jpg"
```

注意参数拼写：是 `source` 而非 `soure`。推理结果会自动保存至 `runs/detect/predict` 文件夹。

## 小结

- **环境隔离**是第一原则：始终用 Conda 创建独立虚拟环境，避免污染 base 环境。
- **Python 版本选 3.9 ~ 3.11**，避开 3.14 等高版本的兼容性问题。
- **pip 源优先用官方 PyPI**，清华源的 SSL 问题目前没有稳定解法。
- 三种安装方式按需选择：日常使用选 pip 一键安装，二次开发选 `-e` 可编辑模式，追新选 Git 拉取。
- 遇到报错先检查虚拟环境是否激活、Python 版本是否正确，大部分问题都出在这两点上。
