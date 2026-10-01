---
title: "让小车模型在 Gazebo 中成功运行"
published: 2026-07-03
description: "从零搭建一个可在 Gazebo 中运行的差速驱动小车模型，涵盖 URDF/Xacro 编写、Gazebo 插件配置和启动文件创建。"
tags: [Gazebo, URDF, Xacro, 差速驱动, ROS仿真]
category: ROS
draft: false
---


在 ROS 中做机器人仿真，第一步往往是让一个最简单的模型在 Gazebo 里跑起来。本文提供一个完整的差速驱动小车最小可运行示例，包括 URDF/Xacro 模型描述、Gazebo 差速驱动插件、launch 启动文件和手动控制测试方法。所有代码基于 ROS Noetic + Gazebo 环境。

## 准备环境

确保已安装以下软件包：

```bash
sudo apt install ros-noetic-gazebo-ros-pkgs \
                 ros-noetic-ros-control \
                 ros-noetic-ros-controllers
```

这三个包分别提供 Gazebo 与 ROS 的接口、ros_control 框架和常用控制器（包括差速驱动控制器）。

## 创建 ROS 功能包

在 catkin 工作空间的 `src` 目录下创建功能包并编译：

```bash
cd ~/catkin_ws/src
catkin_create_pkg my_car urdf xacro gazebo_ros rospy
cd ..
catkin_make
source devel/setup.bash
```

功能包依赖 `urdf`、`xacro`、`gazebo_ros` 和 `rospy`，涵盖了模型描述和 Gazebo 集成所需的核心组件。

## 编写 URDF 小车模型

创建文件 `my_car/urdf/car.xacro`，定义一个带两个驱动轮的差速小车：

```xml
<?xml version="1.0"?>
<robot name="my_car" xmlns:xacro="http://www.ros.org/wiki/xacro">

  <!-- base link -->
  <link name="base_link">
    <inertial>
      <mass value="5.0"/>
      <origin xyz="0 0 0"/>
      <inertia ixx="0.1" ixy="0" ixz="0"
               iyy="0.1" iyz="0"
               izz="0.1"/>
    </inertial>

    <visual>
      <geometry>
        <box size="0.5 0.3 0.2"/>
      </geometry>
      <material name="blue"/>
    </visual>

    <collision>
      <geometry>
        <box size="0.5 0.3 0.2"/>
      </geometry>
    </collision>
  </link>

  <!-- 左轮 -->
  <link name="left_wheel">
    <visual>
      <geometry>
        <cylinder radius="0.07" length="0.02"/>
      </geometry>
    </visual>
  </link>

  <!-- 右轮 -->
  <link name="right_wheel">
    <visual>
      <geometry>
        <cylinder radius="0.07" length="0.02"/>
      </geometry>
    </visual>
  </link>

  <!-- 左轮关节 -->
  <joint name="left_wheel_joint" type="continuous">
    <parent link="base_link"/>
    <child link="left_wheel"/>
    <origin xyz="0 0.15 -0.05" rpy="1.57 0 0"/>
    <axis xyz="0 0 1"/>
  </joint>

  <!-- 右轮关节 -->
  <joint name="right_wheel_joint" type="continuous">
    <parent link="base_link"/>
    <child link="right_wheel"/>
    <origin xyz="0 -0.15 -0.05" rpy="1.57 0 0"/>
    <axis xyz="0 0 1"/>
  </joint>

</robot>
```

这个模型包含三个 link（底盘、左轮、右轮）和两个 continuous 类型的关节。注意 `base_link` 必须包含 `<inertial>` 标签，否则 Gazebo 可能因质量为零而崩溃。

## 添加 Gazebo 差速驱动插件

URDF 只描述了机器人的几何结构，要让它在 Gazebo 中能动起来，还需要加入差速驱动插件。将以下内容添加到 `<robot>` 标签内部：

