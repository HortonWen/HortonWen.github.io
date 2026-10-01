---
title: "ROS 仿真项目文件结构附录"
published: 2026-07-09
description: "一个基于 ROS Noetic 和 Gazebo 的机器人仿真课程设计的完整文件路径清单，涵盖模型素材、catkin 工作空间、launch 文件和 URDF 描述。"
tags: [ROS, Gazebo, catkin, 课程设计, 文件结构]
category: ROS
draft: false
---


这篇附录记录了一个 ROS + Gazebo 机器人仿真课程设计项目的完整文件结构。项目包含 Gazebo 仿真模型素材和一个完整的 catkin 工作空间，涉及建图、定位、导航等典型功能模块。如果你正在搭建类似的 ROS 仿真项目，这份清单可以作为目录组织的参考。

## 项目根目录总览

项目根目录：`~/`

## Gazebo 仿真模型素材路径

1. 仿真模型总文件夹：`building_editor_models/`
2. 单模型存储目录：`building_editor_models/001/`
3. 模型配置文件：`building_editor_models/001/model.config`
4. 模型几何描述文件：`building_editor_models/001/model.sdf`
5. 独立 Python 脚本：`1.py`

## ROS Catkin 工作空间整体路径

工作空间根目录：`catkin_ws/`

1. 工作空间标识文件：`catkin_ws/.catkin_workspace`
2. 源码总目录：`catkin_ws/src/`
3. 功能包总目录：`catkin_ws/src/ceshi4/`
4. 功能包编译配置文件：`catkin_ws/src/ceshi4/CMakeLists.txt`
5. 功能包依赖配置文件：`catkin_ws/src/ceshi4/package.xml`

### RVIZ 可视化配置文件路径

1. RVIZ 总配置文件夹：`catkin_ws/src/ceshi4/config/`
2. 建图可视化配置：`catkin_ws/src/ceshi4/config/gmapping.rviz`
3. 导航可视化配置：`catkin_ws/src/ceshi4/config/nav.rviz`

### 节点启动 Launch 文件路径

1. Launch 总启动文件夹：`catkin_ws/src/ceshi4/launch/`
2. 基础环境启动文件：`catkin_ws/src/ceshi4/launch/1.launch`
3. AMCL 定位启动文件：`catkin_ws/src/ceshi4/launch/amcl.launch`
4. 障碍物仿真启动文件：`catkin_ws/src/ceshi4/launch/box.launch`
5. GMapping 激光建图启动文件：`catkin_ws/src/ceshi4/launch/gmapping.launch`
6. 地图保存启动文件：`catkin_ws/src/ceshi4/launch/map_save.launch`
7. 地图服务启动文件：`catkin_ws/src/ceshi4/launch/map_server.launch`
8. 自主导航启动文件：`catkin_ws/src/ceshi4/launch/nav.launch`
9. 路径规划启动文件：`catkin_ws/src/ceshi4/launch/path.launch`
10. 机器人整机启动文件：`catkin_ws/src/ceshi4/launch/robot.launch`

### 栅格地图素材路径

1. 地图存储文件夹：`catkin_ws/src/ceshi4/map/`
2. 地图灰度图片：`catkin_ws/src/ceshi4/map/nav.pgm`
3. 地图参数配置文件：`catkin_ws/src/ceshi4/map/nav.yaml`

### Gazebo 仿真世界文件路径

1. 仿真场景文件夹：`catkin_ws/src/ceshi4/worlds/`
2. 仿真场景描述文件：`catkin_ws/src/ceshi4/worlds/1.world`

### 机器人 URDF/Xacro 模型描述文件路径

1. 机器人模型宏文件夹：`catkin_ws/src/ceshi4/xacro/`
2. 场景宏文件：`catkin_ws/src/ceshi4/xacro/1.xacro`
3. 底盘基础宏文件：`catkin_ws/src/ceshi4/xacro/base.xacro`
4. 简化底盘宏文件：`catkin_ws/src/ceshi4/xacro/base1.xacro`
5. 相机传感器宏文件：`catkin_ws/src/ceshi4/xacro/camera.xacro`
6. 副相机传感器宏文件：`catkin_ws/src/ceshi4/xacro/camera1.xacro`
7. 激光雷达宏文件：`catkin_ws/src/ceshi4/xacro/laser.xacro`
8. 副激光雷达宏文件：`catkin_ws/src/ceshi4/xacro/laser1.xacro`
9. 机器人整机描述宏文件：`catkin_ws/src/ceshi4/xacro/robot.xacro`

### 预留文件夹（无文件仅目录）

1. 参数配置目录：`catkin_ws/src/ceshi4/param/`
2. 机器人 URDF 目录：`catkin_ws/src/ceshi4/urdf/`
3. 外部模型存放目录：`catkin_ws/src/ceshi4/models/`

## 小结

- 项目由 Gazebo 仿真模型和 catkin 工作空间两部分组成
- 功能包内按 config、launch、map、worlds、xacro 分目录组织
- launch 文件覆盖了从基础环境到自主导航的完整功能链
- xacro 采用模块化设计，底盘、传感器、整机描述各自独立
