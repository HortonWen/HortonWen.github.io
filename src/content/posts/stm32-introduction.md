---
title: "STM32 入门：教程资源与开发环境"
published: 2026-07-24
description: "记录 STM32 入门的教程资源与开发环境：B 站 keysking 的 STM32 教程系列与配套文档、开发板，以及 STM32CubeMX + Keil μ5 与 STM32CubeIDE 两条环境路线。"
tags: [STM32, 入门, STM32CubeMX, Keil, STM32CubeIDE]
category: STM32
draft: false
---


刚接触 STM32 时，最大的困惑往往不是芯片本身，而是"跟着谁学、用什么工具写"。这篇笔记整理了入门阶段用到的教程资源（B 站 keysking 的 STM32 教程系列，动画 + 实战风格，配套文档与开发板）和对应的开发环境（STM32CubeMX + Keil μ5、STM32CubeIDE 两条路线），作为上手的第一份索引。

## 教程资源

入门用的是 B 站 UP 主 keysking 的 STM32 教程系列。置顶的第 0 集《超易懂的 STM32 教程！！》（2023-01-14 发布，播放量 114.6 万）介绍了整套教程的安排，后续章节围绕"STM32 急速入门"展开，风格是动画 + 实战，目标是把环境搭建到外设开发讲得容易上手。

教程配套的文档网站是"波特律动"（docs.keysking.com），开发板也从"波特律动"获取（某宝搜索"波特律动"），视频下方还会不定期更新开发环境的补充说明。

![keysking 的 STM32 教程系列主页](/images/stm32-intro-01.webp)

## 开发环境

教程配套的开发环境有两条路线：

- **STM32CubeMX + Keil μ5**：先用 STM32CubeMX 图形化配置引脚和时钟、生成初始化工程，再用 Keil μ5 编写代码、编译下载，这是很多教程采用的主流组合。
- **STM32CubeIDE**：ST 官方的一体化 IDE，把配置、编码、编译、调试集成在一个软件里，免去在多个工具间切换。

![STM32 开发环境：STM32CubeMX + Keil 与 STM32CubeIDE](/images/stm32-intro-02.webp)

两条路线选哪条都可以，关键是先把环境装好、跑通第一个点灯程序，再逐步深入外设与工程结构。

## 小结

- 入门教程：keysking 的 STM32 教程系列（B 站，动画 + 实战），配套文档与开发板见"波特律动"。
- 开发环境：STM32CubeMX + Keil μ5 组合，或直接使用 STM32CubeIDE 一体化工具。
- 上手路径：先装好环境、跑通点灯，再按系列教程逐步深入。