```xml
<gazebo>
  <plugin name="diff_drive" filename="libgazebo_ros_diff_drive.so">

    <leftJoint>left_wheel_joint</leftJoint>
    <rightJoint>right_wheel_joint</rightJoint>

    <wheelSeparation>0.3</wheelSeparation>
    <wheelDiameter>0.14</wheelDiameter>

    <commandTopic>cmd_vel</commandTopic>
    <odometryTopic>odom</odometryTopic>

    <robotBaseFrame>base_link</robotBaseFrame>

    <publishWheelTF>true</publishWheelTF>
    <publishOdom>true</publishOdom>

    <updateRate>50</updateRate>
  </plugin>
</gazebo>
```

关键参数说明：

- `leftJoint` / `rightJoint`：对应 URDF 中定义的关节名称，必须完全一致
- `wheelSeparation`：两轮间距，应与 URDF 中关节的 y 轴偏移量匹配
- `wheelDiameter`：轮子直径，应与 URDF 中圆柱体的半径×2 一致
- `commandTopic`：接收速度指令的话题名，通常为 `cmd_vel`
- `odometryTopic`：发布里程计数据的话题名
- `publishOdom`：设为 `true` 才会发布 `/odom` 话题

## 创建 Launch 启动文件

创建文件 `my_car/launch/car_gazebo.launch`：

```xml
<launch>

  <!-- 启动 Gazebo 空世界 -->
  <include file="$(find gazebo_ros)/launch/empty_world.launch"/>

  <!-- 上传机器人模型到参数服务器 -->
  <param name="robot_description"
         command="$(find xacro)/xacro '$(find my_car)/urdf/car.xacro'"/>

  <!-- 在 Gazebo 中生成模型 -->
  <node name="spawn_urdf" pkg="gazebo_ros" type="spawn_model"
        args="-param robot_description -urdf -model my_car"
        output="screen"/>

  <!-- 发布 TF 变换 -->
  <node name="robot_state_publisher"
        pkg="robot_state_publisher"
        type="robot_state_publisher"/>
</launch>
```

这个 launch 文件依次完成三件事：启动 Gazebo 仿真器、将 Xacro 模型解析后上传到 ROS 参数服务器、在 Gazebo 场景中生成机器人实例，最后启动 `robot_state_publisher` 节点来发布各 link 之间的 TF 变换。

## 启动并控制小车

先启动仿真：

```bash
roslaunch my_car car_gazebo.launch
```

Gazebo 窗口打开后，另开一个终端发送速度指令测试：

```bash
rostopic pub /cmd_vel geometry_msgs/Twist "
linear:
  x: 0.5
angular:
  z: 0.2"
```

如果一切正常，小车会在 Gazebo 场景中向前移动并带有轻微转向。

## 常见问题排查

### 小车不动

逐项检查：

- URDF 中的 joint 名称与插件中的 `leftJoint`/`rightJoint` 是否完全一致
- 插件是否被正确加载（查看启动时的终端输出有无报错）
- `/cmd_vel` 话题是否有数据到达：`rostopic echo /cmd_vel`

### Gazebo 崩溃或模型飞走

最常见的原因是惯性参数不合理：

- `base_link` 的 `<inertial>` 不能缺失，质量值也不能为 0
- 每个参与物理仿真的 link 都应有 `<collision>` 标签

### 里程计不更新

确认插件配置中 `<publishOdom>true</publishOdom>` 已设置，然后用 `rostopic echo /odom` 验证是否有数据输出。

## 后续扩展方向

当基础模型能正常运行后，可以逐步添加更多传感器和功能：

- **激光雷达**：使用 `<sensor type="ray">` 配合 Gazebo ray sensor 插件
- **相机**：使用 Gazebo camera plugin
- **IMU**：使用 imu sensor plugin
- **SLAM 建图**：接入 gmapping 或 cartographer
- **自主导航**：配置 move_base 导航栈

这些都是在同一个 URDF/Xacro 模型基础上逐步叠加的，核心框架不变。

## 小结

- 差速小车模型由 base_link + 两个轮子 link + 两个 continuous joint 构成
- Gazebo 差速驱动插件是让模型动起来的关键，关节名称和几何参数必须与 URDF 一致
- launch 文件负责串联 Gazebo 启动、模型上传和节点运行
- 惯性参数和碰撞体是物理仿真稳定的前提，不可省略
- 通过 `/cmd_vel` 话题即可手动验证小车运动是否正常
