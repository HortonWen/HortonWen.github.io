---
title: "ROS HelloWorld 实现简介：工作空间与功能包"
published: 2026-07-04
description: "从零创建 ROS 工作空间和功能包的通用流程，为后续编写 C++ 或 Python 节点打下基础。"
tags: [ROS, catkin, 工作空间, 功能包, HelloWorld]
category: ROS
draft: false
---


学习任何编程语言都从 HelloWorld 开始，ROS 也不例外。不过在 ROS 中写一个 HelloWorld 之前，需要先理解两个核心概念：工作空间（Workspace）和功能包（Package）。本文介绍创建它们的通用步骤，这些步骤对 C++ 和 Python 实现都适用。

## ROS 程序的一般实现流程

无论使用 C++ 还是 Python，ROS 程序的实现流程大致相同：

1. 创建一个工作空间
2. 在工作空间中创建一个功能包
3. 编辑源代码文件
4. 编辑配置文件（CMakeLists.txt / package.xml）
5. 编译并执行

其中第 3、4 步因语言不同而有差异，其余步骤完全一致。下面先完成通用的前两步。

## 创建工作空间并初始化

```bash
mkdir -p 自定义空间名称/src
cd 自定义空间名称
catkin_make
```

第一条命令创建工作空间目录及其下的 `src` 子目录。`src` 是存放功能包源码的标准位置。进入工作空间后执行 `catkin_make`，它会生成 `build/`、`devel/` 等构建产物目录，并初始化 catkin 构建系统。

编译成功后，工作空间的目录结构大致如下：

```text
自定义空间名称/
├── build/
├── devel/
└── src/
    └── CMakeLists.txt
```

## 创建功能包并添加依赖

进入 `src` 目录，使用 `catkin_create_pkg` 创建功能包：

```bash
cd src
catkin_create_pkg 自定义ROS包名 roscpp rospy std_msgs
```

这条命令会生成一个以指定名称命名的功能包目录，并自动创建 `CMakeLists.txt` 和 `package.xml` 两个配置文件。三个依赖项的含义分别是：

- **roscpp**：C++ 实现的 ROS 客户端库，追求高性能时使用
- **rospy**：Python 实现的 ROS 客户端库，开发效率高，适合快速原型和对性能要求不高的场景
- **std_msgs**：标准消息类型库，包含 String、Int32 等基础消息定义

创建 ROS 功能包时一般都会同时依赖这三个库，即使你只打算用其中一种语言。

## C++ 与 Python 的选择

虽然同一个功能可以用两种语言互换实现，但选择哪种取决于具体需求：

- **C++**（roscpp）：运行效率高，适合对实时性有要求的节点，如传感器驱动、运动控制
- **Python**（rospy）：编码效率高，适合逻辑验证、数据处理、调试工具等场景

两者互补的特点正是 ROS 同时维护两套客户端库的原因。在实际项目中，混合使用也很常见——底层驱动用 C++ 保证性能，上层逻辑用 Python 加速开发。

## 小结

- 工作空间是 ROS 项目的顶层容器，`src/` 下存放所有功能包源码
- `catkin_make` 负责编译整个工作空间，首次执行即完成初始化
- 功能包通过 `catkin_create_pkg` 创建，通常依赖 roscpp、rospy 和 std_msgs
- C++ 和 Python 各有适用场景，实际项目中常混合使用
