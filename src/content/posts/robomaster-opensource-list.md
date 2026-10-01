---
title: "机甲大师开源列表"
published: 2026-08-13
description: "汇总各战队、个人开发者、DJI 官方与第三方公司在 GitHub、Gitee 和 RoboMaster 论坛公开的代码、图纸与项目，收录 82 支战队、25 位个人开发者、387 个公开仓库。"
tags: [机甲大师, RoboMaster, 开源, 机器人, 资源汇总]
category: 机甲大师
draft: false
---

这是我维护的 RoboMaster 开源资源目录，汇总各战队、个人开发者、DJI 官方与第三方公司在 GitHub、Gitee 和 RoboMaster 论坛公开的代码、图纸与项目。目录只做分类整理，不排名、不比较战队，方便按方向找到能直接参考的东西。

## 数据概览

| 指标 | 数值 | 说明 |
|------|------|------|
| 收录战队 | 82 | 有公开仓库或论坛开源记录的战队 |
| 个人开发者 | 25 | 独立维护 RoboMaster 相关项目的开发者 |
| 仓库总数 | 387 | GitHub + Gitee 公开仓库 |
| 新手友好 | 39 | 入门教程 / 例程，适合刚接触 |
| 成熟项目 | 67 | 高 Star 或官方 / 框架级，适合直接参考 |

## 按方向分布

| 方向 | 数量 |
|------|------|
| 通用 | 149 |
| 视觉 | 78 |
| ROS | 39 |
| 嵌入式 | 35 |
| 电控 | 24 |
| 机械 | 15 |
| 教程 | 14 |
| 官方 SDK | 13 |
| 仿真 | 11 |
| 工具 | 9 |

## 目录结构

- **官方资源（DJI / RoboMaster）**：开发板例程、Python / C SDK、RoboRTS、裁判系统串口协议等
- **第三方公司**：天之博特等公司的 ROS 学习平台、TT 驱动、语音交互模块
- **社区框架与工具**：视觉 / 电控 / 仿真 / SDK 方向的开源框架和轮子
- **机械 / 图纸 / 结构**：SolidWorks 设计、公开 CAD、轮腿 / 云台等结构
- **战队开源（按学校）**：82 支战队的整队代码与分系统代码
- **个人开源贡献**：25 位开发者的项目，按作者分列
- **论坛开源帖**：RoboMaster 论坛开源专栏的优质帖子

## 代表性条目

### 官方资源

- `dji-sdk/RoboMaster-SDK` — DJI RoboMaster Python SDK（EP）及示例
- `RoboMaster/Development-Board-C-Examples` — C 型开发板例程
- `RoboMaster/DevelopmentBoard-Examples` — 开发板例程（C++）
- `RoboMaster/RoboRTS-Firmware` — RoboRTS 步兵控制固件
- `RoboMaster/referee_serial_port_protocol` — 裁判系统串口协议文档与示例

### 视觉 / 控制 / 仿真

- `chenjunnn/rm_vision` — 视觉 ROS2 框架
- `NeoZng/vision_tutorial` — 视觉入门教程
- `rm-controls/rm_control` — 基于 ros-controls 的硬件 / 仿真接口
- `HNUYueLuRM/basic_framework` — 电控开发框架（湖大跃鹿）
- `yizhengzhang1/RoboMaster-Simulator` — ICRA AI Challenge 模拟器（Gazebo）
- `Blackjack200/at_vision_simulator` — 视觉算法验证模拟器

### 战队与个人开源

- `TongjiSuperPower/sp_vision_25` — 同济 SuperPower 25 赛季视觉框架
- `SEU-SuperNova-CVRA/Robomaster2018-SEU-OpenSource` — 东南大学 2018 赛季开源
- `SMBU-PolarBear-Robotics-Team/pb2025_sentry_nav` — 深北莫北极熊 25 赛季哨兵导航
- `zzt-180/sentry_planning` — 哈尔滨工业大学 2024 哨兵自主导航规划
- `QunShanHe/JLURoboVision` — 吉林大学 TARS-GO 2020 视觉
- `Polyacetone/HWSentryNav26` — 浙江大学 Hello World 26 赛季轮腿哨兵导航

## 更新机制

- 目录由脚本定期抓取 GitHub、Gitee 与 RoboMaster 论坛的公开数据，生成 `data.js` 快照和 `open-source-solutions.md` 两个版本，再由页面纯静态展示，打开即用、无需服务器
- 已取消排名机制，只做分类，不再对战队比较、打分或排序
- 官方账号、商业公司、社区项目与战队 / 个人分列展示，不混排
- 没有公开仓库或论坛帖记录的战队，统一列在页面末尾的「未收录战队」清单里

## 小结

- 收录了 82 支战队、25 位个人开发者共 387 个公开仓库
- 按通用、视觉、ROS、嵌入式、电控、机械等 10 个方向分类
- 官方 SDK、社区框架、战队代码、机械图纸与论坛帖全部覆盖
- 发现漏收、错误或新开源项目，欢迎到仓库提 Issue 或直接提 PR 补充
